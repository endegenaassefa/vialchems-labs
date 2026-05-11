# v4 Phase 12 — Deploy scaffolding (operator gate)

**Date:** 2026-05-10
**Branch:** main
**Predecessor:** f3da074 (Phase 11 E2E + Lighthouse checkpoint)
**Spec:** SUPER_PROMPT_v4 §8 PHASE 12
**North Star reload:** Iron Laws 2.22, 2.24, 2.25, 2.27.

## Goal

Scaffold every artifact and operator-side instruction needed for the
production deploy of `vialchemlabs.com`. The actual deploy itself is an
operator action (interactive `vercel login` + credential intake +
`vercel --prod`); the agent never touches credentials per Iron Law 2.22.

## Subphase ledger

### 12.1 — Vercel project scaffolding

`vercel.json`:
- `framework: nextjs`, region `iad1`, `npm run build` + `npm ci`
- Security headers: HSTS preload (63072000), X-Frame-Options DENY,
  X-Content-Type-Options nosniff, strict Referrer-Policy,
  Permissions-Policy disabling geolocation/microphone/camera (allowing
  payment=self for future Phase 2 card rails)
- Cache policy: `no-store` on payment webhooks + `/api/access`;
  1h browser / 24h CDN on `/sitemap.xml`; 24h on `/robots.txt`;
  5min/1h on COA pages
- Permanent redirects: `/products` → `/shop`, `/research` → `/blog`

`.vercelignore` keeps `.git`, `docs/`, `tests/`, screenshots,
research corpus, and env files out of the deploy slice.

### 12.2 — Branch-protection script (closes D24)

`scripts/setup-branch-protection.sh`:
- One-shot bash script using `gh` CLI; idempotent
- Required CI checks: `e2e / unit-and-preflight`, `e2e / e2e`,
  `lighthouse / lighthouse (desktop)`, `lighthouse / lighthouse (mobile)`
- Required review: 1 approval + dismiss-stale-reviews +
  require-last-push-approval
- Linear history enforced; force-push + branch-deletion blocked
- Conversation resolution required
- `.github/CODEOWNERS` written to require operator review on:
  - `tests/e2e/visual-regression.spec.ts*` (Iron Law 2.25)
  - `lib/payments/**` (Iron Law 2.5 / 2.19)
  - `lib/compliance.ts` + `lib/compliance/jurisdictions.ts`
  - `lib/customer-qualification.ts` + `lib/attestations.ts`
  - `lib/content/products.ts` + `lib/content/product-descriptions.ts`
  - `app/api/payments/**` + `app/api/access/**`
  - `supabase/migrations/**`
  - `components/CookieConsent.tsx` + `lib/consent-store.ts`
  - `lib/sentry.ts`

Operator runs after `vercel link` lands: `bash scripts/setup-branch-protection.sh`.

### 12.3 — DNS + registrar guide (closes D19)

`docs/deploy/dns.md`:
- Recommended registrar ranking (Cloudflare > Gandi > 101domain > Namecheap;
  GoDaddy explicitly avoided)
- Apex + www records (A/CNAME via Vercel's `cname.vercel-dns.com.` or
  Cloudflare/Gandi ALIAS apex)
- Required additional records: SPF (Resend `_spf.resend.com`), DKIM
  (Resend dashboard supplies), DMARC (`p=quarantine` opener, tighten
  to `p=reject` after 7-day rua review), CAA (Let's Encrypt + DigiCert)
- Resend 4-record sender domain verification flow
- Fallback domains: `vialchemlabs.bio`, `vialchemlabs.com`, `vialchemlabs.co`
- `dig` verification commands

### 12.4 — Deployment runbook (closes D18 procedure)

`docs/deploy/runbook.md`: 9-step procedure
1. Pre-launch checklist (12 boxes)
2. `vercel link` interactive auth
3. `vercel env add` for ~30 keys per Appendix AA, in dependency order
4. `vercel domains add vialchemlabs.com`
5. Supabase migration push (`supabase db push` against linked project)
6. First production deploy (`vercel --prod`)
7. Post-deploy verification (health endpoint + sitemap + robots +
   Lighthouse spot-check)
8. `bash scripts/setup-branch-protection.sh`
9. Sentry alert provisioning per Phase 10.3 thresholds table

Plus rollback procedure (`vercel rollback` OR dashboard promote),
maintenance window recommendations, incident escalation flow with
`MAINTENANCE_MODE=true` env-var fallback.

### 12.5 — v1.1.0 release prep

- `package.json` version bumped 1.0.0 → 1.1.0
- `CHANGELOG.md` `## [1.1.0]` entry (~140 lines) covering every v4
  phase + every closed deferral + Iron Laws 2.18-2.27 + test count
  growth (304 → 457 unit, 0 → 136 E2E)
- Annotated git tag `v1.1.0` created locally; push deferred to
  operator at end of deploy procedure (`git push origin v1.1.0`)

## Test coverage

No new tests this phase — pure scaffolding + documentation.
Existing 457 unit + 136 E2E tests still pass.

## Iron Laws verified

| # | Iron Law | Phase 12 evidence |
|---|---|---|
| 2.1 | TDD | Pure scaffolding phase; no production-code changes that need RED→GREEN |
| 2.2 | Verification before completion | Final `npm test` + `npm run build` + `npm run preflight` re-run |
| 2.5 / 2.19 | Protected paths | Zero protected files modified; commit-body annotation confirms |
| 2.16 | Pre-commit supply-chain scanner | Hooks ran on every commit; 0 violations |
| 2.22 | No real credentials in source | Every credential reference is a placeholder + a runbook step |
| 2.24 | No `.skip` / `.only` in CI E2E | `setup-branch-protection.sh` makes the CI gate part of branch protection |
| 2.25 | Visual diffs require operator approval | CODEOWNERS for `tests/e2e/visual-regression.spec.ts*` enforces operator review |
| 2.27 | Lighthouse CI gate | Required CI check enforced via branch protection |

## Verbatim copy regrep (Iron Law 2.4 / 2.13)

| Pattern | File | Hits | Expected |
|---|---|---|---|
| `21+ years of age` | `app/checkout/review/ReviewPanel.tsx` | 1 | 1 |
| `research use only (RUO)` | `app/checkout/review/ReviewPanel.tsx` | 1 | 1 |
| `qualified researcher acquiring` | `lib/customer-qualification.ts` | 1 | 1 |
| `For research use only. Not for human or veterinary use` | `app/products/[slug]/page.tsx` | 2 | 2 |
| `are not for human consumption` | `components/SiteFooter.tsx` | 1 | 1 |

## Operator handoff

Phase 12 is the **second operator gate** (Phase 10 was the first). The
agent has done everything that doesn't need credentials. The operator
must now:

1. **Register `vialchemlabs.com`** at the chosen registrar (per
   `docs/deploy/dns.md`)
2. **Configure DNS** records (per `docs/deploy/dns.md` Step 2 + 4)
3. **Fill `/tmp/vialchemlabs_credentials.txt`** per Appendix AA
4. **Run `npx vercel login`** (interactive)
5. **Run `npx vercel link`** (interactive — creates project)
6. **Run the env-add sequence** from `docs/deploy/runbook.md` §2
7. **Push the Supabase migration** (`npx supabase db push`)
8. **Deploy** (`npx vercel --prod`)
9. **Add the domain** (`npx vercel domains add vialchemlabs.com`)
10. **Apply branch protection** (`bash scripts/setup-branch-protection.sh`)
11. **Provision Sentry alerts** per Phase 10.3 thresholds table
12. **Push the tag** (`git push origin v1.1.0`)

After step 12, Phase 13 (real-payment verification) begins.

## Open notes for downstream phases

- **Phase 13 — first-buyer dollar verification**:
  - Operator funds first $1 BTCPay invoice; confirms webhook → reconcile →
    `audit_log` row appears
  - Operator initiates first $1 Plaid ACH transfer; same chain
  - Once both succeed, flip `PAYMENT_PROVIDER` env from `stub` to one of
    `btcpay` / `plaid` (or leave as `stub` for the first weekend and
    promote based on traffic shape)
- **Phase 14+ (post-launch)**:
  - Submit `https://vialchemlabs.com/sitemap.xml` to Google Search
    Console + Bing Webmaster Tools
  - Configure Vercel Analytics
  - Schedule Week-+1 retrospective
  - DESIGN.md docs pass (D26 — optional, deferred from Phase 1)

## Verification gate

- [x] `vercel.json` shipped with security headers + cache policies
- [x] `.vercelignore` keeps deploy slice tight
- [x] `scripts/setup-branch-protection.sh` executable + idempotent
- [x] `docs/deploy/dns.md` per-registrar coverage
- [x] `docs/deploy/runbook.md` 9-step end-to-end procedure
- [x] `package.json` 1.0.0 → 1.1.0
- [x] `CHANGELOG.md` `## [1.1.0]` entry
- [x] Annotated git tag `v1.1.0` created locally (push deferred)
- [x] `npm test` 457/457
- [x] `npm run build` clean
- [x] `npm run preflight` 0 violations
- [x] `git diff v1.0.0..HEAD` on catalog/compliance files: 0 lines
- [x] Verbatim copy regrep: 1/1/1/2/1
- [x] Checkpoint artifact written

## Exit criteria

Codebase is deploy-ready. Every artifact, script, and runbook for the
production deploy of `vialchemlabs.com` is on disk. The operator has a
complete, sequential procedure documented. Iron Laws 2.22 + 2.24 +
2.25 + 2.27 are enforceable as soon as branch protection lands.
Ready for Phase 13 (real-payment verification — operator-funded).
