# CJC-1295 + Ipamorelin Blend 10mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'cjc-1295-ipamorelin-10mg',
  sku: 'CJC-1295-IPAMORELIN-10MG',
  name: 'CJC-1295 + Ipamorelin Blend, 10mg vial',
  shortName: 'CJC-1295 + Ipamorelin',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 9900,
  perMgCents: 990,
  category: 'gh-axis',
  role: 'catalog-filler',
  position:
    'operator-requested premium 10mg blend; above thin captured blend benchmark and direct 5mg/5mg comparators',
  shortDescription:
    'Combined-vial GH-axis research blend containing CJC-1295 No DAC and Ipamorelin at 5mg each. Reference material for dual-component identity, GHRH/GHSR pathway taxonomy, and analytical separation workflows.',
}
```

## Long Description

CJC-1295 + Ipamorelin Blend 10mg is a combined-vial research material for GH-axis catalog work, identity confirmation, and comparative component analysis. The proposed format places CJC-1295 No DAC and Ipamorelin in a single lyophilized vial at a 5mg/5mg composition, matching the most common 10mg blend structure found in the corpus.

CJC-1295 No DAC supplies the GHRH-analog side of the blend. In the existing catalog and raw source set, this material is tied to Modified GRF 1-29 nomenclature and separated from DAC-containing CJC-1295 by the absence of the albumin-affinity extension. That distinction is central to clean product taxonomy.

Ipamorelin supplies the GHSR/ghrelin-receptor class side of the blend. It is described across the corpus as a synthetic pentapeptide in the GH-axis research lane. In this listing, Ipamorelin is framed as a second identifiable component with its own sequence-class and receptor-class context.

The combination is positioned around catalog clarity rather than performance language. CJC-1295 No DAC and Ipamorelin are commonly searched and sold together, and the existing brand strategy already treats the pairing as a recognizable GH-axis stack. A combined vial captures that shorthand while keeping the product distinct from standalone CJC-1295 No DAC, standalone Ipamorelin, and multi-item bundles. The product should read as a convenience-format reference for catalog users who already recognize the paired nomenclature, not as a promise of interaction between components.

Because this is a blend, the strongest quality copy focuses on dual-component verification. Suitable static language includes component identity, chromatographic separation, mass-oriented confirmation, lot traceability, and batch-specific COA review when supported by operator documentation. Vendor purity percentages, facility badges, and storage claims stay outside evergreen copy unless confirmed by the actual lot.

At $99.00, the listing is best treated as a premium catalog-completion SKU. It supports GH-axis component-class comparison in a single reference material without adding preparation instructions, route language, timing guidance, physiological outcomes, clinical interpretation, or broader wellness claims. The compliant page posture is RUO identity, defined blend composition, pathway taxonomy, and document-backed analytical transparency.

## Rationale

The existing catalog already carries standalone CJC-1295 No DAC 5mg and Ipamorelin 10mg, plus a GH-axis bundle that pairs them. A combined 10mg vial is therefore not needed to establish the category, but it does cover a repeatedly observed marketplace format and a known customer shorthand around CJC/Ipamorelin blends.

The requested $99 price is high relative to the exact 10mg blend pages opened for this task and the captured blend distribution. That supports `catalog-filler` rather than `volume-driver`: the listing can complete the GH-axis range, but the page should not imply price leadership.

## Search Notes

I searched the local corpus with the requested terms and close variants: `CJC-1295`, `Ipamorelin`, `CJC Ipamorelin`, `blend`, `stack`, `GH-axis`, `CJC-IPA`, `GROW-H`, and `Modified GRF`.

Brand-authored and decision files carried the highest-weight internal signal. The synthesis files in `04_synthesis` were present but effectively placeholders, so the useful strategic signal came from the opening SKU recommendation, opening SKU decision, source terms, compliance posture, and SKU distribution analysis.

The top raw-fetch set was selected for exact combined-vial relevance, direct 10mg or 5mg/5mg composition, and product-page context. Broader blend searches also surfaced BPC-157/TB-500 and unrelated stack language, which was excluded.

## Sources

- `lib/content/products.ts`
- `lib/content/product-descriptions.ts`
- `SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/oros-research/product_30__cjc-1295-ipamorelin-10mg-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/silverstone-labs-co/product_1__cjc-ipa-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/prime-lab-peptides/product_06__grow-h-10mg-cjc-1295-no-dac-ipamorelin.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_24__cjc-1295-ipamorelin-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/oathpeptides/product_22__cjc-1295-ipamorelin-blend.md`

## Omitted Claims

- No dosing, reconstitution, route, exposure amount, timing, schedule, or protocol language.
- No human-use, veterinary-use, clinical, treatment, wellness, anti-aging, recovery, muscle, sleep, body-composition, lipolysis, appetite, metabolic, or therapeutic claims.
- No synergy or amplified-effect framing, even though competitor pages frequently use that language.
- No borrowed vendor-specific purity, cGMP, ISO, facility, shipping, shelf-life, storage, sterility, or batch claims unless verified against the operator's own lot documentation.

## Thin-Corpus Note

Direct CJC-1295 + Ipamorelin 10mg blend evidence is adequate for confirming market format and 5mg/5mg positioning, but thin for pricing confidence. The distribution file captured only a small exact blend sample, while the highest-quality raw pages showed meaningful spread around the requested $99 price.
