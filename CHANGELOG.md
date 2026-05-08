# Changelog

All notable changes to Vialchems Labs are documented here.
Format inspired by Keep a Changelog. Versioning follows SemVer.

## [1.0.0] — 2026-05-08

Initial Day-1 release. Built end-to-end per `/root/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md` across 15 phases (Phase 0 bootstrap → Phase 15 post-deploy).

### Site

- Home (`/`) — hero, three-column thesis, Recovery Stack CTA
- Catalog (`/shop`) — 7 SKUs + Recovery Stack bundle, filters/sort/Fuse.js search
- Product Detail (`/products/[slug]`) — 8 paths SSG; verbatim 336-345 word descriptions per Appendix E.1; tabs for Description / Certificate of Analysis / Related Products
- Cart, 4-step Checkout, Order Confirmation
- Account dashboard + sub-pages (orders, addresses, settings)
- Login + Signup stubs
- About, Blog index, Blog post (5 long-form research posts at 1500-1588 words each), FAQ (20 verbatim Appendix M Q+A), Contact
- COA Library (`/coa`) + per-batch detail (`/coa/[peptide]/[batch]`, 7 paths SSG)
- Test Reports (Janoshik Analytical default lab partner)
- Legal: Terms, Privacy, Refunds, Shipping, Cookies (Appendix L verbatim)
- Affiliate program signup
- Newsletter signup + thanks page
- 404 + 500 brand-consistent error pages

### Brand

- Vialchems Labs (Posture A clean clinical) — LOCKED via DECISIONS/brand_pick.md
- Domain: vialchems.labs (literal .labs TLD)
- Wordmark: Vialchems + LABS chip
- Typography: IBM Plex Sans + IBM Plex Mono + Newsreader Italic
- Color: charcoal #0a0e0f bg + teal #3dd4c8 accent
- Anti-patterns enforced (no Geist, no purple gradients, no SaaS-grid, no stock photos, no emoji icons)

### Catalog

- 7 SKUs at LOCKED prices per Appendix E:
  - BPC-157 10mg ($54), TB-500 5mg ($34), GHK-Cu 50mg ($34)
  - Ipamorelin 10mg ($50), CJC-1295 (no DAC) 5mg ($25)
  - MOTS-c 10mg ($48), Selank 10mg ($48)
- Recovery Stack bundle: $77 (12.5% effective discount)
- Intro promo: WELCOME15 (15% off first order, gated by newsletter signup + age + RUO)
- 7 placeholder COA PDFs at `public/coa/<slug>-BATCH-2026-PLACEHOLDER.pdf` (replace before launch)

### Compliance

- Iron Laws 2.1-2.16 enforced via pre-commit gates (3 scripts: grep-mogtrix, grep-forbidden-words, supply-chain-scan)
- Verbatim Appendix A.1 footer disclaimer (every page)
- Verbatim Appendix A.2 product page disclaimer
- Age gate: text-based contractual checkbox at first cart action (21+, Appendix A.3 verbatim)
- Jurisdictional restriction: CA / TX / NY / FL blocked via lib/compliance/jurisdictions.ts (3-layer enforcement: address validation → checkout review → post-payment confirmation)
- Customer qualification flow (lib/customer-qualification.ts, components/qualification-flow.tsx) with 7 verbatim Appendix A.5 attestations + 6 institutional roles
- assertMarketingCopySafe runtime filter with ~40 forbidden patterns
- No BAC water, no Tirzepatide, no Semaglutide/Retatrutide, no GLP-1
- No fake reviews, no testimonials, no before/after imagery
- No direct Stripe / PayPal / Square / Shopify-Payments rails

### Payment

- BTCPay Server adapter (BTC, LTC; 15% discount)
- Plaid ACH adapter (5% discount; 3-4 day clearance)
- Stub adapter for dev (deterministic mock)
- Webhook routes at `/api/payments/btcpay/webhook` and `/api/payments/plaid/webhook` with HMAC-SHA256 signature verification (constant-time compare)
- Idempotent reconciliation by intent.id; backward state transitions rejected
- Phase 2 cards (MESH/MAX/Rocketfuel) deferred to Day 90+

### Customer Acquisition (operator runbook)

- `docs/operator-runbook.md` covers Day-1 / Weeks 2-4 / Months 2-3 / Avoid prioritization
- Day-1 wedge: Tier S clinical-credentialed creator outreach (5-10 micro-creators, RN/PA-C/MD/DC, $300-$1K + 20% commission/90-day cookie)
- Slice 3 community channels (Reddit, Meso-Rx, anabolic forums, Telegram, Discord) marked PLACEHOLDER until operator fires B1 prompt at ChatGPT Pro Deep Research

### Tech Stack

- Next.js 16.2.6 (Turbopack build)
- React 19.2.4, TypeScript 5
- Tailwind v4
- Supabase (stubbed Day-1; operator wires real project)
- Vercel hosting + Sentry monitoring (stubbed Day-1)
- Resend email (stubbed Day-1)
- Vitest + Playwright (E2E scaffolds with test.skip until browser available)
- Husky + 3 pre-commit gate scripts

### Verification

- 304 unit tests (25 files) — all passing
- Build: 50 static pages generated, 38 routes total
- Lint: 0 errors, 0 warnings
- Typecheck: clean
- All 3 supply-chain gate scripts: 0 violations
- All 14 applicable Iron Laws verified (2.1-2.16; 2.17 N/A this build)
- 0 critical findings in self-applied /review + /cso + /codex review (Phase 13)

### Operator Pre-Launch Checklist

See `docs/operator-runbook.md` for the 10-item pre-launch checklist (domain, USPTO, LLC, supplier, lab partner, credentials, COA PDFs, Vercel link, DNS, optional buyer conversations).
