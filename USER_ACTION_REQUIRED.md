# User Action Required

The code now fails closed for production launch defaults, but these external
items must be completed before public deployment can be considered production
ready.

## Accounts and Hosting

- Vercel project connected to this repository and configured to use Node 22.
- Vercel `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` collected
  per `docs/deploy/live-account-setup.md`.
- Production domain added to Vercel with SSL active.
- DNS records for `vialchemlabs.net` and any `www` redirect target.
- GitHub Actions enabled for this repository.
- GitHub token refreshed with `workflow` scope before adding or updating
  `.github/workflows/*`.

## Required Production Secrets

- `AGE_GATE_SECRET`: long random signing secret.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYMENT_PROVIDER=btcpay`
- `BTCPAY_URL`
- `BTCPAY_API_KEY`
- `BTCPAY_STORE_ID`
- `BTCPAY_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `ORDER_EMAIL_FROM`
- `ORDER_STAFF_EMAILS`
- `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`

## Supabase

- Create the Supabase project.
- Set `SUPABASE_DB_URL` locally and apply `supabase/migrations/20260510000001_init.sql`
  with `bash scripts/supabase-apply-migrations.sh`.
- Confirm RLS policies against the final auth model before public accounts are
  opened.
- Confirm service-role access is server-only in Vercel.

## Payments

- Provision production BTCPay Server.
- Create the store, API key, and webhook secret.
- Confirm BTC/LTC wallet setup and settlement process.
- Run a production-sandbox order through `/api/checkout/orders` and BTCPay
  webhook reconciliation before launch.
- ACH/Plaid is intentionally disabled until live create-intent support is built
  and tested.

## Email

- Verify the sender domain in Resend.
- Add SPF, DKIM, and DMARC records.
- Confirm `ORDER_EMAIL_FROM` can send and `ORDER_STAFF_EMAILS` receives contact
  and order mail.

## COA and Inventory

- Upload real production COA PDFs and live batch values for every shippable lot.
- Change each live COA record from `status: 'sample'` to `status: 'verified'`.
- Confirm product pages, `/coa`, and the sitemap expose only verified lots.
- Do not ship any SKU whose COA remains sample-only.

## Legal and Business

- Confirm legal entity name, jurisdiction, registered agent, and principal
  address.
- Final legal review for Terms, Privacy, Shipping, Refunds, RUO restrictions,
  age-gate copy, and jurisdiction restrictions.
- Confirm payment underwriting, bank account, tax posture, and fulfillment SOP.

## Final Manual Launch Checks

- `npm run preflight` passes on Node 22.
- GitHub Actions CI passes on the launch PR.
- Vercel preview smoke test passes, including age gate, checkout order creation,
  BTCPay redirect, contact form, newsletter form, and `/api/health/ready`.
- Production `/api/health/ready` returns `status: "ready"`.
