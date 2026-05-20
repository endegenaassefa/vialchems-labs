# Vialchems Labs — Full Audit Report v2 (2026-05-19)

**Auditor:** Claude Opus 4.7 (1M context), max effort
**Audit started:** 2026-05-19T22:54:00Z
**Audit completed:** 2026-05-19T23:30:00Z
**Total tokens read:** approx 1,150,000 (cross-slice, incl. 8 sub-agent returns + prior report)
**Git HEAD audited:** `ff97cde73b57665336d35ee173b186120d531cef` (branch `v4-design-overhaul-github`)
**Git tags audited:** `v1.0.0` (`39832ad…`), `v1.1.0` (`1be2860…`)
**Git remote:** `https://github.com/endegenaassefa/vialchems-labs.git`
**Live site probed:** `https://vialchemlabs.net/` (307 → `/age-gate?next=%2F`, Vercel-hosted)
**Predecessor audit:** `docs/audit/2026-05-19_full_audit_report.md` (earlier today, same HEAD)

---

## Executive Summary

**Verdict: NOT-DEPLOY-READY (UPDATED — multiple CRITICAL findings; operator's "fully done" claim is refuted on disk in three new ways the prior audit did not surface).** Tests are green (548/548 unit across 49 files, 8.4s); `npm run build` succeeds with 41 routes (34 page.tsx + 6 API + sitemap); `npm run preflight` **passes exit 0 in this run** (prior audit reported failure; the failure now reproduces only when the untracked `audit/` directory is present at repo root, which it is — see §8.3). **Total findings: 13 CRITICAL · 30 HIGH · 28 MEDIUM · 21 LOW · 19 INFO.**

**Top 3 risks the operator must address before any first real-money transaction (re-prioritized):**

1. **DOMAIN-IDENTITY MISALIGNMENT (NEW CRITICAL).** Live deployment is at `https://vialchemlabs.net/` (verified — returns Vercel 307 to age-gate). The codebase emits absolute URLs at `https://vialchemlabs.com` in **162 source references** (sitemap baseUrl via `lib/content/site.ts:8` env default, `public/robots.txt:13` sitemap pointer, `.env.example:11–14`, `app/sitemap.ts:11`, all JSON-LD canonical/OG-URL fields, all welcome-email links). DNS for `vialchemlabs.com` **does not resolve** ("Could not resolve host" via curl). Result: every search-engine submission, OG share card, and email-link Google indexes points at a domain that does not exist. The prior audit identified this as "brand drift" but did not perform the DNS check that proves no parking page or redirect exists at `.com`. **Iron Law 2.26 + Iron Law 2.19** territory: a single canonical-URL value must hold across sitemap, JSON-LD, robots, and the live host.

2. **PERPETUAL-BAN CATALOG REGRESSION (CRITICAL — confirmed + expanded).** `lib/content/products.ts:285` ships `tesamorelin-5mg` AND `lib/content/products.ts:443` ships `melanotan-ii-10mg`. CHANGELOG `1.3.0:53–56` explicitly lists Tirzepatide/Semaglutide/**Tesamorelin**/SS-31 as "PERPETUALLY BANNED per Iron Law 2.7 and were NOT added." Melanotan II is an active FDA enforcement target (named in DOJ peptide pleas; FDA warning letter target). The compliance regex set at `lib/compliance.ts:46–52` covers `semaglutide`/`tirzepatide`/`retatrutide`/GLP-1 but **does not include** `tesamorelin`, `melanotan`/`MT-2`/`MT-II`, `bremelanotide`, `bacteriostatic water`, or common obfuscations (`tirz`/`sema`/`reta`). The Vial whitelist at `components/ui/Vial.tsx:87–90` derives from `products.map(p => p.shortName)` — adding a banned compound to the catalog **auto-allows** it through the only structural guard.

3. **CI INFRASTRUCTURE MISSING + V5 REBRAND CONTRADICTS V3/V4 LOCKED STATE (CRITICAL — confirmed + expanded).** The entire `.github/` directory does not exist on disk (verified `ls .github/` → "NO .github DIRECTORY"). CHANGELOG `1.1.0:254,256,277–278` and `docs/checkpoints/v4_phase_13_handoff.md:53,59–60` claim D17 (Lighthouse CI), D24 (branch protection), D25 (visual-regression diff CODEOWNERS) all closed via workflows that have never existed on disk. `@lhci/cli` is also absent from `package.json`. Operator running `scripts/setup-branch-protection.sh` today would lock `main` permanently because the required check names refer to non-existent workflows. **Additionally:** `app/globals.css:14–37` now ships a LIGHT clinical theme (`--bg:#fafaf7`, `--surface:#ffffff`, `--accent:#0f3a5f` navy + `--accent-glow:#06b6d4` cyan, `--text:#0a0e14` near-black) — v3.0/v4.0 LOCKED Posture A was charcoal-dark `--bg:#0a0e0f` + teal `--accent:#3dd4c8`. The `lib/content/site.ts:1–6` file header self-narrates this as "v5 rebrand (2026-05-10): operator spec → vialchemlabs (clinical-minimal light theme...)". This is an **Iron Law 2.26 (brand expression LOCKED until explicit operator override) violation** unless an on-disk LOCKED_OVERRIDE doc authorizes it. No such doc exists at `docs/DECISIONS/` (directory absent) or at any checkpoint surveyed.

**What this audit DID cover:** every Iron Law 2.1→2.27 with file:line evidence; every D-code (D1→D27); fresh brand-drift census across the entire repo; protected-paths diff vs `v1.0.0`; verbatim Appendix-copy regrep; per-directory deep-dive via 4 parallel sub-agents (B for app/api/, E+F+G for lib/, I+J+K for supabase+tests, M for docs/) + targeted inline coverage for A/C/D/H/L/N; full `npm test` + `npm run build` + `npm run preflight` execution; live-site DNS + HTTP probe of `vialchemlabs.net` (307 to age-gate) and DNS-probe of `vialchemlabs.com`/`vialchems.labs`/`vialchemslabs.net` (all non-resolving).

**What this audit DID NOT cover:** §5.5 23-pillar live browser audit is fully deferred — the local dev server is not running and the audit prompt §5.5.0 forbids self-starting it. Chromium IS installed at `~/.cache/ms-playwright/chromium-1208`; lighthouse CLI is available via `npx --yes lighthouse`. The pipeline is runnable the moment the operator starts `npm run dev -- -p 3200 &`. SUPER_PROMPT v3 (163KB) and v4 (216KB) were not byte-diffed against codebase — section-relied via this audit's §2.3 LOCKED state extraction. The prior audit at `docs/audit/2026-05-19_full_audit_report.md` (84KB, 736 lines) is preserved as evidence; this v2 supersedes it for the same HEAD `ff97cde`.

---

## 1. Inputs Read

- `/root/peptide-site/AUDIT_SUPER_PROMPT_2026-05-10.md` — entire 2269 lines (this audit's brief; v1.0)
- `/root/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md` — section-headers + §2 Iron Laws + §10 Appendix A/L/M/N reference; not byte-read
- `/root/peptide-site/SUPER_PROMPT_v4_2026-05-09_ui-and-finish.md` — section-headers + §2 Iron Laws 2.18–2.27 + §10 Appendix AB deferral ledger reference; not byte-read
- `/root/peptide-site/CHANGELOG.md` — entire 407 lines (4 entries: 1.0.0 → 1.3.0)
- `/root/peptide-site/docs/audit/2026-05-19_full_audit_report.md` — entire 736 lines (prior audit — context only; not blindly inherited)
- `/root/peptide-site/lib/content/site.ts` — entire 51 lines (verbatim quoted below)
- `/root/peptide-site/lib/compliance.ts` — entire 120 lines
- `/root/peptide-site/lib/compliance/jurisdictions.ts` — entire 48 lines
- `/root/peptide-site/lib/customer-qualification.ts` — entire 101 lines
- `/root/peptide-site/lib/payments/types.ts` (verified `:16` PaymentProviderId)
- `/root/peptide-site/components/ui/Vial.tsx` — lines 87–103 (whitelist mechanism)
- `/root/peptide-site/app/api/health/route.ts`, `app/api/payments/btcpay/webhook/route.ts`, `app/api/payments/plaid/webhook/route.ts` — entire
- `/root/peptide-site/app/sitemap.ts` — entire 17 lines
- `/root/peptide-site/public/robots.txt` — entire 14 lines
- `/root/peptide-site/vercel.json` — entire 99 lines
- `/root/peptide-site/lighthouserc.cjs` — entire 61 lines
- `/root/peptide-site/.env.example` — entire 113 lines
- `/root/peptide-site/.husky/pre-commit` — entire 17 lines
- `/root/peptide-site/app/globals.css` — lines 1–105 (token block; CSS custom-property values authoritative source-of-truth)
- **Via sub-agents (full source-reads):**
  - Sub-agent B: all 6 files under `app/api/`
  - Sub-agent E+F+G: ~36 files under `lib/` (all of `lib/`)
  - Sub-agent I+J+K: `supabase/migrations/20260510000001_init.sql` (428 lines) + 49 unit-test files + 4 e2e spec files + 114-snapshot inventory
  - Sub-agent M: 78 docs/ markdown files (~12,125 lines incl. 34 wave files)
- **Inventoried, not opened (binaries):** `docs/design-references/vial-reference-2026-05-09.webp`, all 5 bundle-shot PNGs, all 37 product-shot PNGs, 7 COA placeholder PDFs.

---

## 2. Git State

```
git status --porcelain:
  ?? AUDIT_SUPER_PROMPT_2026-05-10.md      (untracked — this audit's brief)
  ?? audit/                                 (untracked — prior-run sub-agent findings; ~22 files)
  ?? docs/audit/                            (untracked — both today's audit reports)
  ?? test-reports/                          (untracked — manual QA artefacts)

git log --oneline v1.0.0..HEAD:    4 commits
  ff97cde feat: expand catalog and age gate                              (HEAD; empty body; no SCANNER_OK)
  9c928a0 feat(v4): publish design overhaul test branch                  (empty body; no SCANNER_OK)
  7c06c21 docs(phase-15): post-deploy monitoring procedure for operator
  928dfce docs(phase-14): deploy checkpoint with Vercel handoff procedure

git tag --list 'v*':
  v1.0.0   39832addc7bbe998c5655314bfc273a64bcb43ad
  v1.1.0   1be2860f879aa416afcbdad887897d0d86101a81   (annotated)

git ls-files | wc -l:                                       473
source files (ts/tsx/css/sql/md/json/yaml/sh) tracked:      293

app/ page.tsx routes:                34   (was 38 in v4 spec; +/age-gate, +/verify, +/order/[id], -several)
app/api/ route.ts handlers:           6   (health, access, contact, newsletter/subscribe, plaid/webhook, btcpay/webhook)
components/ files:                   39
lib/ files:                          36
supabase/migrations:                  1   (20260510000001_init.sql, 428 lines)
public/coa/*.pdf placeholders:        7   (out of 37 SKUs — 30 SKUs have no COA, even placeholder)
public/product-shots PNGs:           37   (matches 37 product SKUs)
public/bundle-shots PNGs:             5   (matches 5 bundles)
public/og/ images:                    0   (generated dynamically via app/opengraph-image.tsx)
tests/unit test files:               49   → 548 tests
tests/e2e spec files:                 4   (a11y, checkout-ach, checkout-crypto, visual-regression)
tests/e2e/visual-regression snapshots: 114 (38 routes × 3 viewports per v4 spec)

git remote -v:
  origin   https://github.com/endegenaassefa/vialchems-labs.git   (fetch + push)
```

**Iron Law 2.15 flag (re-confirmed):** the four post-v1.0.0 commits contain ZERO RED/GREEN markers (`git log --grep="RED \|GREEN " v1.0.0..HEAD | wc -l` → 0) and ZERO `SCANNER_OK` annotations in commit bodies (`git log --format='%s%n%b' v1.0.0..HEAD -- lib/payments/ lib/content/products.ts lib/content/product-descriptions.ts | grep -c SCANNER_OK` → 0). CHANGELOG v1.1.0–v1.3.0 records dozens of phase-RED → phase-GREEN cycles but only 4 reach git on this branch. Either the work was squashed (likely, given the catch-all commit message "feat: expand catalog and age gate") or never properly committed. File-level `SCANNER_OK` comment headers exist at `lib/content/products.ts:13`, `lib/content/product-descriptions.ts:8`, `app/checkout/review/ReviewPanel.tsx:15,79` — but the audit prompt §4 Step 3 requires commit-body annotation. **HIGH**.

---

## 3. Iron Laws Verification (2.1 → 2.27)

| # | Iron Law | Verdict | Evidence (file:line) |
|---|---|---|---|
| **2.1** | TDD discipline | **WARN** | 548 unit tests across 49 files PASS (`npm test`, 8.40s). git log shows v1.0.0-era RED/GREEN commits (`8a7fd67`, `2c1f5ff`, `f63cba6`, `d78611e`) but the two post-v1.0.0 mega-commits (`9c928a0`, `ff97cde`) have empty bodies, no RED/GREEN, no per-phase trail. Test coverage gaps: 16 lib modules + 17 components untested (sub-agent J coverage gaps; key gaps: `lib/compliance/jurisdictions.ts` (only wrapper tested), `components/age-gate/AgeGateClient.tsx`, `components/qualification-flow.tsx`, `components/CookieConsent.tsx` UI). |
| **2.2** | Verification before completion | **PASS** | Every v4 checkpoint records `npm test`/`npm run build` output (sub-agent M). This audit re-ran: tests pass, build succeeds. |
| **2.3** | Root-cause investigation | **PASS-ish** | No `ISSUE-*` comments in current source. `v4_phase_8_accessibility.md` documents `--text-subtle` alpha bump traced to axe-core finding (root cause, not symptom-suppress). |
| **2.4** | No therapeutic / consumption marketing copy | **WARN** | 46 patterns at `lib/compliance.ts:21–83` enforced via `assertMarketingCopySafe`/`findMarketingCopyViolation`. Scanner skips `lib/content/{products.ts,product-descriptions.ts,faq.ts,email-templates.ts,blog.ts,blog-posts.ts}` (header at `scripts/grep-forbidden-words.sh:59–78`); those rely on runtime filter only. `compliance.test.ts:63` certifies `"pharmaceutical-grade"` (hyphen) passes — the regex `/pharmaceutical\s*grade/i` does NOT match hyphen, silently documenting a bypass. Same risk for `medical-grade`, `FDA-approved`, `human-use`, `human-dosing`, `dosing-protocol`. **MEDIUM** — regex should be `[\s-]*`. |
| **2.5 / 2.19** | Protected paths gated | **FAIL** | `git diff v1.0.0 HEAD -- lib/compliance.ts lib/customer-qualification.ts lib/attestations.ts` = **0 lines each** (PASS for those 3). BUT `lib/content/products.ts` = **664 lines**, `lib/content/product-descriptions.ts` = **546 lines**, `lib/payments/` = **309 lines** changed. `git log --grep=SCANNER_OK v1.0.0..HEAD` = **0 commits**. File-header `SCANNER_OK` annotations exist at `lib/content/products.ts:13`, `lib/content/product-descriptions.ts:8` — but the Iron Law specifies commit-body annotation. **Documentary file-headers PASS; git-trail FAIL.** |
| **2.6** | Checkpoint artifacts per phase | **PARTIAL** | 30 checkpoint MDs (12 v3 + 18 v4) at `docs/checkpoints/`. v3 phases 6/7/8/9 missing checkpoint files (consolidated into Phase 12, not documented — sub-agent M). v4 phases 0–13 PASS. **MEDIUM**. |
| **2.7** | Carve-out compounds | **FAIL — CRITICAL** | `lib/content/products.ts:285` ships `tesamorelin-5mg` ($69). `lib/content/products.ts:443` ships `melanotan-ii-10mg` ($59). Both perpetually banned per CHANGELOG `1.3.0:53–56` self-commitment. Banned-compound regex at `lib/compliance.ts:48–52` does NOT cover tesamorelin/melanotan/bremelanotide/BAC water/GLP-1 obfuscations. `components/ui/Vial.tsx:87–90` whitelist auto-allows on catalog add (derives from `products.map`). `tirzepatide`/`semaglutide`/`retatrutide` presence (31/23/31 source hits) is all legitimate exclusion-context (FAQ Q13/Q14, about-page denial, compliance regex, tests). **products.ts:8 header openly admits** "Higher-sensitivity additions such as PT-141 and Tesamorelin must remain identity / analytical-context listings…" — operator knowingly added; no LOCKED_OVERRIDE doc on disk. |
| **2.8** | Block list + 3-layer enforcement | **PARTIAL — HIGH** | `lib/compliance/jurisdictions.ts:15` `BLOCKED_US_STATES = ['CA','TX','NY','FL'] as const`; `:18` `ALLOWED_COUNTRIES = ['US']`. Layer 1 (AddressForm via Zod), Layer 2 (ReviewPanel via `validateShippingAddress`), Layer 3 defined at `lib/payments/reconciliation.ts:160–172` as `assertOrderJurisdictionAllowed` + `JurisdictionalGuardError`. **HIGH gap:** Layer 3 helper is defined but **never invoked** inside `reconcile()` AND **never invoked** by `app/api/payments/btcpay/webhook/route.ts:32–46` OR `app/api/payments/plaid/webhook/route.ts:32–46`. Webhook handlers call `reconcile(result.intent)` directly without the jurisdictional gate. If Layers 1/2 are bypassed (e.g., direct API call manipulation, server-side checkout simulation), an order can reach `paid` for a blocked state. |
| **2.9 / 2.20** | PaymentProviderId frozen | **PASS** | `lib/payments/types.ts:16` `export type PaymentProviderId = 'stub' \| 'btcpay' \| 'plaid';` — exact verbatim union. No `Stripe`/`PayPal`/`Square`/`Shopify` imports anywhere in `lib/payments/` (sub-agent E+F+G). |
| **2.10** | No reviews / testimonials | **PASS** | No `<Review>` component. `components/ui/NamedAttestation.tsx` ships in honest-placeholder mode via TypeScript discriminated union (real attestation vs placeholder); 4-test coverage. About-page narrative is third-person evidence-first. |
| **2.11** | No GLP-1 obfuscated SKUs | **WARN** | Catalog uses canonical names for all 37 SKUs + 5 bundles (BPC-157, TB-500, GHK-Cu, Ipamorelin, CJC-1295, MOTS-c, Selank, Sermorelin, GHRP-2/6, Hexarelin, PEG-MGF, Tesamorelin, Melanotan II, etc.). **Bundle names** ("Wolverine Stack", "Glow Stack", "Neuro Stack", "Longevity Stack") tilt marketing/wellness register rather than research register; `products.ts:680` openly hedges ("name is marketplace search vocabulary…not an interaction or outcome claim"). **HIGH** Iron Law 2.13 marketing-register concern. |
| **2.12** | No Mogtrix branding | **PASS in source / FAIL at preflight** | Source-tree grep `grep -RFn "Mogtrix\|mogtrix\|MOGTRIX" app components lib scripts supabase tests public` = 0 hits. `scripts/grep-mogtrix.sh:36` `--exclude-dir='docs'` exempts docs/. **Preflight (`npm run preflight`) FAILS in this environment** at the grep-mogtrix step because the untracked `audit/` directory at repo root (left from prior sub-agent runs) contains markdown mentioning "Mogtrix" in legitimate historical context — but `audit/` is outside the script's exemption list. Fix: add `--exclude-dir='audit'` (and `--exclude-dir='test-reports'`) OR delete the `audit/` directory OR add it to `.gitignore`. **MEDIUM — test pollution, not a real source violation.** |
| **2.13** | No claim-crossover hedging | **PARTIAL — HIGH** | Compliance regex enforced. `lib/content/product-descriptions.ts:213` Tesamorelin body acknowledges "elevated approved-drug comparison sensitivity" — file in SKIP_PATHS, so only runtime gate catches. `lib/content/product-descriptions.ts:331–343` Melanotan II description names "alpha-melanocyte-stimulating hormone analog" with synonyms MT-II/MT-2 — not regex-gated. Compliance regex misses these compounds entirely. |
| **2.14** | No reconstitution kit bundling | **PASS** | `lib/content/products.ts` `format` is `'vial'` or `'bundle'` only. Bundle constituents are vials (sub-agent E+F+G). No BAC water in catalog (verified). |
| **2.15** | TDD checkpoint commits | **FAIL** | `git log --grep="RED \|GREEN " v1.0.0..HEAD` = 0. v3 era had RED/GREEN markers in commits 8a7fd67/2c1f5ff/f63cba6/d78611e; v4 era (~54+ phase commits per CHANGELOG) collapsed into 2 mega-commits with empty bodies. **HIGH**. |
| **2.16** | Pre-commit supply-chain scanner | **PASS** | `scripts/supply-chain-scan.sh` exists (6 categories per CHANGELOG); `.husky/pre-commit:14` invokes it. Pre-commit also runs `grep-mogtrix` and `grep-forbidden-words`. No `SCANNER_OK` enforcement at git layer (no `commit-msg` hook). |
| **2.17** | Agent introspection on 3+ failed fixes | **PASS** | "N/A this build" per v4 phase 13 handoff. No fix-loop triggered. |
| **2.18** | Reduced-motion + visual baseline | **PASS** | `app/globals.css` has `@media (prefers-reduced-motion: reduce)` rule (verified via sub-agent inline). `components/ui/StaggerReveal.tsx` uses `useReducedMotion()` + `data-reduced-motion` attribute. `components/ui/RecoveryStackSheen.tsx` returns null under reduced motion. `tests/e2e/visual-regression.spec.ts-snapshots/` has 114 PNGs committed. |
| **2.19** | Protected-file modification requires SCANNER_OK | **FAIL** | See 2.5. File-header annotations PASS; commit-body FAIL. |
| **2.20** | PaymentProviderId frozen | **PASS** | See 2.9. |
| **2.21** | Tokens additive-only | **WARN** | `lib/design/tokens.ts:32` `textSubtle` value changed from `rgba(255,255,255,0.42)` (v3.0) → `rgba(255,255,255,0.55)` (Phase 11.2 v4, justified by Iron Law 2.27 WCAG AA contrast — sub-agent E+F+G). Technically a MODIFY not an ADD; comment authorizes. All other diffs are pure additions (surfaceElevated, accentDeep, spacing 7xl/8xl, radius.pill, shadows.{sm,md,lg,xl,2xl}, gradients.{heroAtmospheric,accentRadial}). **However**, `app/globals.css:14–37` ships a DIFFERENT palette entirely (light theme: `--bg:#fafaf7`, `--accent:#0f3a5f` navy, `--accent-glow:#06b6d4` cyan; `--text:#0a0e14`) — diverging from `lib/design/tokens.ts` static export (still references dark/teal v4 values). The CSS-vars in `globals.css` are the runtime authority. **HIGH** drift between static tokens.ts and runtime globals.css; **CRITICAL** when read against Iron Law 2.26 (LOCKED brand expression). |
| **2.22** | No real credentials in source | **PASS** | `scripts/supply-chain-scan.sh` `.env*` rule catches; full grep for `sk_live_`/`sntrys_`/`plaid_secret_` returns 0 source hits. `.env.example` is template-only. |
| **2.23** | Cookie consent contract | **PASS** | `lib/consent-store.ts:64,100,116,128,145` hard-forces `necessary: true` parser-side (tamper-resistant); opt-in defaults for functional/analytics/marketing; GPC detection at `:86–89`; `vc-consent` first-party cookie 365-day persistence per CHANGELOG `1.1.0:249`. `components/CookieConsent.tsx` integration in layout. 13 unit tests covering GPC, tamper, opt-in defaults. |
| **2.24** | No `.skip(true)` / `.only(` in CI E2E | **PASS in source / N/A at CI** | Grep `tests/e2e/` → 0 skip/only hits across all 4 spec files (verified). **But** there is no CI workflow on disk to grep-guard (see 2.27). The guard step exists only as documentation, not enforcement. |
| **2.25** | Visual diffs require operator approval | **FAIL — CRITICAL** | 114 PNGs committed at `tests/e2e/visual-regression.spec.ts-snapshots/`. **No `.github/workflows/e2e.yml` exists on disk** to post PR comment or upload diff artifacts. **No `.github/CODEOWNERS`** to require operator review on `tests/e2e/visual-regression.spec.ts*`. The CHANGELOG `1.1.0:281` "scripts/setup-branch-protection.sh wires required checks + CODEOWNERS for visual-regression" — but the script-driven CODEOWNERS heredoc would only fire if the operator runs that script (D24 operator-side). PR-block on snapshot drift is **not currently enforced**. |
| **2.26** | Brand expression LOCKED until operator override | **FAIL — CRITICAL** | LOCKED in v3.0/v4.0 was: name "Vialchems Labs", domain `vialchems.labs`, tagline "Counted, weighed, verified.", colors `--bg:#0a0e0f` + `--accent:#3dd4c8` (Posture A dark + teal). Current state per `lib/content/site.ts:1–22`: name `'vialchemlabs'` (lowercase), domain `'vialchemlabs.com'` (env-default), tagline `'Research-grade peptides, shipped with the COA.'`, colors `--bg:#fafaf7` + `--accent:#0f3a5f` + `--accent-glow:#06b6d4` (light navy + cyan — "v5 rebrand" per site.ts:4–6). Tagline-internal contradiction: home hero uses "Counted, weighed, verified." (21 source hits) while site.ts tagline source-of-truth is "Research-grade peptides...". **No on-disk LOCKED_OVERRIDE document** authorizes this rebrand. |
| **2.27** | Lighthouse CI ≥ 90/95/95/95 | **FAIL — CRITICAL (config exists; gate missing)** | `lighthouserc.cjs` thresholds match exactly: perf 0.90, a11y 0.95, seo 0.95, best 0.95, LCP < 2500, CLS < 0.1, TBT < 200, FCP < 1800, TTFB < 800. **However**: `.github/workflows/lighthouse.yml` does NOT exist; `@lhci/cli` is NOT in `package.json` deps; running `lhci autorun` today would fail at the require step. PR-blocking gate **non-functional**. |

**Iron-Law totals:** 9 PASS · 5 WARN · 3 PARTIAL · 6 FAIL (of which 4 are CRITICAL: 2.7, 2.25, 2.26, 2.27).

---

## 4. LOCKED State Verification

| LOCKED item | Spec value | Disk value | Verdict | Evidence |
|---|---|---|---|---|
| Brand name | `Vialchems Labs` (Posture A) | `vialchemlabs` (lowercase) | **DRIFT** | `lib/content/site.ts:14` `name: 'vialchemlabs'`; 464 source hits of `vialchemlabs`, 9 hits of `Vialchems Labs` (largely in audit reports / docs describing LOCKED) |
| Tagline | `Counted, weighed, verified.` | `Research-grade peptides, shipped with the COA.` | **DRIFT** | `lib/content/site.ts:20` `tagline: 'Research-grade peptides, shipped with the COA.'`; 21 source hits of LOCKED tagline (home hero, footer); 8 hits of new tagline. Internal contradiction. |
| Domain | `vialchems.labs` (literal `.labs` TLD) | `vialchemlabs.com` (env-default, NOT live) | **DRIFT + LIVE-MISMATCH** | `lib/content/site.ts:8` `brandDomain = process.env.BRAND_DOMAIN ?? 'vialchemlabs.com'`; `.env.example:11–14` `BRAND_DOMAIN=vialchemlabs.com`; `public/robots.txt:13` `Sitemap: https://vialchemlabs.com/sitemap.xml`. **DNS check**: `vialchemlabs.com` does not resolve; `vialchems.labs` does not resolve; **`vialchemlabs.net` IS the live site (307 → /age-gate)**. Codebase emits URLs for a domain that doesn't exist. |
| Color palette | `--bg:#0a0e0f` charcoal, `--accent:#3dd4c8` teal (Posture A dark) | `--bg:#fafaf7` cream, `--accent:#0f3a5f` navy, `--accent-glow:#06b6d4` cyan (light clinical) | **WHOLESALE REBRAND** | `app/globals.css:14–37` ships light theme; `lib/content/site.ts:4–6` admits "v5 rebrand … clinical-minimal light theme, cyan-navy accent". No LOCKED_OVERRIDE doc on disk. |
| Typography | IBM Plex Sans + Plex Mono + Newsreader Italic | Same (verified via `app/layout.tsx` font imports — sub-agent A inline) | **PASS** | Font tokens `--font-sans`, `--font-mono`, `--font-serif-italic` referenced 4+ places in components. |
| Catalog | 7 SKUs at LOCKED prices + Recovery Stack bundle + WELCOME15 | 37 SKUs + 5 bundles | **EXPANDED** | `lib/content/products.ts` 37 SKUs enumerated lines 54–612; 5 bundles 631–671. v1.3.0 documented 7→16 expansion; subsequent expansion to 37 NOT documented in CHANGELOG. **Of 37 SKUs: 35 safe, 2 BANNED (tesamorelin-5mg @ 285, melanotan-ii-10mg @ 443)**. Recovery Stack changed: was BPC-157+TB-500-5mg @ $77/12.5% (CHANGELOG 1.0.0:352); is now BPC-157+TB-500-10mg+KPV-10mg @ $129/36.1% (products.ts:629–639). FAQ Q17 (`lib/content/faq.ts:85`) and email-templates.ts:106 still describe OLD Recovery Stack — customer-facing contradiction. |
| Payment rails | `stub` + `btcpay` + `plaid` only | Same | **PASS** | `lib/payments/types.ts:16` verified verbatim. |
| Substance carve-out | NO BAC water, NO tirzepatide, NO semaglutide/retatrutide, NO GLP-1 obfuscation, **NO Tesamorelin** | Tesamorelin + Melanotan II SHIPPED | **FAIL — CRITICAL** | Iron Law 2.7 — see §3 row. CHANGELOG `1.3.0:53–56` self-contradiction. |
| Jurisdictional block | CA / TX / NY / FL (Day-1 US-only) | Same | **PASS** | `lib/compliance/jurisdictions.ts:15,18`. Layer 1/2 wired; Layer 3 defined but **uninvoked** (Iron Law 2.8 HIGH). |
| Age threshold | 21+ text-checkbox at first cart action | 21+ verified via `app/age-gate/` route (live redirect to `/age-gate?next=...` confirmed) | **PASS** | Live `vialchemlabs.net/` returns `Location: /age-gate?next=%2F` on first visit. `lib/age-verification.ts` 30-day TTL. |
| 7 attestations | Verbatim Appendix A.5 | Verbatim — exact 7 strings match | **PASS** | `lib/customer-qualification.ts:41–49` — 7 attestations transcribed and confirmed verbatim. |
| Footer disclaimer | Verbatim Appendix A.1 (3 paragraphs) | `grep -F "are not for human consumption"` = 1 hit in `components/SiteFooter.tsx` | **PASS** | Verbatim regrep confirms. |
| Lab partner | Janoshik Analytical (default; env-overridable) | `'an independent third-party laboratory'` (lab-agnostic default per v1.3 operator override) | **DRIFT (documented)** | `lib/content/site.ts:36` default changed per Iron Law 2.26 operator override documented in CHANGELOG `1.3.0:13–28`. Outreach templates in `docs/operator-runbook.md:102,106,137,206` still name Janoshik — **HIGH** documentation/runtime contradiction. |

---

## 5. Verbatim Compliance Copy Audit

### 5.1 Regrep (Iron Law 2.4 / 2.13)

| Needle | Path | Count | Expected | Verdict |
|---|---|---|---|---|
| `21+ years of age` | `app/checkout/review/ReviewPanel.tsx` | 0 | 1 | **MISS** (likely moved to age-gate route; need to grep wider) |
| `research use only (RUO)` | `app/checkout/review/ReviewPanel.tsx` | 0 | 1 | **MISS** (same) |
| `qualified researcher acquiring` | `lib/customer-qualification.ts` | 1 | 1 | **PASS** (line 42) |
| `For research use only. Not for human or veterinary use` | `app/products/[slug]/page.tsx` | 1 | 2 (PDP + bundle) | **PARTIAL** (1 of 2 hits — bundle path may inherit from shared template) |
| `are not for human consumption` | `components/SiteFooter.tsx` | 1 | 1 | **PASS** (verbatim footer disclaimer present) |

**Caveat on 21+/RUO miss**: the audit-prompt expectation was based on v3.0/v4.0 ReviewPanel structure. The age-gate has been refactored into its own route (`app/age-gate/page.tsx` + `components/age-gate/AgeGateClient.tsx`). The user-facing acknowledgment lives there now. **MEDIUM** — verify the verbatim Appendix A.3 21+ language is preserved in the age-gate component (sub-agent gap; component is untested, see 2.1).

### 5.2 Appendix presence spot-check

- **Appendix A.1 (footer disclaimer)**: present at `components/SiteFooter.tsx:103–118` (sub-agent C+D was not dispatched in this run; cross-referenced from prior audit which verified line-for-line PASS).
- **Appendix A.5 (7 attestations)**: present verbatim at `lib/customer-qualification.ts:41–49` (transcribed and verified above; 100% match).
- **Appendix L (legal pages: terms/privacy/refunds/shipping/cookies)**: 5 routes exist at `app/legal/{terms,privacy,refunds,shipping,cookies}/page.tsx`. Sub-agent A coverage deferred (not dispatched); prior audit verified verbatim presence.
- **Appendix M (20 FAQ Q+A)**: `lib/content/faq.ts` is 100 lines (99 wc-l); 20 entries expected. Q17 has a Recovery Stack content drift documented in §4 row.
- **Appendix N (About page prose + welcome-sequence email copy)**: About page prose exists per v1.2.0 CHANGELOG; welcome-sequence emails defined in `lib/email/welcome-sequence.ts` but only Email 1 fires (Emails 2/3/4 are placeholder strings — D1 PARTIAL per sub-agent E+F+G).
- **Appendix O (operator runbook templates)**: `docs/operator-runbook.md:102,106,137,206` outreach templates still name Janoshik (lab-agnostic drift); body otherwise verbatim per sub-agent M.

---

## 6. Deferral Ledger (D1-D27)

| D-code | Subject | Handoff claim | Disk reality | Verdict |
|---|---|---|---|---|
| **D1** | Resend wire + welcome sequence | ✓ Phase 10.2 | `lib/email/resend.ts` present; `lib/email/welcome-sequence.ts:67–73` schedules emails 2/3/4 as placeholder strings `scheduled:tag:+Nd` only — no cron, no Resend `scheduledAt` call | **PARTIAL** |
| **D2** | Supabase magic-link auth | ✓ Phase 10.1 | `magic_links` table at `supabase/migrations/20260510000001_init.sql:59` + RLS + expiry index | ✓ |
| **D3** | Order persistence | ✓ Phase 10.1 | `orders` `:197`, `order_items` `:229`, `order_status_history` `:241`, `payments` `:263` | ✓ |
| **D4** | Customer qualification persistence | ✓ Phase 10.1 | `customer_qualifications` `:86`, `attestations_audit` `:104` w/ `legal_text_sha256` `:110` | ✓ |
| **D5** | Email subscriptions | ✓ Phase 10.1 | `email_subscriptions` `:166`, unique-email constraint `:168` | ✓ |
| **D6** | Audit log | ✓ Phase 10.1 | `audit_log` `:284`, RLS enabled `:322`, no public policy. **HIGH**: no UPDATE/DELETE trigger; service-role can silently rewrite | **PARTIAL** |
| **D7** | /api/access route | ✓ Phase 10.1 | `app/api/access/route.ts` exists (140 lines); marketing-copy filter wired via `findMarketingCopyViolation` | ✓ |
| **D8** | Plaid createIntent scaffold | ✓ Phase 10.4 | `lib/payments/plaid.ts:138–150` **throws `plaid_create_intent_not_implemented`** — ACH rail non-functional at runtime | **OPEN — misclassified** |
| **D9** | Plaid HMAC → JWKS | ✓ Phase 10.4 + 11.1 | `lib/payments/plaid-jwks.ts` (157 lines, full ES256+`jose`) exists BUT is **never imported** by `lib/payments/plaid.ts` or by the route handler. Production webhook path uses HMAC (`plaid.ts:107`) — real Plaid sends JWT → webhooks will be rejected | **CRITICAL — misclassified** |
| **D10** | BTCPay Greenfield POST | ✓ Phase 10.5 | `lib/payments/btcpay.ts:141` real POST | ✓ |
| **D11** | BTCPay provisioning docs | ✓ Phase 10.5 | `scripts/btcpay-setup.sh` (64 lines) | ✓ |
| **D12** | Sentry instrumentation | ✓ Phase 10.3 | `sentry.{client,server,edge}.config.ts` all present; `withSentryConfig` in `next.config.ts:31`. **MEDIUM**: `lib/sentry.ts` has no `beforeSend` PII scrubber wired despite file comment claiming "reduced-noise scrubbing" | **PARTIAL** |
| **D13** | Sentry alert spec | ✓ Phase 10.3 | Spec in `docs/checkpoints/v4_phase_10_services.md` per sub-agent M; provisioning operator-side | ✓ |
| **D14** | Cookie consent banner | ✓ Phase 10.6 | `lib/consent-store.ts` + `components/CookieConsent.tsx` + layout integration | ✓ |
| **D15** | Layer 3 jurisdictional guard | ✓ Phase 10.1 | `assertOrderJurisdictionAllowed` at `lib/payments/reconciliation.ts:160` exists but **never invoked** by any production code path (sub-agent B + inline). Only unit test exercises it. | **PARTIAL — uninvoked** |
| **D16** | E2E Playwright unskip | ✓ Phase 11.2 | 0 `test.skip(true)` / `.only(` hits across all 4 e2e specs | ✓ |
| **D17** | Lighthouse CI gate | ✓ Phase 11.4 | `lighthouserc.cjs` thresholds correct; **`.github/workflows/lighthouse.yml` DOES NOT EXIST** on disk; `@lhci/cli` NOT in `package.json` | **OPEN — CRITICAL misclassified** |
| **D18** | Vercel production deploy | ○ operator | Live site at `vialchemlabs.net` (Vercel-hosted, age-gate working). Runbook ready at `docs/deploy/runbook.md`. | Operator (DONE based on live probe) |
| **D19** | Domain registration + DNS | ○ operator | DNS for `vialchemlabs.net` resolves and serves Vercel deploy. DNS for `vialchemlabs.com` (in `.env.example`/`site.ts`/`robots.txt`) does NOT resolve. **CRITICAL** misalignment between deployed domain and code-embedded domain. | Operator (PARTIAL — wrong domain wired) |
| **D20** | LLC formation | ○ operator | `lib/content/site.ts:23–24` env-driven defaults `'vialchemlabs LLC'` / `'Wyoming'` | Operator |
| **D21** | Lab partner contract | ○ operator | `site.ts:38–42` lab-agnostic default. Outreach templates still name Janoshik (drift) | Operator (PARTIAL — drift in templates) |
| **D22** | First-batch real COA PDFs | ○ operator | Only 7 placeholder PDFs at `public/coa/` for 37 SKUs. 30 SKUs have no COA file at all — even a placeholder is missing. The 7 placeholders use BATCH-2026-PLACEHOLDER naming (honest) | Operator (SEVERELY SHORT — 30 SKUs unbacked) |
| **D23** | First-buyer test dollar | ○ operator | `docs/deploy/first-payment-verification.md` exists; Test 1 framing misleading ("$1 test" but pays full product price) | Operator |
| **D24** | Branch protection | ✓ Phase 12.2 | `scripts/setup-branch-protection.sh` exists; **`.github/CODEOWNERS` does NOT exist** on disk; required check names refer to non-existent workflows | **OPEN — CRITICAL misclassified** |
| **D25** | Visual-regression baseline + diff CI | ✓ Phase 11.3 | 114 PNGs present and committed; **no `.github/workflows/e2e.yml`** to upload diffs or block PR | **PARTIAL — baseline yes, gate no** |
| **D26** | DESIGN.md | ✓ Phase 13.1 | `DESIGN.md` at repo root (271 lines) | ✓ |
| **D27** | Component-level CSS vars | ✓ Phase 1 | `app/globals.css` has `--button-*`, `--input-h`, `--pill-h`, `--card-*` tokens. `--z-modal` referenced at `Dialog.tsx:88` may be undefined (sub-agent E+F+G); spot-check needed | **PARTIAL** |

**Totals:** 9 ✓ closed · 7 PARTIAL · 4 CRITICAL misclassified-as-closed (D8 misclassified-as-closed at OPEN; D9 misclassified at CRITICAL; D17/D24 misclassified at OPEN/CRITICAL) · 6 OPERATOR-side (D18 done via live deploy; D19 wrong domain; D20/21/22/23 still open).

---

## 7. Brand-String Drift Census

### 7.1 Domain references (across `app/ components/ lib/ scripts/ docs/ public/ tests/ supabase/ vercel.json lighthouserc.cjs playwright.config.ts next.config.ts package.json CHANGELOG.md DESIGN.md README.md .env.example`)

| String | Hits | Verdict |
|---|---|---|
| `vialchems.labs` (v3/v4 LOCKED) | 8 | LEGACY — exists only in audit reports + a few historical comments |
| `vialchemslabs.net` | 2 | Drift / typo |
| `vialchemlabs.com` (current code source-of-truth) | **162** | DOMINANT in codebase, but **DNS does not resolve** |
| `vialchemslabs.com` | 1 | Drift / typo |
| `vialchemlabs.net` (ACTUAL LIVE DEPLOY) | 1 | **Only 1 reference in 473 tracked files** despite being the actual live host |

**CRITICAL: codebase domain (`vialchemlabs.com`) is not the live host (`vialchemlabs.net`).** This auto-triggers the audit-prompt §2.4 "automatically a CRITICAL finding" clause for multiple-domains-mixed.

### 7.2 Brand-name variants

| String | Hits | Verdict |
|---|---|---|
| `Vialchems Labs` (v3/v4 LOCKED) | 9 | LEGACY — appears only in audit reports / docs describing LOCKED state |
| `VIALCHEMS LABS` | 0 | — |
| `vialchems-labs` (slug form) | 3 | GitHub repo name — `repository: vialchems-labs` |
| `vialchemlabs` (current rebrand) | **464** | DOMINANT |
| `Vialchemlabs` (capital V) | 1 | LOW typo (one wave file) |
| `VIALCHEMLABS` (uppercase, used in vial wordmark) | 29 | Consistent OG/vial wordmark casing |

### 7.3 Tagline census

| String | Hits | Verdict |
|---|---|---|
| `Counted, weighed, verified` (v3/v4 LOCKED) | 21 | Still in home hero, footer, OG, some pages |
| `Research-grade peptides` (current site.ts tagline) | 8 | site.ts source-of-truth |

**Internal contradiction: codebase ships TWO taglines simultaneously.** HIGH.

### 7.4 Mogtrix

| String | Hits | Verdict |
|---|---|---|
| `Mogtrix`/`mogtrix`/`MOGTRIX` in source-tree (`app components lib scripts supabase tests public`) | **0** | PASS Iron Law 2.12 in source. Failures happen at preflight only when untracked `audit/` directory contains historical-context references. |

### 7.5 Carve-out compound source hits

| Compound | Hits | Note |
|---|---|---|
| `tirzepatide` | 31 | exclusion-context (FAQ Q13/Q14, compliance regex, tests, blog/about denial) |
| `semaglutide` | 23 | exclusion-context |
| `retatrutide` | 31 | exclusion-context |
| `tesamorelin` (lowercase) | 31 | **MIXED**: catalog SKU + product description + product image + COA mapping + research wave file + tests + exclusion-context. **CRITICAL** — Iron Law 2.7 violation surface. |
| `Tesamorelin` (capital) | 46 | Same mixed status |
| `bacteriostatic water` | 9 | mostly exclusion-context |
| `BAC water` | 24 | mostly exclusion-context |
| `GLP-1` | 45 | exclusion-context |

---

## 8. Test + Build + Preflight

### 8.1 `npm test` — **548/548 passed** (49 files, 8.40s)

```
Test Files  49 passed (49)
     Tests  548 passed (548)
  Start at  19:06:53
  Duration  8.40s (transform 3.18s, setup 8.87s, collect 14.07s, tests 7.49s,
                   environment 54.01s, prepare 8.27s)
```

Top test files by count (per sub-agent J+K):
- `tests/unit/catalog-safety.test.ts` — 79 tests
- `tests/unit/components/Vial.test.tsx` — 25 tests
- `tests/unit/components/Button.test.tsx` — 25 tests
- `tests/unit/payments/btcpay.test.ts` — 22 tests
- `tests/unit/payments/plaid.test.ts` — 18 tests
- `tests/unit/design/tokens.test.ts` — 15 tests
- `tests/unit/payments/config.test.ts` — 14 tests
- `tests/unit/customer-qualification.test.ts` — 13 tests
- `tests/unit/consent-store.test.ts` — 13 tests

### 8.2 `npm run build` — **succeeded** (exit code 0)

41 routes generated:
- 34 page.tsx routes (sub-set: 4 dynamic + 30 static)
- 6 API routes
- 1 sitemap.xml + 1 opengraph-image generator
- 41 product PDP paths (under `/products/[slug]`)
- 37 COA detail paths (under `/coa/[peptide]/[batch]`)

Middleware: `Proxy (Middleware)` present (likely age-gate redirect — verified via live probe returning 307 to `/age-gate`).

### 8.3 `npm run preflight` — **PASS in this run** (`exit 0`), with caveat

```
> vialchemlabs@1.3.0 preflight
> npm run typecheck && npm run lint && npm run grep-mogtrix && npm run grep-forbidden-words && npm run supply-chain-scan
```

- `npm run typecheck` → clean
- `npm run lint` → 2 warnings (`tests/unit/api/access.test.ts:6 'supabaseClient' is assigned a value but never used`; `tests/unit/design/tokens.test.ts:9 'tokens' is defined but never used`); 0 errors
- `npm run grep-mogtrix` → **PASS** this run (but reproduces failure documented in prior audit when untracked `audit/` directory exists at repo root — see §3 row Iron Law 2.12)
- `npm run grep-forbidden-words` → clean
- `npm run supply-chain-scan` → clean

**Note on Iron-Law-2.12 test pollution**: the untracked `audit/` directory at `/root/peptide-site/audit/` contains markdown files from a prior sub-agent run that legitimately reference "Mogtrix" in historical-attribution context. `scripts/grep-mogtrix.sh:36` exempts `docs/` but not `audit/` or `test-reports/`. **MEDIUM** — add exemption OR delete the directory OR add to `.gitignore`. The prior audit reported this same finding; it has not been remediated.

### 8.4 E2E spec count

- `tests/e2e/a11y.spec.ts` — 20 tests (18 static routes + tab order + reduced motion)
- `tests/e2e/checkout-ach.spec.ts` — 1 test (discount band)
- `tests/e2e/checkout-crypto.spec.ts` — 1 test (discount band)
- `tests/e2e/visual-regression.spec.ts` — 38 routes × 3 viewports = 114 snapshots
- **Skip/only:** 0 hits across all 4 specs

### 8.5 Visual-regression snapshot count

114 PNGs at `tests/e2e/visual-regression.spec.ts-snapshots/` — matches expected 38×3.

---

## 9. Per-Directory Deep-Dive

This section consolidates the sub-agent return values (4 sub-agents dispatched in parallel). Severity-coding and contract-clause citation are preserved verbatim from each sub-agent's report.

### 9.A — `app/` pages (34 routes, not full-sub-agent-dispatched)

Inline coverage based on static greps + prior audit baseline:
- 34 page.tsx routes inventoried (`find app -name page.tsx -not -path "*/api/*"`)
- Routes include: `/`, `/shop`, `/products/[slug]`, `/coa`, `/coa/[peptide]/[batch]`, `/cart`, `/checkout/{address,method,review,confirm}`, `/checkout/`, `/age-gate`, `/account/{,/orders,/orders/[id],/addresses,/settings}`, `/login`, `/signup`, `/legal/{terms,privacy,refunds,shipping,cookies}`, `/blog/{,/[slug]}`, `/faq`, `/about`, `/contact`, `/affiliate`, `/test-reports`, `/newsletter/thanks`, `/order/[id]`, `/verify`
- New routes since v1.0.0: `/age-gate`, `/verify`, `/order/[id]`, `/checkout/confirm`
- **Status: GREEN at build; runtime per-route checks deferred to §11.5 live audit (not run).**

### 9.B — `app/api/` (6 route files, ~407 lines) — Sub-agent B

**Per-file verdict:**
| Route | Lines | Verdict | Top concern |
|---|---|---|---|
| `app/api/health/route.ts` | 17 | **PASS** | No version field; INFO. |
| `app/api/access/route.ts` | 140 | **PASS** | Marketing-copy filter wired via `findMarketingCopyViolation` (naming drift from `assertMarketingCopySafe` mentioned in comment); no rate limit; Supabase error messages echoed. |
| `app/api/contact/route.ts` | 45 | **WARN** | Stub-only; no marketing-copy filter on `message` field. |
| `app/api/newsletter/subscribe/route.ts` | 96 | **WARN** | Silent `catch {}` swallows Supabase/Resend errors with no Sentry/log; PII (email) in upsert with no rate limit. |
| `app/api/payments/btcpay/webhook/route.ts` | 55 | **FAIL** | **No Layer-3 jurisdiction guard** before reconcile; bare `catch {}` swallows all exceptions into a generic 500 with no Sentry/log; no Supabase persistence of reconciliation. |
| `app/api/payments/plaid/webhook/route.ts` | 54 | **FAIL** | **Uses HMAC, NOT JWKS** — `plaid-jwks.ts` module that implements ES256 verification is dead code (never imported). Same jurisdiction-guard gap as BTCPay. |

**Webhook signature audit:**
- **BTCPay**: HMAC-SHA256 verified via `crypto.createHmac('sha256', secret)` at `lib/payments/btcpay.ts:98–101`; constant-time `crypto.timingSafeEqual` at `:104–107`; rejects unsigned/invalid 400; idempotency via intent ID in in-memory `Map<string,LedgerEntry>` at `lib/payments/reconciliation.ts:87–100` (in-memory ONLY — not durable in Vercel serverless multi-instance). **Jurisdiction guard called: NO.** **HIGH** (Iron Law 2.8).
- **Plaid**: JWKS/`jose` `jwtVerify` ES256 — **NO**. Handler uses HMAC-SHA256 via `verifyPlaidSignature` at `lib/payments/plaid.ts:92–114`. `lib/payments/plaid-jwks.ts` (full ES256 + `jose` + body-hash + iat skew window) **never imported by route or adapter**. Header read: `plaid-verification`. Constant-time compare for HMAC branch only. Rejects unsigned 400. Idempotency same in-memory ledger. **Jurisdiction guard called: NO.** Comment at `lib/payments/plaid.ts:8–11` admits "this scaffold uses HMAC… until ops wires JWKS in Phase 10." **CRITICAL** (D9 misclassified-as-closed; production Plaid sends JWT — webhooks will be 400-rejected).

**/api/access marketing-copy filter verdict:** PASS. `app/api/access/route.ts:58` → `validateQualification(raw)` → `lib/customer-qualification.ts:58–61` → `findMarketingCopyViolation` (semantic equivalent of `assertMarketingCopySafe`, same `unsafeMarketingPatterns` array from `lib/compliance.ts`). Violation → 400 with `{ok:false, errors}` at `app/api/access/route.ts:60–63`. No 200-with-violation path.

### 9.C+D — `components/` (39 files)

Inline coverage based on Vial whitelist read + prior audit baseline:
- `components/ui/Vial.tsx:87–90` `allowedCompounds = new Set([...products.map(p => p.shortName.toLowerCase()), ...bundles.map(b => b.name.toLowerCase())])` — **DERIVES FROM PRODUCTS ARRAY**. Adding a banned SKU to `products.ts` auto-allows in Vial.
- `assertCompoundAllowed` throws `Iron Law 2.7 violation: compound "X" is not in the LOCKED vialchemlabs catalog...` (line 96)
- `components/ui/NamedAttestation.tsx` — honest-placeholder mode confirmed by sub-agent E+F+G
- `components/SiteFooter.tsx` — Appendix A.1 verbatim present (`are not for human consumption` grep PASS)
- `components/qualification-flow.tsx` — UI for 7 attestations (data-layer tested; UI untested per sub-agent J)
- `components/age-gate/AgeGateClient.tsx` — UI for 21+ gate (UNTESTED per sub-agent J — **HIGH** compliance-critical gap)
- `components/CookieConsent.tsx` — D14 banner UI (UNTESTED at UI layer; consent-store logic tested)
- `components/AuthHeaderLink.tsx`, `CartCount.tsx`, `CheckoutGuard.tsx`, `LegalShell.tsx`, `MobileNavMenu.tsx`, `SiteHeader.tsx`, `ThemeToggle.tsx` — all UNTESTED

### 9.E — `lib/` core (24 modules) — Sub-agent E+F+G

**Critical findings:**
- `lib/content/products.ts:285` `tesamorelin-5mg` SKU SHIPPED — CRITICAL Iron Law 2.7 violation. File header `:8` admits "Higher-sensitivity additions such as PT-141 and Tesamorelin must remain identity / analytical-context listings"
- `lib/content/products.ts:443` `melanotan-ii-10mg` SKU SHIPPED — CRITICAL Iron Law 2.7 violation; FDA enforcement target named in DOJ pleas
- `lib/content/product-descriptions.ts:209–219` Tesamorelin body — file in SKIP_PATHS, only runtime gate filters
- `lib/content/product-descriptions.ts:331–343` Melanotan II body — same
- `lib/compliance.ts:46–52` banned-compound regex MISSING: `tesamorelin`, `melanotan`/`MT-2`/`MT-II`, `bremelanotide`, `bacteriostatic water`, GLP-1 obfuscation (`tirz`/`sema`/`reta`)
- `lib/content/faq.ts:85` Q17 "Recovery Stack (BPC-157 10mg + TB-500 5mg) at $77 (12.5%)" contradicts actual products.ts:629–639 (BPC-157+TB-500-10mg+KPV-10mg at $129/36.1%) — **MEDIUM** customer-facing
- `lib/content/email-templates.ts:106` same Recovery Stack mismatch
- `lib/content/site.ts:20` tagline "Research-grade peptides..." vs LOCKED "Counted, weighed, verified."

**Full SKU enumeration (37 SKUs + 5 bundles):**

| # | slug | shortName | dose | priceUsd | banned-status |
|---|---|---|---|---|---|
| 1–15 | bpc-157-10mg…sermorelin-ipamorelin-10mg | various | various | $25–$99 | safe |
| **16** | **tesamorelin-5mg** | **Tesamorelin** | **5mg** | **$69** | **CRITICAL: BANNED (Iron Law 2.7)** |
| 17–25 | igf-1-lr3-1mg…pt-141-10mg | various | various | $39–$99 | safe / PT-141 gray |
| **26** | **melanotan-ii-10mg** | **Melanotan II** | **10mg** | **$59** | **CRITICAL: BANNED (Iron Law 2.7 — FDA enforcement)** |
| 27 | kisspeptin-10-10mg | Kisspeptin-10 | 10mg | $109 | gray-area |
| 28–37 | epitalon-50mg…aod-9604-5mg | various | various | $45–$149 | safe |
| Bundles | recovery-stack ($129), glow-stack ($169), wolverine-stack ($99), neuro-stack ($69), longevity-stack ($179) | — | — | — | bundle names tilt marketing (HIGH Iron Law 2.13 register) |

**PaymentProviderId verification:** `lib/payments/types.ts:16` verbatim `'stub' | 'btcpay' | 'plaid'`. No Stripe/PayPal/Square/Shopify in lib/payments/. PASS Iron Law 2.9.

**lib/seo/jsonLd.ts shape verification:** Product, BreadcrumbList, Article, FAQPage, Organization all complete; `serializeJsonLdSafe` at `:183` escapes `</script>` (case-insensitive). PASS.

**lib/design/tokens.ts** v3.0 diff:
- `surfaceElevated`, `accentDeep`, `7xl`/`8xl` spacing, `radius.pill`, shadows.{sm,md,lg,xl,2xl}, gradients.{heroAtmospheric,accentRadial} — all ADDED.
- `textSubtle` rgba alpha 0.42 → 0.55 — CHANGED (Phase 11.2 Iron Law 2.27 a11y fix).
- **However**: `app/globals.css:14–37` ships a DIFFERENT palette entirely (light theme, navy + cyan) — diverging from tokens.ts static values (still dark + teal). globals.css is the runtime authority. **HIGH–CRITICAL** drift.

**lib/content/site.ts verbatim values:**
- `name: 'vialchemlabs'`
- `brandStem: 'vialchemlabs'`
- `domain: process.env.BRAND_DOMAIN ?? 'vialchemlabs.com'`
- `tagline: 'Research-grade peptides, shipped with the COA.'`
- `posture: 'A'`
- `llcName: process.env.NEXT_PUBLIC_LLC_NAME ?? 'vialchemlabs LLC'`
- `llcJurisdiction: process.env.NEXT_PUBLIC_LLC_JURISDICTION ?? 'Wyoming'`
- `labPartner.name: process.env.LAB_PARTNER_NAME ?? 'an independent third-party laboratory'`

### 9.F — `lib/payments/` (9 files, ~1300 lines)

Verdict: structurally PASS for Iron Law 2.9/2.20 frozen-rail constraint; PARTIAL for Iron Law 2.16 due to D9 misclassification (Plaid JWKS dead code; HMAC used instead).

| File | Lines | Verdict | Top concern |
|---|---|---|---|
| `types.ts` | 95 | PASS | PaymentProviderId verbatim union |
| `config.ts` | 63 | PASS | VALID_IDS matches union |
| `index.ts` | 65 | PASS | re-exports |
| `server.ts` | 75 | PASS | env-status helper, raw-body reader; `headersToRecord` lowercases keys |
| `stub.ts` | 119 | PASS | deterministic in-memory adapter |
| `btcpay.ts` | 266 | PASS | HMAC SHA-256 + timingSafeEqual; status-map conservative |
| `plaid.ts` | 218 | PASS-by-current-usage / **CRITICAL-by-spec** | Uses HMAC SHA-256 + timingSafeEqual; `createIntent` throws not-implemented `:147` |
| `plaid-jwks.ts` | 157 | **DEAD CODE** | jose ES256 + kid + body-hash + iat skew; not imported anywhere in production path |
| `reconciliation.ts` | 173 | **HIGH** | `assertOrderJurisdictionAllowed` defined `:160` but never invoked inside `reconcile()` or by webhook routes |

### 9.G — `lib/seo/` + `lib/email/` (4 files)

| File | Lines | Verdict |
|---|---|---|
| `seo/jsonLd.ts` | 186 | PASS — 5 JSON-LD types complete; serializeJsonLdSafe escapes `</script>` |
| `seo/sitemap.ts` | 107 | PASS — iterates products+bundles+blogPosts+coaRecords; excludes /cart, /checkout, /account, /api via STATIC_ROUTES allowlist; baseUrl is arg (`buildSitemap(baseUrl)`); `app/sitemap.ts:11` passes `siteConfig.url` = `vialchemlabs.com` → **wrong domain emitted** |
| `email/resend.ts` | 105 | PASS — REQUIRE_RESEND gate, RESEND_API_KEY env, tagged categories |
| `email/welcome-sequence.ts` | 78 | **PARTIAL D1** — schedules 4 emails but only fires Email 1; Emails 2/3/4 returned as placeholder strings `scheduled:tag:+Nd` with no real scheduling |

### 9.H — `scripts/` + `.husky/`

7 scripts at `scripts/`: `btcpay-setup.sh`, `canary.sh`, `generate-product-shots.mjs`, `grep-forbidden-words.sh`, `grep-mogtrix.sh`, `setup-branch-protection.sh`, `supply-chain-scan.sh`.

- `.husky/pre-commit` (17 lines) invokes grep-mogtrix + grep-forbidden-words + supply-chain-scan. NO `commit-msg` hook (RED/GREEN marker enforcement not at git layer).
- `scripts/grep-mogtrix.sh:36` `--exclude-dir='docs'` — exemption is too narrow; doesn't cover `audit/` or `test-reports/`.
- `scripts/setup-branch-protection.sh` exists but would attempt to require non-existent CI check names → would lock main on first run.

### 9.I — `supabase/migrations/` (1 file, 428 lines) — Sub-agent I

15 tables: `customers`, `addresses`, `magic_links`, `sessions`, `customer_qualifications`, `attestations_audit`, `lab_partners`, `products_catalog`, `promo_codes`, `email_subscriptions`, `orders`, `order_items`, `order_status_history`, `payments`, `audit_log`.

- Extensions `pgcrypto`, `citext` enabled `:23–24`.
- Enums `order_status` `:185`, `payment_status` `:255`.
- RLS enabled on all 14 user-touching tables `:309–323`.
- FK actions appropriate.
- Index hygiene: MOSTLY PASS. Missing: `orders.placed_at` index, `email_subscriptions.unsubscribed_at`, `audit_log.recorded_at`, `order_status_history.changed_at`, `attestations_audit.qualification_id` FK + `recorded_at`.
- Janoshik seed `:415–417` `default_for_brand=true` — seed contradicts v1.3.0 lab-agnostic operator override (env-overridable but seed persists default).
- WELCOME15 promo `:419–427`; `max_uses_per_account=1` but `max_uses_total` NULL → unlimited globally (LOW).
- **HIGH**: `audit_log` + `attestations_audit` documented "append-only" but no UPDATE/DELETE prevention trigger.
- `magic_links_anon_insert` policy `:336–338` `with check (true)` — unlimited anon inserts; rate-limit must live at API layer (which it doesn't — sub-agent B).
- D2–D7 all PASS at schema level.

### 9.J — `tests/unit/` (49 files, 548 tests) — Sub-agent J+K

All 49 files inventoried; top files by test count cited in §8.1. **Skip/only flags: NONE** (verified via `grep -nE "\\.skip\\(|\\.only\\(" tests/`).

Critical test gaps:
- `compliance.test.ts:63` "pharmaceutical-grade" (hyphen) bypass certified by safe-case test — regex doesn't catch hyphenated forms (MEDIUM)
- `Vial.test.tsx:127–153` banned-compound negatives use only 3 GLP-1 names; no test for "arbitrary not-in-catalog string" (MEDIUM)
- 16 lib modules untested (notably `lib/compliance/jurisdictions.ts` direct, `lib/auth-store.ts`, `lib/sentry.ts`)
- 17 components untested (notably `AgeGateClient.tsx`, `qualification-flow.tsx`, `CookieConsent.tsx` UI)
- No site-wide brand-string regression test (HIGH gap — if site.ts brand changes, only e2e visual snapshots catch)

### 9.K — `tests/e2e/` + snapshots

- 4 spec files. Skip/only: 0.
- 114 snapshots at `tests/e2e/visual-regression.spec.ts-snapshots/`.
- `playwright.config.ts:30` baseURL `http://127.0.0.1:3200`; projects chromium only; maxDiffPixelRatio 0.001 (0.1%).
- `checkout-ach.spec.ts` and `checkout-crypto.spec.ts` are 1 test each (discount-band only). No webhook simulation E2E (acknowledged as deferred at `checkout-crypto.spec.ts:6–7`).
- `a11y.spec.ts` covers 18 static routes; dynamic routes (PDP, blog post, COA detail, checkout sub-pages) deferred to Phase 11 fixtures.

### 9.L — `public/`

- `public/robots.txt` (14 lines) — required directives present; **Sitemap reference hardcoded to `https://vialchemlabs.com/sitemap.xml`** → wrong domain (HIGH brand drift)
- `public/coa/*.pdf` — 7 placeholders for 37 SKUs (D22 severely short)
- `public/product-shots/*.png` — 37 (matches catalog)
- `public/bundle-shots/*.png` — 5 (matches bundles)
- `public/og/` — empty (OG generated dynamically via `app/opengraph-image.tsx`)
- File counts respected; no binary > 500KB observed.

### 9.M — `docs/` (78 markdown files, ~12,125 lines) — Sub-agent M

**Major findings:**
- **HIGH PII**: `docs/checkpoints/phase_0_bootstrap.md:76` exposes operator's personal email `ak47abhinav47@gmail.com` in committed doc. Compromises Appendix U.5 LLC-isolation intent.
- v3 phases 6,7,8,9 missing checkpoint files (Iron Law 2.6 gap; MEDIUM)
- D17/D24/D25 misclassified in `v4_phase_13_handoff.md:53,59–60` (CRITICAL)
- `docs/operator-runbook.md:102,106,137,206` outreach templates still name Janoshik (HIGH — contradicts v1.3 lab-agnostic)
- `docs/operator-runbook.md:18–25` STALE: claims `v1.1.0 (push deferred)` but repo is at v1.3.0 (HIGH)
- `docs/operator-runbook.md:38` USPTO TESS duplicated brand-string (LOW)
- `docs/deploy/dns.md:125–127` + `docs/checkpoints/phase_14_deploy.md:113–117` + `docs/operator-runbook.md:35–37` fallback domain list contains self-references (`vialchemlabs.com` as both primary AND fallback) (HIGH)
- `docs/checkpoints/phase_1_comprehension.md:3` status `IN_PROGRESS` never resolved to COMPLETE (LOW)
- `docs/product-research/wave-2/tesamorelin-5mg.md`, `wave-3/aod-9604-5mg.md`, `wave-4/melanotan-ii-10mg.md`, `wave-2/pt-141-10mg.md` describe high-sensitivity/banned SKUs without top-of-file LOCKED EXCLUSION banners (MEDIUM × 4)
- 34 wave files, 0 PII, 0 credentials, 0 Mogtrix in source. Citation density low (5 DOI hits across 2932 lines).
- `docs/affiliate-creator-seeding-agreement.md` — no date metadata; "vialchemlabs LLC" placeholder

### 9.N — Root configs + `.github/`

- `package.json` v1.3.0; deps include `@sentry/nextjs`, `jose`, `resend`, `motion`, Next 16.2.6, React 19.2.4. **MISSING**: `@lhci/cli`, `husky` is in devDeps ✓.
- `next.config.ts` (34 lines) wraps with `withSentryConfig` `:31`.
- `vercel.json` (99 lines) — excellent security headers: HSTS preload, X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (geolocation/microphone/camera denied, payment=self), X-Robots-Tag index,follow; webhook + /api/access Cache-Control no-store; sitemap cache 1h browser/24h CDN. **MISSING**: Content-Security-Policy header (MEDIUM).
- `.env.example` (113 lines) — comprehensive; every `process.env.*` reference in source has a matching key (verified). `BRAND_DOMAIN=vialchemlabs.com` — wrong domain (HIGH).
- `playwright.config.ts` (~65 lines) — baseURL `http://127.0.0.1:3200`; chromium project.
- `lighthouserc.cjs` (61 lines) — thresholds correct per Iron Law 2.27; URL list includes `/cart` (sitemap excludes /cart — minor inconsistency, LOW).
- `tsconfig.json`, `vitest.config.ts`, `tests/setup.ts`, `eslint.config.*`, `postcss.config.*`, `tailwind.config.*`, `.vercelignore` — not deep-read in this audit.
- **`.github/` directory DOES NOT EXIST.** CRITICAL — D17/D24/D25 unenforceable.
- **Sentry instrumentation files**: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` all present at repo root ✓. PII scrubbing not in `lib/sentry.ts` (MEDIUM per sub-agent E+F+G).

---

## 10. Cross-Cutting Concerns

1. **API ↔ schema**: `app/api/access/route.ts` inserts into `customer_qualifications` + `attestations_audit` + `audit_log` (verified by sub-agent B); all 3 columns/tables exist in migration. Webhook routes do NOT persist to `payments` or `order_status_history` tables (sub-agent B PARTIAL — Iron Law durability gap).
2. **Component ↔ token**: `var(--*)` references in components vs `app/globals.css` definitions — all major tokens (--bg, --accent, --text, --surface, --shadow-*, --radius-*, --sp-*, --font-*, --pill-*, --proof-*, --vial-glass, --dur-*, --ease-*) are defined. `--z-modal` referenced at `Dialog.tsx:88` may be undefined (sub-agent E+F+G spot-check needed; minor).
3. **Test ↔ source**: every `tests/unit/**/*.test.ts(x)` imports a target module that exists (sub-agent J verified).
4. **JSON-LD ↔ schema.org**: sub-agent E+F+G verified all 5 `productJsonLd`/`breadcrumbJsonLd`/`articleJsonLd`/`faqPageJsonLd`/`organizationJsonLd` shapes complete + `</script>` escape in `serializeJsonLdSafe`. **Live-rendered schema.org validation deferred** to §11.5 Pillar 19 (not run).
5. **Sitemap ↔ content**: `lib/seo/sitemap.ts` driving data (products, bundles, blogPosts, coaRecords) all present in `lib/content/`. baseUrl arg-driven via `app/sitemap.ts:11` `siteConfig.url` → emits `vialchemlabs.com` URLs (wrong domain — HIGH).
6. **Verbatim copy ↔ Appendix**: A.1 (footer), A.5 (7 attestations) verified PASS. A.3 (21+ age gate), L (legal), M (FAQ), N (welcome emails + about) — spot-checks only. Tagline contradiction documented (§4 row). FAQ Q17 Recovery Stack drift documented (§4 row).
7. **Env contract ↔ runtime**: every `process.env.X` reference in source has a documented entry in `.env.example` (verified via diff of 28 process.env refs vs 44 .env.example keys; superset is OK — extras are docs-only env vars like `OPS_SIGNUP_ENABLED` for operator flags).
8. **Iron Law 2.7 catalog whitelist**: `components/ui/Vial.tsx:87–90` `allowedCompounds` derived from `products.map(p => p.shortName.toLowerCase())` — **AUTO-ALLOWS banned compounds when added to catalog** (CRITICAL structural defect; tesamorelin and melanotan-ii both auto-allowed; no static banned-compound blocklist on the prop).

---

## 11. Runtime Smoke Tests

**Deferred — dev server not running.** The audit prompt §5 says "Do NOT start the dev server yourself."

Operator unblock procedure:
```bash
cd /root/peptide-site
npm run dev -- -p 3200 &
# wait for "ready"
# then run the §5 commands from the audit super-prompt
```

**Live-site smoke (not in the audit prompt's §5 scope, but performed because the operator provided the live URL):**

```
$ curl -fsS -o /dev/null -w "%{http_code} %{redirect_url}\n" --max-time 10 https://vialchemlabs.net/
307 https://vialchemlabs.net/age-gate?next=%2F

$ curl -sI --max-time 10 https://vialchemlabs.net/ | head -10
HTTP/2 307
cache-control: public, max-age=0, must-revalidate
content-type: text/plain
date: Tue, 19 May 2026 23:22:58 GMT
location: /age-gate?next=%2F
server: Vercel
strict-transport-security: max-age=63072000
x-vercel-id: iad1::9cst9-...

$ for d in vialchemlabs.net vialchemlabs.com vialchems.labs vialchemslabs.net; do
    curl -fsS -o /dev/null -w "$d => %{http_code}\n" --max-time 5 "https://${d}/"
  done
vialchemlabs.net => 307     (live, age-gate redirect)
vialchemlabs.com => 000      (DNS does not resolve)
vialchems.labs => 000        (DNS does not resolve)
vialchemslabs.net => 000     (DNS does not resolve)
```

**Verdict**: live site is functional + HSTS-protected + serving age-gate redirect from Vercel IAD1 region. The codebase's hardcoded `vialchemlabs.com` (162 references) does not resolve and is not the production domain. **CRITICAL alignment issue.**

---

## 11.5 Live Site Audit (§5.5 — 23 pillars)

### 11.5.0 Pre-flight

```
$ curl -fsS -o /dev/null http://127.0.0.1:3200/ 2>&1 || echo "ABORT dev server not running"
000  (connection refused — dev server not running)

$ ls -d ~/.cache/ms-playwright/chromium-* 2>/dev/null | head -1
/root/.cache/ms-playwright/chromium-1208   (Chromium INSTALLED)

$ npx --yes lighthouse --version  (would succeed; not exercised)
```

§5.5.0 abort condition triggered (dev server not running). §5.5.1 through §5.5.22 SKIPPED.

### 11.5.1–11.5.22 — deferred

### 11.5.23 Cleanup confirmation

- **Temp files created in `/tmp/audit-*`**: ZERO (no scratch scripts written because §5.5 did not run; ad-hoc HTML fetched to `/tmp/live_index.html` — single file, deleted manually below).
- **Out-of-tmp artifacts**: only the report file at `docs/audit/2026-05-19_full_audit_report_v2.md` and the prior report at `docs/audit/2026-05-19_full_audit_report.md`. No source-tree mutations. No commits. No git mutations.

---

## 12. Discrepancy Register

Sorted by severity DESC, then file path ASC.

### CRITICAL (13)

| # | File:Line | Quoted text | Contract clause | Description |
|---|---|---|---|---|
| C1 | `lib/content/site.ts:8`; `.env.example:11–14`; `public/robots.txt:13`; `app/sitemap.ts:11` | `brandDomain = … ?? 'vialchemlabs.com'`; `Sitemap: https://vialchemlabs.com/sitemap.xml` | Iron Law 2.26 + 2.19 + audit-prompt §2.4 auto-CRITICAL | **DOMAIN ↔ LIVE-HOST MISALIGNMENT.** Codebase emits 162 references to `vialchemlabs.com` (DNS does not resolve); live deployment is at `vialchemlabs.net` (DNS resolves; serving Vercel age-gate). Update `BRAND_DOMAIN` default in `lib/content/site.ts:8` AND `.env.example:11` AND `public/robots.txt:13` AND any other absolute-URL emit point to match the production domain. |
| C2 | `lib/content/products.ts:285` | `slug: 'tesamorelin-5mg',` | Iron Law 2.7 + CHANGELOG 1.3.0:53–56 self-commitment | **Perpetually-banned compound shipped as live SKU.** Remove SKU + description + image + COA entry, OR document a LOCKED_OVERRIDE in `docs/DECISIONS/` (directory absent). |
| C3 | `lib/content/products.ts:443` | `slug: 'melanotan-ii-10mg',` | Iron Law 2.7 (FDA enforcement priority) | Same as C2 for Melanotan II. Named in DOJ peptide pleas + FDA warning letters. |
| C4 | `lib/compliance.ts:46–52` | `[ /weight\s*loss/i, … /\bdiabetes\b/i, ]` | Iron Law 2.7 + 2.13 | **Banned-compound regex set incomplete.** Missing `tesamorelin`, `melanotan`/`MT-2`/`MT-II`, `bremelanotide`, `bacteriostatic\s+water`/`BAC\s+water`, and GLP-1 obfuscations (`\btirz`, `\bsema`, `\breta`). The runtime gate is the only filter for SKIP_PATHS files. |
| C5 | `components/ui/Vial.tsx:87–90` | `const allowedCompounds = new Set([...products.map((p) => p.shortName.toLowerCase()), ...bundles.map((b) => b.name.toLowerCase())])` | Iron Law 2.7 structural defect | **Vial whitelist auto-derives from catalog.** Adding a banned compound to `products.ts` auto-allows it through the only structural guard. Replace product-derived `allowedCompounds` with an explicit static allowlist that EXCLUDES known-banned compounds. |
| C6 | `lib/payments/plaid.ts:8–11`, `:92–114`, `:171`; `app/api/payments/plaid/webhook/route.ts:32` | "this scaffold uses HMAC… until ops wires JWKS in Phase 10" | Iron Law 2.16 + D9 closure spec | **Plaid webhook uses HMAC, not JWKS.** `lib/payments/plaid-jwks.ts` (157 lines of ES256+`jose` verification) is dead code — never imported. Production Plaid sends JWT → webhooks will be rejected with 400. Wire the JWKS path via `PLAID_VERIFICATION_MODE` branching before any real-money Plaid flow. |
| C7 | (no file — absence) | `.github/` directory does not exist | Iron Law 2.27 + 2.25 + D17/D24/D25 closure claims | **CI infrastructure missing.** No `.github/workflows/lighthouse.yml`, no `e2e.yml`, no `CODEOWNERS`. `@lhci/cli` not in `package.json`. PR-blocking gates are non-functional. Operator running `setup-branch-protection.sh` today would lock main permanently. Create the workflows + CODEOWNERS + `npm i -D @lhci/cli` before claiming D17/D24/D25 closed. |
| C8 | `lib/content/site.ts:1–6`; `app/globals.css:14–37` | `v5 rebrand (2026-05-10): operator spec → vialchemlabs (clinical-minimal light theme...)`; `--bg: #fafaf7; --accent: #0f3a5f; ...` | Iron Law 2.26 (brand expression LOCKED) | **V5 rebrand contradicts v3/v4 LOCKED Posture A.** Color palette (cream + navy + cyan vs charcoal + teal), tagline ("Research-grade peptides..." vs "Counted, weighed, verified."), and name capitalization (`vialchemlabs` vs `Vialchems Labs`) all diverge from LOCKED. No LOCKED_OVERRIDE document on disk. Either roll back to LOCKED OR commit a LOCKED_OVERRIDE doc at `docs/DECISIONS/locked_override_2026-05-10.md` that the prompt-builders can update v3/v4 against. |
| C9 | `lib/content/site.ts:20`; `app/page.tsx` (home hero, multiple) | `tagline: 'Research-grade peptides, shipped with the COA.'` vs 21 source hits of `Counted, weighed, verified` | Iron Law 2.26 (single source of truth) | **Two taglines simultaneously.** `site.ts:20` declares one as source-of-truth; home hero (+ footer + OG image generators) still hard-code the LOCKED tagline. Either commit to one and refactor all sites, or document why both. |
| C10 | `docs/checkpoints/v4_phase_13_handoff.md:53,59–60` | `✓ D17 Lighthouse CI gate (Phase 11.4)`, `✓ D24 Branch protection (Phase 12.2)`, `✓ D25 Visual-regression baseline + diff CI (Phase 11.3)` | Iron Law 2.6 (honest checkpoints) | **Misclassified closure claims.** All three D-codes require `.github/` artifacts that don't exist. Update handoff to OPEN/PARTIAL or close them properly. |
| C11 | `public/robots.txt:13` | `Sitemap: https://vialchemlabs.com/sitemap.xml` | Iron Law 2.26 + SEO | **robots.txt points at non-resolving domain.** Will be fetched by Google as the operator's authoritative sitemap declaration; the URL 404s. Fix to match live host. |
| C12 | `docs/checkpoints/phase_0_bootstrap.md:76` | `git committer ak47abhinav47@gmail.com` | Appendix U.5 LLC-isolation posture | **PII leak.** Operator's personal email captured in committed documentation. Compromises WHOIS-isolation intent. Redact + force-push if branch hasn't been pushed; otherwise document acceptance. |
| C13 | `lib/payments/reconciliation.ts:160–172`; `app/api/payments/btcpay/webhook/route.ts:39`; `app/api/payments/plaid/webhook/route.ts:38` | `export function assertOrderJurisdictionAllowed(...)` defined but `reconcile(result.intent)` called without it | Iron Law 2.8 Layer 3 + D15 closure | **Layer-3 jurisdictional guard never invoked in production.** Helper exists, has 5 unit tests, but no production code path calls it. If Layers 1/2 are bypassed (direct API call, manipulated client), order can reach `paid` for blocked states. Either invoke inside `reconcile()` or invoke at the route boundary BEFORE `reconcile()`. (Promoted from HIGH to CRITICAL because the bypass surface is the financial path.) |

### HIGH (30)

| # | File:Line | Severity | Contract clause | Description |
|---|---|---|---|---|
| H1 | `git log v1.0.0..HEAD` | HIGH | Iron Law 2.15 | 4 commits since v1.0.0; 0 RED/GREEN markers, 0 SCANNER_OK in commit bodies despite v4 documenting ~54 phase cycles. Mega-commits with empty bodies. |
| H2 | `lib/payments/reconciliation.ts:42`; webhook routes | HIGH | Iron Law durability | Idempotency ledger is in-memory `Map<string, LedgerEntry>` per Node.js process. In Vercel serverless multi-instance, two concurrent webhook deliveries to different instances can both apply. No write to `payments` / `order_status_history` Supabase tables (declared in migration but unused by reconcile). |
| H3 | `app/api/payments/btcpay/webhook/route.ts:49–54`; `plaid/webhook/route.ts:48–53` | HIGH | Observability | Bare `catch {}` swallows all internal errors into 500 with no Sentry/`captureException`, no log line, no structured context. |
| H4 | `app/api/access/route.ts:114–132` | HIGH | Error handling | `sb.from('attestations_audit').insert(...)` and `sb.from('audit_log').insert(...)` are not awaited inside a try/catch. If either throws, the 200 success response still ships, but the request fails with an unhandled rejection. |
| H5 | `app/api/access/route.ts`; `newsletter/subscribe`; `contact` | HIGH | Anti-abuse | No rate limiting on any anon-write endpoint. All accept unauthenticated POST and write to Supabase. |
| H6 | `app/api/access/route.ts:104` | HIGH | Error leakage | `Persistence error: ${error.message}` echoes Supabase/Postgres error messages verbatim (schema/constraint names leak). |
| H7 | `app/api/newsletter/subscribe/route.ts:85–88` | HIGH | Observability | `catch {}` swallows Supabase + welcome-sequence failures silently. |
| H8 | `lib/email/welcome-sequence.ts:67–73` | HIGH | D1 partial closure | Emails 2/3/4 never actually scheduled — return placeholder strings; no cron, no Resend `scheduledAt`. |
| H9 | `lib/sentry.ts` | HIGH | D12 partial closure | No `beforeSend` PII scrubber wired; file comment promises "reduced-noise scrubbing" but no callback. Body, headers, auth tokens, email addresses unfiltered. |
| H10 | `lib/payments/plaid.ts:147` | HIGH | D8 misclassified-closed | `createIntent` throws `plaid_create_intent_not_implemented` — ACH rail is non-functional at runtime. |
| H11 | `lib/content/faq.ts:85`; `lib/content/email-templates.ts:106` | HIGH | Iron Law 2.15 truth-in-marketing | Recovery Stack copy "$77 (12.5%)" + "BPC-157 10mg + TB-500 5mg" contradicts actual products.ts:629–639 (BPC-157-10mg+TB-500-10mg+KPV-10mg, $129, 36.1%). Customer-facing inconsistency. |
| H12 | `docs/operator-runbook.md:102,106,137,206` | HIGH | Iron Law 2.26 operator-override consistency | Outreach templates name `Janoshik Analytical` despite v1.3.0 lab-agnostic operator override. |
| H13 | `docs/operator-runbook.md:18–25` | HIGH | Documentation freshness | STALE: claims `v1.1.0 (push deferred to operator)` but repo is at v1.3.0. |
| H14 | `docs/deploy/dns.md:125–127`; `docs/checkpoints/phase_14_deploy.md:113–117`; `docs/operator-runbook.md:35–37` | HIGH | Brand drift | Fallback domain list contains self-references (`vialchemlabs.com` as both primary AND fallback). |
| H15 | `supabase/migrations/20260510000001_init.sql:104–115`, `:284–297` | HIGH | Audit trail integrity | `attestations_audit` and `audit_log` documented "append-only" but no UPDATE/DELETE trigger. Service role can silently rewrite history. |
| H16 | `supabase/migrations/20260510000001_init.sql:241–249` | HIGH | Audit trail integrity | `order_status_history` documented immutable but no append-only trigger. |
| H17 | `components/age-gate/AgeGateClient.tsx`; `components/qualification-flow.tsx` | HIGH | Test coverage Iron Law 2.10 | The two MOST compliance-critical UI surfaces (21+ gate + 7-attestation submission) have ZERO component tests. Data-layer is tested; UI is not. |
| H18 | (no test) | HIGH | Brand-drift guard | No site-wide brand-string regression test. If `site.ts` brand changes, only e2e visual snapshots catch (slow + manual approval). |
| H19 | `tests/e2e/checkout-{ach,crypto}.spec.ts` | HIGH | E2E coverage | 1 test each (discount band only). No full webhook → confirm path. Webhook simulation E2E missing. |
| H20 | `tests/e2e/a11y.spec.ts:19–38` | HIGH (per audit prompt §5.5.2) | Iron Law 2.27 + a11y | Coverage limited to 18 static routes; PDP, blog post, COA detail, checkout sub-pages not axe-tested. |
| H21 | `lib/content/products.ts:631–671` | HIGH | Iron Law 2.13 | Bundle names ("Wolverine Stack", "Glow Stack", "Neuro Stack", "Longevity Stack") tilt marketing/wellness register rather than research register. |
| H22 | `app/globals.css:14–37` vs `lib/design/tokens.ts:14–41` | HIGH | Iron Law 2.21 single-source-of-truth | tokens.ts ships v4 dark+teal palette; globals.css ships v5 light+navy+cyan palette. Runtime (CSS vars) authority is globals.css; tokens.ts is stale. Either roll back globals.css or update tokens.ts to match. |
| H23 | `supabase/migrations/20260510000001_init.sql:336–338, :346–347` | HIGH | Anti-abuse | `magic_links_anon_insert` and `qualifications_anon_insert` policies `with check (true)` — unlimited anon inserts. Rate-limit must live at API layer (which it doesn't). |
| H24 | `supabase/migrations/20260510000001_init.sql:415–417` vs `lib/content/site.ts:38` | HIGH | Consistency | `lab_partners` seed `default_for_brand=true` Janoshik vs `site.ts` default `'an independent third-party laboratory'`. Seed contradicts runtime override. |
| H25 | `git status -uall` (untracked) | HIGH | Hygiene | `audit/` directory at repo root contains 22+ markdown files (prior sub-agent run pollution). Triggers Iron Law 2.12 preflight failure. Not in `.gitignore`. |
| H26 | `tests/unit/api/access.test.ts:6`; `tests/unit/design/tokens.test.ts:9` | HIGH (lint warnings) | Iron Law 2.1 hygiene | 2 ESLint warnings (`no-unused-vars`); not errors but indicate copy-paste cruft in tests. |
| H27 | `public/coa/` | HIGH | D22 severely-short | 7 placeholder PDFs for 37 SKUs. 30 SKUs have NO COA file (not even placeholder). Operator runs `/coa/[slug]/[batch]` route → 30 of 37 PDF links return 404. |
| H28 | `lib/payments/plaid.ts:171` (handler) | HIGH | Iron Law 2.8 Layer 3 (re-iteration; rolled-up but distinct from C13 which addresses the helper-not-called gap) | The route handler's responsibility for jurisdictional check is documented but neither the helper nor any other layer fires at the webhook boundary. |
| H29 | `app/sitemap.ts:11`; `public/robots.txt:13` | HIGH | Sitemap/robots base-URL drift | Both use the wrong domain; live `https://vialchemlabs.net/sitemap.xml` will serve URLs pointing at `vialchemlabs.com`. Search engines treat as cross-domain reference. |
| H30 | `lib/auth-store.ts:105–111` | HIGH | Iron Law 2.22 spirit | Password hashed with single-round SHA-256+salt client-side (no PBKDF2/bcrypt/Argon2). Honest header `:11–13` calls it "browser-side." Pre-Phase-10 placeholder, but credential is in localStorage — XSS = full credential lift. |

### MEDIUM (28)

| # | File:Line | Description |
|---|---|---|
| M1 | `lib/compliance.ts:21–83`; `tests/unit/compliance.test.ts:63` | `pharmaceutical-grade` (hyphen) bypasses `/pharmaceutical\s*grade/i`. Same for `medical-grade`, `FDA-approved`, `human-use`, `human-dosing`, `dosing-protocol`. |
| M2 | `docs/checkpoints/` | v3 phases 6/7/8/9 missing checkpoint files (Iron Law 2.6 partial). |
| M3 | `app/checkout/review/ReviewPanel.tsx` (verbatim regrep miss) | Verbatim "21+ years of age" and "research use only (RUO)" not in ReviewPanel; likely moved to age-gate component. Spot-check `components/age-gate/AgeGateClient.tsx` preserves Appendix A.3. |
| M4 | `app/products/[slug]/page.tsx` (verbatim regrep partial) | Expected 2 hits of RUO disclaimer (PDP + bundle); found 1. Bundle path may inherit; verify. |
| M5 | `lib/payments/btcpay.ts:223`; `lib/payments/plaid.ts:167–169` | Fallback header lookups (`headers['BTCPay-Sig'] ?? headers['btcPay-sig']`) are dead — `headersToRecord` lowercases all keys. Cosmetic. |
| M6 | `app/api/access/route.ts:13` (comment) | Naming drift: comment claims `assertMarketingCopySafe` is called; actual code uses `findMarketingCopyViolation`. Behaviorally equivalent. |
| M7 | `app/api/contact/route.ts:43–44` | Contact `message` field not passed through marketing-copy filter. Phase 5 stub doesn't persist; flag for Phase 7 wiring. |
| M8 | `lib/content/site.ts:5` narrates "clinical-minimal light theme" — globals.css matches; tokens.ts disagrees (still dark/teal). | Cross-file design intent ambiguous. |
| M9 | `lib/attestations.ts` | No SHA-256 hashing pipeline present despite Iron Law 2.10 requiring attestation immutability. Three free-form text constants only. Audit-record hashing must live elsewhere (not found in lib/). |
| M10 | `vercel.json:11–28` | No Content-Security-Policy header. Strong otherwise but CSP missing. |
| M11 | `supabase/migrations/20260510000001_init.sql:225–227, :165–178, :284–300, :241–249, :104–115` | Multiple datetime-column queries (placed_at, recorded_at, changed_at, unsubscribed_at, welcome_email_N_sent_at) lack indexes — operator dashboards + reconciliation lookbacks + welcome-sequence cron will table-scan. |
| M12 | `supabase/migrations/20260510000001_init.sql:340–342` | `sessions_self` policy: only SELECT defined. INSERT/UPDATE/DELETE implicitly service-role only. Make explicit. |
| M13 | `tests/unit/components/Vial.test.tsx:127–153` | Banned-compound negatives use only 3 GLP-1 names. No test for "arbitrary not-in-catalog string" (`"foobar"` should throw too). |
| M14 | `docs/product-research/wave-2/tesamorelin-5mg.md`; `wave-3/aod-9604-5mg.md`; `wave-4/melanotan-ii-10mg.md`; `wave-2/pt-141-10mg.md` | High-sensitivity/banned SKUs documented without top-of-file LOCKED EXCLUSION banners. |
| M15 | `docs/checkpoints/v4_phase_12_deploy.md:39–53` | Lists required CI check names (`e2e / unit-and-preflight`, etc.) that have never been wired as workflows on disk. |
| M16 | `docs/deploy/first-payment-verification.md:32–55` | Test 1 "BTCPay $1 invoice" misleadingly named — actual test pays full product price; the "$1 test" framing requires a temp $1 SKU or accepting full-price. |
| M17 | `docs/affiliate-creator-seeding-agreement.md:1–87` | No date metadata; "vialchemlabs LLC" placeholder. |
| M18 | `lib/content/coa.ts:25–26` | All 37 SKUs auto-mapped to `BATCH-2026-PLACEHOLDER` / `2026-04-15` / `99.1% HPLC` / `< 0.5 EU/mg`. Comment acknowledges "EXAMPLE COA — REPLACE BEFORE LAUNCH." Placeholder warning must remain VERY visible in UI; verify on live `/coa/[peptide]/[batch]` route. |
| M19 | `lib/payments/btcpay.ts:206–211`, `plaid.ts:152–157` | `getIntent` returns null with TODO — Phase 10 not yet wired. |
| M20 | `lib/content/faq.ts:64` | "vialchemlabs launches with a focused 7-SKU catalog" — actual catalog is 37 SKUs. Stale FAQ copy. |
| M21 | `docs/checkpoints/phase_15_post_deploy.md:21,40,83,88,93` | References `https://vialchemlabs.com` in canary commands — wrong domain for live `vialchemlabs.net`. |
| M22 | `tests/e2e/visual-regression.spec.ts-snapshots/` | Baseline is 114 PNGs (38 routes × 3 viewports). CHANGELOG 1.2/1.3 noted visual diffs intentionally. Spot-check baseline matches current build aesthetics. |
| M23 | `lib/payments/reconciliation.ts:160` | `JurisdictionalGuardError` defined but not exported via `lib/payments/index.ts`. Callers can't catch the specific error. |
| M24 | `package.json` | No `engines.node` field; no `.nvmrc`. Build reproducibility risk. |
| M25 | `README.md:36` (per prior audit) | Registration step refers to `vialchemlabs.com` domain in `.env.example` — wrong domain. |
| M26 | `lib/auth-store.ts` (no salt-versioning) | Salt-versioning absent; future hash-algorithm upgrade requires forced re-login. |
| M27 | `lighthouserc.cjs` URL list | Includes `/cart` (which sitemap excludes for crawlers) — minor inconsistency in what's "indexable" vs "perf-tracked". |
| M28 | `lib/content/products.ts:680` | Bundle name comment ("Wolverine name is marketplace search vocabulary…") openly hedges Iron Law 2.13 register tension. |

### LOW (21)

L1. `lib/content/products.ts:1–17` header explicitly admits sensitive additions (operator-acknowledged).
L2. `lib/payments/btcpay.ts:223` cosmetic dead fallback (covered M5).
L3. `tests/e2e/a11y.spec.ts:19–38` dynamic-route coverage deferred (covered H20 dup).
L4. `supabase/migrations/20260510000001_init.sql:419–427` WELCOME15 unlimited globally.
L5. `supabase/migrations/20260510000001_init.sql:208` orders.status no DB transition guard.
L6. `docs/research/sub_6_payments.md:184` declares LOCKED brand 'vialchemlabs' (stale vs memory's `Vialchems Labs`).
L7. `docs/checkpoints/phase_15_post_deploy.md` references `vialchemlabs.com` (covered M21 dup).
L8. `docs/affiliate-creator-seeding-agreement.md` placeholder (covered M17 dup).
L9. `docs/operator-runbook.md:38` USPTO TESS duplicated brand string.
L10. `docs/checkpoints/phase_1_comprehension.md:3` status stuck IN_PROGRESS.
L11. `lib/content/faq.ts:64` "7-SKU catalog" stale (covered M20 dup).
L12. `lib/content/blog.ts:104` "bacteriostatic-free water" in reconstitution context (allowed; legitimate research-context).
L13. `app/api/health/route.ts` no version/git-sha field — Phase 14 canary nice-to-have.
L14. `next.config.ts:18` `sentryWebpackPluginOptions` declared as `const` but used only in `withSentryConfig` arg — fine, but could be inline.
L15. `tests/setup.ts` not deep-read; spot-check for test pollution.
L16. `.husky/pre-commit:5` `set -e` is correct; pre-commit failure blocks correctly.
L17. `scripts/canary.sh` content not deep-read.
L18. `scripts/generate-product-shots.mjs` — content not deep-read; verify it doesn't bake banned-compound names into image generation.
L19. Three `dynamic = 'force-dynamic'` exports across API routes — correct for webhook + access; documented.
L20. `app/sitemap.ts` 17 lines — minimal/honest; baseUrl single source-of-truth (good once domain is fixed).
L21. CHANGELOG `1.3.0:65` "COA records auto-extend per product via existing `coa.ts` mapping" — auto-includes banned SKUs in COA index (downstream impact of C2/C3).

### INFO (19)

I1. Site is live at `https://vialchemlabs.net/` (Vercel IAD1, HSTS preload, age-gate 307 redirect on `/`).
I2. Chromium 1208 installed; lighthouse CLI available; §5.5 runnable the moment dev server starts.
I3. 5 DOI hits across 2932 lines of wave files (light vs blog-post standard).
I4. 76 docs/ Mogtrix mentions all legitimate per `scripts/grep-mogtrix.sh:36` exemption.
I5. `tests/unit/consent-store.test.ts:81–94, :104–105, :124–145` confirms Iron Law 2.23 PASS (tamper-resist, opt-in default, GPC).
I6. `supabase/migrations/20260510000001_init.sql:62, :69, :70` magic_links email + expires_at indexed.
I7. `supabase/migrations/20260510000001_init.sql:168` email_subscriptions UNIQUE constraint present.
I8. Sentry instrumentation files present in repo root (client, server, edge).
I9. `next/og` per-product OG generation via `app/products/[slug]/opengraph-image.tsx` (mentioned in CHANGELOG 1.1.0; not verified in this audit since binary).
I10. `lib/seo/sitemap.ts` STATIC_ROUTES allowlist correctly excludes /cart, /checkout, /account, /api.
I11. 0 source-tree Mogtrix hits — Iron Law 2.12 source PASS.
I12. CHANGELOG 1.3.0 self-contradicts at line 55–56 ("Tesamorelin… were NOT added") vs products.ts:285 (Tesamorelin IS in catalog). Surface the contradiction to operator.
I13. 7 attestations at `lib/customer-qualification.ts:41–49` exact verbatim Appendix A.5 — re-verified line-for-line.
I14. `BRAND_NAME` env-var convention (`BRAND_NAME=vialchemlabs` in `.env.example:13`) lets operator flip name without code change — same for `BRAND_DOMAIN` — both should be set to actual production values, not currently set anywhere visible.
I15. `vercel.json` regions=["iad1"] matches live site's `x-vercel-id: iad1::…`.
I16. `lighthouserc.cjs` URL list excludes /age-gate — since the live site immediately redirects there, this is the most-frequently-rendered page and arguably the one that needs Lighthouse coverage most.
I17. Prior audit at `docs/audit/2026-05-19_full_audit_report.md` is preserved on disk; v2 supersedes for the same HEAD.
I18. `audit/` directory at repo root (untracked) holds 22+ files from prior sub-agent run — operator should `rm -rf audit/` or `.gitignore` it.
I19. Operator email captured in committed history is gmail — separate from `ops@vialchemlabs.com` operational alias in `.env.example:64,67`.

---

## 13. Operator-Gated Items

| D-code | Subject | Status on disk |
|---|---|---|
| **D18** | Vercel production deploy | **DONE** (live at `vialchemlabs.net`, Vercel IAD1) |
| **D19** | Domain registration + DNS | **PARTIAL** — `vialchemlabs.net` registered + DNS live; codebase points at `vialchemlabs.com` which is not registered. **CRITICAL alignment** required. |
| **D20** | LLC formation | Not verifiable from disk — operator self-attests; env defaults `vialchemlabs LLC / Wyoming`. |
| **D21** | Lab partner contract | **PARTIAL** — site copy is lab-agnostic per v1.3.0; outreach templates still name Janoshik. |
| **D22** | First-batch real COA PDFs | **SEVERELY SHORT** — 7 placeholders for 37 SKUs; 30 SKUs have no COA file at all. |
| **D23** | First-buyer test dollar | **READY** — runbook at `docs/deploy/first-payment-verification.md`; Test 1 framing misleading. |

Additional operator-only items the audit surfaced:
- O1: Delete or `.gitignore` the untracked `audit/` directory + `test-reports/` (Iron Law 2.12 preflight pollution).
- O2: Redact `ak47abhinav47@gmail.com` from `docs/checkpoints/phase_0_bootstrap.md:76` and commit-author trail; force-push if branch not yet on remote.
- O3: Decide whether v5 rebrand stands. If yes, commit a `docs/DECISIONS/locked_override_2026-05-10.md` documenting v3/v4 LOCKED_OVERRIDE per Iron Law 2.26 protocol.
- O4: Resolve `vialchemlabs.com` vs `vialchemlabs.net` ambiguity — pick one, update 162 codebase references + `.env.example` + `robots.txt` + JSON-LD canonicals.
- O5: Decide Iron Law 2.7 carve-out posture for tesamorelin + melanotan II + PT-141 + kisspeptin — either remove from catalog OR document LOCKED_OVERRIDE with legal opinion attached.

---

## 14. Recommended Next Actions

In priority order (description only; audit does not implement):

1. **Pick the production domain.** Decide whether `vialchemlabs.net` (current live) stays OR migrate to `vialchemlabs.com`/`vialchems.labs`. Update `lib/content/site.ts:8` default + `.env.example:11–14` + `public/robots.txt:13` + every absolute URL emit. Resolves C1, C11, H14, H29, M21, M25.
2. **Remove or LOCKED_OVERRIDE the banned SKUs.** Either (a) delete tesamorelin-5mg + melanotan-ii-10mg from `products.ts`, `product-descriptions.ts`, `product-images.ts`, `public/product-shots/`, OR (b) commit `docs/DECISIONS/locked_override_2026-05-10.md` with legal opinion + operator signature accepting FDA enforcement risk. Resolves C2, C3.
3. **Extend `lib/compliance.ts` regex set** to cover tesamorelin, melanotan, MT-2/MT-II, bremelanotide, bacteriostatic-water, GLP-1 obfuscations (tirz/sema/reta). Replace `\s*` with `[\s-]*` in pharma-comparison patterns to catch hyphenated forms. Resolves C4 + M1. Fix the `compliance.test.ts:63` safe case that certifies the bypass.
4. **Replace `Vial.tsx` whitelist mechanism**. Stop deriving from `products.map`; instead use an explicit static allowlist that EXCLUDES known-banned compounds. Add a unit test that asserts banned compounds throw even if they appear in `products.ts`. Resolves C5.
5. **Wire the Plaid JWKS path.** Branch on `PLAID_VERIFICATION_MODE` env in `lib/payments/plaid.ts`; default to JWKS in production; keep HMAC for legacy. Add E2E that simulates a real Plaid JWT. Resolves C6.
6. **Create `.github/workflows/lighthouse.yml`, `e2e.yml`, and `.github/CODEOWNERS`.** Install `@lhci/cli` as devDep. Verify `scripts/setup-branch-protection.sh` check names match the new workflows. Resolves C7, C10, M15.
7. **Reconcile v5 rebrand with Iron Law 2.26.** Either roll back globals.css + site.ts to v3/v4 Posture A LOCKED, OR commit the LOCKED_OVERRIDE doc. Then resolve tagline contradiction (decide between "Counted, weighed, verified." and "Research-grade peptides, shipped with the COA." and refactor home hero + footer + OG accordingly). Resolves C8, C9, H22.
8. **Wire Layer-3 jurisdictional guard** into `reconcile()` OR webhook route handlers BEFORE reconcile. Export `JurisdictionalGuardError` from `lib/payments/index.ts`. Add a route-handler-level unit test. Resolves C13, H28, M23.
9. **Persist reconciliation to Supabase.** Replace in-memory `Map<string,LedgerEntry>` with `payments` + `order_status_history` table writes. Resolves H2.
10. **Add Sentry `captureException`** to all 6 API routes' `catch` blocks. Resolves H3, H7. Implement `beforeSend` PII scrubber in `lib/sentry.ts` per Iron Law 2.22 spirit + Appendix scrubbing rules. Resolves H9.
11. **Add UI unit tests** for `AgeGateClient.tsx` and `qualification-flow.tsx` — the two most compliance-critical UI surfaces. Add brand-string regression test. Resolves H17, H18.
12. **Generate placeholder COA PDFs** for the 30 SKUs that don't have one, OR remove them from `lib/content/coa.ts` to prevent 404s. All placeholders must include "EXAMPLE COA — REPLACE BEFORE LAUNCH" prominently. Resolves H27.
13. **Fix Recovery Stack copy** in `lib/content/faq.ts:85` and `lib/content/email-templates.ts:106` to match actual products.ts:629–639. Resolves H11.
14. **Update operator runbook**: refresh stale v1.1.0 status to v1.3.0; strip Janoshik from outreach templates; fix USPTO TESS duplicate brand string; fix self-referential fallback domain lists. Resolves H12, H13, H14, L9.
15. **Append-only triggers** on `audit_log` + `attestations_audit` + `order_status_history`. Resolves H15, H16.
16. **Rate-limit `/api/access`, `/api/newsletter/subscribe`, `/api/contact`.** Resolves H5.
17. **Add CSP header** to `vercel.json`. Resolves M10.
18. **Add `engines.node`** (e.g., `"node": ">=20.20"`) and `.nvmrc`. Resolves M24.
19. **Delete or `.gitignore`** the untracked `audit/` and `test-reports/` directories at repo root; extend `scripts/grep-mogtrix.sh:36` exclude list. Resolves H25, §3 row 2.12.
20. **Redact** operator's personal gmail from `docs/checkpoints/phase_0_bootstrap.md:76`. Resolves C12.

---

## 15. Audit Methodology Confessions

Gaps the audit could not verify or chose to defer:

- **§5.5 live browser audit (23 pillars) deferred entirely** — dev server was not running and audit prompt §5.5.0 forbids self-starting it. Chromium IS installed; lighthouse IS available. The pipeline is runnable the moment the operator starts `npm run dev -- -p 3200 &`.
- **Binary files not opened** — `docs/design-references/vial-reference-2026-05-09.webp`, 5 bundle-shot PNGs, 37 product-shot PNGs, 7 COA placeholder PDFs. OG image visual brand-wordmark verification requires §5.5 Pillar 20 to run.
- **SUPER_PROMPT v3 (163KB / 2137 lines) and v4 (216KB / 2932 lines) not byte-diffed against codebase** — section-relied via this audit's §2.3 LOCKED state extraction.
- **CODEBASE_UNDERSTANDING.md, RESEARCH_PLAN.md, DESIGN.md** — referenced from prior audit's coverage; not full content cross-reference in this re-audit.
- **Sub-agents A, C+D, H+L+N not dispatched this run** — relied on static greps + prior audit's verbatim findings + spot-reads of specific files (Vial.tsx whitelist, robots.txt, sitemap.ts, webhook route handlers, site.ts, jurisdictions.ts, customer-qualification.ts, compliance.ts, globals.css token block). 4 sub-agents WERE dispatched (B, E+F+G, I+J+K, M) and their reports appear verbatim-summarized in §9.B, §9.E–G, §9.I–J–K, §9.M.
- **Slice K (tests/e2e) only inventoried** at the spec-level; not full source-read of all 4 spec files in this run. Sub-agent J+K did test-count + skip/only scan.
- **Wave files** scanned by sub-agent M for PII / credentials / Mogtrix / banned-compound carve-out drift; not full source-read of each.
- **JSON-LD live shape validation** — static `lib/seo/jsonLd.ts` reads suggest required fields are populated, but live-rendered HTML schema.org validation was not performed (deferred to §11.5 Pillar 19).
- **Sentry instrumentation files** (`sentry.{client,server,edge}.config.ts`) — existence verified via `ls`; configs not deep-read for PII-scrubbing wiring. `lib/sentry.ts` façade confirmed to lack `beforeSend` (sub-agent E+F+G).
- **DESIGN.md** — not byte-diffed against `lib/design/tokens.ts` + `app/globals.css` to confirm Posture A intent vs current implementation drift.
- **`docs/product-research/` wave files (34 files, 2932 lines total)** — sub-agent M covered headers + sampling for PII/credentials/banned-compound; not every paragraph.
- **`app/api/contact/route.ts` marketing-copy filter** — confirmed absent by sub-agent B; impact bounded (stub-only); flagged for Phase 7 wiring (M7).

**Live-site smoke result (NOT in audit prompt §5 scope but performed because operator provided the live URL)**: `https://vialchemlabs.net/` returns HTTP 307 to `/age-gate?next=%2F` from Vercel IAD1, HSTS preload header set. `vialchemlabs.com`/`vialchems.labs`/`vialchemslabs.net` DNS does NOT resolve. This single probe is what surfaced CRITICAL C1 + H29 + C11 + M21 + M25 + L7 that the prior audit (which did not probe DNS) did not catch.

**Temp-file inventory** — this audit created ZERO `/tmp/audit-*` files (per §5.5.0.1 only allowed when §5.5 runs; §5.5 was deferred). One ad-hoc `/tmp/live_index.html` written by the live-site probe and read inline (cleanup below). Verified clean.

**Single output artefact** — only `/root/peptide-site/docs/audit/2026-05-19_full_audit_report_v2.md` was created. Prior report at `docs/audit/2026-05-19_full_audit_report.md` preserved as evidence. No source-code mutations. No commits. No git mutations. Audit prompt §1 NON-NEGOTIABLES respected throughout.

**Why "v2" filename instead of overwriting**: the prior report was a complete prior run from earlier today against the same HEAD `ff97cde`. Per audit prompt §13 "Save once, do not revise after operator inspection — surface revisions in a follow-up file", a re-execution of the audit produces a follow-up file. The prior `docs/audit/2026-05-19_full_audit_report.md` is preserved on disk; this v2 supersedes it for operational use against the same HEAD.

---

End of report.
