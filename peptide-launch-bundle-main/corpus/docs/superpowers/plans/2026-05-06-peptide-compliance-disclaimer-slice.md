# Peptide Compliance / Disclaimer / Legal-Posture Slice — Implementation Plan

> Slice 3 of the Peptide Vendor Intelligence mission. Companion to Slice 2 (acquisition channels) at `docs/superpowers/plans/2026-05-06-peptide-acquisition-slice-search-and-vendor-owned.md`.

## Purpose

Cover deliverables 1–7 from the operator's compliance research directive:

1. Disclaimer language inventory — verbatim text from ≥30 vendors with URL + access date.
2. Pattern analysis — most common, unique, strongest from liability-shield perspective.
3. Site-architecture compliance signals — COA hosting, lab partner disclosure, batch/lot transparency, ID verification, age-gate placement, ToS, refund / shipping policies with jurisdictional exclusions.
4. Marketing-language compliance signals — product descriptions, ad copy, email, social, language patterns avoided.
5. Payment-processor and platform-policy posture — named processors, relationship maintenance, documented failures and migrations.
6. Observed enforcement events — FDA warning letters, processor terminations, domain seizures, platform takedowns with primary sources.
7. Recommended compliance posture for a new entrant.

## Vendor universe (drawn from `03_raw_fetches/discovery_pass_1/surface_aggregators.md` + directive §2.1 anchor list)

40 vendors targeted across 4 disclaimer-capture batches; depth = full compliance schema.

**Batch A — Anchor (10):** peptidesciences.com (defunct, Wayback), biotechpeptides.com, corepeptides.com, purerawz.co, behemothlabz.com, limitlesslifenootropics.com, swisschems.is, peptideguys.com, aminoasylum.shop (raided, Wayback), domestic-supply.com.

**Batch B — Mid-tier US retail (10):** ascensionpeptides.com, lvluphealth.com, peptidology.com, healthgevity.com, genxbio.com, umbrellalabs.com, particlepeptides.com, peptaura.com, chemyo.com, blueskypeptide.com.

**Batch C — PEPPAL secondary tier (10):** paradigm-peptide.com, peptide-partners.com, pivot-labs.com, orbitrex-peptides.com, peptide-tech.com, polarispeptides.com, skyepeptides.com, nusciencepeptides.com, peptidewarehouse.com, researchchemical.com.

**Batch D — Other listed + posture references (10):** nextchems.com, felixchem.is, apollopeptidesciences.com, science.bio (Wayback), provenpeptides.com (Wayback), Hunter Eyes Labs, NZT Peptides, Jester Labs, LARP Labs, Structure Labs.

## Cross-cutting agents (3)

- **Agent 5 — Marketing-language compliance:** product description avoidance patterns, vendor blog / education language, ad copy, email, social copy.
- **Agent 6 — Payment-processor and platform-policy posture:** named payment methods per vendor at checkout, documented processor migrations and failures from forums.
- **Agent 7 — Enforcement events catalog:** FDA warning letters (Umbrella Labs, Prime Peptides, Xcel Peptides, Summit Research, Pinnacle Peptides, SwissChems, Tailor Made Compounding), DOJ actions (Paradigm Peptides guilty plea Dec 2025, Tailor Made), domain seizures, processor terminations, platform takedowns.

## Evidence and anti-cheat rules (binding on every subagent)

Per `00_inputs/research_directive.md` §3 and §6:

- Every non-trivial claim cites verbatim quote + URL + access date + raw artifact path.
- Save every fetched page to `03_raw_fetches/compliance_slice/<vendor-slug>__<page>.md` with YAML front-matter (`url`, `fetched_at`, `fetch_method`, `sha256`).
- `"uncertain"` is a valid value; explain in notes.
- Mark `OBSERVED:` vs `INFERRED:` where ambiguity exists.
- No fabricated URLs, vendor names, prices, or quotes (Rule 1, 13, 14).
- No bypass of anti-bot, captcha, or paywalls (Rule 9). Three-attempt rule per vendor (WebFetch → Wayback Machine → mark `failed`).
- Inputs are not evidence (Rule 24).
- Refusals per §11: no fake therapeutic claims, no underage targeting, no KYC evasion recommendations, no fake reviews, no submission of fake payment / KYC at checkout.

## Output paths

- Per-batch deliverables: `02_claude_code_outputs/compliance_disclaimers/batch_<a-d>__disclaimers.md`
- Per-batch evidence: `02_claude_code_outputs/compliance_disclaimers/evidence/batch_<a-d>.evidence.txt`
- Marketing-language synthesis: `02_claude_code_outputs/compliance_disclaimers/marketing_language_compliance.md`
- Payment-processor posture: `02_claude_code_outputs/compliance_disclaimers/payment_processor_posture.md`
- Enforcement events catalog: `02_claude_code_outputs/compliance_disclaimers/enforcement_events.md`
- Final synthesis (lead agent compiles): `02_claude_code_outputs/compliance_disclaimers/COMPLIANCE_DISCLAIMER_FINDINGS.md`

## Synthesis (lead agent, after subagents return)

- Consolidate batch outputs into single deliverable `COMPLIANCE_DISCLAIMER_FINDINGS.md`.
- Pattern analysis (deliverable 2): word-level comparison of disclaimer formulations across batches.
- Recommended posture for new entrant (deliverable 7): drawing on strongest patterns observed; refusing tactics that cross into clear illegality.
- Self-audit gate per directive §10 before declaring slice complete.

## Known limitations (flagged up front)

- Several "posture reference" vendors (Hunter Eyes Labs, Jester Labs, etc.) named in `combined_context.md` §1.5 may be operator brand-name brainstorms, not real public vendors. Subagents instructed to verify and report.
- No checkout-walk via real Chromium in this slice — checkout-flow data is captured at the surface level (what the vendor's checkout description page says), not by adding-to-cart and walking through a stealth-browser. Operator can dispatch a follow-up `gstack:browse` slice if needed.
- A formal full-universe convergence pass per directive §7.2 was not done in this slice; the universe is the 40-vendor subset described above plus whatever subagents surface during research. Coverage report flags this as a known limitation.
