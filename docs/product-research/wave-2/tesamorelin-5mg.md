---
locked_exclusion: true
iron_law: 2.7
reason: "FDA approved-drug analog (Egrifta, TH9507 — Theratechnologies). Compounding sales under DOJ enforcement priority."
locked_at: 2026-05-20
locked_at_sha: 2de7c04c
removed_from_catalog: v5.0.0
operator_override_doc: docs/DECISIONS/locked_override_2026-05-20.md
---

> **LOCKED EXCLUSION — DO NOT SHIP**
>
> This compound is on the Iron Law 2.7 perpetual carve-out list (extended via Iron Law 2.29 in v5.0).
> Research documentation retained for analytical context only.
> Source SKU was removed from catalog in v5.0.0 (per `docs/DECISIONS/locked_override_2026-05-20.md`).
>
> **Iron Law 2.29 short-code obfuscation guard:** This document MUST NOT introduce the compound by a shortened nickname (`Reta`, `Tirz`, `Sema`, etc.) or as a constituent of a multi-compound blend marketed under a different name. Future audits will flag any such introduction as a CRITICAL bypass.
>
> **To override:** Commit `docs/DECISIONS/iron_law_2_7_override_<YYYY-MM-DD>.md` with legal opinion attached and per-SKU justification. The override must be operator-signed and reference this banner.

---

# Tesamorelin 5mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'tesamorelin-5mg',
  sku: 'TESAMORELIN-5MG',
  name: 'Tesamorelin, 5mg vial',
  shortName: 'Tesamorelin',
  dose: '5mg',
  format: 'vial',
  listPriceCents: 6900,
  perMgCents: 1380,
  category: 'gh-axis',
  role: 'catalog-filler',
  position:
    'operator-requested premium 5mg price; above captured Tesamorelin p75 and matching Raw Amino 5mg',
  shortDescription:
    'Synthetic GHRH analog also identified as TH9507, supplied as a 5mg lyophilized research vial. Reference material for controlled GH-axis pathway and analytical workflows.',
}
```

## Long Description

Tesamorelin is a synthetic analog of growth-hormone-releasing hormone (GHRH), also identified in the corpus by the synonym TH9507. This proposed 5mg vial should be presented as a lyophilized research reference for controlled laboratory and analytical workflows, not as a therapeutic, wellness, or compounding product.

The strongest compliant framing is compound identity and GH-axis taxonomy. Raw product pages connect Tesamorelin with GHRH-analog classification and place it near Sermorelin, CJC-1295, and Ipamorelin in catalog structures. Those relationships support `gh-axis` navigation, but they should not be converted into stack instructions or outcome-oriented copy for researchers.

Research context should stay high-level: GHRH receptor pathway mapping, somatotroph signaling models, cAMP-pathway assay design, and GH/IGF-axis analytical comparison. The corpus contains broader clinical and body-composition language, but the proposed page should not reproduce those claims. A controlled research register is especially important because Tesamorelin carries elevated approved-drug comparison sensitivity.

The 5mg presentation is directly supported by raw-fetch pages from Raw Amino, Pure Peptide Labs, Arcane Peptides, and Next Age Peptides. Suitable product-page quality language can mention lyophilized powder, vial format, lot-specific COA display, HPLC, mass spectrometry, purity testing, and batch identity only where the operator has matching documentation for the actual lot and can keep that documentation visible at purchase.

At $69.00, this SKU prices at $13.80 per mg, above the captured Tesamorelin 75th percentile and near the high end of the corpus distribution. The price matches a direct Raw Amino 5mg listing, so the position should be described as an operator-requested premium research format rather than a market-leader or loss-leader offer.

This material should be described strictly for controlled laboratory, in vitro, and analytical research use by qualified purchasers in non-clinical settings. It is not a drug, dietary supplement, cosmetic, or compounding article, and it is not for human or veterinary use, clinical administration, diagnostic use, therapeutic application, ingestion, injection, or bodily introduction of any kind.

## Category And Role Rationale

Category: `gh-axis`. Tesamorelin is described in the consulted corpus as a GHRH analog and is merchandised near GH-axis research compounds. The existing category union has no separate endocrine category, and `metabolic` would overemphasize high-risk outcome themes found in vendor copy.

Role: `catalog-filler`. The product has meaningful market presence, but the existing catalog header explicitly excluded Tesamorelin from the safer v1.3 expansion set because of FDA-approved-drug comparison risk. If included despite that posture, it should not be promoted as a loss leader or flagship volume driver before legal review and source-side COA terms are locked.

Price posture: $69.00 is a premium 5mg price. `sku_distributions.md` reports a Tesamorelin median of $7.77/mg and p75 of $10.4248/mg, while this proposal is $13.80/mg. Raw Amino provides exact $69 support for a 5mg/10mg variant page, but the price should be framed as an operator override.

## Corpus Search Notes

- Required site files read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Targeted searches used `tesamorelin`, `TSM`, and `TESA-M` across `/root/peptide-launch-bundle/corpus`.
- Priority search found Tesamorelin matches in `02_claude_code_outputs`, especially `sku_distributions.md`, `pricing_matrix.csv`, discovery logs, and vendor evidence files.
- No Tesamorelin, TSM, or TESA-M matches were found in `01_strategic_frame`, `04_synthesis`, `DECISIONS`, or `03_final`.
- No matching Tesamorelin-specific directories were found under the corpus.
- Raw-fetch discovery returned many 10mg, 20mg, blend, catalog, and clinic/therapy pages. The five raw files consulted in full were selected for direct 5mg support, RUO posture, or product-specific risk signal.
- Corpus concern: Raw Amino and Next Age include human-adjacent, clinical, body-composition, liver, cardiovascular, cognitive, and wellness language that should not be reused. The existing catalog notes also name Tesamorelin as excluded from prior safe expansion logic.
- Corpus concern: Finnrick's HXNet Tesamorelin page reports inconsistent tested quantities for one vendor, including 5mg samples. This is not a claim about all Tesamorelin supply, but it reinforces the need for lot-specific COA and batch identity before listing.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__tesamorelin.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/pure-peptide-labs/product_010__tesamorelin.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/arcane-peptides/product_24__tesamorelin.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/next-age-peptides/product_12__tesamorelin-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/hxnet/finnrick_tesamorelin.md`

## Omitted Unsupported Or High-Risk Claims

- No claims about fat loss, visceral fat, liver fat, cholesterol, LDL, cardiovascular health, muscle mass, cognitive function, workout recovery, vitality, longevity, or wellness outcomes.
- No HIV, lipodystrophy, disease, diagnostic, clinical-trial, treatment-response, therapeutic, or approved-drug comparison language.
- No dosing, route, injection, reconstitution volume, protocol, cycle, stack, or administration guidance.
- No generic claim of 99% purity, sterility, manufacture standard, compounding suitability, or pharmaceutical-grade status without actual batch documentation.
- No use of obfuscated storefront names such as TSM or TESA-M in customer-facing canonical copy.
- No claim that the $69 price is competitive; it is a premium operator-requested position.

## Thin-Corpus Note

The corpus is not thin for SKU existence: direct raw fetches and search hits support Tesamorelin 5mg vial availability, lyophilized format, and a $69 comparator. It is thin for compliant long-form claims because there is no Tesamorelin-specific support in the strategic, synthesis, decision, or final directories, and many raw pages rely on clinical or human-outcome language. Final copy should therefore remain limited to identity, format, GH-axis research taxonomy, batch-documentation posture, and strict RUO restrictions.
