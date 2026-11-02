import copy
import hashlib
import hmac
import io
import json
import os
import unittest
from unittest.mock import patch
import server
from urllib.error import HTTPError
REAL_PAYSTACK = server.paystack


class CheckoutTests(unittest.TestCase):
    def setUp(self):
        self.env = patch.dict(os.environ, {
            'SITE_URL': 'https://nitecapcocktail.com', 'PAYSTACK_SECRET_KEY': 'sk_test_fixture',
            'CHECKOUT_ENABLED': 'true', 'ADMIN_TOKEN': 't' * 48, 'ORDER_SIGNING_KEY': 's' * 48,
            'FULFILMENT_OPTIONS': '[{"id":"delivery","label":"Delivery","fee_naira":0,"requires_address":true}]'
        })
        self.env.start()
        self.payload = {'request_id': 'fixture-order-1234567890', 'customer': {
            'name': 'Test Customer', 'email': 'buyer@example.com', 'phone': '+2348000000000'},
            'items': [{'id': 'mojito-mood', 'quantity': 2}], 'age_confirmed': True,
            'fulfilment_id': 'delivery', 'address': 'Test address in Lagos', 'notes': ''}
        self.ledger = {}
        self.provider = patch.object(server, 'paystack', side_effect=self.paystack)
        self.provider.start()

    def tearDown(self):
        self.provider.stop()
        self.env.stop()

    def paystack(self, path, payload=None, missing_ok=False):
        if path == '/transaction/initialize':
            ref = payload['reference']
            self.assertNotIn(ref, self.ledger)
            self.ledger[ref] = {**payload, 'status': 'pending'}
            return {'data': {'reference': ref, 'access_code': 'fixture_access'}}
        if path.startswith('/transaction/verify/'):
            value = self.ledger.get(path.split('/')[-1])
            if value is None and not missing_ok:
                raise server.Problem('Not found', 404)
            return {'data': value} if value else None
        if path.startswith('/transaction?'):
            return {'data': list(self.ledger.values()), 'meta': {'pageCount': 2}}
        raise AssertionError(path)

    def request(self, path, payload=None, **headers):
        body = json.dumps(payload).encode() if payload is not None else b''
        env = {'PATH_INFO': path, 'REQUEST_METHOD': 'POST' if payload is not None else 'GET',
               'CONTENT_LENGTH': str(len(body)), 'wsgi.input': io.BytesIO(body), **headers}
        result = []
        response = b''.join(server.app(env, lambda status, hdr: result.append((status, hdr))))
        return int(result[0][0].split()[0]), json.loads(response)

    def initialize(self):
        code, data = self.request('/api/orders', self.payload)
        self.assertEqual(code, 200, data)
        return data['reference']

    def test_server_sets_price_and_free_delivery_and_provider_saves_order(self):
        self.payload['amount'] = 1
        self.payload['items'][0]['price'] = 1
        ref = self.initialize()
        self.assertEqual(self.ledger[ref]['amount'], 1000000)
        record = server.extract(self.ledger[ref])
        self.assertEqual(record['order']['address'], 'Test address in Lagos')
        self.assertTrue(any(f['variable_name'] == 'cart_items' for f in self.ledger[ref]['metadata']['custom_fields']))

    def test_validation_rejects_invalid_orders_before_provider(self):
        for update in [{'items': []}, {'items': [{'id': 'mojito-mood', 'quantity': -1}]},
                       {'items': [{'id': 'mojito-mood', 'quantity': 1.5}]},
                       {'items': [{'id': 'unknown', 'quantity': 1}]},
                       {'items': [{'id': 'mojito-mood', 'quantity': True}]},
                       {'items': self.payload['items'] * 2}, {'age_confirmed': False},
                       {'address': ''}, {'fulfilment_id': 'other'}]:
            with self.subTest(update=update):
                self.assertEqual(self.request('/api/orders', {**self.payload, **update})[0], 400)
        self.assertEqual(self.ledger, {})

    def test_repeat_checkout_never_creates_a_second_transaction(self):
        ref = self.initialize()
        code, data = self.request('/api/orders', self.payload)
        self.assertEqual(code, 409)
        self.assertEqual(data['reference'], ref)
        self.assertEqual(len(self.ledger), 1)
        self.ledger[ref]['status'] = 'success'
        self.assertEqual(self.request('/api/orders', self.payload)[1]['status'], 'paid')
        changed = copy.deepcopy(self.payload)
        changed['items'][0]['quantity'] = 3
        self.assertEqual(self.request('/api/orders', changed)[0], 409)

    def test_payment_rejects_underpayment_and_wrong_currency(self):
        ref = self.initialize()
        original = copy.deepcopy(self.ledger[ref])
        for change in [{'amount': 1}, {'currency': 'USD'}, {'reference': 'other'}]:
            self.ledger[ref] = {**original, **change}
            with self.subTest(change=change):
                self.assertEqual(self.request('/api/verify', {'reference': ref})[0], 409)

    def test_customer_processing_fee_must_match_provider_requested_amount(self):
        ref = self.initialize()
        self.ledger[ref].update(status='success', requested_amount=1000000, amount=1035354)
        code, result = self.request('/api/verify', {'reference': ref})
        self.assertEqual(code, 200)
        self.assertEqual(result['amount'], 1000000)
        self.assertEqual(result['charged_amount'], 1035354)
        self.ledger[ref]['requested_amount'] = 1
        self.assertEqual(self.request('/api/verify', {'reference': ref})[0], 409)

    def test_tampered_order_metadata_is_rejected(self):
        ref = self.initialize()
        self.ledger[ref]['metadata']['nitecap_order']['order']['address'] = 'Attacker address'
        self.assertEqual(self.request('/api/verify', {'reference': ref})[0], 409)

    def test_unsigned_webhook_is_rejected(self):
        ref = self.initialize()
        self.assertEqual(self.request('/api/paystack/webhook', {'event': 'charge.success', 'data': self.ledger[ref]})[0], 401)

    def test_duplicate_webhooks_do_not_create_orders_and_verify_reads_paystack(self):
        ref = self.initialize()
        self.ledger[ref]['status'] = 'success'
        payload = {'event': 'charge.success', 'data': self.ledger[ref]}
        sig = hmac.new(b'sk_test_fixture', json.dumps(payload).encode(), hashlib.sha512).hexdigest()
        for _ in range(2):
            self.assertEqual(self.request('/api/paystack/webhook', payload, HTTP_X_PAYSTACK_SIGNATURE=sig)[0], 200)
        result = self.request('/api/verify', {'reference': ref})[1]
        self.assertEqual(result['status'], 'paid')
        self.assertNotIn('customer', result)
        self.assertEqual(len(self.ledger), 1)
        # No local database/cache is required to recover the order.
        self.assertEqual(server.extract(self.ledger[ref])['order']['items'][0]['quantity'], 2)

    def test_browser_cannot_override_pending_provider_status(self):
        ref = self.initialize()
        result = self.request('/api/verify', {'reference': ref, 'status': 'success'})[1]
        self.assertEqual(result['status'], 'pending')

    def test_admin_requires_token_and_paginates_private_orders(self):
        self.initialize()
        self.assertEqual(self.request('/api/admin/orders')[0], 401)
        code, result = self.request('/api/admin/orders', HTTP_AUTHORIZATION='Bearer ' + 't' * 48)
        self.assertEqual(code, 200)
        self.assertTrue(result['has_more'])
        self.assertEqual(result['orders'][0]['payload']['customer']['email'], 'buyer@example.com')

    def test_disabled_checkout_and_untrusted_origin(self):
        with patch.dict(os.environ, {'CHECKOUT_ENABLED': 'false'}):
            self.assertEqual(self.request('/api/orders', self.payload)[0], 503)
        self.assertEqual(self.request('/api/orders', self.payload, HTTP_ORIGIN='https://other.example')[0], 403)

    def test_missing_provider_reference_with_punctuation_allows_initialization(self):
        error = HTTPError('https://api.paystack.co/transaction/verify/test', 403, 'Forbidden', {},
                          io.BytesIO(b'{"status":false,"message":"Transaction reference not found."}'))
        with patch.object(server, 'urlopen', side_effect=error):
            self.assertIsNone(REAL_PAYSTACK('/transaction/verify/test', missing_ok=True))

    def test_provider_auth_failure_does_not_look_like_missing_order(self):
        error = HTTPError('https://api.paystack.co/transaction/verify/test', 401, 'Unauthorized', {},
                          io.BytesIO(b'{"status":false,"message":"Invalid key"}'))
        with patch.object(server, 'urlopen', side_effect=error):
            with self.assertRaises(server.Problem):
                REAL_PAYSTACK('/transaction/verify/test', missing_ok=True)

    def test_static_storefront_cors_preflight_is_restricted(self):
        for origin, expected in [('https://nitecapcocktail.com', 200), ('https://attacker.example', 403)]:
            result = []
            env = {'PATH_INFO': '/api/orders', 'REQUEST_METHOD': 'OPTIONS', 'HTTP_ORIGIN': origin}
            list(server.app(env, lambda status, headers: result.append((status, dict(headers)))))
            self.assertEqual(int(result[0][0].split()[0]), expected)
            self.assertEqual(result[0][1].get('Access-Control-Allow-Origin'), origin if expected == 200 else None)

    def test_server_does_not_expose_secrets_or_source(self):
        for path in ['/../server.py', '/.env', '/data/orders.sqlite3']:
            self.assertEqual(self.request(path)[0], 404)


if __name__ == '__main__':
    unittest.main()
