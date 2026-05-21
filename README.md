# VialChem Labs

Research peptide e-commerce site. Live at https://vialchemlabs.net/.
Posture A (clean clinical, light theme) per LOCKED_OVERRIDE
`docs/DECISIONS/locked_override_2026-05-20.md`.

`Counted, weighed, verified.`

## Status

Production-shipped at v5.0.0 (2026-05-21) — see [`CHANGELOG.md`](./CHANGELOG.md).

- **Catalog**: ~10 SKUs + 3 bundles (6 banned compounds — tesamorelin,
  melanotan-ii, pt-141/bremelanotide, klow, retatrutide, tirzepatide —
  removed in v5.0.0 per Iron Laws 2.7 + 2.29).
- **Tests**: 1442/1442 GREEN (+1098 from v1.0.0 baseline of 304).
- **Coverage**: 91.88% lines / 83.64% branches.
- **42 Iron Laws** in effect (2.1-2.42). See
  `/root/vialchems-prompts/SUPER_PROMPT_v5.md` for the operative spec.

## Stack

- Next.js 16.2.6 (App Router, Turbopack)
- React 19.2.4 / TypeScript 5
- Tailwind CSS v4
- Supabase (Postgres + Auth + RLS + append-only audit triggers)
- Vercel hosting (Git-integrated auto-deploy) + Sentry monitoring
- Resend transactional email
- BTCPay Server (self-hosted) + Plaid ACH + Zelle + WooCommerce handoff
  (5 indirect rails: link_money / card / apple_pay / google_pay / paypal)
- Vitest + Playwright + Lighthouse CI

## Get started

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # 1442 unit tests
npm run build        # production build
npm run preflight    # 11-gate preflight: typecheck + lint + format + test
                     # + build + npm-audit-high + grep-mogtrix
                     # + grep-forbidden-words + supply-chain-scan
                     # + check-canonical-domain + check-dns-resolution
```

## Production environment

The full env spec lives at `.env.production.template` (values-empty per
Iron Law 2.22). Operator provisions via Vercel project env-vars dashboard.

**Required for v5.0.0 launch:**

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` +
  `SUPABASE_SERVICE_ROLE_KEY` (REQUIRE_SUPABASE=true in prod)
- `RESEND_API_KEY` + `ORDER_EMAIL_FROM` + `ORDER_STAFF_EMAILS`
- `NEXT_PUBLIC_SENTRY_DSN` + `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` +
  `SENTRY_PROJECT`
- `AGE_GATE_SECRET` (HMAC signing for the age-gate cookie; production
  throws if unset per `lib/age-verification.ts:54`)
- `BTCPAY_URL` + `BTCPAY_API_KEY` + `BTCPAY_STORE_ID` +
  `BTCPAY_WEBHOOK_SECRET` for crypto rail
- `ZELLE_CHECKOUT_SIGNING_SECRET` + `ZELLE_HANDLE` + `ZELLE_EMAIL` for
  Zelle manual-reconciliation rail
- `PAYMENT_PROVIDER` (one of `stub | btcpay | plaid | zelle`)

**Required to enable Plaid ACH** (Day-1 disabled per LOCKED_OVERRIDE):

- `PLAID_CLIENT_ID` + `PLAID_SECRET` + `PLAID_ENV=production` +
  `PLAID_PRODUCTS=auth,transactions,transfer`
- `PLAID_VERIFICATION_MODE=jwks` (default) — v5.0.1 wires live JWKS
  fetch from Plaid's verification-key endpoint, so `PLAID_JWKS_KEYS`
  can stay unset in production.

**Optional Day-1:**

- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` for
  cross-instance rate-limit coordination (in-memory LRU is the
  per-instance fallback).
- `WOOCOMMERCE_API_URL` + `WOOCOMMERCE_CONSUMER_KEY` for the
  5-indirect-rail handoff to the operator's shop subdomain.

## Compliance

- **Iron Laws 2.1-2.42** — see `/root/vialchems-prompts/SUPER_PROMPT_v5.md`.
- **Banned compounds** (Iron Law 2.7 / 2.29 PERPETUAL ban): tirzepatide,
  semaglutide, retatrutide, GLP-1 / GLP-1RA, tesamorelin (TH9507/Egrifta),
  melanotan-i / melanotan-ii / MT-1 / MT-2, bremelanotide / PT-141 /
  Vyleesi, bacteriostatic water, SS-31 / elamipretide, KLOW. Enforced via
  double-gate (`lib/compliance/banned-compounds.ts` static blocklist +
  `components/ui/Vial.tsx` + `components/ui/VialProductPhoto.tsx`
  catalog allowlist).
- **Payment rails** (Iron Law 2.20 LOCKED_OVERRIDE 2026-05-20): 4 direct
  (`stub` / `btcpay` / `plaid` / `zelle`) + 5 WooCommerce indirect
  (link_money / card / apple_pay / google_pay / paypal) + bitcoin-direct
  fallback. Stripe-direct, Square-direct, Shopify Payments excluded.
- **Jurisdictional** (Iron Law 2.8 LOCKED_OVERRIDE 2026-05-20):
  `BLOCKED_US_STATES = []` per operator amendment for 200K-impression
  campaign reach. International remains US-only. Layer 3 guard fires on
  all 8 webhook surfaces (Iron Law 2.31).
- **Age gate**: HMAC-signed cookie via `lib/age-verification.ts` (Web
  Crypto, 30-day max-age, secure + httpOnly + sameSite=lax).
- **Buyer qualification**: 7-attestation block per Appendix A.5, with
  research-purpose textarea filtered by `assertMarketingCopySafe`
  (`lib/compliance.ts` auto-derives forbidden patterns from the banned-
  compound blocklist — belt + suspenders).
- **Audit trail**: append-only Postgres triggers on `audit_log`,
  `attestations_audit`, `order_status_history`
  (`supabase/migrations/20260521000001_*.sql`, Iron Law 2.33).
- **CSP header**: live on production via `vercel.json`. Plaid + Sentry +
  Supabase + Resend + Coinbase allowlist; `frame-ancestors 'none'`;
  `upgrade-insecure-requests`.

## Deployment

Vercel Git-integrated: merges to `main` auto-deploy. Branch protection
via `scripts/setup-branch-protection.sh` (run once after CI workflows
have populated check-run history). Required checks: `Unit + preflight`
and `Vercel`. Visual regression + Lighthouse mobile stay informational
until operator re-baselines.

Live verification:

```bash
curl -fsS https://vialchemlabs.net/api/health
# {"status":"ok","service":"vialchemlabs","version":"v5.0.0","gitSha":"...","time":"..."}

curl -fsSI https://vialchemlabs.net/ | grep -i content-security-policy
# Content-Security-Policy: default-src 'self'; ...
```

## Documentation

- `CHANGELOG.md` — versioned release notes (latest: v5.0.1 / 2026-05-21).
- `docs/DECISIONS/locked_override_2026-05-20.md` — LOCKED_OVERRIDE
  provenance for brand / jurisdictional / payment-rail amendments.
- `docs/audit/2026-05-19_full_audit_report_v2.md` — 822-line audit
  register that v5.0.0 closed.
- `docs/audit/2026-05-20_drift_assessment.md` + `2026-05-20_supplemental_findings.md` —
  post-audit work between the audit anchor and v5 ship.
- `docs/checkpoints/v5_phase_0_preflight.md` through
  `v5_phase_11_verification.md` — per-phase build artifacts (13 v5
  phase checkpoints).
- `docs/operator-runbook.md` — operator acquisition + ops runbook.
- `docs/deploy/first-payment-verification.md` — HIL GATE 2 first-buyer
  test procedure (BTCPay required; Plaid coming-soon; Zelle optional).
- `tests/coverage-exceptions.md` — Iron Law 2.36 coverage carve-outs.
- `.gstack/deploy-reports/` — per-deploy reports from `/land-and-deploy`.

## Remaining HIL gates (operator-owned, pre-ad-campaign)

1. **HIL GATE 2** — First-buyer test on BTCPay (full-price + immediate
   refund). Plaid skipped until JWKS live-fetch is provisioned.
2. **HIL GATE 3** — 200K-impression ad-campaign trigger. Operator
   controls timing and platform.

## License

Proprietary. © 2026 VialChem Labs LLC.
