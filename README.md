# vialchemlabs

Research peptide e-commerce site. Posture A (clean clinical) per locked brand decision. Day-1 catalog: 7 SKUs + Recovery Stack bundle. Per-batch independent Certificates of Analysis through Janoshik Analytical.

`Counted, weighed, verified.`

## Status

Built end-to-end across 15 phases per the Stage 6 super-prompt at `/root/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md`. Day-1 release v1.0.0 — see [`CHANGELOG.md`](./CHANGELOG.md).

## Stack

- Next.js 16.2.6 (App Router, Turbopack)
- React 19.2.4 / TypeScript 5
- Tailwind CSS v4
- Supabase (Postgres + Auth) — wires post-launch with real project
- Vercel hosting + Sentry monitoring
- Resend email
- BTCPay Server (self-hosted) + Plaid ACH for payments — cards deferred to Phase 2
- Vitest + Playwright

## Get started

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # 304 unit tests
npm run build        # production build
npm run preflight    # typecheck + lint + 3 supply-chain gate scripts
```

## Pre-launch checklist (operator)

Before deploying to production, complete `docs/operator-runbook.md` Pre-Launch Checklist:

1. Register `vialchemlabs` domain (`.labs` TLD via Donuts/Identity Digital)
2. USPTO TESS trademark search
3. Form Wyoming/Delaware/Nevada LLC
4. Confirm source supplier terms (MOQ, lead time, COA passthrough)
5. Sign per-batch testing agreement with Janoshik Analytical
6. Replace stub credentials in `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY` + verified sender domain
   - `NEXT_PUBLIC_SENTRY_DSN` + `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT`
   - `PLAID_CLIENT_ID` + `PLAID_SECRET` + `PLAID_WEBHOOK_VERIFICATION_KEY`
   - `BTCPAY_URL` + `BTCPAY_API_KEY` + `BTCPAY_STORE_ID` + `BTCPAY_WEBHOOK_SECRET` only when Bitcoin checkout is re-enabled
   - Zelle is configured with the public Zelle ID `vialchem-pay`; use `PAYMENT_PROVIDER=zelle` while Bitcoin remains paused.
7. Replace `public/coa/*.pdf` placeholders with real per-batch COAs from Janoshik
8. `vercel link` and configure environment variables in Vercel
9. Point `vialchemlabs` DNS to Vercel
10. Optional: 60-min buyer-conversation assignment per Bible §16

## Compliance

- **Iron Laws** (Day-1 enforced): no human-use language, no BAC water, no GLP-1 / Tirzepatide / Semaglutide / Retatrutide, no Stripe/PayPal/Square direct, no fake reviews, no before/after imagery.
- **Catalog**: Day-1 7 SKUs at locked prices per `DECISIONS/opening_sku_set.md`.
- **Payment rails**: Day-1 BTCPay (crypto) + Plaid (ACH) only. Phase 2 cards (MESH/MAX/Rocketfuel) at Day 90+.
- **Jurisdictional**: US-only Day-1; CA / TX / NY / FL blocked.
- **Age gate**: text-based contractual checkbox at first cart action (21+).
- **Buyer qualification**: 7-attestation block per Appendix A.5, including research-purpose textarea filtered by `assertMarketingCopySafe`.

## Documentation

- `docs/operator-runbook.md` — Day-1 / Weeks 2-4 / Months 2-3 acquisition runbook
- `docs/checkpoints/phase_*.md` — per-phase build artifacts (15 phases)
- `docs/superpowers/plans/2026-05-08-architecture.md` — locked architecture plan
- `docs/research/sub_*.md` — 6 Phase 1 corpus distillations (compliance, pricing, acquisition, industry, site anatomy, payment posture)

## License

Proprietary. © 2026 vialchemlabs LLC.
