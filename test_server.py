import copy
import hashlib
import hmac
import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import server


class CheckoutTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.env = patch.dict(os.environ, {
            "ORDER_DB": str(Path(self.temp.name) / "orders.db"),
            "SITE_URL": "https://nitecapcocktail.com", "PAYSTACK_SECRET_KEY": "sk_test_fixture",
            "CHECKOUT_ENABLED": "true", "ADMIN_TOKEN": "t" * 48,
            "FULFILMENT_OPTIONS": '[{"id":"delivery","label":"Delivery","fee_naira":0,"requires_address":true}]'
        })
        self.env.start()
        self.payload = {"request_id": "fixture-order-1234567890", "customer": {
            "name": "Test Customer", "email": "buyer@example.com", "phone": "+2348000000000"},
            "items": [{"id": "mojito-mood", "quantity": 2}], "age_confirmed": True,
            "fulfilment_id": "delivery", "address": "Test address in Lagos", "notes": ""}

    def tearDown(self):
        self.env.stop()
        self.temp.cleanup()

    def request(self, path, payload=None, **headers):
        body = json.dumps(payload).encode() if payload is not None else b""
        env = {"PATH_INFO": path, "REQUEST_METHOD": "POST" if payload is not None else "GET",
               "CONTENT_LENGTH": str(len(body)), "wsgi.input": io.BytesIO(body), **headers}
        result = []
        response = b"".join(server.app(env, lambda status, hdr: result.append((status, hdr))))
        return int(result[0][0].split()[0]), json.loads(response)

    def initialize(self):
        with patch.object(server, "paystack", side_effect=lambda path, p: {"reference": p["reference"], "access_code": "fixture_access"}):
            code, data = self.request("/api/orders", self.payload)
        self.assertEqual(code, 200, data)
        return data["reference"]

    def payment(self, ref, **overrides):
        return {"reference": ref, "amount": 1000000, "currency": "NGN", "status": "success", **overrides}

    def test_server_sets_price_and_free_delivery(self):
        self.payload["amount"] = 1
        self.payload["items"][0]["price"] = 1
        with patch.object(server, "paystack", side_effect=lambda path, p: {"reference": p["reference"], "access_code": "fixture"}) as provider:
            code, _ = self.request("/api/orders", self.payload)
        self.assertEqual(code, 200)
        self.assertEqual(provider.call_args.args[1]["amount"], 1000000)
        self.assertEqual(provider.call_args.args[1]["currency"], "NGN")

    def test_validation_rejects_invalid_orders_before_provider(self):
        for update in [{"items": []}, {"items": [{"id": "mojito-mood", "quantity": -1}]},
                       {"items": [{"id": "mojito-mood", "quantity": 1.5}]},
                       {"items": [{"id": "unknown", "quantity": 1}]},
                       {"items": [{"id": "mojito-mood", "quantity": True}]},
                       {"items": self.payload["items"] * 2}, {"age_confirmed": False},
                       {"address": ""}, {"fulfilment_id": "other"}]:
            with self.subTest(update=update), patch.object(server, "paystack") as provider:
                self.assertEqual(self.request("/api/orders", {**self.payload, **update})[0], 400)
                provider.assert_not_called()

    def test_repeat_checkout_reuses_order_and_provider_transaction(self):
        reference = self.initialize()
        with patch.object(server, "paystack") as provider:
            code, data = self.request("/api/orders", self.payload)
            provider.assert_not_called()
        self.assertEqual(code, 200)
        self.assertEqual(data["reference"], reference)
        changed = copy.deepcopy(self.payload)
        changed["items"][0]["quantity"] = 3
        self.assertEqual(self.request("/api/orders", changed)[0], 409)

    def test_payment_rejects_underpayment_and_wrong_currency_or_reference(self):
        ref = self.initialize()
        for change in [{"amount": 1}, {"currency": "USD"}, {"reference": "other"}]:
            with self.subTest(change=change), patch.object(server, "paystack", return_value=self.payment(ref, **change)):
                self.assertEqual(self.request("/api/verify", {"reference": ref})[0], 409)
        with server.db() as con:
            self.assertEqual(con.execute("SELECT status FROM orders").fetchone()[0], "pending")

    def test_unsigned_webhook_cannot_mark_paid(self):
        ref = self.initialize()
        code, _ = self.request("/api/paystack/webhook", {"event": "charge.success", "data": self.payment(ref)})
        self.assertEqual(code, 401)

    def test_webhook_and_callback_are_idempotent_and_persist_paid_order(self):
        ref = self.initialize()
        payload = {"event": "charge.success", "data": self.payment(ref)}
        signature = hmac.new(b"sk_test_fixture", json.dumps(payload).encode(), hashlib.sha512).hexdigest()
        for _ in range(2):
            self.assertEqual(self.request("/api/paystack/webhook", payload, HTTP_X_PAYSTACK_SIGNATURE=signature)[0], 200)
        with patch.object(server, "paystack") as provider:
            code, result = self.request("/api/verify", {"reference": ref})
            provider.assert_not_called()
        self.assertEqual(result["status"], "paid")
        self.assertNotIn("customer", result)
        with server.db() as con:
            self.assertEqual(con.execute("SELECT COUNT(*) FROM alerts").fetchone()[0], 1)
            self.assertEqual(con.execute("SELECT status FROM orders").fetchone()[0], "paid")

    def test_browser_success_does_not_override_pending_provider_status(self):
        ref = self.initialize()
        with patch.object(server, "paystack", return_value=self.payment(ref, status="pending")):
            _, result = self.request("/api/verify", {"reference": ref, "status": "success"})
        self.assertEqual(result["status"], "pending")

    def test_admin_requires_token_and_customer_data_is_private(self):
        self.initialize()
        self.assertEqual(self.request("/api/admin/orders")[0], 401)
        code, result = self.request("/api/admin/orders", HTTP_AUTHORIZATION="Bearer " + "t" * 48)
        self.assertEqual(code, 200)
        self.assertEqual(result["orders"][0]["payload"]["customer"]["email"], "buyer@example.com")

    def test_alerts_retry_and_do_not_send_again_after_success(self):
        ref = self.initialize()
        server.apply_payment(ref, self.payment(ref))
        with patch.dict(os.environ, {"SMTP_HOST": "smtp.example.com", "SMTP_FROM": "orders@example.com", "ORDER_NOTIFY_EMAIL": "owner@example.com"}), patch.object(server.smtplib, "SMTP") as smtp:
            smtp.return_value.__enter__.return_value.send_message.side_effect = OSError("fixture failure")
            self.assertEqual(server.deliver_alerts(), 0)
            with server.db() as con:
                con.execute("UPDATE alerts SET lease_until=0")
            smtp.return_value.__enter__.return_value.send_message.side_effect = None
            self.assertEqual(server.deliver_alerts(), 1)
            self.assertEqual(server.deliver_alerts(), 0)

    def test_disabled_checkout_and_untrusted_origin(self):
        with patch.dict(os.environ, {"CHECKOUT_ENABLED": "false"}):
            self.assertEqual(self.request("/api/orders", self.payload)[0], 503)
        self.assertEqual(self.request("/api/orders", self.payload, HTTP_ORIGIN="https://other.example")[0], 403)

    def test_server_does_not_expose_database_or_env(self):
        for path in ["/../server.py", "/.env", "/data/orders.sqlite3"]:
            self.assertEqual(self.request(path)[0], 404)


if __name__ == "__main__":
    unittest.main()
