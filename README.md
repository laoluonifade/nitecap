# Nitecap direct orders

Nitecap's own cart and checkout replace all external ordering links. All six flavours cost **₦5,000 per can**, with **₦0 delivery**. Customer name, email, phone, delivery address and notes are stored with each order. Paystack opens over the checkout page; card data never passes through this application.

## Run and test

Python 3.10+ is required. Local browsing does not require dependencies:

```sh
python3 -m unittest -v
python3 server.py
```

Open `http://127.0.0.1:8000/order.html`. Without environment settings, browsing and the cart work but payment is disabled. Set environment variables using your host or shell; the application does not load `.env` files automatically.

## Render deployment

The existing static-site hosting cannot run payment verification or save orders. Deploy the repository as a **Docker web service**, using `Dockerfile` and root directory left blank. `render.yaml` describes a Starter web service with a persistent disk at `/data`; it is a paid infrastructure option, not an automatic change to an existing service. Use one service instance with one Gunicorn worker, four threads. SQLite is on the persistent disk; do not deploy it on an ephemeral filesystem or a serverless platform.

1. Set `SITE_URL` to the final HTTPS origin (no trailing slash) and `ORDER_DB=/data/orders.sqlite3`.
2. Set a random `ADMIN_TOKEN` of at least 32 characters in Render. It protects `/orders.html`'s API; keep it private. The page stores the token only in memory.
3. Set `PAYSTACK_SECRET_KEY` in Render only. Start with a **test** secret key. Never commit a secret or put it in static HTML/JavaScript.
4. The default fulfilment option is delivery with zero fee and a required address. Optional `FULFILMENT_OPTIONS` JSON can change the confirmed delivery/pickup choices; fees are calculated only by the server. Do not configure pickup without a confirmed address.
5. Set `CHECKOUT_ENABLED=true` only after the persistent disk and payment configuration are ready. A missing key, invalid origin, missing admin token, or missing fulfilment option disables checkout.
6. In Paystack API Keys & Webhooks, set the applicable test/live webhook URL to `https://nitecapcocktail.com/api/paystack/webhook`. Preserve any existing webhook used by another integration until its owner confirms it can change; a Paystack account may share webhook configuration across applications. Configure the test service's own origin while testing, then use the final origin when moving the domain.
7. Complete a Paystack test payment in the browser. Confirm the server dashboard shows PAID, the customer sees confirmation, the webhook works even if the customer closes the tab, and a duplicate webhook does not create another order. Test pending/declined/cancelled payment and retry.
8. Set the live secret in Render, configure the live webhook, verify the account is approved, and point the existing custom domain to the new web service. Keep the old service until DNS and HTTPS work. This code does not process a real charge during automated tests.

Paystack's dashboard controls the channels customers can use. The server initializes transactions in NGN, calculates amounts in kobo, verifies the exact amount/currency/reference, validates webhook HMAC-SHA512 signatures over the raw body, and makes paid-state transitions and notification insertion idempotent. A browser callback alone cannot mark an order paid.

## Receiving orders

Open `https://nitecapcocktail.com/orders.html` and use the admin token from Render. The dashboard lists the newest 200 orders, contact/delivery details, items, payment state, and email notification state. **Only fulfil PAID orders.** Pending orders are saved before contacting Paystack so they can be reconciled if a browser closes or a network request fails. A provider timeout during initialization may require reconciling the saved reference in Paystack rather than starting a new charge.

Optional email alerts use your SMTP provider:

```text
SMTP_HOST=<provider hostname>
SMTP_PORT=587
SMTP_USER=<username>
SMTP_PASSWORD=<password>
SMTP_FROM=<verified sender>
ORDER_NOTIFY_EMAIL=hi@nitecapcocktail.com
```

The production worker checks a durable alert outbox every 30 seconds. Failed notifications remain queued, and restart resumes delivery. A worker crash after SMTP accepts an email but before the database records it may cause a duplicate alert; it does not duplicate the order or charge. Without SMTP settings, orders remain visible in the dashboard and alerts stay queued. The authenticated `POST /api/admin/retry-alerts` endpoint with body `{}` can also trigger a retry. SMTP settings do not grant access to an email account until configured.

Back up the persistent SQLite database using SQLite's online backup mechanism (include its WAL state); apply a retention policy to customer details. Keep the service on HTTPS. This implementation tracks payment, not inventory, dispatch, refunds or chargeback lifecycle; review reversals in Paystack before fulfilment when relevant.

## Files and verification

- `outputs/`: original site assets plus checkout and private order desk.
- `server.py`: WSGI API, server-owned prices, SQLite storage and Paystack integration.
- `gunicorn.conf.py`: notification worker.
- `test_server.py`: mocked-provider integration tests. They do not call Paystack or send real email.

Paystack references: [accept payments](https://paystack.com/docs/payments/accept-payments/), [verify payments](https://paystack.com/docs/payments/verify-payments/), [webhook validation](https://paystack.com/docs/payments/webhooks/), [InlineJS](https://paystack.com/docs/developer-tools/inlinejs/).
