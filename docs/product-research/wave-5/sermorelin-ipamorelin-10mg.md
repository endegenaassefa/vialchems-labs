# Sermorelin + Ipamorelin Blend 10mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'sermorelin-ipamorelin-10mg',
  sku: 'SERMORELIN-IPAMORELIN-10MG',
  name: 'Sermorelin + Ipamorelin Blend, 10mg vial',
  shortName: 'Sermorelin + Ipamorelin',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 8900,
  perMgCents: 890,
  category: 'gh-axis',
  role: 'catalog-filler',
  position:
    'operator-requested premium 10mg blend; above exact $59.99 comparator and adjacent $80-$87 related blend signals',
  shortDescription:
    'Combined-vial GH-axis research blend containing Sermorelin and Ipamorelin at 5mg each. Reference material for GHRH/GHSR pathway taxonomy, component identity, and analytical separation workflows.',
}
```

## Long Description

Sermorelin + Ipamorelin Blend 10mg is positioned as a GH-axis research vial pairing two established catalog identities: Sermorelin, a synthetic GHRH 1-29 analog, and Ipamorelin, a selective pentapeptide growth-hormone-secretagogue receptor reference. The strongest exact corpus hit is a 5mg + 5mg, 10mg blend page, with adjacent blend listings also appearing on Sermorelin product pages. Both standalone components already sit naturally in the GH-axis category, so the blend extends an existing catalog lane rather than creating a new one.

Sermorelin provides the GHRH-receptor side of the blend. Brand and raw corpus pages consistently describe it as GRF 1-29 or the first 29 amino acids of human growth-hormone-releasing hormone, with a 3357.9 g/mol molecular weight. For catalog copy, that supports framing Sermorelin around receptor-pathway, pituitary-cell, and identity-confirmation workflows.

Ipamorelin provides the GHSR-1a side. Vendor pages describe it as a synthetic pentapeptide with ghrelin-receptor binding interest, 711.9 g/mol molecular weight, and comparatively selective secretagogue positioning versus older GHRPs. That supports role language centered on GHSR-1a signaling, somatotroph assay context, and analytical comparison without adding unsupported comparative claims.

The combination should be described as a convenience blend for dual-arm GH-axis research rather than as a better-performing stack. It gives the product family a format that sits between standalone Sermorelin, standalone Ipamorelin, and existing CJC/Ipamorelin-style merchandising, while preserving a clean research-use boundary.

Quality copy should stay batch-document driven. The exact OROS blend page shows lyophilized format, 3ml vial size, RUO positioning, and COA-heavy presentation, but those vendor-specific lot, purity, endotoxin, heavy-metal, and microbial claims should not be imported unless this SKU has matching documentation. Safe default claims are identity, amount, format, and intended research-only status.

At $89, the product is premium relative to the exact $59.99 comparator and slightly above related blend signals around $80-$87. The price can be defended as an operator-selected catalog-completion SKU for researchers who want both component identities in one 10mg vial, not as a discount or performance-led offer.

## Rationale

The existing catalog already carries GH-axis standalone products for Ipamorelin and Sermorelin. A combined 10mg vial is therefore a range-completion SKU, not a required anchor for the category. The exact OROS product page supports the 5mg Sermorelin + 5mg Ipamorelin blend format, and Raw Amino/Core Peptides related-product blocks show adjacent marketplace recognition for Sermorelin/Ipamorelin blend merchandising.

The requested $89 price equals $8.90/mg. That is above the exact $59.99 OROS comparator and above Core Peptides' $80 related-product signal, while sitting close to Raw Amino's $87 related-product signal. That supports `catalog-filler` rather than `volume-driver`: the listing can complete the GH-axis range, but it should not be framed as price-led.

## Search Notes

I used the corpus workflow documents first, then searched the local corpus with the requested terms and close variants: `Sermorelin`, `Ipamorelin`, `Sermorelin Ipamorelin`, `Sermorelin + Ipamorelin`, `Sermorelin/Ipamorelin`, `blend`, `GH-axis`, `GH axis`, and `growth hormone axis`.

Brand-authored and decision files carried the highest-weight internal signal. The opening SKU recommendation and locked opening SKU decision strongly support standalone Ipamorelin as a GH-axis volume driver, while compliance and source-terms decisions constrain public copy to RUO, identity, analytical, and batch-document language. The synthesis files in `04_synthesis` were present but did not add usable product-specific evidence.

The raw-fetch set was selected for exact blend relevance first, then component-role support. Only one direct exact 10mg Sermorelin/Ipamorelin product page surfaced in the opened raw set, so the remaining raw pages were used for component identity, price-adjacent related-product signals, and GH-axis language boundaries.

## Sources

- `lib/content/products.ts`
- `lib/content/product-descriptions.ts`
- `SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/README.md`
- `/root/peptide-launch-bundle/corpus/NAVIGATION_GUIDE.md`
- `/root/peptide-launch-bundle/corpus/tools/SUBAGENT_BRIEF.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/oros-research/product_31__sermorelin-5mg-ipamorelin-5mg-10mg-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__sermorelin.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__ipamorelin.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/core-peptides/product_06__sermorelin-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_006__ipamorelin-10mg.md`

## Omitted Claims

- No dosing, reconstitution, route, exposure amount, timing, schedule, or protocol language.
- No human-use, veterinary-use, clinical, treatment, wellness, anti-aging, sleep, body-composition, muscle, recovery, metabolic, appetite, lipolysis, or therapeutic claims.
- No synergy, amplification, superior-result, or combined-effect framing, even where competitor pages use stronger stack language.
- No borrowed vendor-specific purity, cGMP, ISO, facility, shipping, shelf-life, storage, sterility, endotoxin, heavy-metal, microbial, or batch claims unless verified against the operator's own lot documentation.

## Thin-Corpus Note

Direct Sermorelin + Ipamorelin 10mg blend evidence is thin. The corpus has one strong exact raw page and two useful related-product signals, but not enough direct competitor depth to treat the requested $89 price as market-normal. The SKU is best justified as a premium catalog-completion blend with conservative GH-axis taxonomy copy.
