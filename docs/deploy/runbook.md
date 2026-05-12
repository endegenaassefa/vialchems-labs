# Vercel deployment runbook

Phase 12.4 (v4) — D18 closure (Vercel production deploy procedure).

This runbook walks the operator from "I have credentials" to "vialchemlabs.net is live and serving production traffic".

## 0 — Pre-launch checklist

Before running any of the steps below, verify all of these are true:

- [ ] `npm ci && npm test && npm run build && npm run preflight` all green locally on `main`
- [ ] `git status` is clean (no uncommitted changes)
- [ ] `vialchemlabs.net` (or fallback) is registered + DNS records configured per `docs/deploy/dns.md`
- [ ] Appendix AA Operator Credential Intake form filled at `/tmp/vialchemlabs_credentials.txt`
- [ ] LLC formation done OR `LLC_NAME` placeholder accepted Day-1 (legal banner says "(TBD)" until updated)
- [ ] Lab partner contract with Janoshik Analytical signed OR placeholder COA flow accepted
- [ ] Sentry org + project created
- [ ] Resend account created + sender domain `vialchemlabs.net` verified
- [ ] Plaid account in sandbox mode (production access can wait until Phase 13 first transfer)
- [ ] BTCPay Server self-hosted OR Voltage Cloud instance up at `btcpay.<your-domain>`
- [ ] Cookie consent provider chosen (`self-hosted` is the Day-1 default)

## 1 — `vercel link`

One-time interactive auth + project creation.

```bash
cd /root/peptide-site
npx vercel login          # opens browser; sign in
npx vercel link           # interactive: create new project named "vialchemlabs"
```

After link, a `.vercel/project.json` lands at the repo root. Add it to
`.gitignore` if not already (it usually is — Vercel sets `git`-aware
defaults).

## 2 — Apply env vars

Read each value from `/tmp/vialchemlabs_credentials.txt` (Appendix AA) and
add it to Vercel via `vercel env add <NAME> production`. The CLI
prompts for the value securely — don't paste secrets into shell
history or scripts.

The order matters for some flows; follow this sequence:

```bash
# Site basics
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add BRAND_DOMAIN production
vercel env add LLC_NAME production
vercel env add LLC_JURISDICTION production

# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add REQUIRE_SUPABASE production       # value: true

# Resend
vercel env add RESEND_API_KEY production
vercel env add ORDER_EMAIL_FROM production       # value: research@vialchemlabs.net
vercel env add ORDER_STAFF_EMAILS production
vercel env add REQUIRE_RESEND production         # value: true

# Sentry
vercel env add NEXT_PUBLIC_SENTRY_DSN production
vercel env add SENTRY_AUTH_TOKEN production
vercel env add SENTRY_ORG production
vercel env add SENTRY_PROJECT production

# Plaid
vercel env add PLAID_CLIENT_ID production
vercel env add PLAID_SECRET production
vercel env add PLAID_ENV production              # value: sandbox first, production after Phase 13
vercel env add PLAID_VERIFICATION_MODE production # value: jwks (Phase 11.1 wired ES256)

# BTCPay
vercel env add BTCPAY_URL production
vercel env add BTCPAY_API_KEY production
vercel env add BTCPAY_STORE_ID production
vercel env add BTCPAY_WEBHOOK_SECRET production

# Cookie consent
vercel env add COOKIE_CONSENT_PROVIDER production # value: self-hosted

# Payment provider selection — leave at 'stub' for first deploy;
# flip to btcpay or plaid only after Phase 13 verification.
vercel env add PAYMENT_PROVIDER production       # value: stub
```

**After every value is set:** delete `/tmp/vialchemlabs_credentials.txt`
(Iron Law 2.22 — credentials live ONLY in Vercel + .env.local).

## 3 — Add the production domain

```bash
npx vercel domains add vialchemlabs.net
```

The CLI returns the DNS records to set. If you already configured DNS
per `docs/deploy/dns.md`, this should immediately succeed and Vercel
issues a Let's Encrypt cert within ~60s.

If using a fallback domain (`vialchemlabs.bio` etc.), add it the same way
and update `NEXT_PUBLIC_SITE_URL` in Vercel env.

## 4 — Apply Supabase migration

```bash
npx supabase login                                # interactive
npx supabase link --project-ref <project-ref>     # links local supabase/ dir
npx supabase db push                              # applies supabase/migrations/20260510000001_init.sql
```

Verify in Supabase dashboard → Database → Tables that all 15 tables
exist + RLS is enabled on every PII surface.

## 5 — First deploy

```bash
npx vercel --prod
```

This builds the production bundle and deploys to `https://vialchemlabs-<hash>.vercel.app`
THEN promotes to `https://vialchemlabs.net`. Watch the Vercel dashboard
for build progress; ~3-5 min on a clean build.

Expected build output:

```
✓ Compiled successfully
✓ Generating static pages (50/50)
Route (app)
├ ○ /
├ ○ /shop
├ ● /products/[slug]
... 38 routes total ...
```

If the build fails, the most common causes:

- A REQUIRE\_\* env var is true but the dependent secret is empty → fix the env value
- Supabase migration not applied → run step 4 first
- Sentry source-map upload failure → set `SENTRY_AUTH_TOKEN` or remove from env temporarily

## 6 — Post-deploy verification

```bash
# Health endpoint
curl -s https://vialchemlabs.net/api/health

# Sitemap
curl -sI https://vialchemlabs.net/sitemap.xml | head -5

# robots.txt
curl -s https://vialchemlabs.net/robots.txt | head -5

# Cookie consent Cookie-only render
curl -s https://vialchemlabs.net/ | grep -c "vc-consent" || echo "no cookie banner in SSR HTML (expected — client-only)"

# Per Iron Law 2.27 — Lighthouse spot-check
npx lighthouse https://vialchemlabs.net/ --view
```

All four routes should return `200`. Lighthouse scores should clear
the 90/95/95/95 thresholds (CI gate enforces on every PR going forward).

## 7 — Branch protection

```bash
gh auth login                                     # interactive
REPO=endegenaassefa/vialchemlabs bash scripts/setup-branch-protection.sh
```

Verify in GitHub repo Settings → Branches → `main` shows the protection
rules + required checks.

If the required-checks list shows "Not found" for some workflows, that
means those workflows haven't run yet. Open a small PR (e.g.,
documentation tweak) to trigger them, let them complete, then re-run
the script.

## 8 — Sentry alerts

In the Sentry dashboard, create alert rules per the spec table in
`docs/checkpoints/v4_phase_10_services.md` §10.3:

| Metric                    | Threshold               | Action             |
| ------------------------- | ----------------------- | ------------------ |
| Error rate (any)          | > 1% over 5 min         | page on-call       |
| Payment-flow errors       | > 0.1% over 15 min      | page on-call       |
| Webhook signature failure | any in 1 min            | warn + investigate |
| LCP regression            | > 4.0 s p75 over 10 min | warn + investigate |
| 5xx rate                  | > 0.5% over 5 min       | page on-call       |

Verify alerts fire by triggering a test error from the dashboard's
"Send test alert" button.

## 9 — v1.1.0 tag

```bash
git tag -a v1.1.0 -m "v1.1.0 — vialchemlabs production launch"
git push origin v1.1.0
```

GitHub will surface the tag at `https://github.com/endegenaassefa/vialchemlabs/releases/tag/v1.1.0`.
Edit the release body to paste the CHANGELOG `## [1.1.0]` section.

## Rollback procedure

If a deploy goes bad:

```bash
npx vercel rollback                               # interactive: pick previous deployment
```

OR via the Vercel dashboard → Deployments → previous → "Promote to
Production".

Rollback typically completes in <30s. After rollback:

1. Capture the failure: Sentry → Issues, sorted by `firstSeen`
2. Open a hotfix branch off `main`
3. Fix root cause (Iron Law 2.3 — no symptom-fix patches)
4. Run the full Phase 11 CI gate
5. Re-deploy
6. Document the incident at `docs/checkpoints/v4_incident_<date>.md`

## Maintenance windows

Recommended:

- 02:00-04:00 UTC Tuesdays for Supabase migrations
- 03:00-05:00 UTC any weekday for non-breaking deploys
- Avoid Friday afternoon deploys

## Incident escalation

1. Sentry pages on-call → on-call investigates within 15 min
2. If not resolved in 30 min: rollback per the procedure above
3. If rollback insufficient: invoke `MAINTENANCE_MODE=true` env var
   (handled in `lib/maintenance.ts` — Phase 12.5 deliverable; serves
   a static "Be right back" page)
4. Post-incident: write `docs/checkpoints/v4_incident_<date>.md`
   within 48 hours
