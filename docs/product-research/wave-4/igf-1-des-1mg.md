# IGF-1 DES 1mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'igf-1-des-1mg',
  sku: 'IGF-1-DES-1MG',
  name: 'IGF-1 DES, 1mg vial',
  shortName: 'IGF-1 DES',
  dose: '1mg',
  format: 'vial',
  listPriceCents: 6900,
  perMgCents: 6900,
  category: 'gh-axis',
  role: 'catalog-filler',
  position:
    'operator-requested 1mg DES format; below captured exact 1mg Extreme and Paradigm rows, above uncertain discount-homepage signal, and not price-led',
  shortDescription:
    'IGF-1 class research peptide listed in the corpus as IGF-1 DES, IGF DES, and IGF-1 DES 1,3. Reference material for peptide identity, IGF-axis taxonomy, and analytical workflow contexts.',
}
```

## Long Description

IGF-1 DES is proposed as a 1mg research vial for qualified laboratory and analytical workflows. The corpus supports the SKU name through exact or near-exact catalog listings under IGF-1 DES, IGF DES, and IGF-1 DES 1,3, with direct 1mg support from Extreme Peptides, Paradigm Peptides, SwissChems COA index, and Peptide Gurus.

The safest product-page foundation is identity and format. Static copy should say the material is an IGF-class peptide reference supplied as a 1mg vial, while leaving sequence, counterion, salt form, purity, sterility, and release-test values to operator batch records. Existing raw pages do not provide enough consistent detail for permanent identifier claims. That restraint also keeps the listing aligned with the site's batch-led catalog model and current source-terms uncertainty.

Research context should stay narrow. Appropriate language includes IGF-axis taxonomy, receptor-interaction assay context, peptide-identity comparison, chromatographic purity review, mass-oriented identity confirmation, and lot-to-lot documentation. These terms describe laboratory classification and analytical workflow needs without translating pathway language into purchaser outcomes or experimental promises.

Quality language should be batch-led. The SwissChems index shows that IGF-1 DES 1mg can be represented through COA-linked product records, while Extreme and Paradigm provide price and vial-size comparators. The site should present lot number, test date, lab name, COA link, and applicable analytical methods only when matching records exist.

At $69.00, the proposed listing equals $69.00 per mg. That is below the direct Extreme Peptides sale row at $76.99 and Paradigm row at $85.00, but above Injectify's homepage sale signal. Because the distribution file places DES rows in the heterogeneous other bucket, price positioning should be described conservatively.

The public page should be sparse: canonical name, 1mg vial size, format, price, batch traceability fields, and research-only constraints. It should not borrow outcome language from broader vendor education pages or adjacent IGF-class products. The compliant posture is identity, analytical traceability, and IGF-axis taxonomy, not experiment design or end-user interpretation.

## Category And Role Rationale

Category: `gh-axis`. IGF-1 DES is an IGF-axis material rather than a GHRH analog or secretagogue, but the current catalog has no separate IGF-axis category. The closest existing navigation group is `gh-axis`, already used for IGF-1 LR3 and other GH/IGF-axis research references. The category should remain navigation shorthand only.

Role: `catalog-filler`. The captured corpus supports SKU existence and a 1mg vial format, but product-specific public-copy support is thinner than for IGF-1 LR3. It was not part of the locked opening SKU set and should not be treated as a flagship or loss-leader product.

Price posture: $69.00 is defensible as an operator-requested 1mg listing because it sits below two exact 1mg catalog rows from Extreme and Paradigm. It should not be described as market-low because Injectify shows a lower sale price with uncertain dose metadata and `sku_distributions.md` classifies DES rows inside the heterogeneous `other` bucket.

## Corpus Search Notes

- Required site files read first in full: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Format precedent read in full: `docs/product-research/wave-3/igf-1-lr3-1mg.md`.
- Targeted searches used `IGF-1 DES`, `IGF DES`, `DES(1-3) IGF`, `des(1-3)igf`, `igf-1-des`, `igf des`, `igf1des`, and `Insulin-like growth factor` across the authorized corpus.
- Authorized-folder search found DES-specific support in `02_claude_code_outputs/pricing_matrix.csv`, `sku_distributions.md`, vendor JSON, and evidence text. No product-specific support was found in `DECISIONS`, `01_strategic_frame`, or written `04_synthesis` files.
- Broad `Insulin-like growth factor` search was noisy and mostly returned IGF-1 LR3 or adjacent GH-axis pages, so source selection was narrowed to DES-specific matches.
- The five raw files consulted in full were selected for exact name, 1mg vial, price, or COA-index relevance: Extreme, Paradigm, Injectify, SwissChems, and Peptide Gurus.
- Raw support is mostly catalog-listing and COA-index level. It does not provide stable sequence, CAS, formula, molecular weight, salt form, purity, or sterility details suitable for evergreen static copy.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-3/igf-1-lr3-1mg.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/extreme-peptides/catalog_1.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paradigm-peptides/catalog_1.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/injectify/homepage.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/swiss-chems/coa_index.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/peptide-gurus/catalog_14.md`

## Omitted Unsupported Or High-Risk Claims

- No preparation, route, exposure amount, cycle, stack, protocol, or practical handling guidance.
- No growth, muscle, performance, physique, anabolic, wellness, recovery, or customer outcome language.
- No medical endpoint, patient-subject framing, diagnostic framing, therapeutic framing, or approved-product comparison.
- No fixed CAS number, formula, molecular weight, sequence, counterion, salt form, purity percentage, sterility claim, USA manufacture claim, filler-free claim, shelf timing, or shipping promise without operator batch records.
- No generic adoption of competitor quality claims such as ISO labs, third-party purity thresholds, or same-day shipping.
- No claim that the $69 price is the lowest, best, or market-leading.

## Thin-Corpus Note

The corpus is thin for compliant long-form public copy. It supports SKU existence, 1mg vial presentation, COA-index precedent, and several price comparators, but DES rows are not normalized into a product-specific distribution and most direct support is catalog-level rather than rich product-page documentation. Final copy should therefore stay limited to identity, vial format, price, IGF-axis taxonomy, and batch-led analytical documentation.
