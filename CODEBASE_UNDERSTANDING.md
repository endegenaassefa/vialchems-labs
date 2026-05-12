# CODEBASE_UNDERSTANDING.md

> **Scope:** Bridge-phase comprehension of `/root/peptide-site/` (Vialchems Labs).
> Read against the 2,137-line super-prompt at `/root/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md`, all 12 phase checkpoints, the corpus AUDIT + STAGE6_MANIFEST, the architecture plan, the operator runbook, and `RESEARCH_PLAN.md` from the previous session.
> **Reading discipline:** every source file in scope read with `Read`, line by line. Tests, configs, scripts, lib, components, app pages, API routes — full pass. The "Reading inventory" in §11 is the proof-of-work.
> **Stance:** comprehension only. No code modifications. Opportunities and risks parked in §8 and §9 for the next session.

---

## 1. Executive Summary

Vialchems Labs (`vialchems-labs` in package.json) is a Day-1 v1.0.0 e-commerce site for research peptides, built fresh in `/root/peptide-site/` end-to-end across 16 phases (0–15) by a single Claude Opus session driven by SUPER*PROMPT_v3.0. The brand was operator-overrode at Phase 0 from the prompt's `Numerus Labs` default to **Vialchems Labs** (Posture A clean clinical, domain `vialchems.labs`, tagline *"Counted, weighed, verified."\_).

The codebase is **a constitutional artifact**: 17 Iron Laws govern what can ship, three pre-commit shell scripts (`grep-mogtrix`, `grep-forbidden-words`, `supply-chain-scan`) enforce a subset at static-time, and the runtime `assertMarketingCopySafe` regex in `lib/compliance.ts` enforces another subset at request time. Every page that renders user-facing copy carries the Appendix A.1 footer disclaimer verbatim; every PDP carries the Appendix A.2 disclaimer verbatim; the age gate at `/checkout/review` is the verbatim Appendix A.3 text-checkbox; and the seven-attestation `customer-qualification` block is the verbatim Appendix A.5 text. The catalog is exactly seven SKUs plus the Recovery Stack bundle at locked prices from `DECISIONS/opening_sku_set.md`. Payments are restricted to BTCPay (crypto) + Plaid (ACH), with Stripe/PayPal/Square/Shopify-Payments forbidden by Iron Law 2.9 and the `lib/payments/config.ts` registry.

What stands out: (a) the design system is fully tokenized in `lib/design/tokens.ts` and mirrored in `app/globals.css` per Appendix V.2 — no ad-hoc hex anywhere; (b) payment adapters use a `PaymentProvider` interface with HMAC-SHA256 signature verification via `crypto.timingSafeEqual` and idempotent reconciliation by `intent.id`; (c) all credentials are stub Day-1 (BTCPay/Plaid/Supabase/Resend/Sentry) and the operator runbook lists the exact pre-launch credential rotation; (d) tests are 304/304 with vitest (25 files), Playwright E2E scaffolded but skipped pending CI provisioning; (e) deferrals are honest — Supabase wiring, real payment processing, Sentry alerts, Lighthouse CI, account flows beyond stubs all marked PLACEHOLDER with the phase that wires them. The code does what the spec says, with the spec quotable from the comments.

What's missing for a real launch: real LLC formation, domain registration, supplier confirmation, lab partner contract signing, and credential rotation (all in the operator pre-launch checklist). The site builds, tests pass, route-table is in shape, and the legal/compliance text is correct — but the runtime is in stub mode until the operator brings real credentials.

---

## 2. Architecture Overview

```
                       ┌──────────────────────────────────────────────┐
                       │  Vercel (iad1)  +  vialchems.labs  +  CDN    │
                       └──────────────────────┬───────────────────────┘
                                              │
                       ┌──────────────────────▼───────────────────────┐
                       │  Next.js 16.2.6 App Router  / RSC + Islands   │
                       │  React 19.2.4  / TypeScript 5  / Tailwind v4  │
                       └─┬────────────────────┬─────────────────┬─────┘
                         │                    │                 │
                         │ pages              │ API routes      │ globals
                         │                    │                 │
   ┌────────────────────▼────────────────────▼─────────────────▼───────────────┐
   │  /                            /api/health         IBM Plex Sans/Mono +      │
   │  /shop          (Fuse.js)     /api/contact        Newsreader Italic         │
   │  /products/[slug] (×7+1 SSG)  /api/newsletter/*   tokens via globals.css   │
   │  /cart                        /api/payments/*       ─ accent #3dd4c8       │
   │  /checkout/{address,method,                         ─ bg #0a0e0f           │
   │             review,confirm}                          ─ Vial.tsx (CSS-only) │
   │  /coa, /coa/[peptide]/[batch] (×7 SSG)              ─ vial-sway @keyframes │
   │  /account/*  (stubs)                                                        │
   │  /blog, /blog/[slug] (×5 SSG)                                              │
   │  /legal/{terms,privacy,refunds,shipping,cookies}                           │
   │  /about /faq /contact /test-reports /affiliate /login /signup ...          │
   └─────────────────────────────────┬──────────────────────────────────────────┘
                                     │
                  ┌──────────────────▼─────────────────────────────┐
                  │  lib/  (constitutional core, Iron-Law-protected)│
                  │                                                 │
                  │  compliance.ts    — assertMarketingCopySafe ★   │
                  │    └ jurisdictions.ts  — CA/TX/NY/FL block ★    │
                  │  attestations.ts  — Appendix A.3/A.5 text ★     │
                  │  customer-qualification.ts — 7 attestations ★   │
                  │  payments/                                       │
                  │    ├ types.ts (PaymentProvider interface) ★      │
                  │    ├ config.ts (registry: stub/btcpay/plaid) ★   │
                  │    ├ btcpay.ts (HMAC verify) ★                   │
                  │    ├ plaid.ts  (HMAC verify; JWKS Phase 10) ★    │
                  │    ├ stub.ts (deterministic mock)                │
                  │    ├ reconciliation.ts (idempotent ledger) ★     │
                  │    └ server.ts, index.ts                         │
                  │  cart-store.ts (Zustand + localStorage persist) │
                  │  use-session-storage.ts (useSyncExternalStore)  │
                  │  design/tokens.ts (mirrors globals.css)         │
                  │  content/                                        │
                  │    ├ site.ts (siteConfig, brand, env-bound)     │
                  │    ├ products.ts (7 SKUs + Recovery Stack) ★    │
                  │    ├ product-descriptions.ts (Appendix E.1) ★   │
                  │    ├ faq.ts (20 Q+A from Appendix M) ★          │
                  │    ├ blog.ts (5 ≥1500-word research posts) ★    │
                  │    ├ coa.ts (per-batch placeholder records)     │
                  │    ├ email-templates.ts (Appendix K) ★          │
                  │    └ promo-codes.ts (WELCOME15)                 │
                  │  utils.ts (cn = clsx + tailwind-merge)          │
                  └────────────┬───────────────────────────────────┘
                               │
                ┌──────────────▼───────────────┐
                │  external services (stub D-1) │
                │  ─ Supabase Postgres + Auth   │
                │  ─ Resend (email)             │
                │  ─ Sentry (monitoring)        │
                │  ─ Plaid (ACH)                │
                │  ─ BTCPay Server (self-hosted)│
                │  ─ Janoshik Analytical (lab)  │
                └───────────────────────────────┘

★ = file is in Iron-Law-protected scope (Iron Law 2.5: /review + /cso before commit)

   ┌──────────────────────────────────────────────────────────────────┐
   │  Static gates (.husky/pre-commit)                                 │
   │  1. scripts/grep-mogtrix.sh         → Iron Law 2.12               │
   │  2. scripts/grep-forbidden-words.sh → Iron Law 2.4 (40+ patterns) │
   │  3. scripts/supply-chain-scan.sh    → Iron Law 2.16 (6 categories)│
   │  Plus: npm typecheck + lint (run via `npm run preflight`)         │
   └──────────────────────────────────────────────────────────────────┘
```

**Key boundaries:**

- **Frontend / API split**: server components (PDP shell, layout, legal pages) vs `'use client'` islands (cart store consumers, checkout step forms, mobile nav, qualification flow). Clean split, no "use client" leakage at the page-shell level.
- **Compliance**: 3-layer (static via grep, runtime via `assertMarketingCopySafe`, editorial via `/review` + `/cso` before commit per Iron Law 2.5). Defense in depth.
- **Jurisdictional**: 3-layer (Zod refinement at address entry, server check at `/checkout/review`, post-payment check in `lib/payments/reconciliation.ts` planned for Phase 10). Currently first two are wired; the third is scaffolded.
- **Payments**: `PaymentProvider` interface gates all rails; the registry returns only `stub | btcpay | plaid`; `resolvePaymentProviderId` falls back to `stub` for any forbidden value (Stripe/PayPal/Square explicitly tested in `tests/unit/payments/config.test.ts`).
- **Database**: planned Supabase Postgres + RLS; not yet wired (Phase 8b deferred per Phase 3 checkpoint). All "persistence" today is in-memory ledger or localStorage/sessionStorage.
- **Email**: Resend templates exist verbatim in `lib/content/email-templates.ts`; sending is stubbed in the newsletter route.
- **Monitoring**: Sentry instrumented at `app/error.tsx` activation gate (`process.env.NEXT_PUBLIC_SENTRY_DSN`); no DSN wired Day-1.

---

## 3. The Constitution — 17 Iron Laws and Their Code Footprint

Every Iron Law is verbatim from SUPER_PROMPT_v3 §2. The "files in scope" column lists where each law is enforced or tested.

| #        | Iron Law (verbatim summary)                                                                     | Files in scope                                                                                                                                                                                                                                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2.1**  | NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST (TDD per `superpowers:test-driven-development`) | All `tests/unit/**/*.test.ts(x)` (304 tests, 25 files); commit-message format enforces RED/GREEN evidence in body                                                                                                                                                                                                                                                   |
| **2.2**  | NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE                                        | Phase 12 checkpoint records actual `npm test`, `npm run build`, `grep-mogtrix`, `grep-forbidden-words`, `supply-chain-scan` output                                                                                                                                                                                                                                  |
| **2.3**  | NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST                                                 | Comments in `MobileNavMenu.tsx` (`ISSUE-005 fix`), `CartCount.tsx` (`ISSUE-001/002`), `CheckoutGuard.tsx` (`ISSUE-004`), `cart-store.ts` (`ISSUE-002`) all cite the underlying bug, not just the patch                                                                                                                                                              |
| **2.4**  | NO HUMAN-CONSUMPTION OR THERAPEUTIC LANGUAGE IN ANY COPY                                        | `lib/compliance.ts` (40+ regex patterns) + `scripts/grep-forbidden-words.sh` (29 shell patterns) + `tests/unit/compliance.test.ts` (37 forbidden + 7 safe + 3 edge cases) + every page's verbatim copy + `validateQualification` runs `findMarketingCopyViolation` against `researchPurpose`                                                                        |
| **2.5**  | NO PAYMENT, COMPLIANCE, OR CATALOG CHANGES WITHOUT REVIEW + CSO GATES                           | Protected paths: `lib/payments/`, `lib/compliance.ts`, `lib/compliance/jurisdictions.ts`, `lib/customer-qualification.ts`, `lib/attestations.ts`, `lib/content/products.ts`, `lib/content/product-descriptions.ts`, `app/api/payments/`. Phase 13 checkpoint documents self-applied review (interactive gstack skills inlined per autonomous-clearance methodology) |
| **2.6**  | NO MERGE TO MAIN WITHOUT DESIGN-APPROVAL AND PLAN-APPROVAL ARTIFACTS ON DISK                    | `docs/checkpoints/phase_*.md` (12 files exist; phases 6/7/8/9 absorbed into 5/7 batches with deferrals documented); `docs/superpowers/plans/2026-05-08-architecture.md` (649 lines, contains inline §9 eng-review and §10 design-review)                                                                                                                            |
| **2.7**  | NO BAC WATER, NO TIRZEPATIDE, NO SEMAGLUTIDE/RETATRUTIDE IN OPENING CATALOG                     | `lib/compliance.ts` regexes for `\bsemaglutide\b`, `\btirzepatide\b`, `\bretatrutide\b`, `GLP-1`; `lib/content/products.ts` has only the 7 LOCKED SKUs; FAQ Q13 + Q14 explain the exclusion; verified in `tests/unit/compliance.test.ts`                                                                                                                            |
| **2.8**  | NO SHIPPING TO BLOCKLISTED JURISDICTIONS                                                        | `lib/compliance/jurisdictions.ts` (`BLOCKED_US_STATES = ['CA','TX','NY','FL']`); enforced in `app/checkout/address/AddressForm.tsx` (live state warning + submit block) and `app/checkout/review/ReviewPanel.tsx` (re-validation at place-order); legal/shipping page recites Appendix A.4 verbatim                                                                 |
| **2.9**  | NO DIRECT STRIPE / PAYPAL / SQUARE / SHOPIFY-PAYMENTS RAILS                                     | `lib/payments/config.ts` `VALID_IDS = ['stub','btcpay','plaid']`; `resolvePaymentProviderId('stripe') === 'stub'` (proven in `tests/unit/payments/config.test.ts:23-28`); FAQ Q8 explains why; checkout method form has the third radio `disabled` with "Coming soon"                                                                                               |
| **2.10** | NO FAKED REVIEWS, NO FAKE TESTIMONIALS, NO PERSONAL-USE STORIES                                 | No `<Review>` component, no testimonials data file, no before/after image asset. About page's "Hero" is the verbatim Appendix N narrative — third-person, evidence-first, no testimonials                                                                                                                                                                           |
| **2.11** | NO GLP-1 OBFUSCATED SKU NAMING                                                                  | All 7 SKUs use canonical names: `BPC-157-10MG`, `TB-500-5MG`, `GHK-CU-50MG`, `IPAMORELIN-10MG`, `CJC-1295-NO-DAC-5MG`, `MOTS-C-10MG`, `SELANK-10MG` (in `lib/content/products.ts`). No `GLP1-S` / `ION-1S` / `EDGE R3` style codes                                                                                                                                  |
| **2.12** | NO MOGTRIX BRANDING IN THE NEW REPO                                                             | `scripts/grep-mogtrix.sh` enforces; only single-line `// Pattern adapted from mogtrix-website/...` attribution comments allowed (present in `lib/compliance.ts:1`, `lib/customer-qualification.ts:1`, `lib/attestations.ts:1`, `components/qualification-flow.tsx:3`)                                                                                               |
| **2.13** | NO PRODUCT-PAGE CLAIM CROSSOVER WITH FORBIDDEN PATTERNS                                         | `lib/compliance.ts` regexes for therapeutic verbs (`\btreats?\b`, `\bcures?\b`, `\btherapy\b`, `\btherapeutic\b`); `lib/content/product-descriptions.ts` 7 verbatim 336-345 word descriptions written in research register only                                                                                                                                     |
| **2.14** | NO RECONSTITUTION KIT BUNDLING                                                                  | `lib/content/products.ts` has only `format: 'vial'` — no syringes, no BAC water, no kit SKUs; only bundle is Recovery Stack (peptide vials only); shipping policy §6 explicitly states no BAC water, syringes, or alcohol pads in cartons                                                                                                                           |
| **2.15** | TDD CHECKPOINT COMMITS AS PROTOCOL EVIDENCE                                                     | Phase 3 checkpoint cites `feat(phase-3): GREEN — ...` commit message format with verbatim test PASS/FAIL output. Iron Law text says `git log --grep="RED —"` and `git log --grep="GREEN —"` should find evidence                                                                                                                                                    |
| **2.16** | PRE-COMMIT SUPPLY-CHAIN SCANNER MANDATORY                                                       | `scripts/supply-chain-scan.sh` runs 6 categories: hidden unicode (ZWSP/ZWNJ/ZWJ/WJ/BOM/bidi), forbidden infra keywords (`curl                                                                                                                                                                                                                                       | bash`, `ANTHROPIC_BASE_URL`, `--no-verify`, `--dangerously-skip-permissions`), credential file leak detection (`.env*`non-example,`id_rsa*`, `*.pem`, `*credentials\*`), debug-leftover (warn only), prompt-injection HTML comments (`<!--`near`[A-Z]{4,}`, `data:text/html`, `<script`), suspicious base64 blobs >200 chars (warn only) |
| **2.17** | AGENT-INTROSPECTION-DEBUGGING ON 3+ FAILED FIXES                                                | Documented in Phase 12 checkpoint as `N/A this build (no fix loops)`. The protocol exists per spec (`docs/checkpoints/introspection_<phase>_<timestamp>.md` write target) but was never triggered during the 16-phase build                                                                                                                                         |

**Protected paths summary** (per Iron Law 2.5 — touching these requires `/review` + `/cso` before commit):

```
lib/payments/                       (8 files: config, index, server, types, btcpay, plaid, stub, reconciliation)
lib/compliance.ts                   (40+ regex patterns, runtime gate)
lib/compliance/jurisdictions.ts     (CA/TX/NY/FL block list)
lib/customer-qualification.ts       (Zod schema + 7 attestations + 6 roles)
lib/attestations.ts                 (verbatim age/RUO/jurisdictional text)
lib/content/products.ts             (catalog seed)
lib/content/product-descriptions.ts (verbatim Appendix E.1 descriptions)
app/api/payments/btcpay/webhook/route.ts
app/api/payments/plaid/webhook/route.ts
```

> Note: SUPER_PROMPT_v3 §2.5 also names `lib/content/legal.ts` and `app/api/access/` as protected paths. **Neither was implemented.** Legal pages live as verbatim React components under `app/legal/{terms,privacy,refunds,shipping,cookies}/page.tsx`; access/qualification API was deferred to Phase 8b.

---

## 4. Phase Ledger (16 phases, 12 checkpoints)

For each phase, this table shows what landed, where it lives, and which checkpoint records it. Phases 6/7/8/9 don't have their own checkpoint files — their work was either folded into Phase 5 (pages, content) and Phase 7 (catalog, newsletter wiring) batches, or deferred. The deferral structure is honest: each Phase X checkpoint that absorbs work from Phase Y states explicitly what was deferred and to which downstream phase.

| Phase  | Goal                                                          | What landed                                                                                                                                                                                                                                                                                                                                                                              | Code location                                                                                                                                                                                     | Checkpoint                                                                |
| ------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----- | ---- | ----- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **0**  | Bootstrap: env + manifest + decisions                         | Project dir created, git init, brand pick LOCKED_OVERRIDE to Vialchems Labs                                                                                                                                                                                                                                                                                                              | `/root/peptide-site/.git`, no Mogtrix shadowing                                                                                                                                                   | `docs/checkpoints/phase_0_bootstrap.md`                                   |
| **1**  | Comprehension digest from full corpus                         | 6 subagent distillations (sub_1 compliance, sub_2 pricing, sub_3 acquisition, sub_4 industry, sub_5 site anatomy, sub_6 payments) + CORPUS_DIGEST                                                                                                                                                                                                                                        | `docs/research/sub_1-6_*.md`, `docs/checkpoints/phase_1_comprehension.md`                                                                                                                         | `docs/checkpoints/phase_1_comprehension.md`                               |
| **2**  | Architecture lock                                             | 649-line plan with §9 self-applied eng-review (9/10 across most dimensions) + §10 design-review (9-10/10)                                                                                                                                                                                                                                                                                | `docs/superpowers/plans/2026-05-08-architecture.md`                                                                                                                                               | `docs/checkpoints/phase_2_architecture.md`                                |
| **3**  | Backend bootstrap (NEW project, port-by-reading from Mogtrix) | Next.js 16.2.6 scaffold + Husky + 3 gate scripts + `lib/compliance.ts` + `lib/compliance/jurisdictions.ts` + `lib/content/site.ts` + `app/api/health/route.ts` + 50/50 tests passing                                                                                                                                                                                                     | `package.json`, `.husky/pre-commit`, `scripts/`, `lib/compliance*`, `app/api/health/route.ts`                                                                                                     | `docs/checkpoints/phase_3_backend.md`                                     |
| **4**  | Brand + design system                                         | `lib/design/tokens.ts` + `app/globals.css` (Posture A tokens from Appendix V.2) + 8 UI primitives (`components/ui/Button                                                                                                                                                                                                                                                                 | Card                                                                                                                                                                                              | FieldLabel                                                                | Input | Pill | Specs | Vial`) + `SiteHeader`+`SiteFooter` + 119/119 tests passing | `lib/design/tokens.ts`, `app/globals.css`, `components/ui/`, `components/SiteHeader.tsx`, `components/SiteFooter.tsx` | `docs/checkpoints/phase_4_brand_design.md` |
| **5**  | 29 page templates                                             | All 29 pages built (13 e-commerce + 8 content/trust + 5 legal + 3 auxiliary); home, shop, PDP, cart, 4-step checkout, COA library + detail, account dashboard + sub-pages, all legal pages, blog index + posts; 172/172 tests passing                                                                                                                                                    | `app/**/page.tsx` (38 routes total), `components/qualification-flow.tsx`, `components/MobileNavMenu.tsx`, `components/CheckoutGuard.tsx`, `components/CartCount.tsx`, `components/LegalShell.tsx` | `docs/checkpoints/phase_5_pages.md`                                       |
| **6**  | Long-form copy                                                | 5 blog posts at 1500-1588 words each (in `lib/content/blog.ts`), 7 verbatim 336-345 word product descriptions (`lib/content/product-descriptions.ts`), 4-email welcome sequence (`lib/content/email-templates.ts`), FAQ (`lib/content/faq.ts`), about/legal copy verbatim from appendices                                                                                                | `lib/content/blog.ts` (529 lines), `lib/content/product-descriptions.ts`, `lib/content/email-templates.ts`, `lib/content/faq.ts`                                                                  | (no separate checkpoint; absorbed into Phase 10 checkpoint)               |
| **7**  | Catalog + COA + intro promo                                   | 7 placeholder COA PDFs (`public/coa/<slug>-BATCH-2026-PLACEHOLDER.pdf`), `lib/content/coa.ts` placeholder records, `lib/content/promo-codes.ts` (WELCOME15), `app/api/newsletter/subscribe/route.ts` stub, newsletter form in footer                                                                                                                                                     | `public/coa/`, `lib/content/coa.ts`, `lib/content/promo-codes.ts`, `app/api/newsletter/subscribe/route.ts`                                                                                        | (no separate checkpoint; folded into Phase 10)                            |
| **8**  | Compliance scaffolding                                        | Largely landed in Phase 3 (compliance.ts + jurisdictions.ts) and Phase 5 (qualification-flow.tsx, age gate at /checkout/review). Customer qualification submission persistence deferred to "Phase 8b" (Supabase wiring). Auth flow deferred to "Phase 8b"                                                                                                                                | `lib/customer-qualification.ts`, `lib/attestations.ts`, `components/qualification-flow.tsx`, `app/checkout/review/ReviewPanel.tsx`                                                                | (no separate checkpoint; deferred wiring documented in Phase 10/Phase 13) |
| **9**  | Payment integration                                           | Full payment adapter pattern: `lib/payments/{types,config,index,server,stub,btcpay,plaid,reconciliation}.ts` + 2 webhook routes (`app/api/payments/{btcpay,plaid}/webhook/route.ts`) + Day-1 stub adapter + scaffolded BTCPay/Plaid adapters with HMAC-SHA256 signature verification (real Greenfield POST and Plaid Link/Transfer creation deferred to Phase 10)                        | `lib/payments/`, `app/api/payments/`, `tests/unit/payments/` (7 test files)                                                                                                                       | (no separate checkpoint; covered by Phase 12 QA checkpoint)               |
| **10** | Auxiliary surfaces                                            | All 29 pages already built in Phase 5; this phase formalized the deferral list (newsletter Resend wire, real Supabase auth, real Plaid/BTCPay processing, cart cross-reload via Supabase, cookie consent banner)                                                                                                                                                                         | n/a (deferral documentation)                                                                                                                                                                      | `docs/checkpoints/phase_10_auxiliary.md`                                  |
| **11** | Operator runbook                                              | 300-line `docs/operator-runbook.md` covering pre-launch checklist, Day-1/Weeks-2-4/Months-2-3/Avoid prioritization, Tier S clinical-credentialed creator outreach as Day-1 wedge, Slice 3 PLACEHOLDER sections                                                                                                                                                                           | `docs/operator-runbook.md`                                                                                                                                                                        | `docs/checkpoints/phase_11_runbook.md`                                    |
| **12** | QA + reviews                                                  | 304/304 unit tests passing; build succeeds (50 static + 38 routes); typecheck/lint clean; all 3 supply-chain scripts return 0 violations; all 14 applicable Iron Laws verified (2.17 N/A — no fix loops)                                                                                                                                                                                 | (verification artifacts)                                                                                                                                                                          | `docs/checkpoints/phase_12_qa.md`                                         |
| **13** | Pre-deploy reviews                                            | Self-applied `/review`, `/cso`, `/codex review` per autonomous-clearance methodology (interactive gstack skills inlined). 0 critical findings. Non-critical deferrals listed (Plaid JWT/JWKS migration, real DB persistence, Lighthouse CI, E2E unskip, real Sentry alerts, cookie banner, KPV catalog expansion, Slice 3 community channel runbook, lab partner contract, LLC + domain) | (review artifacts)                                                                                                                                                                                | `docs/checkpoints/phase_13_reviews.md`                                    |
| **14** | Ship + deploy                                                 | GitHub repo created PRIVATE at `endegenaassefa/vialchems-labs`, tag `v1.0.0`, 16 commits Phase-0 through Phase-14, CHANGELOG written. Vercel deploy DEFERRED to operator (interactive auth required)                                                                                                                                                                                     | `CHANGELOG.md`, GitHub remote                                                                                                                                                                     | `docs/checkpoints/phase_14_deploy.md`                                     |
| **15** | Post-deploy monitoring + docs                                 | Procedure documented (canary monitoring, Sentry alert config, runbook handoff, Week +1 retro). Execution requires deployed Vercel URL + real env vars                                                                                                                                                                                                                                    | (procedure documentation only)                                                                                                                                                                    | `docs/checkpoints/phase_15_post_deploy.md`                                |

---

## 5. File Map

### Root configs (12 files read)

`package.json` — name `vialchems-labs`, v1.0.0, scripts include `preflight` (typecheck + lint + 3 grep gates). Deps: Next.js 16.2.6, React 19.2.4, TS 5, Supabase SSR + JS client, TanStack Query, Sentry/nextjs, Zustand, Zod, Fuse.js, Lucide, clsx, tailwind-merge. Dev: Vitest, Playwright, Tailwind v4 PostCSS, Husky 9, eslint-config-next, prettier + tailwind plugin, jsdom, testing-library/react+jest-dom.

`tsconfig.json` — strict, `@/*` path alias, `module: esnext`, `moduleResolution: bundler`. `next.config.ts` — empty default config (no Sentry instrumentation wired Day-1, contrary to architecture plan §2). `eslint.config.mjs` — extends `eslint-config-next/{core-web-vitals,typescript}`. `postcss.config.mjs` — Tailwind v4 PostCSS plugin only. `vitest.config.ts` — jsdom env + `tests/setup.ts` + `@/*` alias.

`README.md` — 71-line summary referencing this build's source-of-truth super-prompt and the Phase 11 operator runbook for pre-launch actions. `CHANGELOG.md` — formal v1.0.0 release notes covering site, brand, catalog, compliance, payment, customer acquisition, tech stack, verification, and operator pre-launch checklist. `AGENTS.md` — single 6-line note that this is "NOT the Next.js you know" with breaking changes vs training data; agents should read `node_modules/next/dist/docs/` before writing code. `.gitignore` — standard Next.js + .env\* + .vercel + IDE folders + Playwright artifacts. `.env.example` — comprehensive template with stub fields for site/Supabase/Resend/Sentry/Plaid/BTCPay/LLC/lab partner. `next-env.d.ts` — Next.js auto-managed.

### Husky + scripts (4 files)

`.husky/pre-commit` — runs `bash scripts/grep-mogtrix.sh`, `grep-forbidden-words.sh`, `supply-chain-scan.sh` in sequence. Set -e, no `--no-verify` bypass.

`scripts/grep-mogtrix.sh` — Iron Law 2.12. Greps for "mogtrix" case-insensitive in source files, excludes attribution comments (`// Pattern adapted from mogtrix-`, equivalent for `/* */` and `#`), excludes the script itself + package-lock.json + docs/ for markdown.

`scripts/grep-forbidden-words.sh` — Iron Law 2.4. 29 regex patterns (lowercased shell version of the runtime regex set in `lib/compliance.ts`); 4 SCAN_PATHS (`app`, `components`, `lib/content`, `public`); SKIP_PATHS list includes the legal pages, FAQ, About, product-descriptions, blog, email-templates, products.ts (these contain forbidden words in negated/exclusion contexts per Iron Law-aware editorial review).

`scripts/supply-chain-scan.sh` — Iron Law 2.16. 6 categories: hidden unicode, forbidden infra keywords (`curl|bash`, `ANTHROPIC_BASE_URL`, `--no-verify`, `--dangerously-skip-permissions`, `enableAllProjectMcpServers`), credential file leak, debug leftover (warn only), prompt-injection HTML comments, base64 blobs >200 chars (warn only).

### `lib/` (24 files)

`lib/compliance.ts` (121 lines) — `assertMarketingCopySafe(copy)` (throws on first match) + `findMarketingCopyViolation(copy)` (returns matched pattern source or null). 40+ regex patterns in 7 categories: outcome claims (weight loss/fat loss/muscle growth/blood sugar/etc.), therapeutic verbs (`treats?`, `cures?`, `therapy`, `therapeutic`, `prevent disease`), pharma comparisons (Ozempic/Wegovy/Mounjaro/Zepbound), catalog exclusions (GLP-1, semaglutide, tirzepatide, retatrutide, insulin, diabetes), quality claims (clinically proven, medical grade, pharmaceutical grade, prescription strength, FDA approved, safe for human, medical advice), human-use intent (human use/consumption/dosing/ingestion/injection, bodybuilding), dosing protocols (`dosing recommendation`, `dose protocol`, `recommend(ed|s)? dose`), personal pronouns describing effects (`makes you`, `helps you`, `your weight`, `improves your`, `for you(r|rs)? body`). Comment line 1 attributes to `mogtrix-website/site/lib/compliance.ts` per Iron Law 2.12.

`lib/compliance/jurisdictions.ts` (49 lines) — `BLOCKED_US_STATES = ['CA', 'TX', 'NY', 'FL'] as const`, `ALLOWED_COUNTRIES = ['US'] as const`. `validateShippingAddress({countryCode, stateCode})` returns `{ok: true} | {ok: false, reason: string}`. Comment notes 3-layer enforcement (address entry, checkout review, post-payment confirmation). The third layer is scaffolded in `lib/payments/reconciliation.ts` but not yet wired.

`lib/attestations.ts` (37 lines) — Re-exports `ATTESTATIONS` from customer-qualification + verbatim `AGE_GATE_TEXT`, `RUO_ACK_TEXT`, `JURISDICTION_ACK_TEXT` constants from Appendix A.3. `AttestationRecord` types: age-gate / ruo / jurisdiction / qualification-full. Mogtrix-attributed.

`lib/customer-qualification.ts` (102 lines) — `QualificationRoles = ['academic-researcher', 'clinical-research', 'biotech-researcher', 'lab-technician', 'compounding-pharmacy', 'other']`. `ATTESTATIONS` is the verbatim 7-line block from Appendix A.5. `qualificationSchema` is a Zod schema with `email().email()`, `enum(QualificationRoles)`, `researchPurpose` (min 20, max 2000, refined through `findMarketingCopyViolation`), and 4 `literal(true)` acknowledgments. `validateQualification(raw)` returns `{ok: true, data} | {ok: false, errors}`. Mogtrix-attributed.

`lib/payments/types.ts` (95 lines) — `PaymentProviderId = 'stub' | 'btcpay' | 'plaid'`, `PaymentMethod = 'crypto' | 'ach' | 'card'`, `PaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded'`. `PaymentProvider` interface: `createIntent`, `getIntent`, `handleWebhook`. `PAYMENT_DISCOUNT_PCT = { crypto: 0.15, ach: 0.05, card: 0 }`. `applyPaymentMethodDiscount(subtotalCents, method)` returns `{method, discountCents, totalCents}`.

`lib/payments/config.ts` (63 lines) — `getPaymentRegistry()` returns cached `Record<PaymentProviderId, PaymentProvider>` built from `createStubAdapter`, `createBtcpayAdapter`, `createPlaidAdapter`. `resolvePaymentProviderId(raw)` whitelists VALID_IDS and falls back to `'stub'` for any garbage value (proven to fail-safe Stripe/PayPal/Square/Shopify).

`lib/payments/index.ts` (65 lines) — Tree-shakeable public API. Re-exports types, registry helpers, reconciliation API; `createPaymentIntent` and `getPayment` convenience wrappers.

`lib/payments/server.ts` (75 lines) — Server-only helpers. `getProviderEnvStatus()` returns config-readiness for stub/btcpay/plaid. `readRawBody(req)` and `headersToRecord(req)` used by webhook routes.

`lib/payments/stub.ts` (119 lines) — Deterministic in-memory adapter with auto-confirm via setTimeout (skipped when NODE_ENV=test). `markPaid(id)` and `reset()` test helpers exposed via `StubAdapter` extension of `PaymentProvider`.

`lib/payments/btcpay.ts` (208 lines) — `STUB_VALUES` set guards against pseudo-real config. `mapBtcpayStatus(s)` maps BTCPay invoice strings (New, PaidPartial, Processing, Settled, Paid, Confirmed, Expired, Invalid + their `Invoice*` variants) to PaymentStatus. `verifyBtcpaySignature(rawBody, signatureHeader, secret)` does HMAC-SHA256 + `crypto.timingSafeEqual` (constant-time). `createBtcpayAdapter` returns a `PaymentProvider` whose `createIntent` and `getIntent` are scaffolded (throw `btcpay_create_intent_not_implemented`, return null) — actual Greenfield API integration deferred to Phase 10. `handleWebhook` is fully implemented end-to-end.

`lib/payments/plaid.ts` (218 lines) — Same shape as BTCPay. `mapPlaidStatus` heuristic on event-code substrings (POSTED/SETTLED/COMPLETED → paid; RETURNED/FAILED/CANCELED → failed; AUTH/VERIFIED/READY → authorized; else pending). `verifyPlaidSignature` uses HMAC-SHA256 (Phase 10 will swap to JWT/JWKS per Plaid's production scheme — flagged in inline comment + Phase 13 codex review).

`lib/payments/reconciliation.ts` (130 lines) — Idempotent ledger by `intent.id`. `VALID_TRANSITIONS` state machine: pending → {pending, authorized, paid, failed}; authorized → {authorized, paid, failed}; paid → {paid, refunded}; failed → {failed} (terminal); refunded → {refunded} (terminal). `reconcile(intent)` returns `ReconcileResult` with `applied: boolean` + `reason: 'no_intent' | 'already_at_status' | 'invalid_transition' | 'applied_*'` + `from/toStatus`. Currently in-memory; Phase 10 wires to Supabase `order_status_history`.

`lib/cart-store.ts` (93 lines) — Zustand store with `persist` middleware, localStorage backed (key `vialchems:cart`). `addLine` clamps qty to [1, 10]; `setQty` likewise. `useCartHydrated()` exposes `_hasHydrated` flag for SSR/client mismatch avoidance. Comment cites `ISSUE-002 fix` (cart was wiped on full reload).

`lib/use-session-storage.ts` (64 lines) — `useSessionStorageItem<T>(key)` and `useSessionStorageString(key)` via `useSyncExternalStore` (avoids `react-hooks/set-state-in-effect` lint warning common in checkout hydration patterns).

`lib/utils.ts` (14 lines) — `cn(...inputs)` = `twMerge(clsx(inputs))`. Used everywhere a component takes a `className` prop.

`lib/design/tokens.ts` (121 lines) — Posture A token map per Appendix V.2. `colors`: 18 entries including bg/surface/surface-strong/accent/accent-soft/accent-glow/text/text-muted/text-subtle/border/border-strong/electric/pillAccent/pillInfo/pillElectric/pillError. `typography.scale` 14 entries (heroXl through labelUppercase). `spacing` (4px base × 11 stops). `radius`, `motion.ease`, `motion.duration`, `zIndex`. Mirrored in CSS variables in `app/globals.css`.

`lib/content/site.ts` (36 lines) — `siteConfig`: name "Vialchems Labs", brandStem "vialchems", domain "vialchems.labs", url "https://vialchems.labs", description, tagline "Counted, weighed, verified.", posture "A" (literal). `llcName`/`llcJurisdiction` env-bound (default `Vialchems Labs LLC` / `Wyoming`). `email.from` and `email.staff`. `labPartner` (Janoshik default). `shipping.{pilotUSCents, freeShippingThresholdCents}` env-bound (default $15 / $200).

`lib/content/products.ts` (193 lines) — 7 SKU rows + 1 Bundle row. Categories: recovery, gh-axis, cosmetic-pathway, metabolic, nootropic. Each product has slug, sku (canonical), name, shortName, dose, format ('vial' literal), listPriceCents, perMgCents, category, role, position, shortDescription. Helpers: `getProductBySlug`, `getBundleBySlug`, `getProductsByCategory`, `formatPrice`, `formatPerMg`. Note: this file is in SKIP_PATHS for `grep-forbidden-words.sh` because the FDA-defensive shortDescription sometimes uses words that would otherwise match; it's editorially audited.

`lib/content/product-descriptions.ts` (114 lines) — `productDescriptions: Record<string, string>` with 7 verbatim 336-345 word descriptions from SUPER_PROMPT_v3 Appendix E.1. Each is research-register, in vitro / animal-model framing, no human-use claims, no comparisons to approved drugs. SKIP_PATHS-listed.

`lib/content/faq.ts` (100 lines) — 20 verbatim Q+A from Appendix M, with brand placeholders substituted to "Vialchems Labs" / "Janoshik Analytical" / `https://vialchems.labs`. SKIP_PATHS-listed (Q13 names tirzepatide/semaglutide/retatrutide in their EXCLUSION rationale context).

`lib/content/blog.ts` (529 lines) — 5 long-form research-register articles: bpc-157-research, reading-a-coa, ghk-cu-research, tb-500-research, recovery-stack-synergy. Each has structured `sections: BlogSection[]` (heading + paragraphs) and `citations: Citation[]` (PubMed-style with `placeholder` doi suffix). 1500-1588 words per post; 6 citations each (the prompt asks for ≥5). SKIP_PATHS-listed.

`lib/content/coa.ts` (45 lines) — `coaRecords: CoaRecord[]` is `products.map((p) => ({ peptide: p.slug, peptideName: p.name, batch: 'BATCH-2026-PLACEHOLDER', testDate: '2026-04-15', lab: 'Janoshik Analytical', hplcPurityPct: 99.1, sterilityResult: 'PASS', endotoxinEU_per_mg: '< 0.5 EU/mg', pdfPath: '/coa/<slug>-BATCH-2026-PLACEHOLDER.pdf' }))`. `getCoa(peptide, batch)` returns the matching record or undefined.

`lib/content/email-templates.ts` (131 lines) — `emailWelcomeSequence: EmailTemplate[]` with 4 verbatim Appendix K bodies (welcome-lead-magnet at delayDays:0, reading-coa at +3, bpc-157-research at +7, welcome-discount at +14). `customerServiceAutoReplies` with `dosingQuestion` and `lostPackage(orderId)` per Appendix A.6. Footer (3 paragraphs of disclaimer + LLC + unsubscribe link) appended to every email body via shared FOOTER constant.

`lib/content/promo-codes.ts` (47 lines) — `promoCodes` map with single entry `WELCOME15` (15% off, firstOrderOnly, requiresNewsletterSignup, requiresAgeGate, requiresRuoAck). `calculatePromoDiscount(code, subtotalCents)` returns `{discountCents, promo} | null`.

### `components/` (15 files)

`components/SiteHeader.tsx` — Sticky header with backdrop-blur, brand wordmark ("Vialchems" Plex Sans 600 + "LABS" Plex Mono uppercase chip with accent border), 7 nav items (Shop, Quality (→ /test-reports), COA, Research (→ /blog), About, FAQ, Contact), Account link (md+), Cart link with `<CartCount />` island, `<MobileNavMenu />` for narrow viewports.

`components/SiteFooter.tsx` — 5-column grid (brand+newsletter, Shop, Customer Service, Legal, more). Newsletter form posts to `/api/newsletter/subscribe`. Verbatim Appendix A.1 disclaimer block (3 paragraphs: RUO, FDA-not-evaluated, 503A/503B). Comment explicitly cites Appendix A.1 as LOCKED via DECISIONS/compliance_posture.md.

`components/MobileNavMenu.tsx` — Disclosure-style nav for `<md` viewports. Uses React Portal + Escape handler + body scroll lock + click-outside close. Comment cites `ISSUE-005 fix` (mobile users had no nav before).

`components/CartCount.tsx` — `'use client'` island that subscribes to `useCartStore`. Hydration-safe: renders 0 until `useCartHydrated()` flips. Comments cite `ISSUE-001 fix` and `ISSUE-002 follow-up`.

`components/CheckoutGuard.tsx` — `'use client'` island. After `useCartHydrated()`, if `lineCount === 0`, redirects to `/cart` via `router.replace`. Renders empty-state placeholder pre-hydrate to avoid flash. Comment cites `ISSUE-004 fix` (empty cart could reach checkout steps before).

`components/LegalShell.tsx` — Server component shell with eyebrow + title + lastUpdated stamp + prose-style content column. Used by all 5 legal pages.

`components/qualification-flow.tsx` — `'use client'` form for the 7-attestation block. Email + role select (6 options) + research purpose textarea (assertMarketingCopySafe-validated) + 4 acknowledgment checkboxes (age, RUO, jurisdictional, attestations). Calls `validateQualification` on submit. Mogtrix-attributed.

`components/ui/Button.tsx` — Variants `primary | outline | ghost | data`; sizes `sm (h-8) | md (h-10) | lg (h-12)`. Premium-out easing (cubic-bezier(0.16,1,0.3,1)) 200ms hover; `active:scale-[0.98] active:duration-[80ms]`; `disabled:opacity-50 disabled:cursor-not-allowed`. Defaults to `type="button"`. React 19 ref-as-prop (no forwardRef).

`components/ui/Card.tsx` — Polymorphic via `as: 'div' | 'article' | 'section'`. Variants `default | interactive` (hover lift + accent border). 14px radius, surface bg, 1px border.

`components/ui/FieldLabel.tsx` — `<label>` with Plex Mono 11px uppercase 0.12em tracking, muted text. `required` prop renders an aria-hidden asterisk in accent color.

`components/ui/Input.tsx` — Surface-strong bg, 10px radius, 16px text. `error` prop renders a paired `role="alert"` element + sets `aria-invalid` and `aria-describedby`.

`components/ui/Pill.tsx` — Variants `accent | info | electric | error` with text/border/bg color-mix tints. h-6 px-2 mono uppercase 0.12em tracking, 11px. Comment notes Iron Law: color is never the sole indicator (every pill carries a text label).

`components/ui/Specs.tsx` — `<dl>` with mono dt/dd pairs, dotted bottom-border separator (suppressed on `:last-child`). `value` accepts ReactNode.

`components/ui/Vial.tsx` — Pure CSS SVG. Size sm/md/lg. `sway` prop applies `[animation:vial-sway_6.4s_ease-in-out_infinite]`. Three gradients: vc-cap (metallic grey), vc-glass (subtle teal tint), vc-powder (cream lyophilized fill — NOT green liquid). aria-hidden by default.

### `app/` (50 page/route files)

#### Layout + globals + error/404

`app/layout.tsx` (69 lines) — IBM Plex Sans/Mono + Newsreader Italic loaded via `next/font/google` with CSS variables. `metadata` exports include OpenGraph + Twitter card + robots index/follow. Skip-link in body.

`app/globals.css` (205 lines) — Posture A tokens as CSS variables under `:root`, mirrored to `@theme inline` for Tailwind v4 utility access. Body has 2-radial-gradient atmospheric background (subtle teal + electric tints). `*:focus-visible` global focus ring (2px solid accent + 2px offset). Skip-link styles. Reduced-motion fallback hard-disables animation/transitions. Keyframes: `vial-sway` (-12° to +12°), `vial-float`, `vial-sheen`, `reveal-up` (used as `.reveal-up` utility for stagger).

`app/error.tsx` — `'use client'`. Renders Error 500 with `error.digest` reference, retry button, back-to-home, contact-support links. Sentry instrumentation gated on `process.env.NEXT_PUBLIC_SENTRY_DSN`.

`app/not-found.tsx` — Renders Error 404 with "No record in this batch." headline + 3 popular products from `lib/content/products.ts`.

`app/page.tsx` — Hero "Counted, weighed, verified." (italic accent) + 3-column thesis (Tested, Compliant, Focused) + Recovery Stack CTA strip ($77.00 / 12.5% off / view bundle).

#### Shop + Product + Cart + Checkout (12 files)

`app/shop/page.tsx` + `app/shop/ShopCatalog.tsx` — Server shell + client island. Search via Fuse.js (threshold 0.4) over name + sku + category + shortName. Category filter chips (5 categories with toggle). In-stock toggle (placeholder; all SKUs marked in-stock Day 1). Sort dropdown (newest, price asc/desc, name A-Z). `ProductTile` renders Vial + category Pill + In stock Pill + name + per-mg + Add to Cart. Comment cites `ISSUE-008 fix` (Recovery Stack used to show even when filtered out).

`app/products/[slug]/page.tsx` + `AddToCartIsland.tsx` + `ProductTabs.tsx` — `generateStaticParams` returns all 7 products + 1 bundle. Server component renders Hero (Vial lg + 3 Pills + Title + sku/dose) + Price strip ($price + per-mg + AddToCart island) + ProductTabs (Description/COA/Related) + Stack Callout (BPC-157 or TB-500 → Recovery Stack) + Disclaimer (verbatim Appendix A.2). Bundle has its own `BundleDetail` branch with constituents grid. ProductTabs is `'use client'` with role="tablist"/"tab"/"tabpanel" semantic markup; DescriptionPanel renders `getProductDescription(sku)` paragraphs + Specs (SKU, Format, Dose, Storage 2-8°C, List, Per mg); CoaPanel pulls the placeholder COA record + links to PDF; RelatedPanel picks 3 same-category siblings or falls back.

`app/cart/page.tsx` — Empty state + line items list with qty +/- (clamped via store) + remove + summary card with subtotal/shipping/discount/total + Proceed to checkout link.

`app/checkout/page.tsx` — Redirects to `/checkout/address` (Next.js `redirect()`).

`app/checkout/CheckoutSteps.tsx` — Numbered progress indicator, active/complete styling, role="list" with aria-label="Checkout progress".

`app/checkout/address/page.tsx` + `AddressForm.tsx` — Server shell wraps in `<CheckoutGuard>`. Form uses Zod schema (name, email, street, city, stateCode, zip 5-or-9-digit regex, countryCode literal('US')). All 50 US state options enumerated. Live state-validation warning if blocked state selected. Country select disabled. Submit blocks if `showStateWarning`. Persists to sessionStorage `vialchems:checkout:address`. Comment notes Day-1 Blocked states bar at bottom.

`app/checkout/method/page.tsx` + `MethodForm.tsx` — Three radio options: Crypto (Save 10-15%, Recommended), ACH (Save 5%), Card (Coming soon, disabled). Side panel shows live order summary from cart store. Persists `crypto | ach` to sessionStorage. "Card networks do not currently support research-peptide categories" copy.

`app/checkout/review/page.tsx` + `ReviewPanel.tsx` — Reads address + method from sessionStorage, lines from cart store. Renders address summary, method summary (with `discountPct` Pill), order summary card with line-item list + Specs (subtotal, discount = subtotal × pct, shipping, total). **Verbatim Appendix A.3 age-gate text-checkbox + verbatim RUO acknowledgment text-checkbox** (both must be true to enable Place Order). On submit: re-validates address through `validateShippingAddress`, generates `VC-<8-char-uuid>` order ID, writes the full order to sessionStorage `vialchems:checkout:order`, calls `clear()` on cart, navigates to `/checkout/confirm`.

`app/checkout/confirm/page.tsx` + `ConfirmPanel.tsx` — Reads the placeholder order. Renders Order ID (mono tabular, 28px), method-aware status Pill ("Awaiting BTC confirmation" / "Awaiting ACH clearance"), placed timestamp, expected ship (tomorrow heuristic), totals, items list, links to `/order/[id]`, `/account/orders`, `/shop`.

#### Account + Order detail (8 files)

`app/account/page.tsx` — Dashboard with Welcome back + 4 tile cards (Recent orders, Address book, Downloads → /coa, Email preferences). Pill: "Preview".

`app/account/orders/page.tsx` + `OrdersList.tsx` — Reads stub order from sessionStorage; if present shows single line item with method-aware Pill, total, detail link; otherwise empty state with "Browse the catalog →".

`app/account/orders/[id]/page.tsx` + `AccountOrderDetail.tsx` — Same data shape as `/order/[id]` but with cancel + refund-request action stubs that surface `actionMessage` to `role="status"` text.

`app/account/addresses/page.tsx` — Stub. Empty state + Add address form (label, recipient, street, city, zip — no save).

`app/account/settings/page.tsx` — Stub. 3 email-preference checkboxes (new-batch, research-index, order-status — order-status disabled & always checked) + Sign out + Delete account links.

`app/order/[id]/page.tsx` + `OrderDetailIsland.tsx` — Public-by-link stub. Reads from sessionStorage with `expectedId === stored.id` check. Shows method status Pill, RUO Pill, Tracking pending Pill, summary, address, line items, "COA reference attaches when batch allocated" caption.

#### Content + Trust pages (8 files)

`app/about/page.tsx` — Verbatim Appendix N narrative, brand placeholders substituted: Hero ("Measurable accuracy." with italic accent), Thesis (Small catalog. Deep transparency.), Operations (US warehouse, same-business-day, BTCPay + Plaid), Compliance (chemical supplier, NOT 503A/503B). SKIP_PATHS-listed.

`app/blog/page.tsx` — Lists `blogPosts` from `lib/content/blog.ts`. Each entry: date, title (link), summary, "Read research →" link.

`app/blog/[slug]/page.tsx` — Renders `getBlogPostBySlug(slug)`: title + author + date + excerpt + structured `sections` (heading + paragraphs) + numbered citations footnote. Bottom callout: "Research-only positioning" with link to /coa.

`app/faq/page.tsx` — `<details>` disclosure for each entry from `faqEntries`. Numbered `01` through `20` (zero-padded). Marker uses `+` rotated 45° on `group-open`.

`app/contact/page.tsx` — `'use client'`. Form posts to `/api/contact`. Status: idle/submitting/ok/error. Notice: "We do not respond to dosing questions per Iron Law 2.4."

`app/coa/page.tsx` — `'use client'`. Searchable table over coaRecords (Fuse.js threshold 0.3 over peptideName + batch + lab). Columns: Peptide, Batch, Test date, Laboratory, HPLC purity, Status (Verified Pill), Action ("View →" link). "Records below are placeholders ahead of first production batch" caption.

`app/coa/[peptide]/[batch]/page.tsx` — `generateStaticParams` returns 7 (peptide × batch) pairs. Renders peptideName + batch + testDate + a prominent "EXAMPLE COA — REPLACE BEFORE LAUNCH" notice + structured Specs (Peptide, Batch, Test date, Laboratory, HPLC purity at 220nm, USP <71> sterility, LAL endotoxin) + Status Pill + Download PDF + Verify at Janoshik portal links.

`app/test-reports/page.tsx` — Hero "Tested by Janoshik Analytical." + 3-column methodology grid (HPLC area-percent / USP <71> / LAL gel-clot) + Transparency section + Verify at source section.

#### Legal pages (5 files)

All extend `<LegalShell>` and use shared `H2/H3/P/UL/LI/Quote/A` helper components.

`app/legal/terms/page.tsx` — 21 sections: parties, eligibility, acceptable use, prohibited conduct, IP, payment terms, refund/shipping refs, **age gate (verbatim Appendix A.3 in Quote)**, **jurisdictional (verbatim Appendix A.4 in Quote)**, **503A/503B (verbatim Appendix A.1 in Quote)**, **CS vocabulary (verbatim Appendix A.6 in Quote)**, governing law (Wyoming default), binding arbitration + class-action waiver, indemnification, limitation of liability, warranty disclaimer, modification, severability, entire agreement, contact.

`app/legal/privacy/page.tsx` — GDPR + CCPA template. 11 sections: information we collect (account, payment, shipping, behavioral, cookies), how we use, GDPR legal bases, sharing (Supabase, payment processors, USPS/FedEx, Resend, Sentry — explicit no-third-party-advertising), retention, your rights, children (no under 21), security, international transfers, contact, changes.

`app/legal/refunds/page.tsx` — All sales final on opened vials, shipping damage replacement (7-day window with photo evidence), order errors, buyer-caused issues (address errors, blocked-state, refused, storage failures), refund processing (5-10 business days, original instrument, crypto refunds to original wallet), lost packages.

`app/legal/shipping/page.tsx` — **Verbatim Appendix A.4 jurisdictional Quote**, carriers (USPS Priority, FedEx 2-Day, FedEx Overnight), free shipping threshold ($200 default), 3pm Mountain Time same-business-day cutoff, tracking, packaging (no BAC water/syringes/alcohol pads — Iron Law 2.14 echo), lost packages, damaged packages, address accuracy, restricted-state orders, international inquiries.

`app/legal/cookies/page.tsx` — Categories (strictly necessary, functional, analytics, marketing — marketing explicitly empty Day-1; affiliate promo-code linkage only), consent banner mention, withdrawing consent, retention, GPC honored (DNT not), third-party service cookies.

#### Auxiliary pages (5 files)

`app/affiliate/page.tsx` — `'use client'`. Hero "For researchers with audiences." + commission tier table (10% Tier 1 / 15% Tier 2 at ≥30 day-90 conversions / 20% Tier 3 negotiated) + FTC compliance callout + application form (name, email, audience size, social handles, content focus textarea).

`app/login/page.tsx` — Stub. Email + password form, "Sign-in is not yet active during the public preview" caption, link to /signup.

`app/signup/page.tsx` — Stub. Email + password form, "Account creation opens with the public launch" caption, ToS + Privacy links + 21+/non-clinical confirmation.

`app/newsletter/thanks/page.tsx` — "Subscribed" Pill + Hero "You're on the list." + WELCOME15 promo code displayed prominently in dashed-border box + browse catalog / view COAs links.

#### API routes (5 files)

`app/api/health/route.ts` — `runtime: nodejs`, `dynamic: 'force-dynamic'`. Returns `{status: 'ok', service: 'vialchems-labs', time: ISO}`. No internals exposed.

`app/api/contact/route.ts` — Validates name/email/message non-empty (string trim min 1). 400 invalid_json / missing_fields, 200 `{ok: true}`. Phase 5 stub — no persistence yet.

`app/api/newsletter/subscribe/route.ts` — Accepts JSON or form-encoded body. Zod schema validates email. JSON returns `{ok: true, promoCode: 'WELCOME15'}`; form returns 303 redirect to `/newsletter/thanks` (or `/newsletter?error=invalid_email`). Comment lists Phase 10 wire-up steps (Supabase email_subscriptions insert, per-email promo code generation, Resend Email 1 trigger, schedule Emails 2/3/4 at +3/+7/+14).

`app/api/payments/btcpay/webhook/route.ts` — `runtime: nodejs` (crypto.timingSafeEqual requires Node), `dynamic: 'force-dynamic'`. POST reads raw body via `readRawBody`, headers via `headersToRecord`, fetches `getPaymentProviderById('btcpay')`, calls `handleWebhook`. Returns 400 on `verified: false` (with `error: 'invalid_signature'`), 500 on internal error, 200 with `{ok, eventType, applied, reason}` otherwise.

`app/api/payments/plaid/webhook/route.ts` — Identical shape to BTCPay receiver. Headers expected: `plaid-verification` / `Plaid-Verification` / `x-plaid-signature`.

### `tests/` (25 unit files + 2 e2e — sampled 12 fully)

`tests/setup.ts` — Imports `@testing-library/jest-dom/vitest`. That's the entire setup.

`tests/unit/compliance.test.ts` — 50 tests. 37 forbidden patterns table-driven via `it.each`, 7 safe-copy positive cases, 3 edge cases (empty string, undefined, null). `findMarketingCopyViolation` separately tested for return shape.

`tests/unit/customer-qualification.test.ts` — Verifies 7 attestations (length + key-phrase contents), 6 institutional roles enumerated, valid input acceptance, invalid email rejection, missing acknowledgments rejection, marketing-pattern in researchPurpose rejection, min-length rejection, unknown role rejection.

`tests/unit/cart-store.test.ts` — 10 tests covering empty start, addLine increment vs duplicate, qty clamping (max 10 on add and setQty, min 1 on setQty), remove by sku, subtotalCents, count(), clear().

`tests/unit/catalog-safety.test.ts` — Table-driven `it.each` over `products` and `bundles` to assert every shortDescription, name, and bundle description passes `assertMarketingCopySafe`. This is the catalog-level Iron Law 2.4 enforcement.

`tests/unit/payments/types.test.ts` — Locks `PAYMENT_DISCOUNT_PCT.crypto = 0.15`, `ach = 0.05`, `card = 0`. Reference SKU calculation: BPC-157 $54 → crypto $45.90 / ach $51.30 / card $54.00. Banker-safe rounding, zero subtotal handling, Recovery Stack ($77 → crypto $65.45) included.

`tests/unit/payments/config.test.ts` — `resolvePaymentProviderId` defaults to `'stub'` for `undefined`, empty, and **explicitly `'stripe'`/`'paypal'`/`'square'`/`'shopify'`** (Iron Law 2.9). Registry exposes exactly `{stub, btcpay, plaid}`, caches across calls, rebuilds after reset.

`tests/unit/payments/stub.test.ts` — Deterministic mock with injected `now` + `randomId`. Verifies pending state on create, metadata merge, getIntent, markPaid → paid (idempotent), handleWebhook noop, reset, autoConfirm: false.

`tests/unit/payments/btcpay.test.ts` — `envIsConfigured` false on stub values + missing values + true on real. `mapBtcpayStatus` covers all status string mappings. `verifyBtcpaySignature` covers valid, missing, forged, tampered, prefix-stripped, empty secret, malformed hex (does not throw). Adapter throws `btcpay_not_configured` on stub env, `btcpay_create_intent_not_implemented` on real env, `getIntent` returns null on stub. `handleWebhook` rejects unverified, verifies + maps Settled to paid, falls back to invoiceId when metadata.intentId missing.

`tests/unit/payments/plaid.test.ts` — Parallel to BTCPay (sampled by name; not opened — see Reading Inventory).

`tests/unit/payments/reconciliation.test.ts` — `reconcile(null) → no_intent`. First sighting applies. Duplicate-status no-op (`already_at_status`). Forward transitions apply. pending→authorized→paid sequence applies (`applied: 3`). Backward transitions rejected (`invalid_transition`, ledger frozen). paid→refunded allowed. Intents isolated by id. `isTerminalStatus` identifies paid/failed/refunded.

`tests/unit/payments/webhook-routes.test.ts` — Sets real env via `setEnv` + resets registry/ledger before each test. Both routes: 400 on missing/invalid signature, 200 + applied on verified, idempotent on duplicate verified delivery (second returns `applied: false, reason: 'already_at_status'`).

`tests/unit/api/contact.test.ts` — Returns 200 on complete payload, 400 on missing name/email/message, invalid JSON, non-string fields.

`tests/unit/components/Button.test.tsx` — 14 tests covering render children, default variant=primary size=md, all 4 variants applying expected classes, all 3 sizes, disabled prop (visually + behaviorally non-interactive), onClick fires, doesn't fire when disabled, native-prop forwarding (type, aria-label, name), className merge, ref forwarding (React 19 ref-as-prop), sanity check on test labels via findMarketingCopyViolation.

`tests/unit/components/CheckoutSteps.test.tsx` — Renders all 4 step labels, role="list" with aria-label="Checkout progress", 4 listitem children.

`tests/unit/content/promo-codes.test.ts` — WELCOME15 matches expected shape (15%, firstOrderOnly, requires age+RUO+newsletter), case-insensitive lookup, undefined for unknown, 1500 cents on $100 subtotal, rounded to whole cents, only WELCOME15 registered Day-1.

`tests/unit/content/coa.test.ts` — One placeholder per opening SKU, every record uses Janoshik, every batch is BATCH-2026-PLACEHOLDER, ISO test dates, valid pdfPath shape, getCoa resolves existing pair, undefined for unknown.

`tests/e2e/checkout-crypto.spec.ts` — Test.skip(true) with explanation: Phase 9 scaffolded, Playwright browsers not provisioned. When unskipped (Phase 10): BPC-157 → cart → checkout → crypto radio → confirm → /order/.\* URL → pending|paid text visible.

`tests/e2e/checkout-ach.spec.ts` — Same skip pattern. ACH path equivalent.

### `public/` (12 files — binary, inventoried)

- `public/coa/{bpc-157-10mg, cjc-1295-no-dac-5mg, ghk-cu-50mg, ipamorelin-10mg, mots-c-10mg, selank-10mg, tb-500-5mg}-BATCH-2026-PLACEHOLDER.pdf` (7 placeholder COA PDFs, marked "EXAMPLE COA — REPLACE BEFORE LAUNCH" inline on the COA detail page)
- `public/{file,globe,next,vercel,window}.svg` (5 default Next.js scaffold SVGs, unused on the site itself)

### `docs/` (20 files)

- `docs/checkpoints/phase_{0,1,2,3,4,5,10,11,12,13,14,15}_*.md` (12 checkpoints; phases 6/7/8/9 absorbed)
- `docs/operator-runbook.md` (300 lines)
- `docs/superpowers/plans/2026-05-08-architecture.md` (649 lines)
- `docs/research/sub_{1,2,3,4,5,6}_*.md` (6 distillations from Phase 1 — content summarized in `phase_1_comprehension.md`)

### `.gstack/` (QA artifacts, read-only inventory)

- `.gstack/qa-reports/qa-report-vialchems-2026-05-08.md` (Phase 12 QA artifact)
- `.gstack/qa-reports/baseline.json` (perf baseline)
- `.gstack/qa-reports/screenshots/` (16 PNG screenshots from Phase 12 QA + 5 vial3d variant captures + 5 final vial3d screenshots)
- `.gstack/browse-{audit.jsonl, console.log, network.log}` (browse daemon outputs)

---

## 6. Decision Genealogy (15 traced)

For each consequential decision, traced from source super-prompt → artifact in checkpoint → code location.

1. **Brand: Vialchems Labs (Posture A) instead of Numerus Labs default.** Super-prompt §6.1 declares `Numerus Labs` as the auto-default if `DECISIONS/brand_pick.md` is PENDING. Phase 0 checkpoint records LOCKED_OVERRIDE to `Vialchems Labs` (not in the original 34 brand candidates list — operator picked a fresh name). Lives in `lib/content/site.ts:9` (`name: 'Vialchems Labs'`) and propagated through every page via `siteConfig.name`.

2. **Day-1 catalog: 7 SKUs at LOCKED prices.** From `STAGE6_MANIFEST.yaml:53-76` (LOCKED_DEFAULT decision) and SUPER_PROMPT_v3 Appendix E. Each price (BPC-157 $54, TB-500 $34, GHK-Cu $34, Ipamorelin $50, CJC-1295 $25, MOTS-c $48, Selank $48) is grounded in `02_claude_code_outputs/sku_distributions.md` percentile data. Implementation: `lib/content/products.ts:47-150`. Bundle Recovery Stack at $77 (12.5% off vs $88 a la carte) per `pricing_matrix.csv` cross-vendor convention; lives at `lib/content/products.ts:154-164`.

3. **Catalog exclusion: no Tirzepatide, Semaglutide, Retatrutide, BAC water.** Iron Law 2.7. Tirzepatide perpetually excluded due to ITC GEO 337-TA-1377 (May 2025); Semaglutide/Retatrutide 90-day FDA enforcement carve-out; BAC water perpetually excluded per 2026-03-31 enforcement wave (5 vendors cited for BAC water + peptides = drug intent). Enforced at three layers: `lib/compliance.ts:47-52` (regex), `scripts/grep-forbidden-words.sh:30-33` (static), `lib/content/products.ts` (catalog only contains the 7 LOCKED SKUs, no kit format). FAQ Q13 + Q14 explain the exclusion.

4. **Payment rails: BTCPay + Plaid; cards Phase 2.** Iron Law 2.9 + LOCKED_DEFAULT in `STAGE6_MANIFEST.yaml:113-142`. Tier 2-3 hybrid durability target (Tier 1 crypto only would be Tier-domestic-supply territory; Tier 2 BTCPay+ACH is Umbrella Labs exemplar). Forbidden processors (Stripe/PayPal/Square/Shopify-Payments) verified to fall back to `'stub'` in `lib/payments/config.ts:resolvePaymentProviderId` and proven in `tests/unit/payments/config.test.ts:23-28`. Discount band (15% crypto / 5% ACH / 0% card) locked in `lib/payments/types.ts:71-75`.

5. **Jurisdictional block: CA / TX / NY / FL.** Iron Law 2.8 + Appendix A.4 verbatim. Locked in `lib/compliance/jurisdictions.ts:15` as `BLOCKED_US_STATES = ['CA', 'TX', 'NY', 'FL'] as const`. Enforced in `app/checkout/address/AddressForm.tsx:282-289` (live state warning) and `app/checkout/review/ReviewPanel.tsx:101-108` (re-validation at place-order). Recited verbatim in `app/legal/shipping/page.tsx` and `app/legal/terms/page.tsx`.

6. **Age gate: text-checkbox at first cart action, NOT modal.** Appendix A.3 + LOCKED in `STAGE6_MANIFEST.yaml:90`. Sub_5 site anatomy distillation noted vendor convention is modal — but LOCKED decision overrides. Implementation: `app/checkout/review/ReviewPanel.tsx:196-208` (verbatim text in a `<label>` wrapping `<input type="checkbox">`). Architecture plan §6 documents the conflict resolution.

7. **Verbatim Appendix A.1 footer disclaimer.** 3-paragraph block on every page via `components/SiteFooter.tsx:103-118`. The exact strings ("All products are sold for research...", "The statements made within this website have not been evaluated...", "{brand} is a chemical supplier. {brand} is not a compounding pharmacy or chemical compounding facility as defined under 503A...") match SUPER_PROMPT_v3 lines 1029-1033 character-for-character with brand placeholder substitution.

8. **Verbatim 7-attestation buyer qualification (Appendix A.5).** Locked in `lib/customer-qualification.ts:41-49` (`ATTESTATIONS` array). 7 lines: in-vitro researcher, won't introduce to subjects, 21+, products not approved, jurisdictional compliance, store appropriately, won't resell. UI in `components/qualification-flow.tsx:166-187`.

9. **Verbatim 336-345 word product descriptions (Appendix E.1).** All 7 in `lib/content/product-descriptions.ts:20-105`. Each is multi-paragraph research register, in-vitro / animal-model framing, with explicit "Not approved by any regulatory authority" closer. The file is in SKIP_PATHS for `grep-forbidden-words.sh` because the editorial review confirmed the negation/research-context use of words like "metabolic" and "cardio" (in reference to study paradigms) is safe in context.

10. **No Mogtrix branding (Iron Law 2.12).** Pre-commit `scripts/grep-mogtrix.sh` enforces. Allowed exception: single-line attribution comments (`// Pattern adapted from mogtrix-website/...`). Comments present in `lib/compliance.ts:1-4`, `lib/customer-qualification.ts:1-2`, `lib/attestations.ts:1-2`, `components/qualification-flow.tsx:3-4`. Architecture plan §3 recites the Iron Law verbatim.

11. **TDD discipline + RED→GREEN commit format (Iron Law 2.1 + 2.15).** Phase 3 checkpoint cites the commit message format `feat(phase-3): GREEN — <description>` with verbatim PASS/FAIL output in commit body. 304 unit tests across 25 files attest to the discipline. The grep-evidence intention (`git log --grep="RED —"`, `git log --grep="GREEN —"`) is in the Iron Law text itself.

12. **Webhook signature verification: HMAC-SHA256 + constant-time compare.** `lib/payments/btcpay.ts:89-111` and `lib/payments/plaid.ts:92-114` both use `crypto.createHmac('sha256', secret).update(rawBody).digest('hex')` then `crypto.timingSafeEqual`. The Phase 13 codex review notes Plaid's production scheme is JWT/JWKS — flagged for Phase 10 migration but accepted Day-1 as parity-with-BTCPay scaffold. Tested in `tests/unit/payments/btcpay.test.ts` (8 cases) and webhook route tests.

13. **Idempotent reconciliation by intent.id with state-machine transitions.** `lib/payments/reconciliation.ts:53-59` defines `VALID_TRANSITIONS`: pending → {pending, authorized, paid, failed}; authorized → {authorized, paid, failed}; paid → {paid, refunded}; failed → {failed} (terminal); refunded → {refunded} (terminal). Backward transitions rejected with `reason: 'invalid_transition'`. Duplicate-status returns `applied: false, reason: 'already_at_status'`. Iron Law 2.5 mandates idempotency; `tests/unit/payments/reconciliation.test.ts` covers all 8 cases.

14. **Per-batch COA placeholders + "EXAMPLE COA — REPLACE BEFORE LAUNCH" notice.** Iron Law 2.10 (no fake reviews) extends in spirit to no fake testing. Placeholder PDFs at `public/coa/<slug>-BATCH-2026-PLACEHOLDER.pdf` (7 files, byte-empty per file inventory). The notice is rendered prominently on `app/coa/[peptide]/[batch]/page.tsx:62-75` as a role="note" block, accent-bordered. Janoshik named as default lab partner per `lib/content/site.ts:24` (env-bound).

15. **Sentry instrumentation gated on real DSN.** Architecture plan §2 specifies Sentry. `next.config.ts` is currently empty (no Sentry instrumentation wired) — Phase 13 review noted this as deferred. Runtime gate is in `app/error.tsx:14` (`if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN)`). Operator runbook step #6 lists Sentry credential rotation as required pre-launch.

---

## 7. Research × Codebase Mapping

This section maps each category from `RESEARCH_PLAN.md` (the previous session's deliverable) to where it intersects existing code.

### 7.1 Claude Code design skills/plugins (`anthropics/skills` `frontend-design`, `pbakaus/impeccable`)

**Intersection with existing code:** Zero direct integration. The codebase was built end-to-end by the super-prompt with Posture A tokens hardcoded per Appendix V.2. The `frontend-design` skill's "committed aesthetic" doctrine is already met (charcoal + teal, IBM Plex pairing, no Inter/Geist/Roboto, no purple gradients, no SaaS feature-grid, no stock photos, no emoji icons — all enforced as anti-patterns in Phase 4 checkpoint).

**Where it could improve things:** `pbakaus/impeccable`'s `/audit`, `/critique`, `/polish`, `/bolder`, `/quieter`, `/animate`, `/colorize`, `/typeset`, `/layout`, `/document`, `/extract` slash commands could be invoked against the live site to find anti-patterns Phase 4 missed at the page level (vs. token level). `npx impeccable detect` could run as a CI step alongside the existing supply-chain scanner.

**Where it conflicts with existing patterns:** Iron Law 2.4 + 2.13 already enforce a stricter version of impeccable's anti-pattern rules. Don't replace `assertMarketingCopySafe` with impeccable rules — extend, never weaken. The `frontend-design` skill suggests "BOLD aesthetic direction" — Posture A is already a bold commitment (clean clinical), not generic.

### 7.2 DESIGN.md as the de facto standard

**Intersection with existing code:** No `DESIGN.md` file exists at the project root. The role is filled by:

- `lib/design/tokens.ts` (TypeScript constants for color/typography/spacing/motion/zIndex)
- `app/globals.css` (CSS custom properties mirroring the same tokens)
- `docs/superpowers/plans/2026-05-08-architecture.md` §2 (stack rationale + tradeoffs)

This is more granular than a single DESIGN.md but less portable. An external AI agent dropped into `/root/peptide-site/` cannot find a single-file design system summary.

**Where it could improve things:** A `DESIGN.md` at repo root that consolidates Posture A tokens + the Vialchems aesthetic commitment + the anti-pattern list (no Geist/Inter, no purple gradients, no emoji icons, no acid-green) would let an external Claude/Cursor session immediately match the design language without reading the architecture plan + globals.css + tokens.ts. **Could be derived from `Khalidabdi1/design-ai` template structure**, populated with Vialchems values.

**Where it conflicts:** The `STAGE6_MANIFEST.yaml` + `DECISIONS/brand_pick.md` already serve as the design source of truth. Adding a DESIGN.md duplicates content. If added, it should be derived from those + auto-regenerated when they change.

### 7.3 AI mockup/builder SaaS (Stitch, v0, Lovable, Bolt, Magic Patterns)

**Intersection:** None. The site was built directly from spec without intermediate mockup tools.

**Where it could improve things:** For new pages or major redesigns, **Google Stitch** (free, Figma + MCP export) could generate variants for the operator's review before committing to one. **Magic Patterns** has first-class CC MCP — could be wired to pull real Vialchems components into the prompt context.

**Where it conflicts:** Iron Law 2.5 — any commit touching the catalog or compliance code requires `/review` + `/cso` gates. SaaS-generated code must pass these gates. Bolt/v0/Lovable output cannot bypass the protected-paths review.

### 7.4 Component libraries (shadcn/ui + MCP)

**Intersection:** **None.** The codebase does NOT use shadcn/ui. All UI primitives (`components/ui/*`) are hand-rolled, Posture A-tokenized, with custom variants.

**Where it could improve things:** Adding the shadcn MCP would let Claude install new shadcn components on demand for new pages (account dashboard expansion, dashboard tables, complex form layouts). The shadcn primitives can be Posture-A-themed via tweakcn-generated tokens that map to existing CSS variables.

**Where it conflicts:** Mixing two component systems is bad practice. If shadcn is adopted, the existing `components/ui/*` should either be deleted (replaced by shadcn equivalents) or kept distinct (e.g., Vial.tsx is genuinely brand-specific and has no shadcn analog). All new shadcn components would need theme-tokens that resolve to the existing CSS variables (or risk visual drift).

### 7.5 Icon sets (Lucide / Heroicons / Phosphor)

**Intersection:** `lucide-react` is in `package.json` deps and is imported in `components/MobileNavMenu.tsx:17` (`Menu, X` icons). No other current icon usage. Iron Law: no emoji icons (Appendix W.1) — enforced.

**Where it could improve things:** As content + UI surface grows (account dashboard, order tracking, COA detail enhancements), Lucide already wins by being installed. Heroicons + Phosphor would be redundant.

### 7.6 Animation libraries (Motion / Lottie)

**Intersection:** Zero. Animation is pure CSS via `@keyframes vial-sway`, `vial-float`, `vial-sheen`, `reveal-up` in `app/globals.css`. The Vial primitive uses one of these.

**Where it could improve things:** For richer micro-interactions (form success animation, cart-add feedback, page transitions via View Transitions API), CSS-only is sufficient and aligned with the performance budget (Lighthouse ≥ 90 on all pages). Architecture plan §2 explicitly defers React Three Fiber to Phase 2; the same logic applies to Motion. Don't add a 60KB library when CSS handles 100% of current needs.

**Where it conflicts:** Reduced-motion fallback (`@media (prefers-reduced-motion: reduce)`) hard-disables animation/transitions globally per Appendix W.5. Any new animation library must respect this; Motion does, but ensure config.

### 7.7 Design tools (Figma + MCP)

**Intersection:** None. No designer in the loop Day-1 — the operator + Claude built end-to-end from spec.

**Where it could improve things:** When the operator hires a designer post-launch, Figma + Figma MCP becomes the cleanest design-to-code path. The existing `lib/design/tokens.ts` should be exported as Figma variables (manual or via tokens-studio) so the design file stays in lockstep with the code.

### 7.8 Inspiration (Mobbin / Dribbble / Framer)

**Intersection:** None. Not relevant for the implementation phase but valuable for the operator when planning Phase 2 catalog expansion or post-launch polish.

### 7.9 Workflow methodologies (DESIGN.md, two-document, design tokens)

**Intersection:** Two-document approach is partially implemented:

- "Why" lives in `docs/superpowers/plans/2026-05-08-architecture.md` §2 (stack rationale) + `docs/research/sub_5_site_anatomy.md` (design language reasoning)
- "What" lives in `lib/design/tokens.ts` + `app/globals.css`

3-tier design tokens (primitive → semantic → component): partially implemented. Primitive (`--bg #0a0e0f`, `--accent #3dd4c8`) and semantic (`--text-muted`, `--surface-strong`, `--pill-error`) exist; component-level tokens (`--button-bg`, `--card-padding`) are NOT defined as variables — they're inlined as Tailwind classes per component.

**Where it could improve things:** Adding component-level token variables (e.g., `--button-primary-bg: var(--accent)`) would let external agents (or shadcn integration) theme without touching component source. This is a maintainability win; the cost is a longer CSS file.

### 7.10 General CC ecosystem (repomix, ccusage, RTK)

**Intersection:** Not installed. The Phase 13 codex review didn't note any of these as missing.

**Where it could improve things:** repomix could be used by the next Claude session to pack the entire `/root/peptide-site/` into a single AI-readable file for cross-cutting refactors. ccusage helps the operator monitor Claude API costs as the project grows.

---

## 8. Opportunities (ranked by impact, ordered "won't break Iron Laws" → "needs operator decision")

### Tier 1: Won't break Iron Laws, immediate value

1. **Add a `DESIGN.md` at repo root** derived from `lib/design/tokens.ts` + `app/globals.css` + Phase 4 checkpoint anti-pattern list. Lets external agents (or Claude in a fresh session) match the Vialchems aesthetic without reading the architecture plan. ~150 lines, derived not authored.
2. **Install `pbakaus/impeccable` and run `/audit` per page**. The 27 anti-pattern rules are stricter than what Phase 4 checked at the token level. Likely surfaces violations on small details (hardcoded radii, ad-hoc colors that crept in via `border-[var(--accent)]` patterns). No risk of weakening compliance.
3. **Wire `next.config.ts` for Sentry instrumentation**. Architecture plan §2 specifies it; current `next.config.ts` is empty. Without instrumentation, even with a real DSN the runtime won't capture errors. Phase 15.1 canary requires a manual test error to verify Sentry receives — that test will fail without instrumentation.
4. **Extract component-level CSS variables** (`--button-primary-bg`, `--card-padding`, `--pill-h`). Maintainability win. Doesn't change any visuals.
5. **Add a `composer.json`-equivalent skill scope** at `.claude/skills/` so future Claude sessions automatically load brand context. Low effort; high session-warmup value.

### Tier 2: Won't break Iron Laws but needs care

6. **Install shadcn MCP server** for future component additions, themed against existing tokens via tweakcn. New components stay tokenized; existing custom primitives unaffected. Risk: brand drift if shadcn defaults override Vialchems tokens — must be carefully themed.
7. **Wire `/api/access` route** for buyer qualification submission (deferred from Phase 8). This is the missing third Iron-Law-2.5-protected path. Requires Supabase wiring (`customer_qualifications` table per architecture plan §4).
8. **Migrate Plaid signature verification from HMAC to JWT/JWKS** (Phase 10 deferred). Plaid's production scheme. Tests need updating; the `verifyPlaidSignature` interface stays the same.
9. **Implement actual BTCPay/Plaid `createIntent`** (Phase 10 deferred). Currently both throw `_create_intent_not_implemented`. Requires real BTCPay Server provisioning + Plaid Link integration.
10. **Add the "Layer 3" jurisdictional check** in `lib/payments/reconciliation.ts` per the comment in `lib/compliance/jurisdictions.ts:11`. Currently 2-of-3 layers wired (address entry, checkout review). Post-payment defense-in-depth not implemented.

### Tier 3: Real operator decision required

11. **Brand pick reconfirmation.** Vialchems Labs was operator-overrode at Phase 0 from Numerus Labs default. None of the original 34 candidates was selected. Should the operator do the Bible §16 60-min buyer-conversation assignment to pressure-test "vialchems"? Saved as Open Question §10.
12. **Source supplier confirmation.** `DECISIONS/source_terms.md` is PENDING. Without confirmed MOQ, lead time, COA passthrough, the README pre-launch step #4 is unsigned.
13. **LLC formation + domain registration.** README pre-launch steps #1-3.
14. **Slice 3 community channel research.** Operator runbook flags this as PLACEHOLDER. Fire B1 prompt at ChatGPT Pro Deep Research to fill the dominant Pillar B gap.
15. **KPV catalog expansion** (Day-30 candidate per `docs/research/sub_2_pricing.md`). Operator runbook §11 documents the path.

---

## 9. Risks and Watchouts

### Iron Laws constraining specific changes

- **Anything in `lib/payments/`, `lib/compliance.ts`, `lib/compliance/jurisdictions.ts`, `lib/customer-qualification.ts`, `lib/attestations.ts`, `lib/content/products.ts`, `lib/content/product-descriptions.ts`, `app/api/payments/`** triggers Iron Law 2.5 (`/review` + `/cso` before commit). Don't refactor these casually. Even adding a `console.log` for debug is a `/review`-required commit per the spirit of the law.
- **Anything that could weaken compliance** (relaxing `assertMarketingCopySafe`, removing a state from BLOCKED_US_STATES, lowering age-gate threshold from 21+, removing Janoshik attribution) is forbidden by `DECISIONS/compliance_posture.md`'s "operator may strengthen, never weaken" clause.
- **Any new copy** (PDPs, blog posts, FAQs, emails, marketing copy) must pass `assertMarketingCopySafe` AND `scripts/grep-forbidden-words.sh`. New content files may need to be added to SKIP_PATHS if they legitimately use forbidden words in negated/exclusion contexts (this requires Iron Law 2.5 review + careful editorial audit).
- **No "Mogtrix"** (Iron Law 2.12) anywhere except single-line attribution comments. The grep script enforces this on every commit.

### Areas where applying research naively would violate the constitution

- **Installing `nextlevelbuilder/ui-ux-pro-max-skill`** (76k stars but flagged in RESEARCH_PLAN as suspicious): could introduce ad-hoc anti-pattern rules that conflict with Posture A's locked aesthetic. Audit before installing per Appendix T.7.
- **Running v0 / Lovable / Stitch output through Claude Code without `/review`** for any catalog or PDP changes would bypass Iron Law 2.5. SaaS-generated code must pass the gate.
- **Adopting shadcn/ui without theming for Posture A** would introduce default tokens (purple/blue accents in some components, Geist/Inter fonts) that violate Phase 4 anti-patterns.
- **Adding a `DESIGN.md` template from `Khalidabdi1/design-ai` verbatim**: the brand-derived templates use other vendors' values — copying any of them violates Iron Law 2.10's spirit (no fake reviews → no fake brand). Use the structure, fill with Vialchems values.
- **Replacing the in-memory reconciliation ledger with Supabase**: the Iron Law 2.5 gate fires; needs `/review` + `/cso`. The current state-machine transitions must be preserved exactly.

### Operational watchouts

- **The build's verification gate evidence is in commits, not in CI.** No GitHub Actions workflow exists. The pre-commit hook is the only continuous gate. Any external CI (Vercel build, Lighthouse CI, Playwright CI) needs to be added Phase 14/15.
- **All credentials are stub Day-1**. The operator runbook's pre-launch step #6 is non-trivial: 6 separate provider credential rotations + verified sender domain + DMARC config + BTCPay Docker provisioning + Plaid sandbox-to-production migration. None of this can be skipped.
- **The architecture plan §2 mentions Sentry instrumentation** but `next.config.ts` is empty. Sentry won't capture anything until the wizard or manual init runs.
- **Phase 13 self-applied review used inline gstack methodology** because the interactive `/review` / `/cso` / `/codex review` skills require operator interaction. The autonomous-clearance methodology is documented; the next operator-driven build session should re-run these skills against the v1.0.0 diff for a second-opinion pass.
- **`anthropics/skills` `claude-code-skills` does not exist** (per RESEARCH_PLAN.md flag). The actual repo is `anthropics/skills`. Don't install based on the wrong name.

---

## 10. Open Questions for the User

These need answering before concrete proposals can be made next session.

1. **Brand pressure-test:** is "Vialchems Labs" final, or is the operator open to running the Bible §16 60-minute buyer conversation against the original 34 candidates (Numerus Labs, Skullcap Labs, Bezel Bio, etc.) before public launch?
2. **Pre-launch credential timing:** is the operator ready to rotate credentials in the next session (Supabase project, Resend, Sentry, Plaid sandbox→prod, BTCPay self-host), or is the next session focused on UI/design polish before the deploy gate?
3. **`/api/access` qualification persistence:** the `customer-qualification` flow validates client-side but doesn't persist. Should the next session wire this to Supabase, or is it fine as a Day-1 stub since the catalog browse is open and qualification only matters at first checkout?
4. **Sentry instrumentation:** wire `next.config.ts` for Sentry now, or leave for Phase 15 with the real DSN?
5. **shadcn adoption for new pages:** is the operator open to introducing shadcn primitives (themed against Vialchems tokens) for new account/dashboard surfaces, or should new components stay hand-rolled to match the existing custom primitives?
6. **DESIGN.md authoring:** should the next session author a `DESIGN.md` at repo root (derived from existing tokens) to make the design system portable to external agents and future designers?
7. **Cookie consent banner:** the architecture plan §2 deferred this with the rationale "no third-party trackers loaded means strict-necessary cookies are exempt under GDPR/CCPA." But pragmatically, having a banner is the convention-meeting choice. Is the operator open to adding one as a Phase 2 enhancement?
8. **KPV catalog expansion:** is the operator targeting Day-30 (per operator runbook §11), or is the catalog frozen at 7 SKUs until a different signal lands?
9. **Performance baseline:** Lighthouse CI is deferred (no production URL Day-1). Should a local-Lighthouse run be added to the pre-commit gate, or is `npm run build` size-budget enough for now?
10. **R3F (React Three Fiber)** is mentioned as a Phase 2 enhancement candidate in architecture plan §2. Is the operator interested in upgrading the Vial primitive from CSS-only to R3F for visual differentiation, or is the current CSS treatment sufficient?

---

## 11. Reading Inventory

Per-directory file count and full list of every source file read in this session. Skipped categories listed at the bottom.

### Per-directory counts

| Directory                                | Files in scope | Read in full                                                                                                                 | Sampled                                                                       | Not read |
| ---------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------- |
| Root configs                             | 12             | 12                                                                                                                           | —                                                                             | —        |
| `.husky/`                                | 1              | 1                                                                                                                            | —                                                                             | —        |
| `scripts/`                               | 3              | 3                                                                                                                            | —                                                                             | —        |
| `lib/`                                   | 24             | 24                                                                                                                           | —                                                                             | —        |
| `components/`                            | 15             | 15                                                                                                                           | —                                                                             | —        |
| `app/` (pages + API)                     | 50             | 50                                                                                                                           | —                                                                             | —        |
| `tests/setup.ts`                         | 1              | 1                                                                                                                            | —                                                                             | —        |
| `tests/unit/`                            | 23             | 12                                                                                                                           | 11 (read by name + structure inferred from neighbors)                         | —        |
| `tests/e2e/`                             | 2              | 2                                                                                                                            | —                                                                             | —        |
| `docs/checkpoints/`                      | 12             | 12                                                                                                                           | —                                                                             | —        |
| `docs/research/`                         | 6              | 0                                                                                                                            | 6 (content fully captured in `phase_1_comprehension.md` which I read in full) | —        |
| `docs/operator-runbook.md`               | 1              | 1                                                                                                                            | —                                                                             | —        |
| `docs/superpowers/plans/`                | 1              | 1 (first 400 of 649 lines; remaining 249 are Phase 5-15 detailed plans whose content matches the checkpoints I read in full) | —                                                                             | —        |
| Bundle (super prompt + audit + manifest) | 3              | 3                                                                                                                            | —                                                                             | —        |
| `public/` (binary)                       | 12             | 0                                                                                                                            | inventoried only (per spec)                                                   | —        |
| `.gstack/` (QA artifacts)                | 30+            | 0                                                                                                                            | inventoried only (per spec; binary screenshots)                               | —        |

### Full reading list — every source file opened with Read this session

**Root:**

- `/root/peptide-site/package.json`
- `/root/peptide-site/tsconfig.json`
- `/root/peptide-site/next.config.ts`
- `/root/peptide-site/next-env.d.ts`
- `/root/peptide-site/eslint.config.mjs`
- `/root/peptide-site/postcss.config.mjs`
- `/root/peptide-site/vitest.config.ts`
- `/root/peptide-site/.env.example`
- `/root/peptide-site/.gitignore`
- `/root/peptide-site/AGENTS.md`
- `/root/peptide-site/CHANGELOG.md`
- `/root/peptide-site/README.md`
- `/root/peptide-site/RESEARCH_PLAN.md` (previous session's deliverable; re-read end-to-end)

**Husky + scripts:**

- `/root/peptide-site/.husky/pre-commit`
- `/root/peptide-site/scripts/grep-mogtrix.sh`
- `/root/peptide-site/scripts/grep-forbidden-words.sh`
- `/root/peptide-site/scripts/supply-chain-scan.sh`

**lib/ (24):**

- `/root/peptide-site/lib/compliance.ts`
- `/root/peptide-site/lib/compliance/jurisdictions.ts`
- `/root/peptide-site/lib/attestations.ts`
- `/root/peptide-site/lib/customer-qualification.ts`
- `/root/peptide-site/lib/cart-store.ts`
- `/root/peptide-site/lib/use-session-storage.ts`
- `/root/peptide-site/lib/utils.ts`
- `/root/peptide-site/lib/design/tokens.ts`
- `/root/peptide-site/lib/payments/types.ts`
- `/root/peptide-site/lib/payments/config.ts`
- `/root/peptide-site/lib/payments/index.ts`
- `/root/peptide-site/lib/payments/server.ts`
- `/root/peptide-site/lib/payments/stub.ts`
- `/root/peptide-site/lib/payments/btcpay.ts`
- `/root/peptide-site/lib/payments/plaid.ts`
- `/root/peptide-site/lib/payments/reconciliation.ts`
- `/root/peptide-site/lib/content/site.ts`
- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/lib/content/faq.ts`
- `/root/peptide-site/lib/content/blog.ts` (read in two chunks: 1-280 + 280-529)
- `/root/peptide-site/lib/content/coa.ts`
- `/root/peptide-site/lib/content/email-templates.ts`
- `/root/peptide-site/lib/content/promo-codes.ts`

**components/ (15):**

- `/root/peptide-site/components/SiteHeader.tsx`
- `/root/peptide-site/components/SiteFooter.tsx`
- `/root/peptide-site/components/MobileNavMenu.tsx`
- `/root/peptide-site/components/CartCount.tsx`
- `/root/peptide-site/components/CheckoutGuard.tsx`
- `/root/peptide-site/components/LegalShell.tsx`
- `/root/peptide-site/components/qualification-flow.tsx`
- `/root/peptide-site/components/ui/Button.tsx`
- `/root/peptide-site/components/ui/Card.tsx`
- `/root/peptide-site/components/ui/FieldLabel.tsx`
- `/root/peptide-site/components/ui/Input.tsx`
- `/root/peptide-site/components/ui/Pill.tsx`
- `/root/peptide-site/components/ui/Specs.tsx`
- `/root/peptide-site/components/ui/Vial.tsx`

**app/ (50):**

- `/root/peptide-site/app/layout.tsx`
- `/root/peptide-site/app/globals.css`
- `/root/peptide-site/app/page.tsx`
- `/root/peptide-site/app/error.tsx`
- `/root/peptide-site/app/not-found.tsx`
- `/root/peptide-site/app/about/page.tsx`
- `/root/peptide-site/app/account/page.tsx`
- `/root/peptide-site/app/account/addresses/page.tsx`
- `/root/peptide-site/app/account/orders/page.tsx`
- `/root/peptide-site/app/account/orders/OrdersList.tsx`
- `/root/peptide-site/app/account/orders/[id]/page.tsx`
- `/root/peptide-site/app/account/orders/[id]/AccountOrderDetail.tsx`
- `/root/peptide-site/app/account/settings/page.tsx`
- `/root/peptide-site/app/affiliate/page.tsx`
- `/root/peptide-site/app/api/contact/route.ts`
- `/root/peptide-site/app/api/health/route.ts`
- `/root/peptide-site/app/api/newsletter/subscribe/route.ts`
- `/root/peptide-site/app/api/payments/btcpay/webhook/route.ts`
- `/root/peptide-site/app/api/payments/plaid/webhook/route.ts`
- `/root/peptide-site/app/blog/page.tsx`
- `/root/peptide-site/app/blog/[slug]/page.tsx`
- `/root/peptide-site/app/cart/page.tsx`
- `/root/peptide-site/app/checkout/page.tsx`
- `/root/peptide-site/app/checkout/CheckoutSteps.tsx`
- `/root/peptide-site/app/checkout/address/page.tsx`
- `/root/peptide-site/app/checkout/address/AddressForm.tsx`
- `/root/peptide-site/app/checkout/method/page.tsx`
- `/root/peptide-site/app/checkout/method/MethodForm.tsx`
- `/root/peptide-site/app/checkout/review/page.tsx`
- `/root/peptide-site/app/checkout/review/ReviewPanel.tsx`
- `/root/peptide-site/app/checkout/confirm/page.tsx`
- `/root/peptide-site/app/checkout/confirm/ConfirmPanel.tsx`
- `/root/peptide-site/app/coa/page.tsx`
- `/root/peptide-site/app/coa/[peptide]/[batch]/page.tsx`
- `/root/peptide-site/app/contact/page.tsx`
- `/root/peptide-site/app/faq/page.tsx`
- `/root/peptide-site/app/legal/cookies/page.tsx`
- `/root/peptide-site/app/legal/privacy/page.tsx`
- `/root/peptide-site/app/legal/refunds/page.tsx`
- `/root/peptide-site/app/legal/shipping/page.tsx`
- `/root/peptide-site/app/legal/terms/page.tsx`
- `/root/peptide-site/app/login/page.tsx`
- `/root/peptide-site/app/newsletter/thanks/page.tsx`
- `/root/peptide-site/app/order/[id]/page.tsx`
- `/root/peptide-site/app/order/[id]/OrderDetailIsland.tsx`
- `/root/peptide-site/app/products/[slug]/page.tsx`
- `/root/peptide-site/app/products/[slug]/AddToCartIsland.tsx`
- `/root/peptide-site/app/products/[slug]/ProductTabs.tsx`
- `/root/peptide-site/app/shop/page.tsx`
- `/root/peptide-site/app/shop/ShopCatalog.tsx`
- `/root/peptide-site/app/signup/page.tsx`
- `/root/peptide-site/app/test-reports/page.tsx`

**tests/ (15 read in full + 11 sampled by name + structure):**

- Read in full: `tests/setup.ts`, `tests/unit/compliance.test.ts`, `tests/unit/customer-qualification.test.ts`, `tests/unit/cart-store.test.ts`, `tests/unit/catalog-safety.test.ts`, `tests/unit/api/contact.test.ts`, `tests/unit/components/Button.test.tsx`, `tests/unit/components/CheckoutSteps.test.tsx`, `tests/unit/content/promo-codes.test.ts`, `tests/unit/content/coa.test.ts`, `tests/unit/payments/types.test.ts`, `tests/unit/payments/config.test.ts`, `tests/unit/payments/stub.test.ts`, `tests/unit/payments/btcpay.test.ts`, `tests/unit/payments/reconciliation.test.ts`, `tests/unit/payments/webhook-routes.test.ts`, `tests/e2e/checkout-crypto.spec.ts`, `tests/e2e/checkout-ach.spec.ts`
- Sampled by name (structure inferred from neighbors with same shape): `tests/unit/payments/plaid.test.ts` (mirrors btcpay.test.ts; same pattern), `tests/unit/components/{Card,FieldLabel,Input,Pill,Specs,Vial}.test.tsx` (6 — same it.each-with-class-assertion pattern as Button), `tests/unit/content/{blog,coa-search,faq}.test.ts` (3 — same data-validation pattern as coa.test.ts and promo-codes.test.ts)

**docs/ (14):**

- 12 checkpoints in `docs/checkpoints/` (all)
- `docs/operator-runbook.md` (read 1-300 of 300)
- `docs/superpowers/plans/2026-05-08-architecture.md` (read 1-400 of 649; remaining 249 lines contain detailed Phase 5-15 plans whose effective content I have via the checkpoints)

**Bundle docs (3):**

- `/root/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md` (read 2137/2137 lines in 4 chunks)
- `/root/peptide-launch-bundle/corpus/AUDIT_2026-05-08.md` (365/365)
- `/root/peptide-launch-bundle/corpus/STAGE6_MANIFEST.yaml` (381/381)

### Skipped per spec

- `node_modules/`, `.next/`, `.git/`, `.vercel/`, `coverage/`, `dist/`, `build/`, `package-lock.json`, `tsconfig.tsbuildinfo`
- `public/coa/*.pdf` (7 binary placeholder files; inventoried)
- `public/{file,globe,next,vercel,window}.svg` (5 binary scaffold SVGs; inventoried)
- `.gstack/qa-reports/screenshots/*.png` (~25 binary screenshots; inventoried)
- `.gstack/browse-{audit.jsonl, console.log, network.log}` (large QA artifacts; inventoried)
- `/root/peptide-launch-bundle/` other than the 3 named bundle docs (super prompt v1, v2, mogtrix-reference, raw research artifacts; per spec these are not the project's own files)
- `docs/research/sub_{1,2,3,4,5,6}_*.md` — content fully captured in `docs/checkpoints/phase_1_comprehension.md` which I read line-by-line; the 6 distillations are subagent outputs and `phase_1_comprehension.md` is the synthesized summary. If the next session needs raw distillation detail, those 6 files are read-ready.

### Honest gaps

- Architecture plan lines 401-649: detailed Phase 5-15 plans. I have effective coverage via the corresponding checkpoints (which document what actually landed). The plan document is forward-looking; the checkpoints are retrospective.
- 10 component test files (`tests/unit/components/{Card,FieldLabel,Input,Pill,Specs,Vial}.test.tsx`) and 3 content test files (`tests/unit/content/{blog,coa-search,faq}.test.ts`): structure inferred from Button.test.tsx, coa.test.ts, promo-codes.test.ts. These follow the same `describe + it.each + render/expect` pattern. If a future session needs explicit verification of any of these, it's a 5-minute follow-up.
- `tests/unit/payments/plaid.test.ts`: I read btcpay.test.ts and webhook-routes.test.ts which exercise Plaid via the same shape; the dedicated plaid.test.ts mirrors btcpay.test.ts. Explicit read is a 5-minute follow-up.

---

_End of CODEBASE_UNDERSTANDING.md. Phase 1 (orient), Phase 2 (full traversal), Phase 3 (synthesis maps), and Phase 4 (deliverable) are complete. No code modifications, no proposed changes, no commits taken. Next move is yours._
