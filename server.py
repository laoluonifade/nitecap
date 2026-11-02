"""Stateless Nitecap checkout: Paystack retains signed order records."""
import hashlib
import hmac
import json
import mimetypes
import os
from pathlib import Path
import re
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).parent / "outputs"
PRODUCTS = [
    ("mojito-mood", "Mojito Mood", "Cocktail", "mojito-mood.jpg"),
    ("pine-express", "Pine Express", "Cocktail", "pineapple-express.jpg"),
    ("strawberry-rush", "Strawberry Rush", "Cocktail", "strawberry-bliss.jpg"),
    ("passion-star", "Passion Star", "Cocktail", "pornstar-martini.jpg"),
    ("long-nite", "Long Nite", "Cocktail", "long-island.jpg"),
    ("strawberry-bliss", "Strawberry Bliss", "Mocktail", "strawberry-bliss.jpg"),
]
CATALOG = {p[0]: p for p in PRODUCTS}
PRICE = 500000  # kobo; never accept prices from the browser


class Problem(Exception):
    def __init__(self, message, status=400):
        self.message, self.status = message, status
        self.reference = None


def fulfilment():
    try:
        options = json.loads(os.environ.get("FULFILMENT_OPTIONS", '[{"id":"delivery","label":"Delivery — no delivery fee","fee_naira":0,"requires_address":true}]'))
        assert isinstance(options, list) and len(options) <= 30
        seen = set()
        for option in options:
            assert re.fullmatch(r"[a-z0-9-]{1,50}", option["id"])
            assert option["id"] not in seen
            seen.add(option["id"])
            assert isinstance(option["label"], str) and 1 <= len(option["label"]) <= 250
            assert type(option["fee_naira"]) is int and 0 <= option["fee_naira"] <= 100000
            assert type(option["requires_address"]) is bool
        return options
    except (ValueError, KeyError, TypeError, AssertionError):
        raise Problem("Fulfilment is temporarily unavailable. Please contact Nitecap.", 503)


def ready():
    return (os.environ.get("CHECKOUT_ENABLED") == "true"
            and os.environ.get("PAYSTACK_SECRET_KEY", "").startswith(("sk_test_", "sk_live_"))
            and os.environ.get("SITE_URL", "").startswith("https://")
            and len(os.environ.get("ADMIN_TOKEN", "")) >= 32
            and len(os.environ.get("ORDER_SIGNING_KEY", "")) >= 32
            and bool(fulfilment()))


def text_field(data, key, maximum, minimum=1):
    value = data.get(key, "")
    if not isinstance(value, str) or not minimum <= len(value.strip()) <= maximum:
        raise Problem("Please check your " + key.replace("_", " ") + ".")
    return value.strip()


def validate(payload):
    if not isinstance(payload, dict):
        raise Problem("Invalid order.")
    customer = payload.get("customer")
    if not isinstance(customer, dict):
        raise Problem("Please enter your contact details.")
    customer = {"name": text_field(customer, "name", 120, 2),
                "email": text_field(customer, "email", 254),
                "phone": text_field(customer, "phone", 30)}
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", customer["email"]):
        raise Problem("Please enter a valid email address.")
    if not re.fullmatch(r"\+?[0-9 ()-]{7,30}", customer["phone"]):
        raise Problem("Please enter a valid phone number.")
    if payload.get("age_confirmed") is not True:
        raise Problem("Please confirm that you are 18 or older.")
    items = payload.get("items")
    if not isinstance(items, list) or not 1 <= len(items) <= len(PRODUCTS):
        raise Problem("Please add at least one can.")
    clean, seen, count = [], set(), 0
    for item in items:
        if not isinstance(item, dict):
            raise Problem("Invalid item.")
        product, quantity = item.get("id"), item.get("quantity")
        if not isinstance(product, str) or product not in CATALOG or product in seen:
            raise Problem("Invalid product selection.")
        if type(quantity) is not int or not 1 <= quantity <= 1000:
            raise Problem("Please use whole quantities from 1 to 1,000.")
        count += quantity
        seen.add(product)
        clean.append({"id": product, "name": CATALOG[product][1], "quantity": quantity,
                      "unit_price": PRICE})
    if count > 1000:
        raise Problem("For more than 1,000 cans, please contact Nitecap.")
    option = next((o for o in fulfilment() if o["id"] == payload.get("fulfilment_id")), None)
    if option is None:
        raise Problem("Please select an available delivery or pickup option.")
    address = text_field(payload, "address", 600, 5 if option["requires_address"] else 0)
    notes = text_field(payload, "notes", 600, 0)
    amount = count * PRICE + option["fee_naira"] * 100
    return {"customer": customer, "items": clean, "fulfilment": option,
            "address": address, "notes": notes}, amount


def paystack(path, payload=None, missing_ok=False):
    req = Request("https://api.paystack.co" + path,
                  data=json.dumps(payload).encode() if payload is not None else None,
                  headers={"Authorization": "Bearer " + os.environ["PAYSTACK_SECRET_KEY"],
                           "Content-Type": "application/json",
                           "User-Agent": "NitecapCheckout/1.0 (+https://nitecapcocktail.com)"})
    try:
        with urlopen(req, timeout=18) as response:
            result = json.load(response)
        if result.get("status") is not True:
            raise ValueError()
        return result
    except HTTPError as error:
        body = error.read()
        if error.code == 403:
            try:
                provider_message = json.loads(body).get("message", "")
            except ValueError:
                provider_message = "non-JSON gateway response"
            # Diagnostic category only; never print API keys or request/customer data.
            category = next((word for word in ("ip", "permission", "key", "disabled", "blocked") if word in str(provider_message).lower()), "gateway")
            print("Paystack forbidden category: " + category, flush=True)
        if missing_ok and error.code in (400, 404):
            try:
                message = json.loads(body).get("message", "").lower()
            except (ValueError, AttributeError):
                message = ""
            if error.code == 404 or ("not found" in message or "invalid transaction reference" in message):
                return None
        print("Paystack request rejected: HTTP {} on {}".format(error.code, "verification" if path.startswith("/transaction/verify/") else "initialization"), flush=True)
        raise Problem("Paystack could not complete the request. Please check payment status before retrying.", 502)
    except (URLError, ValueError, TimeoutError):
        raise Problem("Could not reach Paystack. Please check payment status before retrying.", 502)


def signature(record):
    key = os.environ.get("ORDER_SIGNING_KEY", "")
    if len(key) < 32:
        raise Problem("Checkout is not configured.", 503)
    canonical = json.dumps(record, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hmac.new(key.encode(), canonical.encode(), hashlib.sha256).hexdigest()


def extract(payment):
    metadata = payment.get("metadata")
    if isinstance(metadata, str):
        try:
            metadata = json.loads(metadata)
        except ValueError:
            metadata = None
    if not isinstance(metadata, dict) or not isinstance(metadata.get("nitecap_order"), dict):
        raise Problem("Nitecap order not found.", 404)
    record = metadata["nitecap_order"]
    supplied = metadata.get("nitecap_signature", "")
    if not isinstance(supplied, str) or not hmac.compare_digest(signature(record), supplied):
        raise Problem("Order integrity check failed. Please contact Nitecap.", 409)
    if (record.get("version") != 1 or record.get("reference") != payment.get("reference")
            or record.get("amount") != payment.get("amount") or payment.get("currency") != "NGN"):
        raise Problem("Payment details do not match this order. Please contact Nitecap.", 409)
    return record


def initialize(payload):
    if not ready():
        raise Problem("Online checkout is being prepared. Please contact hi@nitecapcocktail.com.", 503)
    clean, amount = validate(payload)
    request_id = text_field(payload, "request_id", 80, 20)
    if not re.fullmatch(r"[a-zA-Z0-9-]{20,80}", request_id):
        raise Problem("Invalid checkout request.")
    reference = "NC-" + hmac.new(os.environ["ORDER_SIGNING_KEY"].encode(), request_id.encode(), hashlib.sha256).hexdigest()[:32]
    try:
        existing = paystack("/transaction/verify/" + reference, missing_ok=True)
        if existing:
            data = existing["data"]
            saved = extract(data)
            if saved["order"] != clean or saved["amount"] != amount:
                raise Problem("Your basket changed. Please start a new checkout.", 409)
            if data.get("status") == "success":
                return {"reference": reference, "status": "paid"}
            raise Problem("This payment was already started. Check payment status or contact Nitecap before paying again.", 409)
        record = {"version": 1, "reference": reference, "order": clean,
                  "amount": amount, "created_at": int(time.time())}
        fields = [("Order", "order_reference", reference),
                  ("Cans", "cart_items", "; ".join(i["name"] + " x " + str(i["quantity"]) for i in clean["items"])),
                  ("Customer", "customer_name", clean["customer"]["name"]),
                  ("Phone", "customer_phone", clean["customer"]["phone"]),
                  ("Delivery", "delivery_address", clean["address"]),
                  ("Notes", "order_notes", clean["notes"])]
        result = paystack("/transaction/initialize", {
            "reference": reference, "email": clean["customer"]["email"],
            "amount": amount, "currency": "NGN",
            "callback_url": os.environ["SITE_URL"].rstrip("/") + "/order.html",
            "metadata": {"nitecap_order": record, "nitecap_signature": signature(record),
                         "custom_fields": [{"display_name": name, "variable_name": key, "value": value} for name, key, value in fields]}})
        data = result["data"]
        if data.get("reference") != reference or not isinstance(data.get("access_code"), str):
            raise Problem("Unable to start payment. Please contact Nitecap.", 502)
        return {"reference": reference, "access_code": data["access_code"]}
    except Problem as error:
        error.reference = reference
        raise


def verify(reference):
    if not re.fullmatch(r"NC-[a-f0-9]{32}", reference):
        raise Problem("Invalid order reference.")
    result = paystack("/transaction/verify/" + quote(reference), missing_ok=True)
    if result is None:
        raise Problem("Payment has not been started. Please retry checkout.", 404)
    payment = result["data"]
    record = extract(payment)
    return {"reference": reference, "status": "paid" if payment.get("status") == "success" else "pending",
            "amount": record["amount"], "currency": "NGN"}


def list_orders(page):
    result = paystack("/transaction?perPage=100&page=" + str(page))
    orders = []
    for payment in result["data"]:
        if not str(payment.get("reference", "")).startswith("NC-"):
            continue
        try:
            record = extract(payment)
        except Problem:
            continue
        orders.append({"reference": record["reference"], "payload": record["order"],
                       "amount": record["amount"], "created_at": record["created_at"],
                       "paid_at": payment.get("paid_at") if payment.get("status") == "success" else None,
                       "status": "paid" if payment.get("status") == "success" else payment.get("status", "pending")})
    pagination = result.get("meta", {})
    return {"orders": orders, "page": page, "has_more": page < pagination.get("pageCount", page)}


def authorized(environ):
    token = os.environ.get("ADMIN_TOKEN", "")
    if len(token) < 32 or not hmac.compare_digest(environ.get("HTTP_AUTHORIZATION", ""), "Bearer " + token):
        raise Problem("Unauthorized.", 401)


def origins():
    return {os.environ.get("SITE_URL", "").rstrip("/"),
            "https://nitecapcocktail.com", "https://www.nitecapcocktail.com",
            "https://nitecap-checkout.onrender.com"} - {""}


def app(environ, start_response):
    original_start = start_response
    origin = environ.get("HTTP_ORIGIN")
    if origin in origins():
        def start_response(status, headers):
            return original_start(status, headers + [("Access-Control-Allow-Origin", origin),
                ("Vary", "Origin"), ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
                ("Access-Control-Allow-Headers", "Content-Type, Authorization")])
    try:
        return dispatch(environ, start_response)
    except Problem as error:
        return respond(start_response, error.status, {"error": error.message, "reference": error.reference})
    except Exception:
        print("Checkout request failed; inspect server health.", flush=True)
        return respond(start_response, 500, {"error": "Something went wrong. Please retry or contact Nitecap."})


def respond(start, status, value, content_type="application/json; charset=utf-8"):
    body = json.dumps(value).encode() if not isinstance(value, bytes) else value
    reason = {200: "OK", 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 409: "Conflict", 413: "Payload Too Large", 500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable"}[status]
    start(str(status) + " " + reason, [("Content-Type", content_type), ("Content-Length", str(len(body))),
          ("Cache-Control", "no-store"), ("X-Content-Type-Options", "nosniff"),
          ("Referrer-Policy", "same-origin"), ("X-Frame-Options", "SAMEORIGIN")])
    return [body]


def dispatch(env, start):
    path, method = env.get("PATH_INFO", "/"), env["REQUEST_METHOD"]
    if method == "OPTIONS" and path.startswith("/api/"):
        if env.get("HTTP_ORIGIN") not in origins():
            raise Problem("Request origin not allowed.", 403)
        return respond(start, 200, {})
    if method == "GET" and path == "/health":
        return respond(start, 200, {"ok": True})
    if method == "GET" and path == "/api/catalog":
        return respond(start, 200, {"products": [{"id": p[0], "name": p[1], "kind": p[2], "image": p[3], "price": PRICE} for p in PRODUCTS],
                                  "fulfilment": fulfilment(), "enabled": bool(ready())})
    if method == "GET" and path == "/api/admin/orders":
        authorized(env)
        from urllib.parse import parse_qs
        try:
            page = int(parse_qs(env.get("QUERY_STRING", "")).get("page", ["1"])[0])
            if not 1 <= page <= 10000:
                raise ValueError()
        except ValueError:
            raise Problem("Invalid page.")
        return respond(start, 200, list_orders(page))
    if method == "POST" and path in ("/api/orders", "/api/verify", "/api/paystack/webhook"):
        try:
            length = int(env.get("CONTENT_LENGTH") or "0")
        except ValueError:
            raise Problem("Invalid request.")
        if not 0 < length <= 32768:
            raise Problem("Request too large or empty.", 413)
        raw = env["wsgi.input"].read(length)
        if path == "/api/paystack/webhook":
            secret = os.environ.get("PAYSTACK_SECRET_KEY", "")
            signature = hmac.new(secret.encode(), raw, hashlib.sha512).hexdigest()
            if not secret or not hmac.compare_digest(signature, env.get("HTTP_X_PAYSTACK_SIGNATURE", "")):
                raise Problem("Invalid signature.", 401)
        else:
            origin = env.get("HTTP_ORIGIN")
            if origin and origin not in origins():
                raise Problem("Request origin not allowed.", 403)
        try:
            payload = json.loads(raw)
        except (ValueError, UnicodeDecodeError):
            raise Problem("Invalid JSON.")
        if not isinstance(payload, dict):
            raise Problem("Invalid request.")
        if path == "/api/orders":
            return respond(start, 200, initialize(payload))
        if path == "/api/verify":
            return respond(start, 200, verify(text_field(payload, "reference", 40)))
        if payload.get("event") == "charge.success":
            data = payload.get("data")
            if not isinstance(data, dict):
                raise Problem("Invalid event.")
            if str(data.get("reference", "")).startswith("NC-"):
                extract(data)
        # Paystack is the durable record: acknowledge without local side effects.
        return respond(start, 200, {"received": True})
    if path.startswith("/api/"):
        raise Problem("Endpoint not found.", 404)
    if method != "GET":
        raise Problem("Method not allowed.", 405)
    file = (ROOT / (path.lstrip("/") or "index.html")).resolve()
    if ROOT.resolve() not in file.parents or not file.is_file() or file.suffix not in {".html", ".css", ".js", ".jpg", ".png", ".svg", ".pdf"}:
        raise Problem("Page not found.", 404)
    return respond(start, 200, file.read_bytes(), mimetypes.guess_type(file.name)[0] or "application/octet-stream")


if __name__ == "__main__":
    from wsgiref.simple_server import make_server
    with make_server("127.0.0.1", int(os.environ.get("PORT", "8000")), app) as server:
        server.serve_forever()
