# Peptide Vendor Intelligence Research — Project Root

This directory hosts an end-to-end competitive-intelligence research
mission across the global research-peptide retail industry. It is
operator-driven and AI-executed, with strict anti-cheat guardrails.

## How to start a research session

If you are the AI agent that just landed in this directory, **read
files in this order before any action**:

1. **`00_inputs/research_directive.md`** — your operating contract.
   Read end-to-end. It governs everything below.
2. **`00_inputs/combined_context.md`** — operator orientation. Why
   this work exists. **Do not cite as evidence.**
3. **`PILLAR_A_SCHEMA.md`** — per-vendor profile JSON shape.
4. **`PILLAR_B_SCHEMA.md`** — per-channel customer-acquisition
   profile structure.
5. **`PILLAR_C_SCHEMA.md`** — pricing matrix CSV columns,
   distribution analyses, opening-SKU memo spec.

Then, before any execution work:

- Invoke `superpowers:writing-plans` and produce a formal execution
  plan saved at `docs/superpowers/plans/<date>-peptide-vendor-research.md`.
- Reference every section of `00_inputs/research_directive.md` by
  number in your plan.
- Stop. Wait for operator approval before starting Phase 1.

## File layout

```
peptide-research_cli/
├── README.md                          ← this file
├── PILLAR_A_SCHEMA.md                 ← vendor profile shape
├── PILLAR_B_SCHEMA.md                 ← channel profile shape
├── PILLAR_C_SCHEMA.md                 ← pricing artifacts shape
├── 00_inputs/
│   ├── research_directive.md          ← operating contract (read first)
│   └── combined_context.md            ← operator orientation
├── 02_claude_code_outputs/            ← all outputs land here
│   ├── vendors/<slug>.json            ← per-vendor profiles
│   ├── evidence/<slug>.txt            ← per-vendor evidence
│   ├── acquisition_channels/<channel>.md
│   ├── pricing_matrix.csv
│   ├── stack_bundle_catalog.csv
│   ├── sku_distributions.md
│   ├── opening_sku_recommendation.md
│   ├── meta_synthesis_pillar_a.md
│   ├── acquisition_synthesis.md
│   ├── coverage_report.md
│   ├── discovery_log.jsonl
│   ├── discovery_pass_log.md
│   ├── vendor_universe.csv
│   ├── executive_summary.md
│   └── final_audit_log.md
└── 03_raw_fetches/<slug>/             ← every saved raw fetch
    ├── homepage.md
    ├── product_<n>__<sku-slug>.md
    ├── tos.md
    ├── refund.md
    ├── shipping.md
    ├── coa_<n>.md
    ├── checkout_payment.png
    └── ...
```

## The standard, in one sentence

Verifiable completeness with honest uncertainty beats confident
fabrication every time. If you cannot ground a claim in a saved raw
fetch with a grep-matchable verbatim quote, the field is
`"uncertain"` with a documented reason. See
`00_inputs/research_directive.md` §3 (the 25-rule Anti-Cheat
Covenant) for the full enforcement layer.

## For the operator

When you start a fresh session, paste this into the prompt:

> Read `README.md`, then read every file in the order it lists, then
> follow the instructions in `00_inputs/research_directive.md`. Do
> not begin Phase 1 work until I approve your written execution plan.

That single line is sufficient. The directive does the rest.
