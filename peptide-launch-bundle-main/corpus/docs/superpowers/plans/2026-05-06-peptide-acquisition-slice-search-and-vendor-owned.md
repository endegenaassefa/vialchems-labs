# Peptide Acquisition Channels — Slice 2 (Search + Vendor-Owned) Implementation Plan

> **For agentic workers:** This plan is being executed in this session by the lead agent dispatching 11 parallel channel-research subagents. Each channel is independent. Each agent writes its per-channel deliverable to disk directly. Lead agent synthesizes after subagents return.

**Goal:** Map the search-channel and vendor-owned-channel customer-acquisition surface for the research-peptide industry, deliverable per channel + a posture-split synthesis for a brand-new throwaway-brand entrant.

**Architecture:** 11 parallel subagents → 11 per-channel `.md` files + per-channel evidence files → 1 cross-channel synthesis → 1 final audit log. Anchor vendor universe drawn from `00_inputs/research_directive.md` §2.1; subagents may surface additional vendors during research and add them to a per-channel "newly discovered vendors" appendix.

**Tech stack:** WebSearch + WebFetch (lead-agent-configurable per subagent), Wayback Machine for taken-down pages, Markdown deliverables, Pillar B schema from `PILLAR_B_SCHEMA.md`.

---

## Section A — Inputs and Scope

### A.1 Slice scope (channels in scope for this run)

The user's brief carves a slice of the full Pillar B taxonomy. Channels in scope:

| # | Channel slug | Channel name | Channel category |
|---|--------------|--------------|------------------|
| 1 | google-organic-search | Google organic search ranking patterns | search |
| 2 | google-ads | Google Ads (paid search on category/product terms) | search |
| 3 | bing-ddg-search | Bing + DuckDuckGo (organic + ads) | search |
| 4 | seo-content-marketing | Third-party "research peptide education" content economy | content |
| 5 | vendor-blogs | Vendor-owned blogs / education sections | content |
| 6 | vendor-youtube | Vendor-owned YouTube channels | social |
| 7 | vendor-instagram | Vendor-owned Instagram accounts | social |
| 8 | vendor-tiktok | Vendor-owned TikTok accounts | social |
| 9 | vendor-x | Vendor-owned X (Twitter) accounts | social |
| 10 | email-marketing | Email marketing — capture, welcome, retention | email |
| 11 | sms-marketing | SMS marketing where it exists | email |

Out of scope for this slice (covered in other slices): YouTube creators (3rd-party), Reddit, specialized forums, Telegram/Discord, influencer/affiliate, podcasts/newsletters, adjacent paid platforms, word of mouth, in-person, indirect framing.

### A.2 Anchor vendor universe (starting set)

Per `research_directive.md` §2.1 (the user references "slice_1_vendor_universe.md" but no such file exists in `00_inputs/`; using the directive's anchor list instead, expanding outward as channels surface new names):

**Mainline anchors:**
- Peptide Sciences (peptidesciences.com)
- Biotech Peptides (biotechpeptides.com)
- Core Peptides (corepeptides.com)
- Pure Rawz (purerawz.co)
- Behemoth Labz (behemothlabz.com)
- Limitless Life Nootropics (limitlesslifenootropics.com)
- Swiss Chems (swisschems.is)
- Peptide Guys (peptideguys.com)
- Amino Asylum (aminoasylum.shop)
- Domestic Supply (domestic-supply.com)

**Posture A reference vendors** (clinical lane):
- Hunter Eyes Labs, NZT Peptides, LAR Labs, Adam Labs, Land Bio, Structure Labs

**Posture B reference vendors** (meme-coded lane):
- Jester Labs, Psycho Labs / Psychopeptides, Chad Labs, LARP Labs

Subagents must verify each posture-reference vendor actually exists as a real public brand (some may be operator brand-name brainstorming, not real vendors). Real vs hypothetical is itself a finding.

### A.3 Schema and evidence rules

Each per-channel file follows `PILLAR_B_SCHEMA.md` exactly. Each evidence entry follows `research_directive.md` §6 (`[CLAIM] [URL] [FETCHED_AT] [FETCH_METHOD] [RAW_ARTIFACT] [LINE_RANGE] [QUOTE] [/QUOTE]`).

Anti-cheat covenant from §3 applies in spirit:
- **No fabricated URLs, vendor names, prices, or quotes** (Rule 1, 13, 14)
- **Verbatim quotes for non-trivial claims** (Rule 2, 6, 12)
- **OBSERVED vs INFERRED labeling** (Rule 19)
- **`uncertain` is a valid value** (Rule 4)
- **No bypass of anti-bot / captcha / paywalls** (Rule 9)
- **Don't recommend illegal tactics; flag observed illegality as a finding** (§11)
- **Inputs are not evidence** (Rule 24)

### A.4 Output paths (project root = `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/`)

- Per-channel files: `02_claude_code_outputs/acquisition_channels/<channel-slug>.md`
- Per-channel evidence: `02_claude_code_outputs/acquisition_channels/evidence/<channel-slug>.evidence.txt`
- Raw fetches per channel: `03_raw_fetches/<channel-slug>/<page_id>.md`
- Synthesis: `02_claude_code_outputs/acquisition_synthesis_slice2.md`
- Coverage notes: `02_claude_code_outputs/coverage_report_slice2.md`
- Final audit: `02_claude_code_outputs/final_audit_log_slice2.md`

---

## Section B — Per-Channel Subagent Dispatch (parallel)

11 subagents dispatched in parallel. Each subagent receives:

1. The slice's anchor vendor universe (§A.2) as a starting set.
2. The exact channel slug + name + category to research.
3. The Pillar B schema requirements (§A.3) inline.
4. The 6 deliverable items the user requires per channel:
   - (1) Description of how the channel works for this category
   - (2) ≥5 named vendor examples each with ≥1 URL of evidence + access date
   - (3) Estimated cost structure for a new entrant
   - (4) Estimated time horizon to traction
   - (5) Risk profile (platform-policy, regulatory, reputational)
   - (6) Recommended posture for new throwaway entrant: pursue / defer / avoid (per Posture A and Posture B separately)
5. Output paths to write to.
6. A short return-summary spec (file paths written + 5-bullet summary).

Subagents are general-purpose (full tool access including WebFetch, WebSearch, Write). They do their own research, save evidence, write the deliverable file.

---

## Section C — Synthesis (lead agent, after subagents return)

After all 11 subagent reports return:

- [ ] **C.1** Verify each per-channel file exists and is non-empty.
- [ ] **C.2** Cross-reference: vendors named across channels, channel-channel correlations.
- [ ] **C.3** Write `acquisition_synthesis_slice2.md`:
  - Top 3-5 channels for **Posture A (Clean Clinical Labs)** with reasoning
  - Top 3-5 channels for **Posture B (Meme-Coded Community)** with reasoning
  - Channels deferred or avoided
  - Cross-cutting findings: where postures diverge, where evidence is thin
- [ ] **C.4** Write `coverage_report_slice2.md` documenting coverage gaps, failed fetches, channels with thin evidence.
- [ ] **C.5** Write `final_audit_log_slice2.md` with self-audit checklist results.

---

## Section D — Self-Audit Gate (lead agent)

Before declaring slice complete:

- [ ] **D.1** Every channel in §A.1 has a per-channel `.md` file with all required sections.
- [ ] **D.2** Every channel has ≥5 named vendor examples OR documents the absence as itself a finding.
- [ ] **D.3** Every non-trivial claim cites a URL with access date.
- [ ] **D.4** OBSERVED vs INFERRED labels used where ambiguity exists.
- [ ] **D.5** Both Posture A and Posture B addressed in every channel file.
- [ ] **D.6** Synthesis ranks channels separately for both postures.
- [ ] **D.7** No bounds violations from §11 (no illegal recommendations, no underage targeting, no KYC evasion, no fake reviews).
- [ ] **D.8** No claim cites `combined_context.md`, `research_directive.md`, or any schema file as evidence.
- [ ] **D.9** Audit log timestamped after last channel file write.

---

## Section E — Notes for the Operator

- This slice deliberately stops short of full mission scope per the user's narrowed brief. Other slices (forums, influencers, in-person, etc.) remain to be executed in subsequent runs.
- The vendor universe used here is the directive's anchor list. A separate "vendor universe convergence" pass per `research_directive.md` §7.2 was not performed in this slice; coverage report flags this as a known limitation.
- Posture-reference vendors named in `combined_context.md` §1.5 (Hunter Eyes Labs, Jester Labs, etc.) may be operator brand-name brainstorms rather than real vendors — subagents are instructed to verify and report.
- "Inferred" channel-effectiveness claims must be triangulated across ≥2 vendors per §A.3.
