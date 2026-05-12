# Stage 6 Build Layout (companion to README.md)

The original `README.md` documents the research-execution workflow. This file documents the Stage 6 (build-the-website) layout that sits on top of the completed research.

Stage 6 entry point: `SUPER_PROMPT_v3_2026-05-08.md` (current runtime artifact) consumed in a fresh CLI session in a NEW operator-chosen directory. `/root/mogtrix-website/` is a READ-ONLY reference (NOT a fork base). v1.0 and v2.0 super-prompts preserved as historical reference.

**For finding any specific answer, start with `NAVIGATION_GUIDE.md` at the corpus root.** It maps common questions to specific files with one-liner explanations and is the human/AI-friendly index for the entire research corpus.

## Stage 6 added structure

```
peptide-research_cli/
├── README.md                     <-- original research-execution README (do not modify)
├── STAGE6_README.md              <-- this file: Stage 6 layout guide
├── NAVIGATION_GUIDE.md           <-- human/AI-friendly index: questions → files (START HERE)
├── AUDIT_2026-05-08.md           <-- per-pillar audit verdict + gap inventory
├── STAGE6_MANIFEST.yaml          <-- machine-readable input manifest for the super-prompt
├── SUPER_PROMPT_v3_2026-05-08.md <-- CURRENT runtime artifact (use this)
├── SUPER_PROMPT_v2_2026-05-08.md <-- v2.0 reference
├── SUPER_PROMPT_2026-05-08.md    <-- v1.0 reference
├── DECISIONS/                    <-- operator-side decision artifacts
│   ├── brand_pick.md             (PENDING — operator picks from 34 candidates)
│   ├── source_terms.md           (PENDING — operator confirms with supplier)
│   ├── opening_sku_set.md        (LOCKED_DEFAULT, 7 SKUs verified vs market)
│   ├── compliance_posture.md     (LOCKED_DEFAULT, derived from compliance_disclaimers/)
│   └── payment_stack.md          (LOCKED_DEFAULT, BTCPay + Plaid ACH, cards Phase 2)
├── 01_strategic_frame/           <-- the four reference docs from the meta-prompt chain
│   ├── bible_final.md
│   ├── combined_context.md
│   ├── research_meta_prompt.md
│   └── research_operations_playbook.md
├── 04_synthesis/                 <-- placeholder slots for missing synthesis
│   ├── master_channel_ranking.md (PLACEHOLDER, blocks on Slice 3 fire)
│   └── unified_decision_brief.md (PLACEHOLDER, blocks on Slice 6 + Step 3)
├── 00_inputs/                    <-- (existing, original research inputs)
├── 02_claude_code_outputs/       <-- (existing, canonical research outputs)
├── 03_final/                     <-- (existing, finalized synthesis: brand candidates)
├── 03_raw_fetches/               <-- (existing, ~105MB raw vendor scrape artifacts)
└── tools/                        <-- (existing, python helpers)
```

## How the super-prompt consumes the corpus

The super-prompt reads `STAGE6_MANIFEST.yaml` first. The manifest indexes:
- All inputs by category (strategic frame, Pillar A/B/C, compliance corpus, brand candidates, audit)
- Operator decisions (brand pick, source terms, opening SKU set, compliance posture, payment stack)
- Gap inventory with severity and closure path
- Mogtrix backend foundation map (reusable layers, prune targets, env vars to swap)
- Tooling contracts (Superpowers + gstack skills to invoke at each phase)

The super-prompt is a function over this manifest. When the operator updates a decision (e.g., locks brand pick, fires B1, gets source terms), re-running the super-prompt regenerates affected sections.

## Pipeline state at audit time

| Pillar | Completion | Notes |
|---|---|---|
| Pillar A (Mandate 1, Vendor Universe + Site Anatomy) | ~95% | Graduate-level academic standard met |
| Compliance corpus (Slice 5 by another name) | ~95% | Production-ready under `compliance_disclaimers/` |
| Brand candidates (Step 3 partial) | 100% | 34 candidates ranked with pattern grep + domain checks |
| Pillar C (Mandate 3, Pricing Intelligence) | ~65% | Day-1 SKU set shippable; ecosystem analyses incomplete |
| Pillar B (Mandate 2, Customer Acquisition) | ~40% | Slice 2 done, Slice 4 partial, Slice 3 dark |
| Step 3 final unified report | 0% | Not run, blocked on Slice 6 |
| Slice 6 cross-mandate synthesis | 0% | Not run, blocked on Slice 3 |
| Weighted overall | ~75% | |

## Recommended pre-Stage-6 actions (per audit Path B)

1. Fire B1 (Slice 3) at ChatGPT Pro Deep Research using `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md`. Save output to `02_claude_code_outputs/slice_B1_reddit_and_forum_ecosystem.md`. ~30-45 min wallclock, 1 of ~125 monthly Deep Research runs.
2. Pick brand from the 34 candidates in `03_final/brand_name_candidates.md`. Top recommendations: Numerus Labs (Posture A), Skullcap Labs (Posture B), Bezel Bio (Cross-Posture). Update `DECISIONS/brand_pick.md`.
3. Confirm source-side terms with US-based supplier directly. Update `DECISIONS/source_terms.md`.

The super-prompt accepts PENDING decisions and emits PLACEHOLDER sections for those gaps. Re-run after locking decisions to regenerate.

## Mogtrix backend foundation summary

The Stage 6 super-prompt forks `/root/mogtrix-website/` (Next.js 16 + React 19 + TypeScript + Supabase + Vercel + Stripe-adapter + Resend + Sentry + Zustand + Zod + R3F vial scenes). Mogtrix already ships an RUO peptide qualification flow with attestations and age gate — the peptide site inherits ~80% of the backend with brand prune + compliance hardening.

See `STAGE6_MANIFEST.yaml#mogtrix_foundation` for the full reusable layers map and prune target list.
