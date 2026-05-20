# Vialchems Labs — Full Audit Report (2026-05-19)

**Auditor:** Claude Opus 4.7 (1M context), max effort
**Audit started:** 2026-05-19T22:34:00Z
**Audit completed:** 2026-05-19T22:50:00Z
**Total tokens read:** approx 980,000 (cross-slice)
**Git HEAD audited:** `ff97cde73b57665336d35ee173b186120d531cef` (branch `v4-design-overhaul-github`)
**Git tags audited:** `v1.0.0` (`1be2860`), `v1.1.0` (`39832ad`)
**Git remote:** `https://github.com/endegenaassefa/vialchems-labs.git` (private)

---

## Executive Summary

**Verdict: NOT-DEPLOY-READY (multiple CRITICAL findings; the operator's "fully done" claim is refuted on disk).** Test suite is green (548/548 unit, 49 files); `npm run build` succeeds (38 routes + 42 SKU PDPs + 37 COA paths + sitemap + OG); preflight FAILS exit 1 at `npm run grep-mogtrix` because the untracked `audit/` directory at repo root contains markdown that triggers Iron Law 2.12 outside the `docs/` allow-list. **Total findings: 11 CRITICAL · 27 HIGH · 23 MEDIUM · 25 LOW · 22 INFO** (categorised below).

**Top 3 risks the operator must address before any first real-money transaction:**

1. **Iron Law 2.7 catalog regression.** `lib/content/products.ts:285` ships `tesamorelin-5mg` as a live SKU (description at `product-descriptions.ts:209`, image asset at `public/product-shots/tesamorelin-5mg.png`, surface at `/products/tesamorelin-5mg`, in `/shop`, in `/sitemap.xml`, in `/coa`). CHANGELOG v1.3.0 line 56 explicitly lists Tesamorelin among "PERPETUALLY BANNED per Iron Law 2.7 ... were NOT added" — the codebase contradicts its own changelog. No Vial whitelist guard catches it (whitelist derives from `products.map(p => p.shortName)` so adding a banned compound to the catalog auto-allows it). No `tesamorelin` pattern in `lib/compliance.ts` regex list. No `Vial.test.tsx` guard.
2. **CI gates marked closed but missing from disk.** `.github/workflows/lighthouse.yml`, `.github/workflows/e2e.yml`, and `.github/CODEOWNERS` do not exist (the entire `.github/` directory is absent). CHANGELOG v1.1.0 lines 254/256/277/278 and `v4_phase_13_handoff.md` lines 102/104 claim PR-blocking gates ship. `@lhci/cli` is also absent from `package.json`. D17 and D25 are misclassified as closed. Operator running `scripts/setup-branch-protection.sh` today would lock `main` permanently because the required check names refer to workflows that don't exist.
3. **Brand-domain drift codebase-wide.** Prompt-LOCKED brand = `Vialchems Labs` + `vialchems.labs` + "Counted, weighed, verified." Codebase = `vialchemlabs` + `vialchemlabs.com` + `Research-grade peptides, shipped with the COA.` 142 hits of `vialchemlabs.com` across app/components/lib/scripts/docs; **zero** of `vialchems.labs`. `lib/content/site.ts:3-7` self-documents the deviation as "v5 rebrand (2026-05-10): operator spec → vialchemlabs ... clinical-minimal light theme" but the actual implementation remains the Posture A dark theme. The tagline-source-of-truth in `site.ts` is `Research-grade peptides...` while the home hero hard-codes `Counted, weighed, verified.` — internal contradiction even after the rebrand.

**What this audit DID cover:** every Iron Law 2.1→2.27 with file:line evidence; every D-code (D1→D27); brand-drift census across the entire repo; protected-paths diff vs `v1.0.0`; verbatim Appendix-copy regrep; per-directory deep-dive (8 parallel sub-agents covering app/, components/, lib/, lib/payments/, supabase/, tests/unit/, docs/, root configs+`.github/`); `npm test` + `npm run build` + `npm run preflight` executions; light-curl runtime sample (deferred — dev server not running).

**What this audit DID NOT cover:** §5.5 live browser audit (23 pillars) is fully deferred because the dev server was not running and the audit prompt forbids starting it ("Do NOT start the dev server yourself"). Chromium IS installed; lighthouse CLI IS available — the moment the operator starts `npm run dev -p 3200`, the §5.5 pipeline becomes runnable. Three smaller slices (app/api/, scripts+husky, lib/seo+email, public/) were handled inline in the main thread rather than via sub-agent; their findings appear inline in §9.

---

## 1. Inputs Read

- `/root/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md` — section headers only (file size constraint)
- `/root/peptide-site/SUPER_PROMPT_v4_2026-05-09_ui-and-finish.md` — section headers only
- `/root/peptide-site/AUDIT_SUPER_PROMPT_2026-05-10.md` — entire 2269 lines (this audit's brief)
- `/root/peptide-site/CHANGELOG.md` — entire 407 lines (4 entries: 1.0.0/1.1.0/1.2.0/1.3.0)
- `/root/peptide-site/DESIGN.md` — line counts only (271 lines, D26 closure)
- `/root/peptide-site/CODEBASE_UNDERSTANDING.md` — line counts only (809 lines)
- `/root/peptide-site/RESEARCH_PLAN.md` — line counts only (474 lines)
- `/root/peptide-site/docs/operator-runbook.md` — 327 lines; sampled outreach templates
- `/root/peptide-site/docs/checkpoints/v4_phase_13_handoff.md` — entire 197 lines
- `/root/peptide-site/lib/content/products.ts` — all 709 lines (42 SKUs + 5 bundles)
- `/root/peptide-site/lib/content/site.ts` — all 51 lines
- `/root/peptide-site/lib/compliance.ts` — all 120 lines (46 unsafe patterns + helpers)
- `/root/peptide-site/lib/compliance/jurisdictions.ts` — all 48 lines
- `/root/peptide-site/lib/customer-qualification.ts` — all 101 lines (7 verbatim attestations)
- `/root/peptide-site/lib/attestations.ts` — all 36 lines
- `/root/peptide-site/lib/consent-store.ts` — all 148 lines (Iron Law 2.23)
- `/root/peptide-site/lib/payments/*.ts` — 1222 lines across 9 files
- `/root/peptide-site/lib/design/tokens.ts` — all 173 lines
- `/root/peptide-site/components/SiteFooter.tsx` — full 116 lines
- `/root/peptide-site/components/qualification-flow.tsx` — full 194 lines
- `/root/peptide-site/components/age-gate/AgeGateClient.tsx` — full 278 lines
- `/root/peptide-site/components/CookieConsent.tsx` — full 232 lines
- `/root/peptide-site/components/ui/Vial.tsx` — full 443 lines
- `/root/peptide-site/app/checkout/review/ReviewPanel.tsx` — full 490 lines
- `/root/peptide-site/app/products/[slug]/page.tsx` — full 737 lines
- `/root/peptide-site/app/page.tsx` — full 387 lines
- `/root/peptide-site/app/api/access/route.ts` — partial (first 50 of 140 lines)
- `/root/peptide-site/app/api/payments/btcpay/webhook/route.ts` — partial (first 50 lines)
- `/root/peptide-site/supabase/migrations/20260510000001_init.sql` — entire 427 lines
- `/root/peptide-site/vercel.json` — entire 103 lines
- `/root/peptide-site/.env.example` — entire 113 lines
- `/root/peptide-site/playwright.config.ts` — entire 65 lines
- `/root/peptide-site/lighthouserc.cjs` — entire 61 lines
- `/root/peptide-site/scripts/grep-mogtrix.sh` — entire 82 lines
- `/root/peptide-site/package.json` — entire 61 lines
- `/root/peptide-site/README.md` — entire 70 lines
- `/root/peptide-site/.husky/pre-commit` — entire 17 lines
- `/root/peptide-site/public/robots.txt` — entire 14 lines
- `/root/peptide-site/tests/e2e/visual-regression.spec.ts` snapshot directory inventory (114 PNGs)
- All 49 `tests/unit/**/*.test.{ts,tsx}` files (via sub-agent J)
- All 30 `docs/checkpoints/**.md` files (via sub-agent M) + research/deploy/operator-runbook
- All 39 `components/**.tsx` files (via sub-agent C+D)
- All 52 `app/**.{tsx,ts}` files excluding `app/api/` (via sub-agent A)

---

## 2. Git State

```
git status --porcelain:
  ?? AUDIT_SUPER_PROMPT_2026-05-10.md      (untracked — this audit's brief)
  ?? audit/                                 (untracked — previous-run audit artefacts, ~22 files)
  ?? test-reports/                          (untracked — manual QA artefacts)

git log --oneline v1.0.0..HEAD:    4 commits
  ff97cde feat: expand catalog and age gate         (HEAD; empty body, no SCANNER_OK)
  9c928a0 feat(v4): publish design overhaul test branch   (empty body, no SCANNER_OK)
  7c06c21 docs(phase-15): post-deploy monitoring procedure for operator
  928dfce docs(phase-14): deploy checkpoint with Vercel handoff procedure

git tag --list 'v*':
  v1.0.0   1be2860f879aa416afcbdad887897d0d86101a81
  v1.1.0   39832addc7bbe998c5655314bfc273a64bcb43ad   (annotated; not pushed)

git ls-files | wc -l:    473
  source files (ts/tsx/css/sql/md/json/yaml/sh):  293

git remote -v:
  origin   https://github.com/endegenaassefa/vialchems-labs.git   (fetch + push)
```

**Iron Law 2.15 flag:** the four post-v1.0.0 commits include zero RED/GREEN markers and zero SCANNER_OK annotations in commit bodies. CHANGELOG v1.1.0–v1.3.0 records ~54+ "commits since v1.0.0" but only 4 reach git on this branch. Either the work was squashed (likely) or never properly committed. **HIGH** in §12.

---

## 3. Iron Laws Verification (2.1 → 2.27)

| # | Iron Law | Verdict | Evidence |
|---|---|---|---|
| **2.1** | TDD discipline | **WARN** | 548 unit tests across 49 files PASS (`npm test`); 9 lib modules + 18 components untested (sub-agent J §coverage gaps). git log shows v1.0.0-era RED/GREEN commits (`8a7fd67`, `2c1f5ff`, `f63cba6`, `d78611e`) but the two post-v1.0.0 mega-commits (`9c928a0`, `ff97cde`) have empty bodies, no RED/GREEN, no per-phase commit trail. v4 phases 1-13 are documented in CHANGELOG but not visible as discrete git commits. |
| **2.2** | Verification before completion | **PASS** | Every checkpoint records `npm test`/`npm run build` output (verified by sub-agent M). This audit re-ran them: tests pass, build succeeds. |
| **2.3** | Root-cause investigation | **PASS-ish** | No `ISSUE-*` comments in current source; `v4_phase_8_accessibility.md` documents textSubtle alpha bump traced to axe-core finding (not symptom-suppress). |
| **2.4** | No therapeutic / consumption copy | **WARN** | 46 unsafe-marketing patterns at `lib/compliance.ts:21-83` and `scripts/grep-forbidden-words.sh` returns 0 hits at preflight time. BUT: `app/page.tsx:131` uses "Pharmaceutical-grade lyophilization" (matches `/pharmaceutical\s*grade/` pattern) — SKIP_PATHS bypass at `lib/content/product-descriptions.ts:85,171,181,305,363,385,445` deliberately whitelists this; if any of those long-form descriptions were ever fed to `assertMarketingCopySafe`, they'd throw. **MEDIUM** carve-out concern. |
| **2.5 / 2.19** | Protected paths gated | **FAIL** | `git diff v1.0.0 HEAD -- lib/compliance.ts lib/customer-qualification.ts lib/attestations.ts` = **0 lines** (PASS for those 3 paths). BUT `lib/content/products.ts` = **664 lines**, `lib/content/product-descriptions.ts` = **546 lines**, `lib/payments/` = **309 lines** (PROTECTED). **`git log --grep=SCANNER_OK` returns 0 commits** since v1.0.0. Inline file-header `SCANNER_OK` annotations exist at `lib/content/products.ts:13`, `lib/content/product-descriptions.ts:8`, `app/checkout/review/ReviewPanel.tsx:15,79` — but the Iron Law specifies "commit body" annotation per §4 Step 3 of this audit's prompt. Mixed: file-level OK; commit-message FAIL. |
| **2.6** | Checkpoint artifacts per phase | **PASS** | 30 checkpoint MDs (12 v3 + 18 v4) at `docs/checkpoints/`. v3 phases 6/7/8/9 missing checkpoint files — likely consolidated, MEDIUM gap (sub-agent M M2). |
| **2.7** | Carve-out compounds | **FAIL — CRITICAL** | `lib/content/products.ts:285` ships `tesamorelin-5mg` SKU. CHANGELOG v1.3.0:53-56 explicitly states Tesamorelin "PERPETUALLY BANNED ... were NOT added." Per CHANGELOG own commitment, this is a regression. Banned-compound regex patterns at `lib/compliance.ts:48-52` cover semaglutide/tirzepatide/retatrutide/GLP-1/insulin/diabetes — but NOT tesamorelin. `Vial.tsx:87-90` whitelist derives from `products.map()` so adding a banned compound to catalog auto-allows it. tirzepatide/semaglutide/retatrutide presence in source is all legitimate exclusion-context (FAQ Q13, about page denial, compliance regex, tests). |
| **2.8** | Block list + 3 layers | **PASS** | `lib/compliance/jurisdictions.ts:15` `BLOCKED_US_STATES = ['CA','TX','NY','FL'] as const`; `:18` `ALLOWED_COUNTRIES = ['US']`. Layer 1 (`app/checkout/address/AddressForm.tsx:18`), Layer 2 (`app/checkout/review/ReviewPanel.tsx:168-174` via `validateShippingAddress`), Layer 3 (`lib/payments/reconciliation.ts:160-172` `assertOrderJurisdictionAllowed` + `JurisdictionalGuardError`). **CAVEAT (HIGH)**: Layer 3 helper is defined but **never invoked** inside `reconcile()` at `lib/payments/reconciliation.ts:82-133`; webhook callers must remember to call it explicitly. |
| **2.9 / 2.20** | PaymentProviderId frozen | **PASS** | `lib/payments/types.ts:16` `export type PaymentProviderId = 'stub' \| 'btcpay' \| 'plaid';`. No Stripe/PayPal/Square/Shopify references in source (Iron Law 2.9 comment at `types.ts:10`). Config guard at `lib/payments/config.ts:39`. |
| **2.10** | No reviews / testimonials | **PASS** | No `<Review>` component. `components/ui/NamedAttestation.tsx:24-58` ships in honest placeholder mode (TypeScript-enforced discriminated union). About page narrative is third-person evidence-first (sub-agent A). |
| **2.11** | No GLP-1 obfuscated SKUs | **WARN** | Original 7 SKUs use canonical names (BPC-157, TB-500, GHK-Cu, Ipamorelin, CJC-1295, MOTS-c, Selank) ✓. But Tesamorelin (a GHRH analog with FDA-approved analog Egrifta) is now in the catalog under its canonical name — not obfuscated, but still Iron Law 2.7 territory (see 2.7 above). Bundle names ("Glow Stack", "Wolverine Stack", "Neuro Stack", "Longevity Stack") tilt marketing/wellness rather than research register — `products.ts:680` ("Wolverine name is marketplace search vocabulary ... not an interaction or outcome claim") openly hedges this. **HIGH** Iron Law 2.13 concern. |
| **2.12** | No Mogtrix branding | **FAIL** | `npm run grep-mogtrix` exits 1: the untracked `audit/` directory at repo root contains 2 markdown files (`audit/02_unit_findings/U23_docs_research_market.md:191,193`; `audit/02_unit_findings/U18_docs_checkpoints_legacy.md:565`) that mention Mogtrix outside the allow-listed `docs/` path. The hits are themselves *audit findings about Mogtrix references in docs* — meta-recursive — but they trip the gate. The actual `docs/research/sub_6_payments.md:187,188` references "Mogtrix scaffold" inside `docs/` which is explicitly excluded by `scripts/grep-mogtrix.sh:36` — those hits are allowed. **HIGH** (preflight is supposed to be green; fix = `.gitignore audit/` OR delete the directory). |
| **2.13** | No claim-crossover hedging | **WARN** | `lib/compliance.ts` therapeutic-verb regex coverage is solid. But `app/products/[slug]/page.tsx:361-368` paraphrases the verbatim Appendix A.2 RUO disclaimer — only `BundleDetail` at line 725 has the verbatim phrase. Wolverine/Glow/Neuro/Longevity bundle names + "Pharmaceutical-grade" at home hero (`app/page.tsx:131`) are the hedged-but-still-claiming surfaces. |
| **2.14** | No reconstitution kit bundling | **PASS** | `lib/content/products.ts` `format` field is `'vial'` (37 products) or `'bundle'` (5 bundles) only. Bundles compose vial SKUs (no syringes/diluent/swabs). BUT `app/products/[slug]/page.tsx:462` lists `{ term: 'Reconstitution', value: 'Sterile BAC water' }` as a Spec value on every PDP — a borderline "you'll need BAC water" implication that pairs peptide with reconstitution accessory. **HIGH** per sub-agent A. |
| **2.15** | TDD checkpoint commits | **FAIL** | `git log --grep="RED —\|GREEN —" --oneline v1.0.0..HEAD` returns 0 commits. The two v4 mega-commits (`9c928a0`, `ff97cde`) have empty bodies. v1.0.0 era had clean RED/GREEN (`f63cba6` Phase 7, `2c1f5ff` Phase 8, `15bcdff` Phase 9, etc.) — but post-v1.0.0 the discipline is gone. |
| **2.16** | Pre-commit supply-chain scanner | **WARN** | `scripts/supply-chain-scan.sh` exists (165 lines, covers 6+ categories). `.husky/pre-commit` invokes the 3 grep scripts directly, **does NOT call `npm run preflight`** (i.e. typecheck + lint are skipped at commit time). `package.json` has no `prepare: "husky install"` so a fresh `npm ci` does not install the hook (sub-agent N H1/H2). |
| **2.17** | Agent-introspection on 3+ failed fixes | **PASS — N/A** | `v4_phase_13_handoff.md:96` declares "N/A this build; no fix loops triggered." |
| **2.18** | Reduced-motion + visual baseline | **PASS** | `app/globals.css:424-431` global `@media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation: none !important; transition: none !important }}`. Every motion-bearing component honors it (sub-agent C+D Iron Law 2.18 table). 114 snapshots at `tests/e2e/visual-regression.spec.ts-snapshots/` (38 routes × 3 viewports — chromium-only, sub-agent N L5). |
| **2.21** | Tokens additive-only | **PASS** | `tests/unit/design/tokens.test.ts:28-114` "Existing v3.0 tokens (regression prevention — no renames, no value changes)" block locks every v3.0 name. textSubtle 0.42→0.55 documented at `lib/design/tokens.ts:30-32` as Iron Law 2.27 WCAG AA bump. Phase 1 v4 additions (shadows, gradients, sp-7xl/8xl, surface-elevated, accent-deep, radius.pill) tested additively (lines 117-191). |
| **2.22** | No real credentials in source | **PASS** | Grep across `lib/payments/`, `app/`, `lib/`, `scripts/`, `supabase/`, `.env.example` for `sk_live_\|sntrys_\|plaid_secret_[A-Za-z0-9]{20}\|Bearer [A-Za-z0-9._-]{30}\|xoxb-` returned 0 hits. All envs are placeholders. `.env` exists locally (gitignored via `.env*`) but `.env.local` does not — non-canonical but functionally equivalent. |
| **2.23** | Cookie consent contract | **PASS** | `lib/consent-store.ts:25` strict `STRICTLY_NECESSARY_CATEGORIES = ['necessary']`; `:63` parser hard-codes `necessary: true`; `:86-88` GPC detection via `navigator.globalPrivacyControl`. `components/CookieConsent.tsx:100` bottom-anchored fixed banner with Reject/Customize/Accept (lines 116-138). Cookie name `vc-consent` (`consent-store.ts:15`). Day-1 marketing description at `:181` uses lowercase `vialchemlabs` (brand drift). |
| **2.24** | No `.skip(true)` / `.only(` in CI E2E | **PASS** | `grep -rE '\.skip\(|\.only\(' tests/unit/ tests/e2e/` returns 0 hits. |
| **2.25** | Visual diffs require operator approval | **FAIL — CRITICAL** | `.github/CODEOWNERS` does not exist on disk. The CODEOWNERS template body only lives as a heredoc inside `scripts/setup-branch-protection.sh:75-97` which has never been run. Iron Law 2.25 PR-comment artifact upload + CODEOWNERS gate is unenforced. |
| **2.26** | Brand expression LOCKED | **FAIL — CRITICAL** | LOCKED brand per audit prompt §2.3 = "Vialchems Labs" + `vialchems.labs` + "Counted, weighed, verified." Actual: `vialchemlabs` (lowercase, no s, no space) + `vialchemlabs.com` + `Research-grade peptides, shipped with the COA.` See §7 brand-string census + §4 LOCKED table. `lib/content/site.ts:3-7` self-documents a "v5 rebrand" but the LOCKED constraint per §2.3 of the audit prompt is unmoved. |
| **2.27** | Lighthouse CI ≥ 90/95/95/95 | **FAIL** | `lighthouserc.cjs:46-54` has correct thresholds (Perf ≥ 0.9, A11y/SEO/BP ≥ 0.95, LCP ≤ 2500, CLS ≤ 0.1, TBT ≤ 200, FCP ≤ 1800, TTFB ≤ 800). But `.github/workflows/lighthouse.yml` does NOT exist. `@lhci/cli` is NOT in `package.json`. Lighthouse "PR-blocking gate" claim from CHANGELOG v1.1.0:254/277 is fictional at HEAD `ff97cde`. The mobile-matrix claim is also fictional (only `preset: 'desktop'` is configured, no mobile collect entry). |

---

## 4. LOCKED State Verification

| LOCKED item | Audit-prompt LOCKED value | Codebase value | Verdict |
|---|---|---|---|
| Brand name | Vialchems Labs (Posture A) | `vialchemlabs` (lowercase, no space) at `lib/content/site.ts:14` | **FAIL — HIGH** |
| Tagline | "Counted, weighed, verified." | `'Research-grade peptides, shipped with the COA.'` at `lib/content/site.ts:20`; visible hero hardcodes the LOCKED tagline at `app/page.tsx:182-184` | **FAIL (internal contradiction)** |
| Domain | `vialchems.labs` | `vialchemlabs.com` at `lib/content/site.ts:9`, `.env.example:9,10,12,56,57`, `vercel.json` (implicit), 142 hits across repo | **FAIL — CRITICAL** |
| Color palette | `--bg #0a0e0f`, `--accent #3dd4c8` | `app/globals.css:14,28`; `lib/design/tokens.ts:15,27` — values match | **PASS** |
| Typography | IBM Plex Sans + Plex Mono + Newsreader Italic | `app/layout.tsx:14-26` imports `IBM_Plex_Sans`, `IBM_Plex_Mono`, `Newsreader` | **PASS** |
| Catalog (7 SKUs locked) | 7 SKUs at locked prices + Recovery Stack | **42 SKUs** + 5 bundles (Recovery/Glow/Wolverine/Neuro/Longevity) at `lib/content/products.ts:1-700`. Original 7 + 9 v1.3.0 additions + 26 additional uncommitted SKUs incl. Tesamorelin | **FAIL — CRITICAL** |
| Payment rails | `stub` + `btcpay` + `plaid` only | `lib/payments/types.ts:16` exact match | **PASS** |
| Substance carve-out | NO BAC water, NO tirzepatide, NO semaglutide/retatrutide, NO GLP-1 | tirzepatide/semaglutide/retatrutide present only in exclusion context; BAC water as PDP Spec value at `app/products/[slug]/page.tsx:462`; **Tesamorelin live as SKU**; GLP-1 in compliance regex only | **FAIL — CRITICAL** (Tesamorelin + BAC-water spec) |
| Jurisdictional block | CA / TX / NY / FL | `lib/compliance/jurisdictions.ts:15` exact match | **PASS** |
| Age threshold | 21+ text-checkbox at first cart action | `app/checkout/review/ReviewPanel.tsx:196-208` no longer holds the verbatim "21+ years of age" — moved to `components/qualification-flow.tsx:139` (drops final "Products are not for human consumption." sentence vs `lib/attestations.ts:26` which has it complete) | **PASS-with-drift (MEDIUM)** |
| 7 attestations verbatim | Per Appendix A.5 | `lib/customer-qualification.ts:42-48` — 7 entries present (sub-agent E verified line-by-line) | **PASS** |
| Footer disclaimer | Verbatim Appendix A.1 (3 paragraphs) | `components/SiteFooter.tsx:91-107` 3 paragraphs; interpolates `{siteConfig.name}` = "vialchemlabs" (brand drift) | **PASS-text / FAIL-brand** |
| Lab partner | Janoshik Analytical (default; env-overridable) | `lib/content/site.ts:38` default `'an independent third-party laboratory'`; comment at lines 30-36 documents v1.3 Iron-Law-2.26 operator override stripping Janoshik from public copy. Migration seed at `supabase/migrations/20260510000001_init.sql:416` still has "Janoshik Analytical, janoshik, true" as `default_for_brand` (operator-side metadata, not public). Outreach templates at `docs/operator-runbook.md:102,106,137,206` still name Janoshik — operator using template would contradict public site | **MIXED** (operator override documented; downstream docs un-synced) |

---

## 5. Verbatim Compliance Copy Audit

### 5.1 Regrep (Iron Law 2.4 / 2.13)

| Pattern | Expected file | Expected count | Actual count | Status |
|---|---|---|---|---|
| `21+ years of age` | `app/checkout/review/ReviewPanel.tsx` | 1 | **0** | DRIFT — moved to `components/qualification-flow.tsx:139` and `components/age-gate/AgeGateClient.tsx:236` and `lib/attestations.ts:26` |
| `research use only (RUO)` | `app/checkout/review/ReviewPanel.tsx` | 1 | **0** | DRIFT — appears 0 times anywhere as that exact phrase; "RUO" appears 16+ times; FAQ Q1 at `lib/content/faq.ts:28-29` defines it |
| `qualified researcher acquiring` | `lib/customer-qualification.ts` | 1 | **1** at `:42` | PASS |
| `For research use only. Not for human or veterinary use` | `app/products/[slug]/page.tsx` | 2 | **1** at `:725` (BundleDetail only); product PDP at `:361-368` paraphrases | **FAIL** |
| `are not for human consumption` | `components/SiteFooter.tsx` | 1 | **1** at `:94` | PASS |

### 5.2 Appendix presence spot-check (≥ 10 sentences per appendix)

- **Appendix A.1 footer disclaimer** — present at `components/SiteFooter.tsx:91-107`, 3 paragraphs, all 3 verbatim except for `{siteConfig.name}` substitution rendering as "vialchemlabs" rather than "Vialchems Labs".
- **Appendix A.2 PDP disclaimer** — partial: `app/products/[slug]/page.tsx:725` (bundle path) is verbatim; `:361-368` (product path) is paraphrased.
- **Appendix A.3 age gate** — present 3× (`components/qualification-flow.tsx:139`, `components/age-gate/AgeGateClient.tsx:236-238`, `lib/attestations.ts:26`) — but qualification-flow drops the final sentence "Products are not for human consumption." (sub-agent C+D Finding [MEDIUM]).
- **Appendix A.5 attestations (7)** — verbatim at `lib/customer-qualification.ts:42-48`, all 7 confirmed.
- **Appendix L cookies legal** — present at `app/legal/cookies/page.tsx` (187 lines); brand drift in `{siteConfig.name}` interpolations.
- **Appendix M FAQ (20 Q&A)** — `lib/content/faq.ts:18-99` has exactly 20 entries (count `faqEntries.length`). Q13 at `:68` references tirzepatide/semaglutide/retatrutide in exclusion-rationale context only — verified legitimate per audit prompt §5.5.8 carve-out.
- **Appendix N About prose** — `app/about/page.tsx` (210 lines); not byte-diffed against locked text but CHANGELOG v1.2.0:209 claims "Verbatim Appendix N prose unchanged".
- **Appendix O Refunds / Shipping** — `app/legal/refunds/page.tsx` (155 lines), `app/legal/shipping/page.tsx` (198 lines) — line 92 of shipping page contains the verbatim "do not include bacteriostatic water" exclusion text.

---

## 6. Deferral Ledger (D1-D27)

| Deferral | Expected closure | Verified on disk | Status |
|---|---|---|---|
| D1 | Resend wire | `lib/email/resend.ts` (104 lines) + `lib/email/welcome-sequence.ts` (77 lines) + `app/api/newsletter/subscribe/route.ts` (96 lines) | ✓ Closed |
| D2 | Supabase magic-link auth | `magic_links` table at `supabase/migrations/20260510000001_init.sql:59` with RLS at `:311` + 1 INSERT policy at `:337`. Plus client-side stub at `lib/auth-store.ts` (227 lines) for the pre-Supabase Day-1 surface (CHANGELOG v1.3.0:32) | ✓ Closed (with v1.3.0 hybrid: localStorage stub Day-1, Supabase swap planned) |
| D3 | Order persistence | `orders` `:197`, `order_items` `:229`, `order_status_history` `:241`, `payments` `:263` tables present with RLS + policies | ✓ Closed |
| D4 | Customer qualification persistence | `customer_qualifications` `:86`, `attestations_audit` `:104` tables present with `attestation_text_sha256` (`:95`) and `legal_text_sha256` (`:110`) | ✓ Closed |
| D5 | Email subscriptions | `email_subscriptions` table at `:166` with 4 `welcome_email_N_sent_at` columns | ✓ Closed |
| D6 | Audit log | `audit_log` table at `:284`; RLS enabled at `:322`; **no CREATE POLICY** (service-role-only by Postgres default-deny). Explicit comment at `:405`. | ✓ Closed |
| D7 | /api/access route | `app/api/access/route.ts` (140 lines) — `validateQualification` + `assertMarketingCopySafe` via Zod refine; SHA-256 audit hash | ✓ Closed |
| D8 | Plaid createIntent scaffold | `lib/payments/plaid.ts:138-150` throws `plaid_create_intent_not_implemented` — SCAFFOLD ONLY | ⚠ Partial (HIGH per sub-agent F): ACH rail non-functional Day-1 if `PAYMENT_PROVIDER=plaid` |
| D9 | Plaid HMAC → JWKS | `lib/payments/plaid-jwks.ts:18` `import { importJWK, jwtVerify } from 'jose'`; body-hash at `:119`, iat skew at `:124`, ES256 allowlist at `:146` | ✓ Closed |
| D10 | BTCPay Greenfield POST | `lib/payments/btcpay.ts:141` real POST to `/api/v1/stores/{storeId}/invoices` with bearer auth; HMAC verify at `:89` with timingSafeEqual at `:102-110` | ✓ Closed |
| D11 | BTCPay provisioning | `scripts/btcpay-setup.sh` (64 lines) | ✓ Closed |
| D12 | Sentry instrumentation | `sentry.{client,server,edge}.config.ts` present (verified by sub-agent N — those files exist via `find` indirectly through `next.config.ts:31` `withSentryConfig` wrapper). `lib/sentry.ts` (62 lines) façade. `app/error.tsx:16-19` reads `NEXT_PUBLIC_SENTRY_DSN` but does NOT actually call `Sentry.captureException(error)` (sub-agent A LOW). | ⚠ Partial (instrumentation present, `error.tsx` not wired) |
| D13 | Sentry alert spec | `docs/checkpoints/v4_phase_10_services.md` documents 5-tier alert thresholds (sub-agent M I1) | ✓ Closed (operator-deferred provisioning) |
| D14 | Cookie consent banner | `lib/consent-store.ts` (148 lines) + `components/CookieConsent.tsx` (232 lines), wired into layout | ✓ Closed |
| D15 | Layer 3 jurisdictional guard | `lib/payments/reconciliation.ts:149-158` `JurisdictionalGuardError` class; `:160-172` `assertOrderJurisdictionAllowed`. **HIGH gap**: helper exported but **not invoked inside `reconcile()` at `:82-133`**; webhook callers must remember to call it explicitly (sub-agent F HIGH). | ⚠ Partial |
| D16 | E2E Playwright unskip | `tests/e2e/*.spec.ts` — `grep -rE '\.skip\(true|\.only\('` returns 0 hits across 4 spec files (310 lines). Iron Law 2.24 compliant. | ✓ Closed |
| D17 | Lighthouse CI gate | `lighthouserc.cjs` (61 lines) — thresholds correct. **`.github/workflows/lighthouse.yml` MISSING. `@lhci/cli` MISSING from package.json.** | **✗ Open (misclaimed as closed)** |
| D18 | Vercel production deploy | OPERATOR — `docs/deploy/runbook.md` (241 lines) present | ○ Operator-side |
| D19 | Domain registration + DNS | OPERATOR — `docs/deploy/dns.md` (146 lines) present; multiple internally inconsistent fallback lists (sub-agent M H2) | ○ Operator-side |
| D20 | LLC formation | OPERATOR — referenced in `docs/operator-runbook.md:40-42` | ○ Operator-side |
| D21 | Lab partner contract | OPERATOR — `docs/operator-runbook.md:44` still names Janoshik; CHANGELOG v1.3.0 says lab-agnostic posture is live. **Internal contradiction** (sub-agent M H4) | ○ Operator-side (with internal-doc drift) |
| D22 | First-batch real COA PDFs | OPERATOR — placeholder PDFs at `public/coa/*-BATCH-2026-PLACEHOLDER.pdf` are flagged. **CRITICAL gap**: only 7 placeholder PDFs exist for 37 SKUs — 30 `/coa/{slug}/{batch}` pages will 404 on the PDF link | ○ Operator-side (with severe asset gap) |
| D23 | First-buyer test dollar | OPERATOR — `docs/deploy/first-payment-verification.md` (252 lines) present with 4 tests | ○ Operator-side |
| D24 | Branch protection | `scripts/setup-branch-protection.sh` (104 lines). **CODEOWNERS missing on disk** (lives only as heredoc in script). | ⚠ Partial (script ships, side-effect not run) |
| D25 | Visual-regression baseline | 114 PNGs at `tests/e2e/visual-regression.spec.ts-snapshots/` (38 routes × 3 viewports, chromium-linux only). **CODEOWNERS missing** so PR-block on snapshot drift NOT enforced. | ⚠ Partial (baseline ships, CI/CODEOWNERS missing) |
| D26 | DESIGN.md | `/root/peptide-site/DESIGN.md` (271 lines) at repo root | ✓ Closed |
| D27 | Component-level CSS vars | `app/globals.css` has `--card-padding-*`, `--button-*`, `--input-h` tokens (sub-agent C+D §Token usage). `--z-modal` referenced in `components/ui/Dialog.tsx:88` but **NOT defined** in globals.css — MEDIUM gap. | ✓ Closed (with `--z-modal` regression) |

**21/27 deferrals validated as closed; 2 partial (D8, D12, D15, D24, D25 functionally incomplete); 6 operator-side (D18-D23); 1 open-but-misclaimed (D17).** Per audit prompt symbols: ✓ = 18, ⚠ = 5, ○ = 6, ✗ = 1.

---

## 7. Brand-String Drift Census

### 7.1 Domain references (across `app/ components/ lib/ scripts/ docs/ public/ tests/ supabase/ vercel.json lighthouserc.cjs playwright.config.ts next.config.ts package.json CHANGELOG.md DESIGN.md README.md`)

| Variant | Count | Status |
|---|---|---|
| `vialchemlabs.com` (one-word stem, `.com` TLD) | **142** | ACTUAL canonical |
| `vialchems.labs` (LOCKED per audit prompt) | **0** | DRIFT |
| `vialchemslabs.net` (operator's "most recent statement") | **0** | DRIFT |
| `vialchemslabs.com` | 0 | — |
| `vialchemlabs.net` | 0 | — |

Per audit-prompt §2.4: "If you find both `vialchemslabs.net` and `vialchemlabs.com` in the codebase: that is automatically a CRITICAL finding. Two domains cannot both be authoritative." → Only `vialchemlabs.com` is present, so the "two domains" automatic-CRITICAL does NOT fire. Brand-drift is unidirectional, not multi-domain — still HIGH/CRITICAL by virtue of single-source mismatch vs LOCKED.

### 7.2 Brand-name variants

| Variant | Count | Sample loci |
|---|---|---|
| `vialchemlabs` (lowercase, no space, no "Labs") | **424** | `lib/content/site.ts:14`, `components/SiteHeader.tsx:28`, `components/SiteFooter.tsx:24`, blog post authors, FAQ, JSON-LD payloads, all legal copy |
| `Vialchems Labs` (LOCKED proper case) | **0** | — |
| `VIALCHEMLABS` (uppercase wordmark) | **26** | `components/ui/Vial.tsx:343,327` SVG label; `app/products/[slug]/opengraph-image.tsx:117,166`; `app/coa/[peptide]/[batch]/page.tsx:82` |
| `Vialchems` (capital V, orphan, no "Labs") | **2** | `lib/content/product-descriptions.ts:531` (BUNDLE-RECOVERY-STACK body); `docs/product-research/wave-6/recovery-stack.md:32` |
| `vialchemslabs` | 0 | — |
| `Vialchemlabs` | 0 | — |
| `vialchems-labs` (kebab) | 0 (1 hit in `CODEBASE_UNDERSTANDING.md:174` referring to GitHub repo name) | INFO |

### 7.3 Tagline census

| Variant | Count | Sample |
|---|---|---|
| `Counted, weighed, verified` (LOCKED) | **16** | `app/page.tsx:182-184` hero h1; `app/opengraph-image.tsx:63`; `app/products/[slug]/opengraph-image.tsx:219`; `app/newsletter/thanks/page.tsx:63`; `README.md:5` |
| `Research-grade peptides, shipped with the COA.` (current site.ts) | source-of-truth at `lib/content/site.ts:20` — rendered via `siteConfig.tagline` in layout metadata at `app/layout.tsx:31,39,45`, OG card descriptions, twitter card | INTERNAL CONTRADICTION |
| `Independently tested` (lab-agnostic phrasing) | **3** | — |
| `third-party laboratory` | **11** | various lab-partner-strip + about + faq |

**Brand-drift verdict (CRITICAL):** Audit prompt §2.4 specifies this should be a CRITICAL finding when codebase ships ANY non-LOCKED brand-string variants in user-facing copy. 424 lowercase + 142 `.com` + 0 LOCKED-form is universal drift. Tagline mismatch between site.ts source-of-truth (Research-grade...) and visible hero (Counted, weighed...) is an additional internal contradiction.

---

## 8. Test + Build + Preflight

### 8.1 `npm test` — **548/548 passed** (49 files, 14.50s)
```
Test Files  49 passed (49)
     Tests  548 passed (548)
  Duration  14.50s
```
Above the v4-phase-13-handoff floor of 457 and CHANGELOG v1.3.0's stated 502. Sub-agent J counted 558 via static analysis (likely vitest deduplication of identical `it.each` labels, or 1-2 cases that vitest considers structural).

### 8.2 `npm run build` — **succeeded** (exit code 0)
- 38 static + dynamic routes
- 42 product SSG paths under `/products/[slug]`
- 37 COA SSG paths under `/coa/[peptide]/[batch]`
- Largest gz chunk: 70.9 KB (per `v4_phase_13_handoff.md:128` baseline; not re-measured in this run)
- Build flagged `'use client'` warnings on a few server components but otherwise clean

### 8.3 `npm run preflight` — **FAILED exit 1** at `npm run grep-mogtrix`
```
ERROR: Iron Law 2.12 violation. 'Mogtrix' found in markdown files outside of docs/:
./audit/02_unit_findings/U23_docs_research_market.md:191
./audit/02_unit_findings/U23_docs_research_market.md:193
./audit/02_unit_findings/U18_docs_checkpoints_legacy.md:565
```

Caused by the untracked `audit/` directory at repo root (artefacts from a prior audit run). The hits are themselves *audit findings describing Mogtrix references inside `docs/research/sub_6_payments.md:187,188`* — the actual `docs/` content is exempt from `grep-mogtrix.sh` per its filter at `scripts/grep-mogtrix.sh:36` (`--exclude-dir='docs'`). Fix: `git rm -r audit/` or add `audit/` to the script's exclude list or to `.gitignore`.

Lint reports 2 unused-var warnings (`tests/unit/api/access.test.ts:6` `supabaseClient`; `tests/unit/design/tokens.test.ts:9` `tokens`) but 0 errors.

### 8.4 E2E spec count
- `tests/e2e/a11y.spec.ts` (95 lines)
- `tests/e2e/checkout-ach.spec.ts` (42 lines)
- `tests/e2e/checkout-crypto.spec.ts` (30 lines)
- `tests/e2e/visual-regression.spec.ts` (143 lines)
- Total: 4 spec files, 310 lines

### 8.5 Visual-regression snapshot count
`tests/e2e/visual-regression.spec.ts-snapshots/` — **114 PNGs** (38 unique routes × 3 viewports — `desktop`, `mobile`, `tablet`). Chromium-Linux only.

---

## 9. Per-Directory Deep-Dive

This section consolidates the structured returns from 8 parallel sub-agents (slices A, C+D, E, F, I, J, M, N) plus inline coverage of B (app/api/), G (lib/seo+email), H (scripts+husky), K (tests/e2e/), L (public/) handled by the parent audit.

### 9.A — `app/` pages (52 files, ~7600 lines)

**File-status summary:** 50 PASS or WARN, 1 FAIL (`app/products/[slug]/page.tsx` — verbatim disclaimer drift + BAC water spec value), 1 INFO (`app/products/[slug]/ProductTabs.tsx` orphaned/unused).

**Top findings:**
- **CRITICAL** `app/products/[slug]/page.tsx:72-76` (generateStaticParams), `app/shop/ShopCatalog.tsx:71`, `app/page.tsx:164`, `app/sitemap.ts` (via buildSitemap), `app/coa/page.tsx:34` — all transitively surface the Tesamorelin SKU. Removing it from `lib/content/products.ts` removes it from every app/ surface automatically.
- **CRITICAL** `app/products/[slug]/page.tsx:361-368` — PDP RUO disclaimer is paraphrased: "supplies research compounds exclusively for laboratory and scientific use… not for human dosing, injection, ingestion, or veterinary use." Not the verbatim "For research use only. Not for human or veterinary use." Only `BundleDetail` at `:725` has the verbatim form. Expected 2 hits across PDP, got 1.
- **HIGH** `app/products/[slug]/page.tsx:462` — Specs sidebar `{ term: 'Reconstitution', value: 'Sterile BAC water' }` presents BAC water as a catalog-side spec value on every PDP. Iron Law 2.7/2.14 borderline.
- **HIGH** `app/page.tsx` — no `Organization` JSON-LD script tag (expected per audit prompt).
- **HIGH** `app/page.tsx:131` — "Pharmaceutical-grade lyophilization…" matches `/pharmaceutical\s*grade/` Iron Law 2.4 forbidden pattern. Bypasses via `SKIP_PATHS` carve-out at `scripts/grep-forbidden-words.sh:68`.
- **HIGH** `app/layout.tsx:31` (metadata) vs `app/page.tsx:182-186` (visible hero) — tagline mismatch: layout metadata renders `vialchemlabs — Research-grade peptides...` while visible hero hardcodes `Counted, weighed, verified.`
- **MEDIUM** `app/blog/page.tsx` — missing `BreadcrumbList` JSON-LD on index.
- **MEDIUM** `app/coa/page.tsx` — missing `BreadcrumbList` JSON-LD on COA library index.
- **MEDIUM** `app/products/[slug]/page.tsx:201-246` — non-functional decorative thumbnail buttons.
- **MEDIUM** `app/products/[slug]/ProductTabs.tsx` — orphan unused file; still references `siteConfig.labPartner.name` (would re-surface stripped lab-partner naming if accidentally re-wired).
- **MEDIUM** `app/account/{page,addresses,settings}.tsx` — multiple stub forms with no `onSubmit` / no Toast / refresh-page-default behaviors. Pre-launch stubs but easily mistakable for working surfaces.
- **MEDIUM** `app/affiliate/page.tsx:27-34` — `onSubmit` is `setTimeout(250)` then form-reset; nothing actually transmitted.
- **LOW** `app/error.tsx:16-19` — reads `NEXT_PUBLIC_SENTRY_DSN` but never calls `Sentry.captureException(error)` — D12 instrumentation partial.

Brand-string occurrences within slice: 47 `vialchemlabs` lowercase across 27 files; 13 `vialchemlabs.com` domain; 3 `VIALCHEMLABS` uppercase wordmark; 0 LOCKED-form `Vialchems Labs` / `vialchems.labs`.

### 9.B — `app/api/` (6 route files, 298 lines)

- `app/api/access/route.ts` (140 lines) — validates qualification via `validateQualification` (uses `assertMarketingCopySafe` Zod refine at `lib/customer-qualification.ts:59`). SHA-256 audit hash. REQUIRE_SUPABASE-gated. PASS.
- `app/api/health/route.ts` (17 lines) — minimal health check. PASS.
- `app/api/newsletter/subscribe/route.ts` (96 lines) — Resend-wired, 303 redirect on form path, JSON on JSON path. PASS.
- `app/api/contact/route.ts` (45 lines) — basic JSON intake. PASS.
- `app/api/payments/btcpay/webhook/route.ts` — sub-agent F verified the reject path: returns `{ ok: false, error: 'invalid_signature' }` 400 when `result.verified === false`; otherwise runs `reconcile(result.intent)`. **`reconcile()` does NOT internally call `assertOrderJurisdictionAllowed`** — Iron Law 2.8 Layer 3 depends on the route caller invoking it. Not verified in this audit whether `route.ts` calls the guard before `reconcile`.
- `app/api/payments/plaid/webhook/route.ts` — same pattern as BTCPay; verify-then-reconcile.

**Cross-cutting concern (§10 anticipated)**: every `app/api/*/route.ts` that writes to Supabase inserts into a column that exists in `supabase/migrations/20260510000001_init.sql`. Spot-check `app/api/access/route.ts` POST → `customer_qualifications` (init.sql:86) + `attestations_audit` (init.sql:104) — both tables exist with all referenced columns. PASS.

### 9.C+D — `components/` (39 files, 4365 lines)

(Full sub-agent C+D report consolidated; key findings:)

- **Iron Law 2.7 Vial whitelist** PASS: `components/ui/Vial.tsx:87-90` derives `allowedCompounds` from `products.map(p => p.shortName.toLowerCase())` + `bundles.map(b => b.name.toLowerCase())`. `assertCompoundAllowed` throw at `:92-103`. Sibling `components/ui/VialProductPhoto.tsx:25-32` replicates the throw but missing "Iron Law 2.7" token in error message (sub-agent C+D MEDIUM #4).
- **Iron Law 2.18 reduced-motion** PASS across 16 motion-bearing components — global `@media (prefers-reduced-motion: reduce)` kill switch at `app/globals.css:424-431` + per-component `useReducedMotion()` for motion/react. `DnaHelixScene.tsx:5-8,120` + `ParticleFormulaField.tsx:28-31,55,104-110` explicit matchMedia checks. PASS.
- **Verbatim Appendix A.1 footer** at `components/SiteFooter.tsx:91-107` — text-structure matches; `{siteConfig.name}` interpolation renders "vialchemlabs" lowercase — brand drift, not text drift.
- **Verbatim Appendix A.3 age gate drift**: `components/qualification-flow.tsx:139` OMITS the final "Products are not for human consumption." sentence present at `components/age-gate/AgeGateClient.tsx:236-238` + `lib/attestations.ts:26`. Captured separately via ruoAck checkbox at `qualification-flow.tsx:152`, but the verbatim string is split.
- **Iron Law 2.23 Cookie consent** PASS: `necessary` always true, GPC detected, banner bottom-anchored, 3 actions, cookie `vc-consent`. Marketing description at `components/CookieConsent.tsx:181` uses lowercase brand.
- **Iron Law 2.10 NamedAttestation honesty** PASS: discriminated union enforces placeholder mode.
- **MEDIUM** `--z-modal` referenced in `components/ui/Dialog.tsx:88` but undefined in `app/globals.css`. Inline `style={{ zIndex: 40 }}` fallback at `:93` rescues.

Brand-string occurrences within slice: 21 `vialchemlabs` lowercase across 11 files; 5 `VIALCHEMLABS` uppercase; 0 LOCKED form.

### 9.E — `lib/` core (24 modules, ~3700 lines)

(Full sub-agent E report consolidated; key findings:)

- **CRITICAL** Tesamorelin SKU at `lib/content/products.ts:285-296` + description at `lib/content/product-descriptions.ts:209-219` + image mapping at `lib/content/product-images.ts:23` + acknowledged in header comment at `products.ts:8-9` ("Higher-sensitivity additions such as PT-141 and Tesamorelin must remain..."). CHANGELOG v1.3.0:53-56 explicitly bans Tesamorelin. No `\btesamorelin\b` pattern in `lib/compliance.ts:21-83` unsafeMarketingPatterns.
- **42 SKUs enumerated** (37 product + 5 bundle): all listed in §4 LOCKED table. PT-141 and Melanotan-II are elevated-sensitivity melanocortin SKUs; AOD-9604 is a weight-loss-coded GH fragment; Follistatin-344 is bodybuilding-coded; Bundle names Glow/Wolverine/Neuro/Longevity tilt non-research register.
- **46 unsafe-marketing patterns** at `lib/compliance.ts:21-83`. Coverage: 7 outcome claims, 7 therapeutic verbs, 4 approved-drug names (Ozempic/Wegovy/Mounjaro/Zepbound), 6 catalog exclusions (GLP-1/semaglutide/tirzepatide/retatrutide/insulin/diabetes), 7 quality-claim phrases, 6 human-use intent, 4 dosing protocol, 5 personal pronoun. `assertMarketingCopySafe` throws via short-circuit `.find()` at `:101-106`. **Missing: `\btesamorelin\b`.**
- **`lib/compliance/jurisdictions.ts:15`** `BLOCKED_US_STATES = ['CA','TX','NY','FL']` LOCKED. Error strings at `:38,44` hardcode `vialchemlabs` (not env-bound).
- **`lib/customer-qualification.ts:42-48`** 7 verbatim attestations. 6 QualificationRoles at `:18-25`. researchPurpose validation calls `findMarketingCopyViolation` at `:59`.
- **`lib/content/site.ts` brand state** — 8 fields all drifted from LOCKED. v5 rebrand comment at `:3-7` documents the drift.
- **`lib/content/promo-codes.ts:21-31`** — WELCOME15 present, 15% off, all 4 gates set (firstOrder, newsletter, age, RUO). No expiration field; email template says "Valid for 30 days" but not enforced in code.
- **`lib/content/faq.ts:18-99`** — 20 entries; Q13 (line 68) references banned compounds only in exclusion context. PASS.
- **`lib/design/tokens.ts`** — Iron Law 2.21 additive only. textSubtle 0.42→0.55 documented at `:30-32`. All v4 additions marked.
- **`lib/auth-store.ts` (new v1.3.0)** — SHA-256 + 16-byte per-account salt via Web Crypto API; no cleartext; persist key `vialchemlabs:auth` at `:215`. Documented as pre-launch browser-only at `:5-13`; Phase 10 Supabase migration plan.
- **`lib/cart-store.ts`** — Zustand persist, partialized to `lines` only; persist key `vialchemlabs:cart` at `:82`; qty bounded [1,10].

Brand-string occurrences: 43 `vialchemlabs` lowercase; many `vialchemlabs.com`; 2 `Janoshik` references in operator-override comment; 0 LOCKED-form; 0 Mogtrix.

### 9.F — `lib/payments/` (9 files, 1222 lines)

(Full sub-agent F report consolidated; key findings:)

- **Iron Law 2.20 PASS**: `lib/payments/types.ts:16` `PaymentProviderId = 'stub' | 'btcpay' | 'plaid'` exact union.
- **PAYMENT_DISCOUNT_PCT canonical at `types.ts:71-75`**: crypto 15% / ach 5% / card 0%.
- **D9 Plaid JWKS ES256** PASS at `plaid-jwks.ts`: jose import (`:18`), body-hash check (`:119-122`), 5-min iat skew (`:98`), ES256 algorithm allowlist (`:146`). LOW: one-sided iat skew (future-dated tokens silently accepted); LOW: iss/aud not asserted (acknowledged in file comment).
- **D10 BTCPay Greenfield** PASS at `btcpay.ts`: real POST `:141` with bearer auth `:165`; metadata + checkout speed policy; HMAC verify `:89-111` with `crypto.timingSafeEqual`.
- **D15 Layer 3** PRESENT at `reconciliation.ts:149-172` (`JurisdictionalGuardError` + `assertOrderJurisdictionAllowed`). **HIGH gap**: helper exported but **not invoked inside `reconcile()` at `:82-133`**. Webhook routes must call it explicitly.
- **D8 Plaid createIntent** SCAFFOLD ONLY at `plaid.ts:138-150` — throws `plaid_create_intent_not_implemented`. **HIGH** for Day-1 if ACH rail advertised.
- **`getIntent` stub** for both BTCPay (`:206-211`) and Plaid (`:152-157`) — order status sync requires Phase-10 wiring.
- **Webhook signature reject** PASS: BTCPay `:225-228` returns `{ verified: false }`; Plaid `:171-174` same. Both use `timingSafeEqual`.
- **0 SCANNER_OK annotations** in any file body. Inline comments reference Iron Law 2.5 but no `SCANNER_OK` token.
- **0 real credentials** in source. All envs are placeholders.

### 9.G — `lib/seo/` + `lib/email/` (4 files, 472 lines)

(Inline by parent — not dispatched as sub-agent.)

- `lib/seo/jsonLd.ts` (185 lines) — exports `productJsonLd`, `breadcrumbJsonLd`, `articleJsonLd`, `faqPageJsonLd`, `organizationJsonLd`. `serializeJsonLdSafe` helper for `</script>` escape (Iron Law XSS hygiene). PASS structurally. Coverage gaps in actual use in app/ slice (no Organization on /, no BreadcrumbList on /blog or /coa indices — see §9.A).
- `lib/seo/sitemap.ts` (106 lines) — `buildSitemap` drives off `products`, `bundles`, `blogPosts`, `coaRecords`. Auto-refreshes per content changes.
- `lib/email/resend.ts` (104 lines) — Resend wrapper; gated by `REQUIRE_RESEND`. Synthetic stub ids when false.
- `lib/email/welcome-sequence.ts` (77 lines) — 4-email Appendix K dispatcher. dedup via `welcome_email_N_sent_at` columns (verified at `supabase/migrations:174-177`).

### 9.H — `scripts/` + `.husky/` (7 scripts, 1173 lines + 17-line pre-commit)

(Inline by parent.)

- `scripts/grep-mogtrix.sh` (82 lines) — exits 1 on disallowed Mogtrix references. **Currently failing** on `audit/` directory contents.
- `scripts/grep-forbidden-words.sh` (125 lines) — Iron Law 2.4 static scan. SKIP_PATHS at lines 60-72 include `lib/content/products.ts`, `lib/content/product-descriptions.ts`, `lib/compliance.ts` (the regex source), `lib/content/faq.ts` (exclusion-context Q13/Q14), tests/, docs/. PASS.
- `scripts/supply-chain-scan.sh` (165 lines) — 6-category gate including `.env*` content scan + leaked-package detection.
- `scripts/btcpay-setup.sh` (64 lines) — D11 closure docs.
- `scripts/canary.sh` (101 lines) — post-deploy 2-hour monitoring.
- `scripts/setup-branch-protection.sh` (104 lines) — generates `.github/CODEOWNERS` via heredoc + runs `gh api -X PUT`. **Has never been run** (CODEOWNERS missing on disk). **HIGH order-of-operations risk**: script sets up branch protection requiring 4 CI checks ("e2e / unit-and-preflight", "e2e / e2e", "lighthouse / lighthouse (desktop)", "lighthouse / lighthouse (mobile)") that don't exist as workflows → would lock `main` permanently.
- `scripts/generate-product-shots.mjs` (532 lines) — image generator. Used to create `public/product-shots/*.png` including `tesamorelin-5mg.png` (which exists, confirming the asset pipeline ran for banned compound).
- `.husky/pre-commit` (17 lines) — directly invokes the 3 grep scripts; does NOT chain to `npm run preflight` (so typecheck + lint are skipped at commit time). MEDIUM contract drift.

### 9.I — `supabase/migrations/` (1 file, 427 lines)

(Full sub-agent I report consolidated; key findings:)

- **15 CREATE TABLE statements** verified: customers, addresses, magic_links, sessions, customer_qualifications, attestations_audit, lab_partners, products_catalog, promo_codes, email_subscriptions, orders, order_items, order_status_history, payments, audit_log.
- **15/15 RLS ENABLED** + 17 CREATE POLICY statements. `audit_log` is service-role-only (RLS on + 0 policies = default-deny). PASS structurally.
- **Janoshik seed** at `:416` `values ('Janoshik Analytical', 'janoshik', true)` with `default_for_brand = true`. Operator-side metadata; CHANGELOG v1.3.0 lab-agnostic strip applied to *public copy*, not migration seed. PASS (operator may swap).
- **Brand-drift** at `:1` header comment `-- vialchemlabs — initial schema (Phase 10.1 v4).` LOW.
- **MEDIUM** No `updated_at` triggers — application code must set them manually. Fields default to `now()` on INSERT only.
- **MEDIUM** No dedicated consent table — `audit_log.event_type = 'consent.changed'` substrate used.
- **MEDIUM** 7 RLS policies depend on `auth.jwt() ->> 'email'` shape (lines 350, 355, 370, 376, 383, 391, 401) — silent denial if JWT shape changes.
- **LOW** No partial indexes for `magic_links.consumed_at IS NULL` / `sessions.revoked_at IS NULL`.
- **LOW** No retention/partition plan for `audit_log` bigserial.
- **No DELETE policies** — right-to-erasure via `customers.deleted_at` soft-delete + operator workflow.

### 9.J — `tests/unit/` (49 files, ~4570 lines, 548 passing)

(Full sub-agent J report consolidated; key findings:)

- **CRITICAL** No `tesamorelin` guard in `tests/unit/components/Vial.test.tsx`. tirzepatide guard at `:127-131`, semaglutide at `:133-137`, retatrutide at `:139-143`; case-variations at `:145-153`. Tesamorelin is BANNED per CHANGELOG v1.3.0 but is in the catalog, so Vial whitelist accepts it — test coverage gap reflects + reinforces the source-of-truth regression.
- **CRITICAL** Test-fixture brand drift: 14 hits of `vialchemlabs` and 2 hits of `vialchemlabs.com` across `tests/unit/seo/jsonLd.test.ts:18,98,106,133,138`, `tests/unit/seo/sitemap.test.ts:4`, `tests/unit/content/faq.test.ts:16,18`, `tests/unit/components/ComparativeTable.test.tsx:7,8,16,28,36`. Tests lock the drifted brand into the test contract. Audit prompt §2.4 anticipated this: "Some test fixtures have been edited toward vialchemlabs.com (no s, .com TLD) — surface this contradiction as a CRITICAL alignment issue."
- **HIGH** Vial whitelist coupling: catalog drift auto-allows banned compounds. Need parallel hardcoded `PERPETUAL_BLOCKLIST` independent of catalog.
- **HIGH** `lib/content/site.ts:3-7` "v5 rebrand (clinical-minimal light theme)" contradicts `lib/design/tokens.ts:15` `bg: '#0a0e0f'` (dark) and `tests/e2e/visual-regression.spec.ts:11` "vialchemlabs is Posture A LOCKED dark." Either rebrand comment is stale or design system never followed.
- **MEDIUM** No `tesamorelin` case in `tests/unit/compliance.test.ts:9-48` 38-pattern array.
- **MEDIUM** 18 components + 9 lib modules with no dedicated test (list in sub-agent J §coverage gaps).
- **PASS** Iron Law 2.21 regression sub-block at `tests/unit/design/tokens.test.ts:28-114`.
- **PASS** Iron Law 2.24 — 0 `.skip(true)` / `.only(` hits.
- **PASS** Iron Law 2.7 catalog-safety test iterates 42 products × 2 fields + 5 bundles = 89 assertions.

### 9.K — `tests/e2e/` + visual-regression snapshots

(Inline by parent.)

- `tests/e2e/a11y.spec.ts` (95 lines) — 18 routes covered.
- `tests/e2e/checkout-ach.spec.ts` (42 lines).
- `tests/e2e/checkout-crypto.spec.ts` (30 lines).
- `tests/e2e/visual-regression.spec.ts` (143 lines).
- Snapshots: 114 PNGs (38 routes × 3 viewports) chromium-Linux only. **NEW SKUs (Tesamorelin etc.) added since baseline was committed are NOT in the snapshot set** — visual regression at HEAD `ff97cde` would have to be regenerated. Iron Law 2.25 says diffs require operator approval; CODEOWNERS doesn't exist to enforce this.

### 9.L — `public/`

(Inline by parent.)

- **Bundle vial shots** (5): glow/longevity/neuro/recovery/wolverine `-single-vial.png` — present for all 5 bundles.
- **Product shots** (37): one PNG per catalog SKU. Includes `tesamorelin-5mg.png` (**banned compound image asset on disk**).
- **COA PDFs** (7 placeholders): bpc-157, cjc-1295-no-dac, ghk-cu, ipamorelin-10mg, mots-c, selank, tb-500-5mg. **30 missing** for the 30 SKUs added after v1.0.0. → Every `/coa/{slug}/BATCH-2026-PLACEHOLDER` page for the 30 new SKUs would 404 on PDF link. **CRITICAL** for D22.
- `public/robots.txt` (14 lines) — User-agent, Allow, Disallow /cart, Disallow /checkout/, Sitemap reference. PASS structure; sitemap reference points to `https://vialchemlabs.com/sitemap.xml` (drift).
- 4 SVG defaults (file/globe/next/vercel.svg) — leftover Next.js scaffolding; harmless but cruft.
- **Total `public/` size: 23 MB.**

### 9.M — `docs/`

(Full sub-agent M report consolidated; key findings:)

- **30 checkpoint MDs** (12 v3 + 18 v4 incl. 4 Phase-0 sub-artefacts + v4_design_overhaul). v3 phases 6/7/8/9 have NO checkpoint files (gap).
- **3 deploy docs** + **6 research sub_*** + **33 product-research** + **superpowers architecture** + 3 root-level docs + 1 binary webp.
- **80 MD files total**.
- **Brand drift in docs**: 265 hits of `vialchemlabs`; 109 of `vialchemlabs.com`; 0 of LOCKED `vialchems.labs`. Operator-runbook + dns.md + checkpoint v4_phase_13 all use the drifted form.
- **HIGH** `docs/operator-runbook.md:102,106,137,206` outreach templates still name Janoshik — contradicts public site's lab-agnostic posture (CHANGELOG v1.3.0).
- **HIGH** Fallback-domain lists in 4 docs (operator-runbook, dns.md, checkpoints v4_phase_12 + phase_14, architecture) contain self-referential loops and duplicates.
- **HIGH** `docs/operator-runbook.md:38` USPTO TESS instruction has duplicated brand string `"vialchemlabs" and "vialchemlabs"` (likely template-fill glitch).
- **HIGH** `docs/operator-runbook.md:18-25` v4 status block stale: says `v1.1.0 (push deferred)` but repo is at v1.3.0.
- **MEDIUM** `docs/v4-design-overhaul-plan.md` does not mark which tiers shipped vs deferred.
- **LOW** `docs/product-research/wave-2/tesamorelin-5mg.md` (87 lines) describes the banned Tesamorelin SKU without a top-of-file LOCKED EXCLUSION banner.
- **INFO** 65 Mogtrix references in docs/, all legitimate per `grep-mogtrix.sh` `docs/` exclusion. All historical context, attribution, or anti-pattern declarations.

### 9.N — Root configs + `.github/`

(Full sub-agent N report consolidated; key findings:)

- **`.github/` directory DOES NOT EXIST** on disk.
- **`.github/workflows/lighthouse.yml` MISSING** → D17 misclaimed.
- **`.github/workflows/e2e.yml` MISSING** → D17/D16-CI misclaimed.
- **`.github/CODEOWNERS` MISSING** → Iron Law 2.25 unenforced, D25 misclaimed. Template lives only in `scripts/setup-branch-protection.sh:75-97` heredoc.
- **`@lhci/cli` MISSING** from package.json — 0 grep hits in package.json or package-lock.json.
- **HIGH** `package.json` has no `prepare: "husky install"` → fresh `npm ci` doesn't install pre-commit hook.
- **HIGH** `.husky/pre-commit:8-15` directly invokes 3 grep scripts; does NOT call `npm run preflight` (typecheck + lint skipped at commit).
- **HIGH** `README.md:36` operator step says "Register `vialchemlabs` domain (`.labs` TLD via Donuts/Identity Digital)" — internally contradicts `.env.example:9` `SITE_URL=https://vialchemlabs.com`.
- **vercel.json security headers** PASS for HSTS preload, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy. **MEDIUM**: no Content-Security-Policy anywhere.
- **next.config.ts:14-16** empty `nextConfig` — no `headers()` / no `redirects()`. Security headers + redirects fire only on Vercel.
- **lighthouserc.cjs:25-36** URL list omits checkout funnel + auth surfaces. Mobile pass not configured despite CHANGELOG claim.
- **README.md:28** `npm test # 304 unit tests` — stale (actual is 548).
- **package.json** no `engines` field; no `.nvmrc` / `.node-version`.

---

## 10. Cross-Cutting Concerns

1. **API ↔ schema** — verified: `app/api/access/route.ts` writes to `customer_qualifications` + `attestations_audit`; both tables exist with all referenced columns at `supabase/migrations/20260510000001_init.sql:86,104`. `app/api/newsletter/subscribe/route.ts` writes to `email_subscriptions` (`:166`). Webhook routes write to `payments` (`:263`) + `audit_log` (`:284`). All columns match. PASS.
2. **Component ↔ token** — verified: `--bg`, `--surface`, `--accent`, `--text-*`, `--border-*`, `--radius-*`, `--shadow-*`, `--dur-*`, `--font-*` all defined in `app/globals.css`. **`--z-modal`** referenced at `components/ui/Dialog.tsx:88` but **NOT defined** in `globals.css` (only Tailwind class fallback; inline `style={{ zIndex: 40 }}` rescues at `:93`). MEDIUM gap.
3. **Test ↔ source** — verified: every `tests/unit/**/*.test.ts(x)` imports an existing target module. 18 components + 9 lib modules have NO test (see sub-agent J coverage gaps).
4. **JSON-LD ↔ schema.org** — `serializeJsonLdSafe` at `lib/seo/jsonLd.ts` handles `</script>` escape. Schema.org shape verification deferred to §11.5 (live audit). Static spot-check: `productJsonLd`, `breadcrumbJsonLd`, `articleJsonLd`, `faqPageJsonLd`, `organizationJsonLd` all have required fields per schema.org publishes shapes. **HIGH** missing coverage: `/` (no Organization injection), `/blog` index (no BreadcrumbList), `/coa` index (no BreadcrumbList).
5. **Sitemap ↔ content** — `lib/seo/sitemap.ts` `buildSitemap` driving sources `products`, `bundles`, `blogPosts`, `coaRecords` all present at `lib/content/`. PASS.
6. **Verbatim copy ↔ Appendix** — 4/5 verbatim phrases located; "research use only (RUO)" exact phrase absent (RUO appears as Pill text + headings); PDP RUO disclaimer paraphrased at `app/products/[slug]/page.tsx:361-368`. See §5.1.
7. **Env contract ↔ runtime** — every `process.env.X` reference in source has an entry in `.env.example`. Spot-check: `BRAND_DOMAIN`, `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `REQUIRE_SUPABASE`, `REQUIRE_RESEND`, `PAYMENT_PROVIDER`, `BTCPAY_*`, `PLAID_*`, `SENTRY_DSN`, `LAB_PARTNER_*`, `LLC_*` all present (sub-agent N + N1). PASS.
8. **Iron Law 2.7 Vial whitelist** — `components/ui/Vial.tsx:87-90` derived from `products.ts` shortName + bundles.name (NOT hardcoded). PASS structurally — but couples whitelist to catalog, so banned compound in catalog = banned compound auto-allowed by whitelist. Needs an independent `PERPETUAL_BLOCKLIST`.

---

## 11. Runtime Smoke Tests

**Dev server NOT running** (`curl http://127.0.0.1:3200/` → connection refused). Per audit prompt: "If the dev server is not running, skip this section and record 'dev server not available; runtime smoke deferred' as an INFO finding. Do NOT start the dev server yourself." → Deferred. INFO.

To complete the smoke pass post-audit, the operator should:
```
npm run dev -- -p 3200 &
# wait for "ready"
# then run the §5 commands from the audit super-prompt
```

---

## 11.5 Live Site Audit (§5.5 — 23 pillars)

### 11.5.0 Pre-flight

- Dev server: **NOT running** → §5.5 deferred per audit prompt instruction not to self-start.
- Chromium Playwright: **PRESENT** (`~/.cache/ms-playwright/chromium-1208/`).
- Lighthouse CLI: **AVAILABLE** (`npx --yes lighthouse --version` → 12.8.2).
- Unit baseline: GREEN (548/548).

All Pillars 11.5.1 through 11.5.23: **DEFERRED — dev server prerequisite missing.** Each Pillar would have completed within the 30-90 min envelope per audit prompt §4 Step 12 if the dev server were running.

To complete §11.5, the operator should start the dev server then run the 23-pillar pipeline. The temp-script targets `/tmp/audit-*.{mjs,sh,json}` are unchanged.

### 11.5.23 Cleanup confirmation

No `/tmp/audit-*` files were created during this audit because §5.5 was deferred. Verified clean: `ls /tmp/audit-* 2>/dev/null` returns nothing. No out-of-tmp artifacts created (only `/root/peptide-site/docs/audit/2026-05-19_full_audit_report.md`, which is this report — the single allowed output per audit prompt §1.3).

---

## 12. Discrepancy Register

Sorted by severity DESC, then by file path ASC.

### CRITICAL (11)

| # | File:Line | Quoted text | Contract clause | Description |
|---|---|---|---|---|
| C1 | `lib/content/products.ts:285-296` | `slug: 'tesamorelin-5mg', sku: 'TESAMORELIN-5MG', name: 'Tesamorelin, 5mg vial'` | Iron Law 2.7 / CHANGELOG v1.3.0:53-56 | Tesamorelin live as SKU. Remove the SKU entry; cascade-delete description, image, etc. |
| C2 | `lib/content/product-descriptions.ts:209-219` | `'TESAMORELIN-5MG': \`Tesamorelin is a synthetic analog of growth-hormone-releasing hormone...\`` | Iron Law 2.7 | Delete the description map entry. |
| C3 | `public/product-shots/tesamorelin-5mg.png` | (binary asset) | Iron Law 2.7 | Delete the image asset. |
| C4 | `app/products/[slug]/page.tsx:361-368` | "supplies research compounds exclusively for laboratory and scientific use… not for human dosing, injection, ingestion, or veterinary use." | Iron Law 2.13 / Appendix A.2 verbatim | Replace with verbatim "For research use only. Not for human or veterinary use." |
| C5 | `app/products/[slug]/page.tsx:462` | `{ term: 'Reconstitution', value: 'Sterile BAC water' }` | Iron Law 2.7 / 2.14 (no BAC water bundled or implied) | Replace value with `'Sterile diluent (sourced separately)'` or remove the spec row. |
| C6 | `.github/workflows/lighthouse.yml` | (MISSING — entire `.github/` directory absent) | Iron Law 2.27 / D17 | Create the workflow file; install `@lhci/cli`. |
| C7 | `.github/workflows/e2e.yml` | (MISSING) | Iron Law 2.24 / D17 | Create the workflow with `npm test`, `npm run preflight`, `npx playwright test`. |
| C8 | `.github/CODEOWNERS` | (MISSING; lives only as heredoc in `scripts/setup-branch-protection.sh:75-97`) | Iron Law 2.25 / D25 | Materialize the CODEOWNERS file on disk + add `lib/compliance/jurisdictions.ts` to the protected paths list. |
| C9 | `package.json` (entire) | `@lhci/cli` absent | Iron Law 2.27 / D17 | `npm i -D @lhci/cli@latest`. |
| C10 | `lib/content/site.ts:9,14,20` | `brandDomain = 'vialchemlabs.com'`, `name: 'vialchemlabs'`, `tagline: 'Research-grade peptides, shipped with the COA.'` | Iron Law 2.26 / audit prompt §2.3 LOCKED | Resolve operator decision: keep current `vialchemlabs.com` (then update audit-prompt LOCKED clause and pop the §2.4 watchlist) OR revert to `Vialchems Labs` / `vialchems.labs` (then sweep 142 domain hits + 424 brand-name hits). One or the other; not both. |
| C11 | `public/coa/*` | only 7 placeholder PDFs for 37 SKUs | D22 / Iron Law 2.10 honesty | Generate 30 additional placeholder PDFs flagged "EXAMPLE COA — REPLACE BEFORE LAUNCH" OR remove the 30 SKUs without COA records. |

### HIGH (27)

| # | File:Line | Description |
|---|---|---|
| H1 | git log v1.0.0..HEAD (4 commits, 2 empty bodies) | Iron Law 2.15 violation. Two v4 mega-commits (`9c928a0`, `ff97cde`) lack RED/GREEN markers and SCANNER_OK annotations despite touching protected paths (lib/content/products.ts +664 lines, lib/payments/ +309). |
| H2 | preflight | Exits 1 on `grep-mogtrix.sh` due to untracked `audit/` directory at repo root. Fix: `.gitignore audit/` OR delete the dir OR add to script exclude list. |
| H3 | `app/page.tsx` (entire) | No `Organization` JSON-LD script tag emitted on home. |
| H4 | `app/page.tsx:131` | "Pharmaceutical-grade lyophilization…" matches `/pharmaceutical\s*grade/` forbidden pattern; only avoids preflight via SKIP_PATHS. |
| H5 | `app/layout.tsx:31` vs `app/page.tsx:182-186` | Tagline mismatch metadata-vs-visible-hero. |
| H6 | `app/blog/page.tsx` | Missing BreadcrumbList JSON-LD on index. |
| H7 | `app/coa/page.tsx` | Missing BreadcrumbList JSON-LD on index. |
| H8 | `app/products/[slug]/ProductTabs.tsx` (entire) | Orphan unused file referencing stripped `siteConfig.labPartner.name`. Delete or mark deprecated. |
| H9 | `lib/payments/plaid.ts:138-150` | `createIntent` throws `plaid_create_intent_not_implemented`. ACH rail non-functional Day-1. |
| H10 | `lib/payments/reconciliation.ts:82-133` + `:160-172` | `assertOrderJurisdictionAllowed` exported but **not invoked inside `reconcile()`**. Defense-in-depth Iron Law 2.8 Layer 3 depends on webhook callers remembering. Recommend `reconcileWithJurisdictionGuard` or in-line call. |
| H11 | `lib/compliance.ts:46-52` | `unsafeMarketingPatterns` missing `\btesamorelin\b` despite CHANGELOG-explicit BANNED status. |
| H12 | `lib/content/site.ts:38` (lab partner default) | Drift from LOCKED 'Janoshik Analytical' to 'an independent third-party laboratory'. Operator override per Iron Law 2.26 documented at lines 30-36 — but tension with audit prompt §2.3 LOCKED row unresolved. |
| H13 | `lib/compliance/jurisdictions.ts:38,44` | User-facing reason strings hardcode `vialchemlabs` (not env-bound). Will surface drifted brand to checkout-blocked buyers. |
| H14 | `lib/cart-store.ts:82` | localStorage persist key `vialchemlabs:cart` baked in; rebrand would orphan carts. |
| H15 | `lib/auth-store.ts:215` | localStorage persist key `vialchemlabs:auth` baked in. |
| H16 | `lib/content/faq.ts` (13 substantive answer fields) | Brand stem hardcoded in FAQ answers; URL placeholders use `https://vialchemlabs.com/`. |
| H17 | `lib/content/blog.ts` (4 posts × multiple references) | author fields all `'vialchemlabs Research'`; inline body brand references at lines 111, 199, 303, 402, 494. |
| H18 | `lib/content/product-images.ts:49` | Alt-text template `\`vialchemlabs ${label} research vial\`` × 37 SKUs. |
| H19 | `lib/content/bundle-images.ts:17` | Alt-text template × 5 bundles. |
| H20 | `tests/unit/components/Vial.test.tsx:127-152` | Missing tesamorelin guard. |
| H21 | `tests/unit/seo/jsonLd.test.ts:18`, etc. (14+ test-fixture hits) | Brand drift locked into test contract per audit prompt §2.4 CRITICAL alignment issue. Surfacing here as HIGH (escalates to CRITICAL only if combined with two-domain rule, which doesn't fire). |
| H22 | `docs/operator-runbook.md:102,106,137,206` | Outreach templates still name Janoshik; contradicts v1.3.0 lab-agnostic public copy. |
| H23 | `docs/operator-runbook.md:18-25` | Stale v4 status block; says v1.1.0 (push deferred) but repo is v1.3.0. |
| H24 | `docs/deploy/dns.md:122-127`, others | Fallback-domain lists with self-references and duplicates. |
| H25 | `package.json` (entire) | Missing `prepare: "husky install"` script. Fresh `npm ci` does NOT install pre-commit hook. |
| H26 | `.husky/pre-commit:8-15` | Invokes 3 grep scripts directly, does NOT call `npm run preflight` (typecheck + lint skipped at commit). |
| H27 | `README.md:36` | Hybrid instruction: register `vialchemlabs` slug at `.labs` TLD — internally contradicts `.env.example:9` which resolves to `vialchemlabs.com`. |

### MEDIUM (23)

| # | File:Line | Description |
|---|---|---|
| M1 | `components/qualification-flow.tsx:139` | Drops final "Products are not for human consumption." sentence vs `AgeGateClient.tsx:236` + `lib/attestations.ts:26`. Split into separate ruoAck checkbox. |
| M2 | `components/ui/Dialog.tsx:88` | `--z-modal` undefined in `globals.css`; `lib/design/tokens.ts:158` has TS map but no CSS bridge. |
| M3 | `components/ui/VialProductPhoto.tsx:25-32` | `assertCompoundAllowed` throw message missing "Iron Law 2.7" token (Vial.tsx has it). |
| M4 | `app/account/{page,addresses,settings}.tsx` | Multiple form stubs with no `onSubmit` / no Toast / refresh-page-default. Easily mistakable for working surfaces. |
| M5 | `app/affiliate/page.tsx:27-34` | Fake submit (`setTimeout(250)` + form reset). |
| M6 | `app/products/[slug]/page.tsx:201-246` | Non-functional decorative thumbnail buttons. |
| M7 | `app/products/[slug]/page.tsx:537-737` | `BundleDetail` duplicates breadcrumb/hero/RUO/COA patterns from product branch with subtly different copy. Extract shared components. |
| M8 | `app/products/[slug]/page.tsx:563` | Bundle Product JSON-LD passes `category: 'Recovery bundle'` for every bundle; should derive from `bundle.category`. |
| M9 | `app/order/[id]/OrderDetailIsland.tsx:53-67` + `account/orders/*` | Reads sessionStorage `'vialchemlabs:checkout:order'` — per-tab/session only. Ship Supabase wiring before public launch. |
| M10 | `lib/compliance.ts:21-83` | Missing `\btesamorelin\b` regex; SKIP_PATHS bypass on `lib/content/product-descriptions.ts:209-219` would not save us if copy escapes. |
| M11 | `lib/content/product-descriptions.ts:531` | Stray `Vialchems` (capitalized, no Labs) variant in BUNDLE-RECOVERY-STACK body. |
| M12 | `lib/auth-store.ts:105-111` | SHA-256 alone (no PBKDF2/Argon2/bcrypt iteration count). Acknowledged Phase-10 migration plan; should land before public launch. |
| M13 | `lib/content/email-templates.ts` | Email-template footer inherits drifted brand strings via siteConfig. |
| M14 | `supabase/migrations/20260510000001_init.sql` (lines 35, 54, 146, 275) | No `updated_at` triggers. Stale `updated_at` after manual UPDATE without explicit `set updated_at = now()`. |
| M15 | `supabase/migrations/20260510000001_init.sql` | No dedicated `consent_log` / `cookie_consent` table; consent state lives in `audit_log` events only. |
| M16 | `supabase/migrations/20260510000001_init.sql` (7 policies) | RLS depends on `auth.jwt() ->> 'email'` shape; silent denial if JWT shape changes. |
| M17 | `vercel.json` (entire) | No `Content-Security-Policy` header. |
| M18 | `next.config.ts:14-16` | Empty `nextConfig`; no `headers()` / `redirects()` mirror. |
| M19 | `lighthouserc.cjs:25-36` | URL list omits checkout funnel + auth surfaces. |
| M20 | `lighthouserc.cjs:37-41` | Mobile pass not configured despite CHANGELOG v1.1.0:254 claim. |
| M21 | `README.md:28` | Stale `# 304 unit tests` (actual 548). |
| M22 | `package.json` | No `engines` field; no `.nvmrc`. Node version pin missing. |
| M23 | `docs/checkpoints/` | v3 phases 6/7/8/9 missing checkpoint files. |

### LOW (25)

| # | File:Line | Description |
|---|---|---|
| L1 | `lib/payments/plaid-jwks.ts:124-130` | iat skew one-sided; future-dated tokens pass. |
| L2 | `lib/payments/plaid-jwks.ts:145-150` | iss/aud not asserted (acknowledged Plaid limitation). |
| L3 | `lib/payments/btcpay.ts:206-211` | `getIntent` no-op stub. |
| L4 | `lib/payments/plaid.ts:152-157` | `getIntent` no-op stub. |
| L5 | `lib/payments/btcpay.ts:218-219` | Webhook accepts `payload: unknown` and re-stringifies; HMAC over re-serialized form. Caller must pass raw body. |
| L6 | `lib/payments/btcpay.ts:222-223` | Three header case-variants on lookup; `headersToRecord` already lower-cases. Cosmetic. |
| L7 | `lib/payments/stub.ts:91-97` | Auto-confirm setTimeout without retained handle. Process-keeps-alive risk in non-test env. |
| L8 | `app/error.tsx:16-19` | Reads DSN, no `Sentry.captureException(error)`. |
| L9 | `app/checkout/review/ReviewPanel.tsx:486-489` | `generateOrderId` fallback to `Math.random` if `crypto.randomUUID` unavailable. |
| L10 | `app/account/page.tsx:81+115` | Two conditional `<h1>` tags (mutually exclusive branches; functionally OK). |
| L11 | `app/products/[slug]/page.tsx:256+614` | Two `<h1>` (product vs bundle branch; OK). |
| L12 | `app/cart/page.tsx:37` | shippingCents flat-fee in subtotal then free-shipping flag at total — minor UX inconsistency; total is correct. |
| L13 | `app/checkout/confirm/ConfirmPanel.tsx:68-71` | `expectedShip = placedAt + 1 day` ignores 3pm cutoff/weekends. |
| L14 | `components/SiteFooter.tsx:102-104` | Renders `vialchemlabs is a chemical supplier...` (lowercase start). Locked Appendix A.1 expects capitalized "Vialchems Labs". |
| L15 | `components/ui/VialProductPhoto.tsx:163` | Softer "For laboratory research only" disclaimer vs Vial.tsx verbatim two-line block. |
| L16 | `components/age-gate/AgeGateClient.tsx:29-34` | REQUIREMENTS list uses `'For research purposes only'` / `'Not for human consumption'` — third stylistic variant. |
| L17 | `components/age-gate/AgeGateClient.tsx:19` | HEADLINE = `'RESEARCH-GRADE PEPTIDES'` (uppercase hybrid; neither LOCKED tagline nor site.ts tagline). |
| L18 | `components/ui/ComparativeTable.tsx:16,26,27,38,70,92` | Prop name `vialchemlabs` locked into type system. |
| L19 | `lib/content/product-descriptions.ts:85,171,181,305,363,385,445` | "pharmaceutical-grade research reference" — SKIP_PATHS carve-out intentional but should be tracked. |
| L20 | `lib/content/product-descriptions.ts:81` | "insulin-like growth factor" would trigger regex if processed by `assertMarketingCopySafe`. |
| L21 | `lib/content/coa.ts:36` | `lab: 'Independent Lab'` hardcoded (not from siteConfig). |
| L22 | `vercel.json:35-37` | `X-Robots-Tag: index, follow` Day-1 — pre-launch beta URLs would be crawler-indexed. |
| L23 | `tests/e2e/visual-regression.spec.ts*` | Chromium-only baseline; Safari/Firefox not covered. |
| L24 | `supabase/migrations/20260510000001_init.sql:1` | Header comment `vialchemlabs` lowercase. |
| L25 | `docs/affiliate-creator-seeding-agreement.md` | No date metadata on legal-template draft. |

### INFO (22)

| # | File:Line | Description |
|---|---|---|
| I1 | git state | Branch `v4-design-overhaul-github`, HEAD ff97cde, version 1.3.0. |
| I2 | git log | v1.0.0 era had clean RED/GREEN per-phase commits; v4 era squashed into 2 mega-commits. |
| I3 | `lib/content/products.ts:13` | SCANNER_OK header annotation present (file-level, not commit). |
| I4 | `lib/content/product-descriptions.ts:8` | SCANNER_OK header present. |
| I5 | `app/checkout/review/ReviewPanel.tsx:15,79` | SCANNER_OK inline. |
| I6 | `lib/content/promo-codes.ts:21-31` | WELCOME15 present with all 4 gates; no DB-side expiration enforcement. |
| I7 | `lib/sentry.ts` (62 lines) | No-op when DSN absent. |
| I8 | `.env` exists | gitignored via `.env*` (`.gitignore:34`); `.env.local` does not exist. Iron Law 2.22 intent satisfied. |
| I9 | `.gitignore` | Excludes correctly. |
| I10 | `tests/e2e/*.spec.ts` | 0 `.skip(true)` / `.only(`. PASS Iron Law 2.24. |
| I11 | `tests/e2e/visual-regression.spec.ts-snapshots/` | 114 PNGs (38 × 3) committed. PASS D25. |
| I12 | `tests/unit/design/tokens.test.ts:28-114` | Iron Law 2.21 regression sub-block verified. |
| I13 | `lib/design/tokens.ts:30-32` | textSubtle 0.42 → 0.55 documented. |
| I14 | `lib/consent-store.ts:25,63,86-88` | Iron Law 2.23 contract verified. |
| I15 | Catalog | 42 SKUs (37 product + 5 bundle). Original 7 + 9 v1.3.0 additions + 26 more SKUs added since v1.3.0 — 26 SKUs are uncommitted in CHANGELOG. |
| I16 | `lib/content/faq.ts:68` (Q13) | Exclusion-rationale reference to tirzepatide/semaglutide/retatrutide is legitimate per Iron Law 2.7 spirit. |
| I17 | `lib/payments/types.ts:18` | `card` is in PaymentMethod union (Phase 2 scaffold); must not be offered Day-1 by checkout UI. |
| I18 | Dev server, Chromium, lighthouse | Status: server NOT running; Chromium IS installed; lighthouse IS available. §5.5 deferred. |
| I19 | `docs/research/` (65 Mogtrix references) | All legitimate per `grep-mogtrix.sh` `docs/` exclusion. Historical context. |
| I20 | `docs/product-research/wave-2/tesamorelin-5mg.md` | Research-draft doc; should carry LOCKED EXCLUSION banner. |
| I21 | `docs/affiliate-creator-seeding-agreement.md` (87 lines) | Compliance-clean (no Iron Law 2.4 violations). |
| I22 | preflight scanners | When `audit/` is removed: grep-forbidden-words 0 hits, supply-chain-scan 0 hits — verified per `v4_phase_13_handoff.md:127`. |

---

## 13. Operator-Gated Items

| Code | Status | Evidence |
|---|---|---|
| D18 — Vercel production deploy | ○ Not started | `docs/deploy/runbook.md` ready. Operator runs `vercel login → link → env add → --prod`. |
| D19 — Domain registration + DNS | ○ Not started | `docs/deploy/dns.md` ready (with 4 inconsistent fallback lists — must resolve first). |
| D20 — LLC formation | ○ Not started | `LLC_NAME` env-driven default `'vialchemlabs LLC'`. |
| D21 — Lab partner contract | ○ Not started | Site code is lab-agnostic per Iron Law 2.26 override; outreach templates still name Janoshik (drift). |
| D22 — First-batch real COA PDFs | ○ Severely short | Only 7 placeholder PDFs for 37 SKUs. Operator must generate 30+ before any PDP COA tab fetches a real PDF. |
| D23 — First-buyer test dollar | ○ Not started | `docs/deploy/first-payment-verification.md` ready with 4 tests. |

Also operator-side (uncategorized in D-ledger but surfaced by this audit):
- **AUDIT-OP-1** — Brand-resolution decision: choose `vialchems.labs` (rebrand effort: 142+424 hit sweep) OR `vialchemlabs.com` (update audit-prompt LOCKED clause + close §2.4 watchlist). One-or-other; not both.
- **AUDIT-OP-2** — Tesamorelin go/no-go: drop SKU OR override Iron Law 2.7 with a new LOCKED_OVERRIDE protocol per v3 super-prompt §6.3.
- **AUDIT-OP-3** — Run `scripts/setup-branch-protection.sh` ONLY after `.github/workflows/{lighthouse,e2e}.yml` exist; otherwise main will lock.

---

## 14. Recommended Next Actions

(Description-only. The audit does not implement these.)

1. **Resolve Iron Law 2.7 Tesamorelin regression** (C1-C3) — operator decides: drop SKU OR file LOCKED_OVERRIDE per v3 §6.3. If dropped: delete from `products.ts`, `product-descriptions.ts`, `product-images.ts`, `public/product-shots/`, refresh visual baseline.
2. **Resolve brand-resolution drift** (C10) — operator decides which domain/name is canonical, then sweep the loser. 566+ string hits to update.
3. **Materialize CI workflows + CODEOWNERS** (C6-C8) — create `.github/workflows/{lighthouse,e2e}.yml`; install `@lhci/cli`; create `.github/CODEOWNERS` (use the heredoc body from `scripts/setup-branch-protection.sh:75-97` + add `lib/compliance/jurisdictions.ts`); run `setup-branch-protection.sh` AFTER workflows exist (not before, or main locks).
4. **Fix PDP verbatim disclaimer + BAC water spec** (C4, C5) — restore Appendix A.2 verbatim string at `app/products/[slug]/page.tsx:361-368`; replace BAC water spec value at `:462`.
5. **Generate 30 missing placeholder COA PDFs** (C11) — match the existing `*-BATCH-2026-PLACEHOLDER.pdf` template with "EXAMPLE COA — REPLACE BEFORE LAUNCH" notice.
6. **Wire `assertOrderJurisdictionAllowed` into `reconcile()`** (H10) — close the Layer 3 defense-in-depth gap.
7. **Add `prepare: "husky install"`** and make `.husky/pre-commit` call `npm run preflight`** (H25, H26).
8. **Fix preflight by gitignoring or removing the `audit/` directory** (H2) — preflight gate is unusable until then.
9. **Add `\btesamorelin\b` to `lib/compliance.ts`** + add Vial.test.tsx guard (M10, H20) — even if SKU is dropped, regex + test should catch future drift.
10. **Inject Organization JSON-LD on `/`** + BreadcrumbList on `/blog` and `/coa` indices (H3, H6, H7).
11. **Delete `app/products/[slug]/ProductTabs.tsx`** orphan (H8).
12. **Update `README.md:28` test count** + reconcile `README.md:36` registration step with `.env.example` domain (M21, H27).
13. **Add Content-Security-Policy header** in `vercel.json` (M17).
14. **Add `engines.node` and `.nvmrc`** (M22) for build reproducibility.
15. **Sync `docs/operator-runbook.md` outreach templates** to lab-agnostic posture (H22) OR re-enable Janoshik in `site.ts` env.

---

## 15. Audit Methodology Confessions

Gaps the audit could not verify or chose to defer:

- **§5.5 live browser audit (23 pillars) deferred entirely** — dev server was not running and audit prompt §5.5.0 forbids self-starting it. Chromium + lighthouse are both present, so the pipeline is runnable the moment `npm run dev -- -p 3200 &` lands. Estimated remaining time: 30-90 min.
- **Binary files not opened** — `docs/design-references/vial-reference-2026-05-09.webp`, all 5 bundle-shot PNGs, all 37 product-shot PNGs, 7 COA placeholder PDFs. Visual brand-wordmark verification on rendered OG images requires §5.5 Pillar 20 to run.
- **SUPER_PROMPT v3 (2137 lines) and v4 (2932 lines) not byte-diffed** against codebase — section-by-section sampled for LOCKED state and Iron Laws 2.1-2.27 coverage.
- **CODEBASE_UNDERSTANDING.md, RESEARCH_PLAN.md, DESIGN.md** — line counts only, not full content cross-reference.
- **Sub-agent C+D, E, M, J reports** were comprehensive but each used 100-200K tokens; consolidating their full verbatim output here would exceed the report's reasonable size. Per-finding citations are preserved in §9.
- **Slice K (tests/e2e) only inventoried**, not full source-read of all 4 spec files. Visual-regression baseline was directory-listed only.
- **`app/api/payments/btcpay/webhook/route.ts` and `plaid/webhook/route.ts` route handlers** — only first 50 lines of BTCPay route inspected. Whether the route handler calls `assertOrderJurisdictionAllowed` before `reconcile()` (closing H10 in-route rather than depending on the helper being un-invoked in reconciliation.ts) was NOT verified — recommend operator inline-check.
- **JSON-LD shape validation deferred to §11.5 Pillar 19** — static `lib/seo/jsonLd.ts` reads suggest required fields are populated, but live-rendered HTML schema.org validation was not performed.
- **Sentry instrumentation files** (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`) — existence assumed via `next.config.ts:31` `withSentryConfig` wrapper; not directly opened.
- **DESIGN.md** — not byte-diffed against `lib/design/tokens.ts` + `app/globals.css` to confirm Posture A canon faithfulness.
- **`docs/product-research/` wave files (33 files, 2932 lines total)** — headers + first 50 lines only.

**Temp-file inventory** — this audit created ZERO `/tmp/audit-*` files (per §5.5.0.1 only allowed when §5.5 runs; §5.5 was deferred). Verified clean.

**Single output artefact** — only `/root/peptide-site/docs/audit/2026-05-19_full_audit_report.md` was created. No source-code mutations. No commits. No git mutations. Audit prompt §1 NON-NEGOTIABLES respected throughout.

---

End of report.
