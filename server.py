"""Nitecap checkout. Run behind HTTPS using gunicorn; persist ORDER_DB."""
import hashlib
import hmac
import json
import mimetypes
import os
from pathlib import Path
import re
import secrets
import smtplib
import sqlite3
import ssl
import time
from contextlib import contextmanager
from email.message import EmailMessage
from urllib.error import URLError
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


@contextmanager
def db():
    path = Path(os.environ.get("ORDER_DB", "data/orders.sqlite3"))
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path, timeout=15)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA journal_mode=WAL")
    connection.executescript("""
      CREATE TABLE IF NOT EXISTS orders (
        reference TEXT PRIMARY KEY, request_id TEXT UNIQUE NOT NULL,
        payload TEXT NOT NULL, amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending', access_code TEXT,
        created_at INTEGER NOT NULL, paid_at INTEGER);
      CREATE TABLE IF NOT EXISTS alerts (
        reference TEXT PRIMARY KEY, sent_at INTEGER,
        lease_until INTEGER NOT NULL DEFAULT 0, attempts INTEGER NOT NULL DEFAULT 0);
    """)
    try:
        with connection:
            yield connection
    finally:
        connection.close()


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


def paystack(path, payload=None):
    req = Request("https://api.paystack.co" + path,
                  data=json.dumps(payload).encode() if payload is not None else None,
                  headers={"Authorization": "Bearer " + os.environ["PAYSTACK_SECRET_KEY"],
                           "Content-Type": "application/json"})
    try:
        with urlopen(req, timeout=18) as response:
            result = json.load(response)
        if result.get("status") is not True or not isinstance(result.get("data"), dict):
            raise ValueError()
        return result["data"]
    except (URLError, ValueError, TimeoutError):
        raise Problem("Could not reach Paystack. Please retry; your order reference is saved.", 502)


def initialize(payload):
    if not ready():
        raise Problem("Online checkout is being prepared. Please contact hi@nitecapcocktail.com.", 503)
    clean, amount = validate(payload)
    request_id = text_field(payload, "request_id", 80, 20)
    if not re.fullmatch(r"[a-zA-Z0-9-]{20,80}", request_id):
        raise Problem("Invalid checkout request.")
    serialized = json.dumps(clean, sort_keys=True)
    with db() as connection:
        connection.execute("INSERT OR IGNORE INTO orders(reference, request_id, payload, amount, created_at) VALUES(?,?,?,?,?)",
                           ("NC-" + secrets.token_hex(16), request_id, serialized, amount, int(time.time())))
        row = connection.execute("SELECT * FROM orders WHERE request_id=?", (request_id,)).fetchone()
        if row["payload"] != serialized or row["amount"] != amount:
            raise Problem("Your basket changed. Please start a new checkout.", 409)
        if row["status"] == "paid":
            return {"reference": row["reference"], "status": "paid"}
        if row["access_code"]:
            return {"reference": row["reference"], "access_code": row["access_code"]}
    data = paystack("/transaction/initialize", {
        "reference": row["reference"], "email": clean["customer"]["email"],
        "amount": amount, "currency": "NGN",
        "callback_url": os.environ["SITE_URL"].rstrip("/") + "/order.html",
        "metadata": {"order_reference": row["reference"]}})
    if data.get("reference") != row["reference"] or not isinstance(data.get("access_code"), str):
        raise Problem("Unable to start payment. Please contact Nitecap.", 502)
    with db() as connection:
        connection.execute("UPDATE orders SET access_code=? WHERE reference=?", (data["access_code"], row["reference"]))
    return {"reference": row["reference"], "access_code": data["access_code"]}


def apply_payment(reference, payment):
    with db() as connection:
        row = connection.execute("SELECT * FROM orders WHERE reference=?", (reference,)).fetchone()
        if row is None:
            raise Problem("Order not found.", 404)
        if payment.get("reference") != reference or payment.get("amount") != row["amount"] or payment.get("currency") != "NGN":
            raise Problem("Payment details do not match this order. Please contact Nitecap.", 409)
        if payment.get("status") == "success":
            connection.execute("UPDATE orders SET status='paid', paid_at=COALESCE(paid_at, ?) WHERE reference=?", (int(time.time()), reference))
            connection.execute("INSERT OR IGNORE INTO alerts(reference) VALUES(?)", (reference,))
            return "paid"
        return row["status"] if row["status"] == "paid" else "pending"


def verify(reference):
    if not re.fullmatch(r"NC-[a-f0-9]{32}", reference):
        raise Problem("Invalid order reference.")
    with db() as connection:
        row = connection.execute("SELECT * FROM orders WHERE reference=?", (reference,)).fetchone()
    if not row:
        raise Problem("Order not found.", 404)
    status = row["status"]
    if status != "paid":
        status = apply_payment(reference, paystack("/transaction/verify/" + quote(reference)))
    # Reference is a random capability: public responses contain no customer PII.
    return {"reference": reference, "status": status, "amount": row["amount"], "currency": "NGN"}


def deliver_alerts():
    """Retryable outbox. Run via Render cron; occasional duplicate email is possible."""
    required = ("SMTP_HOST", "SMTP_FROM", "ORDER_NOTIFY_EMAIL")
    if not all(os.environ.get(k) for k in required):
        return 0
    now, sent = int(time.time()), 0
    with db() as connection:
        rows = connection.execute("SELECT a.reference, o.payload, o.amount FROM alerts a JOIN orders o USING(reference) WHERE a.sent_at IS NULL AND a.lease_until < ? LIMIT 20", (now,)).fetchall()
    for row in rows:
        with db() as connection:
            claimed = connection.execute("UPDATE alerts SET lease_until=?, attempts=attempts+1 WHERE reference=? AND sent_at IS NULL AND lease_until<?", (now + 120, row["reference"], now)).rowcount
        if not claimed:
            continue
        order = json.loads(row["payload"])
        msg = EmailMessage()
        msg["From"], msg["To"] = os.environ["SMTP_FROM"], os.environ["ORDER_NOTIFY_EMAIL"]
        msg["Subject"] = "Paid Nitecap order " + row["reference"]
        msg.set_content("Payment verified. Total: NGN {:.2f}\nReference: {}\n\n{}".format(row["amount"] / 100, row["reference"], json.dumps(order, indent=2, ensure_ascii=False)))
        try:
            with smtplib.SMTP(os.environ["SMTP_HOST"], int(os.environ.get("SMTP_PORT", "587")), timeout=15) as smtp:
                smtp.starttls(context=ssl.create_default_context())
                if os.environ.get("SMTP_USER"):
                    smtp.login(os.environ["SMTP_USER"], os.environ.get("SMTP_PASSWORD", ""))
                smtp.send_message(msg)
            with db() as connection:
                connection.execute("UPDATE alerts SET sent_at=?, lease_until=0 WHERE reference=?", (int(time.time()), row["reference"]))
            sent += 1
        except (OSError, smtplib.SMTPException):
            # No customer details, SMTP password or provider response in logs.
            print("Order alert delivery failed; retained for retry.", flush=True)
    return sent


def authorized(environ):
    token = os.environ.get("ADMIN_TOKEN", "")
    if len(token) < 32 or not hmac.compare_digest(environ.get("HTTP_AUTHORIZATION", ""), "Bearer " + token):
        raise Problem("Unauthorized.", 401)


def app(environ, start_response):
    try:
        return dispatch(environ, start_response)
    except Problem as error:
        return respond(start_response, error.status, {"error": error.message})
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
    if method == "GET" and path == "/health":
        with db() as connection:
            connection.execute("SELECT 1")
        return respond(start, 200, {"ok": True})
    if method == "GET" and path == "/api/catalog":
        return respond(start, 200, {"products": [{"id": p[0], "name": p[1], "kind": p[2], "image": p[3], "price": PRICE} for p in PRODUCTS],
                                  "fulfilment": fulfilment(), "enabled": bool(ready())})
    if method == "GET" and path == "/api/admin/orders":
        authorized(env)
        with db() as connection:
            rows = connection.execute("SELECT o.reference, o.payload, o.amount, o.status, o.created_at, o.paid_at, a.sent_at AS alert_sent_at FROM orders o LEFT JOIN alerts a USING(reference) ORDER BY created_at DESC LIMIT 200").fetchall()
        return respond(start, 200, {"orders": [{**dict(row), "payload": json.loads(row["payload"])} for row in rows]})
    if method == "POST" and path in ("/api/orders", "/api/verify", "/api/paystack/webhook", "/api/admin/retry-alerts"):
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
            if origin and origin != os.environ.get("SITE_URL", "").rstrip("/"):
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
        if path == "/api/admin/retry-alerts":
            authorized(env)
            return respond(start, 200, {"sent": deliver_alerts()})
        if payload.get("event") == "charge.success":
            data = payload.get("data")
            if not isinstance(data, dict):
                raise Problem("Invalid event.")
            reference = data.get("reference", "")
            # Ignore charges from other applications sharing this Paystack account.
            with db() as connection:
                known = connection.execute("SELECT 1 FROM orders WHERE reference=?", (reference,)).fetchone()
            if known:
                apply_payment(reference, data)
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
    import sys
    if "--send-alerts" in sys.argv:
        print("Sent {} order alert(s).".format(deliver_alerts()))
    else:
        from wsgiref.simple_server import make_server
        with make_server("127.0.0.1", int(os.environ.get("PORT", "8000")), app) as server:
            server.serve_forever()
