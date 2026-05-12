# Stage 6 Super-Prompt: Peptide D2C E-Commerce Build

Version: 1.0
Date: 2026-05-08
Target: Claude Code CLI session, Claude Opus model
Purpose: Single self-contained instruction set that converts the audited research corpus + the existing Mogtrix codebase into a deployable, compliance-locked, brand-conditioned, profitable peptide e-commerce site.

How to use this prompt: open a fresh Claude Code session in the operator's working directory. Ensure `/root/mogtrix-website/` exists and `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/` exists. Paste this entire prompt as the first user message. The CLI agent will read it, then operate against the manifest at `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/STAGE6_MANIFEST.yaml` for all canonical input paths.

---

## 0. ROLE AND MISSION

You are the senior CLI engineer + product designer + compliance officer + e-commerce architect for the operator's new peptide e-commerce trial-run launch. You operate inside the Superpowers and gstack skill systems. You execute end to end, from cleaning the Mogtrix backend foundation through brand swap, compliance lock, catalog seed, payment integration, QA, security review, ship, and post-deploy canary.

The outcome at the end of this run is a deployable, brand-conditioned, compliance-locked peptide e-commerce site that:

- Passes every gstack /review + /cso + /qa + /design-review + /benchmark gate.
- Routes payments through a self-hosted BTCPay Server (crypto) plus Plaid ACH (bank). Cards are Phase 2.
- Catalogs 7 opening SKUs at researched prices plus a recovery-stack bundle plus a 15% intro promo.
- Embeds the compliance corpus verbatim (disclaimer block, age gate, jurisdictional restrictions, 503A/503B footer).
- Survives the FDA enforcement patterns that nuked Peptide Sciences, USA Peptide, Gram Peptides, and seven other vendors in the March 2026 wave.
- Forks the existing Mogtrix codebase at `/root/mogtrix-website/` rather than building from scratch. Mogtrix already implements an RUO qualification flow with attestations and age gate; reuse the backend skeleton, prune the brand surface, harden the compliance language.
- Includes an operator runbook at `docs/operator-runbook.md` for the customer-acquisition first 90 days.

You are not building a generic e-commerce site. You are building one specific peptide site, calibrated to the operator's audited research, the operator's transcript-locked goals, and the regulatory environment as of May 2026.

---

## 1. INPUTS CONTRACT

### 1.1 Canonical input manifest

Read `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/STAGE6_MANIFEST.yaml` first. The manifest indexes every research artifact, every operator decision, every gap, and the Mogtrix backend map. Treat the manifest as authoritative for all file paths.

### 1.2 Strategic frame (READ ALL FOUR FULLY in Phase 1)

- `01_strategic_frame/bible_final.md` — strategic foundation
- `01_strategic_frame/combined_context.md` — synthesizer-built orientation doc
- `01_strategic_frame/research_meta_prompt.md` — original meta-prompt
- `01_strategic_frame/research_operations_playbook.md` — research execution methodology

### 1.3 Audit and decisions

- `AUDIT_2026-05-08.md` — per-pillar audit verdict, gap inventory, super-prompt design implications
- `DECISIONS/brand_pick.md` — operator-locked brand or PENDING with finalists
- `DECISIONS/source_terms.md` — operator-locked supplier terms or PENDING
- `DECISIONS/opening_sku_set.md` — LOCKED_DEFAULT 7 SKUs (operator may override)
- `DECISIONS/compliance_posture.md` — LOCKED_DEFAULT compliance contract (operator may strengthen, not weaken)
- `DECISIONS/payment_stack.md` — LOCKED_DEFAULT payment rails (BTCPay + Plaid, cards Phase 2)

### 1.4 Research artifacts (consume per phase, do not read all at once)

Pillar A (Vendor Universe + Site Anatomy):
- `02_claude_code_outputs/master_vendor_table.csv` (1,506 vendors)
- `02_claude_code_outputs/vendors/` (208 per-vendor JSON profiles, full schema)
- `02_claude_code_outputs/evidence/` (206 verbatim quote files)
- `02_claude_code_outputs/DISCOVERY_RUN_FINAL_DOCUMENT.md`
- `02_claude_code_outputs/coverage_report.md`

Pillar B (Customer Acquisition):
- `02_claude_code_outputs/acquisition_synthesis_slice2.md`
- `02_claude_code_outputs/acquisition_channels/` (13 per-channel detail files)
- `02_claude_code_outputs/slice_B2_influencer_tier_map.md`
- Slice 3 (community channels) is PENDING_FIRE — see manifest gaps. Treat sections that depend on Slice 3 as PLACEHOLDER until fired.

Pillar C (Pricing Intelligence):
- `02_claude_code_outputs/pricing_matrix.csv` (3,389 SKU rows)
- `02_claude_code_outputs/sku_distributions.md` (78 peptide distributions)
- `02_claude_code_outputs/sku_distributions_summary.json`
- `02_claude_code_outputs/opening_sku_recommendation.md`

Compliance corpus (Slice 5):
- `02_claude_code_outputs/compliance_disclaimers/COMPLIANCE_DISCLAIMER_FINDINGS.md` (8 industry findings)
- `02_claude_code_outputs/compliance_disclaimers/enforcement_events.md` (19 FDA letters + 3 DOJ + ITC GEO)
- `02_claude_code_outputs/compliance_disclaimers/marketing_language_compliance.md`
- `02_claude_code_outputs/compliance_disclaimers/payment_processor_posture.md` (4-tier durability ladder)
- `02_claude_code_outputs/compliance_disclaimers/batch_a__disclaimers.md` through `batch_d__`

Brand candidates:
- `03_final/brand_name_candidates.md` (34 candidates, pattern grep, domain checks)

### 1.5 Mogtrix backend foundation

Source repo: `/root/mogtrix-website/`
Site subdir: `/root/mogtrix-website/site/`
Stack: Next.js 16.0.7, React 19, TypeScript 5.9, Supabase Postgres 17, Vercel iad1, Stripe-adapter, Resend, Sentry, Zustand cart, Zod validation, R3F vial scenes.

See manifest section `mogtrix_foundation` for the full reusable-layers map and prune target list. Do not modify the Mogtrix repo directly. Clone into a new repo for the peptide site (Phase 3 below).

### 1.6 Tooling

Superpowers v5.1.0 at `/root/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0/`.
gstack at `/root/.gstack/` and `/root/gstack/.opencode/skills/gstack-*/`.

---

## 2. IRON LAWS

These are non-negotiable. ZERO exceptions without explicit operator override in chat.

### 2.1 NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST

Per `superpowers:test-driven-development`. Write the failing test, verify it fails for the right reason, write the minimum code to pass, verify it passes, refactor. Violating the letter of this rule is violating the spirit. If you catch yourself writing untested code: delete it, start over with TDD.

### 2.2 NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

Per `superpowers:verification-before-completion`. Before any "tests pass," "build works," "page renders," "deployment succeeded" claim: run the verifying command in this session, read the full output, confirm the claim. Never trust an agent's report; trust the diff and the command output.

### 2.3 NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST

Per `superpowers:systematic-debugging`. When something breaks, run the four phases: investigate, analyze, hypothesize, implement. If 3+ fix attempts fail, stop and discuss the architecture with the operator. Do not chain symptom fixes.

### 2.4 NO HUMAN-CONSUMPTION OR THERAPEUTIC LANGUAGE IN ANY COPY

Forbidden words and patterns (extending Mogtrix's `lib/compliance.ts` `assertMarketingCopySafe`):

- "Weight loss", "fat loss", "muscle growth", "performance enhancement"
- "Safe for human use", "clinically proven", "medical grade", "pharmaceutical grade", "prescription strength"
- "Dosage" without "no established dose" prefix, "treatment", "cure", "diagnosis", "therapy", "therapeutic"
- "GLP-1" / "Semaglutide" / "Tirzepatide" / "Retatrutide" in consumer-facing context (ALL excluded from opening catalog regardless)
- "Insulin", "diabetes", "blood sugar", "appetite suppression"
- "FDA approved" (false claim)
- "Medical advice"
- Any human disease name
- Personal pronouns describing compound effects ("makes you", "for you", "your weight", "your gains")

Pre-commit hook MUST run an extended `assertMarketingCopySafe` grep over every changed file. Fail the build on any hit.

### 2.5 NO PAYMENT, COMPLIANCE, OR CATALOG CHANGES WITHOUT REVIEW + CSO GATES

Before any commit that touches `lib/payments/`, `lib/compliance.ts`, `lib/content/legal.ts`, `lib/attestations.ts`, `lib/customer-qualification.ts`, `app/api/payments/`, `app/api/access/`, or any product catalog file: run gstack `/review` (diff analysis), then gstack `/cso` (security audit). Do not bypass either gate.

### 2.6 NO MERGE TO MAIN WITHOUT DESIGN-APPROVAL AND PLAN-APPROVAL ARTIFACTS ON DISK

Each phase produces a checkpoint artifact (see Phase descriptions). Each phase that affects user-facing surfaces requires a `/plan-design-review` pass. Each phase that affects architecture requires a `/plan-eng-review` pass. The artifact must exist on disk and pass review before merging.

### 2.7 NO BAC WATER, NO TIRZEPATIDE, NO SEMAGLUTIDE/RETATRUTIDE IN OPENING CATALOG

Per Bible §15.4 and `compliance_disclaimers/enforcement_events.md`:

- Bacteriostatic water: ABSOLUTELY EXCLUDED from this site, on any rail, at any tier. Buyers source elsewhere.
- Tirzepatide: ITC General Exclusion Order 337-TA-1377 (May 2025). Border seizure is automatic. Excluded perpetually.
- Semaglutide / Retatrutide: highest-enforcement-priority FDA target. Excluded for first 90 days. Operator may override after Day 90 review of FDA enforcement signal.

### 2.8 NO SHIPPING TO BLOCKLISTED JURISDICTIONS

Default block list: California, Texas, New York, Florida (per `DECISIONS/compliance_posture.md`).
Default international: US-only for first 90 days.
Operator may strengthen (add states/countries). Operator may NOT weaken.

### 2.9 NO DIRECT STRIPE / PAYPAL / SQUARE / SHOPIFY-PAYMENTS RAILS

Per `compliance_disclaimers/payment_processor_posture.md`. These processors have explicit category bans. Day-1 stack is BTCPay self-hosted plus Plaid ACH only. Cards (MAX/MESH/Rocketfuel) are Phase 2 after first revenue signal.

### 2.10 NO FAKED REVIEWS, NO FAKE TESTIMONIALS, NO PERSONAL-USE STORIES

Per Bible §9 and observed enforcement patterns. The site launches with NO on-site reviews. First reviews accumulate organically through the qualification-gated buyer base. Forum-review-thread reputation accumulates separately.

---

## 3. EXECUTION DISCIPLINE

### 3.1 Superpowers contract

Invoke the following skills at the points indicated:

- `superpowers:brainstorming` — never (this prompt is the brainstorm output; design is locked)
- `superpowers:writing-plans` — invoke at start of each major phase to write a plan to `docs/superpowers/plans/<date>-phase-<N>.md`
- `superpowers:subagent-driven-development` — invoke for any phase with 3+ independent modules; dispatch one subagent per module
- `superpowers:dispatching-parallel-agents` — invoke for parallel reads across vendor profiles, parallel writes across pages, parallel test runs
- `superpowers:test-driven-development` — invoke for every code-writing task
- `superpowers:systematic-debugging` — invoke whenever a bug, test failure, or unexpected behavior appears
- `superpowers:verification-before-completion` — invoke before every claim of "done"
- `superpowers:requesting-code-review` — invoke after every task in subagent-driven mode
- `superpowers:receiving-code-review` — invoke when reviewing subagent or operator feedback
- `superpowers:finishing-a-development-branch` — invoke after each phase completes
- `superpowers:using-git-worktrees` — invoke when starting a phase that needs branch isolation

### 3.2 gstack contract

Invoke the following skills at the points indicated:

Pre-planning (Phase 2 only):
- `/office-hours` if architecture is uncertain
- `/plan-ceo-review` if scope needs CEO challenge
- `/plan-eng-review` (mandatory for Phase 2 architecture lock)
- `/plan-design-review` (mandatory before Phase 4 brand+design implementation)
- `/autoplan` only if running all four reviews in sequence

During implementation:
- `/design-review` after any user-facing component lands
- `/investigate` whenever a bug surfaces
- `/codex` for second-opinion on payment integration code (high-risk path)

Pre-ship gates:
- `/qa` for end-to-end testing of the live site
- `/review` for diff analysis (mandatory before any commit touching payment/compliance/catalog)
- `/cso` for infrastructure security audit (mandatory before deploy)
- `/benchmark` for Core Web Vitals baseline
- `/devex-review` skip (not developer-facing)
- `/total-security-audit` only if signal of attack/intrusion arises

Ship and deploy:
- `/ship` to bump VERSION, write CHANGELOG, merge base, run tests, create PR
- `/land-and-deploy` to merge PR, wait for CI, deploy to Vercel, canary verify
- `/canary` for post-deploy monitoring loop
- `/document-release` to update README/ARCHITECTURE/CHANGELOG

Safety:
- `/careful` ALWAYS engaged when touching payment integration, compliance code, age gate, jurisdictional restrictions, or supabase migrations
- `/freeze` to scope edits to `site/lib/payments/` during payment integration phase
- `/guard` (combined careful+freeze) for the most sensitive surfaces

Session management:
- `/context-save` after every major phase completes (creates resume-checkpoint)
- `/context-restore` only used if session is interrupted and resumed

### 3.3 Subagent dispatch protocol

For each phase that produces 3+ independent modules:

1. Write the phase plan in TodoWrite at start.
2. Dispatch one fresh subagent per module with full task text + context (do NOT pass file references; pass content).
3. Subagent implements TDD, tests, commits, self-reviews.
4. Dispatch spec-compliance reviewer subagent — verify against task spec. If issues, implementer fixes, re-review.
5. Dispatch code-quality reviewer subagent — verify quality. If issues, implementer fixes, re-review.
6. Mark task done.
7. After all modules in phase: final integration review.
8. Then `superpowers:finishing-a-development-branch` for the phase.

Never dispatch multiple implementation subagents in parallel for the same phase (causes conflicts). Reviews can run in parallel after implementations complete.

---

## 4. CONTEXT-ROT MITIGATION

### 4.1 Per-phase checkpoint artifacts

Every phase produces a checkpoint artifact at `docs/checkpoints/phase_<N>_<name>.md` containing:

- What was decided
- What was built
- What was tested
- What's next
- Outstanding questions

If the session is interrupted and resumed, the next agent reads the most recent checkpoint and continues from there. The agent does NOT re-read every research file.

### 4.2 Subagent dispatch for token-heavy work

Heavy reads (vendor profiles, raw fetches, full compliance corpus) are dispatched to subagents with focused output formats. The main thread synthesizes the agent reports without re-reading.

### 4.3 Phase-by-phase commits

Each phase commits its work to git as it lands. The session can pause at any phase boundary without losing state. Use `/context-save` to capture the conversation state.

### 4.4 Manifest as canonical reference

The agent re-reads `STAGE6_MANIFEST.yaml` at every phase start. The manifest is the source of truth for paths. The agent does not memorize paths from the prompt.

### 4.5 Plan-mode for complex decisions

Before any non-trivial implementation, enter plan mode. Produce a plan. Get operator approval (if interactive) or commit the plan to disk and execute (if autonomous). The plan is the bridge between research and code.

---

## 5. DECISION CONTRACT

### 5.1 PENDING decisions

The manifest declares 2 PENDING decisions: `brand_pick` and `source_terms`.

If `brand_pick` is PENDING:
- Default behavior: emit code with `{{BRAND_NAME}}` placeholder tokens, ready for find-and-replace once locked.
- Hero copy, About page, ToS, footer all use `{{BRAND_NAME}}` until locked.
- The operator can re-run the prompt with `brand_pick` LOCKED and the agent regenerates affected files.
- Alternatively, the agent can default to one of the agent-recommended candidates: **Numerus Labs** (Posture A) for clinical/clean-clinical aesthetic; **Skullcap Labs** (Posture B) for meme-coded community; **Bezel Bio** (Cross-Posture) for visual-register flexibility. Surface the choice to the operator before proceeding to Phase 4 (brand+design).

If `source_terms` is PENDING:
- Default behavior: site code includes accurate fulfillment promises in template form ("ships from US warehouse", "same-day shipping on US orders before 3pm Mon-Fri") matching observed industry patterns.
- COA hosting structure is built but the specific lab partner (Janoshik / MZ Biolabs / TrustPointe / Kovera) is left as `{{LAB_PARTNER}}` until source confirms.
- Initial stock buy quantities are sized to the manifest's 7-SKU set with placeholder MOQ values.

### 5.2 LOCKED_DEFAULT decisions

The manifest declares 3 LOCKED_DEFAULT decisions: `opening_sku_set`, `compliance_posture`, `payment_stack`.

These are research-derived defaults. Operator may override but the override must be explicit (operator updates the corresponding `DECISIONS/*.md` file with `LOCKED_OVERRIDE:` and a rationale). Until override, the agent treats them as binding.

### 5.3 Slice 3 PLACEHOLDER

The manifest declares Slice 3 (community channels: Reddit, Meso-Rx, forums, Telegram, Discord) as 0% complete with B1 prompt drafted but not fired.

The agent emits the customer-acquisition runbook (Phase 11) with Slice 2 + Slice 4 sections fully written, and Slice 3 sections marked as PLACEHOLDER awaiting B1 fire. After the operator fires B1 and saves output, re-run this prompt with the new manifest entry to regenerate the Slice 3 sections.

### 5.4 Operator may interrupt at any phase

Treat operator messages mid-execution as course corrections per auto-mode. Do not wait for permission to continue between phases unless the prompt explicitly says to gate.

---

## 6. PHASE-BY-PHASE WORKFLOW

15 phases. Sequential. Each phase ends with a checkpoint artifact and a `/context-save`.

### PHASE 0: Bootstrap (target: 10-15 min)

Goal: verify environment, load manifest, detect tooling.

Steps:
1. Read `STAGE6_MANIFEST.yaml`.
2. Read `AUDIT_2026-05-08.md`.
3. Verify `/root/mogtrix-website/` exists and is a git repo. Verify the four manifest decisions referenced files exist.
4. Detect: git, node, npm, pnpm/bun, python3, vercel CLI, supabase CLI, claude CLI, codex CLI.
5. Read all five files in `DECISIONS/` and report status of each (PENDING vs LOCKED_DEFAULT vs LOCKED_OVERRIDE).
6. Present a one-screen state report to operator. Wait for go-ahead OR proceed if auto-mode is on.
7. Save `docs/checkpoints/phase_0_bootstrap.md` with detected state and decision-status snapshot.
8. `/context-save`.

Verification gate: state report exists, all manifest paths verified, missing dependencies (if any) reported.

### PHASE 1: Comprehension (target: 30-60 min)

Goal: read the strategic frame and the audit. Build mental model. Produce a comprehension summary.

Steps:
1. Read `01_strategic_frame/bible_final.md` fully.
2. Read `01_strategic_frame/combined_context.md` fully.
3. Read `01_strategic_frame/research_meta_prompt.md` fully.
4. Read `AUDIT_2026-05-08.md` fully.
5. Read `02_claude_code_outputs/compliance_disclaimers/COMPLIANCE_DISCLAIMER_FINDINGS.md` fully.
6. Read `02_claude_code_outputs/opening_sku_recommendation.md` fully.
7. Skim `02_claude_code_outputs/acquisition_synthesis_slice2.md`.
8. Dispatch parallel subagents to read 5 priority vendor profiles (peptide-sciences, biotech-peptides, core-peptides, limitless-life-nootropics, swiss-chems) and report site-anatomy patterns.
9. Synthesize: write `docs/checkpoints/phase_1_comprehension.md` (1-2 pages) covering trial-run thesis, audience, brand posture options, compliance posture, payment posture, opening catalog, top 3 risks, top 3 differentiators.
10. `/context-save`.

Verification gate: comprehension doc exists, references all four strategic frame docs by section, identifies the 3 PENDING decisions (brand pick, source terms, Slice 3) explicitly.

### PHASE 2: Architecture Lock (target: 60-90 min)

Goal: lock the technical architecture and the operator-runbook plan.

Steps:
1. `superpowers:writing-plans` — write `docs/superpowers/plans/<date>-architecture.md` with the full Phase 3-15 plan.
2. Plan must cover: backend reuse strategy, brand pick handling (PENDING vs LOCKED), payment-rail sequencing, compliance contract enforcement, catalog seed, page IA, content strategy, acquisition-runbook generation, QA strategy, deploy strategy, post-deploy monitoring.
3. Invoke gstack `/plan-eng-review` against the plan. Refine.
4. Invoke gstack `/plan-design-review` against the design system inheritance plan. Refine.
5. (Optional) `/plan-ceo-review` if scope challenge is needed.
6. (Skip) `/plan-devex-review` not developer-facing.
7. (Optional) `/autoplan` to run all reviews in sequence with auto-decisions.
8. Save `docs/checkpoints/phase_2_architecture.md` with locked plan + review feedback.
9. `/context-save`.

Verification gate: plan file exists, review skills produced output, plan addresses all 13 phases below, plan has no TBDs or placeholders for required design decisions.

### PHASE 3: Backend Prep (target: 60-90 min)

Goal: fork Mogtrix into a new repo for the peptide site, prune Mogtrix-coupled brand surfaces, retain reusable backend skeleton, deploy a "Hello brand" site to Vercel staging.

Steps:
1. `superpowers:using-git-worktrees` — set up isolated workspace, or create new repo at the operator-chosen path.
2. Clone `/root/mogtrix-website/` into new location. Initialize as separate git repo or fork remote.
3. Apply prune list from `STAGE6_MANIFEST.yaml#mogtrix_foundation.prune_targets`:
   - Delete `public/brand/mogtrix_*.png`
   - Delete or replace `public/visuals/{hero-lab,category-*}.png`
   - Update `lib/content/site.ts` siteConfig with `{{BRAND_NAME}}`, `{{BRAND_DOMAIN}}`, peptide-positioned description
   - Update `components/site-header.tsx` and `components/compliance-footer.tsx` (brand swap)
   - Update `lib/content/legal.ts` (replace MOGTRIX strings, customize attestations for peptide context)
   - Update `app/page.tsx` hero copy (peptide industry-position narrative)
   - Update `components/home-proof-row.tsx` to dynamic-product-row pattern
   - Update `app/faq/page.tsx`, `app/testing/page.tsx`, `lib/content/faq.ts`, `lib/content/testing.ts` (peptide-context content)
   - Update `lib/age-gate-store.ts` text
4. Create new Supabase project. Run `supabase db push` against new project. Migrate schema from existing `supabase/seed.sql` (Mogtrix RUO scaffold).
5. Update `.env` with new Supabase URL + anon key + service role, new Resend keys, new Sentry project. PAYMENT_PROVIDER=stub for dev. See manifest section `mogtrix_foundation.env_vars_to_swap`.
6. Run `npm install` (or `bun install` if Mogtrix uses bun), `npm test`, `npm run build`. Fix any baseline test failures.
7. Run grep over the entire site/ directory for "mogtrix" / "MOGTRIX" — must return 0 hits in source files (test data and CHANGELOG can keep historical references).
8. Deploy to Vercel staging URL. Verify `https://<staging-url>/api/health` returns 200.
9. Save `docs/checkpoints/phase_3_backend_prep.md` with: prune diff summary, env config snapshot, staging URL, baseline test results.
10. `/context-save`.

Verification gate: site builds, tests pass, deploys to Vercel, /api/health returns 200, grep for "mogtrix" returns 0 hits in src files. `/careful` engaged throughout.

### PHASE 4: Brand and Design System (target: 60-90 min)

Goal: lock brand identity and adapt Mogtrix DESIGN.md to the picked posture.

Steps:
1. Read `DECISIONS/brand_pick.md`. If PENDING, surface the three recommended finalists (Numerus Labs / Skullcap Labs / Bezel Bio) and either request operator pick OR auto-default to **Numerus Labs** (Posture A) per the recommended path.
2. Read `/root/mogtrix-website/DESIGN.md`. The peptide site inherits ~80% of this design system.
3. Generate or commission brand assets:
   - Wordmark (replaces Mogtrix wordmark; same proportions: clean monospace tag with brand name + LABS chip pattern)
   - Favicon (16x16 + 32x32 + apple-touch-icon at 180x180)
   - Open-graph card template at `app/opengraph-image.tsx`
4. Adjust design tokens in `lib/design/tokens.ts` and `app/globals.css`:
   - Posture A: keep dark-first + IBM Plex stack + acid-green CTA, possibly swap atmospheric accent from electric cyan to brand-teal
   - Posture B: keep dark-first but allow more saturated accents, possibly swap typography to a brand font
   - Cross-Posture: keep flexibility, defer specific tokens to design-shotgun if needed
5. (Optional) gstack `/design-shotgun` to explore visual variants if operator wants to compare options
6. (Optional) gstack `/design-html` to finalize approved mockup
7. Run gstack `/design-review` against the home page after token swap.
8. Update `components/site-header.tsx` brand assets and copy.
9. Update `components/compliance-footer.tsx` with verbatim footer disclaimer block from `DECISIONS/compliance_posture.md` section "Verbatim disclaimer block".
10. Save `docs/checkpoints/phase_4_brand_design.md` with: locked brand name, design token diff, before/after screenshots from `/design-review`.
11. `/context-save`.

Verification gate: brand assets present, design tokens updated, design-review passes, footer disclaimer matches verbatim spec, no forbidden marketing patterns in any new copy.

### PHASE 5: Site IA and Page Templates (target: 90-120 min)

Goal: build/update the 13 required pages with TDD discipline.

Required pages (per `STAGE6_README.md` + vendor profile blueprint):

1. Home (Hero + Category Grid + Compliance Footer)
2. Catalog/Shop (Product Listing + Filters + Sort)
3. Product Page Template (13-component anatomy)
4. Cart
5. Checkout (Guest + Account, BTCPay + Plaid radio buttons, jurisdictional check)
6. Terms of Service (verbatim from compliance_posture.md)
7. Refund Policy
8. Shipping Policy (with jurisdictional restrictions)
9. FAQ (peptide-research-context Q&A, NOT human-use Q&A)
10. Contact (form + email)
11. Blog/Research (index page; populate seed content in Phase 6)
12. About (industry-position narrative)
13. Affiliate Program (extends Mogtrix scaffold; commission structure + signup form)

Steps per page (subagent-driven):

1. `superpowers:writing-plans` — write a per-page plan with file paths, component decomposition, test cases.
2. Dispatch implementer subagent: TDD per component, integrate, commit.
3. Dispatch spec reviewer.
4. Dispatch code-quality reviewer.
5. Run gstack `/design-review` after the page lands.
6. Mark page done, move to next.

Product page anatomy (13 components in order):
1. Hero image (1 vial image, white bg, optional carousel for 2-3 angles)
2. Title + SKU code (mono font for SKU)
3. Price (list, per-mg, sale strikethrough if applicable)
4. Dose option selector (dropdown variants)
5. Purity badge (99%+ lyophilized powder, format label)
6. Quantity selector + Add-to-Cart (sticky footer or traditional)
7. Description (30-60 words, clinical voice, amino acid composition, in-vitro framing)
8. Tab panel: Description | COA | Related
9. COA display (per-batch PDF link or third-party portal embed)
10. Batch lot number (mono font)
11. Disclaimer box (verbatim product-page disclaimer from compliance_posture.md)
12. Related Products module (3-4 SKUs)
13. Stack suggestion (BPC-157 + TB-500 recovery stack bundle suggestion)

Save `docs/checkpoints/phase_5_pages.md` with: per-page test status, design-review results, accessibility check.
`/context-save`.

Verification gate: all 13 pages exist, all pass `npm test`, all pass `/design-review`, all pass `/qa --quick` smoke test, all use compliant copy (no forbidden patterns).

### PHASE 6: Content and Copy (target: 60-90 min)

Goal: write the user-facing copy embedding compliance + brand voice + research learnings.

Steps:

1. Verbatim disclaimer block (footer, every page) from `DECISIONS/compliance_posture.md`. Compose using `{{BRAND_NAME}}` if pending.
2. Verbatim product-page disclaimer (every product page).
3. Hero copy: industry-position narrative (200-400 words) per Agent 6 recommendation, customized for picked posture.
4. About page: brand thesis paragraph + lab partnership statement + LLC info + governance jurisdiction.
5. FAQ: 15-20 questions, peptide-research context. Examples: "What is research use only?" / "How do you test purity?" / "What does the COA show?" / "Can you ship internationally?" / "What is your refund policy?"
6. Blog seed content: write 5 foundational posts (1500-2400 words each) on highest-search-volume opening peptides:
   - "BPC-157: Mechanism, Research, and In-Vitro Findings"
   - "Reading a Certificate of Analysis: A Researcher's Guide"
   - "GHK-Cu Copper Peptide Research Overview"
   - "TB-500 (Thymosin Beta-4) Research Mechanism"
   - "The Recovery Stack: BPC-157 and TB-500 Synergy in Animal Models"
7. Email welcome sequence (4 emails) per `acquisition_channels/email-marketing.md`:
   - Email 1 (welcome + lead-magnet PDF delivery)
   - Email 2 (Day 3: educational, no discount)
   - Email 3 (Day 7: research-context product introduction)
   - Email 4 (Day 14: 15% intro promo code)
8. Contact form fallback responses (template emails for common inquiries: dosing questions auto-decline, lost-package response, COA-request response).
9. Run gstack `/design-review` and the assertMarketingCopySafe grep across all new copy.

Save `docs/checkpoints/phase_6_content.md` with: word count per page, blog post titles, email sequence draft, marketing-copy-safe test results.
`/context-save`.

Verification gate: all copy passes assertMarketingCopySafe, all blog posts have 1500+ words and 3+ scientific citations, no forbidden words appear anywhere, hero copy matches the industry-position narrative.

### PHASE 7: Catalog and Product Pages (target: 60-90 min)

Goal: seed the catalog with the 7 opening SKUs and the bundle.

Steps:

1. Read `DECISIONS/opening_sku_set.md` (LOCKED_DEFAULT 7 SKUs).
2. Update `supabase/seed.sql` with the 7 SKUs:
   - BPC-157 10mg vial $54
   - TB-500 5mg vial $34
   - GHK-Cu 50mg vial $34
   - Ipamorelin 10mg vial $50
   - CJC-1295 (no DAC) 5mg vial $25
   - MOTS-c 10mg vial $48
   - Selank 10mg vial $48
3. Add bundle: Recovery Stack (BPC-157 + TB-500) at $77.
4. Add intro promo: 15% off first order via newsletter signup, gated by RUO acknowledgment + age gate.
5. Update `lib/content/products.ts` with peptide product metadata (description, related products, stack suggestions).
6. Build COA hosting structure at `app/coa/`:
   - `/coa` index page with searchable batch-lot table
   - `/coa/[peptide]/[batch]` per-batch detail page with PDF link + test types (HPLC, Sterility, Endotoxin)
7. Generate placeholder COA PDFs (until source COAs arrive) marked `EXAMPLE_COA — REPLACE BEFORE LAUNCH`.
8. Run `npm test` and gstack `/qa` against the catalog.

Save `docs/checkpoints/phase_7_catalog.md` with: SKU table, bundle config, intro promo config, COA structure, test results.
`/context-save`.

Verification gate: catalog renders, prices match LOCKED_DEFAULT, bundle works, intro promo applies at checkout, COA pages render, /qa passes catalog scenarios.

### PHASE 8: Compliance Scaffolding (target: 60-90 min)

Goal: implement age gate, jurisdictional restrictions, qualification flow, marketing-copy-safety.

Steps:

1. `/careful` engaged for entire phase.
2. Implement age gate per compliance_posture.md (text-based contractual checkbox at first cart action, 21+).
3. Implement jurisdictional block list in `lib/compliance/jurisdictions.ts` and integrate into checkout.
4. Extend `lib/customer-qualification.ts` with peptide-context attestations (research purpose, supplier vetting awareness, no compounding-pharmacy claim, no medical-use intent).
5. Extend `lib/compliance.ts` `assertMarketingCopySafe` with the forbidden patterns from Iron Law 2.4.
6. Add a pre-commit hook at `.husky/pre-commit` that runs `assertMarketingCopySafe` over staged files. Fail commit on hit.
7. Run gstack `/review` on every file changed in this phase.
8. Run gstack `/cso` on the compliance + qualification + jurisdiction code.

Save `docs/checkpoints/phase_8_compliance.md` with: review feedback, cso findings, pre-commit hook test results.
`/context-save`.

Verification gate: `/review` and `/cso` both pass. Pre-commit hook fires on test commit with forbidden words. Age gate test (qualification-flow.test.ts) passes. Jurisdictional restriction test passes (e.g., California shipping rejected at checkout).

### PHASE 9: Payment Integration (target: 90-120 min)

Goal: implement BTCPay self-hosted adapter and Plaid ACH adapter. Cards Phase 2.

Steps:

1. `/careful` engaged for entire phase. `/freeze` to scope edits to `lib/payments/` only.
2. Create `lib/payments/btcpay.ts` adapter implementing the `PaymentProvider` interface from `lib/payments/types.ts`. Integrate with self-hosted BTCPay Server (operator must provision the server separately; document in operator runbook).
3. Create `lib/payments/plaid.ts` adapter for ACH. Use Plaid Link integration. Apply 5% discount nudge at checkout for ACH selection.
4. Update `lib/payments/config.ts` to register new adapters. Remove Stripe from registered list (file stays for Phase 2).
5. Update `.env` to support `PAYMENT_PROVIDER=btcpay` or `plaid` (or `stub` for dev).
6. Webhook reconciliation: extend `lib/payments/reconciliation.ts` for BTCPay invoice-paid webhook + Plaid auth-completed callback.
7. Update checkout UI per compliance_posture.md UX spec:
   ```
   Payment Method:
     ( ) Crypto (BTC / LTC / ETH)        Save 10-15%   [recommended]
     ( ) Bank Transfer (US ACH)          Save 5%, 3-4 day clearance
     [ Phase 2 ] ( ) Credit / Debit Card                   [coming soon]
   ```
8. Implement crypto-discount demand-shaping logic (10-15% off for crypto, 5% off for ACH, full price for cards when Phase 2 activates).
9. Run gstack `/codex review` for second-opinion on payment integration code.
10. Run gstack `/review` then `/cso` on the payment changes.
11. Add E2E test in Playwright: customer adds product to cart, selects crypto payment, BTCPay invoice opens, mock-pay invoice, order status transitions to paid.

Save `docs/checkpoints/phase_9_payments.md` with: adapter test results, webhook reconciliation log, codex review verdict, /cso findings.
`/context-save`.

Verification gate: `/review`, `/cso`, `/codex review` all pass. E2E test for crypto payment passes with mock invoice. E2E test for Plaid ACH passes with mock auth flow. Order lifecycle (pending → paid → shipped) transitions correctly.

### PHASE 10: Auxiliary Surfaces (target: 60-90 min)

Goal: newsletter, account dashboard, ToS/Privacy/Refund/Shipping pages, affiliate program scaffold.

Steps:

1. Implement newsletter signup form (footer + dedicated /newsletter page) with the 4-email welcome sequence wired up.
2. Lead magnet: write a "Reconstitution and Storage Guide" PDF (3-5 pages, neutral research content) and link from newsletter signup confirmation.
3. Account dashboard (reuse Mogtrix `app/account/` and `app/account/orders/[id]/`).
4. ToS, Privacy, Refund, Shipping (verbatim policies from compliance_posture.md, customized for brand).
5. Affiliate program scaffold: signup form + commission table (10% min / 15% median / 20% max with 90-day cookie per `slice_B2_influencer_tier_map.md`) + dashboard placeholder.
6. Run `npm test` + `/qa --quick`.

Save `docs/checkpoints/phase_10_auxiliary.md`.
`/context-save`.

Verification gate: newsletter signup persists email + sends welcome email; account dashboard shows orders; ToS/Privacy/Refund/Shipping pages render with verbatim policy text.

### PHASE 11: Customer-Acquisition Runbook Generation (target: 30-60 min)

Goal: generate `docs/operator-runbook.md` with Day-1 / Weeks-2-4 / Defer prioritization.

Steps:

1. Synthesize from `acquisition_synthesis_slice2.md` + `acquisition_channels/` + `slice_B2_influencer_tier_map.md` + `compliance_disclaimers/marketing_language_compliance.md`.
2. Day 1 actions:
   - Finnrick + PickPeptides + PeptideDeck listing submissions (template emails included)
   - Google Search Console setup + sitemap submission
   - Bing Webmaster Tools submission
   - Newsletter signup form active + welcome sequence wired
   - Blog seed content live (5 foundational posts from Phase 6)
   - SEO content marketing affiliate-program signups (UpPromote or Refersion)
3. Weeks 2-4:
   - Instagram three-handle minimum registration
   - Founder X account weekly cadence (research threads for Posture A, meme-coded for Posture B)
   - Reddit forum participation (r/Peptides, r/PeptidesForSale via successor subreddit search) — gentle non-spam mentions only
   - Influencer outreach to 5-10 micro-creators (Tier S 5K-30K from slice_B2_influencer_tier_map.md)
4. Months 2-3:
   - TikTok influencer-proxied launch (after Day-1 channels show signal)
   - YouTube only if Posture A and SEO is performing
5. PERMANENT AVOID (with rationale):
   - SMS marketing (CTIA + TCPA + carrier vetting)
   - Google Ads / Microsoft Ads (category bans)
   - YouTube direct organic growth (channel termination risk)
6. PLACEHOLDER (awaiting Slice 3 fire):
   - Reddit subreddit map with engagement strategy
   - Specialized forum presence (Meso-Rx, Anabolic Steroid Forums, Anabolic Minds, Evolutionary, ThinkSteroids, EliteFitness, MuscleGurus, Peptide Underground)
   - Telegram + Discord community presence
   - Niche aggregator listings beyond the Day-1 set
7. Compliance language reminders for the operator:
   - All organic content: research-frame voice, no human-benefit claims
   - Affiliate creator agreements include FTC disclosure requirements
   - No before/after photography
   - No personal pronouns describing compound effects

Save `docs/operator-runbook.md` and `docs/checkpoints/phase_11_runbook.md`.
`/context-save`.

Verification gate: runbook exists, references all relevant research files, marks Slice 3 sections as PLACEHOLDER, has operator-actionable steps with specific URLs and email templates.

### PHASE 12: QA + Reviews (target: 60-120 min)

Goal: end-to-end QA, design polish, performance baseline.

Steps:

1. gstack `/qa` — systematic test of: home → catalog browse → search → product page → COA tab → add to cart → checkout (crypto path) → order confirmation → email receipt.
2. gstack `/design-review` — visual polish, spacing, hierarchy, AI slop patterns, slow interactions.
3. gstack `/benchmark` — Core Web Vitals baseline, page load times, resource sizes for key pages.
4. Lighthouse CI on home + catalog + product page; assert no regressions.
5. SEO meta-tag test: every page has unique title, description, canonical URL.
6. Accessibility audit: WCAG AA contrast, keyboard navigation, screen-reader labels (DESIGN.md §12 floor).
7. assertMarketingCopySafe grep over the entire built site/ directory; must return 0 hits.
8. Verify all 7 SKUs render correctly, prices match LOCKED_DEFAULT, bundle math correct.
9. Verify intro promo applies on first order via newsletter signup.
10. Verify age gate blocks under-21 attestation.
11. Verify jurisdictional restriction blocks California/Texas/New York/Florida shipping addresses at checkout.
12. Verify qualification flow gates access (research-only acknowledgment + age + jurisdiction + institution).

Save `docs/checkpoints/phase_12_qa.md` with: /qa findings, /design-review fixes, benchmark baseline, Lighthouse scores, accessibility findings, all gate-test results.
`/context-save`.

Verification gate: /qa passes (or all critical-severity bugs fixed in this phase), /design-review passes, Lighthouse Performance ≥ 80 on all pages, A11y ≥ 95, SEO ≥ 95.

### PHASE 13: Pre-Deploy Reviews (target: 30-60 min)

Goal: final review gates before merge.

Steps:

1. gstack `/review` on the full diff against base branch.
2. gstack `/cso` infrastructure security audit.
3. gstack `/codex review` for second-opinion on the most sensitive paths (payment, compliance).
4. (Optional) gstack `/total-security-audit` if any signal warrants a comprehensive scan.
5. Resolve any critical findings; defer non-critical to backlog.

Save `docs/checkpoints/phase_13_reviews.md`.
`/context-save`.

Verification gate: `/review`, `/cso`, `/codex review` all pass with no critical findings outstanding.

### PHASE 14: Ship + Deploy (target: 30-60 min)

Goal: merge to main, deploy to production, verify canary.

Steps:

1. gstack `/ship` — bump VERSION, write CHANGELOG, run pre-merge tests, merge base into feature branch, create PR.
2. Operator reviews PR on GitHub.
3. gstack `/land-and-deploy` — merge PR to main, wait for CI, Vercel auto-deploys to production, canary health check.
4. Verify production URL `/api/health` returns 200.
5. Verify production URL renders home page correctly with new brand.

Save `docs/checkpoints/phase_14_deploy.md`.
`/context-save`.

Verification gate: production deploys, /api/health returns 200, home page renders, no console errors, smoke test of catalog → product → checkout flow on production.

### PHASE 15: Post-Deploy Monitoring + Documentation (target: 30-60 min)

Goal: post-deploy monitoring + release documentation.

Steps:

1. gstack `/canary` — monitor production for 2 hours: console errors, performance regressions, screenshot diffs vs pre-deploy baseline.
2. gstack `/document-release` — update README, ARCHITECTURE.md, CHANGELOG. Reference what shipped.
3. Sentry monitoring dashboard verified live; alert thresholds configured.
4. Operator handed `docs/operator-runbook.md` for first-90-days execution.
5. (Optional, scheduled) gstack `/retro` after 1 week for retrospective.

Save `docs/checkpoints/phase_15_post_deploy.md`.
`/context-save`.

Verification gate: canary passes 2-hour window with no critical regressions. Sentry catches no production errors above threshold. Operator runbook is complete and accurate.

---

## 7. VERIFICATION GATES PER PHASE

| Phase | Gate |
|---|---|
| 0 | Manifest verified, dependencies detected, decision states reported |
| 1 | Comprehension doc written, all four strategic frame docs read |
| 2 | Plan written, /plan-eng-review passed, /plan-design-review passed |
| 3 | Site builds, tests pass, deploys to Vercel staging, no "mogtrix" in src grep |
| 4 | Brand assets, design tokens, /design-review passed, footer disclaimer verbatim |
| 5 | All 13 pages built, all tests pass, /design-review pass per page |
| 6 | All copy passes assertMarketingCopySafe, blog posts ≥ 1500 words with citations |
| 7 | Catalog renders, prices match LOCKED_DEFAULT, bundle works, intro promo works, COAs render |
| 8 | /review + /cso pass, pre-commit hook fires on test, age gate + jurisdiction tests pass |
| 9 | /review + /cso + /codex review pass; E2E crypto and ACH tests pass |
| 10 | Newsletter, account, ToS/Privacy/Refund/Shipping live; affiliate scaffold built |
| 11 | Operator runbook complete, references research files, marks Slice 3 PLACEHOLDER |
| 12 | /qa pass, /design-review pass, Lighthouse Perf ≥ 80, A11y ≥ 95, SEO ≥ 95 |
| 13 | /review + /cso + /codex review pass on full diff, no critical findings outstanding |
| 14 | Production deploys, /api/health 200, smoke test passes |
| 15 | /canary 2-hour pass, Sentry catches no critical, operator runbook handed off |

---

## 8. APPENDICES

### Appendix A: Verbatim Compliance Contract

#### A.1 Footer disclaimer block (every page)

```
All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption.

The statements made within this website have not been evaluated by the US Food and Drug Administration. The statements and the products of this company are not intended to diagnose, treat, cure or prevent any disease.

{{BRAND_NAME}} is a chemical supplier. {{BRAND_NAME}} is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic Act. {{BRAND_NAME}} is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and Cosmetic Act.
```

#### A.2 Product page disclaimer (every product)

```
For research use only. Not for human or veterinary use. These products are not intended for human dosing, injection, or ingestion. Bodily introduction of any kind into humans or animals is strictly forbidden by law.
```

#### A.3 Age gate

Pattern: text-based contractual checkbox at first cart action (NOT modal popup). 21+ threshold.

```
[ ] I confirm that I am 21+ years of age and will use these products solely for laboratory research in non-clinical settings. Products are not for human consumption.
```

#### A.4 Jurisdictional restrictions

Default block list: California, Texas, New York, Florida.
Default international: US-only for first 90 days.

Verbatim text (Shipping Policy + checkout):

```
{{BRAND_NAME}} ships to addresses within the United States only at this time. {{BRAND_NAME}} does not ship to: California, Texas, New York, Florida. The customer assumes all regulatory compliance responsibility for their jurisdiction specific to their municipality, state, or country.
```

#### A.5 Buyer qualification (extends Mogtrix `lib/customer-qualification.ts`)

Required fields:
- Email (verified)
- Institution / role: select one of [academic researcher, clinical research, biotech researcher, lab technician, compounding pharmacy, other]
- Research purpose (free text, runs through `assertMarketingCopySafe`)
- Age confirmation (21+)
- Research-use-only acknowledgment
- Jurisdictional acknowledgment

#### A.6 Customer service vocabulary discipline

CS clause in ToS:
```
Replies regarding animals using personal pronouns refer to tissue samples and test subjects, and that such replies do not imply human use.
```

CS team vocabulary: "research subjects" / "test subjects" / "in vitro" / "laboratory" — NEVER "customers" / "users" in the context of effects/outcomes.

### Appendix B: Brand Recommendations

If `DECISIONS/brand_pick.md` is PENDING, recommend one of:

**Posture A (Clean Clinical) — RECOMMENDED DEFAULT: Numerus Labs**
- Latinate quantification vocabulary, zero vendor collision, 3 clean TLDs
- Visual: charcoal gray + teal accent, sans-serif primary, monospace for SKUs, grid layout, dense COA tables
- Tagline: "Counted, weighed, verified."
- Pairs cleanly with the "third-party COA on every batch" differentiator

**Posture B (Meme-Coded Community): Skullcap Labs**
- Anatomical noun + Labs, zero vendor collision, 4 clean TLDs (highest TLD availability)
- Visual: high-contrast, neon accent, looksmax-coded photography, athletic/anatomical illustration
- Strongest fit for alpha Gen Z mogging audience per Bible §6

**Cross-Posture: Bezel Bio**
- Watchmaking-instrumentation reference, 3 clean TLDs, visual flexibility
- Works as A (clinical) or B (luxury-aesthetic) without rebrand

If operator picks something else from `03_final/brand_name_candidates.md`, follow that pick instead.

### Appendix C: Catalog Seed (LOCKED_DEFAULT)

| # | Peptide | Dose | Format | List | Per-mg | Position | Role |
|---|---|---|---|---|---|---|---|
| 1 | BPC-157 | 10mg | vial | $54.00 | $5.40 | 10% below median | loss-leader |
| 2 | TB-500 | 5mg | vial | $34.00 | $6.80 | 5% below median | loss-leader |
| 3 | GHK-Cu | 50mg | vial | $34.00 | $0.68 | 9% below median | loss-leader |
| 4 | Ipamorelin | 10mg | vial | $50.00 | $5.00 | just below p25 | volume driver |
| 5 | CJC-1295 (no DAC) | 5mg | vial | $25.00 | $5.00 | just below p25 | volume driver |
| 6 | MOTS-c | 10mg | vial | $48.00 | $4.80 | median | catalog filler |
| 7 | Selank | 10mg | vial | $48.00 | $4.80 | just below median | catalog filler |

Bundle: Recovery Stack (BPC-157 10mg + TB-500 5mg) at $77.00 (12.5% effective discount).
Intro promo: 15% off first order via newsletter signup, gated by RUO acknowledgment + age gate.
GLP-1 carve-out: Tirzepatide (perpetual), Semaglutide + Retatrutide (90-day moratorium).
BAC water: ABSOLUTELY EXCLUDED.

### Appendix D: Payment Stack Spec (LOCKED_DEFAULT)

#### D.1 Day-1 stack (Tier 2 durability)

**Rail 1: BTCPay Server (self-hosted)**
- Coins: BTC, LTC (optionally ETH)
- Discount: 10-15% off list price for crypto payments
- UX: Radio button at checkout, "(-10%)" label
- Implementation: `lib/payments/btcpay.ts`, webhook to reconciliation, BTCPay Server self-hosted in Docker container (operator provisions separately)

**Rail 2: Plaid ACH**
- Discount: 5% off list price for ACH
- Clearance: 3-4 business days (display on checkout)
- Implementation: `lib/payments/plaid.ts`, Plaid Link integration

#### D.2 Forbidden rails

- Stripe direct, PayPal direct, Square direct, Shopify Payments — all explicit category bans

#### D.3 Phase 2 (Day 90+, after first revenue signal)

- MAX Redemption OR MESH Network OR Rocketfuel (one only, after compliance review)
- Statement descriptor: camouflaged ("UNBLOCK" or similar)
- Per-transaction cap: $1,000
- Discount offered: 0% (cards full price)

### Appendix E: Site IA Blueprint (13 pages)

1. **Home**: Hero (industry-position narrative, 200-400 words) + Category Grid (peptide categories: Recovery, GH-Stack, Nootropic, Bioregulator) + Featured Products + Compliance Footer
2. **Catalog/Shop**: Product Listing (grid view) + Filters (category, format, dose) + Sort (price, name, newest) + Pagination
3. **Product Page**: 13-component anatomy (see Phase 5)
4. **Cart**: Standard line items + bundle expansion + intro-promo entry field + jurisdictional pre-check
5. **Checkout**: Guest + Account option; payment method radio (Crypto / ACH / [Phase 2 Cards]); shipping address with jurisdictional restriction enforcement; age-gate checkbox; RUO acknowledgment checkbox; submit
6. **Terms of Service**: Verbatim policy from compliance_posture.md + 503A/503B + indemnification + choice of law (Wyoming/Delaware/Nevada per LLC formation) + customer-service vocabulary clause
7. **Refund Policy**: All sales final; no refunds on opened vials; replacement only for shipping damage with photo evidence
8. **Shipping Policy**: USPS Priority + FedEx 2-Day + Overnight; jurisdictional restrictions verbatim; shipping cost structure; international policy (US-only for 90 days)
9. **FAQ**: 15-20 questions in research-context voice (NOT human-use)
10. **Contact**: Form + email + research-purpose indication; auto-reply for dosing-question inquiries
11. **Blog/Research**: Index of seed posts from Phase 6 + tag taxonomy
12. **About**: Brand thesis + lab partnership + LLC info + founders (anonymized or named per LLC structure)
13. **Affiliate Program**: Commission structure (10/15/20% with 90-day cookie) + signup form + dashboard placeholder

### Appendix F: Mogtrix Prune List (verbatim from agent mapping)

Top-priority prune targets (from Phase 3):

- `public/brand/mogtrix_*.png` (RIP)
- `public/visuals/{hero-lab,category-*}.png` (RIP or replace)
- `lib/content/site.ts` siteConfig (REFACTOR)
- `components/site-header.tsx` (REFACTOR brand)
- `components/compliance-footer.tsx` (REFACTOR copyright + LLC + brand)
- `lib/content/legal.ts` (REFACTOR — replace MOGTRIX strings, customize attestations)
- `app/page.tsx` (REFACTOR hero copy)
- `components/home-proof-row.tsx` (REFACTOR to dynamic product row)
- `app/faq/page.tsx`, `app/testing/page.tsx`, `lib/content/faq.ts`, `lib/content/testing.ts` (REFACTOR content)
- `lib/age-gate-store.ts` (REFACTOR text)
- `lib/catalog-seed.ts`, `supabase/seed.sql` (REFACTOR catalog)

What survives untouched (neutral shared layer):

- `components/ui/{Button,Card,Input,Pill,Specs,CoaRow,FieldLabel,Vial,VialScene,MockupFrame}.tsx`
- `lib/design/{tokens,motion,types,index}.ts`
- `app/globals.css` (typography, motion keyframes; only swap atmospheric gradient body bg if brand demands)
- `lib/utils.ts`
- `lib/supabase/*.ts`
- `lib/validation/*.ts`
- `lib/payments/{types,server,reconciliation}.ts`

What needs extension (compliance hardening for peptide context):

- `lib/compliance.ts` `assertMarketingCopySafe`: extend with the forbidden patterns from Iron Law 2.4
- `lib/compliance/jurisdictions.ts`: NEW file with state/country block list
- `lib/customer-qualification.ts`: extend attestation clauses for peptide context
- `lib/payments/btcpay.ts`: NEW file
- `lib/payments/plaid.ts`: NEW file

Env vars to swap (per `STAGE6_MANIFEST.yaml#mogtrix_foundation.env_vars_to_swap`):
- NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SUPABASE_*, SUPABASE_SERVICE_ROLE_KEY, PAYMENT_PROVIDER, ORDER_EMAIL_FROM, ORDER_STAFF_EMAILS, RESEND_API_KEY, NEXT_PUBLIC_SENTRY_DSN, SENTRY_*

### Appendix G: Acquisition Runbook Seed (Day 1 / Weeks 2-4 / Months 2-3 / Avoid)

**DAY 1 (parallel execution):**
1. Google Organic SEO: PDP build (30-50 compound pages, 1500-2400 words, 10+ citations each, schema markup)
2. Email capture: footer + dedicated /newsletter page with 4-email welcome sequence
3. Vendor blog: 5 foundational posts on opening peptides (Phase 6 output)
4. SEO content marketing affiliate setup: UpPromote or Refersion + outreach to Outliyr, Muscle+Brawn, PepPal

**WEEKS 2-4:**
5. Instagram three-handle minimum: @{{BRAND_NAME}}, @{{BRAND_NAME}}_research, @{{BRAND_NAME}}_official
6. Bing Webmaster Tools + sitemap; forum participation (Posture B only) on professionalmuscle.com
7. X / Twitter: founder personal weekly cadence + brand stub

**MONTHS 2-3:**
8. TikTok influencer-proxied: per-creator discount codes to 5-10 micro-creators (Tier S 5K-30K from `slice_B2_influencer_tier_map.md`)
9. YouTube (Posture A only): repurpose blog posts as 5-10 min explainer videos; budget for channel termination risk

**PERMANENT AVOID:**
- SMS marketing (CTIA + TCPA + carrier vetting)
- Google/Microsoft Ads (category bans)
- YouTube direct organic growth (channel termination ceiling)

**PLACEHOLDER AWAITING SLICE 3 FIRE:**
- Reddit subreddit map + engagement strategy
- Specialized forums (Meso-Rx, Anabolic Steroid Forums, Anabolic Minds, Evolutionary, ThinkSteroids, EliteFitness, MuscleGurus, Peptide Underground)
- Telegram + Discord community presence
- Niche aggregator listings beyond Day-1 set

### Appendix H: Blog Topic Taxonomy Seed

5 foundational posts (Phase 6 output, 1500-2400 words each, 10+ scientific citations, in-vitro framing only):

1. "BPC-157: Mechanism, Research, and In-Vitro Findings"
2. "Reading a Certificate of Analysis: A Researcher's Guide"
3. "GHK-Cu Copper Peptide Research Overview"
4. "TB-500 (Thymosin Beta-4) Research Mechanism"
5. "The Recovery Stack: BPC-157 and TB-500 Synergy in Animal Models"

Future cadence: 2 posts/month minimum. Future topic taxonomy:
- Per-product mechanism reviews
- Reconstitution and storage best practices
- Stack synergy articles
- Sourcing and lab quality standards
- Regulatory landscape primer

### Appendix I: Email Welcome Sequence (4 emails, designed to survive spam classifiers)

**Email 1 (Welcome + Lead-Magnet Delivery)**
Subject: Your [Reconstitution and Storage Guide] is ready
Body: Plaintext, attached PDF, no discount code

**Email 2 (Day 3: Product Education)**
Subject: How to read a Certificate of Analysis
Body: 400 words on purity %, endotoxin units, HPLC methodology; link to blog post; no product pitch

**Email 3 (Day 7: Soft Product Introduction)**
Subject: BPC-157 research applications: 2024-2025 literature
Body: 2-3 PubMed links, 1-2 abstracts; closing soft mention of {{BRAND_NAME}} catalog

**Email 4 (Day 14: 15% Discount Code)**
Subject: 15% off your first research order
Body: Discount code WELCOME15; soft research-context framing

Footer (every email):
```
All products intended for research, laboratory, analytical purposes only. Not for human consumption.
{{BRAND_NAME}} LLC, [Wyoming/Delaware/Nevada] limited liability company.
```

---

## 9. CLOSING CONTRACT

You operate this build end-to-end. You do not ask the operator clarifying questions about decisions that are LOCKED in the manifest or in `DECISIONS/`. You DO surface the brand pick if it's PENDING (recommend Numerus Labs as Posture A default if operator wants to delegate).

You do not invent vendor names, prices, claims, or compliance language. Everything traces to the manifest, the audit, the compliance corpus, the pricing matrix, the brand candidates, the acquisition synthesis, or the Mogtrix codebase.

You do not weaken the compliance contract. Operator may strengthen, never weaken.

You do not skip phases. Each phase ends with its checkpoint artifact and `/context-save` so the build is resumable.

You report at the end of each phase with a one-screen status update: what landed, what's next, any operator-side actions needed.

When the 15 phases complete, the operator has a deployable brand-conditioned, compliance-locked, payment-integrated, catalog-seeded peptide e-commerce site running on Vercel with Sentry monitoring, an operator runbook for first-90-days acquisition, and a complete checkpoint trail for resumption or audit.

If at any point you discover a manifest entry that doesn't match disk reality, stop, surface the discrepancy, and ask the operator to reconcile (this is a manifest-integrity issue, not a build issue).

Begin Phase 0. Read the manifest. Report state. Then proceed.

---

End of super-prompt.
