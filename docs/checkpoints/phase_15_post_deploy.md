# Phase 15 — Post-Deploy Monitoring + Documentation (CHECKPOINT)

Date: 2026-05-08
Status: PROCEDURE DOCUMENTED (executes after Vercel deploy completes)

## Pre-conditions

Phase 15 begins after operator completes:
1. Vercel deploy via `vercel --prod` (Phase 14)
2. Custom domain `vialchems.labs` (or fallback) pointed at Vercel
3. Real env vars rotated in Vercel (Supabase, Resend, Sentry, Plaid, BTCPay)

## Phase 15.1 — Canary monitoring (2-hour window post-deploy)

Run after `vercel --prod` completes successfully:

```bash
# 1. Health check (immediate)
curl https://vialchems.labs/api/health
# Expected: HTTP 200, JSON { "status": "ok", "service": "vialchems-labs", "time": "..." }

# 2. Browser smoke test (immediate, manual)
# Open https://vialchems.labs in 3 browsers:
#   - Chrome (desktop)
#   - Safari (iOS)
#   - Firefox (desktop)
# For each, confirm:
#   - Home hero renders
#   - /shop loads with 7 products + Recovery Stack
#   - /products/bpc-157-10mg PDP renders 336-345 word description
#   - /coa shows 7 placeholder batches
#   - /faq accordion expands
#   - /legal/terms full ToS loads
#   - SiteFooter disclaimer block visible on every page
#   - Newsletter signup form submits to /api/newsletter/subscribe

# 3. Performance baseline (Lighthouse CI)
# Run via Chrome DevTools or:
npx lighthouse https://vialchems.labs --output=json --quiet > /tmp/lh-home.json
npx lighthouse https://vialchems.labs/shop --output=json --quiet > /tmp/lh-shop.json
npx lighthouse https://vialchems.labs/products/bpc-157-10mg --output=json --quiet > /tmp/lh-pdp.json
npx lighthouse https://vialchems.labs/checkout/review --output=json --quiet > /tmp/lh-checkout.json
# Hard-fail thresholds per SUPER_PROMPT_v3 §7.1:
#   Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95
#   LCP < 2.5s, CLS < 0.1, INP < 200ms

# 4. Console error check (Sentry Issues dashboard)
# Visit https://sentry.io/organizations/<SENTRY_ORG>/issues/?project=<SENTRY_PROJECT>
# Verify:
#   - No errors in first 30 minutes post-deploy
#   - Error rate < 1% (alert threshold)
#   - Payment-flow error rate < 0.1% (page threshold)

# 5. Trigger test error to verify Sentry catches
# Visit https://vialchems.labs/api/contact with malformed POST
# Confirm Sentry receives the error within 2 minutes

# 6. Continuous canary (2 hours)
# Run every 10 minutes for 2 hours:
while true; do
  curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" https://vialchems.labs/api/health
  sleep 600
done
# Watch for any non-200 or > 2.0s response — investigate immediately
```

### Canary fail conditions (auto-rollback triggers)

If any of these fire in the 2-hour window:
- /api/health returns non-200 for >1 consecutive minute → rollback (`vercel rollback`)
- Lighthouse Performance < 80 on home → investigate; if regression vs preview, rollback
- Sentry error rate > 5% for >5 minutes → investigate
- Payment webhook signature verification failure detected → BLOCK new orders, investigate
- Any database connection failure → investigate (Supabase status page)

## Phase 15.2 — Documentation update (`/document-release`)

```bash
cd /root/peptide-site

# 1. Update CHANGELOG.md with deploy date + production URL
# Already covers v1.0.0; add deploy date once live:
#   ## [1.0.0] — 2026-05-08 (deployed YYYY-MM-DD to https://vialchems.labs)

# 2. Update README.md with production URL
# Add:
#   ## Live
#   https://vialchems.labs

# 3. Optional: write ARCHITECTURE.md (Phase 2 lock has all the content)
# cp docs/superpowers/plans/2026-05-08-architecture.md ARCHITECTURE.md

# 4. Commit + push
git add CHANGELOG.md README.md
git commit -m "docs: post-deploy update with production URL and deploy date"
git push
```

## Phase 15.3 — Sentry alert configuration

In Sentry dashboard:
1. **Alert: Error rate > 1%** → email operator + ops@vialchems.labs
2. **Alert: Payment-flow error rate > 0.1%** → page operator (PagerDuty or SMS)
3. **Alert: Webhook signature verification failure** → page operator immediately
4. **Alert: New error type detected (no occurrences in last 24h)** → email
5. **Performance alert: LCP > 4s on /shop or /products/[slug]** → email

## Phase 15.4 — Operator runbook handoff

Operator runbook lives at `docs/operator-runbook.md` (Phase 11 deliverable).

Day-1 operator workstreams (front-loaded):
1. Tier S clinical-credentialed creator outreach (5-10 micro-creators)
2. Affiliate listicle outreach (Outliyr, Muscle+Brawn, PepPal, Brainflow)
3. Newsletter signups → 4-email welcome sequence (will activate when Resend wired)
4. Defensive social handle registration (no active posting Day-1)
5. Founder-personal X cadence (weekly research-citation thread)
6. Submit sitemap to Google Search Console + Bing Webmaster Tools

## Phase 15.5 — Schedule retro for 1 week after launch

Set calendar reminder: 1 week after deploy date, run `/retro` against the production-launch week. Retro covers:
- What landed cleanly?
- What surprised? (e.g., Sentry errors, Lighthouse regressions, Tier S creator response rates)
- What was wrong about Phase 1-14 plan? (Iron Law 2.17 introspection territory)
- First-week metrics:
  - Page views (Vercel Analytics)
  - Newsletter signups
  - Checkout starts vs completes
  - Tier S creator outreach replies
  - First paid order from a stranger? (Bible §15 success criterion)
- Adjustments for Week 2

## Verification Gate (post-deploy operator-completed)

- [ ] /canary 2-hour window passes (no critical regressions)
- [ ] Sentry catches no critical errors above threshold
- [ ] Lighthouse Performance ≥ 90 / A11y ≥ 95 / SEO ≥ 95 / Best Practices ≥ 95
- [ ] Operator runbook reviewed by operator
- [ ] Sentry alert thresholds configured
- [ ] Retro scheduled for Week +1

## Status

Procedure documented; execution requires operator's deployed Vercel URL + Sentry project. All build-side artifacts ready for handoff.
