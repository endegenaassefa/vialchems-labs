# Peptide D2C Launch Bundle

A complete, self-contained environment for building a peptide e-commerce site using Claude Code, Codex CLI, or another AI coding agent. Clone this repo, follow `SETUP.md`, and you have everything needed to execute the Stage 6 build to a deployable production site.

## What's in this bundle

```
peptide-launch-bundle/
├── README.md                              ← this file (overview)
├── SETUP.md                               ← step-by-step setup + run instructions
├── .env.example                           ← credential template
├── .gitignore                             ← sensible defaults
├── corpus/                                ← peptide-research_cli/ research corpus (124MB)
│   ├── SUPER_PROMPT_v3_2026-05-08.md      ← THE PROMPT TO PASTE
│   ├── SUPER_PROMPT_v2_2026-05-08.md      ← v2.0 reference
│   ├── SUPER_PROMPT_2026-05-08.md         ← v1.0 reference
│   ├── NAVIGATION_GUIDE.md                ← question→file index (start here for finding answers)
│   ├── STAGE6_README.md                   ← layout guide
│   ├── STAGE6_MANIFEST.yaml               ← machine-readable input manifest
│   ├── AUDIT_2026-05-08.md                ← per-pillar audit verdict
│   ├── DECISIONS/                         ← 5 operator decision artifacts
│   ├── 01_strategic_frame/                ← 4 reference docs from meta-prompt chain
│   ├── 00_inputs/                         ← original research inputs
│   ├── 02_claude_code_outputs/            ← canonical research outputs
│   ├── 03_final/                          ← finalized brand candidates
│   ├── 03_raw_fetches/                    ← ~225 vendor subdirs of raw page captures (105MB)
│   ├── 04_synthesis/                      ← post-launch synthesis placeholders
│   └── tools/                             ← research-execution helpers
└── mogtrix-reference/                     ← Mogtrix codebase, source-only, READ-ONLY (32MB)
    ├── CLAUDE.md
    ├── DESIGN.md
    ├── Context.md
    └── site/                              ← Next.js source for pattern reference
```

## What this bundle does NOT include

- `node_modules/` (run `npm install` inside `mogtrix-reference/site/` if you actually need to run Mogtrix; otherwise the source is enough)
- Mogtrix `.git/` history (re-init if you want git ops on Mogtrix)
- Mogtrix `.next/` build artifacts
- `.env` files with real credentials (use `.env.example` as your template)
- Operator personal credentials, API keys, payment-processor merchant IDs

## Quick start

1. Read `SETUP.md` for step-by-step instructions
2. Copy `.env.example` → `.env` and fill in your credentials
3. Read `corpus/NAVIGATION_GUIDE.md` to understand how the research corpus is organized
4. Read `corpus/AUDIT_2026-05-08.md` to understand pipeline state and gaps
5. Open `corpus/DECISIONS/` and either lock or accept defaults for the 5 decision files
6. Open a fresh AI coding-agent session in a NEW project directory (NOT this bundle)
7. Paste `corpus/SUPER_PROMPT_v3_2026-05-08.md` as the first message
8. The agent runs through 15 build phases over ~12-18 hours of wall-clock work

## Compatibility

| AI Coding Agent | Compatibility | Notes |
|---|---|---|
| Claude Code (Anthropic) | NATIVE | Designed for this. References Superpowers + gstack skills. Best fit. |
| Codex CLI (OpenAI) | ADAPTED | Friend manually translates `superpowers:*` and `gstack /*` references to manual procedures. ~70-80% of Claude Code quality. See SETUP.md §5. |
| Cursor / Aider / Other | UNTESTED | Probably works with similar adaptations as Codex. |

## What you build

A deployable, brand-conditioned, compliance-locked, payment-integrated peptide e-commerce site:
- 29 pages (catalog, product detail, cart, checkout, account, COA library, ToS, etc.)
- 7 opening SKUs at researched prices (BPC-157, TB-500, GHK-Cu, Ipamorelin, CJC-1295 no-DAC, MOTS-c, Selank) + Recovery Stack bundle + 15% intro promo
- Crypto (BTCPay self-hosted) + ACH (Plaid) payment rails
- Verbatim FDA-survival compliance contract (19-letter enforcement awareness, 21 CFR 201.128 framework, 503A/503B footer, age gate, jurisdictional restrictions)
- Independent third-party COA hosting (Janoshik default)
- Customer-acquisition runbook for first 90 days
- Sentry monitoring + Vercel deployment + GitHub PR workflow
- Lighthouse Performance ≥90 / Accessibility ≥95 / SEO ≥95 / Best Practices ≥95 on every page

Operator effort post-build: zero editing required. Operator confirms LLC formation + provisions BTCPay/Plaid/Vercel/Supabase/Resend accounts + does the Bible §16 buyer-conversation assignment + fires B1 (community channels) optionally.

## Compliance + safety posture

This bundle assumes a research-peptide e-commerce business operating in the US gray-legal market. The build:
- Excludes tirzepatide entirely (ITC GEO 337-TA-1377 in effect)
- Excludes semaglutide and retatrutide for first 90 days (highest FDA enforcement priority)
- Excludes bacteriostatic water entirely (March 2026 FDA wave treats it as drug intent)
- Uses verbatim disclaimer language proven to survive enforcement
- Routes payments through self-hosted BTCPay + Plaid ACH (mainstream processors banned the category)
- Implements buyer qualification gating, age verification (21+), jurisdictional restrictions

This is operator-decided posture, grounded in the audited research at `corpus/02_claude_code_outputs/compliance_disclaimers/`. The build does not weaken these positions; the operator may strengthen.

## License + attribution

This bundle includes:
- Original research artifacts (124MB) — proprietary to the operator
- The Mogtrix codebase (32MB, source-only, read-only reference) — proprietary to the operator
- Super-prompts v1, v2, v3 — written for this build

Operator's discretion on licensing; not redistributable without operator permission.

## Questions

Read `corpus/NAVIGATION_GUIDE.md` first; it maps every common question to a specific file.
