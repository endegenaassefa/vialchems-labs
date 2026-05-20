# Phase 14 — Ship + Deploy (CHECKPOINT)

Date: 2026-05-08
Status: GitHub COMPLETE; Vercel deferred to operator action

## GitHub

**Repository**: https://github.com/<operator-github>/vialchemlabs
**Visibility**: PRIVATE (operator may flip to public post-launch)
**Tag**: v1.0.0
**Branch**: main (default)
**Commit count**: 16 (Phase 0 bootstrap → Phase 14 ship)

## Vercel deploy — operator action required

The build cannot complete autonomous deploy because:

1. Vercel CLI requires interactive auth flow (`vercel login`) tied to operator's account
2. Production env vars must be set in Vercel dashboard (operator's choice for project name, region, env-var rotation)
3. `vialchemlabs.net` domain registration + DNS pointing requires operator's registrar account

### Step-by-step Vercel deploy procedure

```bash
cd /root/peptide-site

# 1. Authenticate Vercel CLI (interactive; opens browser)
vercel login

# 2. Link the project to a new Vercel project
vercel link
# Prompts:
#   - Set up and deploy? → yes
#   - Scope (team / personal) → operator chooses
#   - Link to existing project? → no
#   - Project name → vialchemlabs
#   - Code root → ./
#   - Auto-detected framework Next.js → confirm

# 3. Add production env vars (one-time; replace stubs with real values)
vercel env add NEXT_PUBLIC_SITE_URL production
# paste: https://vialchemlabs.net (or fallback domain)
vercel env add BRAND_NAME production
# paste: vialchemlabs
vercel env add BRAND_DOMAIN production
# paste: vialchemlabs.net

# Supabase (real cloud project required)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Resend (real account + verified domain required)
vercel env add RESEND_API_KEY production
vercel env add ORDER_EMAIL_FROM production
# paste: research@vialchemlabs.net
vercel env add ORDER_STAFF_EMAILS production

# Sentry (real project required for error monitoring)
vercel env add NEXT_PUBLIC_SENTRY_DSN production
vercel env add SENTRY_AUTH_TOKEN production
vercel env add SENTRY_ORG production
vercel env add SENTRY_PROJECT production

# Plaid (real client + secret + verification key)
vercel env add PLAID_CLIENT_ID production
vercel env add PLAID_SECRET production
vercel env add PLAID_ENV production  # production
vercel env add PLAID_WEBHOOK_VERIFICATION_KEY production

# BTCPay (self-hosted Docker provisioning required first; then keys)
vercel env add BTCPAY_URL production
vercel env add BTCPAY_API_KEY production
vercel env add BTCPAY_STORE_ID production
vercel env add BTCPAY_WEBHOOK_SECRET production

# LLC info (post-formation)
vercel env add LLC_NAME production
vercel env add LLC_JURISDICTION production

# Deploy strategy
vercel env add PAYMENT_PROVIDER production
# paste: btcpay (or plaid; controls default rail)

# 4. Deploy to production
vercel --prod

# 5. Configure custom domain
vercel domains add vialchemlabs.net
# Operator points DNS A or CNAME at Vercel target shown in output

# 6. Verify
curl https://vialchemlabs.net/api/health
# Expected: { "status": "ok", "service": "vialchemlabs", "time": "..." }

# 7. Smoke test
# Browser: open https://vialchemlabs.net, confirm:
#   - Hero renders with "Counted, weighed, verified."
#   - /shop loads with 7 SKUs + Recovery Stack bundle
#   - /products/bpc-157-10mg renders verbatim 336-345 word description
#   - /coa shows 7 placeholder batches
#   - /faq shows 20 Q+A
#   - /legal/terms loads
#   - Footer disclaimer block visible on every page
```

### Domain registration note

`vialchemlabs.net` is the operator-provided production domain.
It is currently delegated to Cloudflare nameservers. If registrar or
DNS hosting changes, repeat the Vercel domain inspection before launch.

Update `NEXT_PUBLIC_SITE_URL` env to match registered domain.

### LLC formation note

Operator should file LLC paperwork BEFORE first revenue order. Wyoming default per `LLC_JURISDICTION`. Manager-member structure isolates founder name from public records (Appendix U.5). Privacy WHOIS + LLC-name domain registration both feed legal isolation.

## Verification Gate

- [x] Pre-merge tests pass (304/304)
- [x] Build clean
- [x] VERSION bumped to 1.0.0
- [x] CHANGELOG written
- [x] README written
- [x] git tag v1.0.0 created and pushed
- [x] GitHub repo created (private) and pushed
- [ ] Vercel deploy — DEFERRED to operator (requires interactive auth)
- [ ] /api/health returns 200 on production URL — DEFERRED (post-deploy)
- [ ] Smoke test of full user journey on production — DEFERRED (post-deploy)

## Outstanding for Phase 15 entry (post-deploy monitoring)

Phase 15 (canary monitoring + Sentry verification + retro scheduling) executes after operator completes Vercel deploy. Procedure documented in operator runbook + this checkpoint.
