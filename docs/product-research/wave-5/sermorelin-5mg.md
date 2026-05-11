# Sermorelin 5mg Product Research

## Proposed Product fields

```ts
{
  slug: 'sermorelin-5mg',
  sku: 'SERMORELIN-5MG',
  name: 'Sermorelin, 5mg vial',
  shortName: 'Sermorelin',
  dose: '5mg',
  format: 'vial',
  listPriceCents: 5900,
  perMgCents: 1180,
  category: 'gh-axis',
  role: 'catalog-filler',
  position:
    'operator-requested 5mg price; above captured Sermorelin p75 and below highest captured 5mg comparator',
  shortDescription:
    'Synthetic GHRH (1-29) / GRF 1-29 peptide supplied as a 5mg lyophilized research vial. Reference material for peptide identity, GHRH receptor-family taxonomy, HPLC/LC-MS, and analytical workflow contexts.',
}
```

## Proposed long description

Sermorelin is a synthetic 29-amino-acid peptide corresponding to GHRH (1-29), also captured in the corpus as GRF 1-29. This proposed 5mg vial should be presented as a lyophilized research reference for compound identity, receptor-family taxonomy, and analytical workflows rather than as an outcome-oriented endocrine product.

The strongest static identity anchors are the canonical name, GHRH 1-29 / GRF 1-29 synonym support, 29-amino-acid N-terminal fragment language, formula C149H246N44O42S, molecular weight near 3358 Da, and CAS 86168-78-7. Final salt form, counterion, purity, fill verification, and release specifications should defer to operator batch documentation.

Research context should stay at structural and analytical level. Suitable public copy can mention GHRH receptor-family sequence comparison, peptide-identity confirmation, LC-MS or mass-spec analysis, HPLC purity review, chromatographic behavior, immunoaffinity enrichment method development, and stability profiling under controlled laboratory conditions.

Direct raw pages support a 5mg vial presentation from Core Peptides, BioEdge Research Labs, Eternal Peptides, Edge Peptides, and Prime Lab Peptides. Those pages also show common quality-document patterns: COA access, batch or lot tracking, HPLC, mass-spectrometry references, third-party testing language, and lyophilized powder presentation.

Because these pages mix stable catalog facts with claims that are not reusable, the final product page should treat vendor material as source evidence for format and documentation only, not as a template for science copy.

At $59.00, this SKU prices at $11.80 per mg. The captured Sermorelin distribution reports a $8.00 median, $10.50 75th percentile, and $19.798 high. The requested price is therefore a premium catalog-completion position, not a market-low or loss-leader offer.

The final listing should remain sparse: canonical name, 5mg vial size, lyophilized format, search-supported synonyms, batch-visible analytical fields, and strict research-only context. Search metadata can carry alternate naming without expanding the public claim surface. Avoid preparation guidance, route language, exposure amounts, subject outcomes, medical framing, age-related language, and pathway-to-benefit translation.

## Rationale

- Category: `gh-axis`. Existing catalog architecture already places Sermorelin 2mg in this category, and corpus nomenclature consistently ties Sermorelin to GHRH (1-29) / GRF 1-29 identity.
- Role: `catalog-filler`. The site already has a Sermorelin 2mg volume-driver listing; the requested 5mg format is useful for catalog breadth but should not be price-led.
- Price posture: $59 equals $11.80/mg, above the captured $10.50 p75 for Sermorelin and below the $19.798 high. The position should be documented as an operator-requested premium 5mg format.
- Quality posture: vendor pages support COA, HPLC, mass-spec, and batch-language patterns, but actual purity, sterility, lab, test date, and source claims must remain batch-specific because `source_terms.md` is still pending.

## Search notes

- Required local files read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Targeted corpus searches used `Sermorelin`, `GHRH 1-29`, `GHRH (1-29)`, `GRF 1-29`, and `GRF1-29`.
- Searched authorized decision/output folders before raw fetches: `DECISIONS`, `01_strategic_frame`, `02_claude_code_outputs`, `03_final`, and `04_synthesis`.
- The top-five raw fetches prioritized exact 5mg Sermorelin support and source pages with identity, price, vial-format, lyophilized, COA, HPLC, or mass-spec evidence.
- Broader searches found many pages with outcome-heavy and medicalized language; those passages were used only to identify omissions, not to draft product copy.

## Sources

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/core-peptides/product_06__sermorelin-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_42__sermorelin-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_020__sermorelin-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/eternal-peptides/product_25__sermorelin-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/prime-lab-peptides/product_19__sermorelin-5mg.md`

## Omitted claims

- No dosing, preparation, route, injection, ingestion, or protocol instructions.
- No human-use, veterinary-use, diagnostic, therapeutic, or approved-drug comparison claims.
- No anti-aging, sleep, recovery, body-composition, metabolic, cognitive, disease, GH-output, or IGF-1 outcome language.
- No borrowed vendor claims about USA manufacture, cGMP, sterility, no fillers, shipping speed, shelf life, purity percentage, or lab identity unless the operator has matching batch documentation.
- No stack guidance with Ipamorelin, CJC-1295, GHRP-2, GHRP-6, or blends.

## Thin-corpus note

The corpus is not thin for SKU existence or pricing: Sermorelin has a full distribution with 15 vendors, 19 priced rows, and multiple exact 5mg raw pages. It is thin for compliant long-form public copy because the decision and synthesis folders do not contain Sermorelin-specific product guidance, and most rich raw pages rely on claims this storefront should not import. Final copy should stay limited to identity, 5mg vial format, GHRH 1-29 / GRF 1-29 synonym support, analytical traceability, price posture, and strict RUO framing.
