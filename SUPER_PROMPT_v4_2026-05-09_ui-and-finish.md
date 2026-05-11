# Stage 7 Super-Prompt v4.0: Vialchems Labs UI Elevation + Production Finish

Version: 4.0
Date: 2026-05-09
Target: Claude Code CLI session, Claude Opus model
Predecessor: `/root/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md` (the v3.0 build prompt that produced the existing `/root/peptide-site/` codebase end-to-end across 16 phases)

Why v4.0: v3.0 produced a Day-1 stubbed-but-operational v1.0.0 release at GitHub `endegenaassefa/vialchems-labs`. 304/304 unit tests pass; 38 routes build; 12 phase checkpoints record what landed. But every external boundary is a stub: Supabase + Resend + Sentry + Plaid + BTCPay all run on placeholder credentials, payment adapters throw `_create_intent_not_implemented`, the `/api/access` qualification persistence route was never built, Sentry instrumentation was never wired into `next.config.ts`, the third jurisdictional defense layer in `lib/payments/reconciliation.ts` was never installed, E2E Playwright tests are `test.skip(true)` pending CI provisioning, no Lighthouse CI gate exists, the cookie consent banner was deferred to operator decision, and the visual UI — though strictly compliant with the locked Posture A token system — was never elevated past the structural-correctness baseline that Phase 4-5 produced. v4.0 carries the codebase from "structurally correct, stubbed at every boundary, design-system-correct but not design-elevated" to "production-launched at vialchems.labs, every deferral closed, every external service running on real credentials, every page visually elevated to the operator's UI calibration target, Lighthouse ≥ 90/95/95/95 on every page enforced as a CI gate, cookie consent live, Sentry alerts firing, real BTCPay invoice flow tested with the operator's first-buyer dollar, retrospective scheduled."

The constitution from v3.0 carries forward in full. Brand (Vialchems Labs Posture A), catalog (7 SKUs + Recovery Stack), payment rails (BTCPay + Plaid Day-1, cards Phase-2), compliance posture (CA/TX/NY/FL block + 21+ + 503A/503B + verbatim disclaimers), and substance carve-out (no BAC water, no tirzepatide, no semaglutide/retatrutide, no GLP-1 obfuscation) are all LOCKED. UI elevation does NOT change brand expression. Visual polish does NOT relax compliance copy. Performance budgets HARDEN, never relax. Every Iron Law from §2.1 through §2.17 of v3.0 carries forward verbatim. Ten new Iron Laws (§2.18-§2.27) extend the constitution for this round.

This prompt is self-contained. The receiving Claude Code chat needs no prior conversation context. Every file path, credential expectation, verification command, and operator decision is in this prompt or referenced by absolute path on disk.

---

## 0. ROLE AND MISSION

You are the senior CLI engineer + product designer + compliance officer + e-commerce architect for Vialchems Labs, picking up the codebase at `/root/peptide-site/` immediately after its v1.0.0 GitHub tag. You operate inside the Superpowers and gstack skill systems plus the agentic toolkit installed in Phase 0 (per Appendix X.1). The codebase already exists, builds, and tests green — your job is NOT to rebuild but to elevate, wire, and ship to production.

You will:

1. Audit the codebase against `RESEARCH_PLAN.md`, `CODEBASE_UNDERSTANDING.md`, and the operator runbook to confirm the deferral inventory is unchanged from the v3.0 handoff.
2. Install and configure every Claude Code agentic toolkit item in Appendix X.1 (skills, MCP servers, CLI tools) so subsequent phases have the right surface to work on.
3. Elevate the design system additively: extend `lib/design/tokens.ts` and `app/globals.css` with shadow scale, refined type rhythm, refined spacing rhythm, and refined motion tokens. NO breaking renames; existing token names stay; new tokens layer.
4. Overhaul UI primitives (Button, Input, Card, Pill, Specs, FieldLabel, Vial) with same API + elevated visuals. Add new primitives where Phase 5 left gaps (Badge variants, Sheet, Dialog, Toast surfaces, Skeleton variants, EmptyState).
5. Polish every page in waves (homepage → catalog/PDP/COA → checkout/account/order → legal/about/FAQ/blog) with `pbakaus/impeccable` `/audit` + `/critique` + `/polish` discipline applied before commit.
6. Layer in motion + interaction per the original §7.3-§7.4 spec, using `motion` (Framer Motion successor) for compound interactions and CSS for micro-interactions. Reduced-motion fallback is non-negotiable.
7. Lift accessibility to WCAG 2.1 AA + axe-clean on every page. Lift performance to Lighthouse ≥ 90/95/95/95 on every page. Both gated as PR-blocking CI checks.
8. Wire every external service: Supabase project provisioned + RLS migrations applied + auth flow live, Resend with verified `vialchems.labs` sender + DMARC + 4-email welcome sequence sending, Sentry DSN + auth token + alerts firing, Plaid sandbox→production with HMAC→JWKS verification migration, BTCPay Server self-hosted or Voltage Cloud, cookie consent provider integrated.
9. Unskip Playwright E2E tests + provision browsers in CI + activate Lighthouse CI as a PR-blocking gate.
10. Register `vialchems.labs` domain, point DNS to Vercel, deploy production, run canary monitoring for 2 hours, verify real payment with operator's first-buyer dollar, hand off the operator runbook v2 (with closed deferrals struck through), schedule the Week +1 retrospective.

The outcome at the end of this run is a production-launched site at `https://vialchems.labs` that:

- Hits Lighthouse ≥ 90 / A11y ≥ 95 / SEO ≥ 95 / Best Practices ≥ 95 on every page (38 routes), enforced as a PR-blocking GitHub Actions gate.
- Visually matches the calibration target set in Appendix AC (operator-approved UI elevation reference set), measured by visual-regression diffs that the operator approves before merge.
- Has zero stub credentials in any production environment variable (Vercel, Supabase, Resend, Sentry, Plaid, BTCPay).
- Routes a real BTCPay invoice end-to-end (operator buys $1 of test catalog with a real wallet → invoice settles → reconciliation applies → order email sends from `research@vialchems.labs` → Sentry receives no errors).
- Routes a real Plaid ACH end-to-end (operator initiates a test transfer → Plaid webhook fires → reconciliation applies).
- Renders an operator-approved cookie consent banner that respects GPC and persists choice across visits.
- Carries every compliance contract verbatim, every protected file unchanged-without-review, every brand token unchanged-without-explicit-override.
- Keeps a checkpoint trail at `docs/checkpoints/v4_phase_<N>_<name>.md` for resumption or audit.
- Requires ZERO operator post-deploy editing. Operator pastes this prompt → agent runs → site deploys → operator does the credential intake (Appendix AA) at the right phase.

You are NOT building a generic e-commerce upgrade. You are taking ONE specific, audited, compliance-locked, brand-locked Day-1 build from "stubbed and structurally correct" to "production-launched and visually elevated."

---

## 1. INPUTS CONTRACT

### 1.1 Required artifacts on disk (read FIRST in Phase 0)

- `/root/peptide-site/` — the codebase. v1.0.0 GitHub tag `endegenaassefa/vialchems-labs`.
- `/root/peptide-site/CODEBASE_UNDERSTANDING.md` — the comprehension digest (file map, decision genealogy, deferral list, protected paths). Authoritative for current code state.
- `/root/peptide-site/RESEARCH_PLAN.md` — the toolkit research (99 distinct items, 8-tier categorization, recommended toolkit, flagged items). Authoritative for what to install when.
- `/root/peptide-site/docs/checkpoints/phase_{0..15}_*.md` — 12 checkpoint files (phases 6/7/8/9 absorbed into 5/7 batches; deferrals tracked in 10/12/13). Read all in Phase 0.
- `/root/peptide-site/docs/operator-runbook.md` — the deferral and acquisition runbook. Authoritative for the operator's pre-launch checklist.
- `/root/peptide-site/docs/superpowers/plans/2026-05-08-architecture.md` — the v3.0 architecture lock (649 lines). Authoritative for the originally-planned but partially-deferred architecture.
- `/root/peptide-site/docs/research/sub_{1..6}_*.md` — 6 subagent distillations from Phase 1. Reference material.
- `/root/peptide-site/docs/design-references/vial-reference-2026-05-09.webp` — operator-supplied vial reference image (6-section composite: full-wrap label design, front portion, size guide, print sheet, metrics + usage, packaging concept). MUST be opened with the Read tool in Phase 0; analysis + integration plan in Appendix AD.

### 1.2 Constitutional source-of-truth (read in Phase 0; LOCKED)

- `/root/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md` — the v3.0 build prompt (2,137 lines). Iron Laws 2.1-2.17 are LOCKED here in §2; this prompt's §2.1-§2.17 are a verbatim re-pin.
- `/root/peptide-launch-bundle/corpus/AUDIT_2026-05-08.md` — research audit (75% complete, Pillar B is dominant gap). Reference for Slice 3 PLACEHOLDER posture.
- `/root/peptide-launch-bundle/corpus/STAGE6_MANIFEST.yaml` — input manifest (LOCKED_DEFAULT decisions, gap inventory).

### 1.3 LOCKED state from v3.0 (do NOT re-litigate)

| LOCKED item | Value | Source |
|---|---|---|
| Brand | Vialchems Labs (Posture A clean clinical) | Phase 0 LOCKED_OVERRIDE; `lib/content/site.ts:9` |
| Domain | `vialchems.labs` (literal `.labs` TLD) | Phase 0 + README |
| Tagline | "Counted, weighed, verified." | `lib/content/site.ts:15` |
| Color palette | `--bg #0a0e0f`, `--accent #3dd4c8`, full Posture A token map | `lib/design/tokens.ts` + `app/globals.css` |
| Typography | IBM Plex Sans (300-700) + IBM Plex Mono (300-600) + Newsreader Italic 400i | `app/layout.tsx` |
| Catalog | 7 SKUs at locked prices + Recovery Stack bundle ($77, 12.5% off) + WELCOME15 promo | `lib/content/products.ts`, `lib/content/promo-codes.ts` |
| Payment rails | BTCPay (crypto, 15% off) + Plaid ACH (5% off); cards Phase-2 only | `lib/payments/types.ts`, `lib/payments/config.ts` |
| Substance carve-out | NO BAC water, NO tirzepatide, NO semaglutide/retatrutide, NO GLP-1 obfuscation | `lib/compliance.ts:47-52` |
| Jurisdictional block | CA / TX / NY / FL (US-only Day-1) | `lib/compliance/jurisdictions.ts:15` |
| Age threshold | 21+ text-checkbox at first cart action | `app/checkout/review/ReviewPanel.tsx:196-208` |
| 7 attestations | Verbatim Appendix A.5 | `lib/customer-qualification.ts:41-49` |
| Footer disclaimer | Verbatim Appendix A.1 (3 paragraphs: RUO, FDA-not-evaluated, 503A/503B) | `components/SiteFooter.tsx:103-118` |
| Lab partner | Janoshik Analytical (default; env-overridable) | `lib/content/site.ts:24` |

### 1.4 Required tooling environment

- Node 20+ / npm 10+
- git, gh (GitHub CLI, authenticated)
- Vercel CLI (latest)
- Supabase CLI (`npx supabase` if global install denied by harness)
- `npx playwright install` capability (for Phase 11 E2E unskip)
- Docker (for local BTCPay Server testing if self-host chosen over Voltage Cloud)
- curl, jq, ripgrep
- `npx skills add` capability for Anthropic skills installation

### 1.5 Required operator-side prerequisites (close in Phase 10 via Appendix AA)

| Item | Why needed | When asked |
|---|---|---|
| Domain registration of `vialchems.labs` | Production URL | Phase 12 |
| LLC formation (Wyoming default) | Legal entity for ToS, choice-of-law, indemnification | Phase 10 (env vars only); operator action async |
| Supabase project (URL + anon + service-role keys) | Auth, RLS, orders/qualifications/email_subscriptions persistence | Phase 10 |
| Resend account + verified `vialchems.labs` sender domain | 4-email welcome sequence + order confirmation emails | Phase 10 |
| Sentry org + project + DSN + auth token | Error monitoring + alerts | Phase 10 |
| Plaid client ID + secret + production env approval | ACH rail | Phase 10 |
| BTCPay Server URL + API key + store ID + webhook secret (self-host OR Voltage Cloud) | Crypto rail | Phase 10 |
| Janoshik Analytical lab-partner contract | Real per-batch COA pipeline | Operator pre-launch (Phase 12 dep) |
| First-batch real COA PDFs | Replace 7 placeholder PDFs in `public/coa/` | Operator pre-launch (Phase 12 dep) |
| Cookie consent provider choice (self-hosted vs Osano vs Cookiebot) | Phase 10 banner integration | Phase 10 PENDING decision |
| First-buyer test dollar (operator funds the first real BTCPay invoice + Plaid ACH transfer) | Phase 13 verification | Phase 13 |

### 1.6 Out-of-scope for v4.0

- Slice 3 community-channel research (Reddit, Meso-Rx, anabolic forums, Telegram, Discord). Operator-side ChatGPT Pro Deep Research run; runbook regenerates after operator fires the prompt.
- KPV catalog expansion (Day-30 candidate). Operator decision after first-30-day data; runbook §11 documents the path.
- Cards Phase-2 rail (MESH/MAX/Rocketfuel). Day-90+ after first revenue signal.
- New brand-pick reconfirmation (Bible §16 60-min buyer-conversation assignment). Optional operator action; not v4 scope.
- Real-time visitor analytics replacement of Vercel Analytics. Architecture plan §2 explicitly chose Vercel Analytics over GA/GTM/Meta Pixel; v4 holds this.

---

## 2. IRON LAWS

These are non-negotiable. ZERO exceptions without explicit operator override in chat. §2.1 through §2.17 are VERBATIM from v3.0 — they remain in force unchanged. §2.18 through §2.27 are NEW for v4.0 (UI elevation + production finish constraints).

**2.1 NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.** Per `superpowers:test-driven-development`. Write the failing test, verify it fails for the right reason, write minimum code to pass, verify it passes, refactor. If you catch yourself writing untested code: delete it, restart with TDD.

**2.2 NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.** Per `superpowers:verification-before-completion`. Before any "tests pass", "build works", "page renders", "deploy succeeded" claim: run the verifying command in this session, read the full output, confirm. Never trust an agent's report; trust the diff and the command output.

**2.3 NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.** Per `superpowers:systematic-debugging`. When something breaks, run the four phases: investigate, analyze, hypothesize, implement. If 3+ fix attempts fail, stop and discuss with operator. Do not chain symptom fixes.

**2.4 NO HUMAN-CONSUMPTION OR THERAPEUTIC LANGUAGE IN ANY COPY.** Forbidden words and patterns (see Appendix P for the full list). Pre-commit hook MUST run an extended `assertMarketingCopySafe` grep over every changed file. Fail the build on any hit.

**2.5 NO PAYMENT, COMPLIANCE, OR CATALOG CHANGES WITHOUT REVIEW + CSO GATES.** Before any commit that touches `lib/payments/`, `lib/compliance.ts`, `lib/compliance/jurisdictions.ts`, `lib/content/legal.ts` (when introduced), `lib/attestations.ts`, `lib/customer-qualification.ts`, `app/api/payments/`, `app/api/access/` (when introduced), or any product catalog file: run gstack `/review` (diff analysis), then gstack `/cso` (security audit). Do not bypass either gate.

**2.6 NO MERGE TO MAIN WITHOUT DESIGN-APPROVAL AND PLAN-APPROVAL ARTIFACTS ON DISK.** Each phase produces a checkpoint artifact at `docs/checkpoints/v4_phase_<N>_<name>.md`. Each phase that affects user-facing surfaces requires a `/plan-design-review` pass. Each phase that affects architecture requires a `/plan-eng-review` pass. Artifacts must exist on disk and pass review before merging.

**2.7 NO BAC WATER, NO TIRZEPATIDE, NO SEMAGLUTIDE/RETATRUTIDE IN OPENING CATALOG.** Per Bible §15.4 and `compliance_disclaimers/enforcement_events.md`:
- Bacteriostatic water: ABSOLUTELY EXCLUDED from this site, on any rail, at any tier. (5 vendors in March 2026 wave were cited for BAC water + peptides = drug intent.)
- Tirzepatide: ITC General Exclusion Order 337-TA-1377 (May 2025). CBP blocks all infringing imports at border. Excluded perpetually.
- Semaglutide / Retatrutide: highest-enforcement-priority FDA targets. Excluded for first 90 days. Operator may override after Day 90 review of FDA enforcement signal.

**2.8 NO SHIPPING TO BLOCKLISTED JURISDICTIONS.** Default block list: California, Texas, New York, Florida (per `DECISIONS/compliance_posture.md`). Default international: US-only for first 90 days. Operator may strengthen (add states/countries). Operator may NOT weaken.

**2.9 NO DIRECT STRIPE / PAYPAL / SQUARE / SHOPIFY-PAYMENTS RAILS.** Per `compliance_disclaimers/payment_processor_posture.md`. These processors have explicit category bans. Day-1 stack is BTCPay self-hosted + Plaid ACH only. Cards (MAX/MESH/Rocketfuel) are Phase 2 after first revenue signal.

**2.10 NO FAKED REVIEWS, NO FAKE TESTIMONIALS, NO PERSONAL-USE STORIES.** Per Bible §9 and observed enforcement. The site launches with NO on-site reviews. Reviews accumulate organically through the qualification-gated buyer base. Forum-review-thread reputation accumulates separately. NO Trustpilot review counts on Day 1 (review counts are unverifiable for most vendors per coverage report).

**2.11 NO GLP-1 OBFUSCATED SKU NAMING.** Industry pattern observed across multiple vendors (OathPeptides: GLP1-S/GLP3-R, Mile High Compounds: GLP-1 SM/GLP-2 TRZ, Ionpeptide: ION-1S/ION-2T/ION-3R, Edge: EDGE R3/EDGE T2, Accelerate Labs: AL1-(S)/AL2-(T)/AL3-(R), Peak Performance: PP-3 RT/PP-2 TRZ). FDA decodes these in enforcement letters. The peptide site catalog already excludes GLP-1s entirely; do not introduce coded SKU names for any other reason. SKU codes use canonical peptide names: `BPC-157-10mg`, `TB-500-5mg`, etc. No internal-vs-external label divergence.

**2.12 NO MOGTRIX BRANDING IN THE NEW REPO.** Mogtrix is a separate operator project. Pre-commit grep test verifies the new repo source contains no occurrences of "Mogtrix" or "MOGTRIX". Comments referencing Mogtrix as a pattern source ARE allowed (one-liner attribution); the rest of the codebase must be clean.

**2.13 NO PRODUCT-PAGE CLAIM CROSSOVER WITH FORBIDDEN PATTERNS.** Even if a sentence is technically hedged ("research has suggested potential benefits in..."), if it names a human disease, names a therapeutic action, names an approved drug for comparison, or includes dosing protocols in any form, it triggers the assertMarketingCopySafe filter. The 19 FDA warning letters in `enforcement_events.md` consistently cite hedged-but-still-claiming language.

**2.14 NO RECONSTITUTION KIT BUNDLING.** FDA treats "vial + bacteriostatic water + syringe" packaging as drug intent (March 2026 wave: Pink Pony, Mile High, PekCura, Prime Sciences, Gram Peptides). The peptide site sells lyophilized peptide vials only; no syringes, no BAC water, no reconstitution kits, no "Reconstitution Kit" SKU.

**2.15 TDD CHECKPOINT COMMITS AS PROTOCOL EVIDENCE.** Iron Law 2.1 mandates TDD; Iron Law 2.15 mandates that the TDD cycle leaves unforgeable git-history evidence. For every feature/bugfix:
- Commit 1 (RED): test added, message format `test(<scope>): RED — <description>` with body containing `Validated by: <test command>` and the verbatim FAIL output snippet.
- Commit 2 (GREEN): minimum implementation, message format `feat(<scope>): GREEN — <description>` with body containing `Validated by: <test command>` and the verbatim PASS output snippet.
- Commit 3 (REFACTOR, optional): refactor, message format `refactor(<scope>): <description>` with body confirming tests remain green.
Do not squash or rewrite these checkpoint commits during the build phase. They are evidence the workflow happened. Phase verification gates can grep `git log --grep="RED —"` and `git log --grep="GREEN —"` to confirm.

**2.16 PRE-COMMIT SUPPLY-CHAIN SCANNER MANDATORY.** The pre-commit hook (already shipped in v3.0 at `.husky/pre-commit` + `scripts/grep-mogtrix.sh` + `scripts/grep-forbidden-words.sh` + `scripts/supply-chain-scan.sh`) MUST continue to fire on every commit. Do not disable, do not bypass with `--no-verify`. v4.0 EXTENDS the supply-chain scanner with two new categories (per Iron Law 2.22 below): `.env*` files committed to git (already enforced), and `process.env.<X>` references in `lib/content/` files (operator-secret leak risk). See Appendix U for the threat model.

**2.17 AGENT-INTROSPECTION-DEBUGGING ON 3+ FAILED FIXES.** Iron Law 2.3 mandates root-cause investigation. Iron Law 2.17 hardens the failure-recovery side: if three consecutive fix attempts fail (test still red, bug still reproducing, or new symptom emerges from the fix), STOP. Do not attempt fix #4. Instead, invoke explicit introspection per the protocol below. This protocol comes from `affaan-m/everything-claude-code/skills/agent-introspection-debugging`:
1. Capture failure state: what was attempted, what observed evidence shows the failure, what error messages or test output point at
2. Classify the failure pattern: (a) implementation bug in the new code, (b) spec misunderstanding, (c) tool/environment limitation, (d) shared-state coupling problem, (e) architectural mismatch
3. Apply the smallest contained recovery action for the classification: (a) revert the fix, simplify, retry; (b) re-read the spec section, surface the gap to operator; (c) document the tool limitation, propose workaround; (d) trace the shared state, identify the coupling site, propose decoupling; (e) STOP and discuss architecture with operator
4. Emit a structured introspection report to `docs/checkpoints/v4_introspection_<phase>_<timestamp>.md`
5. Only proceed with fix #4 after the introspection report is written and acknowledged

**2.18 NO AESTHETIC REGRESSION.** v4 ships visual-regression baselines (Playwright `toHaveScreenshot()` snapshots) for every page in Phase 11. After the baseline is captured and operator-approved (Appendix Y), every subsequent PR that touches user-facing surfaces MUST run the visual-regression suite as a CI gate. Any pixel diff >0.1% requires explicit operator approval before merge. Lighthouse scores per page MUST not drop below the Phase 11 baseline (Performance ≥ 90, A11y ≥ 95, SEO ≥ 95, Best Practices ≥ 95). A score regression blocks the PR.

**2.19 NO PROTECTED-FILE MODIFICATION WITHOUT REVIEW + CSO GATES (RE-PINNED FOR EMPHASIS).** Iron Law 2.5 already names the protected paths. v4 adds:
- `app/api/access/route.ts` (when implemented in Phase 10) — joins the protected list immediately upon creation.
- Any Supabase migration file under `supabase/migrations/` — joins the protected list (RLS policy errors are catastrophic).
- The cookie consent provider integration code (Phase 10) — joins the protected list (consent storage is a regulatory artifact).
- `lib/sentry.ts` (when introduced) — joins the protected list (alert thresholds are operational SLOs).
The pre-commit hook in v4 is extended (Iron Law 2.16 above) to flag commits touching these paths and require an explicit `// SCANNER_OK: reviewed-and-cso-passed` annotation in the commit body. Do NOT use this annotation lightly; it is auditable evidence.

**2.20 NO NEW PAYMENT RAIL BEYOND `{stub, btcpay, plaid}`.** Iron Law 2.9 forbids Stripe/PayPal/Square/Shopify-Payments. Iron Law 2.20 makes the universe explicit: the `PaymentProviderId` type in `lib/payments/types.ts:16` (`'stub' | 'btcpay' | 'plaid'`) is FROZEN for v4. Do NOT add a fourth rail in v4 — even MAX/MESH/Rocketfuel cards belong to Phase 2 (Day 90+) per `DECISIONS/payment_stack.md`. The `resolvePaymentProviderId` fallback to `'stub'` for any garbage value (proven in `tests/unit/payments/config.test.ts:23-28`) is contractual and tested; do not weaken it.

**2.21 DESIGN TOKENS ARE ADDITIVE-ONLY; NO BREAKING RENAMES.** v4 elevates the visual surface but the existing token names in `lib/design/tokens.ts` and `app/globals.css` are an API. Existing CSS variables (`--bg`, `--surface`, `--surface-strong`, `--accent`, `--accent-soft`, `--accent-glow`, `--electric`, `--text`, `--text-muted`, `--text-subtle`, `--border`, `--border-strong`, `--pill-{accent,info,electric,error}`, `--sp-*`, `--radius-*`, `--ease-*`, `--dur-*`, `--font-*`) MUST keep their names and approximate values. v4 may ADD new tokens (`--shadow-{sm,md,lg,xl}`, `--surface-elevated`, `--accent-deep`, `--gradient-*`) but never delete or rename. Component code that consumes tokens via Tailwind utilities (`bg-[var(--accent)]`) keeps working. Brand expression locked per Iron Law 2.26 below.

**2.22 NO REAL CREDENTIALS IN SOURCE; `.env.local` ONLY, NEVER COMMITTED.** Real credentials (Supabase service-role key, Resend API key, Sentry auth token, Plaid secret, BTCPay API key, BTCPay webhook secret) live ONLY in `.env.local` (gitignored) on the developer's machine and in Vercel project environment variables (set via `vercel env add` per Phase 10). They MUST NOT appear in `.env.example` (which holds only stub values), in any committed file, in any commit message, in any documentation, or in any test fixture. The pre-commit supply-chain scanner (Iron Law 2.16) extension catches `.env*` files (except `.env.example`) in the commit; it also catches `process.env.<SECRET_NAME>` references in `lib/content/` files (operator-secret leak risk). If a credential ever appears in a commit history (even reverted), rotate the credential immediately and document the incident in `docs/checkpoints/v4_security_incident_<date>.md`.

**2.23 COOKIE CONSENT PROVIDER IS OPERATOR-APPROVED BEFORE DEPLOY.** v4 adds a cookie consent banner (deferred from v3.0). The provider choice (self-hosted, Osano, Cookiebot, OneTrust, or other) is a Phase 10 PENDING decision that the operator confirms via Appendix AA. The implementation MUST honor: (1) accept-all / customize / reject-all options, (2) GPC signal as opt-out, (3) persisted choice across visits via first-party cookie (no third-party tracker for the consent itself), (4) strictly-necessary cookies (auth, cart, CSRF) set unconditionally, (5) all other categories opt-in by default. The implementation lives at `components/CookieConsent.tsx` + `lib/consent-store.ts` + integration in `app/layout.tsx`. The integration files join the protected paths list (Iron Law 2.19).

**2.24 NO `.skip` OR `.only` ON E2E TESTS IN THE CI GATE.** v3.0 shipped `tests/e2e/checkout-{ach,crypto}.spec.ts` with `test.skip(true, '...')` because Playwright browsers were not provisioned. v4 Phase 11 unskips both, provisions browsers in CI via `npx playwright install --with-deps`, and adds a CI step that fails the build on any `test.skip(true, ...)` or `test.only(...)` in `tests/e2e/`. The `npm run test:e2e` CI step is PR-blocking after Phase 11.

**2.25 VISUAL-REGRESSION DIFFS REQUIRE OPERATOR APPROVAL BEFORE MERGE.** Iron Law 2.18 establishes the baseline. Iron Law 2.25 specifies the merge-gate: any PR that produces a Playwright `toHaveScreenshot()` diff above the per-page threshold (default 0.1% pixel difference) must surface the diff in PR comments and require explicit operator approval (GitHub PR `approved` review state from the operator account) before merge. This is enforced via a GitHub Actions job that posts the diff as a PR comment artifact and a branch protection rule requiring the operator's review. Branch protection setup is a Phase 12 deliverable.

**2.26 BRAND EXPRESSION LOCKED UNTIL EXPLICIT OPERATOR OVERRIDE.** The brand decision is LOCKED per §1.3. Iron Law 2.26 hardens: do NOT change the brand name, the tagline ("Counted, weighed, verified."), the core color values (`--bg #0a0e0f`, `--accent #3dd4c8`), the type stack (IBM Plex Sans/Mono + Newsreader Italic), the wordmark composition ("Vialchems" + "LABS" chip), or the Posture A label without an explicit operator instruction in chat. UI elevation may add accent variations, deepen accents, add gradient layers, refine type rhythm, refine spacing rhythm, but the BASE values are inviolable. The lab-partner attribution (Janoshik Analytical) is also locked unless operator confirms an alternative via `LAB_PARTNER_NAME` env override.

**2.27 LIGHTHOUSE CI MUST RUN ON EVERY PR; MERGES BLOCKED BELOW 90/95/95/95.** v3.0 deferred Lighthouse CI metrics. v4 Phase 11 wires Lighthouse CI as a PR-blocking GitHub Actions check across the full route table. Per Appendix W.7 (Pre-Delivery Checklist) and the original §7.1 spec:
- Performance ≥ 90 on desktop AND mobile, every page
- Accessibility ≥ 95, every page
- SEO ≥ 95, every page
- Best Practices ≥ 95, every page
- LCP < 2.5s on 4G mobile, every page
- CLS < 0.1, every page
- INP < 200ms, every page
A score below threshold on any page blocks the PR. The Lighthouse-CI config (`.lighthouseci.json` or `lighthouserc.cjs`) lives at repo root; the GitHub Actions workflow (`.github/workflows/lighthouse.yml`) is a Phase 11 deliverable. Branch protection requires this check (Phase 12).

---

## 3. SUBAGENT CONSTITUTION

Every subagent dispatched in this build receives, pinned to the front of every dispatch, the following constitution. The dispatching agent (you, the main thread) MUST include this verbatim in every Agent tool invocation. Subagents who do not acknowledge will be re-dispatched.

```
# SUBAGENT CONSTITUTION (READ AND ACKNOWLEDGE BEFORE PROCEEDING)

NORTH STAR
You are a subagent helping take an existing Vialchems Labs peptide e-commerce
codebase from v1.0.0 (Day-1 stubbed-but-operational) to production-launched at
vialchems.labs with every external boundary wired to real credentials, every
page visually elevated to the operator's calibration target, Lighthouse
≥ 90/95/95/95 enforced as CI gates, E2E tests unskipped, cookie consent live,
Sentry alerts firing, real BTCPay + Plaid flows tested with real money.

The codebase already exists at /root/peptide-site/. You are NOT building it.
You are elevating, wiring, and shipping it.

NON-NEGOTIABLES
- TDD: failing test first, then minimum code, then verify, then refactor
- Verification before completion: run the verifying command in YOUR session,
  read full output, confirm
- Compliance contract verbatim per existing protected files. You may
  strengthen, NEVER weaken. Never edit lib/compliance.ts patterns to remove
  rules. Never change the verbatim disclaimer text in
  components/SiteFooter.tsx, lib/customer-qualification.ts ATTESTATIONS,
  app/checkout/review/ReviewPanel.tsx age gate, or lib/content/email-templates.ts.
- Brand identity LOCKED per Iron Law 2.26: Vialchems Labs, Posture A, charcoal
  #0a0e0f + teal #3dd4c8, IBM Plex pairing, "Counted, weighed, verified."
  Visual elevation is additive within these constraints.
- Forbidden words from lib/compliance.ts assertMarketingCopySafe. Run grep
  before any commit.
- NO Mogtrix branding in source. Pattern-attribution comments OK.
- NO forbidden marketing patterns (weight loss, blood sugar, GLP-1, treatment,
  cure, therapeutic, FDA approved, personal pronouns describing effects, etc.)
- NO BAC water, NO tirzepatide, NO semaglutide, NO retatrutide in the catalog
- NO direct Stripe/PayPal/Square rails. PaymentProviderId universe is FROZEN
  at {stub, btcpay, plaid}.
- NO reviews, no testimonials, no before/after imagery on Day 1
- NO design token RENAMES; only ADDITIVE token extensions
- NO real credentials in source files; .env.local only
- NO test.skip(true) or test.only on E2E tests after Phase 11
- Lighthouse scores ≥ 90/95/95/95 enforced; cannot regress

ANTI-DRIFT RULE
If the task you've been dispatched conflicts with anything in this constitution,
surface the conflict to the main thread IMMEDIATELY. Do not adapt the task
silently to fit the constitution. Do not adapt the constitution silently to
fit the task. The main thread re-dispatches if needed.

PROTECTED PATHS (Iron Law 2.5 + 2.19)
Touching ANY of these requires gstack /review then /cso BEFORE commit, plus
an explicit `// SCANNER_OK: reviewed-and-cso-passed` annotation in the
commit body:
- lib/payments/{config,index,server,types,btcpay,plaid,stub,reconciliation}.ts
- lib/compliance.ts
- lib/compliance/jurisdictions.ts
- lib/customer-qualification.ts
- lib/attestations.ts
- lib/content/products.ts
- lib/content/product-descriptions.ts
- app/api/payments/btcpay/webhook/route.ts
- app/api/payments/plaid/webhook/route.ts
- app/api/access/route.ts (when introduced in Phase 10)
- supabase/migrations/* (when introduced in Phase 10)
- components/CookieConsent.tsx (when introduced in Phase 10)
- lib/consent-store.ts (when introduced in Phase 10)
- lib/sentry.ts (when introduced in Phase 10)

SPEC ADHERENCE AUDIT
Before claiming your task is done, write a spec adherence audit at the end of
your output:
1. List every spec requirement from your dispatch
2. State, with evidence, how each requirement is satisfied (cite file:line)
3. Mark any requirement that's not fully met as OUTSTANDING with the gap
   described

DELIVERABLE FORMAT
- Code: passes its TDD tests, passes assertMarketingCopySafe grep, passes
  type-check, passes pre-commit supply-chain scanner
- Copy: matches brand voice, passes assertMarketingCopySafe, no em-dashes,
  no AI tells
- Reports: structured per dispatch ask, OBSERVED/INFERRED/PROXY labels,
  primary-source citations

ACKNOWLEDGE
Before proceeding, write: "Constitution read and acknowledged. North star:
elevate Vialchems Labs to production-launched + UI-elevated, every deferral
closed, brand and compliance LOCKED, additive design tokens only." Then
proceed.
```

The constitution gets pinned to every Agent tool dispatch. Period. No exceptions.

---

## 4. EXECUTION DISCIPLINE

### 4.1 Superpowers contract

Invoke at the points indicated:

| Skill | When |
|---|---|
| `superpowers:writing-plans` | Start of each phase (1-13); output to `docs/superpowers/plans/v4_<date>-phase-<N>.md` |
| `superpowers:subagent-driven-development` | Any phase with 3+ independent modules (Phases 4-6 page polish; Phase 10 services wiring) |
| `superpowers:dispatching-parallel-agents` | Parallel page polish (after Phase 1-2 design system locks); parallel test runs |
| `superpowers:test-driven-development` | Every code-writing task; v4 keeps the v3.0 RED→GREEN commit format (Iron Law 2.15) |
| `superpowers:systematic-debugging` | Whenever a bug, test failure, or unexpected behavior appears |
| `superpowers:verification-before-completion` | Before every claim of "done" |
| `superpowers:requesting-code-review` | After every task in subagent-driven mode |
| `superpowers:receiving-code-review` | When reviewing subagent or operator feedback |
| `superpowers:finishing-a-development-branch` | After each phase completes |
| `superpowers:using-git-worktrees` | When starting a phase that needs branch isolation (Phases 4-6 page-polish parallel work; Phase 10 services-wiring parallel work) |

### 4.2 gstack contract

Pre-planning (Phase 0):
- `/plan-eng-review` (mandatory after Phase 0 audit; verify deferral inventory)
- `/plan-design-review` (mandatory before Phase 1 design-token elevation; calibrate against Appendix AC reference set)
- `/autoplan` (run all reviews in sequence after Phase 0 audit)

Implementation:
- `/design-review` after any user-facing component or page lands (Phases 1-7)
- `/investigate` whenever a bug surfaces
- `/codex review` on payment integration code (Phase 10 mandatory; second-opinion on JWKS migration)
- `/codex challenge` on the cookie consent integration (Phase 10) — adversarial review

Pre-ship gates:
- `/qa` for end-to-end testing on the live site (Phase 11)
- `/review` for diff analysis (mandatory before any commit touching protected paths per Iron Laws 2.5 + 2.19)
- `/cso` for infrastructure security audit (mandatory before Phase 12 deploy)
- `/benchmark` for Core Web Vitals baseline (Phase 11)
- `/total-security-audit` mandatory before Phase 12 deploy (operator's first-buyer dollar will hit this build)

Ship + deploy:
- `/ship` to bump VERSION to 1.1.0 (or higher per SemVer of changes), write CHANGELOG, merge base, run tests, create PR (Phase 12)
- `/land-and-deploy` to merge PR, wait for CI, deploy to Vercel production, canary verify (Phase 12)
- `/canary` for post-deploy 2-hour monitoring loop (Phase 13)
- `/document-release` to update README/ARCHITECTURE/CHANGELOG (Phase 13)

Safety:
- `/careful` ALWAYS engaged when touching payment integration, compliance code, age gate, jurisdictional restrictions, or supabase migrations
- `/freeze` to scope edits to `lib/payments/` during Phase 10 payment-credential-wiring
- `/freeze` to scope edits to `supabase/migrations/` during Phase 10 schema-application
- `/guard` (combined careful+freeze) for the most sensitive surfaces (real Plaid + real BTCPay wiring)

Session management:
- `/context-save` after every major phase completes
- `/context-restore` only used if session is interrupted and resumed

### 4.3 Subagent dispatch protocol

For phases with 3+ independent modules (Phases 4-6, 10):

1. Write the phase plan in TodoWrite at start.
2. Per module: dispatch ONE fresh subagent with: (a) the constitution from §3 verbatim, (b) the full task text, (c) all context the subagent needs (NEVER pass file references; pass content), (d) the expected deliverable format, (e) the spec adherence audit requirement.
3. Subagent acknowledges constitution, implements TDD, tests, commits (per Iron Law 2.15 with checkpoint commit format), self-reviews, produces spec adherence audit.
4. Dispatch spec-compliance reviewer subagent (separate dispatch, fresh context, constitution pinned again) — verifies against original task spec. If issues, original implementer fixes, re-review.
5. Dispatch code-quality reviewer subagent (separate dispatch, fresh context, constitution pinned again) — verifies quality. If issues, fix, re-review.
6. Mark task done.
7. After all modules in phase: final integration review. Then `superpowers:finishing-a-development-branch`.

Never dispatch multiple implementation subagents in parallel for the same phase (causes git conflicts unless using worktree cascade per §4.4). Reviews CAN run in parallel after implementations complete.

### 4.4 Worktree cascade method (for parallel-isolated module work)

Phases 4-6 (page polish) and Phase 10 (services wiring) are good candidates for the worktree cascade pattern. Use it when modules are truly orthogonal:

```bash
cd /root/peptide-site
git worktree add ../peptide-page-polish-shop feature/v4-polish-shop
git worktree add ../peptide-page-polish-pdp feature/v4-polish-pdp
git worktree add ../peptide-page-polish-checkout feature/v4-polish-checkout
```

Then dispatch one fresh subagent per worktree (still constitution-pinned). Each subagent operates in its own worktree on its own branch. After all subagents return:

1. Run integration review against the working tree's main branch
2. Merge each branch one at a time (cascade oldest-to-newest), with TDD verification between merges
3. Resolve any conflicts during integration, not during parallel development
4. Remove worktrees after merge: `git worktree remove ../peptide-page-polish-shop`

This pattern works for orthogonal page polish (shop vs PDP vs checkout — different files) and orthogonal service wiring (Resend vs Sentry vs Supabase — different lib files). It does NOT work for tightly-coupled changes (design token additions affect all UI primitives — those go sequentially in Phase 1-2).

### 4.5 Model selection (single-track Opus only)

Every task in this build runs on Claude Opus (currently `claude-opus-4-7` per environment). This is a deliberate operator decision continued from v3.0 §4.5: the build is high-stakes (real credentials wiring + real payment processing + production deploy), zero-edit-deployable bar, and survives FDA enforcement scrutiny only with maximum reasoning quality. We do NOT route tasks to Haiku or Sonnet for cost optimization.

This applies to: main thread, all subagent dispatches, all gstack skill invocations, all Superpowers skill invocations. If a tool's default routing chooses a smaller model, override with the explicit Opus model alias.

---

## 5. CONTEXT-ROT MITIGATION

### 5.1 Per-phase North Star reload

At the start of every phase, the agent re-reads:
- This super-prompt's §0 (mission), §1.3 (LOCKED state), §2 (Iron Laws all 27), §3 (Constitution)
- `RESEARCH_PLAN.md` Section 4 (Recommended Toolkit)
- `CODEBASE_UNDERSTANDING.md` §3 (Iron Laws + Code Footprint table) and §4 (Phase Ledger) and §11 (Reading Inventory)
- The previous phase's checkpoint artifact at `docs/checkpoints/v4_phase_<N-1>_<name>.md`
- Appendix AB (Deferral Ledger) — confirm which deferrals close in this phase

This re-read forces alignment even if conversational context has accumulated drift.

### 5.2 Per-phase checkpoint artifacts

Every phase ends with `docs/checkpoints/v4_phase_<N>_<name>.md` containing:
- Phase goal (one line)
- Deferrals closed in this phase (list with cite back to Appendix AB)
- Decisions locked
- Code shipped (file paths)
- Tests written and passing (count)
- Subagents dispatched and outcomes
- Verification evidence (commands run + output excerpts)
- Outstanding issues
- Next phase entry conditions

If the session is interrupted, the next agent reads the most recent checkpoint and resumes there. The agent does NOT re-read every research file.

### 5.3 Subagent dispatch for token-heavy work

Heavy reads (large vendor profiles in bulk, full Lighthouse JSON outputs, full visual-regression diff bundles) are dispatched to subagents with focused output formats. The main thread synthesizes the agent reports without re-reading the source files.

### 5.4 Phase-by-phase commits + `/context-save`

Each phase commits its work to git as it lands. After commit, run `/context-save`. The session can pause at any phase boundary without losing state.

### 5.5 Manifest as canonical reference

`STAGE6_MANIFEST.yaml` (v3.0 LOCKED) and `CODEBASE_UNDERSTANDING.md` (v3.0 comprehension) are the ONLY sources of truth for paths and current state. The agent does not memorize paths from this prompt. When in doubt, the agent re-reads these.

### 5.6 Self-fragmenting long phases

If any phase exceeds 90 minutes of estimated wall-clock work, the agent must self-fragment into smaller subtasks, dispatching a subagent per subtask. Phase boundaries are NOT 90-minute strict; subtask boundaries within a phase ARE 90-minute strict. Phases 4-6 (page polish) and Phase 10 (services wiring) are explicitly multi-subtask.

### 5.7 Spec-vs-implementation diff check after every subagent return

When a subagent returns its spec adherence audit, the main thread runs a diff: does every spec requirement have a satisfied claim with evidence (file:line citation)? If any requirement is OUTSTANDING, the main thread re-dispatches the subagent with the gap called out. No silent acceptance.

### 5.8 Optional memory-persistence hooks (recommended for long sessions)

Same as v3.0 §5.8. PreCompact + SessionStart + Stop hooks at `~/.claude/sessions/<date>/`. Not required; recommended if the session spans multiple working days.

### 5.9 Structured hook observability

Same as v3.0 §5.9. Every hook writes a structured JSON line to `~/.claude/sessions/hooks.jsonl`.

---

## 6. DECISION CONTRACT

### 6.1 PENDING decisions handling

The v4.0 prompt has SEVEN PENDING decisions that the operator confirms via Appendix AA (Operator Credential Intake Form) at Phase 10:

| Decision | When asked | Default if unspecified |
|---|---|---|
| Cookie consent provider | Phase 10 | Self-hosted (no third-party tracker; minimal surface) |
| Plaid environment | Phase 10 | `sandbox` for first deploy; operator confirms `production` flip after smoke test |
| BTCPay hosting | Phase 10 | Operator chooses self-host (Docker) OR Voltage Cloud ($/mo). No default — operator MUST decide. |
| Sentry org/project name | Phase 10 | `vialchems-labs` org, `vialchems-labs-prod` project |
| Resend sender domain verification | Phase 10 | `vialchems.labs` (subdomain `mail.vialchems.labs` if root is reserved for site) |
| Domain registrar | Phase 12 | 101domain or Gandi for `.labs` TLD; fallback `vialchems.com` |
| LLC formation jurisdiction | Phase 10 (env vars only) | Wyoming (default per `LLC_JURISDICTION` env) |

The agent surfaces each PENDING decision once at the start of the phase that needs it (Appendix AA pre-fills the form with defaults). If operator does not interject within auto-mode timeout, agent proceeds with the default.

### 6.2 LOCKED decisions (do NOT re-litigate)

All v3.0 LOCKED decisions remain LOCKED. See §1.3 for the full list. Brand, catalog, payment rails, jurisdictional block, age threshold, attestations, footer disclaimer, lab partner — all FROZEN.

### 6.3 LOCKED_OVERRIDE protocol

If the operator wants to weaken a LOCKED decision, they must:
1. Edit the relevant `DECISIONS/<file>.md` in `/root/peptide-launch-bundle/corpus/DECISIONS/` with `LOCKED_OVERRIDE:` and a rationale
2. Notify the agent in chat
3. Agent updates the affected files + writes a `docs/checkpoints/v4_locked_override_<date>.md` artifact

Without operator-issued LOCKED_OVERRIDE, the LOCKED decision binds.

### 6.4 Operator interruption mid-phase

Treat operator messages mid-execution as course corrections per auto-mode. Do not wait for permission to continue between phases unless this prompt explicitly says to gate (Phase 10 Appendix AA gate; Phase 12 deploy gate; Phase 13 first-buyer-dollar gate).

---

## 7. PERFORMANCE / UX / ACCESSIBILITY / MOTION SPECS

These are HARD targets. Every phase that produces a user-facing surface must hit them. v3.0 §7 numbers carry forward; v4 §7.7 is new (visual-regression baselines).

### 7.1 Performance (Lighthouse, mobile + desktop, every page) — NOW PR-BLOCKING (Iron Law 2.27)

- Performance ≥ 90
- Accessibility ≥ 95
- SEO ≥ 95
- Best Practices ≥ 95
- LCP < 2.5s on 4G mobile
- CLS < 0.1
- INP < 200ms
- FCP < 1.8s on 4G mobile
- TTFB < 800ms

Verification: Lighthouse CI runs on every PR via `.github/workflows/lighthouse.yml` (Phase 11 deliverable). Failing scores block merge.

### 7.2 Accessibility (WCAG 2.1 AA minimum) — NOW axe-CLEAN ENFORCED

Same baseline as v3.0 §7.2. v4 ADDS:
- `axe-core` runs on every page in Phase 8 + as part of Lighthouse CI
- 0 critical or serious axe violations on any page
- Keyboard navigation tested on every interactive surface (catalog filters, checkout forms, COA search, qualification flow, mobile nav)
- Screen-reader smoke-test on home, PDP, checkout review
- All form fields have associated `<label>` (existing); error messages reference field by name (existing); v4 adds aria-live polite regions on cart count + checkout step transitions

### 7.3 Interaction design

Same as v3.0 §7.3. v4 ADDS:
- Toast surface for transient feedback (cart-add, qualification submit, error states) — `components/ui/Toast.tsx` is a Phase 2 deliverable
- Sheet/drawer surface for mobile checkout step transitions (optional; default keeps current page-per-step pattern)
- Dialog surface for cancel-order + refund-request flows in account (replace inline `actionMessage` pattern in `AccountOrderDetail.tsx`)
- Empty-state component (`components/ui/EmptyState.tsx`) for cart-empty, account-orders-empty, account-addresses-empty, COA-no-results, shop-no-results

### 7.4 Motion vocabulary

Same as v3.0 §7.4. v4 ADDS:
- View Transitions API for page-to-page transitions (where stable; fallback to instant)
- Stagger reveal applied consistently to catalog tiles + COA table rows + blog post list (Phase 7)
- Hover unfurl on Card variant=interactive (already implemented; verify consistency)
- Sheen sweep on Recovery Stack CTA (one-time, on initial paint; honors reduced-motion)

### 7.5 SEO — NOW STRUCTURED-DATA ENFORCED

Same as v3.0 §7.5. v4 ADDS:
- JSON-LD `Product` schema on every PDP (Phase 9)
- JSON-LD `BreadcrumbList` on every catalog/PDP/COA detail page (Phase 9)
- JSON-LD `Article` on every blog post (Phase 9)
- JSON-LD `FAQPage` on `/faq` (Phase 9)
- `sitemap.xml` generated at build time + submitted to Google Search Console + Bing Webmaster Tools (Phase 13 operator action)
- `robots.txt` at `public/robots.txt` (Phase 9; allow all, sitemap reference)
- OpenGraph + Twitter card image template at `app/opengraph-image.tsx` using `next/og` (already partially defined in metadata; v4 generates real images)

### 7.6 Page weight + bundle size

Same as v3.0 §7.6. v4 ADDS:
- Bundle audit per route via `@next/bundle-analyzer` in Phase 9
- Image audit: every `<img>` uses `next/image` with `loading="lazy"` (where below the fold) and explicit `width` + `height` (CLS prevention)
- Font subsetting confirmation (Phase 1 already loads via `next/font/google` which subsets automatically; verify)
- Per-route JS bundle ≤ 250KB gzipped (tighter than v3.0's 300KB; budget headroom for Motion + cookie consent + Sentry SDK additions)

### 7.7 Visual-regression baselines (NEW for v4)

Per Iron Law 2.18 + 2.25 + Appendix Y:

- Tool: Playwright `toHaveScreenshot()` (built-in; no extra dependency)
- Coverage: every page in the route table (38 routes), captured at 3 viewports (375px / 768px / 1440px) and 2 color schemes (system default + dark — though Vialchems is dark-only, capture both for future-proof)
- Storage: snapshots committed to `tests/e2e/__screenshots__/` under git LFS (or directly if size permits)
- Diff threshold: 0.1% pixel difference (Playwright default)
- Capture: Phase 11 baseline run on operator-approved post-elevation state
- CI integration: Phase 12 GitHub Actions job runs visual-regression suite on every PR; diffs above threshold post a PR comment artifact + require operator approval

Failing visual-regression diffs block merge (Iron Law 2.25). Operator approval = explicit GitHub `approved` review state from operator account.

---

## 8. PHASE-BY-PHASE WORKFLOW

14 phases (0-13). Sequential. Each phase ends with a checkpoint artifact, a `/context-save`, and a verification gate. Each phase opens with a North Star reload (§5.1).

### PHASE 0: Pre-Flight + Audit + Agentic Toolkit Install (target: 60-90 min)

**Goal:** Verify codebase state matches CODEBASE_UNDERSTANDING.md. Confirm deferral inventory unchanged. Install + configure every Claude Code agentic toolkit item in Appendix X.1.

**Inputs:**
- `/root/peptide-site/CODEBASE_UNDERSTANDING.md` (full read)
- `/root/peptide-site/RESEARCH_PLAN.md` (full read of Section 4 + Appendix X.1)
- `docs/checkpoints/phase_*.md` (12 v3.0 checkpoints)
- `docs/operator-runbook.md` (full read for deferral inventory)
- `docs/design-references/vial-reference-2026-05-09.webp` (operator-supplied vial composite — open with Read tool; analyze per Appendix AD)

**Deliverables:**

1. Audit:
   - `cd /root/peptide-site && npm install` (no-op if already installed)
   - `npm test` — verify 304/304 passing (or current count if v3.0 evolved)
   - `npm run build` — verify clean build (50 static + 38 routes)
   - `npm run preflight` — verify typecheck + lint + 3 grep gates pass
   - `git log --oneline | head -20` — verify HEAD matches v1.0.0 tag (or note divergence)
   - `git status` — verify clean working tree
   - Confirm 38 routes present per CODEBASE_UNDERSTANDING.md §4
   - Confirm protected paths unchanged via `git diff v1.0.0 HEAD -- lib/payments/ lib/compliance.ts lib/customer-qualification.ts lib/attestations.ts app/api/payments/ lib/content/products.ts lib/content/product-descriptions.ts`
2. Install agentic toolkit per Appendix X.1 (see Appendix X.1 for full per-item install + config + Iron Law gates):
   - Anthropic `frontend-design` skill: `npx skills add https://github.com/anthropics/skills --skill frontend-design`
   - `pbakaus/impeccable`: `npx skills add pbakaus/impeccable` then `/impeccable teach` once for project context
   - shadcn MCP: add `{"mcpServers":{"shadcn":{"command":"npx","args":["shadcn@latest","mcp"]}}}` to `.mcp.json`; restart Claude Code; verify `/mcp` shows shadcn connected
   - Storybook MCP (optional, defer to Phase 11 if not adding Storybook this round)
   - 21st.dev Magic MCP (optional, defer if not generating new shadcn-compat components)
   - Figma MCP (optional, only if operator has Figma Dev Mode seat)
   - Penpot MCP (optional, skip per Iron Law 2.21 — design tokens are LOCKED and additive-only)
   - `mattpocock/skills` selective pull: `npx skills add mattpocock/skills --skill grill-with-docs` (helps Phase 10 service-wiring spec drilling)
   - `forrestchang/andrej-karpathy-skills` CLAUDE.md: read once and absorb the four principles (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution); do NOT install as a competing CLAUDE.md
   - `yamadashy/repomix`: `npm install -g repomix` (or use `npx`); useful for Phase 10 cross-cutting service-wiring context
   - `ryoppippi/ccusage`: `npm install -g ccusage`; baseline token-spend before Phase 1
   - `rtk-ai/rtk`: install per repo instructions; reduces npm/tsc/playwright bash output noise
3. Verify agentic toolkit:
   - List installed skills: confirm `frontend-design` and `impeccable` registered
   - Test shadcn MCP: ask Claude to list available shadcn components; confirm response
   - Run `/impeccable audit` against the home page baseline; capture report
4. Confirm deferral inventory matches `docs/operator-runbook.md` (no surprise drift since v3.0 ship)
5. **Open and analyze the vial reference image:** Read `docs/design-references/vial-reference-2026-05-09.webp` with the Read tool. Confirm the 6-section content matches Appendix AD's analysis. Note the banned-compound disclaimer (Tirzepatide / Retatrutide are layout placeholders only; Iron Law 2.7 still bans them from catalog). Capture the per-section analysis in the Phase 0 checkpoint as input to Phase 2 + Phase 4 planning.
6. **OPERATOR GATE — `huashu-design` license:** Before installing X.1.4 (`alchaincyf/huashu-design`), confirm operator commercial license payment per X.1.4 spec. Pin attestation in `docs/checkpoints/v4_phase_0_huashu_license.md`. If operator declines license, downgrade X.1.4 to REJECTED for this run and proceed without it (Phase 2 + Phase 4 fall back to `pbakaus/impeccable` + `nextlevelbuilder/ui-ux-pro-max-skill` for the design-fidelity protocol).
7. **AUDIT GATE — `ui-ux-pro-max-skill` supply-chain:** Before installing X.1.12 (`nextlevelbuilder/ui-ux-pro-max-skill`), run the Appendix T.7 audit (read source, scan for hidden-unicode + prompt-injection + suspicious-base64 patterns). Pin audit result in `docs/checkpoints/v4_phase_0_uiux_pro_max_audit.md`. If audit fails, downgrade X.1.12 to REJECTED for this run.
8. Save `docs/checkpoints/v4_phase_0_preflight.md` with: audit results, toolkit install confirmations, baseline test count, baseline build output, baseline `/impeccable audit` scorecard, deferral inventory snapshot, vial-reference per-section analysis, huashu license attestation reference, ui-ux-pro-max audit reference
9. `/context-save`

**Verification gate:**
- [ ] `npm test` returns ≥ 304/304 passing (or v3.0-evolved count, no regressions)
- [ ] `npm run build` clean
- [ ] `npm run preflight` clean
- [ ] All Appendix X.1 P0 + P1 tools installed and verified (or REJECTED with checkpoint reasoning for X.1.4 / X.1.12 if license/audit fails)
- [ ] shadcn MCP connected per `/mcp` status
- [ ] `/impeccable audit` baseline captured
- [ ] Vial reference image read; per-section analysis in checkpoint matches Appendix AD
- [ ] `huashu-design` license attestation OR explicit downgrade in checkpoint
- [ ] `ui-ux-pro-max-skill` supply-chain audit pass OR explicit downgrade in checkpoint
- [ ] Deferral inventory snapshot matches operator-runbook
- [ ] `git status` clean
- [ ] Checkpoint artifact written

**Exit criteria:** All checks above ✓; the codebase is verified Day-1-stubbed-but-operational, the agentic toolkit is loaded, and Phase 1 can begin.

### PHASE 1: Design System Elevation — Tokens (target: 60-90 min)

**Goal:** Additively extend the design token system with shadows, refined type rhythm, refined spacing rhythm, and refined motion tokens. Iron Law 2.21: NO breaking renames; existing token names stay.

**North Star reload:** Re-read §1.3, §2.21, §2.26, §7.4, Appendix AC.

**Inputs:**
- `lib/design/tokens.ts` (current 121 lines)
- `app/globals.css` (current 205 lines)
- Appendix AC (UI Elevation Reference Set) — operator-calibrated visual targets
- `pbakaus/impeccable` `/critique` output from Phase 0

**Deliverables:**

1. Extend `lib/design/tokens.ts`:
   - Add `shadows`: sm (1px subtle), md (4px definition), lg (12px elevation), xl (24px overlay), 2xl (32px modal)
   - Add `surfaceElevated` color (one step above `surface-strong` for hover/active states)
   - Add `accentDeep` color (one step deeper than `accent` for pressed states)
   - Add `gradients`: hero atmospheric (existing in globals.css; promote to token), accent-radial (CTA backdrops)
   - Add `borderRadius.pill` alias for `full` (already 999px) for clarity
   - Refine `spacing` if needed (current 4px base unit through 6xl=128px; consider 7xl=192px, 8xl=256px for hero sections)
   - Refine `typography.scale.heroXl` if needed (current `clamp(48px, 7vw, 96px)`; consider stretching to `clamp(56px, 8vw, 112px)` for elevated hero impact — operator approval per Iron Law 2.26)
2. Mirror to `app/globals.css`:
   - Add `--shadow-sm` through `--shadow-2xl` CSS custom properties
   - Add `--surface-elevated` and `--accent-deep` CSS custom properties
   - Add `--gradient-hero-atmospheric` and `--gradient-accent-radial` CSS custom properties
   - Confirm `@theme inline` mirror block updated for Tailwind v4 utility access
3. Tests:
   - `tests/unit/design/tokens.test.ts` — verify new tokens exported with expected shape (TDD: write failing test first per Iron Law 2.1, 2.15)
   - Snapshot test that existing tokens are unchanged (regression prevention per Iron Law 2.21)
4. Run `/impeccable critique` against the token additions. Iterate.
5. Save `docs/checkpoints/v4_phase_1_design_tokens.md` with: token diff (before/after), reasoning per addition, Iron Law 2.21 compliance evidence (no renames), test count delta, `/impeccable critique` verdict.
6. `/context-save`

**Verification gate:**
- [ ] All new tokens added; zero existing tokens renamed
- [ ] CSS custom properties + Tailwind theme mirror in sync
- [ ] Token tests pass (TDD discipline; commit-message format `test(tokens): RED — ...` and `feat(tokens): GREEN — ...`)
- [ ] `npm test` total ≥ baseline + new test count
- [ ] `npm run build` clean (no broken consumers)
- [ ] `/impeccable critique` returns no critical issues
- [ ] Existing pages render unchanged (visual smoke test in dev server)
- [ ] Checkpoint artifact written

**Exit criteria:** Token system elevated additively; existing surfaces unaffected; new shadows/elevations available for Phase 2 primitive overhaul.

### PHASE 2: UI Primitive Overhaul (target: 90-120 min)

**Goal:** Refresh existing UI primitives (Button, Input, Card, Pill, Specs, FieldLabel, Vial) with elevated visuals using Phase 1 tokens. Add new primitives (Dialog, Sheet, Toast, Skeleton variants, EmptyState, Badge variants). Same API; visual lift; same a11y guarantees.

**North Star reload:** Re-read §2.18 (no aesthetic regression), §2.21 (additive tokens), §2.26 (brand locked), §7.2 (a11y), §7.3 (interaction design), Appendix W.1 (visual quality checklist).

**Inputs:**
- All `components/ui/*.tsx` (8 existing primitives)
- Phase 1 token deliverables
- Appendix AC visual targets
- Existing component tests in `tests/unit/components/`

**Deliverables (per primitive, TDD discipline per Iron Law 2.1, 2.15):**

1. **Button** (`components/ui/Button.tsx`):
   - Add `--shadow-sm` to primary variant resting state; `--shadow-md` on hover
   - Refine `active:scale-[0.98]` to use `cubic-bezier` for premium feel
   - Add new `success` and `danger` variants for transactional surfaces (refund request, cancel order)
   - Verify all existing tests in `tests/unit/components/Button.test.tsx` still pass
2. **Card** (`components/ui/Card.tsx`):
   - Add `--shadow-sm` to default variant; `--shadow-md` on `interactive` variant hover
   - Add `elevated` variant (uses `--surface-elevated` bg + `--shadow-lg`)
3. **Input** (`components/ui/Input.tsx`):
   - Add inset shadow on focus state for depth
   - Verify error state remains visually distinct (existing pattern)
4. **Pill** (`components/ui/Pill.tsx`):
   - No structural change; verify color-mix still works in all browsers (target: Safari 16+, Chrome 110+, Firefox 110+)
5. **Specs** (`components/ui/Specs.tsx`):
   - Add optional `dense` prop for tighter rows (used in PDP sidebar)
6. **FieldLabel** (`components/ui/FieldLabel.tsx`):
   - No structural change
7. **Vial** (`components/ui/Vial.tsx`) — refined per Appendix AD operator-supplied reference:
   - Add `--shadow-md` drop-shadow filter to SVG for depth (CSS-only, perf budget OK)
   - Refine SVG aspect ratio toward the real-product 50:22 (height-to-width 2.27:1) per Appendix AD §3 Size Guide; current `viewBox="0 0 32 80"` is 2.5:1 — operator approves the visual change after seeing before/after; if approved, update `viewBox` to `0 0 22 50` and adjust internal coordinates proportionally
   - Refine cap to better match the metallic crimp shown in the reference (existing cap acceptable; v4 may add subtle highlight strokes for depth per Appendix AD)
   - Add new optional props per Appendix AD integration plan: `withLabel?: boolean` (default false to preserve existing usages), `compound?: string`, `dose?: string`. When `withLabel` is true, render an SVG-composited wrap-label overlay containing: VIALCHEMS LABS wordmark, `compound` value, `dose` value, verbatim Appendix A.2 RUO disclaimer, and a QR code linking to `/coa/${slug}/${batch}` (requires lightweight QR library ≤10KB gzipped per Iron Law 2.27 — `qrcode-svg` or hand-rolled SVG primitives)
   - Add tests (TDD per Iron Laws 2.1, 2.15): verify `withLabel` prop renders all four label elements; verify aspect ratio change does not break existing usages; verify reduced-motion fallback still works; verify banned compound names (tirzepatide, semaglutide, retatrutide) are rejected by the `compound` prop type system OR validated at runtime against the locked SKU set in `lib/content/products.ts`
   - Verify reduced-motion fallback still works
8. **NEW: Dialog** (`components/ui/Dialog.tsx`):
   - Modal surface with focus trap, esc-to-close, click-outside-close
   - Used in Phase 5 for cancel-order + refund-request flows in `app/account/orders/[id]/AccountOrderDetail.tsx`
   - Render via React Portal (already used in `MobileNavMenu.tsx`)
9. **NEW: Sheet** (`components/ui/Sheet.tsx`):
   - Bottom-sheet drawer for mobile (optional alternative to Dialog on narrow viewports)
10. **NEW: Toast** (`components/ui/Toast.tsx`):
    - Transient feedback surface; `role="alert"` for screen readers; auto-dismiss after 3-5s; manual dismiss button
    - Used to replace `justAdded` Pill state in `AddToCartIsland.tsx`
11. **NEW: Skeleton variants** (`components/ui/Skeleton.tsx`):
    - Text line skeleton, card skeleton, table-row skeleton, image skeleton
    - Used for above-the-fold loading states (per §7.3 "skeleton screens, NOT spinners")
12. **NEW: EmptyState** (`components/ui/EmptyState.tsx`):
    - Standardized empty-state pattern: icon + headline + body + CTA
    - Used for cart-empty, orders-empty, addresses-empty, COA-no-results, shop-no-results
13. **NEW: Badge variants** (`components/ui/Badge.tsx` — distinct from Pill which is for status):
    - Used for category labels, recommended tags, etc.
    - Or extend `Pill` with `kind: 'status' | 'category' | 'tag'` prop — operator chooses; default to extending `Pill`

Tests for every new primitive (RED→GREEN per Iron Law 2.15). Total new tests: ~40-60.

Run `/impeccable polish components/ui/` after each primitive. Iterate.

Save `docs/checkpoints/v4_phase_2_ui_primitives.md` with: per-primitive diff summary, new primitive list with file:line, test count delta, `/impeccable polish` verdicts, accessibility regression check.

`/context-save`

**Verification gate:**
- [ ] All 8 existing primitives elevated visually; all existing tests still pass
- [ ] 6 new primitives shipped (Dialog, Sheet, Toast, Skeleton variants, EmptyState, Badge or extended Pill)
- [ ] Per-primitive RED→GREEN commits in git history
- [ ] `npm test` count increased by ~40-60
- [ ] `npm run build` clean
- [ ] `/impeccable polish` returns no critical issues
- [ ] axe smoke-test on home page (uses Button, Card, Pill) returns 0 violations
- [ ] Reduced-motion fallback verified for Vial drop-shadow + Toast animation
- [ ] Checkpoint artifact written

**Exit criteria:** UI primitives elevated; new primitives available for page polish; a11y unchanged.

### PHASE 3: Page Polish — Homepage (target: 60-90 min)

**Goal:** Polish `app/page.tsx` (home) to match Appendix AC reference set. Use Phase 1 tokens + Phase 2 primitives.

**North Star reload:** §2.18 (no regression), §2.26 (brand locked), §7 specs, Appendix AC.

**Inputs:**
- `app/page.tsx` (current)
- `components/SiteHeader.tsx`, `components/SiteFooter.tsx` (re-rendered on every page; review for elevation candidates)
- Phase 1 + Phase 2 deliverables
- `pbakaus/impeccable` `/shape` for the page

**Deliverables:**

1. Run `/impeccable shape app/page.tsx` to plan UX/UI changes against Appendix AC target
2. Implement (TDD per Iron Law 2.1, 2.15):
   - Hero: refine type rhythm using Phase 1 tokens; consider larger heroXl per operator approval; verify "Counted, weighed, verified." italic accent visual lift
   - 3-column thesis: refine spacing, add subtle Card elevation, consider stagger reveal animation (per §7.4)
   - Recovery Stack CTA strip: refine pricing display, refine button using Phase 2 elevation, add subtle hover state
   - Add atmospheric depth (optional): use new `--gradient-hero-atmospheric` token
3. Update header: use `--shadow-sm` on sticky scroll (operator approval)
4. Update footer: visual consistency with home polish
5. Run `/impeccable critique app/page.tsx` and `/impeccable polish app/page.tsx`. Iterate.
6. Run `/design-review` (gstack) against the polished home. Iterate.
7. Verify accessibility (axe) + Lighthouse spot-check on dev server
8. Save `docs/checkpoints/v4_phase_3_home_polish.md` with: before/after screenshots, `/impeccable` reports, `/design-review` verdict, axe + Lighthouse spot-check
9. `/context-save`

**Verification gate:**
- [ ] Home renders with elevated visuals; all v3.0 content unchanged
- [ ] `npm test` clean (no new tests required for pure visual polish; if tests exist, still pass)
- [ ] `npm run build` clean
- [ ] `/impeccable critique` returns no critical issues
- [ ] `/design-review` passes
- [ ] axe smoke: 0 violations
- [ ] Lighthouse spot-check on dev server: ≥ 90/95/95/95
- [ ] Brand expression unchanged (Iron Law 2.26)
- [ ] Checkpoint artifact written

**Exit criteria:** Home page is a calibrated reference for the rest of page polish; subsequent pages mirror its rhythm.

### PHASE 4: Page Polish — Shop + Product Detail + COA (target: 90-120 min)

**Goal:** Polish `app/shop/page.tsx` + `ShopCatalog.tsx` + `app/products/[slug]/page.tsx` + `AddToCartIsland.tsx` + `ProductTabs.tsx` + `app/coa/page.tsx` + `app/coa/[peptide]/[batch]/page.tsx` to match Appendix AC.

**North Star reload:** Same as Phase 3.

**Subagent-driven (per §4.3):** Dispatch 3 implementer subagents (shop, PDP, COA) using worktree cascade per §4.4 if truly orthogonal.

**Deliverables (per page family):**

1. Shop / catalog:
   - Polish `ProductTile` Card using Phase 2 elevated variant
   - Polish filter chips: refine active state, consider smooth toggle motion
   - Polish search input: use Phase 2 inset shadow on focus
   - Polish sort dropdown: ensure consistent with Input visual lift
   - Replace empty state with `EmptyState` primitive
   - Add Skeleton placeholders for above-the-fold (catalog grid before hydrate)
2. PDP — integrate Appendix AD vial reference:
   - Hero with **labeled Vial** per Appendix AD integration plan: `<Vial withLabel compound={product.shortName} dose={product.dose} size="lg" sway />` so each PDP shows a vial labeled with its own SKU (uses Phase 2 `withLabel` prop). Compound prop value comes from the LOCKED catalog (`lib/content/products.ts`) only — Iron Law 2.7 + 2.11 enforced; tirzepatide/retatrutide names from Appendix AD reference image are NEVER passed.
   - Add QR code rendering near the labeled vial OR in the Specs sidebar that links to `/coa/${product.slug}/${currentBatch}` per Appendix AD §1 (matches the QR pattern observed on the operator's reference label)
   - Reuse the wrap-label visual hierarchy in the PDP Specs sidebar: brand attribution → compound name → dose → batch info (matches the label's information density per Appendix AD §2 Front Label Portion)
   - Price strip using elevated Card variant
   - AddToCartIsland: replace `justAdded` Pill with `Toast` primitive
   - ProductTabs: refine tab indicator, refine COA panel with new Specs `dense` prop, refine Related panel cards
   - Disclaimer box: keep verbatim Appendix A.2 — visual lift only
   - Stack Callout (BPC-157/TB-500 → Recovery Stack): elevated Card
3. COA library + detail — adopt the label hierarchy from Appendix AD:
   - Searchable table: visual lift using elevated Card surface, refine row hover, replace empty state with EmptyState
   - Detail page: adopt the Appendix AD §1 label hierarchy for the COA detail header (BRAND → COMPOUND → DOSE → BATCH → DATES → STATUS); refine "EXAMPLE COA — REPLACE BEFORE LAUNCH" notice (more prominent without being garish); refine Specs grid; refine PDF download button (Phase 2 elevated variant)
   - Optional Phase 4 deliverable per Appendix AD: add a printable-label preview component (`components/PrintableLabel.tsx`) so operators can preview the wrap-label that would print for a given batch directly from the COA detail page. Generates the same SVG composition used in the PDP `<Vial withLabel ... />` hero. Useful for operator pre-launch label-printing fulfillment workflow (Section 4 of Appendix AD reference image — operator-side artifact). NOT required for Phase 4 ship; tag as opt-in.

Per-page: `/impeccable shape` → implement (TDD) → `/impeccable critique` + `/impeccable polish` → `/design-review` → axe + Lighthouse spot-check.

Save `docs/checkpoints/v4_phase_4_shop_pdp_coa.md` with: per-page before/after, subagent reports, `/impeccable` and `/design-review` verdicts.

`/context-save`

**Verification gate:**
- [ ] All catalog/PDP/COA pages elevated; all v3.0 content unchanged
- [ ] `npm test` ≥ baseline (new tests for Toast integration in AddToCartIsland)
- [ ] `npm run build` clean
- [ ] `/impeccable critique` per page returns no critical issues
- [ ] `/design-review` per page passes
- [ ] axe per page: 0 violations
- [ ] Lighthouse spot-check per page: ≥ 90/95/95/95
- [ ] Iron Law 2.5: any change to `lib/content/products.ts` or `lib/content/product-descriptions.ts` (catalog files) ran `/review` + `/cso` first (likely no changes needed; visual lift only)
- [ ] Checkpoint artifact written

**Exit criteria:** Catalog + PDP + COA polish complete; checkout polish unblocked.

### PHASE 5: Page Polish — Checkout + Account + Order (target: 90-120 min)

**Goal:** Polish `app/checkout/{address,method,review,confirm}/page.tsx` + island components + `app/cart/page.tsx` + `app/account/*` + `app/order/[id]/*`.

**North Star reload:** Same as Phase 3 + §2.5 (compliance review gate; checkout touches age gate + jurisdictional + qualification — read-only polish, no logic changes).

**Subagent-driven:** Dispatch checkout-flow polish + account-area polish + order-detail polish in parallel worktrees.

**Deliverables (highlights):**

1. Cart: elevated line-item Cards, EmptyState replacement, refined summary card
2. Checkout/address: refined AddressForm using Phase 2 Input elevation, polished state-block warning, refined Country select disabled state
3. Checkout/method: polished PaymentOption cards with elevated hover, refined Pills, polished sticky summary card
4. Checkout/review: keep verbatim Appendix A.3 age gate text; polish surrounding Card; polish acknowledgment checkboxes; polish summary card; polish Place Order button using Phase 2 primary lift
5. Checkout/confirm: polished Order ID display (mono tabular elevated), polished status Pill, polished Specs grids
6. Account dashboard: polished tile Cards
7. Account/orders + orders/[id]: polished line-item Cards, replace empty state with EmptyState, replace Cancel/Refund inline message with Dialog primitive (Phase 2)
8. Account/addresses + settings: polished form Cards, polished section dividers
9. Order/[id]: polished status Pills, polished Specs grids

Per-page: `/impeccable shape` → implement (TDD if logic touched; visual-only otherwise) → `/impeccable critique` + `/impeccable polish` → `/design-review`.

**CRITICAL — Iron Law 2.5 + 2.19:** Any change to `app/checkout/review/ReviewPanel.tsx` (touches age gate text — locked verbatim) or `components/qualification-flow.tsx` (touches Appendix A.5 attestations — locked verbatim) MUST run `/review` + `/cso` before commit, with `// SCANNER_OK: reviewed-and-cso-passed` annotation. The annotation is auditable — do not use it lightly.

Save `docs/checkpoints/v4_phase_5_checkout_account_order.md`.

`/context-save`

**Verification gate:**
- [ ] All checkout/account/order pages elevated; verbatim compliance copy unchanged
- [ ] `npm test` ≥ baseline (new tests for Dialog integration)
- [ ] `npm run build` clean
- [ ] `/impeccable critique` per page returns no critical issues
- [ ] `/design-review` per page passes
- [ ] axe per page: 0 violations
- [ ] Lighthouse spot-check per page: ≥ 90/95/95/95
- [ ] `/review` + `/cso` ran on any commit touching protected paths; `// SCANNER_OK` annotations present
- [ ] Verbatim Appendix A.3 age-gate text confirmed present in `ReviewPanel.tsx` (grep: `21\\+ years of age`)
- [ ] Verbatim Appendix A.5 attestations confirmed present in `customer-qualification.ts` (grep: `qualified researcher acquiring`)
- [ ] Checkpoint artifact written

**Exit criteria:** Transactional surfaces elevated; compliance copy intact; Phase 6 unblocked.

### PHASE 6: Page Polish — Legal + About + FAQ + Blog + Aux (target: 60-90 min)

**Goal:** Polish `app/legal/{terms,privacy,refunds,shipping,cookies}/page.tsx` + `app/about/page.tsx` + `app/faq/page.tsx` + `app/blog/page.tsx` + `app/blog/[slug]/page.tsx` + `app/contact/page.tsx` + `app/test-reports/page.tsx` + `app/affiliate/page.tsx` + `app/login/page.tsx` + `app/signup/page.tsx` + `app/newsletter/thanks/page.tsx` + `app/error.tsx` + `app/not-found.tsx`.

**Subagent-driven:** Dispatch legal-set + content-set + auxiliary-set in parallel worktrees.

**Deliverables (highlights):**

1. Legal pages (5): refine `LegalShell` typography, refine Quote blocks, refine link styles. Verbatim text UNCHANGED (Iron Law 2.5 — already locked in components).
2. About: keep verbatim Appendix N narrative; refine type rhythm + atmospheric backdrop
3. FAQ: keep verbatim Appendix M Q+A; refine `<details>` styling (smooth disclosure animation honoring reduced-motion; refined `+` rotation marker)
4. Blog index: elevated post-card layout
5. Blog post: refine prose typography (line-height, paragraph spacing), refine citation footnote block, refine "Research-only positioning" callout using Phase 2 elevated Card
6. Contact: refine form layout, polish "We do not respond to dosing questions" notice (Phase 2 elevated Card), polish status messages (Phase 2 Toast for ok/error)
7. Test reports: polish methodology grid, polish portal-link CTA
8. Affiliate: polish commission tier table, polish FTC compliance callout, polish form
9. Login/signup: minimal stub polish (still inactive Day-1 per "Sign-in is not yet active during the public preview" caption — keep that copy)
10. Newsletter/thanks: polish promo code display, polish confirmation Pill
11. Error: polish 500 page
12. Not-found: polish 404 page

Per-page: `/impeccable shape` → implement → `/impeccable critique` + `/impeccable polish` → `/design-review`.

**CRITICAL — Iron Law 2.5 + locked compliance copy:** Any change to verbatim text in `app/legal/*`, `app/about/page.tsx`, `app/faq/page.tsx` is FORBIDDEN. The text is locked. Visual lift is operating on layout/typography/spacing/color around the text, not the text itself. Run `git diff` to verify no text changes after polish; if text changed, revert.

Save `docs/checkpoints/v4_phase_6_legal_content_aux.md`.

`/context-save`

**Verification gate:**
- [ ] All content/legal/aux pages elevated; verbatim text unchanged
- [ ] Verbatim text unchanged check: `git diff HEAD~N -- app/legal/ app/about/page.tsx app/faq/page.tsx | grep -E "^[+-][^+-]"` shows only formatting/className changes, no prose changes
- [ ] `npm test` ≥ baseline
- [ ] `npm run build` clean
- [ ] `/impeccable critique` per page returns no critical issues
- [ ] `/design-review` per page passes
- [ ] axe per page: 0 violations
- [ ] Lighthouse spot-check per page: ≥ 90/95/95/95
- [ ] Checkpoint artifact written

**Exit criteria:** Full route table elevated; motion + a11y + perf phases ready.

### PHASE 7: Motion & Interaction Layer (target: 60-90 min)

**Goal:** Apply consistent motion vocabulary per §7.4 across all elevated pages. Install `motion` (npm) for compound animations. Verify reduced-motion fallback non-negotiable.

**North Star reload:** §7.4, Iron Law 2.18.

**Inputs:**
- All Phases 3-6 deliverables
- Existing CSS keyframes in `app/globals.css` (`vial-sway`, `vial-float`, `vial-sheen`, `reveal-up`)

**Deliverables:**

1. Install `motion`: `npm install motion`
2. Add View Transitions API hooks for page-to-page transitions (use `next/navigation`'s built-in support where stable)
3. Apply stagger reveal to:
   - Catalog tiles (60-80ms per item, 320ms duration; honors reduced-motion)
   - COA table rows
   - Blog post list
   - FAQ disclosure expand
4. Apply hover unfurl to all `interactive` Card variants (already 200ms, premium-out; verify consistency)
5. Apply sheen sweep to Recovery Stack CTA on initial paint (one-time per session via sessionStorage flag)
6. Apply micro-interactions:
   - Add-to-cart: Toast slide-in from top-right (3s auto-dismiss)
   - Place-order: button scale + brief loading state
   - Newsletter signup: form-row collapse, success message fade-in
7. Verify reduced-motion fallback (Iron Law non-negotiable):
   - Test with `prefers-reduced-motion: reduce` set in browser
   - All animations disabled via existing `app/globals.css:165-172` rule
   - Add tests if any new animations introduced via `motion` library (motion respects `useReducedMotion()`)
8. Performance check: bundle audit after `motion` install. Target: motion adds ≤ 50KB to initial JS bundle. If exceeded, switch to `motion/react/lazy` for lazy-load.
9. Save `docs/checkpoints/v4_phase_7_motion.md` with: bundle delta, motion-vs-CSS decisions per surface, reduced-motion verification screenshots, performance impact

`/context-save`

**Verification gate:**
- [ ] `motion` installed and used only where CSS is insufficient
- [ ] Bundle increase ≤ 50KB initial JS gzipped
- [ ] Reduced-motion fallback verified for every new animation
- [ ] `npm test` ≥ baseline
- [ ] `npm run build` clean
- [ ] Lighthouse perf score: ≥ 90 on home + shop + PDP + checkout (motion shouldn't regress LCP/CLS)
- [ ] Checkpoint artifact written

**Exit criteria:** Motion vocabulary applied consistently; performance budget intact.

### PHASE 8: Accessibility Lift (target: 60-90 min)

**Goal:** Lift accessibility to WCAG 2.1 AA + axe-clean (0 critical or serious violations) on every page.

**North Star reload:** §7.2, Iron Law 2.27.

**Deliverables:**

1. Install `@axe-core/playwright`: `npm install --save-dev @axe-core/playwright`
2. Add axe smoke test per page in `tests/e2e/a11y.spec.ts` (initially `test.skip(true)` until Phase 11 unskips)
3. Add `axe-core` integration to Lighthouse CI config (Phase 11)
4. Manual audit pass per page:
   - Heading hierarchy sequential (h1 → h2 → h3, no skips)
   - All interactive elements keyboard-reachable
   - Focus rings visible (existing global `*:focus-visible` 2px solid accent rule covers this)
   - Skip-to-content link present (existing in `app/layout.tsx:61-63`)
   - Screen-reader smoke: home, PDP, checkout review, COA detail
   - Form labels associated (existing pattern; verify)
   - Error messages reference field by name (existing in Input.tsx + qualification-flow.tsx)
   - Status pills carry text label (existing pattern)
   - Color contrast ≥ 4.5:1 body, ≥ 7:1 primary text (Posture A locked colors verified in Phase 4 v3.0)
5. Add aria-live polite regions:
   - Cart count: existing `aria-live="polite"` in `CartCount.tsx:24` ✓
   - Checkout step transitions: add aria-live to step indicator
   - Toast component (Phase 2): role="alert" already implied
6. Reduced-motion + reduced-data verification
7. Save `docs/checkpoints/v4_phase_8_accessibility.md` with: per-page axe report, manual audit findings, fixes applied, screen-reader smoke notes

`/context-save`

**Verification gate:**
- [ ] axe per page: 0 critical, 0 serious violations
- [ ] Manual audit per page complete
- [ ] `npm test` ≥ baseline (new a11y test file in tests/e2e/, currently test.skip until Phase 11)
- [ ] `npm run build` clean
- [ ] Lighthouse a11y score ≥ 95 every page
- [ ] Checkpoint artifact written

**Exit criteria:** A11y baseline locked; Phase 11 CI gate will enforce.

### PHASE 9: Performance + SEO Lift (target: 90-120 min)

**Goal:** Lift Lighthouse Performance ≥ 90 on every page (mobile + desktop). Add structured data per §7.5. Bundle audit.

**North Star reload:** §7.1, §7.5, §7.6, Iron Law 2.27.

**Deliverables:**

1. Install `@next/bundle-analyzer`: `npm install --save-dev @next/bundle-analyzer`
2. Run bundle analysis: `ANALYZE=true npm run build`. Identify per-route JS bundles. Target: initial ≤ 250KB gzipped per route.
3. Image audit: every `<img>` uses `next/image` with explicit `width` + `height` (CLS prevention). Vialchems uses zero photos Day-1 (per Iron Law 2.10) — only Vial SVG + COA PDFs + 5 default Next.js scaffold SVGs in `public/`. Audit confirms.
4. Font audit: confirm `next/font/google` subsetting (already done in `app/layout.tsx`)
5. Add structured data:
   - `app/products/[slug]/page.tsx`: emit JSON-LD `Product` schema in `<head>` via metadata or inline `<script type="application/ld+json">`
   - `app/products/[slug]/page.tsx` + `app/shop/page.tsx` + `app/coa/[peptide]/[batch]/page.tsx`: emit JSON-LD `BreadcrumbList`
   - `app/blog/[slug]/page.tsx`: emit JSON-LD `Article`
   - `app/faq/page.tsx`: emit JSON-LD `FAQPage`
6. Add sitemap: `app/sitemap.ts` returning all 38 routes with appropriate priorities
7. Add robots.txt: `public/robots.txt` (allow all, sitemap reference)
8. Add `app/opengraph-image.tsx` using `next/og` for default OG image (dark bg, Vialchems wordmark, Plex Mono metadata strip; per architecture plan §4 Phase 4) PLUS per-product OG images per Appendix AD integration plan: emit 8 product OG images (7 SKUs + Recovery Stack bundle) showing the labeled vial design from Appendix AD §1, referenced via `generateMetadata` in `app/products/[slug]/page.tsx`. Per Iron Law 2.27, total OG asset bundle stays within performance budget.
9. Verify Lighthouse per page (manual + CI in Phase 11):
   - LCP < 2.5s on 4G mobile
   - CLS < 0.1
   - INP < 200ms
   - FCP < 1.8s
   - TTFB < 800ms
10. Save `docs/checkpoints/v4_phase_9_performance_seo.md` with: bundle analysis, structured data verification (paste rendered JSON-LD), sitemap output, Lighthouse spot-check per page

`/context-save`

**Verification gate:**
- [ ] Per-route initial JS ≤ 250KB gzipped
- [ ] Per-route initial CSS ≤ 80KB gzipped
- [ ] Structured data validates via Google Rich Results Test (manual)
- [ ] sitemap.xml + robots.txt present and correct
- [ ] OG image renders correctly (manual check via dev server)
- [ ] Lighthouse per page: Perf ≥ 90, A11y ≥ 95, SEO ≥ 95, Best Practices ≥ 95
- [ ] LCP/CLS/INP within budgets
- [ ] Checkpoint artifact written

**Exit criteria:** Performance budget locked; SEO surface complete; Phase 11 CI gate will enforce.

### PHASE 10: Services Wiring (target: 120-180 min)

**Goal:** Wire every external service to real credentials (Supabase, Resend, Sentry, Plaid, BTCPay, cookie consent). Operator-side intake via Appendix AA.

**North Star reload:** §1.5, §2.5 + §2.19 (protected paths), §2.22 (no real creds in source), §2.23 (cookie consent), §6.1 (PENDING decisions), Appendix AA.

**Subagent-driven:** Dispatch 6 parallel worktrees: Supabase + Resend + Sentry + Plaid + BTCPay + Cookie Consent.

**OPERATOR GATE:** Before this phase begins, agent presents Appendix AA (Operator Credential Intake Form) to operator. Operator completes the form with real credentials. Without operator-completed form, agent halts.

**Deliverables (per service, with `/review` + `/cso` gates per Iron Law 2.5 + 2.19):**

#### 10.1 Supabase

1. Operator provisions Supabase project; provides URL + anon key + service-role key via Appendix AA
2. Agent writes `supabase/migrations/v4_001_initial_schema.sql` per architecture plan §4 (15 tables: vendors, products, product_variants, bundles, coa_documents, customer_profiles, customer_attestations, customer_qualifications, orders, order_items, order_status_history, payments, email_subscriptions, affiliate_creators, affiliate_payouts, blog_posts, audit_log)
3. Agent writes `supabase/migrations/v4_002_rls_policies.sql` per architecture plan §4 RLS rules
4. Apply migrations: `npx supabase migration up` (or operator runs via dashboard if CLI unavailable)
5. Port `lib/supabase/{server,browser,service}.ts` from Mogtrix pattern (per architecture plan §3); add attribution comment per Iron Law 2.12
6. Wire `app/auth/{actions,callback}/route.ts` for magic-link flow
7. Wire `app/api/access/route.ts` (qualification persistence) — joins protected paths (Iron Law 2.19)
8. Connect `lib/cart-store.ts` to optional Supabase persistence (deferred Day-1; v4 keeps localStorage primary; Supabase secondary for logged-in users)
9. Tests: TDD per Iron Law 2.1; commit format per Iron Law 2.15
10. `/review` + `/cso` before commit per Iron Law 2.5; `// SCANNER_OK: reviewed-and-cso-passed` annotation

#### 10.2 Resend

1. Operator provisions Resend account; verifies `vialchems.labs` (or `mail.vialchems.labs`) sender domain; provides API key via Appendix AA
2. Operator configures DMARC `p=reject` policy on the sending domain
3. Agent wires `lib/resend.ts` (server-only client init)
4. Update `app/api/newsletter/subscribe/route.ts` to call Resend `emails.send` for Email 1 of welcome sequence (lead magnet delivery)
5. Schedule Emails 2/3/4 at +3/+7/+14 days via Supabase `email_subscriptions` row + cron job (or Resend's scheduled-email feature if available)
6. Generate Reconstitution and Storage Guide PDF (5 pages, neutral research content; use existing email-template content as basis). Place at `public/lead-magnet/reconstitution-and-storage-guide.pdf`
7. Wire order confirmation email at order-placement (currently no real persistence; Supabase wiring above enables this)
8. Tests + `/review` per Iron Law 2.5

#### 10.3 Sentry

1. Operator provisions Sentry org + project; provides DSN + auth token + org slug + project slug via Appendix AA
2. Agent runs `npx @sentry/wizard@latest -i nextjs` (or manual config)
3. Wire `next.config.ts` with `withSentryConfig` HOC (currently empty; this is the deferred-from-v3.0 task)
4. Wire `lib/sentry.ts` (init, alert thresholds) — joins protected paths (Iron Law 2.19)
5. Update `app/error.tsx` Sentry capture (currently void-out; activate)
6. Configure Sentry alerts (operator-side via Sentry dashboard):
   - Error rate > 1% → email
   - Payment-flow error rate > 0.1% → page (PagerDuty or SMS)
   - Webhook signature verification failure → page immediately
   - New error type detected (no occurrences in last 24h) → email
   - Performance alert: LCP > 4s on /shop or /products/[slug] → email
7. Tests: trigger a test error, verify Sentry receives within 2 minutes (manual + automated test)

#### 10.4 Plaid

1. Operator provisions Plaid account (sandbox first; production after smoke test); provides client ID + secret + webhook verification key via Appendix AA
2. Agent updates `lib/payments/plaid.ts` to implement real `createIntent` (Plaid Link token + Transfer flow)
3. Migrate webhook signature verification from HMAC (current scaffold) to JWT/JWKS (Plaid production scheme). This is the deferred-from-v3.0 Phase 10 work flagged in Phase 13 codex review.
4. Test in sandbox: full Link flow → Transfer create → webhook receive → reconciliation apply
5. `/review` + `/cso` + `/codex review` per Iron Law 2.5; `// SCANNER_OK: reviewed-and-cso-passed`

#### 10.5 BTCPay

1. Operator chooses self-host (Docker) OR Voltage Cloud (PENDING decision; Appendix AA)
2. If self-host: agent writes `scripts/btcpay-setup.sh` (Docker compose for BTCPay Server + LND backend); operator provisions
3. If Voltage Cloud: operator provisions via Voltage dashboard
4. Operator provides BTCPay URL + API key + store ID + webhook secret via Appendix AA
5. Agent updates `lib/payments/btcpay.ts` to implement real `createIntent` (Greenfield POST `/api/v1/stores/{storeId}/invoices`)
6. Test in BTCPay testnet store: full invoice flow → payment → webhook receive → reconciliation apply
7. `/review` + `/cso` + `/codex review` per Iron Law 2.5

#### 10.6 Cookie consent

1. Agent presents PENDING decision (provider choice) to operator. Default: self-hosted. Confirm via Appendix AA.
2. Implement `components/CookieConsent.tsx` + `lib/consent-store.ts` (Zustand + localStorage persist) — both join protected paths (Iron Law 2.19)
3. Integrate in `app/layout.tsx` (renders banner on first visit; persists choice; respects GPC signal as opt-out)
4. Update `app/legal/cookies/page.tsx` to link to consent management UI
5. Tests: GPC honored, persistence works, accept-all/customize/reject-all flows
6. `/review` + `/cso` per Iron Law 2.5

Save `docs/checkpoints/v4_phase_10_services_wiring.md` with: per-service wiring summary, credential intake confirmation (operator name only — no actual credentials in checkpoint), `/review` + `/cso` outcomes, RED→GREEN commit log per service, `// SCANNER_OK` annotation log.

`/context-save`

**Verification gate:**
- [ ] All 6 services wired with real credentials in `.env.local` (NEVER committed per Iron Law 2.22)
- [ ] Vercel env vars set for production (operator runs `vercel env add` per Appendix AA)
- [ ] Supabase migrations applied; RLS policies active; `app/api/access/route.ts` live
- [ ] Resend Email 1 sends on real test signup
- [ ] Sentry receives a manually-triggered test error
- [ ] Plaid sandbox flow E2E succeeds
- [ ] BTCPay testnet flow E2E succeeds
- [ ] Cookie consent banner renders, GPC honored, choice persists
- [ ] All `/review` + `/cso` + `/codex review` gates passed for protected-path commits
- [ ] `// SCANNER_OK: reviewed-and-cso-passed` annotations present in commit log
- [ ] `npm test` passes (new tests for service wiring; existing tests unaffected)
- [ ] `npm run build` clean (Sentry instrumentation now compiles)
- [ ] No real credentials in committed source (`grep -r 'sk_' lib/ app/ components/` returns 0 hits; `grep -rE 'production|prod_secret' lib/ app/ components/` audited)
- [ ] Checkpoint artifact written

**Exit criteria:** All external services live; protected-paths additions reviewed; Phase 11 CI activation unblocked.

### PHASE 11: E2E Unskip + Lighthouse CI Gate Activation (target: 60-90 min)

**Goal:** Unskip Playwright E2E tests, provision browsers in CI, activate Lighthouse CI as PR-blocking gate, capture visual-regression baseline.

**North Star reload:** Iron Laws 2.18, 2.24, 2.25, 2.27.

**Deliverables:**

1. Provision Playwright browsers locally + CI:
   - Local: `npx playwright install --with-deps`
   - CI: GitHub Actions workflow `.github/workflows/test.yml` runs `npx playwright install --with-deps` before `npm run test:e2e`
2. Unskip `tests/e2e/checkout-{ach,crypto}.spec.ts`:
   - Remove `test.skip(true, '...')`
   - Add Playwright `webServer` block in `playwright.config.ts` to start dev server
   - Add CI step that fails on any `test.skip(true, ...)` or `test.only(...)` per Iron Law 2.24:
     ```bash
     ! grep -rE 'test\.(skip\(true|only\()' tests/e2e/
     ```
3. Capture visual-regression baseline:
   - Add `tests/e2e/visual.spec.ts` covering all 38 routes at 3 viewports × 2 color schemes (Vialchems is dark-only but capture both for future-proof)
   - Run baseline: `npx playwright test tests/e2e/visual.spec.ts --update-snapshots`
   - Operator approves baseline (Appendix Y procedure)
   - Commit `tests/e2e/__screenshots__/`
4. Set up Lighthouse CI:
   - Install: `npm install --save-dev @lhci/cli`
   - Config: `.lighthouserc.cjs` at repo root with assertion thresholds per §7.1
   - Workflow: `.github/workflows/lighthouse.yml` runs LHCI on every PR; uploads results to Lighthouse CI server (or operator's Vercel Preview)
   - Per-page assertions block PR if below threshold
5. Visual-regression CI integration:
   - Workflow: `.github/workflows/visual.yml` runs Playwright visual suite on every PR; posts diff as PR comment artifact; requires operator approval review state if diffs above threshold (Iron Law 2.25)
6. Update `package.json` scripts:
   - `test:e2e:ci` (with browser install + dev-server fixture)
   - `test:visual` (visual-regression suite)
   - `test:lighthouse` (LHCI run)
   - `preflight` extended to include `test:e2e:ci` for pre-push hook
7. Tests: verify CI workflows pass on a no-op PR (operator can run manually)
8. Save `docs/checkpoints/v4_phase_11_ci_gates.md` with: workflow YAML excerpts, baseline screenshot count, Lighthouse baseline scores per page, CI run evidence

`/context-save`

**Verification gate:**
- [ ] Playwright browsers installed locally
- [ ] E2E tests unskipped; both `checkout-{ach,crypto}` pass against dev server with stub adapter
- [ ] No `test.skip(true)` or `test.only(...)` in `tests/e2e/`
- [ ] Visual-regression baseline captured for 38 routes × 3 viewports × 2 color schemes (228 snapshots)
- [ ] Operator approves baseline (Appendix Y attestation in checkpoint)
- [ ] Lighthouse CI runs and reports per-page scores
- [ ] All Lighthouse assertions pass at baseline (Perf ≥ 90, A11y ≥ 95, SEO ≥ 95, Best Practices ≥ 95 every page)
- [ ] GitHub Actions workflows committed: `.github/workflows/{test,lighthouse,visual}.yml`
- [ ] `npm run preflight` includes new gates
- [ ] Checkpoint artifact written

**Exit criteria:** All CI gates active; Phase 12 deploy unblocked.

### PHASE 12: Domain + DNS + Vercel Production Deploy (target: 60-90 min)

**Goal:** Register `vialchems.labs` (or fallback), point DNS to Vercel, deploy production, configure branch protection.

**OPERATOR GATE:** Operator confirms domain registrar choice + completes domain purchase (Appendix AA + Appendix Z pre-launch checklist). Without registered domain, agent halts (Vercel deploy proceeds against fallback `*.vercel.app` URL but production launch waits for DNS).

**Deliverables:**

1. Domain registration:
   - Operator registers `vialchems.labs` via 101domain or Gandi (Appendix AA pre-confirmed registrar)
   - If `.labs` unavailable: fallback to `vialchems.com` or `vialchems.bio`
   - Update `NEXT_PUBLIC_SITE_URL` env in Vercel
2. Vercel project link + env-var rotation:
   - `vercel link` (interactive; operator account)
   - For every env var listed in Phase 14 procedure of v3.0's `phase_14_deploy.md`: `vercel env add <NAME> production`
   - Operator pastes real values for each (Appendix AA pre-collected)
3. Production deploy: `vercel --prod`
4. Custom domain: `vercel domains add vialchems.labs`; operator points DNS at Vercel target (A or CNAME)
5. Verify production URL:
   - `curl https://vialchems.labs/api/health` returns 200 with expected JSON
   - Browser smoke: home renders, shop loads, PDP loads, checkout starts, COA detail renders, FAQ accordion expands, legal pages load, footer disclaimer visible on every page
6. Branch protection (operator runs via GitHub UI; agent provides instructions):
   - `main` branch protected; require PR + 1 reviewer approval
   - Require status checks: `test`, `test-e2e-ci`, `lighthouse`, `visual` (all four CI workflows)
   - Require operator review for visual-regression diffs above threshold (Iron Law 2.25)
   - Block force-push; block direct push to main
7. `/ship` (gstack) bumps VERSION to `1.1.0` (or higher per SemVer of v4 changes), writes `CHANGELOG.md` v1.1.0 entry, runs pre-merge tests, creates PR
8. Tag the production release: `git tag v1.1.0 && git push --tags`
9. Save `docs/checkpoints/v4_phase_12_deploy.md` with: deploy URL, env-var rotation log (var names only — no values per Iron Law 2.22), DNS setup confirmation, smoke-test evidence, branch protection screenshot, VERSION bump confirmation

`/context-save`

**Verification gate:**
- [ ] `vialchems.labs` (or fallback) registered and DNS-pointed at Vercel
- [ ] Production deploy succeeds; `/api/health` returns 200
- [ ] Smoke test of full user journey on production passes (home → shop → PDP → cart → checkout → review → confirm)
- [ ] All real credentials in Vercel env vars; `.env.local` mirrors for local dev
- [ ] No real credentials in any git history (operator audits via `git log -p --all | grep -E 'sk_(live|test)|production_secret'` returns 0 hits)
- [ ] Branch protection active per checklist
- [ ] VERSION bumped, CHANGELOG written, git tag pushed
- [ ] Checkpoint artifact written

**Exit criteria:** Site is live at production URL; all CI gates active; Phase 13 verification unblocked.

### PHASE 13: Post-Deploy Verification — Real Payment Tests + Canary + Documentation (target: 90-150 min)

**Goal:** Verify production with real-money payment tests. Run 2-hour canary monitoring. Update documentation. Schedule retro.

**OPERATOR GATE:** Operator funds the first-buyer test dollar ($1 of catalog via real BTCPay invoice + $1 of catalog via real Plaid ACH). Without operator funding, agent halts.

**Deliverables:**

1. Real-payment test (operator-funded):
   - BTCPay path: operator places $1 order via crypto checkout; agent monitors webhook receipt + reconciliation + order email
   - Plaid path: operator places $1 order via ACH checkout; agent monitors webhook receipt + reconciliation + order email
   - Verify Sentry receives no errors during these flows
   - Verify Supabase `orders` row inserted with correct status transitions (pending → paid)
   - Verify Resend sends order confirmation email to operator's address
2. Canary monitoring (gstack `/canary` 2-hour window):
   - `/api/health` polled every 10 minutes
   - Sentry Issues dashboard monitored; rate < 1%, payment-flow rate < 0.1%
   - Lighthouse spot-check at 30/60/90/120 minutes
   - Auto-rollback triggers documented per v3.0 Phase 15.1 (any /api/health non-200 for >1 min, Lighthouse Perf < 80, Sentry rate > 5% for >5 min, payment webhook signature failure, DB connection failure)
3. Sentry alert verification:
   - Trigger test error via malformed `/api/contact` POST; verify Sentry catches within 2 minutes
   - Verify alert fires (email to operator)
4. Documentation update (`/document-release`):
   - `README.md`: add live URL, deploy date
   - `CHANGELOG.md` v1.1.0: deploy timestamp added
   - `ARCHITECTURE.md` (new file at root): copy + edit `docs/superpowers/plans/2026-05-08-architecture.md` updated for v4 wiring state
   - `docs/operator-runbook.md` v2: strike-through closed deferrals, add post-launch operator workstreams
5. Schedule Week +1 retro:
   - Calendar reminder for `2026-05-09` + 7 days
   - Retro template: what landed cleanly, what surprised, Sentry error patterns, Lighthouse regressions, Tier S creator response rates, first paid orders from strangers (Bible §15 success criterion)
6. Save `docs/checkpoints/v4_phase_13_post_deploy.md` with: real-payment test evidence (operator's order IDs), canary log, Sentry alert verification, documentation update diff, retro scheduling confirmation

`/context-save`

**Verification gate:**
- [ ] Real BTCPay $1 test order: invoice created → paid → webhook applied → order confirmed
- [ ] Real Plaid ACH $1 test order: transfer initiated → webhook applied → order confirmed (note: ACH clears in 3-4 days; verify webhook applies on initial events, then settle confirmation later)
- [ ] Sentry receives test error within 2 minutes; alert email delivered to operator
- [ ] Canary 2-hour window: 0 critical failures, 0 auto-rollback triggers
- [ ] README + CHANGELOG + ARCHITECTURE.md + operator-runbook v2 updated and committed
- [ ] Week +1 retro scheduled
- [ ] Checkpoint artifact written

**Exit criteria:** Site is live, payment-verified, monitored, documented; operator handoff unblocked.

---

## 9. VERIFICATION GATES (summary table)

| Phase | Gate |
|---|---|
| 0 | Codebase audit clean, agentic toolkit installed (Appendix X.1 P0+P1), deferral inventory matches operator-runbook |
| 1 | Tokens additively extended; existing tokens unchanged; `/impeccable critique` clean |
| 2 | UI primitives elevated; new primitives shipped; per-primitive RED→GREEN commits; axe smoke clean |
| 3 | Home polished; `/design-review` passes; Lighthouse spot-check ≥ 90/95/95/95 |
| 4 | Catalog/PDP/COA polished; `/design-review` per page passes; Lighthouse spot-check ≥ 90/95/95/95 |
| 5 | Checkout/account/order polished; protected-path commits passed `/review` + `/cso`; verbatim compliance copy unchanged |
| 6 | Legal/about/FAQ/blog/aux polished; verbatim text unchanged (`git diff` audited) |
| 7 | Motion vocabulary applied; reduced-motion verified; bundle ≤ 250KB initial JS gzipped |
| 8 | A11y per page: 0 critical/serious axe; manual audit complete; Lighthouse a11y ≥ 95 |
| 9 | Bundle audited; structured data validates; sitemap + robots.txt + OG image ready; Lighthouse perf ≥ 90 |
| 10 | All 6 services wired; protected-paths reviewed (`// SCANNER_OK`); no real creds in source |
| 11 | E2E unskipped; visual-regression baseline captured + operator-approved; Lighthouse CI active; all 4 GitHub Actions workflows committed |
| 12 | Production deploy live; DNS pointed; branch protection active; v1.1.0 tagged |
| 13 | Real-payment tests succeed; canary 2-hour clean; docs updated; retro scheduled |

---

## 10. APPENDICES

**Appendix index (30 total — 23 carried verbatim or as reference-locks from v3.0; 7 new for v4):**

- A. Verbatim Compliance Contract (REFERENCE LOCK)
- B. Enforcement Pattern Checklist
- C. Enforcement Events Register
- D. Brand (LOCKED — Vialchems Labs Posture A)
- E. Catalog (LOCKED — 7 SKUs + Recovery Stack)
- F. Payment Stack (LOCKED — BTCPay + Plaid Day-1)
- G. Site IA Blueprint (REFERENCE)
- H. Mogtrix Reference List (HISTORICAL)
- I. Acquisition Runbook (REFERENCE — `docs/operator-runbook.md`)
- J. Blog Topic Seed (REFERENCE — already shipped)
- K. Email Welcome Sequence (LOCKED)
- L. Verbatim Legal Pages (LOCKED)
- M. FAQ (LOCKED)
- N. About Page Narrative (LOCKED)
- O. Footer Template (LOCKED)
- P. Marketing Language Safety (LOCKED — patterns in code)
- Q. Industry Position (CONTEXT)
- R. Trust Signal References (REFERENCE)
- S. GLP-1 Obfuscation Anti-Pattern
- T. Skill Adaptation Policy (REFERENCE)
- U. Security Threat Model (EXTENDED for v4)
- V. Vendor-Archetype Design Reasoning Rules
- W. Pre-Delivery Checklist (EXTENDED for v4)
- X. **Research Toolkit Application Matrix (NEW — split into X.1 Agentic 61 entries + X.2 Site-Side 38 entries = 99 total)**
- Y. **Visual-Regression Baseline (NEW)**
- Z. **Production Pre-Launch Checklist (NEW)**
- AA. **Operator Credential Intake Form (NEW)**
- AB. **Deferral Ledger D1-D27 (NEW)**
- AC. **UI Elevation Reference Set (NEW)**
- AD. **Vial Reference Image Analysis + Integration Plan (NEW — operator-supplied 2026-05-09)**

### Appendix A — Verbatim Compliance Contract (REFERENCE LOCK)

The compliance contract is LOCKED in code:
- Footer disclaimer (every page): `components/SiteFooter.tsx:103-118` — verbatim from v3.0 Appendix A.1
- Product page disclaimer (every PDP): `app/products/[slug]/page.tsx:188-201` — verbatim from v3.0 Appendix A.2
- Age gate text-checkbox at first cart action: `app/checkout/review/ReviewPanel.tsx:196-208` — verbatim from v3.0 Appendix A.3
- Jurisdictional restriction copy: `app/legal/shipping/page.tsx` and `app/legal/terms/page.tsx` — verbatim from v3.0 Appendix A.4
- 7 buyer-qualification attestations: `lib/customer-qualification.ts:41-49` (`ATTESTATIONS` const) — verbatim from v3.0 Appendix A.5
- Customer-service vocabulary clause: `app/legal/terms/page.tsx` Quote block — verbatim from v3.0 Appendix A.6
- CS auto-replies (dosing, lost package): `lib/content/email-templates.ts:113-130` — verbatim from v3.0 Appendix A.6

DO NOT modify any of the above without operator-issued LOCKED_OVERRIDE per §6.3. v4 visual elevation operates on layout/typography/spacing AROUND this text, never on the text.

### Appendix B — Enforcement Pattern Checklist (DO-NOT-DO)

Reference v3.0 Appendix B in `/root/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md` lines 1116-1155. The 22-event aggregate of FDA + DOJ + ITC enforcement events. v4 carries forward unchanged.

Key prohibitions enforced in code via `lib/compliance.ts` patterns:
- No disease names, no therapeutic-action verbs, no dosing protocols, no approved-pharmaceutical comparisons
- No "helps in" / "reduces" unhedged claims
- No before/after imagery (vendor-side; affiliate creators are separate liability layer)
- No reconstitution kit bundling, no BAC water "for Injection" labeling, no GLP-1-obfuscated SKU codes
- No "research only" disclaimer paired with named-disease claims (FDA reads holistically per 21 CFR 201.128)

### Appendix C — Enforcement Events Register (REFERENCE)

Reference v3.0 Appendix C lines 1156-1209. 19 FDA warning letters + 3 DOJ guilty pleas + 1 ITC General Exclusion Order. v4 carries forward as historical reference; no new enforcement events to incorporate this round (operator monitors quarterly per v3.0 Phase 15 retro cadence).

### Appendix D — Brand (LOCKED — Vialchems Labs Posture A)

LOCKED per Iron Law 2.26. Source-of-truth files:
- `lib/content/site.ts` — siteConfig (name, brandStem, domain, url, description, tagline, posture)
- `lib/design/tokens.ts` — color/typography/spacing/radius/motion/zIndex tokens
- `app/globals.css` — CSS custom properties mirror
- `app/layout.tsx` — IBM Plex Sans/Mono + Newsreader Italic font loading

Brand attributes (do NOT change without operator LOCKED_OVERRIDE):
- Name: Vialchems Labs
- Posture: A (clean clinical) per v3.0 Appendix V.2
- Domain: vialchems.labs (literal `.labs` TLD; fallback vialchems.com)
- Tagline: "Counted, weighed, verified."
- Wordmark: "Vialchems" (Plex Sans 600) + "LABS" chip (Plex Mono 500 uppercase 0.16em tracking, accent border)
- Colors: charcoal `--bg #0a0e0f`, surface `--surface #141a1c`, accent `--accent #3dd4c8` (teal), text `rgba(255,255,255,0.92)`, full token map in `lib/design/tokens.ts`
- Type: IBM Plex Sans (300/400/500/600/700) + IBM Plex Mono (300/400/500/600) + Newsreader Italic (400i, hero pull-quotes only)
- Anti-patterns enforced (Appendix V.2 + Phase 4 v3.0): NO Geist/Inter/Roboto/Space Grotesk primary, NO purple/violet gradients, NO 3-column SaaS feature grid, NO bubble-radius on every element, NO stock-photo lab interiors, NO before/after photography, NO emoji icons (Lucide React only), NO acid-green (Mogtrix choice), NO meme-imagery in product photography

### Appendix E — Catalog (LOCKED — 7 SKUs + Recovery Stack bundle)

LOCKED per `STAGE6_MANIFEST.yaml:53-76` (`opening_sku_set: LOCKED_DEFAULT`). Source-of-truth: `lib/content/products.ts` (catalog metadata) + `lib/content/product-descriptions.ts` (verbatim 336-345 word descriptions per v3.0 Appendix E.1).

| # | SKU | Format | List | Per-mg | Position | Role |
|---|---|---|---|---|---|---|
| 1 | BPC-157 10mg | vial | $54.00 | $5.40 | 10% below median | loss-leader |
| 2 | TB-500 5mg | vial | $34.00 | $6.80 | 5% below median | loss-leader |
| 3 | GHK-Cu 50mg | vial | $34.00 | $0.68 | 9% below median | loss-leader |
| 4 | Ipamorelin 10mg | vial | $50.00 | $5.00 | just below p25 | volume driver |
| 5 | CJC-1295 (no DAC) 5mg | vial | $25.00 | $5.00 | just below p25 | volume driver |
| 6 | MOTS-c 10mg | vial | $48.00 | $4.80 | median | catalog filler |
| 7 | Selank 10mg | vial | $48.00 | $4.80 | just below median | catalog filler |

Bundle: Recovery Stack (BPC-157 10mg + TB-500 5mg) at $77.00 (12.5% effective discount).
Intro promo: WELCOME15 (15% off first order via newsletter signup, gated by RUO ack + age gate).

DO NOT modify catalog or descriptions in v4 (visual lift only). KPV expansion is operator-side Day-30+ per operator-runbook §11.

Iron Law 2.7 + 2.14 enforcement: NO BAC water, NO tirzepatide, NO semaglutide, NO retatrutide, NO syringes, NO reconstitution kits.

### Appendix F — Payment Stack (LOCKED — BTCPay + Plaid Day-1, cards Phase-2)

LOCKED per `STAGE6_MANIFEST.yaml:113-142` (`payment_stack: LOCKED_DEFAULT`). Source-of-truth: `lib/payments/types.ts` (`PaymentProviderId = 'stub' | 'btcpay' | 'plaid'` — FROZEN per Iron Law 2.20) + `lib/payments/config.ts` (registry with Stripe/PayPal/Square/Shopify fallback to `'stub'` proven in tests).

Day-1 (v3.0 + v4 production):
- Tier 1 crypto: BTCPay Server self-hosted OR Voltage Cloud (BTC, LTC; optional ETH); 15% discount; v4 Phase 10 wires real
- Tier 2 bank: Plaid ACH; 5% discount; 3-4 day clearance; v4 Phase 10 wires real (HMAC→JWKS migration)

Phase 2 (Day 90+ post first revenue signal): MAX/MESH/Rocketfuel cards. NOT in v4 scope.

Forbidden rails (Iron Law 2.9): Stripe direct, PayPal direct, Square direct, Shopify-Payments. Verified via `tests/unit/payments/config.test.ts:23-28`.

### Appendix G — Site IA Blueprint (REFERENCE — already implemented)

Reference v3.0 Appendix G + `app/**/page.tsx` (38 routes). v4 does NOT add new pages; only polishes existing ones. Route table is FROZEN unless operator instructs new page additions.

### Appendix H — Mogtrix Reference List (HISTORICAL)

Reference v3.0 Appendix H. The Mogtrix codebase at `/root/mogtrix-website/` was the v3.0 pattern source. v4 does NOT need to re-read Mogtrix for new patterns — the patterns ported in Phase 3 v3.0 are already in `lib/payments/`, `lib/compliance.ts`, `lib/customer-qualification.ts`, `lib/attestations.ts`, `lib/cart-store.ts`, etc., with attribution comments per Iron Law 2.12.

If Phase 10 needs to port a new pattern from Mogtrix (e.g., a refined Supabase Auth flow), follow the same READ + ADAPT + ATTRIBUTE protocol per Appendix T.

### Appendix I — Acquisition Runbook (REFERENCE — `docs/operator-runbook.md`)

Reference v3.0 Appendix I + `/root/peptide-site/docs/operator-runbook.md`. v4 does NOT regenerate the runbook from scratch; v4 Phase 13 updates it (strikethrough closed deferrals, add post-launch operator workstreams) and outputs `docs/operator-runbook.md` v2.

Slice 3 (community channels: Reddit/Meso-Rx/forums/Telegram/Discord) remains PLACEHOLDER. Operator-side ChatGPT Pro Deep Research run; runbook re-regenerates after operator fires the B1 prompt at `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md`.

### Appendix J — Blog Topic Seed (REFERENCE — already shipped)

Reference v3.0 Appendix J + `lib/content/blog.ts` (5 long-form posts at 1500-1588 words each, 6 PubMed citations each). v4 does NOT add new posts (post-launch operator cadence per runbook §10).

### Appendix K — Email Welcome Sequence (LOCKED — already in code)

LOCKED in `lib/content/email-templates.ts` (`emailWelcomeSequence` array — 4 emails verbatim from v3.0 Appendix K). v4 Phase 10 wires Resend to send these on real signup; the email BODIES are not modified.

CS auto-replies (`customerServiceAutoReplies.dosingQuestion` and `lostPackage(orderId)`) — verbatim from v3.0 Appendix A.6.

DO NOT modify email body text in v4 (Iron Law 2.5 + locked compliance copy).

### Appendix L — Verbatim Legal Pages (LOCKED — already in code)

LOCKED in `app/legal/{terms,privacy,refunds,shipping,cookies}/page.tsx`. Verbatim text per v3.0 Appendix L 1-5. v4 Phase 6 polish operates on layout/typography around the text — NEVER on the text. `git diff` audit per Phase 6 verification gate.

### Appendix M — FAQ (LOCKED — already in code)

LOCKED in `lib/content/faq.ts` (20 verbatim Q+A from v3.0 Appendix M). v4 Phase 6 polishes the disclosure UI around the entries — text unchanged.

### Appendix N — About Page Narrative (LOCKED — already in code)

LOCKED in `app/about/page.tsx` (verbatim v3.0 Appendix N narrative with brand placeholders substituted to Vialchems Labs / Janoshik Analytical). v4 Phase 6 polishes hero typography, atmospheric backdrop, section dividers — text unchanged.

### Appendix O — Footer Template (LOCKED — already in code)

LOCKED in `components/SiteFooter.tsx`. Verbatim per v3.0 Appendix O. v4 may polish layout (already done in Phase 4 v3.0; minor v4 refinements OK) but disclaimer block (lines 103-118) is UNTOUCHABLE.

### Appendix P — Marketing Language Safety (LOCKED — patterns in code)

LOCKED in `lib/compliance.ts` (`unsafeMarketingPatterns` array — 40+ regex patterns). Source: v3.0 Appendix P forbidden words. Pre-commit gate at `scripts/grep-forbidden-words.sh` enforces with 29 shell-regex equivalents (lowercased version of the runtime set).

v4 may EXTEND `unsafeMarketingPatterns` with additional patterns (Iron Law 2.5 `/review` + `/cso` gate applies). v4 may NOT remove existing patterns (would weaken compliance). New patterns require LOCKED_OVERRIDE rationale in checkpoint.

Safe template starting phrases (10 verbatim from v3.0 Appendix P.2) — already used in `lib/content/product-descriptions.ts` and `lib/content/blog.ts`. v4 keeps them.

### Appendix Q — Industry Position (CONTEXT — vendor universe)

Reference v3.0 Appendix Q. 1,506-vendor universe; Tier 1 (34 vendors), Tier 2 (131), Tier 3 (1,341). Active Tier 1 survivors: Limitless Life Nootropics, Pure Rawz, Core Peptides, Biotech Peptides, Particle Peptides, Polaris Peptides, Skye Peptides, Ascension Peptides, Chemyo, Apollo Peptide Sciences, Onyx Biolabs, Loti Labs.

v4 context: Vialchems Labs starts at Tier 3 (Day-1 entrant). Path to Tier 2 within 6-12 months per operator-runbook §10. Realistic 90-day target: 30 paid orders from strangers (Bible §15 strong-go).

### Appendix R — Trust Signal References (REFERENCE — Janoshik default)

Reference v3.0 Appendix R + `lib/content/site.ts:24` (`labPartner.name = 'Janoshik Analytical'`).

Lab partners observed in industry: Janoshik Analytical (default), MZ Biolabs, Finnrick, Chromate, Kovera, TrustPointe Analytics, BioRegen.

v4 Phase 12 operator pre-launch: confirm Janoshik contract OR confirm alternative via `LAB_PARTNER_NAME` env override (Iron Law 2.26 — operator override required).

### Appendix S — GLP-1 Obfuscation Anti-Pattern (DO NOT IMITATE)

Reference v3.0 Appendix S. Industry pattern observed: OathPeptides (GLP1-S, GLP3-R), Mile High (GLP-1 SM, GLP-2 TRZ, GLP-3 RT), Ionpeptide (ION-1S, ION-2T, ION-3R), Edge (EDGE R3, EDGE T2), Accelerate Labs (AL1-(S), AL2-(T), AL3-(R)), Peak Performance (PP-3 RT, PP-2 TRZ).

FDA decodes these in enforcement letters. v4 catalog already excludes GLP-1 entirely (Iron Law 2.7); SKU codes use canonical names per Iron Law 2.11.

### Appendix T — Skill Adaptation Policy (REFERENCE)

Reference v3.0 Appendix T. When porting a pattern from any reference repo (Mogtrix, `affaan-m/everything-claude-code`, etc.):
1. Copy the underlying idea, not the external product identity
2. Rename when the v4.0 surface changes substantially
3. Prefer v4.0-native rules/skills/scripts over new third-party defaults
4. Do not ship a pattern whose main value is "install this external package"
5. One-line attribution comment in code: `// Pattern adapted from <repo>/<path>`
6. Document every adaptation in this Appendix T or a referenced ADAPTATION_LOG.md
7. Audit upstream before porting (Snyk ToxicSkills 2025: 36% of public skills contain prompt-injection patterns)

### Appendix U — Security Threat Model (REFERENCE — extended for v4)

Reference v3.0 Appendix U. v4 EXTENDS:

**U.1 — CVE threat surface (carry forward + new):**
- CVE-2025-59536 (Claude Code remote-fetch pre-trust): mitigated by Iron Law 2.16 supply-chain scanner
- CVE-2026-21852 (`ANTHROPIC_BASE_URL` hijacking): mitigated by scanner
- Snyk ToxicSkills 2025 (36% prompt-injection in public skills): every v4 toolkit install (Appendix X.1) audited per Appendix T.7

**U.2 — Prompt injection surface:** Same as v3.0. Scanner runs hidden-unicode + comment-payload + script-block + suspicious-base64 checks.

**U.3 — Infrastructure attack surface:** Same as v3.0. Scanner blocks `curl|bash`, `--no-verify`, `--dangerously-skip-permissions`, `enableAllProjectMcpServers`, `ANTHROPIC_BASE_URL`. v4 ADDS: `process.env.<SECRET>` references in `lib/content/` files (operator-secret leak risk per Iron Law 2.22).

**U.4 — Supply-chain attack surface:** Same as v3.0. v4 ADDS: cookie consent provider integration, Sentry SDK upgrades, Plaid SDK upgrades, BTCPay Greenfield API client — all reviewed per Iron Law 2.5 protected paths.

**U.5 — Compliance + LLC isolation posture:** Same as v3.0. Operator pre-launch action.

**U.6 — Active monitoring posture (v4 LIVE — per Phase 10 Sentry wiring):**
- Sentry alerts active per Phase 10.3 thresholds
- gstack `/canary` 2-hour post-deploy in Phase 13
- Weekly `/retro` (operator cadence post-launch)
- Quarterly compliance review against `enforcement_events.md`
- Operator monitors FDA Inspections database + Drug Safety Communications RSS

### Appendix V — Vendor-Archetype Design Reasoning Rules (REFERENCE — Posture A locked)

Reference v3.0 Appendix V.2 (Posture A row). LOCKED per Iron Law 2.26. v4 design elevation operates within Posture A constraints:
- Recommended pattern: grid-disciplined catalog + asymmetric vial-dominant home + dense COA tables + research-paper-tone blog
- Color: charcoal `--bg #0a0e0f`, surface `--surface #141a1c`, accent `--accent #3dd4c8` teal, electric `--electric #67e8f9` (atmospheric secondary)
- Typography: IBM Plex Sans + IBM Plex Mono + Newsreader Italic (hero pull-quotes only)
- Motion: vial sway -12° to +12° / 6.4s ease-in-out, hover unfurl 200ms ease-out, stagger reveal 60-80ms / 320ms
- Anti-patterns (HIGH severity): no Geist/Inter/Roboto/Space Grotesk primary, no purple/violet gradients, no 3-column SaaS feature grid, no stock-photo lab interiors, no before/after photography, no vibrant block-based e-commerce template, no emoji icons

### Appendix W — Pre-Delivery Checklist (EXTENDED for v4)

Reference v3.0 Appendix W (W.1 Visual Quality through W.7 Performance). v4 EXTENDS each section:

**W.1 Visual Quality (extended):**
- All v3.0 items, plus:
- [ ] Visual-regression diff vs Phase 11 baseline ≤ 0.1% pixel difference (Iron Law 2.18)
- [ ] No new shadow values outside the Phase 1 token scale
- [ ] Brand wordmark unchanged; tagline "Counted, weighed, verified." present in footer

**W.2 Interaction (extended):**
- All v3.0 items, plus:
- [ ] Toast surface for transient feedback (replaces inline message states)
- [ ] Dialog surface for destructive actions (cancel order, refund request)
- [ ] EmptyState component used for all empty surfaces

**W.3 Light/Dark Mode:** Vialchems is dark-only Day-1; light mode out of scope for v4. (Visual-regression baseline captures both for future-proof.)

**W.4 Layout + Responsive (extended):**
- All v3.0 items, plus:
- [ ] Verified at 375px / 768px / 1024px / 1440px viewport widths (visual regression captures 3 viewports)

**W.5 Accessibility + Motion (extended):**
- All v3.0 items, plus:
- [ ] axe-core: 0 critical, 0 serious violations per page (Phase 8)
- [ ] Lighthouse a11y ≥ 95 per page (Iron Law 2.27)
- [ ] aria-live polite regions on cart count + checkout step transitions
- [ ] All `motion` library animations honor `useReducedMotion()` hook

**W.6 Compliance + Brand (extended):**
- All v3.0 items, plus:
- [ ] No real credentials in committed source (Iron Law 2.22 — `grep -rE 'sk_(live|test)|production_secret' lib/ app/ components/` returns 0 hits)
- [ ] Cookie consent banner active and operator-approved (Iron Law 2.23)
- [ ] All protected-path commits annotated `// SCANNER_OK: reviewed-and-cso-passed` (Iron Law 2.19)

**W.7 Performance (extended):**
- All v3.0 items, plus:
- [ ] Lighthouse CI runs on every PR; merges blocked below 90/95/95/95 (Iron Law 2.27)
- [ ] Visual-regression diffs require operator approval if above threshold (Iron Law 2.25)
- [ ] Initial JS bundle ≤ 250KB gzipped per route (tightened from v3.0's 300KB)

### Appendix X — Research Toolkit Application Matrix

Per Hard Rule 10 of the meta-prompt that produced this document. Every tool listed in `RESEARCH_PLAN.md` (99 distinct entries) appears below. Format per entry:
- **Link:** URL
- **Category:** Claude Code agentic tool (skill / MCP / CLI / pattern / reference) — for X.1; OR site-side tool (library / framework / service / asset / inspiration) — for X.2
- **What it does:** one sentence
- **Where it lands:** exact phase number(s) and target files/directories, or "not used"
- **Concrete integration:** install command, config snippet, MCP server entry, skill invocation pattern, or "n/a — REJECTED"
- **Iron Law interaction:** which Iron Laws it touches; usage classification (unrestricted / gated / blocked)
- **Priority:** P0 (must use), P1 (should use), P2 (optional), or REJECTED
- **If REJECTED:** explicit reason

#### Appendix X.1 — Claude Code Agentic Toolkit (61 entries — install/configure in Phase 0)

##### X.1.1 — anthropics/skills (`frontend-design`)
- **Link:** https://github.com/anthropics/skills
- **Category:** Official Claude Code skill (frontend-design)
- **What it does:** Anthropic's foundational design discipline; teaches Claude to think about purpose, audience, BOLD aesthetic direction, anti-patterns, and aesthetic execution before generating frontend code.
- **Where it lands:** Phase 0 install. Used in Phase 1-7 (every page polish + token elevation phase).
- **Concrete integration:** `npx skills add https://github.com/anthropics/skills --skill frontend-design`. Verify load via `/help` or skill list.
- **Iron Law interaction:** Reinforces Iron Law 2.4 + 2.13 (no forbidden marketing patterns). Unrestricted usage.
- **Priority:** **P0**

##### X.1.2 — pbakaus/impeccable
- **Link:** https://github.com/pbakaus/impeccable
- **Category:** Claude Code skill (23 slash commands + 27 anti-pattern rules + standalone CLI)
- **What it does:** Anti-slop design discipline with `/audit`, `/critique`, `/polish`, `/bolder`, `/quieter`, `/typeset`, `/colorize`, `/animate`, `/layout`, `/document`, `/extract`, `/craft`, `/live`, etc.
- **Where it lands:** Phase 0 install + `/impeccable teach` once. Used in Phase 1 (`/critique` token additions), Phases 3-6 (`/shape` + `/critique` + `/polish` per page), Phase 7 (`/animate`), Phase 8 (`/audit` for a11y), Phase 9 (`/optimize` for perf).
- **Concrete integration:** `npx skills add pbakaus/impeccable`; then `/impeccable teach` to give project context once.
- **Iron Law interaction:** Stricter than Iron Law 2.4 anti-patterns at the page level. Unrestricted usage; reinforces compliance.
- **Priority:** **P0**

##### X.1.3 — nexu-io/open-design
- **Link:** https://github.com/nexu-io/open-design
- **Category:** Full app + 31 skills + 72 brand design systems + Desktop app + MCP server
- **What it does:** Local-first Claude Design clone; complete environment.
- **Where it lands:** Not used. (Functionally redundant with `frontend-design` + `impeccable` for v4 elevation goals; introduces UI overhead without proportional value for an existing brand-locked codebase.)
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — redundant with X.1.1 + X.1.2 for the v4 use case (elevating existing Posture A brand-locked codebase, not greenfield design exploration).

##### X.1.4 — alchaincyf/huashu-design
- **Link:** https://github.com/alchaincyf/huashu-design
- **Category:** Claude Code skill (12.8k★; bilingual EN/ZH; 9 design demos; 5-step Core Asset Protocol — logo → product shots → UI screenshots → color extraction → spec documentation; 20 design-philosophies anti-slop vocabulary; HTML→MP4 + HTML→PPTX exporters)
- **What it does:** Procedurally rigorous design generator with the strongest brand-fidelity protocol of any skill in this matrix; the README claims 5x output-variance reduction vs baseline when fed brand context; outputs include interactive prototypes, motion graphics, slide decks. Operator override of the v3.0-evaluation rejection: the skill is in scope.
- **Where it lands:** Phase 0 install (after operator confirms commercial license per Iron Law interaction below). Used in:
  - **Phase 1 (Tokens):** apply the 20 design-philosophies vocabulary as additional anti-slop validation alongside `pbakaus/impeccable` `/critique`. Run `/huashu critique` (or skill-equivalent invocation) on the token additions.
  - **Phase 2 (Primitive overhaul):** run the 5-step Core Asset Protocol against Vialchems brand assets — input the existing wordmark + Phase 4 v3.0 vial color tokens + the operator-supplied vial reference image (Appendix AD) — so the skill's variance-reduction kicks in from the start.
  - **Phase 3-4 (Page polish, especially PDP):** generate alternate vial+label visual concepts for operator selection, constrained to Posture A tokens and Appendix AD layout reference.
  - **Phase 9 (SEO):** the HTML→PPTX exporter can produce operator-side pitch decks for affiliate listicle outreach (Outliyr / Muscle+Brawn / PepPal / Brainflow per operator-runbook §3) — operator-side artifact, does not ship in product code.
- **Concrete integration:** **OPERATOR GATE BEFORE INSTALL** — operator confirms commercial license payment ($1,800/year recurring OR $3,500 one-time per `RESEARCH_PLAN.md` §7; contact `alchaincyf@gmail.com`). Once confirmed: `npx skills add alchaincyf/huashu-design`. Pin commercial-license confirmation in `docs/checkpoints/v4_phase_0_huashu_license.md` with operator attestation + payment date + license terms summary. License grants commercial usage; agent does not need to re-litigate.
- **Iron Law interaction:** Iron Law 2.22 spirit — commercial license is an operator-side cost recorded in the checkpoint, not a credential leak. Iron Law 2.26 — every huashu-design output must conform to Posture A; agent filters before applying any output to the codebase. Iron Law 2.5 — generated output touching protected paths runs `/review` + `/cso` before commit. Iron Law 2.16 supply-chain — the skill is audited per Appendix T.7 before install (Snyk ToxicSkills 2025 baseline check on the skill files).
- **Priority:** **P1** (operator-license-gated install; high leverage once paid; output discipline enforced by Iron Law 2.26)

##### X.1.5 — manalkaff/opendesign
- **Link:** https://github.com/manalkaff/opendesign
- **Category:** Claude Code skill plugin (10 skills: opendesign, setup-opendesign, run-opendesign, create-design-system, frontend-design, wireframe, interactive-prototype, make-a-deck, make-tweakable, handoff-to-claude-code)
- **What it does:** MIT-licensed alternative to nexu-io/open-design; smaller audience (36★) but legally clean.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — same redundancy reasoning as X.1.3; the codebase is brand-locked Posture A and `frontend-design` + `impeccable` cover the elevation needs.

##### X.1.6 — bergside/typeui (typeui.sh)
- **Link:** https://github.com/bergside/typeui + https://typeui.sh
- **Category:** CLI to pull design "style" SKILL.md files from registry
- **What it does:** `npx typeui.sh pull <style>` writes a SKILL.md (e.g., Glassmorphism, Brutalism, Paper, Editorial) into `.claude/skills/`.
- **Where it lands:** Not used Day-1. Available for operator post-launch experiments (not v4 scope).
- **Concrete integration:** `npx typeui.sh pull <style>` (only if operator explicitly requests an aesthetic exploration).
- **Iron Law interaction:** Iron Law 2.26 — brand expression LOCKED. Pulling a different aesthetic SKILL.md would not change the codebase but would confuse the agent during elevation. Blocked usage during v4.
- **Priority:** **REJECTED for v4** — brand is locked; aesthetic exploration is out of scope.

##### X.1.7 — bergside/awesome-design-skills
- **Link:** https://github.com/bergside/awesome-design-skills
- **Category:** Registry of 67 SKILL.md/DESIGN.md style files for AI agents (the source registry behind typeui.sh)
- **What it does:** Curated catalog of aesthetic styles.
- **Where it lands:** Not used Day-1 (same reason as X.1.6).
- **Concrete integration:** n/a — not used in v4.
- **Iron Law interaction:** None directly; would conflict with Iron Law 2.26 if applied.
- **Priority:** **REJECTED for v4** — brand locked.

##### X.1.8 — forrestchang/andrej-karpathy-skills
- **Link:** https://github.com/forrestchang/andrej-karpathy-skills
- **Category:** Single CLAUDE.md with 4 LLM-coding pitfall principles (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution)
- **What it does:** Internalize the four principles as mental scaffolding.
- **Where it lands:** Phase 0 — read once, absorb. Do NOT install as a competing CLAUDE.md (codebase already has its own conventions via this super-prompt).
- **Concrete integration:** Read https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md once. Apply mentally throughout.
- **Iron Law interaction:** Reinforces Iron Law 2.3 (root-cause investigation) and Iron Law 2.17 (introspection on 3+ failures). Unrestricted (read-only reference).
- **Priority:** **P1**

##### X.1.9 — mattpocock/skills
- **Link:** https://github.com/mattpocock/skills
- **Category:** Author's skill collection (`tdd`, `grill-with-docs`, `to-prd`, `prototype`, `zoom-out`, `improve-codebase-architecture`, `diagnose`, `triage`, `caveman`, `migrate-to-shoehorn`, `setup-pre-commit`, etc.)
- **What it does:** Battle-tested individual skills; reference-quality SKILL.md format.
- **Where it lands:** Phase 0 — selectively install `grill-with-docs` for Phase 10 service-wiring spec drilling. Other skills available on demand.
- **Concrete integration:** `npx skills add mattpocock/skills --skill grill-with-docs`. For other skills: `npx skills add mattpocock/skills --skill <name>` per phase need.
- **Iron Law interaction:** `tdd` skill overlaps Iron Law 2.1 + Superpowers `test-driven-development`; do NOT install both (would duplicate). Use Superpowers as primary; pull mattpocock/tdd only if Superpowers TDD skill is unavailable.
- **Priority:** **P1** (selective install)

##### X.1.10 — davila7/claude-code-templates
- **Link:** https://github.com/davila7/claude-code-templates
- **Category:** Template aggregator (100+ agents/commands/MCPs/hooks; `frontend-developer.md`, `ui-ux-designer.md` under `agents/development-team/`)
- **What it does:** Catalog of agent templates and prompts.
- **Where it lands:** Reference only (browse if a specific template is needed in a phase). Do NOT install as a base.
- **Concrete integration:** Browse https://github.com/davila7/claude-code-templates manually if a phase needs a specific template. Note: the `senior-frontend` template referenced in some Reddit threads does NOT exist; closest substitutes are `frontend-developer.md` and `ui-ux-designer.md`.
- **Iron Law interaction:** None directly. If a template introduces a new pattern, Iron Law 2.5 + 2.19 protected-paths gates apply.
- **Priority:** **P2** (reference)

##### X.1.11 — ryanthedev/design-for-ai
- **Link:** https://github.com/ryanthedev/design-for-ai
- **Category:** Single Claude Code plugin teaching design from "Design for Hackers" (CHECKER + APPLIER modes)
- **What it does:** CHECKER audits visual hierarchy + typography + spacing; APPLIER builds against the principles.
- **Where it lands:** Not used. (`pbakaus/impeccable` `/audit` covers similar ground with deeper anti-pattern detection.)
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — redundant with X.1.2.

##### X.1.12 — nextlevelbuilder/ui-ux-pro-max-skill
- **Link:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **Category:** Claude Code skill plugin (76k★; 67 UI styles + 161 industry-rule sets + 161 color palettes + 57 font pairings + 15 tech stacks + Python search engine + CLI; v2.5.0)
- **What it does:** Comprehensive industry-rules engine with cross-stack pattern reference. Operator override of the v3.0-evaluation rejection: the skill is in scope despite the trust-signal flag noted below.
- **Where it lands:** Phase 0 install (after Iron Law 2.16 supply-chain audit per Appendix T.7). Used in:
  - **Phase 1 (Tokens):** validate Phase 1 token additions against the relevant industry-rule sets (e-commerce + research-grade + dark-mode subsets) — the skill's CLI exposes per-rule validation.
  - **Phase 2 (Primitive overhaul):** cross-reference primitive patterns against the 15 tech-stack catalogs (Next.js + Tailwind + Radix + shadcn entries are most relevant).
  - **Phase 3-6 (Page polish):** apply the relevant industry rules per page family. Catalog/PDP pages run e-commerce ruleset; legal pages run informational/regulatory ruleset; account pages run dashboard ruleset.
  - **Phase 8 (Accessibility):** the skill includes WCAG-aligned rules among the 161; run those subsets as a complementary check alongside axe-core.
  - **Phase 9 (Performance + SEO):** the skill's tech-stack patterns include performance-budget recommendations per stack.
- **Concrete integration:** **AUDIT BEFORE INSTALL** — per Iron Law 2.16 + Appendix T.7, the agent reads the skill's source repository, scans for hidden-unicode + prompt-injection + suspicious-base64 patterns (the supply-chain scanner standard), and confirms zero violations before install. Once cleared: `npx skills add nextlevelbuilder/ui-ux-pro-max-skill`. Pin audit result in `docs/checkpoints/v4_phase_0_uiux_pro_max_audit.md`. The 76k-star trust-signal flag from `RESEARCH_PLAN.md` §7 is acknowledged but not blocking; operator override is on record.
- **Iron Law interaction:** Iron Law 2.16 — supply-chain audit before install. Iron Law 2.26 — every rule application must conform to Posture A; agent filters before applying any rule that conflicts with locked brand. Iron Law 2.21 — rules touching design tokens must be additive only. Iron Law 2.5 — outputs touching protected paths run `/review` + `/cso` before commit.
- **Priority:** **P1** (audit-gated install; 161 industry rules are the highest-quantity rule engine in this matrix; pairs well with `pbakaus/impeccable`'s 27 anti-pattern rules and `huashu-design`'s 20 design philosophies for triangulated validation)

##### X.1.13 — ceorkm/claude-design-system
- **Link:** https://github.com/ceorkm/claude-design-system
- **Category:** Claude Code skill plugin (`/extract-it`, `/expand-it`, `/merge-it`, `/design-it`)
- **What it does:** Transform amateur UIs into professional designs from inspiration images.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — 7★ at evaluation; too small audience to recommend; `frontend-design` + `impeccable` cover the workflow.

##### X.1.14 — Mathews-Tom/armory
- **Link:** https://github.com/Mathews-Tom/armory
- **Category:** Skills aggregator (125-package collection: 11 agents, 57 skills, 4 rules, 5 commands, 7 hooks, 3 utilities, 5 presets)
- **What it does:** Carefully-curated kit; `team-lead` orchestrator, code review, security audit.
- **Where it lands:** Phase 0 — selective install for Phase 10 service-wiring orchestration if needed; otherwise reference.
- **Concrete integration:** Browse https://github.com/Mathews-Tom/armory; install specific packages on demand via `npx skills add Mathews-Tom/armory --skill <name>`.
- **Iron Law interaction:** Each package audited per Appendix T.7 before install (Snyk ToxicSkills 2025 baseline).
- **Priority:** **P2** (selective)

##### X.1.15 — Khalidabdi1/design-ai
- **Link:** https://github.com/Khalidabdi1/design-ai
- **Category:** DESIGN.md library (116 brand-derived files for 66+ brands in 9-section format)
- **What it does:** Templates of DESIGN.md from observable patterns of major brands.
- **Where it lands:** Phase 1 reference — use the structural template (NOT verbatim brand values) as a model for an optional `DESIGN.md` at repo root that consolidates Posture A tokens for external-agent portability.
- **Concrete integration:** Reference only. If Phase 1 generates a `DESIGN.md`, derive the structure from this repo and fill values from `lib/design/tokens.ts` + `app/globals.css` + Phase 4 v3.0 anti-pattern list. Do NOT ship any other brand's DESIGN.md verbatim.
- **Iron Law interaction:** Iron Law 2.10 (no fake reviews → no fake brand). Use structure only.
- **Priority:** **P1** (template source for optional `DESIGN.md`)

##### X.1.16 — VoltAgent/awesome-claude-design
- **Link:** https://github.com/VoltAgent/awesome-claude-design
- **Category:** DESIGN.md library (68 ready-to-use files in 11 brand categories)
- **What it does:** Smaller curated set of DESIGN.md files.
- **Where it lands:** Reference only (X.1.15 is preferred — cleaner).
- **Concrete integration:** Browse if X.1.15 doesn't have a useful structural template.
- **Iron Law interaction:** Same as X.1.15.
- **Priority:** **P2** (reference)

##### X.1.17 — VoltAgent/awesome-design-md
- **Link:** https://github.com/VoltAgent/awesome-design-md
- **Category:** DESIGN.md library (74.1k★, the biggest brand-derived DESIGN.md collection)
- **What it does:** Largest catalog of DESIGN.md files extracted from real websites.
- **Where it lands:** Reference only (same use case as X.1.15-X.1.16).
- **Concrete integration:** Browse for structural inspiration if Phase 1 generates a `DESIGN.md`.
- **Iron Law interaction:** Same as X.1.15.
- **Priority:** **P2** (reference)

##### X.1.18 — getdesign.md
- **Link:** https://getdesign.md
- **Category:** Curated DESIGN.md catalog (71 brand-inspired files; web-browsable)
- **What it does:** Browsable directory of DESIGN.md files.
- **Where it lands:** Reference only.
- **Concrete integration:** Browse if needed.
- **Iron Law interaction:** Same as X.1.15.
- **Priority:** **P2** (reference)

##### X.1.19 — ComposioHQ/awesome-claude-skills
- **Link:** https://github.com/ComposioHQ/awesome-claude-skills
- **Category:** Awesome list / aggregator (58.9k★; vendor-tinted toward Composio's paid integration platform)
- **What it does:** Curated list of skills.
- **Where it lands:** Reference only — discount the top of the list (Composio products listed first).
- **Concrete integration:** Browse if a phase needs to discover a new skill.
- **Iron Law interaction:** Iron Law 2.16 — every Composio MCP would need supply-chain audit per Appendix T.7.
- **Priority:** **P2** (reference, with skepticism)

##### X.1.20 — hesreallyhim/awesome-claude-code
- **Link:** https://github.com/hesreallyhim/awesome-claude-code
- **Category:** Awesome list (43.1k★; honest community curation; mid-reorganization at evaluation)
- **What it does:** Neutral curated list.
- **Where it lands:** Reference only.
- **Concrete integration:** Browse if needed.
- **Iron Law interaction:** None directly.
- **Priority:** **P2** (reference)

##### X.1.21 — travisvn/awesome-claude-skills
- **Link:** https://github.com/travisvn/awesome-claude-skills
- **Category:** Awesome list (12.3k★; honest, narrower than Composio's; flags Anthropic skills + Superpowers prominently)
- **What it does:** Narrower curated list.
- **Where it lands:** Reference only.
- **Concrete integration:** Browse if needed.
- **Iron Law interaction:** None directly.
- **Priority:** **P2** (reference)

##### X.1.22 — rohitg00/awesome-claude-code-toolkit
- **Link:** https://github.com/rohitg00/awesome-claude-code-toolkit
- **Category:** Awesome list / kitchen-sink dump
- **What it does:** Maximalist inventory; claims "400,000+ skills" via SkillKit marketplace (implausible).
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — `RESEARCH_PLAN.md` §7 flagged "kitchen-sink dump with implausible '400k skills' framing — discount the framing."

##### X.1.23 — ComposioHQ/awesome-claude-plugins
- **Link:** https://github.com/ComposioHQ/awesome-claude-plugins
- **Category:** Awesome list (1.6k★; same vendor angle as X.1.19)
- **What it does:** Plugin curation.
- **Where it lands:** Reference only — discount top entries.
- **Concrete integration:** Browse if needed.
- **Iron Law interaction:** Same as X.1.19.
- **Priority:** **P2** (reference, with skepticism)

##### X.1.24 — jqueryscript/awesome-claude-code
- **Link:** https://github.com/jqueryscript/awesome-claude-code
- **Category:** Awesome list (351★; niche but neutral)
- **What it does:** Small honest catalog.
- **Where it lands:** Reference only.
- **Concrete integration:** Browse if needed.
- **Iron Law interaction:** None.
- **Priority:** **P2** (reference)

##### X.1.25 — alirezarezvani/claude-skills
- **Link:** https://github.com/alirezarezvani/claude-skills
- **Category:** Skills aggregator (claims 235 skills; actually 227; scope inflation includes C-suite + Marketing skills inside coding repo)
- **What it does:** Massive scope; some engineering-relevant skills.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — scope inflation flagged in `RESEARCH_PLAN.md` §7; engineering-core skills duplicate Superpowers + mattpocock; C-suite/marketing skills are out of scope.

##### X.1.26 — x1xhlol/system-prompts-and-models-of-ai-tools
- **Link:** https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools
- **Category:** Reverse-engineered system prompts archive (137k★; Cursor, Devin, Claude Code, Replit, Lovable, Manus, v0, GitHub Copilot, Windsurf, Warp.dev, Trae, Junie, Augment, Kiro, Same.dev, Perplexity, NotionAI, Dia, Z.ai Code, Xcode, VSCode Agent, Comet, etc.)
- **What it does:** Reading material for prompt-engineering reference.
- **Where it lands:** Reference only — read once if a phase needs to compare prompt patterns.
- **Concrete integration:** n/a — read-only reference.
- **Iron Law interaction:** Iron Law 2.16 — do NOT pull any of these prompts into the Vialchems codebase as instructions; supply-chain risk.
- **Priority:** **P2** (reference)

##### X.1.27 — anthropics/claude-code-skills
- **Link:** Does not exist (404)
- **Category:** Misnamed — canonical official is X.1.1 (`anthropics/skills`)
- **What it does:** n/a
- **Where it lands:** Not used (does not exist).
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — repository does not exist; misnaming flagged in `RESEARCH_PLAN.md` §7.

##### X.1.28 — yamadashy/repomix
- **Link:** https://github.com/yamadashy/repomix
- **Category:** CLI (24.5k★; packs entire repo into single AI-readable file)
- **What it does:** Compresses repo state for cross-cutting context.
- **Where it lands:** Phase 0 install. Used in Phase 10 (service wiring needs cross-cutting context across `lib/payments/`, `lib/supabase/`, `app/api/payments/`, `app/api/access/`).
- **Concrete integration:** `npm install -g repomix` (or use `npx repomix`). Run `repomix` at repo root to generate `repomix-output.txt` for cross-cutting context.
- **Iron Law interaction:** Iron Law 2.22 — packed file may include `.env*` references; verify `.env.local` is in `.repomixignore`. Add `.env*` to `.repomixignore` Day-0.
- **Priority:** **P0**

##### X.1.29 — ryoppippi/ccusage
- **Link:** https://github.com/ryoppippi/ccusage
- **Category:** CLI (14k★; token-spend telemetry per session/day/month)
- **What it does:** Reads `~/.claude/projects/*.jsonl` and reports token spend.
- **Where it lands:** Phase 0 install. Used continuously to monitor session cost.
- **Concrete integration:** `npm install -g ccusage`. Run `ccusage` to see baseline; run `ccusage daily` for daily reports.
- **Iron Law interaction:** None.
- **Priority:** **P0**

##### X.1.30 — rtk-ai/rtk
- **Link:** https://github.com/rtk-ai/rtk
- **Category:** CLI / Bash output compressor (Rust binary, MIT)
- **What it does:** Installs PreToolUse hook on Bash; rewrites verbose commands (`cargo test`, `git status`, `npm`, `tsc`, `prettier`, `playwright`, `pytest`) to compress output 60-90%.
- **Where it lands:** Phase 0 install. Used continuously through Phases 1-13 for Bash output noise reduction (saves significant context budget on `npm run build` / `npm test` / Lighthouse output).
- **Concrete integration:** Install per repo instructions (Rust binary; cargo install or pre-built download). Configure as a Claude Code PreToolUse hook in settings.json.
- **Iron Law interaction:** Iron Law 2.16 — RTK rewrites Bash output, which is a Read tool boundary. Verify the rewrite doesn't strip critical security signals from npm audit / supply-chain output. Add an `rtk-passthrough` rule for `npm audit`, `npm run supply-chain-scan`, `npm run grep-mogtrix`, `npm run grep-forbidden-words`.
- **Priority:** **P0**

##### X.1.31 — obra/superpowers
- **Link:** https://github.com/obra/superpowers
- **Category:** Skill plugin framework (184k★; foundational skill stack — TDD, brainstorming, writing-plans, dispatching-parallel-agents, systematic-debugging, verification-before-completion, requesting-code-review, receiving-code-review, finishing-a-development-branch, using-git-worktrees, using-superpowers)
- **What it does:** The base skill stack this project depends on.
- **Where it lands:** Already installed (Phase 0 v3.0); verify in v4 Phase 0.
- **Concrete integration:** Verify via `/skills` listing; if not installed: `npx skills add obra/superpowers`.
- **Iron Law interaction:** Iron Laws 2.1 (TDD) + 2.2 (verification) + 2.3 (debugging) + 2.17 (introspection) all reference Superpowers.
- **Priority:** **P0** (already installed)

##### X.1.32 — EveryInc/compound-engineering-plugin
- **Link:** https://github.com/EveryInc/compound-engineering-plugin
- **Category:** Plugin (16.4k★; 37 skills + 51 agents)
- **What it does:** Brainstorming, planning, code review, debugging, docs.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None directly.
- **Priority:** **REJECTED** — high quality but heavy overlap with Superpowers (X.1.31). Multiple planning frameworks in one project causes skill conflicts (per `RESEARCH_PLAN.md` §4 "What NOT to install").

##### X.1.33 — SuperClaude_Framework
- **Link:** https://github.com/SuperClaude-Org/SuperClaude_Framework
- **Category:** Plugin framework (22.6k★; 30+ commands, cognitive personas, /sc:research, Tavily MCP integration)
- **What it does:** Heavy planning + research framework.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None directly.
- **Priority:** **REJECTED** — same redundancy reasoning as X.1.32. Pick one of {Superpowers, compound-engineering, SuperClaude} per `RESEARCH_PLAN.md` §3.10.

##### X.1.34 — ComposioHQ/agent-orchestrator
- **Link:** https://github.com/ComposioHQ/agent-orchestrator
- **Category:** Plugin (6.9k★; spawns parallel Claude Code instances in git worktrees, autonomous CI/PR/conflict handling)
- **What it does:** Multi-agent orchestration for teams.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None directly. Worktree pattern overlaps Superpowers `using-git-worktrees`.
- **Priority:** **REJECTED** — overkill for single-operator v4 work. `superpowers:dispatching-parallel-agents` + `superpowers:using-git-worktrees` cover the worktree cascade need (§4.4) sufficiently.

##### X.1.35 — safishamsi/graphify
- **Link:** https://github.com/safishamsi/graphify
- **Category:** Knowledge graph builder (tree-sitter for code, faster-whisper for AV; PreToolUse hook)
- **What it does:** Builds local knowledge graph; Claude consults graph before Glob/Grep. Reports ~71x token reduction.
- **Where it lands:** Not used Day-1.
- **Concrete integration:** Optional Phase 0 install if context budget is constrained.
- **Iron Law interaction:** Iron Law 2.16 — verify graph storage doesn't include `.env*` content.
- **Priority:** **P2** — overkill for typical Next.js project; consider only if Phase 10 service-wiring runs into context limits.

##### X.1.36 — mksglu/context-mode
- **Link:** https://github.com/mksglu/context-mode
- **Category:** MCP server (intercepts tool calls, indexes raw output to local SQLite, returns compact references)
- **What it does:** Claims 65-75% (sometimes 98%) output token reduction.
- **Where it lands:** Not used Day-1.
- **Concrete integration:** Optional Phase 10 install if MCP usage is heavy.
- **Iron Law interaction:** Iron Law 2.16 — verify SQLite index storage policy (no `.env*` content).
- **Priority:** **P2** — overlaps RTK (X.1.30) conceptually; pick one based on usage pattern.

##### X.1.37 — Piebald-AI/claude-code-system-prompts
- **Link:** https://github.com/Piebald-AI/claude-code-system-prompts
- **Category:** Reference archive (reverse-engineered system prompts updated within minutes of each Claude Code release)
- **What it does:** Reading material for understanding Claude Code's runtime context.
- **Where it lands:** Reference only.
- **Concrete integration:** Bookmark; read on demand.
- **Iron Law interaction:** None.
- **Priority:** **P2** (reference)

##### X.1.38 — cytostack/openwolf
- **Link:** https://github.com/cytostack/openwolf
- **Category:** Plugin (1.5k★, AGPL-3.0; 6 hooks producing anatomy.md / cerebrum.md / token-ledger.json)
- **What it does:** Claims ~80% token reduction.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** AGPL-3.0 license is contagious for proprietary projects; Iron Law 2.22 spirit (no commercially-restrictive dependencies).
- **Priority:** **REJECTED** — AGPL incompatible with Vialchems Labs commercial venture per `RESEARCH_PLAN.md` §7.

##### X.1.39 — Maciek-roboblog/Claude-Code-Usage-Monitor
- **Link:** https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor
- **Category:** Real-time terminal monitor with ML-based predictions
- **What it does:** Live monitor (vs ccusage retrospective).
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — `ryoppippi/ccusage` (X.1.29) covers the use case at lower install friction.

##### X.1.40 — nyldn/claude-octopus
- **Link:** https://github.com/nyldn/claude-octopus
- **Category:** Multi-model orchestrator (Claude + Codex + Gemini + Copilot + Qwen + Ollama + Perplexity + OpenRouter)
- **What it does:** 4-phase Discover/Define/Develop/Deliver across multiple models.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** Iron Law 4.5 — single-track Opus only.
- **Priority:** **REJECTED** — conflicts with execution discipline §4.5 (single-track Opus for all v4 work).

##### X.1.41 — mercurialsolo/claudectl
- **Link:** https://github.com/mercurialsolo/claudectl
- **Category:** CLI / hive-mind orchestrator (148★; local LLM auto-pilot)
- **What it does:** Cross-instance knowledge sharing.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None directly.
- **Priority:** **REJECTED** — too small audience + complex to evaluate within v4 scope.

##### X.1.42 — Nodewarrior/spine
- **Link:** https://github.com/Nodewarrior/spine
- **Category:** Plugin (15★; auto-doc capture into Obsidian vault from commits)
- **What it does:** Documentation automation.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — too low traction; gstack `/document-release` covers v4 documentation needs.

##### X.1.43 — InfinriDev/Phaselock
- **Link:** https://github.com/infinri/Phaselock (404 / abandoned)
- **Category:** Plugin (claimed 80 enforceable rules + pre/post hooks for AI code enforcement)
- **What it does:** n/a (abandoned).
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — repository 404 / abandoned per `RESEARCH_PLAN.md` §7.

##### X.1.44 — KhazP/vibe-coding-prompt-template
- **Link:** https://github.com/KhazP/vibe-coding-prompt-template
- **Category:** Static prompt templates (2.4k★; research → PRD → tech design → implementation)
- **What it does:** MVP workflow templates.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — redundant with Superpowers `brainstorming` + `writing-plans` + `to-prd` skills.

##### X.1.45 — AIOSAI/AIPass
- **Link:** https://github.com/AIOSAI/AIPass
- **Category:** Multi-agent framework (99★; uses `--permission-mode bypassPermissions`)
- **What it does:** Local multi-agent.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** Iron Law 2.16 explicit block: `--dangerously-skip-permissions` and `bypassPermissions` flags forbidden in source.
- **Priority:** **REJECTED** — security smell per `RESEARCH_PLAN.md` §7; conflicts with Iron Law 2.16.

##### X.1.46 — claude-meter.com
- **Link:** https://claude-meter.com
- **Category:** macOS menu bar app ($5/mo Pro; reads claude.ai/settings/usage server-side)
- **What it does:** Live usage tracker.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — Linux/WSL environment (per CODEBASE_UNDERSTANDING.md system info); macOS-only tool incompatible. Free `ccusage` (X.1.29) covers the need.

##### X.1.47 — sharedcontext.ai
- **Link:** https://sharedcontext.ai
- **Category:** Marketplace/sync platform for AI skills as markdown files
- **What it does:** Cross-IDE skill sync.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED for v4.
- **Iron Law interaction:** Iron Law 2.16 — supply-chain risk; every imported skill needs Appendix T.7 audit.
- **Priority:** **REJECTED** — too early to evaluate per `RESEARCH_PLAN.md` §7; watch but don't depend on it.

##### X.1.48 — finds.dev
- **Link:** https://finds.dev
- **Category:** Newsletter (weekly GitHub-repo discovery; 3-5 repos/week)
- **What it does:** Discovery feed.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — wrong category (newsletter, not a CC tool).

##### X.1.49 — respira.press
- **Link:** https://respira.press
- **Category:** WordPress AI infrastructure plugin (234 tools across 12 page builders)
- **What it does:** WP-only AI infrastructure.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — WordPress-only; Vialchems Labs is Next.js/React per stack.

##### X.1.50 — ARS CONTEXTA
- **Link:** https://www.arscontexta.org/
- **Category:** Knowledge-system generator (personalized markdown vault, Obsidian-style wiki links)
- **What it does:** Personal knowledge management.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — wrong category per `RESEARCH_PLAN.md` §7.

##### X.1.51 — Mem-Palace
- **Link:** https://www.mempalace.tech/
- **Category:** AI memory system (96.6% raw / 100% hybrid on LongMemEval; celebrity-backed)
- **What it does:** General AI memory, not Claude Code-specific.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — wrong category per `RESEARCH_PLAN.md` §7.

##### X.1.52 — Traycer
- **Link:** https://traycer.ai
- **Category:** Spec-driven dev orchestrator (passes context to Cursor/Claude Code/etc.)
- **What it does:** Orchestrates code changes based on specs.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None directly.
- **Priority:** **REJECTED** — competes with Superpowers `writing-plans` + `executing-plans`; pick one stack.

##### X.1.53 — GSD ("Get Shit Done")
- **Link:** https://github.com/gsd-build/get-shit-done
- **Category:** Spec-driven dev framework (six-command loop: questions → research → requirements → roadmap)
- **What it does:** Planning framework.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None directly.
- **Priority:** **REJECTED** — same redundancy reasoning as X.1.32.

##### X.1.54 — DESIGN.md pattern (workflow methodology)
- **Link:** https://www.mindstudio.ai/blog/google-stitch-design-md-claude-code-consistent-ui (originator: Google Stitch)
- **Category:** Workflow methodology
- **What it does:** Single markdown file at repo root with structured tokens (color, typography, spacing, motion) + prose rationale; Claude reads automatically.
- **Where it lands:** Phase 1 — generate optional `DESIGN.md` at `/root/peptide-site/DESIGN.md` derived from existing `lib/design/tokens.ts` + `app/globals.css` + Phase 4 v3.0 anti-pattern list. Helps external agents (or future Claude sessions) match Posture A without reading the architecture plan + globals.css + tokens.ts separately.
- **Concrete integration:** Manually compose `DESIGN.md` per `RESEARCH_PLAN.md` §3.2 structural template. Alternatively use `/impeccable document` to auto-generate from current state.
- **Iron Law interaction:** Iron Law 2.21 — additive only; `DESIGN.md` is derivative documentation, not a new token system.
- **Priority:** **P1** (optional Phase 1 deliverable)

##### X.1.55 — Two-document approach (workflow methodology)
- **Link:** Anthropic Claude Design + community
- **Category:** Workflow methodology (`design-philosophy.md` "why" + `design-system.md` "what")
- **What it does:** Separates judgment/evaluation (philosophy) from specs/tokens (system) so Claude can both follow rules AND judge edge cases.
- **Where it lands:** Phase 1 — partially implemented in v3.0:
  - "Why" lives in `docs/superpowers/plans/2026-05-08-architecture.md` §2 + `docs/research/sub_5_site_anatomy.md`
  - "What" lives in `lib/design/tokens.ts` + `app/globals.css`
  - v4 may consolidate into single `DESIGN.md` per X.1.54 OR leave as-is.
- **Concrete integration:** No new files unless operator wants explicit `design-philosophy.md` + `design-system.md` split.
- **Iron Law interaction:** Iron Law 2.21 — additive only.
- **Priority:** **P2** (optional)

##### X.1.56 — Design tokens 3-tier hierarchy (workflow methodology)
- **Link:** UXPin / Contentful / standard practice
- **Category:** Workflow methodology (Primitive → Semantic → Component layers)
- **What it does:** Three-tier token hierarchy for AI-correctness.
- **Where it lands:** Phase 1 — partially implemented (Primitive `--bg #0a0e0f`, Semantic `--text-muted`, but Component-level missing — Phase 1 deliverable adds `--button-primary-bg`, `--card-padding`, `--pill-h` etc.).
- **Concrete integration:** Phase 1 extension of `app/globals.css`. Per Iron Law 2.21, additive only.
- **Iron Law interaction:** Iron Law 2.21.
- **Priority:** **P1** (Phase 1 deliverable)

##### X.1.57 — Screenshot → design_guidelines JSON (workflow methodology)
- **Link:** Reddit (VividBrush9973 pattern)
- **Category:** Workflow methodology (extract tokens from reference screenshot into JSON, treat as constraint)
- **What it does:** Reverse-engineer a visual into JSON tokens.
- **Where it lands:** Not used Day-1 (brand is locked; no reference-screenshot-driven extraction needed).
- **Concrete integration:** Operator-side workflow if visual exploration needed post-launch.
- **Iron Law interaction:** Iron Law 2.26 — would require operator LOCKED_OVERRIDE if extracted tokens conflicted with Posture A.
- **Priority:** **P2** (operator-side)

##### X.1.58 — HTML prototype share workflow (workflow methodology)
- **Link:** Reddit (gvoider pattern)
- **Category:** Workflow methodology (generate HTML mockups, host on shared container, comment, iterate)
- **What it does:** Lightweight design-share alternative to Figma.
- **Where it lands:** Not used Day-1 (Vialchems is past mockup stage; Phase 3-6 polish operates on live code).
- **Concrete integration:** Operator-side workflow if new pages need mockup-first exploration.
- **Iron Law interaction:** None.
- **Priority:** **P2** (operator-side)

##### X.1.59 — Single Loop architecture (workflow methodology)
- **Link:** Reddit (fs2d pattern)
- **Category:** Workflow methodology (slim ~60-line system prompt + on-demand skills, vs multi-agent loops)
- **What it does:** Keeps active context window clean; prevents drift.
- **Where it lands:** Implicitly applied throughout v4 (single-track Opus per §4.5; skills loaded on demand). Re-read `forrestchang/andrej-karpathy-skills` per X.1.8.
- **Concrete integration:** Already followed; no new install.
- **Iron Law interaction:** Reinforces §5 Context-Rot Mitigation.
- **Priority:** **P1** (architectural reference)

##### X.1.60 — Cursor's visual editor
- **Link:** Cursor IDE feature
- **Category:** Cross-IDE feature (not portable to Claude Code)
- **What it does:** Visual editor inside Cursor for nudging code without describing in words.
- **Where it lands:** Not used (operator works in Claude Code).
- **Concrete integration:** n/a.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — not portable to Claude Code per `RESEARCH_PLAN.md` Misc table.

##### X.1.61 — Vercel Agent
- **Link:** https://vercel.com (browser-scanning agent)
- **Category:** Vercel-platform feature
- **What it does:** Vercel's browser-scanning agent for site testing.
- **Where it lands:** Not used (Vercel feature; not a Claude Code tool).
- **Concrete integration:** n/a — operator may use independently via Vercel dashboard.
- **Iron Law interaction:** None.
- **Priority:** **P2** (operator-side; available via Vercel dashboard post-deploy)

#### Appendix X.2 — Site-Side Toolkit (38 entries — integrated in their relevant phases)

##### X.2.1 — Google Stitch
- **Link:** https://stitch.withgoogle.com
- **Category:** AI mockup/builder SaaS (free, 350 gen/mo; Gemini-backed; Figma + MCP export)
- **What it does:** Prompt-to-UI design tool with multi-screen flow generation.
- **Where it lands:** Not used for v4 elevation (brand + IA locked). Available for operator-side post-launch new-page exploration (out of v4 scope).
- **Concrete integration:** Operator-side at https://stitch.withgoogle.com; Stitch MCP server can be added to `.mcp.json` if Phase 1 operator workflow needs it.
- **Iron Law interaction:** Iron Law 2.26 — generated mockups must conform to Posture A; operator filters before any output influences the codebase.
- **Priority:** **P2** (operator-side; not Day-1 v4)

##### X.2.2 — v0 (Vercel)
- **Link:** https://v0.app
- **Category:** AI app/site builder SaaS ($5 free → $20/mo); React + Tailwind + shadcn/ui output
- **What it does:** Generate full React+shadcn components from prompt; deploy to Vercel.
- **Where it lands:** Not used for v4 elevation. v0-generated code would need extensive adaptation to fit Posture A tokens; faster to elevate existing primitives directly.
- **Concrete integration:** n/a — REJECTED for v4.
- **Iron Law interaction:** Iron Law 2.5 — any v0-generated code touching protected paths needs `/review` + `/cso` gate.
- **Priority:** **REJECTED for v4** — adaptation overhead > benefit for an existing brand-locked codebase.

##### X.2.3 — Lovable
- **Link:** https://lovable.dev
- **Category:** AI full-stack app builder SaaS (Free 30/mo → $25/mo)
- **What it does:** "Vibe-coding" app builder.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED for v4** — same adaptation overhead as X.2.2.

##### X.2.4 — Bolt.new
- **Link:** https://bolt.new
- **Category:** AI app builder SaaS (1M free tokens → $25/mo); MCP support; in-browser WebContainer
- **What it does:** Full-stack app builder with MCP Connectors (Notion, Linear, GitHub, Miro, Sentry, Jira).
- **Where it lands:** Not used for v4. Bolt MCP could be added post-launch for new-page exploration.
- **Concrete integration:** Optional Phase 0 install if operator wants Bolt MCP: add to `.mcp.json`. Out of scope Day-1.
- **Iron Law interaction:** Iron Law 2.5 — generated code needs review.
- **Priority:** **P2** (operator-side post-launch)

##### X.2.5 — Base44
- **Link:** https://base44.com (acquired by Wix Jun 2025)
- **Category:** AI all-in-one app builder SaaS (Free 25 cred → $16/mo)
- **What it does:** Web app + auth + DB + integrations.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED for v4** — wrong category (full-stack platform; Vialchems is custom-coded Next.js).

##### X.2.6 — tweakcn
- **Link:** https://tweakcn.com (https://github.com/jnsahaj/tweakcn)
- **Category:** Visual no-code theme editor for shadcn/ui (free, OSS)
- **What it does:** Generate Tailwind v4 CSS variables visually.
- **Where it lands:** Not used Day-1. Brand tokens already LOCKED in `lib/design/tokens.ts` + `app/globals.css`. tweakcn output would conflict with Iron Law 2.21 (additive only) + 2.26 (brand locked).
- **Concrete integration:** n/a — REJECTED for v4.
- **Iron Law interaction:** Iron Laws 2.21 + 2.26.
- **Priority:** **REJECTED for v4** — brand locked.

##### X.2.7 — Figma Make
- **Link:** https://www.figma.com/make
- **Category:** AI prompt-to-prototype inside Figma (Free 500 cred → $16/seat)
- **What it does:** Generate Figma frames from prompt.
- **Where it lands:** Not used (no designer in loop Day-1).
- **Concrete integration:** n/a — operator-side if designer hired post-launch.
- **Iron Law interaction:** None.
- **Priority:** **P2** (operator-side post-launch)

##### X.2.8 — Magic Patterns
- **Link:** https://magicpatterns.com
- **Category:** AI design tool SaaS (Free → $20/seat → $100/seat); first-class Cursor/CC MCP, Claude.ai connector; SOC 2
- **What it does:** Design + ship to existing product stack via MCP.
- **Where it lands:** Not used for v4 (brand locked; no design exploration needed). Available post-launch via MCP for new pages.
- **Concrete integration:** Optional Phase 0 install: `npx @magicpatterns/magic-mcp`. Add to `.mcp.json`.
- **Iron Law interaction:** Iron Law 2.26 — generated patterns must conform to Posture A.
- **Priority:** **P2** (operator-side post-launch)

##### X.2.9 — Mowgli
- **Link:** https://mowgli.ai
- **Category:** AI design canvas SaaS (free + paid; whole-product mapping)
- **What it does:** Maps entire product (flows, journeys, screens); exports curated AI bundle for CC/Cursor/Codex.
- **Where it lands:** Not used (Vialchems product flow already mapped + implemented).
- **Concrete integration:** n/a — operator-side post-launch if Mowgli helps.
- **Iron Law interaction:** None.
- **Priority:** **P2** (operator-side post-launch)

##### X.2.10 — Moonchild AI
- **Link:** https://moonchild.ai
- **Category:** AI design SaaS (Pro $12.75/mo → Max $46/mo); Moonchild MCP
- **What it does:** Designs INSIDE existing design system from PRD; MCP-native.
- **Where it lands:** Not used (Vialchems brand locked; no exploration).
- **Concrete integration:** Available post-launch if operator wants AI design within Posture A constraints. `.mcp.json` add for Moonchild MCP.
- **Iron Law interaction:** Iron Law 2.26 — must conform to Posture A.
- **Priority:** **P2** (operator-side post-launch)

##### X.2.11 — Durable
- **Link:** https://durable.com
- **Category:** AI business builder SaaS (Free → $22/mo)
- **What it does:** Site + CRM + invoicing + booking.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — wrong category (no code export; Vialchems is custom-coded).

##### X.2.12 — Gamma
- **Link:** https://gamma.app
- **Category:** AI presentation/document/website builder (Free 400 cred → $8/mo)
- **What it does:** Slides + docs + marketing sites.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — wrong category (slides/marketing; not app UI).

##### X.2.13 — Uizard
- **Link:** https://uizard.io (acquired by Miro Jun 2024)
- **Category:** AI sketch/screenshot → mockup SaaS (Free 3/mo → $12/mo)
- **What it does:** Hand-drawn-wireframe-to-mockup capture.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — wrong workflow (no sketch input for v4); post-acquisition uncertainty per `RESEARCH_PLAN.md` §3.3 Tier 3.

##### X.2.14 — Relume
- **Link:** https://relume.io
- **Category:** AI sitemap → wireframe → component library for Webflow/Figma/React (Free → $26/seat)
- **What it does:** 1,000+ components for marketing sites.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — Webflow/marketing-site oriented; Vialchems is custom React/Next.js for app UI.

##### X.2.15 — UXMagic.ai
- **Link:** https://uxmagic.ai
- **Category:** AI URL/text/sketch → Figma SaaS (Free 30 once → ~$25/mo)
- **What it does:** Multi-input → Figma; can clone existing sites.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — no need for Figma output; designer not in loop Day-1.

##### X.2.16 — Quiver AI
- **Link:** https://quiver.ai
- **Category:** AI native vector model ($8.3M seed; Free 10 → paid; API only)
- **What it does:** Clean SVG icons/logos/typography generation.
- **Where it lands:** Not used (Vialchems uses Lucide React for line icons + Vial.tsx as the only custom SVG; no need for new vectors Day-1).
- **Concrete integration:** Optional Phase 0 install if operator wants new vector assets post-launch. API-only.
- **Iron Law interaction:** None.
- **Priority:** **P2** (operator-side post-launch for new vector assets)

##### X.2.17 — Recraft AI
- **Link:** https://recraft.ai
- **Category:** AI vector + raster design SaaS (Free 30/day → $25/mo); SVG + PNG + Lottie + CMYK
- **What it does:** Mature AI image + vector design.
- **Where it lands:** Not used Day-1.
- **Concrete integration:** Optional post-launch for new asset generation.
- **Iron Law interaction:** Iron Law 2.10 — generated images cannot become fake testimonials / before-after content.
- **Priority:** **P2** (operator-side post-launch)

##### X.2.18 — svgs.app
- **Link:** https://svgs.app
- **Category:** Unclear (thin landing; minimal docs/team/pricing)
- **What it does:** Possibly free AI SVG generator + library.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — `RESEARCH_PLAN.md` §7 flagged "no signal — likely thin SEO landing or barely-launched side project; use Recraft or QuiverAI for real SVG work."

##### X.2.19 — Remotion
- **Link:** https://remotion.dev
- **Category:** Programmatic video as React components (45k★; Free ≤3 / $25/mo)
- **What it does:** Compose MP4/etc videos in React.
- **Where it lands:** Not used (no video content Day-1).
- **Concrete integration:** Optional post-launch if operator adds video content.
- **Iron Law interaction:** Iron Law 2.10 — video cannot become fake testimonials.
- **Priority:** **P2** (operator-side post-launch)

##### X.2.20 — Midjourney
- **Link:** https://midjourney.com
- **Category:** AI image generation (subscription; raster only)
- **What it does:** Inspiration / mood-boards.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** Iron Law 2.10 — raster output cannot become fake before/after imagery on the site.
- **Priority:** **REJECTED** — inspiration only per `RESEARCH_PLAN.md` §3.3 Tier 3; not a UI design tool; not a Day-1 asset source.

##### X.2.21 — dotless.co
- **Link:** https://dotless.co
- **Category:** Lead-generation SaaS for finding businesses without websites (waitlist; Free 10 → $9/mo)
- **What it does:** B2B lead-gen for web designers.
- **Where it lands:** Not used (wrong category).
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — wrong category (lead-gen for designers; not a Vialchems tool).

##### X.2.22 — shadcn/ui
- **Link:** https://ui.shadcn.com
- **Category:** Copy-paste React component system on Radix + Tailwind (114k★, MIT); official MCP
- **What it does:** Components you own (CLI copies source into repo).
- **Where it lands:** Not adopted Day-1. v3.0 codebase has hand-rolled `components/ui/*` primitives (Button/Card/Input/Pill/Specs/FieldLabel/Vial). Adopting shadcn would mean either (a) replacing all primitives (high churn, breaks tests) or (b) maintaining two component systems (forbidden anti-pattern). v4 sticks with hand-rolled primitives + extends them per Phase 2.
- **Concrete integration:** shadcn MCP available via Phase 0: `{"mcpServers":{"shadcn":{"command":"npx","args":["shadcn@latest","mcp"]}}}` in `.mcp.json`. Useful for browsing shadcn patterns as design reference, NOT for installing components into Vialchems primitives.
- **Iron Law interaction:** Iron Law 2.21 — adopting shadcn would require renaming/rewriting existing primitives, which violates additive-only token + API stability. Iron Law 2.26 — shadcn defaults (some Geist/Inter usage in component templates) would conflict with Posture A unless heavily themed.
- **Priority:** **P2** (MCP for reference only; do NOT install components)

##### X.2.23 — 21st.dev
- **Link:** https://21st.dev
- **Category:** shadcn-compatible component marketplace + AI generation (Magic MCP via @21st-dev/magic-mcp)
- **What it does:** Marketplace + AI-generated shadcn-compat components.
- **Where it lands:** Not used (same reason as X.2.22 — not adopting shadcn primitives).
- **Concrete integration:** n/a for v4.
- **Iron Law interaction:** Same as X.2.22.
- **Priority:** **P2** (operator-side post-launch if shadcn adoption considered)

##### X.2.24 — Storybook
- **Link:** https://storybook.js.org
- **Category:** Component workshop / documentation / visual testing (89.8k★, MIT); official MCP in v10.3 (React-only currently)
- **What it does:** Build/document/test UI components in isolation.
- **Where it lands:** Not added Day-1 (Vialchems has no component library to publish; v4 visual-regression baseline via Playwright `toHaveScreenshot()` covers visual testing without Storybook overhead per Iron Law 2.18).
- **Concrete integration:** Optional post-launch if operator wants to publish a public component library or formal design system docs. Add Storybook MCP at that time.
- **Iron Law interaction:** None directly.
- **Priority:** **P2** (operator-side post-launch)

##### X.2.25 — Lucide
- **Link:** https://lucide.dev
- **Category:** Icon set (~1,700 line icons, ISC, ~22.5k★)
- **What it does:** Default React icon library.
- **Where it lands:** Already installed (`lucide-react` in `package.json` dependencies). Used in `components/MobileNavMenu.tsx:17` (Menu, X icons). v4 may add more usages as visual elevation surfaces new iconography needs.
- **Concrete integration:** Already in `package.json`. Import per usage: `import { IconName } from 'lucide-react';`
- **Iron Law interaction:** Iron Law 2.26 — must use Lucide consistently per Phase 4 v3.0 anti-pattern enforcement (no emoji icons; one icon system).
- **Priority:** **P0** (already installed)

##### X.2.26 — Heroicons
- **Link:** https://heroicons.com
- **Category:** Icon set (316 icons by Tailwind Labs, MIT, 4 sizes)
- **What it does:** Pixel-perfect small-size icons.
- **Where it lands:** Not used (Lucide is the locked icon system per Iron Law 2.26 + Phase 4 v3.0 anti-pattern enforcement: "Don't mix icon sets").
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** Iron Law 2.26.
- **Priority:** **REJECTED** — Lucide is the locked icon system.

##### X.2.27 — Phosphor Icons
- **Link:** https://phosphoricons.com
- **Category:** Icon set (1,248+ icons in 6 weights — Thin/Light/Regular/Bold/Fill/Duotone, MIT)
- **What it does:** Multi-weight icons.
- **Where it lands:** Not used (same reason as X.2.26).
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** Iron Law 2.26.
- **Priority:** **REJECTED** — Lucide is the locked icon system.

##### X.2.28 — SVG Repo
- **Link:** https://www.svgrepo.com
- **Category:** SVG marketplace / aggregator (500k+ free SVGs, mixed licenses)
- **What it does:** One-off SVG asset source.
- **Where it lands:** Not used Day-1 (no asset gaps in the route table that Lucide doesn't cover).
- **Concrete integration:** Available post-launch for one-off asset needs; license must be checked per asset.
- **Iron Law interaction:** Iron Law 2.16 — supply-chain audit per asset (license verification).
- **Priority:** **P2** (operator-side post-launch)

##### X.2.29 — Motion (formerly Framer Motion)
- **Link:** https://motion.dev
- **Category:** Animation library (MIT OSS core; Motion+ is paid premium upsell)
- **What it does:** Declarative animation for React/JS/Vue.
- **Where it lands:** Phase 7 install. Used for compound animations that CSS cannot easily express (page transitions via View Transitions API where stable, stagger with sequencing, gesture-driven micro-interactions if added).
- **Concrete integration:** `npm install motion`. Import: `import { motion, useReducedMotion } from 'motion/react';`. Do NOT install Motion+ (paid; not justified for v4 scope).
- **Iron Law interaction:** Iron Law 2.18 — motion library must honor `useReducedMotion()` hook. Iron Law 2.27 — bundle impact ≤ 50KB initial JS gzipped (verify via `@next/bundle-analyzer`).
- **Priority:** **P0** (Phase 7)

##### X.2.30 — Lottie / LottieFiles
- **Link:** https://lottiefiles.com
- **Category:** JSON-based vector animation format + ecosystem (MIT player; freemium platform)
- **What it does:** Tiny vector animations playable in any framework.
- **Where it lands:** Not used Day-1 (Vialchems has no hero animations or onboarding sequences requiring Lottie; Vial.tsx CSS animation + new Phase 7 motion cover the surface).
- **Concrete integration:** Available post-launch via `@lottiefiles/dotlottie-react` if hero animation added.
- **Iron Law interaction:** Iron Law 2.27 — Lottie player adds ~50-100KB; budget impact must be verified.
- **Priority:** **P2** (operator-side post-launch)

##### X.2.31 — Figma
- **Link:** https://figma.com
- **Category:** Design + collaboration platform (proprietary SaaS; official MCP server in Dev Mode)
- **What it does:** Industry-standard design tool.
- **Where it lands:** Not adopted Day-1 (no designer in loop). Available post-launch if operator hires designer.
- **Concrete integration:** Optional post-launch: enable Figma MCP via Dev Mode toggle in a Figma file. Operator action.
- **Iron Law interaction:** None directly. If adopted, exporting `lib/design/tokens.ts` to Figma variables keeps lockstep.
- **Priority:** **P2** (operator-side post-launch)

##### X.2.32 — Excalidraw
- **Link:** https://excalidraw.com
- **Category:** Hand-drawn whiteboard / diagramming (MIT OSS)
- **What it does:** Quick architecture sketches.
- **Where it lands:** Not used in v4 (no new architecture diagrams needed; v3.0 architecture plan already exists).
- **Concrete integration:** n/a — operator-side workshop tool.
- **Iron Law interaction:** None.
- **Priority:** **P2** (operator-side workshop)

##### X.2.33 — Penpot
- **Link:** https://penpot.app
- **Category:** Open-source Figma alternative (MPL 2.0)
- **What it does:** Self-hostable design tool with SVG-native output; recently shipped Penpot MCP.
- **Where it lands:** Not adopted Day-1 (no designer in loop).
- **Concrete integration:** n/a — operator-side post-launch alternative to Figma if open-source is preferred.
- **Iron Law interaction:** None directly.
- **Priority:** **P2** (operator-side post-launch alternative)

##### X.2.34 — Adobe XD
- **Link:** https://adobe.com/products/xd
- **Category:** Legacy design tool (END OF LIFE since 2022)
- **What it does:** Historical UI design.
- **Where it lands:** Not used.
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — End of life since 2022; removed from sale Jun 2023; no roadmap per `RESEARCH_PLAN.md` §7. Do NOT start any work in XD.

##### X.2.35 — Miro
- **Link:** https://miro.com
- **Category:** Infinite-canvas collaboration / whiteboard (proprietary SaaS)
- **What it does:** Workshops, ideation.
- **Where it lands:** Not used in v4.
- **Concrete integration:** n/a — operator-side workshop tool.
- **Iron Law interaction:** None.
- **Priority:** **P2** (operator-side workshop)

##### X.2.36 — Mobbin
- **Link:** https://mobbin.com
- **Category:** Mobile + web UI/UX inspiration library (SaaS; Pro ~$10/mo)
- **What it does:** 600,000+ real-app screenshots organized by flow.
- **Where it lands:** Reference only — operator can browse for Phase 3-6 elevation calibration if Appendix AC needs supplementation.
- **Concrete integration:** Operator-side browse at https://mobbin.com.
- **Iron Law interaction:** Iron Law 2.10 + 2.26 — referenced patterns must conform to Posture A; cannot copy any vendor's flow verbatim.
- **Priority:** **P1** (operator-side reference for Phase 3-6 calibration)

##### X.2.37 — Dribbble
- **Link:** https://dribbble.com
- **Category:** Designer portfolio / inspiration (free browse + Pro tier)
- **What it does:** Mood-board.
- **Where it lands:** Reference only.
- **Concrete integration:** Browse for color/typography mood-boarding only; never trust a "shot" as a production-ready pattern.
- **Iron Law interaction:** Same as X.2.36.
- **Priority:** **P2** (reference)

##### X.2.38 — Framer (the site builder, NOT framer-motion)
- **Link:** https://framer.com
- **Category:** AI-augmented no-code site builder (proprietary SaaS)
- **What it does:** Designer-first site builder competing with Webflow/Wix/WordPress.
- **Where it lands:** Not used (Vialchems is custom Next.js).
- **Concrete integration:** n/a — REJECTED.
- **Iron Law interaction:** None.
- **Priority:** **REJECTED** — wrong category (no code export; not for app UI per `RESEARCH_PLAN.md` §3.8).

#### Appendix X — Self-validation

Per Hard Rule 10 of the meta-prompt: count of tools in `RESEARCH_PLAN.md` must equal count of entries in Appendix X.

- **`RESEARCH_PLAN.md` distinct tool count:** 99 (verified via inventory tables in §2: 18 Design Skills/Plugins + 9 Awesome Lists + 21 AI Mockup SaaS + 7 Component & Icon + 2 Animation [Motion + Lottie; Remotion already counted in Mockup] + 5 Design Tools + 3 Inspiration [21st.dev already counted in Component] + 6 Workflow Methodologies + 26 CC Ecosystem + 2 Misc [Cursor visual editor + Vercel Agent; respira.press already counted in CC Ecosystem; Excalidraw+Miro is a methodology note pointing back to Design Tools])
- **Appendix X.1 entries:** 61 (X.1.1 through X.1.61)
- **Appendix X.2 entries:** 38 (X.2.1 through X.2.38)
- **Appendix X total:** 99
- **Match:** ✓

### Appendix Y — Visual-Regression Baseline

Per Iron Laws 2.18 + 2.25.

**Tool choice:** Playwright `toHaveScreenshot()` (built-in; zero extra dependency beyond `@playwright/test` already in `package.json` devDependencies).

**Coverage:**
- All 38 routes (per CODEBASE_UNDERSTANDING.md §4 route table)
- 3 viewports: 375px (mobile), 768px (tablet), 1440px (desktop)
- 2 color schemes: system default + dark (Vialchems is dark-only Day-1; capture both for future-proof)
- Total snapshots: 38 × 3 × 2 = **228 baseline images**

**Capture procedure (Phase 11):**

1. Operator confirms Phase 3-9 polish complete; site is at the Appendix AC calibration target
2. Run baseline capture against dev server (or Vercel preview URL):
   ```bash
   npm run dev &
   sleep 8
   npx playwright test tests/e2e/visual.spec.ts --update-snapshots
   ```
3. Operator reviews `tests/e2e/__screenshots__/` per-page (sample 10-15 representative pages); confirms calibration target is met
4. Operator records approval in `docs/checkpoints/v4_phase_11_visual_baseline_approval.md` with attestation: "I, the operator, have reviewed the visual-regression baseline at `tests/e2e/__screenshots__/` and confirm it represents the Appendix AC calibration target. <date>, <operator name>"
5. Commit baseline + approval artifact

**Snapshot storage:**
- Snapshots committed to `tests/e2e/__screenshots__/` directly
- If total size > 50MB, switch to git LFS: `git lfs track "tests/e2e/__screenshots__/**/*.png"` and re-commit
- `.gitignore` exception: `tests/e2e/__screenshots__/` is committed (do NOT gitignore)

**Diff threshold:**
- Default per `playwright.config.ts`: `expect.toHaveScreenshot.maxDiffPixelRatio: 0.001` (0.1%)
- Per-page override possible via `expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.005 })` for pages with intentional dynamic content (e.g., year in footer copyright); document each override in `tests/e2e/visual.spec.ts` inline comments

**CI integration (Phase 12):**
- `.github/workflows/visual.yml` runs `npx playwright test tests/e2e/visual.spec.ts` on every PR
- On diff: workflow uploads diff images as PR artifact + posts a PR comment with thumbnails
- PR cannot merge unless: (a) no diffs above threshold, OR (b) operator explicitly approves the PR after reviewing the diff (Iron Law 2.25)
- Branch protection rule (Phase 12 deliverable) requires the visual-regression status check + operator review

**Diff approval flow:**
1. PR author runs locally: `npx playwright test tests/e2e/visual.spec.ts` to see diffs
2. If intentional change: PR author runs `npx playwright test tests/e2e/visual.spec.ts --update-snapshots` and commits new baseline
3. Operator reviews PR; if visual change is desired, operator approves PR explicitly
4. CI re-runs against new baseline; passes; merge unblocked

### Appendix Z — Production Pre-Launch Checklist

Every condition must be ✓ before Phase 12 Vercel production deploy. The checklist lives at `docs/checkpoints/v4_pre_launch_checklist.md` (composed during Phase 12; this appendix is the template).

**Operator pre-conditions:**

- [ ] **Domain registered:** `vialchems.labs` purchased via 101domain or Gandi (or fallback `vialchems.com` / `vialchems.bio`)
- [ ] **DNS access:** operator has registrar control panel access for DNS edits
- [ ] **LLC formation:** operator has filed LLC paperwork (Wyoming default); EIN obtained or in process
- [ ] **USPTO TESS trademark search:** operator has run search for "vialchems" + "vialchems labs"; no blocking conflicts
- [ ] **Source supplier:** operator has confirmed MOQ, lead time, COA passthrough, contingency posture (placeholder fulfillment promises in code remain acceptable until first batch ships)
- [ ] **Lab partner contract:** operator has signed per-batch testing agreement with Janoshik Analytical (or alternative confirmed via `LAB_PARTNER_NAME` env override)
- [ ] **First-batch real COA PDFs:** operator has the 7 real per-batch COA PDFs ready to replace `public/coa/<slug>-BATCH-2026-PLACEHOLDER.pdf` (or accepts placeholder until first batch produces)

**Service credentials (per Appendix AA):**

- [ ] Supabase project provisioned; URL + anon key + service-role key in Vercel production env vars
- [ ] Resend account; `vialchems.labs` (or `mail.vialchems.labs`) sender domain verified; DMARC `p=reject` configured; API key in Vercel
- [ ] Sentry org + project; DSN + auth token + org slug + project slug in Vercel
- [ ] Plaid client ID + secret + production env approval; webhook verification key in Vercel
- [ ] BTCPay (self-hosted Docker OR Voltage Cloud) URL + API key + store ID + webhook secret in Vercel
- [ ] Cookie consent provider configured per Phase 10 PENDING decision (default: self-hosted)

**Code state:**

- [ ] All 14 phases (0-13) of v4 complete with checkpoint artifacts on disk
- [ ] All deferrals from `docs/operator-runbook.md` v1 closed (verified via Appendix AB)
- [ ] All Iron Laws 2.1-2.27 verified (per Phase 12 verification gate)
- [ ] No protected-path commits without `// SCANNER_OK: reviewed-and-cso-passed` annotation
- [ ] No real credentials in git history (`git log -p --all | grep -E 'sk_(live|test)|production_secret|service_role'` returns 0 hits)
- [ ] `npm run preflight` clean (typecheck + lint + 3 grep gates + new gates)
- [ ] `npm test` clean (304+ baseline + new tests)
- [ ] `npm run test:e2e:ci` clean (Playwright unskipped)
- [ ] `npm run test:visual` clean against operator-approved baseline
- [ ] `npm run test:lighthouse` clean (≥ 90/95/95/95 every page)
- [ ] `npm run build` clean
- [ ] No `test.skip(true)` or `test.only(...)` in `tests/e2e/`
- [ ] Visual-regression baseline approved (Appendix Y procedure)

**CI gates active:**

- [ ] `.github/workflows/test.yml` runs unit + E2E tests on every PR
- [ ] `.github/workflows/lighthouse.yml` runs LHCI on every PR; assertions enforced
- [ ] `.github/workflows/visual.yml` runs visual-regression suite on every PR; diffs above threshold require operator approval
- [ ] Branch protection rule on `main` requires all 4 workflow status checks + operator review for visual diffs

**gstack pre-deploy reviews:**

- [ ] `/review` on full v4 diff vs v1.0.0 tag: 0 critical findings
- [ ] `/cso` infrastructure security audit: 0 critical findings
- [ ] `/codex review` on Phase 10 service wiring: pass
- [ ] `/codex challenge` on cookie consent integration: pass
- [ ] `/total-security-audit`: pass

**Documentation:**

- [ ] `README.md` updated with v1.1.0 release notes
- [ ] `CHANGELOG.md` v1.1.0 entry written
- [ ] `ARCHITECTURE.md` (new file at root) reflects v4 wiring state
- [ ] `docs/operator-runbook.md` v2 updated (closed deferrals strikethrough)

**Final operator confirmation:**

- [ ] Operator reviews this checklist; signs off on `docs/checkpoints/v4_pre_launch_checklist.md` with attestation
- [ ] Operator authorizes `vercel --prod` execution

### Appendix AA — Operator Credential Intake Form

Used in Phase 10 (services wiring) and Phase 12 (deploy). The agent presents this form to the operator; operator fills via chat OR via a temporary file at `/tmp/vialchems_credentials.txt` that the agent reads ONCE and the operator then deletes (Iron Law 2.22 — never committed).

**Form template:**

```
=== VIALCHEMS LABS — OPERATOR CREDENTIAL INTAKE (v4 Phase 10) ===

INSTRUCTIONS:
1. Fill the values below. Do NOT commit this file.
2. Save to /tmp/vialchems_credentials.txt
3. Notify the agent in chat: "Credentials ready at /tmp/vialchems_credentials.txt"
4. Agent reads ONCE, applies to Vercel env vars + .env.local (gitignored), then notifies operator: "Credentials applied. Delete /tmp/vialchems_credentials.txt now."
5. Operator deletes the file.

=== SECTION 1: SITE BASICS ===

NEXT_PUBLIC_SITE_URL=https://vialchems.labs   # Or fallback if .labs unavailable
BRAND_DOMAIN=vialchems.labs
LLC_NAME=                                     # e.g., "Vialchems Labs LLC"
LLC_JURISDICTION=Wyoming                       # Default; alternatives: Delaware, Nevada
LLC_REGISTERED_AGENT=                          # Operator action result
LLC_PRINCIPAL_ADDRESS=                         # Operator action result

=== SECTION 2: SUPABASE (Phase 10.1) ===

NEXT_PUBLIC_SUPABASE_URL=                      # https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=                 # eyJ... (long anon JWT)
SUPABASE_SERVICE_ROLE_KEY=                     # eyJ... (long service-role JWT — NEVER expose client-side)
REQUIRE_SUPABASE=true                          # Flip from false to true once provisioned

=== SECTION 3: RESEND (Phase 10.2) ===

RESEND_API_KEY=re_                             # Resend dashboard
ORDER_EMAIL_FROM=research@vialchems.labs       # Verified sender
ORDER_STAFF_EMAILS=ops@vialchems.labs          # Comma-separated; receives staff notifications
RESEND_SENDER_DOMAIN_VERIFIED=                 # yes/no — operator confirms domain verification + DMARC p=reject

=== SECTION 4: SENTRY (Phase 10.3) ===

NEXT_PUBLIC_SENTRY_DSN=                        # https://...@sentry.io/...
SENTRY_AUTH_TOKEN=                             # sntrys_... (for source-map uploads)
SENTRY_ORG=vialchems-labs                      # Slug
SENTRY_PROJECT=vialchems-labs-prod             # Slug

=== SECTION 5: PLAID (Phase 10.4) ===

PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox                              # sandbox first; flip to production after smoke test
PLAID_PRODUCTS=auth,transactions
PLAID_COUNTRY_CODES=US
PLAID_WEBHOOK_VERIFICATION_KEY=                # JWKS URL OR HMAC key during transition

=== SECTION 6: BTCPAY (Phase 10.5) ===

BTCPAY_HOSTING_CHOICE=                         # "self-host" OR "voltage-cloud" — PENDING decision
BTCPAY_URL=                                    # https://btcpay.<your-domain>
BTCPAY_API_KEY=                                # Greenfield API key
BTCPAY_STORE_ID=                               # Store ID
BTCPAY_WEBHOOK_SECRET=                         # Webhook signing secret

=== SECTION 7: COOKIE CONSENT (Phase 10.6) ===

COOKIE_CONSENT_PROVIDER=                       # "self-hosted" (default) OR "osano" OR "cookiebot" OR "onetrust"
COOKIE_CONSENT_PROVIDER_API_KEY=               # If non-self-hosted

=== SECTION 8: PAYMENT PROVIDER SELECTION ===

PAYMENT_PROVIDER=stub                          # Day-1 production: flip to "btcpay" or "plaid" after Phase 13 verification

=== SECTION 9: VERCEL (Phase 12) ===

VERCEL_PROJECT_ID=                             # Auto-populated by `vercel link`
VERCEL_ORG_ID=                                 # Auto-populated by `vercel link`

=== SECTION 10: DOMAIN REGISTRAR (Phase 12) ===

DOMAIN_REGISTRAR=                              # "101domain" OR "gandi" OR fallback
DOMAIN_PURCHASED=                              # yes/no — operator confirms purchase

=== END OF FORM ===

After agent applies these values:
- All values mirrored to .env.local (gitignored) for local dev
- All values added to Vercel production env via `vercel env add <NAME> production`
- This file deleted by operator
- Iron Law 2.22 verified: no real values in git, in this prompt, in any committed file
```

### Appendix AB — Deferral Ledger (every v3.0 deferral mapped to closing v4 phase)

Every open deferral from `docs/operator-runbook.md` and `CODEBASE_UNDERSTANDING.md` §8 mapped to its v4 closing phase. Phase 12 verification gate confirms all are ✓.

| # | Deferral (from v3.0) | Source | Closes in v4 phase |
|---|---|---|---|
| D1 | Real Resend wire (4-email welcome sequence + lead magnet PDF generation) | runbook §1.2 | Phase 10.2 |
| D2 | Real Supabase Auth + email-link tokens, 1h expiry, single-use | Phase 10 v3.0 + Phase 13 codex review | Phase 10.1 |
| D3 | Order persistence to Supabase (`orders`, `order_items`, `order_status_history`, `payments`) + RLS | Phase 13 codex review | Phase 10.1 |
| D4 | Customer qualification submission persistence (`customer_qualifications` table) | Phase 13 codex review | Phase 10.1 |
| D5 | Email subscriptions persistence (`email_subscriptions` table linked to `orders.promo_code`) | Phase 13 codex review | Phase 10.1 |
| D6 | Audit log persistence (`audit_log` table) | architecture plan §4 | Phase 10.1 |
| D7 | `app/api/access/route.ts` (qualification persistence endpoint) | CODEBASE_UNDERSTANDING.md §3 (protected paths note) | Phase 10.1 |
| D8 | Real Plaid `createIntent` (Plaid Link + Transfer flow) | Phase 13 codex review (lib/payments/plaid.ts) | Phase 10.4 |
| D9 | Plaid HMAC → JWT/JWKS migration | Phase 13 codex review explicit deferral | Phase 10.4 |
| D10 | Real BTCPay `createIntent` (Greenfield POST `/api/v1/stores/{storeId}/invoices`) | Phase 13 codex review (lib/payments/btcpay.ts) | Phase 10.5 |
| D11 | BTCPay Server provisioning (Docker self-host OR Voltage Cloud) | runbook §6 + Phase 14 procedure | Phase 10.5 (operator side) |
| D12 | Sentry instrumentation activation in `next.config.ts` | architecture plan §2 + CODEBASE_UNDERSTANDING.md §8 | Phase 10.3 |
| D13 | Sentry alerts (error rate >1%, payment-flow >0.1%, webhook signature failure, performance LCP >4s) | Phase 15 v3.0 + architecture plan | Phase 10.3 |
| D14 | Cookie consent banner (operator decision deferred) | Phase 10 v3.0 + Phase 13 review | Phase 10.6 |
| D15 | Layer 3 jurisdictional check in `lib/payments/reconciliation.ts` (post-payment confirmation) | CODEBASE_UNDERSTANDING.md §3 (Iron Law 2.8 enforcement) | Phase 10.1 (with order persistence) |
| D16 | E2E Playwright unskip + browser provisioning | tests/e2e/checkout-{ach,crypto}.spec.ts test.skip(true) | Phase 11 |
| D17 | Lighthouse CI gate activation | Phase 12 v3.0 deferred + Iron Law 2.27 | Phase 11 |
| D18 | Vercel production deploy (interactive auth required from operator) | Phase 14 v3.0 deferred | Phase 12 |
| D19 | Domain registration + DNS pointing | Phase 14 v3.0 + runbook §1.1 | Phase 12 (operator side + agent integration) |
| D20 | LLC formation + EIN | runbook §1.3 | Operator side; Phase 10 env-var update only |
| D21 | Lab partner contract sign with Janoshik Analytical | runbook §1.5 | Operator side; Phase 12 verification |
| D22 | First-batch real COA PDFs | runbook §1.7 | Operator side; Phase 12 verification |
| D23 | First-buyer test dollar (real BTCPay invoice + real Plaid ACH) | Phase 15 v3.0 procedure + CODEBASE_UNDERSTANDING.md §8 | Phase 13 (operator-funded) |
| D24 | Branch protection on `main` (require PR + CI checks + operator review for visual diffs) | Iron Law 2.25 | Phase 12 |
| D25 | Visual-regression baseline + diff CI | Iron Law 2.18 + 2.25 | Phase 11 |
| D26 | DESIGN.md at repo root (optional; portability for external agents) | CODEBASE_UNDERSTANDING.md §8 Tier 1 #1 | Phase 1 |
| D27 | Component-level CSS variables (third tier of design tokens) | CODEBASE_UNDERSTANDING.md §8 Tier 1 #4 | Phase 1 |

**Out of v4 scope (operator-side post-launch):**
- D-OPS-1: Slice 3 community-channel research (Reddit + Meso-Rx + forums + Telegram + Discord) — operator fires B1 prompt at ChatGPT Pro Deep Research
- D-OPS-2: KPV catalog expansion (Day-30 candidate per runbook §11)
- D-OPS-3: Cards Phase-2 rail (MAX/MESH/Rocketfuel) — Day-90+ after first revenue signal
- D-OPS-4: New brand-pick reconfirmation (Bible §16 60-min buyer-conversation assignment)
- D-OPS-5: Second blog-post wave + content cadence (operator owns post-launch)

### Appendix AC — UI Elevation Reference Set

Operator-calibrated visual targets that exemplify the level of polish v4 is aiming at. The agent uses these as the "what good looks like" reference during Phases 3-6.

**OPERATOR ACTION (Phase 0):** Operator confirms the reference set below OR replaces with operator-preferred references via chat. Without operator confirmation, agent uses the defaults below and surfaces the choice at Phase 0 checkpoint.

**Default reference set (clean clinical / research-grade Posture A targets):**

1. **Stripe.com** — Clean clinical typography rhythm, generous whitespace, restrained color, semantic hierarchy. Vialchems hero + thesis sections aim at this density.
2. **Linear.app** — Atmospheric backgrounds, monospace data accents, dark surface elevation, motion vocabulary. Vialchems Vial + COA tables aim at this surface treatment.
3. **Vercel.com** — Component composition, asymmetric hero patterns, subtle gradient overlays. Vialchems shop catalog tile lift aims at this rhythm.
4. **Anthropic.com** — Editorial typography, italic accents, dark-first design language with restrained color. Vialchems blog post + about page aim at this voice.
5. **Cursor.so** — Premium-out easing, subtle hover lifts, refined Card elevations. Vialchems primitive overhauls (Phase 2) aim at this micro-interaction quality.
6. **Apple.com (developer documentation)** — Dense Specs grids, monospace tabular numerals, bordered separators. Vialchems PDP sidebar + COA detail aim at this density.

**Calibration mechanism:**

- Phase 0: Operator confirms / replaces this list. Stored in `docs/checkpoints/v4_phase_0_calibration.md`.
- Phase 1-6: Each phase produces before/after screenshots. Operator reviews against the reference set. `/design-review` runs; gstack reviewer references the calibration target.
- Phase 11: Visual-regression baseline captured. Operator approves baseline as "calibrated against Appendix AC." This becomes the merge-gate baseline (Iron Laws 2.18 + 2.25).

**Anti-references (do NOT aim at):**

- Generic SaaS dashboards with purple/blue gradients (Iron Law 2.26 + Phase 4 v3.0 anti-pattern)
- Maximalist B2C sites with stock photography (no stock photos per Iron Law 2.26)
- Meme-coded community sites (Posture B; Vialchems is Posture A LOCKED)
- Material Design / Bootstrap defaults (anti-pattern fonts per Iron Law 2.26)
- Webflow marketing-template aesthetic (no 3-column SaaS feature grid per Iron Law 2.26)

**Polish quality bar (per phase verification gate):**

- Typography: every type pairing uses tokens from `lib/design/tokens.ts`; no ad-hoc font sizes
- Color: every color reference uses CSS variables from `app/globals.css`; no ad-hoc hex
- Spacing: every spacing value uses spacing tokens; no ad-hoc px values outside tokens
- Motion: every animation uses motion tokens (durations + eases); honors reduced-motion (Iron Law 2.18)
- Density: Plex Mono tabular numerals for all numeric content (prices, batch numbers, dates)
- Hierarchy: clear h1 → h2 → h3 sequence; no skipped levels (a11y per §7.2)

---

## 11. CLOSING CONTRACT

You operate this build end-to-end. You do not ask the operator clarifying questions about decisions LOCKED in §1.3 or v3.0 `DECISIONS/`. You DO surface the seven PENDING decisions per §6.1 once at the start of the phase that needs each (cookie consent provider in Phase 10, Plaid env in Phase 10, BTCPay hosting in Phase 10, Sentry org/project in Phase 10, Resend domain in Phase 10, domain registrar in Phase 12, LLC jurisdiction in Phase 10).

You do not invent vendor names, prices, claims, or compliance language. Every assertion traces to v3.0 LOCKED state, this prompt, the codebase, or operator-supplied credentials. Every visual change traces to a Phase 1 token, a Phase 2 primitive, an Appendix V.2 anti-pattern enforcement, an Appendix AC calibration target, OR the Appendix AD operator-supplied vial reference. The reference image's banned compounds (tirzepatide, retatrutide) are LAYOUT placeholders only; Iron Law 2.7 still bans them from the catalog and from any `compound` prop value.

You do not weaken the compliance contract. Operator may strengthen, never weaken. The verbatim text in `lib/compliance.ts`, `components/SiteFooter.tsx`, `app/checkout/review/ReviewPanel.tsx`, `lib/customer-qualification.ts`, `lib/content/email-templates.ts`, `lib/content/faq.ts`, `app/about/page.tsx`, and `app/legal/*` is UNTOUCHABLE for visual elevation. Any change requires operator-issued LOCKED_OVERRIDE per §6.3.

You do not skip phases. Each phase ends with its checkpoint artifact at `docs/checkpoints/v4_phase_<N>_<name>.md` and `/context-save` so the build is resumable.

You do not introduce any new payment rail beyond `{stub, btcpay, plaid}` (Iron Law 2.20). The `PaymentProviderId` type in `lib/payments/types.ts:16` is FROZEN.

You do not commit real credentials (Iron Law 2.22). `.env.local` only; never in git history.

You do not bypass the pre-commit hook (Iron Law 2.16) or branch protection (Phase 12 deliverable). Failures get fixed at root cause, not bypassed.

You report at the end of each phase with a one-screen status update: what landed, what's next, any operator-side actions needed (especially around Appendix AA credential intake and Appendix Z pre-launch checklist).

When all 14 phases (0-13) complete and Phase 13 verification gate is ✓, the operator has a production-launched site at `https://vialchems.labs` (or fallback) with:
- Real credentials in Vercel env vars; zero stub values
- Real BTCPay invoice flow tested with operator's $1 first-buyer dollar
- Real Plaid ACH flow tested with operator's $1 first-buyer dollar
- Sentry alerts active and verified by test error
- Lighthouse ≥ 90/95/95/95 on every page enforced as PR-blocking CI gate
- Visual-regression baseline approved and enforced as PR-blocking CI gate
- Cookie consent banner active and operator-approved
- All 27 Iron Laws verified
- All 27 deferrals (D1-D27) closed
- Branch protection active on `main`
- v1.1.0 git tag pushed
- README + CHANGELOG + ARCHITECTURE.md + operator-runbook v2 updated
- Week +1 retrospective scheduled
- **Zero post-launch operator editing required** — operator pasted this prompt, confirmed the seven PENDING decisions via Appendix AA at Phase 10, funded the first-buyer dollar at Phase 13, and the site is live.

If at any point you discover a discrepancy between this prompt and the codebase, between this prompt and v3.0 LOCKED state, or between Appendix X.1/X.2 and `RESEARCH_PLAN.md`, stop, surface the discrepancy, and ask the operator to reconcile. Do not silently adapt.

Begin Phase 0. Read the inputs contract per §1. Audit the codebase. Install the agentic toolkit per Appendix X.1. Report state. Then proceed.

---

End of super-prompt v4.0.

### Appendix AD — Vial Reference Image (Operator-Supplied; 2026-05-09)

**Source on disk:** `/root/peptide-site/docs/design-references/vial-reference-2026-05-09.webp` (copied from operator's team via `C:\Users\endeg\Downloads\AF43A071-FBA0-45CE-8BE3-4150CAE7D94C.webp`).

**OPERATOR ACTION (Phase 0):** The receiving chat MUST open this image with the Read tool and analyze it before Phase 2 (UI Primitive Overhaul / `Vial.tsx`) and Phase 4 (PDP polish). Treat the image as a calibration target with the explicit constraints listed below.

**Image content — six annotated sections:**

1. **Full-Wrap Label Design (50mm × 25mm).** Black/charcoal background; white compound name and dose; teal accent stripe; VIALCHEMS LABS wordmark at top center; "RESEARCH USE ONLY / NOT FOR HUMAN CONSUMPTION" disclaimer (verbatim Iron Law 2.4 / Appendix A.2 wording); QR code on the left; batch + lot + manufacture date + expiry on the right. This is the FLAT (unwrapped) label design as it exists in print before being applied to the vial.

2. **Front Label Portion (50mm × 25mm).** Single-face view — what the buyer sees on the vial face. Confirms the visual hierarchy: BRAND → COMPOUND → DOSE → DISCLAIMER → BATCH. Confirms the typography mix: monospace Plex Mono for tabular data (batch/lot/dates/QR-adjacent), sans-serif Plex Sans for the compound name and dose.

3. **Vial Size Guide.** Physical dimensions: 50mm height × 22mm diameter; 10ml capacity. Aspect ratio 50:22 ≈ 2.27:1 (height-to-width). The current `components/ui/Vial.tsx` SVG uses `viewBox="0 0 32 80"` which is 80:32 = 2.5:1 — slightly elongated vs the real product. Phase 2 may refine to 2.27:1 (`viewBox="0 0 22 50"` or proportional equivalent) for product fidelity, but the change must remain within Iron Law 2.21 (additive token discipline) and Iron Law 2.26 (brand expression locked — no radical silhouette change).

4. **Print Sheet Mockup (4.5" × 11").** Operator-side fulfillment artifact: production-ready label sheet for batch printing. Does NOT directly affect site UI. Operator fulfillment infrastructure; v4 site code does not need to render this.

5. **Metrics & Usage.** Spec-density display pattern. Reinforces the data-row hierarchy that already exists in `components/ui/Specs.tsx` and `app/coa/[peptide]/[batch]/page.tsx`. Phase 4 may use this density as a calibration reference for the PDP COA tab + COA detail layout.

6. **Packaging Concept.** Operator-side outer box / shipping carton design. Does NOT affect site UI. Operator pre-launch artifact only.

**⚠️ CRITICAL — banned compounds shown for layout reference only:**

The reference image displays TIRZEPATIDE and RETATRUTIDE as label placeholders. **Both compounds remain BANNED per Iron Law 2.7** (perpetual ITC GEO 337-TA-1377 for tirzepatide; 90-day FDA-enforcement carve-out for retatrutide; operator may override the latter only after Day-90 review per `STAGE6_MANIFEST.yaml:73`). The reference image's value is the LABEL LAYOUT and SIZE GUIDE — **NOT the compound list**. The agent does NOT add tirzepatide or retatrutide to `lib/content/products.ts` based on this image. The catalog stays at the locked 7 SKUs (BPC-157, TB-500, GHK-Cu, Ipamorelin, CJC-1295 no DAC, MOTS-c, Selank) per Appendix E.

**Authentic compounds shown that match the locked catalog:** BPC-157, TB-500, CJC-1295, Ipamorelin, GHK-Cu — five of the seven LOCKED SKUs are visible in the reference, confirming the label system was designed against the actual Vialchems catalog (good — no compound-list discrepancy to reconcile).

**Integration plan — phase-by-phase:**

**Phase 1 (Tokens — additive only):**
- Add `--vial-glass` CSS variable for the realistic glass tint observed (subtle teal hint, ~rgba(61,212,200,0.06))
- Add `--vial-cap-metallic` gradient stops matching the metal-cap appearance (mid-grey gradient: `#3a4045` → `#5a6065` → `#2a2f33` — already in `Vial.tsx:60-63`; promote to token)
- Add `--vial-powder-cream` (existing — `#f4ecd8` → `#d9cfb3`) AND `--vial-powder-dark` alternative (matching the darker fill observed in some reference vials, e.g., `#3a3530` → `#1f1d1a`) so PDP can choose per compound visual mood. Default stays cream (existing v3.0 implementation); operator selects dark variant per SKU only after explicit operator approval per Iron Law 2.26.
- Add `--label-bg`, `--label-text-primary`, `--label-text-secondary`, `--label-accent-stripe` tokens for the wrap-label color system (mirrors existing site tokens; consolidates label-specific naming for clarity).

**Phase 2 (`Vial.tsx` overhaul):**
- Refine SVG aspect ratio toward 50:22 (real product proportions) within Iron Law 2.21 + 2.26 constraints. Current 80:32 is 2.5:1; target 2.27:1. Operator approves the visual change after seeing before/after.
- Add optional `withLabel` prop (default `false` to preserve existing usages) that renders an SVG-composited wrap-label overlay with VIALCHEMS LABS wordmark + compound name (passed via prop) + dose (passed via prop) + RUO disclaimer (verbatim Appendix A.2). Used by Phase 4 PDP hero.
- Add optional `compound` prop and `dose` prop so callers can pass per-SKU label content
- Refine cap to better match the metallic crimp shown in the reference (existing `Vial.tsx` cap is acceptable; v4 may add subtle highlight strokes for depth)
- Tests (TDD per Iron Law 2.1 / 2.15): verify `withLabel` prop renders wordmark + compound + dose + disclaimer; verify aspect ratio change does not break existing usages; verify reduced-motion fallback still works.

**Phase 4 (PDP hero polish):**
- Replace the current generic Vial hero with `<Vial withLabel compound={product.shortName} dose={product.dose} size="lg" sway />` so each PDP shows a vial labeled with its own SKU
- Add a QR code rendering near the labeled vial (or in the Specs sidebar) that links to `/coa/${product.slug}/${currentBatch}` — implements the QR-batch-traceability workflow visible in the reference label
- Reuse the wrap-label visual hierarchy in the PDP Specs sidebar: brand attribution → compound name → dose → batch info, matching the label's information density

**Phase 4 (COA detail page polish):**
- Adopt the label's hierarchy for the COA detail header: BRAND → COMPOUND → DOSE → BATCH → DATES → STATUS
- Add a printable-label preview component (optional Phase 4 deliverable) so operators can preview the label that would print for a given batch directly from the COA detail page

**Phase 9 (SEO + structured data):**
- Use the labeled-Vial design for OG image generation in `app/opengraph-image.tsx`. Per-product OG images (one per SKU + one for the bundle) showing the labeled vial provide richer social-share previews than a generic brand card.
- This generates 8 OG images at build time (7 SKUs + 1 bundle); per-page OG image referenced in `generateMetadata` for `/products/[slug]`.

**Operator pre-launch (out of v4 site-code scope; tracked in operator-runbook v2):**
- Print sheets (Section 4 of reference image) — operator's fulfillment infrastructure; physical printing workflow
- Packaging concept (Section 6 of reference image) — operator's shipping carton design
- The receiving chat does NOT build print-fulfillment workflows in v4; it builds the labeled-vial digital representation for the site UI only.

**Iron Law compliance for the entire integration:**

- Iron Law 2.4 / 2.13 — RUO disclaimer text on labeled vial is the verbatim Appendix A.2 string ("For research use only. Not for human or veterinary use..."); no abbreviation, no paraphrase
- Iron Law 2.7 — only the 7 LOCKED catalog SKUs render in `withLabel` mode; tirzepatide/retatrutide names from the reference image are NEVER passed as `compound` prop values
- Iron Law 2.10 — the labeled-vial SVG is operator-supplied authentic product design; not stock photography, not faked
- Iron Law 2.21 — token additions are additive (new `--vial-*` and `--label-*` tokens); existing tokens unchanged
- Iron Law 2.26 — visual lift operates within Posture A (charcoal + teal + Plex pairing); the reference image confirms operator's design team built within Posture A from the start; no brand drift
- Iron Law 2.27 — labeled-vial SVG must not regress Lighthouse Performance ≥ 90; QR code generation uses a lightweight library (e.g., `qrcode-svg` or `next/og` SVG primitives) ≤ 10KB gzipped

**Self-check after Phase 4 PDP polish:**

- [ ] `<Vial withLabel ... />` renders correctly on all 7 SKU PDPs + Recovery Stack PDP
- [ ] No banned compound name (tirzepatide, semaglutide, retatrutide) appears as a `compound` prop value anywhere in code (`grep -rE 'compound="(tirzepatide|semaglutide|retatrutide)"' app/ components/` returns 0 hits)
- [ ] RUO disclaimer text on labeled vial matches Appendix A.2 verbatim
- [ ] Lighthouse Performance ≥ 90 on every PDP (per Iron Law 2.27)
- [ ] Visual-regression baseline updated for the 8 PDPs with the new labeled hero (operator approval per Iron Law 2.25)
