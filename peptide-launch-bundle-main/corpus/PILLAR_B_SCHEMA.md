# Pillar B Schema (per-channel customer-acquisition profile)

This schema defines how every customer-acquisition channel in the
taxonomy from `research_directive.md` §2.2 is captured. The schema is
**dual-track**: every field is filled twice, once for **Posture A
(Clean Clinical Labs)** and once for **Posture B (Meme-Coded
Community)**, where the channel applies differently to those postures.

Files live at:

- `02_claude_code_outputs/acquisition_channels/<channel-slug>.md` —
  one Markdown file per channel.
- `02_claude_code_outputs/acquisition_synthesis.md` — the cross-channel
  ranked recommendation (single file, two sections).

## File format: per-channel Markdown

The per-channel file follows this exact structure. Section headers are
fixed; do not rename them.

```markdown
---
channel_slug: <kebab-case>
channel_name: <human readable>
channel_category: search | social | forum | community | influencer | email | content | adjacent_paid | wom | inperson | indirect
captured_at: <ISO 8601>
captured_by: <agent identifier>
evidence_file: acquisition_channels/<channel-slug>.evidence.txt
---

# <Channel name>

## How the channel works for this category

<2–6 paragraphs describing the channel-specific mechanics for the
research-peptide vertical. Cite at least 3 evidence entries from this
channel's evidence file. Distinguish observation from inference.>

## Named vendor examples

A table with one row per observed vendor using this channel. Required
columns:

| vendor_slug | brand_name | usage_pattern_excerpt | url | evidence_entry_id |
|-------------|------------|------------------------|-----|--------------------|

`usage_pattern_excerpt` is a verbatim ≤200-char quote describing or
demonstrating the vendor's usage of the channel.

## Cost structure for a new entrant

<List of cost components with estimated ranges. Where a range is given,
cite the source. Mark "uncertain" any component you cannot ground.>

- Setup cost: <$ range or "uncertain", with reason>
- Monthly recurring: <$ range or "uncertain">
- Per-unit (e.g. CPM, CPC, per-post): <$ range or "uncertain">
- Time investment: <hours/week range or "uncertain">

## Time horizon to traction

<Estimated time from a brand-new throwaway-brand vendor going live on
this channel to first measurable traction (sale attributable, organic
mention, follower threshold). Cite the basis.>

- Lower bound: <weeks/months>
- Median expectation: <weeks/months>
- Upper bound: <weeks/months>
- Basis: <named vendors observed at each point in this curve>

## Risk profile

Rate each risk dimension as **low / moderate / high / critical** with
a one-sentence justification anchored to evidence:

- Platform-policy risk (account ban, post takedown):
- Regulatory risk (FDA / FTC / state AG attention):
- Reputational risk (community blowback, doxxing):
- Capital-loss risk (sunk cost with no return):

## Posture-specific fit

### Posture A — Clean Clinical Labs

- **Recommendation:** pursue | defer | avoid
- **Reasoning:** <2–4 sentences with cited evidence>
- **Specific creative/copy adjustments required:** <list>
- **Specific vendors to study as references:** <slugs>

### Posture B — Meme-Coded Community

- **Recommendation:** pursue | defer | avoid
- **Reasoning:** <2–4 sentences with cited evidence>
- **Specific creative/copy adjustments required:** <list>
- **Specific vendors to study as references:** <slugs>

## Cross-references to vendor profiles

For every vendor named in the "Named vendor examples" table, cite the
corresponding profile JSON section. This makes vendor-channel
relationships round-trip-checkable.

- `vendors/<slug>.json` § <field path that documents this channel
  usage> → e.g., `content_footprint`, `social_proof.off_site_aggregators`,
  `tech_stack.marketing_pixels_present`.

## Channel-specific data captured

<Channel-dependent. Examples:>

- For SEO: ranking keywords observed, content depth indicators,
  schema markup, domain authority signals (cite source).
- For Reddit: subreddit member counts, weekly active post volume,
  source-list pin status, vendor-flair availability, AMA frequency.
- For YouTube: channel subscriber tiers observed, sponsorship
  disclosure rate, content format taxonomy, watch-time signals where
  visible.
- For email: lead-magnet patterns observed, ESP signal (DKIM /
  Return-Path), welcome-sequence captures.
- For Telegram/Discord: channel sizes, message frequency,
  promo-channel architecture.
- For affiliate: commission rate ranges where disclosed, cookie-
  duration patterns, recruitment funnel.
- For FTC disclosure: how observed creators handle disclosure
  (#ad / #sponsored / silence), with named examples.

## Uncertainty notes

<List every field marked "uncertain" with the reason. List every
inference made and the supporting quote count.>
```

## Evidence file: `acquisition_channels/<channel-slug>.evidence.txt`

Same format as `evidence/<slug>.txt` for vendor profiles (per
`research_directive.md` §6). Every quote in the per-channel Markdown
file traces back to an entry here. Every entry's `[QUOTE]` block grep-
matches its `[RAW_ARTIFACT]`.

## Cross-channel synthesis: `acquisition_synthesis.md`

Single file. Two sections, parallel structure.

```markdown
---
generated_at: <ISO 8601>
based_on_channels: <count>
based_on_vendor_profiles: <count>
---

# Customer Acquisition Synthesis

## Posture A — Clean Clinical Labs: top 3–5 channels

For each of the 3–5 ranked channels:

### Rank N: <channel_name>

- **Why this channel for Posture A:** <reasoning, cited>
- **Expected first-traction window:** <range, cited>
- **Capital required for a meaningful test:** <$ range>
- **Vendors to copy from:** <list of slugs>
- **Tactical playbook for the operator's first 30 days:** <bulleted
  steps, each cited to a vendor's observed practice>
- **What kills this channel for the operator:** <named risks>

## Posture B — Meme-Coded Community: top 3–5 channels

[Same structure, posture B framing.]

## Channels deferred or avoided

For each channel **not** in the top 5 for either posture, a one-line
"why not" with citation.

## Cross-cutting findings

- Channels that work for both postures (rare).
- Channels where the postures diverge sharply.
- Channels where evidence is too thin to recommend either way (and
  what additional research would close the gap).
```

## Coverage requirements

The full Pillar B taxonomy (15 channels in `research_directive.md`
§2.2) must be covered. A channel cannot be skipped because it
"obviously doesn't apply." If a channel doesn't apply, the per-channel
file still exists, with sections explaining why and one cited piece of
evidence supporting the non-applicability.

For each channel, **at minimum 3 named vendors** must be cited as
examples, OR the channel's per-channel file documents the absence as
itself a finding (e.g., "no vendor in the universe was observed
running paid Google Ads on category terms; see Mandate B Findings").

## Quality requirements

Every paragraph in any Pillar B file cites ≥1 evidence entry. Every
table row has an `evidence_entry_id`. The 5-gram overlap rule (Rule
15) applies across `usage_pattern_excerpt` columns: vendor usage
descriptions must be unique per vendor, not boilerplate.
