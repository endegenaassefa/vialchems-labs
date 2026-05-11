# Semax 10mg Product Research

## Proposed Product Object

```ts
{
  slug: 'semax-10mg',
  sku: 'SEMAX-10MG',
  name: 'Semax, 10mg vial',
  shortName: 'Semax',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 4900,
  perMgCents: 490,
  category: 'nootropic',
  role: 'catalog-filler',
  position: 'above market median, below 75th percentile',
  shortDescription:
    'Synthetic heptapeptide derived from ACTH (4-10), supplied as a 10mg lyophilized research vial. Studied in Russian-published cell-culture and animal-model literature on neuropeptide signaling and neurotrophic-marker pathways.',
}
```

## Long Description

Semax is a synthetic heptapeptide with sequence Met-Glu-His-Phe-Pro-Gly-Pro, commonly described as an ACTH (4-10)-derived neuropeptide with a Pro-Gly-Pro extension. This 10mg vial is positioned as a lyophilized research reference for non-clinical laboratories evaluating Semax identity, handling characteristics, and pathway-context literature.

Within the corpus, Semax appears across vial and nasal SKU formats, with direct 10mg product pages documenting lyophilized powder presentation, sequence, molecular formula, and COA or third-party testing postures. The catalog should use those concrete attributes as its copy base: peptide identity, vial quantity, format, analytical documentation, and research-use-only limitations.

The mechanistic context should remain high-level. Existing product descriptions and raw product pages support references to Russian-published cell-culture and animal-model literature on neuropeptide signaling, neurotrophic-marker expression such as BDNF and NGF, serotonergic and dopaminergic pathway investigation, and ACTH-fragment analog research. Those markers should be presented as research topics, not outcomes or product benefits.

The 10mg presentation gives the catalog a smaller Semax vial than the existing 30mg SKU. Aggregate market data records 78 vendors carrying Semax, 99 SKU rows, and both vial and nasal formats, so a 10mg vial is a common dose-size signal in the captured vendor universe. At $49.00, it should be positioned as a catalog-completion format rather than a price-led flagship.

Analytical copy can mention quality posture only where the storefront has matching batch support: lyophilized powder, sequence confirmation, stated purity when available, COA availability, test-date visibility, and lot-specific testing language. It should not echo vendor marketing around clinical investigations or customer-facing benefits. The safer frame is reference-material inventory for qualified research purchasers.

This material should be described strictly for laboratory research, analytical comparison, and non-clinical peptide handling. Do not include route language, reconstitution instructions, study exposure amounts, disease terms, cognition or mood promises, or clinical translation language. Final commerce copy should stay concise and verifiable: synthetic heptapeptide, ACTH-fragment derivation, 10mg lyophilized vial, relevant research pathways, COA-oriented quality posture when available, and RUO-only restrictions.

## Short Description

Synthetic heptapeptide derived from ACTH (4-10), supplied as a 10mg lyophilized research vial. Studied in Russian-published cell-culture and animal-model literature on neuropeptide signaling and neurotrophic-marker pathways.

## Category And Role Rationale

Semax belongs in `nootropic` because the existing catalog places Semax in that category, and the corpus consistently positions it among neuropeptide or nootropic research compounds. The safer catalog rationale is pathway and research-context classification, not a consumer-facing cognition claim.

The proposed role is `catalog-filler`. The aggregate Semax distribution reports 78 vendors carrying Semax, a $3.00 per-mg 25th percentile, a $4.00 median, and a $5.90 75th percentile. At $49 for 10mg, this SKU lands at $4.90 per mg, above the captured median and below the 75th percentile. That price does not fit the opening-set rubric for loss-leaders or volume drivers, but it does add a common smaller vial format alongside the existing 30mg Semax SKU.

## Corpus Notes

The required grep workflow was run with `grep -ril "Semax" /root/peptide-launch-bundle/corpus`. No Semax-named directories were found. Semax matches were present in aggregate 02 outputs, one 01 strategic-frame file, many 03 raw-fetch vendor directories, and root/input prompt files. No Semax matches were found in `04_synthesis`, `DECISIONS`, or `03_final`.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/research_operations_playbook.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/next-generation-compounds/product_12__semax-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/pepsynth-labs/product_4__semax-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paramount-peptides/product_13__semax-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_9__semax-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_010__semax-10mg.md`

## Omitted Unsupported Claims

- Vendor claims or article sections implying direct nootropic, cognitive, mood, anxiety, neuroprotective, vascular, immune, or clinical benefit were omitted from proposed catalog copy.
- Clinical-outcome, disease-model, route-specific, exposure-amount, and reconstitution language was omitted.
- Blood-brain-barrier, enzyme-inhibition, neurotransmitter-release, and long-term behavioral-effect language was not promoted because the worker artifact did not independently validate those claims outside vendor pages.
- Consumer phrases such as "buy Semax," "wellness," "focus," and related benefit framing were omitted.
- The Paramount raw file path includes `semax-10mg`, but the page body captured Semax 30mg. It was used only for identity, sequence, quality-document, and RUO-positioning context, not as support for 10mg pricing.

## Thin-Corpus Note

The corpus is not thin for market availability or price positioning: `sku_distributions.md` provides a full Semax distribution across 78 vendors and 99 SKU rows, and five raw-fetch files were read for exact 10mg or closely related Semax product-page context. It is thin for independent scientific substantiation because Semax-specific matches were absent from `04_synthesis`, `DECISIONS`, and `03_final`, and the raw research-detail pages are vendor-controlled. Product copy should therefore stay close to structure, format, RUO status, and high-level research-pathway context.
