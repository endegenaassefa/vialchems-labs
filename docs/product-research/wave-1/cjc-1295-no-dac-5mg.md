# CJC-1295 No DAC 5mg

## Proposed Product Object

```ts
{
  slug: 'cjc-1295-no-dac-5mg',
  sku: 'CJC-1295-NO-DAC-5MG',
  name: 'CJC-1295 No DAC, 5mg vial',
  shortName: 'CJC-1295 No DAC',
  dose: '5mg',
  format: 'vial',
  listPriceCents: 7900,
  perMgCents: 1580,
  category: 'gh-axis',
  role: 'volume-driver',
  position: 'operator-specified premium research SKU',
  shortDescription:
    'Synthetic GHRH analog also identified as Modified GRF 1-29, supplied without Drug Affinity Complex. Research reference for short-acting GH-axis and pulsatile-secretion model work.',
}
```

## Long Description

CJC-1295 No DAC is a synthetic GHRH analog identified across the corpus as Modified GRF 1-29, Mod GRF 1-29, tetrasubstituted GRF 1-29, and CJC-1295 without Drug Affinity Complex. The no-DAC designation matters: consulted product pages distinguish this reference material from DAC-modified CJC-1295 by the absence of the albumin-affinity extension used for longer exposure.

For catalog placement, the molecule belongs in the GH-axis group rather than recovery, nootropic, metabolic, cosmetic-pathway, or immune categories. Vendor pages describe it as a lyophilized peptide supplied for in vitro or laboratory research contexts, with the central research frame focused on GHRH receptor signaling, anterior-pituitary pathway models, and GH/IGF-1 axis observation.

The useful commercial distinction is not broad performance language. It is the short-acting, pulse-oriented research profile. Genoscience and Thrive both frame the no-DAC material as a short-acting GHRH analog used to model pulsatile GH-axis behavior, while NuScience describes the structural absence of DAC as the feature that separates it from the longer-acting DAC-inclusive variant.

That makes the SKU a natural companion to Ipamorelin in catalog architecture, while the description should stay on the compound itself. The opening SKU decision file classifies CJC-1295 No DAC 5mg as a volume-driver because it rounds out the GH-axis lane and supports the CJC/Ipamorelin stack pattern already reflected in the existing bundle logic.

The 5mg vial format is directly attested in the consulted raw corpus. Raw Amino, NuScience, Genoscience, and Thrive each show a no-DAC or Mod GRF 1-29 product page at the 5mg size or title level, and the corpus repeatedly presents lyophilized powder as the expected format. Purity and batch-testing claims vary by vendor and should remain lot-specific rather than generic.

This proposed listing should therefore use precise RUO language: a Modified GRF 1-29 research reference for short-acting GHRH analog studies, supplied as a lyophilized 5mg vial, without claims about administration, outcomes, body composition, sleep, muscle, or other non-catalog endpoints. Qualification, COA display, and batch identity should carry the trust signal instead of unsupported biological promises.

## Short Description

Synthetic GHRH analog also identified as Modified GRF 1-29, supplied without Drug Affinity Complex. Research reference for short-acting GH-axis and pulsatile-secretion model work.

## Category And Role Rationale

- Category: `gh-axis`. The corpus consistently frames CJC-1295 No DAC as a GHRH analog, Modified GRF 1-29, and GH/IGF-axis research reference. This matches the existing catalog category for GH-axis peptides.
- Role: `volume-driver`. The locked opening SKU decision and opening SKU recommendation classify CJC-1295 No DAC 5mg as a volume driver because it pairs structurally with Ipamorelin and completes the GH-axis stack lane.
- Price posture: $79.00 is an operator-specified override. The corpus-locked default was $25.00, so the proposed `position` should not claim p25 or median competitiveness unless the pricing matrix is rerun for the new strategy.

## Corpus Workflow Notes

- `grep -ril "CJC-1295" /root/peptide-launch-bundle/corpus` returned broad matches across 02 outputs, DECISIONS, and raw fetches.
- `grep -ril "CJC-1295 No DAC" /root/peptide-launch-bundle/corpus` returned direct product-page matches and vendor/evidence outputs.
- `grep -ril "Modified GRF" /root/peptide-launch-bundle/corpus` returned a smaller set of direct synonym matches.
- `grep -ril "DAC:GRF" /root/peptide-launch-bundle/corpus` returned no matches.
- Matching directory discovery for CJC, Modified GRF, and DAC/GRF naming returned no term-specific directories.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/research_operations_playbook.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/genoscience/product_11__cjc-1295-no-dac-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__cjc1295-no-dac.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/nuscience-peptides/product_13__cjc1295-nodac.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bulk-peptide-supply/product_14__cjc1295-nodac.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/thrive-peptides/product_12__cjc-1295-no-dac-5mg.md`

## Omitted Unsupported Claims

- Omitted muscle, fat, sleep, immune, skeletal, and body-composition claims from vendor copy because they are broad biological or outcome-oriented claims and not needed for a compliant product listing.
- Omitted claims about lean mass, strength, appetite, or sleep quality because they move beyond neutral RUO catalog language.
- Omitted cardiac, gastrointestinal, thyroid, and side-effect discussion because those sections are not appropriate for commercial product copy and are not required to describe the SKU.
- Omitted vendor-specific purity, tested-weight, and batch results from the generic object because those should be supplied by the actual lot COA.
- Omitted reconstitution, administration, and protocol guidance.
- Omitted any prevent, treat, cure, diagnostic, disease, or medical-condition language.

## Thin-Corpus Note

The corpus is sufficient for naming, synonym mapping, 5mg vial format, lyophilized-powder format, GH-axis category placement, no-DAC versus DAC distinction, RUO posture, and volume-driver rationale. It is thin for broader mechanistic or outcome claims because no 04_synthesis or 03_final match was present, and the strongest product-level support came from vendor raw fetches rather than a dedicated synthesis file.
