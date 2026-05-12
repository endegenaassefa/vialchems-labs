# Mogtrix Website

Next.js 16 + Supabase private research storefront with qualified customer accounts, hosted pilot checkout, persisted order history, manual request fallback, and a protected staff ops workspace.

## Local Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

If Supabase keys are missing, the public request endpoint stays in local demo mode. Request payloads are validated but not persisted.
Hosted payment defaults to the local stub adapter in local development only.

## Required Environment

Every required env var is documented in [`.env.example`](.env.example). Add the same values to Vercel Production and Preview environments.

```bash
NEXT_PUBLIC_SITE_URL=https://<your-domain>
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sb_publishable_or_legacy_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<sb_secret_or_legacy_service_role_key>
REQUIRE_SUPABASE=true
OPS_SIGNUP_ENABLED=true
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
PILOT_US_SHIPPING_CENTS=1500
ORDER_EMAIL_FROM=orders@<your-domain>
ORDER_STAFF_EMAILS=ops@<your-domain>
RESEND_API_KEY=<resend-api-key>
NEXT_PUBLIC_SENTRY_DSN=<sentry-dsn>
SENTRY_AUTH_TOKEN=<sentry-release-token>
SENTRY_ORG=<sentry-org>
SENTRY_PROJECT=<sentry-project>
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is also accepted as the public browser key if you prefer the newer Supabase naming.
Set `REQUIRE_SUPABASE=true` for preview and production pilot deployments so the request endpoint returns `503` instead of local demo success when server-side Supabase is missing.
Set `OPS_SIGNUP_ENABLED=true` only on protected pilot deployments where staff should be allowed to request inactive accounts.
Set `PAYMENT_PROVIDER=stripe` outside local development. When Stripe is selected, the site fails closed if `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, or `PILOT_US_SHIPPING_CENTS` are missing.
`PILOT_US_SHIPPING_CENTS` is the fixed domestic shipping rule for the first-sale pilot.

## Deploy

The site targets Vercel.

1. Push this repo to GitHub.
2. Vercel -> New Project -> import the repo. Set the root directory to `site/`.
3. Provision Supabase with [`scripts/provision-supabase.md`](scripts/provision-supabase.md).
4. Add the env vars above to Vercel. Mark server secrets as sensitive.
5. Enable Vercel Deployment Protection for the private pilot URL.
6. Deploy.
7. Run the smoke test. For protected deployments, set Vercel's automation bypass secret first:

```bash
export VERCEL_AUTOMATION_BYPASS_SECRET=<vercel-protection-bypass-secret>
bash site/scripts/smoke-test.sh https://<your-domain>
```

Before inviting pilot users, run one write-through check and confirm the created request appears in Supabase Studio:

```bash
SMOKE_SUBMIT=1 bash site/scripts/smoke-test.sh https://<your-domain>
```

Before enabling hosted checkout for real buyers, confirm Stripe sandbox checkout and webhook delivery work on the preview deployment with `REQUIRE_SUPABASE=true`.

## Staff Ops Setup

1. Apply the Supabase migrations.
2. Create a staff user in Supabase Auth with email/password, or enable `OPS_SIGNUP_ENABLED=true` and have the operator request access from `/ops/login?mode=signup`.
3. Promote the first operator in `public.profiles`:

```sql
update public.profiles
set role = 'admin',
    staff_active = true
where email = '<operator-email>';
```

4. Sign in at `/ops/login`. The footer Staff link also points to `/ops`, which redirects unauthenticated staff to the same login page.

## Architecture

- App router: Next.js 16 in [`app/`](app/), with Sentry-backed error boundaries.
- Catalog: Supabase-backed product records through [`lib/catalog.server.ts`](lib/catalog.server.ts), with `checkout_enabled` acting as the hosted-checkout pilot allowlist.
- Customer access: sign-in, email verification, qualification, and gated catalog routes through [`lib/customer.ts`](lib/customer.ts) and the account routes under [`app/account`](app/account).
- Orders and payments: draft order creation via [`app/api/orders/route.ts`](app/api/orders/route.ts), hosted payment session creation via [`app/api/payments/checkout-session/route.ts`](app/api/payments/checkout-session/route.ts), and webhook reconciliation via [`app/api/payments/webhook/route.ts`](app/api/payments/webhook/route.ts).
- Request flow: [`components/request-form.tsx`](components/request-form.tsx) posts to [`app/api/research-requests/route.ts`](app/api/research-requests/route.ts), which writes through the Supabase RPC `create_research_order_request`.
- Staff ops: `/ops` routes use Supabase Auth, profile roles, request transitions, and staff notes.
- Compliance: required attestations live in [`lib/attestations.ts`](lib/attestations.ts), legal copy lives in [`lib/content/legal.ts`](lib/content/legal.ts).
- Telemetry: Sentry via `instrumentation.ts` and `instrumentation-client.ts`, Vercel Analytics and Speed Insights in [`app/layout.tsx`](app/layout.tsx).
- Security headers: CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy in [`next.config.ts`](next.config.ts).

## Verification

```bash
npm run lint
npm run test
npm run build
npm run e2e
npm run verify
```

`npm run e2e` requires Playwright browsers to be installed.

## Source Boundary

This app is built from the Mogtrix handoff, `Branding.md`, approved legal elements, and copied vial/brand assets only. Archived legacy app code and any previous website repository are not used.
