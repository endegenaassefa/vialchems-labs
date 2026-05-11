# IGF-1 LR3 1mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'igf-1-lr3-1mg',
  sku: 'IGF-1-LR3-1MG',
  name: 'IGF-1 LR3, 1mg vial',
  shortName: 'IGF-1 LR3',
  dose: '1mg',
  format: 'vial',
  listPriceCents: 9900,
  perMgCents: 9900,
  category: 'gh-axis',
  role: 'catalog-filler',
  position:
    'operator-requested above-median 1mg price; below captured IGF-1 LR3 p75 and not price-led',
  shortDescription:
    'Synthetic 83-amino-acid IGF-1 class analog with an N-terminal extension and position-3 Arg substitution. Research reference for IGF-axis identity, receptor-interaction, and analytical workflow contexts.',
}
```

## Long Description

IGF-1 LR3 is proposed as a 1mg lyophilized research vial for qualified laboratory and analytical workflows. Corpus product pages identify the material as a synthetic IGF-1 class analog with 83 amino acids, an N-terminal extension, and an arginine substitution at position 3 within the IGF-1 sequence framework.

The safest product-page foundation is compound identity, vial format, and IGF-axis taxonomy. Direct raw pages support 1mg listings, lyophilized powder presentation, COA-oriented quality language, HPLC purity assessment, mass-spectrometry identity checks, and batch or lot visibility. Static copy should not state purity, sterility, manufacture location, salt form, or shelf timing unless the operator has matching lot documentation.

Because identifier fields vary across raw pages, those details should live in dynamic batch tables rather than evergreen descriptive copy.

Research context should stay at pathway and analytical level. Appropriate language includes IGF-axis assay development, receptor-interaction modeling, binding-protein affinity comparison, structure-activity evaluation, chromatographic purity assessment, and mass-spec identity confirmation. These are laboratory workflow terms, not buyer-facing outcome statements.

The raw corpus also shows why restraint is necessary. Some vendor pages move from IGF-axis terminology into customer-readable outcomes, subject-condition narratives, protocol cues, or broad performance language. Those passages should not be imported. The public listing should read as reference-material inventory for controlled research purchasers.

At $99.00, this SKU prices at $99.00 per mg. `sku_distributions.md` reports a captured IGF-1 LR3 median of $85.00 per mg and p75 of $135.45 per mg. Exact raw comparators include BioEdge at $67, Blue Sky at $79.95, Paramount at $80, Vici at $85, and Raw Amino at $230. This supports an above-median operator request, not a discount-led role.

The page should remain sparse: canonical name, 1mg vial size, lyophilized format, price, lot identifier, test date, lab name, COA link, HPLC, and mass-spec fields when available. Avoid stack framing, preparation guidance, route language, exposure amounts, subject outcomes, or customer benefit copy. The compliant posture is RUO identity, analytical traceability, and IGF-axis research taxonomy only.

## Category And Role Rationale

Category: `gh-axis`. IGF-1 LR3 is not a GHRH analog or GHSR agonist, but the existing catalog has no separate IGF-axis or endocrine-research category. The closest existing navigation group is `gh-axis`, already used for compounds whose copy references GH/IGF-axis analytical comparison. This category should function as research-area navigation only, not as a biological or buyer outcome promise.

Role: `catalog-filler`. The SKU has meaningful market presence, with 41 vendors carrying IGF-1 LR3, 43 SKU rows, and 40 priced rows in `sku_distributions.md`. It was not part of the locked opening SKU set, carries higher copy-sensitivity than ordinary catalog peptides, and should not be promoted as a loss leader or flagship volume driver.

Price posture: $99.00 is above the captured median and below p75. It is defensible as an operator-requested 1mg listing, but price copy should not claim market leadership.

## Corpus Search Notes

- Required site files read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Targeted searches used `IGF-1 LR3`, `IGF LR3`, `Long R3 IGF`, and `Insulin-like growth factor` across `/root/peptide-launch-bundle/corpus`.
- Matching-directory search found no IGF-specific directories under the corpus.
- Priority search found structured IGF-1 LR3 support in `02_claude_code_outputs`, especially `sku_distributions.md`, vendor evidence files, vendor JSON files, discovery logs, and pricing matrix rows.
- `01_strategic_frame/research_operations_playbook.md` includes IGF-1 LR3 in the benchmark peptide list, but does not provide product-page copy support.
- No product-specific matches were found in `04_synthesis`, `DECISIONS`, or `03_final`. The consulted `04_synthesis` files are placeholders.
- Raw-fetch search returned many product, catalog, COA, and blog pages. The five raw files consulted in full were selected for exact 1mg relevance, single-vial support, price comparability, or receptor-grade/media-grade risk signal.
- Raw pages conflict on identifiers: Paramount lists CAS `946870-92-4`, while BioEdge lists `143045-27-6`. Final static copy should defer CAS, formula, molecular weight, salt form, and purity to batch documentation.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-2/tesamorelin-5mg.md` (format precedent only)
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/research_operations_playbook.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_12__igf-1-lr3-1mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/blue-sky-peptide/product_9__igf-1-lr3-1mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paramount-peptides/product_17__igf1lr3-1mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__igf-1-lr3.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/vicipeptides/product_2__igf-1lr3.md`

## Omitted Unsupported Or High-Risk Claims

- No route, preparation, exposure amount, cycle, stack, protocol, or administration guidance.
- No customer outcome, physique, performance, anabolic, wellness, or practical-use language.
- No medical endpoint, approved-product, or patient-subject framing.
- No fixed CAS number, formula, molecular weight, purity percentage, sterility claim, USA manufacture claim, filler-free claim, or shelf timing without operator batch records.
- No generic adoption of `receptor grade` or `media grade`; use those distinctions only if the supplier lot and COA explicitly support them.
- No claim that the $99 price is the lowest, best, or unusually competitive.

## Thin-Corpus Note

The corpus is not thin for SKU existence or pricing: IGF-1 LR3 has broad captured vendor coverage, exact 1mg raw pages, and a full price distribution. The corpus is thin for compliant long-form public claims because the decision and synthesis directories do not contain product-specific support, and many raw pages use language that is unsuitable for this storefront. Final copy should therefore stay limited to identity, vial format, IGF-axis taxonomy, and batch-led analytical documentation.
