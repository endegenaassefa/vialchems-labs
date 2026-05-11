# v4 Phase 13 — Final state handoff

**Date:** 2026-05-10
**Branch:** main
**Predecessor:** d860e18 (Phase 12 deploy-scaffolding checkpoint)
**Spec:** SUPER_PROMPT_v4 §11 Closing Contract
**North Star reload:** every Iron Law from 2.1 → 2.27.

This checkpoint marks the agent-side end of the v4 pass. The remaining
work is operator-side (deploy + first-buyer dollar). Phase 13 docs are
in place so the operator can drive the deploy + verification without
further agent help.

## What shipped (Phases 0-13)

| Phase | Subject | Delta vs v1.0.0 |
|---|---|---|
| 0 | Preflight + agentic toolkit | (already shipped before v4 build started) |
| 1 | Design tokens additive | shadows / gradients / sp-7xl/8xl / surface-elevated / accent-deep / component-tier |
| 2 | UI primitive overhaul | Toast / Dialog / Sheet / Skeleton / EmptyState / Pill kind extension; Button buttonClassNames helper |
| 3 | Home polish | Card variant=elevated on Recovery CTA; buttonClassNames for hero |
| 4 | Shop + PDP + COA polish | Vial withLabel + Iron Law 2.7 catalog whitelist; PDP price strip elevated; COA detail BRAND→COMPOUND→DOSE→BATCH hierarchy |
| 5 | Checkout + account + order polish | Dialog + Toast on AccountOrderDetail; checkout step transitions |
| 6 | Legal + content + aux polish | FAQ details elevation; Toast on Contact + Affiliate forms |
| 7 | Motion & interaction | motion 12.38.0 dep; StaggerReveal × 4 surfaces; RecoveryStackSheen; PlaceOrderButton; NewsletterForm; reduced-motion contract |
| 8 | A11y lift | @axe-core/playwright; CheckoutSteps aria-current + role=status live region |
| 9 | Perf + SEO | @next/bundle-analyzer; JSON-LD Product/Breadcrumb/Article/FAQPage; sitemap; robots; default + per-product OG via next/og |
| 10 | Services wiring | Supabase 15-table schema + RLS + access route; Resend; Sentry; Plaid JWKS structural pre-flight; BTCPay Greenfield POST; CookieConsent |
| 11 | E2E + Lighthouse + visual baseline | jose ES256 verify; Playwright unskip; 114-snapshot dark baseline; lighthouserc; e2e + lighthouse CI workflows |
| 12 | Deploy scaffolding | vercel.json security headers; .vercelignore; setup-branch-protection.sh; DNS guide; runbook; v1.1.0 tag |
| 13 | Documentation + canary | DESIGN.md (D26); canary script; operator-runbook v2; first-payment-verification spec |

## Deferral ledger — final state

```
✓ D1   Resend wire                           (Phase 10.2)
✓ D2   Supabase magic-link auth              (Phase 10.1)
✓ D3   Order persistence                     (Phase 10.1)
✓ D4   Customer qualification persistence    (Phase 10.1)
✓ D5   Email subscriptions                   (Phase 10.1)
✓ D6   Audit log                             (Phase 10.1)
✓ D7   /api/access route                     (Phase 10.1)
✓ D8   Plaid createIntent                    (Phase 10.4 scaffold + Phase 11.1 ES256)
✓ D9   Plaid HMAC → JWKS                     (Phase 10.4 + Phase 11.1)
✓ D10  BTCPay Greenfield POST                (Phase 10.5)
✓ D11  BTCPay Server provisioning            (Phase 10.5 docs + Voltage Cloud alt)
✓ D12  Sentry instrumentation                (Phase 10.3)
✓ D13  Sentry alert spec                     (Phase 10.3)
✓ D14  Cookie consent banner                 (Phase 10.6)
✓ D15  Layer 3 jurisdictional guard          (Phase 10.1)
✓ D16  E2E Playwright unskip                 (Phase 11.2)
✓ D17  Lighthouse CI gate                    (Phase 11.4)
○ D18  Vercel production deploy              (operator — runbook ready)
○ D19  Domain registration + DNS             (operator — DNS guide ready)
○ D20  LLC formation + EIN                   (operator — env-var update path ready)
○ D21  Lab partner contract                  (operator — Janoshik default placeholder)
○ D22  First-batch real COA PDFs             (operator — placeholder PDFs flagged)
○ D23  First-buyer test dollar               (operator — verification spec ready)
✓ D24  Branch protection                     (Phase 12.2 — script ready)
✓ D25  Visual-regression baseline + diff CI  (Phase 11.3)
✓ D26  DESIGN.md at repo root                (Phase 13.1)
✓ D27  Component-level CSS vars              (Phase 1)

Out-of-v4-scope (operator-side post-launch):
- D-OPS-1  Slice 3 community-channel research (operator's ChatGPT Pro deep research)
- D-OPS-2  KPV catalog expansion (Day-30+ candidate)
- D-OPS-3  Cards Phase-2 rail (Day-90+ after first revenue signal)
- D-OPS-4  New brand-pick reconfirmation (60-min buyer conversations)
- D-OPS-5  Second blog-post wave + content cadence
```

21/27 deferrals closed by the agent. The 6 still-open are pure
operator-side actions (domain purchase, deploy auth, first-dollar
test, lab contract, COA PDFs, LLC formation).

## Iron Laws — comprehensive verification

| # | Iron Law | Status | Evidence |
|---|---|---|---|
| 2.1 | TDD | ✓ | RED→GREEN cycles for every new lib/component this round; 457 unit tests |
| 2.2 | Verification before completion | ✓ | Every checkpoint records fresh `npm test` + `npm run build` + `npm run preflight` output |
| 2.3 | Root cause investigation | ✓ | Phase 11 contrast fix traced to actual axe-core finding; not symptom-suppress |
| 2.4 | No human-consumption / therapeutic copy | ✓ | grep-forbidden-words.sh 0 hits; verbatim regrep all-match |
| 2.5 / 2.19 | Protected paths review + cso | ✓ | SCANNER_OK on 4 protected-path commits; protected-files diff vs v1.0.0 = 0 lines on catalog/compliance/qualification/attestation |
| 2.6 | Design + plan review per phase | ✓ | 13 checkpoint artifacts on disk |
| 2.7 | Carve-out compounds excluded | ✓ | Catalog whitelist sourced from products.ts; Vial assertCompoundAllowed |
| 2.8 | Block list + Layer 3 guard | ✓ | jurisdictions.ts + reconciliation.ts assertOrderJurisdictionAllowed |
| 2.9 / 2.20 | No Stripe/PayPal/Square; PaymentProviderId frozen | ✓ | type union frozen; 3-rail universe |
| 2.10 | No reviews / testimonials | ✓ | No Review component; About narrative is third-person evidence-first |
| 2.11 | No GLP-1 obfuscated SKU naming | ✓ | All 7 canonical names |
| 2.12 | No Mogtrix branding | ✓ | grep-mogtrix.sh 0 non-attribution hits |
| 2.13 | No claim-crossover hedging | ✓ | compliance.ts therapeutic-verb regex |
| 2.14 | No reconstitution kit bundling | ✓ | format='vial' only; bundle is Recovery Stack vials only |
| 2.15 | TDD checkpoint commits | ✓ | RED + GREEN commit messages with verbatim FAIL/PASS snippets |
| 2.16 | Pre-commit supply-chain scanner | ✓ | All 3 hooks pass on every commit |
| 2.17 | Agent-introspection on 3+ failed fixes | ✓ N/A | No fix loops triggered this round |
| 2.18 | No aesthetic regression | ✓ | 114-snapshot baseline + Lighthouse CI gate |
| 2.21 | Tokens additive (interpretation: no renames) | ✓ | textSubtle alpha bump for a11y is value-tightening, not rename |
| 2.22 | No real credentials in source | ✓ | All gates default OFF; .env.example placeholders only |
| 2.23 | Cookie consent contract | ✓ | necessary always on; opt-in default; GPC honored; first-party persist |
| 2.24 | No .skip / .only on E2E | ✓ | CI grep guard fails build on hits |
| 2.25 | Visual diffs require operator approval | ✓ | CODEOWNERS for snapshots dir + PR-comment artifact upload |
| 2.26 | Brand expression LOCKED | ✓ | --bg / --accent / typography stack untouched |
| 2.27 | Lighthouse CI ≥ 90/95/95/95 | ✓ | lighthouserc.cjs + lighthouse.yml workflow PR-blocking |

## Verbatim copy regrep (final)

| Pattern | File | Hits | Expected |
|---|---|---|---|
| `21+ years of age` | `app/checkout/review/ReviewPanel.tsx` | 1 | 1 |
| `research use only (RUO)` | `app/checkout/review/ReviewPanel.tsx` | 1 | 1 |
| `qualified researcher acquiring` | `lib/customer-qualification.ts` | 1 | 1 |
| `For research use only. Not for human or veterinary use` | `app/products/[slug]/page.tsx` | 2 | 2 |
| `are not for human consumption` | `components/SiteFooter.tsx` | 1 | 1 |

`git diff v1.0.0..HEAD` on the verbatim source files
(`lib/compliance.ts`, `lib/customer-qualification.ts`,
`lib/attestations.ts`, `lib/content/products.ts`,
`lib/content/product-descriptions.ts`): **0 lines**.

## Test + build + preflight final state

```
Unit (Vitest):       457 passed (42 files)         (was 304)
E2E (Playwright):    136 passed (4 files; 114 visual baseline + 20 a11y + 2 checkout)
Build:               50 static + 38 routes + sitemap.xml + opengraph-image
Preflight scanners:  mogtrix 0  / forbidden-words 0  / supply-chain 0
Largest gz chunk:    70.9 KB
Motion-bearing chunk: 49.5 KB (within Iron Law 2.27 budget)
Bundle total:        ~1.9 MB raw / ~400 KB gzipped (.next/static/)
```

## Git state

- **Tag (local):** `v1.1.0` annotated, pointing at HEAD
- **Tag push:** deferred to operator; `git push origin v1.1.0` after deploy
- **Commits since v1.0.0:** 54+
- **Branch:** `main` (no other branches active)

## Operator handoff sequence

When ready, the operator runs (in order):

1. Register `vialchemlabs.com` per `docs/deploy/dns.md`
2. Configure DNS records per `docs/deploy/dns.md` Step 2 + Resend
3. Fill `/tmp/vialchemlabs_credentials.txt` per Appendix AA
4. `npx vercel login` + `npx vercel link`
5. `npx vercel env add` × ~30 keys per `docs/deploy/runbook.md` §2
6. `npx supabase db push` to apply the 15-table migration
7. `npx vercel --prod` first deploy
8. `npx vercel domains add vialchemlabs.com` (auto-issues LE cert)
9. `bash scripts/setup-branch-protection.sh`
10. Provision 5 Sentry alert rules per Phase 10.3 spec
11. `git push origin v1.1.0`
12. Run `docs/deploy/first-payment-verification.md` Tests 1-4
13. Flip `PAYMENT_PROVIDER` env from `stub` to `btcpay` (or `plaid`)
14. `bash scripts/canary.sh https://vialchemlabs.com` for 2-hour soak
15. Schedule Week-+1 retrospective

## Definition of done

```
[✓] Codebase ships v4 pass per SUPER_PROMPT_v4 §11 closing contract
[✓] All 27 Iron Laws verified or N/A
[✓] 21/27 deferrals closed; 6 remaining are operator-only
[✓] Test count: 304 → 457 unit + 0 → 136 E2E
[✓] Visual-regression baseline: 114 snapshots committed
[✓] CI gates: e2e + lighthouse workflows wired PR-blocking
[✓] Deploy artifacts: vercel.json + runbook + DNS guide + branch-
    protection script
[✓] Verbatim compliance copy intact (0 lines diff vs v1.0.0)
[✓] Zero real credentials in repo or commit history
[✓] v1.1.0 tag created; CHANGELOG entry covers all v4 phases
[✓] DESIGN.md derived from tokens + globals + Posture A canon (D26)
[✓] Operator runbook v2 + first-payment verification spec on disk
```

The agent's work for v4 is complete. The remaining 6 deferrals
(D18 / D19 / D20 / D21 / D22 / D23) are all operator-side. When
they land + the first-buyer dollar settles + the canary runs clean
for 2 hours, v4 closes.

## Retrospective scheduling

Recommended retro cadence (post-launch):
- **Week +1**: 60 min — what shipped, what surprised, what to fix in
  v4.1. Use gstack `/retro` skill.
- **Week +2**: 30 min — first 14-day metrics review (orders, errors,
  Lighthouse, traffic shape).
- **Day +30**: 90 min — KPV catalog expansion decision (D-OPS-2),
  Phase-2 cards rail go/no-go (D-OPS-3), Slice 3 community-channel
  research kickoff (D-OPS-1).
- **Day +90**: 60 min — semaglutide / retatrutide carve-out review
  (Iron Law 2.7 allows operator override after Day-90 FDA enforcement
  signal review).

Each retro lands as `docs/retros/v4_<date>.md`.
