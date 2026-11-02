# Nitecap direct orders on Render Free

All six flavours cost ₦5,000 per can, with no delivery fee. Customers build a basket on Nitecap, enter contact/delivery details, and pay in Paystack's popup. No Zappie redirect is used.

## Storage without a paid database

The server attaches the complete order to the Paystack transaction as signed metadata. Paystack retains that record. Cart items, customer name/phone, delivery address and notes are also custom fields visible on the Paystack transaction details page. The private `/orders.html` dashboard reads Paystack's paginated transaction API, rather than a local database. No paid disk, database, SMTP account or extra platform is required.

The server computes the price, initializes payment, verifies exact amount/currency/reference, validates metadata signatures, and verifies webhook HMAC signatures. Browser callbacks cannot mark orders paid. Repeated initialization uses the same reference and will not create a second transaction. If the browser loses the initialization response, check the saved reference before starting another payment; the provider may have created the transaction even if the browser saw an error. Unsigned or unrelated Paystack transactions are not shown as Nitecap orders.

Only orders successfully initialized in Paystack are retained. A basket abandoned before reaching Paystack is not saved. Refunds/reversals are reflected by the provider's current transaction state where available; this is not an inventory or dispatch system.

## Deploy for $0 hosting

Deploy this repository's Dockerfile as a **Free** Render web service, with no disk and no paid database. `render.yaml` uses `plan: free`. Keep the existing site and custom domain on Render Static hosting. The checkout and order desk call the free backend at https://nitecap-checkout.onrender.com; CORS is restricted to the two Nitecap domains and that backend origin. No DNS move is needed. Do not create another account to bypass Render's workspace quotas; use the existing workspace.

Set these environment variables in Render, never in Git or frontend code:

- `SITE_URL`: the service's HTTPS origin. Use the generated onrender.com origin for testing and the custom origin when moving the domain.
- `PAYSTACK_SECRET_KEY`: initially the account's test key, then the live key after testing.
- `ADMIN_TOKEN`: a long random private token (at least 32 characters) for `/orders.html`.
- `ORDER_SIGNING_KEY`: a separate random secret (at least 32 characters). **Preserve this unchanged across redeploys and back it up securely.** Old order signatures depend on it. Changing only the admin token does not invalidate order signatures.
- `CHECKOUT_ENABLED=true`: only after configuration and test payment verification.

Delivery is the default fulfilment option, costs ₦0, and requires an address. Optional `FULFILMENT_OPTIONS` JSON can define confirmed alternatives. Do not add pickup without a confirmed pickup address.

In the Paystack dashboard, set the corresponding test/live webhook URL to `<SITE_URL>/api/paystack/webhook`. Do not overwrite a webhook used by another application without checking first. The callback URL is supplied per transaction. Check merchant payment email notification preferences in Paystack if desired; this app does not send its own emails.

Test a complete Paystack test-mode payment, cancellation, pending status, callback and webhook. Confirm that items/contact/address appear in the private order dashboard and in Paystack. Test recovery after a redeploy. Then configure the live key and webhook and deploy the frontend to the existing static site. Automated tests do not make real payments.

## Free-plan tradeoffs

Render's free service sleeps after 15 minutes idle and can take about a minute to wake. Its free hours, bandwidth and build limits still apply; creating a second service does not increase the workspace's quota. No paid instance or storage is configured by this repository. Review workspace usage/billing settings to avoid optional paid overages. Paystack's normal payment processing fees still apply to transactions.

No free Render Postgres is used because it expires after 30 days. No local SQLite is used because Render's free filesystem is erased across restarts. The order dashboard remains dependent on Paystack API availability and rate limits; it shows up to 100 provider transactions per page, with next/previous navigation.

## Local checks

Python 3.10+:

```sh
python3 -m unittest -v
python3 server.py
```

Open `http://127.0.0.1:8000/order.html`. Without environment configuration, browsing/cart work and payment stays disabled. Production uses Gunicorn through the Dockerfile. `/health` is the health check.

Sources: [Render free-plan limits](https://render.com/docs/free), [Paystack metadata](https://paystack.com/docs/payments/metadata/), [Paystack verification](https://paystack.com/docs/payments/verify-payments/), [Paystack webhooks](https://paystack.com/docs/payments/webhooks/).
