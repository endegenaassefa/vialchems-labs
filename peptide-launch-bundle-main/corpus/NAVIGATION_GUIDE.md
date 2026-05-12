# Navigation Guide — Find Any Answer in 30 Seconds

This is the human/AI-friendly index for the entire research corpus. Every common question maps to a specific file with a one-liner explaining what's there. The original research-methodology filenames are preserved (so the manifest still works) but you don't need to know what "Slice B2" or "Pass 7 convergence" means to use this corpus.

If you (operator or AI) want to find something, search this file first.

Last updated: 2026-05-08

---

## Quick Start: where to begin

| If you are... | Start here |
|---|---|
| **Operator opening this corpus for the first time** | `STAGE6_README.md` (corpus layout) → `AUDIT_2026-05-08.md` (what's done, what's not) → `DECISIONS/` (what you need to pick or confirm) |
| **AI starting the Stage 6 build** | `SUPER_PROMPT_v3_2026-05-08.md` (the current build prompt) → `STAGE6_MANIFEST.yaml` (canonical input paths) → Phase 0 → Phase 1 |
| **Operator who just wants the catalog** | `DECISIONS/opening_sku_set.md` (locked 7-SKU set with prices) |
| **Operator who just wants the brand** | `DECISIONS/brand_pick.md` (PENDING; recommended Numerus Labs default) and `03_final/brand_name_candidates.md` (full 34-candidate list) |
| **Operator who just wants the compliance contract** | `DECISIONS/compliance_posture.md` (locked) |
| **AI investigating a specific question** | This file (NAVIGATION_GUIDE.md), section "By Question" |

---

## By Question (most common operator questions)

### "What products should I sell, and at what price?"
- **Answer**: `02_claude_code_outputs/opening_sku_recommendation.md` (rubric-grounded 7 SKUs at researched prices)
- **Locked decision**: `DECISIONS/opening_sku_set.md`
- **Verbatim product descriptions for each**: `SUPER_PROMPT_v3_2026-05-08.md` Appendix E.1 (336-345 words each, all assertMarketingCopySafe verified)

### "What's the per-mg market price for [specific peptide]?"
- **Answer**: `02_claude_code_outputs/sku_distributions.md` (search for the peptide name; gives min/p25/median/p75/max + CV + OOS count + variant breakdown)
- **Raw data**: `02_claude_code_outputs/pricing_matrix.csv` (3,389 SKU rows across 169 vendors, 23 columns)
- **Machine-readable**: `02_claude_code_outputs/sku_distributions_summary.json`

### "What did the FDA do to other peptide vendors? What got them in trouble?"
- **Answer**: `02_claude_code_outputs/compliance_disclaimers/enforcement_events.md` (19 FDA warning letters chronologically + 3 DOJ guilty pleas + ITC GEO 337-TA-1377 with primary-source citations)
- **Strategic findings**: `02_claude_code_outputs/compliance_disclaimers/COMPLIANCE_DISCLAIMER_FINDINGS.md` (8 numbered industry findings, 102KB)
- **Marketing-copy crossover patterns**: `02_claude_code_outputs/compliance_disclaimers/marketing_language_compliance.md`

### "What payment methods work for this category?"
- **Answer**: `02_claude_code_outputs/compliance_disclaimers/payment_processor_posture.md` (15-vendor payment matrix, 4-tier durability ladder, 10 strategies for surviving processor terminations)
- **Locked decision**: `DECISIONS/payment_stack.md` (BTCPay self-hosted + Plaid ACH; cards Phase 2)

### "What should I name the brand?"
- **Full candidate list**: `03_final/brand_name_candidates.md` (34 candidates: 14 Posture A + 15 Posture B + 5 Cross-Posture, with grep-counted pattern analysis + curl-based domain checks)
- **Locked-or-pending decision**: `DECISIONS/brand_pick.md` (PENDING; recommended Numerus Labs as Posture A default)
- **Top recommendations**:
  - Posture A clean clinical: Numerus Labs (default), Cubit Labs, Bezel Bio
  - Posture B meme-coded community: Skullcap Labs, Pylon Peptides, Voltic Peptides
  - Cross-Posture: Bezel Bio, Schema Peptides, Pylon Peptides

### "What disclaimer / legal / compliance language do I put on the site?"
- **Verbatim disclaimers (footer + product page)**: `SUPER_PROMPT_v3_2026-05-08.md` Appendix A
- **Vendor-by-vendor disclaimer inventory (32+ vendors)**: `02_claude_code_outputs/compliance_disclaimers/batch_a__disclaimers.md` through `batch_d__disclaimers_and_posture_verification.md`
- **Locked compliance posture**: `DECISIONS/compliance_posture.md`
- **What FDA enforces and how to avoid it**: `compliance_disclaimers/enforcement_events.md` + Appendix B/C in v3.0

### "How do I get customers? What acquisition channels work?"
- **Master synthesis (Slice 2: search + owned channels)**: `02_claude_code_outputs/acquisition_synthesis_slice2.md`
- **Per-channel deep dives (13 channels)**: `02_claude_code_outputs/acquisition_channels/` directory
  - `google-organic-search.md` — SEO patterns, content depth, schema markup
  - `google-ads.md` — verdict: AVOID (category bans)
  - `bing-ddg-search.md` — secondary, low-value
  - `seo-content-marketing.md` — affiliate listicle ecosystem (Outliyr, Muscle+Brawn, PepPal)
  - `vendor-blogs.md` — research-register cadence, Q&A bait, internal linking
  - `vendor-youtube.md` — verdict: DEFER (channel-termination risk)
  - `vendor-instagram.md` — three-handle minimum, halo accounts, affiliate funnels
  - `vendor-tiktok.md` — influencer-proxied only, per-creator discount codes
  - `vendor-x.md` — founder-personal cadence, hashtag-heavy threads
  - `email-marketing.md` — Omnisend dominant, 4-email welcome sequence
  - `sms-marketing.md` — verdict: AVOID (CTIA + TCPA + carrier vetting)
- **Influencer / creator tier map (78 creators, Tier XL/L/M/S)**: `02_claude_code_outputs/slice_B2_influencer_tier_map.md`
- **Day-1 / Weeks-2-4 / Defer prioritization**: `SUPER_PROMPT_v3_2026-05-08.md` Appendix I

### "Who should I sponsor or partner with?"
- **78-creator tier map with vendor relationships, FTC patterns, commission rates**: `02_claude_code_outputs/slice_B2_influencer_tier_map.md`
- **Tier S focus band (5K-30K followers, looksmax-coded, lowest cost)**: same file, search for "Tier S"

### "What does the rest of the industry look like?"
- **All 1,506 vendors discovered**: `02_claude_code_outputs/master_vendor_table.csv` (deduplicated; 23 columns including brand_name, primary_domain, country, ship-to-scope, year_established, activity_status, lab_testing_posture, tier classification)
- **Discovery methodology + 8-pass convergence story**: `02_claude_code_outputs/DISCOVERY_RUN_FINAL_DOCUMENT.md` (135K, 1,744 lines)
- **Coverage gaps + audit findings**: `02_claude_code_outputs/coverage_report.md`

### "What does vendor [X]'s site actually look like? What do they say?"
- **Per-vendor structured profile (208 vendors)**: `02_claude_code_outputs/vendors/<vendor-slug>.json` (full PILLAR_A_SCHEMA: homepage, catalog, product page anatomy, trust/compliance, checkout, tech stack, content footprint, social proof)
- **Verbatim quotes from vendor's site (206 vendors)**: `02_claude_code_outputs/evidence/<vendor-slug>.txt` (every claim cited with [URL] + [FETCHED_AT] + [QUOTE] block)
- **Raw page captures**: `03_raw_fetches/<vendor-slug>/<page>.md` (homepage, product pages, COA, ToS, refund, shipping, FAQ — ~225 vendor subdirs total, ~105MB)

### "What's the audit verdict on the research?"
- **One-page verdict per pillar**: `AUDIT_2026-05-08.md` §1 Executive Verdict
- **Per-ambition-dimension verdict (10 dimensions)**: same file §2
- **Pipeline state (Pillar A 95% / Pillar C 65% / Pillar B 40% / Compliance 95% / Brand 100%)**: `STAGE6_MANIFEST.yaml#pipeline_state`
- **Recommended path forward (Path B, gap closure)**: `AUDIT_2026-05-08.md` §4 + `STAGE6_README.md`

### "What's still missing or pending?"
- **Operator decisions PENDING**: `DECISIONS/brand_pick.md`, `DECISIONS/source_terms.md`
- **Research gaps (Slice 3 community channels not yet fired)**: `STAGE6_MANIFEST.yaml#gaps`
- **Slice 6 cross-mandate synthesis**: `04_synthesis/master_channel_ranking.md` (PLACEHOLDER)
- **Step 3 unified academic report**: `04_synthesis/unified_decision_brief.md` (PLACEHOLDER)
- **B1 prompt to fire (community channels)**: `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md`

### "What's the strategic foundation? Why does this brand exist?"
- **The Bible (canonical strategic foundation)**: `01_strategic_frame/bible_final.md` (492 lines, 17 sections including buyer profile, brand posture options, compliance commitment, 12 load-bearing premises, hostile read, decision criteria)
- **Combined Context (synthesizer-built orientation)**: `01_strategic_frame/combined_context.md`
- **Original meta-prompt**: `01_strategic_frame/research_meta_prompt.md`
- **Operations playbook (academic-grade research methodology)**: `01_strategic_frame/research_operations_playbook.md` (2,067 lines)

### "What's the build prompt? How does the website get made?"
- **Latest super-prompt (v3.0)**: `SUPER_PROMPT_v3_2026-05-08.md` (the runtime artifact: 17 Iron Laws, Subagent Constitution, 15 phases, hard performance/UX/a11y targets, vendor-archetype design reasoning rules, security threat model, pre-delivery checklist)
- **Predecessor v2.0 (preserved as reference)**: `SUPER_PROMPT_v2_2026-05-08.md`
- **Predecessor v1.0 (preserved as reference)**: `SUPER_PROMPT_2026-05-08.md`
- **Layout guide**: `STAGE6_README.md`
- **Machine-readable manifest**: `STAGE6_MANIFEST.yaml`

### "How does the build use the existing Mogtrix codebase?"
- **As a REFERENCE only (not fork, not clone)**: `SUPER_PROMPT_v3_2026-05-08.md` Iron Law 2.12 + §1.5 + Appendix H (full reference list of which Mogtrix files to read for which patterns)
- **Mogtrix codebase**: `/root/mogtrix-website/` (read-only)

### "What does v3.0 add over v2.0?"
- **Section in v3.0 itself**: `SUPER_PROMPT_v3_2026-05-08.md` header paragraph "Why v3.0"
- **Memory entry**: `~/.claude/projects/-root/memory/project_peptide_research_audit_2026_05_08.md` v3.0 section

---

## By Topic (browse by category)

### TOPIC: Strategy + Foundation
- `01_strategic_frame/bible_final.md` — strategic foundation, 17 sections
- `01_strategic_frame/combined_context.md` — synthesizer orientation
- `01_strategic_frame/research_meta_prompt.md` — original meta-prompt
- `01_strategic_frame/research_operations_playbook.md` — research methodology v3
- `AUDIT_2026-05-08.md` — per-pillar verdict + gap inventory
- `STAGE6_README.md` — Stage 6 layout guide
- `README.md` — original research-execution README (preserved)

### TOPIC: Vendor Universe (who else is doing this)
- `02_claude_code_outputs/master_vendor_table.csv` — 1,506 deduplicated vendors with 23 columns
- `02_claude_code_outputs/vendors/<slug>.json` — 208 per-vendor structured profiles
- `02_claude_code_outputs/evidence/<slug>.txt` — 206 verbatim-quote evidence files
- `02_claude_code_outputs/DISCOVERY_RUN_FINAL_DOCUMENT.md` — 8-pass convergence narrative
- `02_claude_code_outputs/coverage_report.md` — audit findings, anti-cheat scoring
- `02_claude_code_outputs/discovery_log.md`, `discovery_log.jsonl` — fetch event log
- `02_claude_code_outputs/dedup_audit.md` — deduplication audit
- `02_claude_code_outputs/checkpoint_3_tier1_summary.md`, `checkpoint_4_tier2_summary.md` — Tier 1 + Tier 2 completion summaries
- `02_claude_code_outputs/pass[1-8]_aggregation_summary.md`, `pass[1-8]_convergence_report.md` — discovery passes
- `02_claude_code_outputs/final_audit_log.md`, `final_audit_log_slice2.md` — final audit logs
- `02_claude_code_outputs/vendor_universe.csv`, `vendor_universe_final.csv` — universe CSVs
- `03_raw_fetches/` — ~225 vendor subdirs of raw page captures (~105MB)

### TOPIC: Pricing Intelligence
- `02_claude_code_outputs/pricing_matrix.csv` — 3,389 SKU rows, 169 vendors
- `02_claude_code_outputs/sku_distributions.md` — 78 peptide distributions, 2,203 lines
- `02_claude_code_outputs/sku_distributions_summary.json` — machine-readable
- `02_claude_code_outputs/opening_sku_recommendation.md` — rubric-grounded 7-SKU recommendation

### TOPIC: Compliance + Regulatory (Slice 5 by another name)
- `02_claude_code_outputs/compliance_disclaimers/COMPLIANCE_DISCLAIMER_FINDINGS.md` — 8 industry findings, 102K
- `02_claude_code_outputs/compliance_disclaimers/enforcement_events.md` — 19 FDA letters + 3 DOJ + ITC GEO
- `02_claude_code_outputs/compliance_disclaimers/marketing_language_compliance.md` — vendor-by-vendor marketing-copy analysis
- `02_claude_code_outputs/compliance_disclaimers/payment_processor_posture.md` — 4-tier durability ladder
- `02_claude_code_outputs/compliance_disclaimers/batch_a__disclaimers.md` through `batch_d__` — 32-vendor verbatim disclaimer inventory
- `03_raw_fetches/compliance_slice/` — primary-source FDA letters + payment processor pages

### TOPIC: Customer Acquisition (Pillar B)
- `02_claude_code_outputs/acquisition_synthesis_slice2.md` — Slice 2 master synthesis (search + owned channels)
- `02_claude_code_outputs/acquisition_channels/` — 13 per-channel detail files
- `02_claude_code_outputs/slice_B2_influencer_tier_map.md` — 78-creator tier map
- `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md` — B1 prompt PENDING_FIRE for Slice 3 (community channels)

### TOPIC: Brand
- `03_final/brand_name_candidates.md` — 34 candidates with pattern grep + domain checks
- `DECISIONS/brand_pick.md` — operator decision file (PENDING)

### TOPIC: Operator Decisions
- `DECISIONS/brand_pick.md` — PENDING
- `DECISIONS/source_terms.md` — PENDING (operator-supplier conversation)
- `DECISIONS/opening_sku_set.md` — LOCKED_DEFAULT (7 SKUs verified)
- `DECISIONS/compliance_posture.md` — LOCKED_DEFAULT (verbatim disclaimers, age gate, jurisdictional, 503A/503B)
- `DECISIONS/payment_stack.md` — LOCKED_DEFAULT (BTCPay + Plaid Day-1, cards Phase 2)

### TOPIC: Build Artifacts (run these)
- `SUPER_PROMPT_v3_2026-05-08.md` — current runtime artifact
- `SUPER_PROMPT_v2_2026-05-08.md` — predecessor reference
- `SUPER_PROMPT_2026-05-08.md` — v1.0 reference
- `STAGE6_MANIFEST.yaml` — machine-readable input manifest

### TOPIC: Synthesis Layer (placeholders)
- `04_synthesis/master_channel_ranking.md` — PLACEHOLDER (blocks on Slice 3 fire)
- `04_synthesis/unified_decision_brief.md` — PLACEHOLDER (blocks on Slice 6 + Step 3)

### TOPIC: Tools (research-execution helpers)
- `tools/audit_evidence.py` — verbatim-quote audit
- `tools/build_pricing_matrix.py` — pricing matrix builder
- `tools/build_sku_distributions.py` — SKU distribution builder
- `tools/build_vendor_universe.py` — vendor universe builder
- `tools/curl_fetch.py`, `fetch_save.py` — fetch helpers
- `tools/fixup_vendor_list.py`, `repair_vendor_list.py` — list repair

---

## By Decision Status (what's locked, what's pending)

### LOCKED (operator may strengthen, never weaken)
| Decision | File | Status |
|---|---|---|
| Opening SKU set (7 SKUs + Recovery Stack bundle + 15% intro promo) | `DECISIONS/opening_sku_set.md` | LOCKED_DEFAULT |
| Compliance posture (disclaimers, age gate, jurisdictional, 503A/503B) | `DECISIONS/compliance_posture.md` | LOCKED_DEFAULT |
| Payment stack (BTCPay self-hosted + Plaid ACH) | `DECISIONS/payment_stack.md` | LOCKED_DEFAULT |
| GLP-1 catalog exclusion (Tirzepatide perpetual; Semaglutide/Retatrutide 90-day) | `DECISIONS/opening_sku_set.md` + `enforcement_events.md` | LOCKED_DEFAULT |
| BAC water exclusion | Iron Law 2.7 + 2.14 | LOCKED |
| Mogtrix as REFERENCE only | Iron Law 2.12 + §1.5 of v3.0 | LOCKED |
| 14 + 3 Iron Laws | `SUPER_PROMPT_v3_2026-05-08.md` §2 | LOCKED |
| Performance / UX / A11y targets (Lighthouse 90/95/95/95) | v3.0 §7 | LOCKED |
| Single-track Opus model for all build work | v3.0 §4.5 | LOCKED |

### PENDING (operator must decide before zero-edit deploy)
| Decision | File | Operator action |
|---|---|---|
| Brand pick from 34 candidates | `DECISIONS/brand_pick.md` | Pick one (default Numerus Labs if delegated) |
| Source-side terms | `DECISIONS/source_terms.md` | 30-min supplier conversation: MOQ, lead time, COA passthrough, contingency |
| Slice 3 community channels (B1 fire) | `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md` | Fire at ChatGPT Pro Deep Research, save output to `02_claude_code_outputs/slice_B1_reddit_and_forum_ecosystem.md` |

### NOT BLOCKING (deferred to post-launch)
| Item | File | Note |
|---|---|---|
| Step 3 unified academic report | `04_synthesis/unified_decision_brief.md` | Useful for archival; not needed for build |
| Slice 6 cross-mandate synthesis | `04_synthesis/master_channel_ranking.md` | Useful for master channel ranking; not needed for build |
| stack_bundle_catalog.csv | not present | Useful for bundle ecosystem analysis; bundle math works without it |
| OOS-simultaneity demand signal | not computed | Useful for demand-spike detection; opening catalog doesn't need it |

---

## Filename Translation (research jargon → plain English)

| Research filename | Plain-English summary |
|---|---|
| `acquisition_synthesis_slice2.md` | Search + owned channels (Google SEO, Bing/DDG, vendor blogs, vendor social, email, SMS) — master synthesis |
| `acquisition_channels/` | Per-channel deep dives (one file per channel) |
| `slice_B2_influencer_tier_map.md` | Influencer + creator + podcast + paid + in-person channels — 78-creator tier map |
| `compliance_disclaimers/` | All Slice 5 (compliance + regulatory) outputs |
| `COMPLIANCE_DISCLAIMER_FINDINGS.md` | The 8 strategic compliance findings + verbatim 503A/503B template |
| `enforcement_events.md` | Every FDA / DOJ / ITC enforcement action with primary-source citations |
| `marketing_language_compliance.md` | Vendor-by-vendor marketing-copy analysis (compliant vs non-compliant) |
| `payment_processor_posture.md` | 15-vendor payment matrix + 4-tier durability + 10 survival strategies |
| `batch_a__disclaimers.md`, `batch_b__`, `batch_c__`, `batch_d__` | Per-vendor verbatim disclaimer inventory across 32+ vendors |
| `master_vendor_table.csv` | All 1,506 deduplicated vendors with 23 columns |
| `vendor_universe_final.csv` | Same as master_vendor_table.csv (pre-dedup variant) |
| `master_vendor_table_prededuped.csv` | Pre-dedup raw aggregation (1,554 rows) |
| `pricing_matrix.csv` | All 3,389 SKUs across 169 vendors with per-mg pricing |
| `sku_distributions.md` | Per-peptide market distribution analysis (vendor count, p25, median, p75, CV, OOS) |
| `sku_distributions_summary.json` | Same as above, machine-readable |
| `opening_sku_recommendation.md` | Rubric-grounded recommendation for opening 7 SKUs |
| `vendors/` | 208 per-vendor structured profiles (JSON) |
| `evidence/` | 206 per-vendor verbatim-quote files |
| `DISCOVERY_RUN_FINAL_DOCUMENT.md` | 8-pass convergence story (how the universe got mapped) |
| `coverage_report.md` | Audit findings + 28-failed-profile root causes + anti-cheat scoring |
| `pass[1-8]_aggregation_summary.md`, `pass[1-8]_convergence_report.md` | Per-pass discovery results (mostly historical) |
| `checkpoint_3_tier1_summary.md`, `checkpoint_4_tier2_summary.md` | Tier 1 + Tier 2 completion summaries |
| `dedup_audit.md` | Deduplication audit |
| `discovery_log.md`, `discovery_log.jsonl` | Fetch event log |
| `final_audit_log.md`, `final_audit_log_slice2.md` | Final audit logs |
| `brand_name_candidates.md` | 34 brand candidates with pattern grep + domain checks |
| `bible_final.md` | The canonical strategic foundation document (Bible) |
| `combined_context.md` | Synthesizer-built orientation doc |
| `research_meta_prompt.md` | Original meta-prompt that started the research |
| `research_operations_playbook.md` | Research execution methodology v3 |
| `STAGE6_MANIFEST.yaml` | Machine-readable manifest of all inputs + decisions + gaps |
| `SUPER_PROMPT_v3_2026-05-08.md` | The current runtime build prompt |
| `AUDIT_2026-05-08.md` | Per-pillar audit verdict |
| `DECISIONS/<file>` | Operator-side decision artifacts |
| `04_synthesis/<file>` | Synthesis-layer placeholders (post-launch) |
| `01_strategic_frame/<file>` | The four reference docs from the meta-prompt chain |

---

## How to Use This Corpus (workflow patterns)

### "I want to build the website now"
1. Read `STAGE6_README.md`
2. Read `AUDIT_2026-05-08.md` executive verdict
3. Open `DECISIONS/brand_pick.md`; pick a brand or accept Numerus Labs default
4. Optional: confirm source-side terms (`DECISIONS/source_terms.md`); if not, the build runs with sane placeholders
5. Optional: fire B1 (community channels) using `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md` for richer Slice 3 content; if not, runbook marks Slice 3 as PLACEHOLDER
6. Open a fresh Claude Code session in a NEW directory (not Mogtrix's)
7. Paste `SUPER_PROMPT_v3_2026-05-08.md` as first user message
8. The build runs through 15 phases with checkpoint artifacts at each phase
9. After phase 15, site is deployed to Vercel with Sentry monitoring + operator runbook

### "I want to verify a specific compliance claim"
1. Open `02_claude_code_outputs/compliance_disclaimers/enforcement_events.md`
2. Search for vendor name OR enforcement date OR compound name
3. Cross-reference with `02_claude_code_outputs/compliance_disclaimers/marketing_language_compliance.md` for marketing-copy analysis
4. For deeper verification, follow the `[URL]` citations in `evidence/<vendor-slug>.txt`

### "I want to look up a specific peptide's pricing"
1. Open `02_claude_code_outputs/sku_distributions.md`
2. Use Ctrl-F or grep for the peptide name
3. Read the section: vendor count, percentile distribution, CV, OOS, variant breakdown
4. For raw rows: `02_claude_code_outputs/pricing_matrix.csv`, filter by `peptide_canonical`

### "I want to study a specific vendor's site patterns"
1. Find the vendor slug in `02_claude_code_outputs/master_vendor_table.csv`
2. Open `02_claude_code_outputs/vendors/<slug>.json` for the structured profile
3. Open `02_claude_code_outputs/evidence/<slug>.txt` for verbatim quotes
4. Open `03_raw_fetches/<slug>/` for raw page captures (homepage, products, COA, ToS, etc.)

### "I want to revise a locked decision"
1. Edit the relevant `DECISIONS/<file>.md`
2. Replace `LOCKED_DEFAULT:` with `LOCKED_OVERRIDE:` and add rationale
3. Re-run the super-prompt to regenerate affected build sections
4. Update `STAGE6_MANIFEST.yaml` if the path or content reference changes

### "I want to check what the AI knows about [topic]"
1. Search this NAVIGATION_GUIDE.md for the topic keyword
2. Follow the file path
3. If the topic isn't in this guide, the topic isn't in the corpus (research gap)

---

*If you (operator or AI) find a question not covered by this guide, ADD IT to the "By Question" section above. This file is the index; keeping it updated keeps the corpus navigable.*
