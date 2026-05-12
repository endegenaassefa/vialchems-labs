# GHRP-2 5mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'ghrp-2-5mg',
  sku: 'GHRP-2-5MG',
  name: 'GHRP-2, 5mg vial',
  shortName: 'GHRP-2',
  dose: '5mg',
  format: 'vial',
  listPriceCents: 3900,
  perMgCents: 780,
  category: 'gh-axis',
  role: 'catalog-filler',
  position:
    'operator-requested premium 5mg price above captured GHRP-2 p75; exact 5mg raw comparators support SKU existence but not price-led positioning',
  shortDescription:
    'Synthetic hexapeptide Growth Hormone Releasing Peptide-2 supplied as a 5mg lyophilized research vial. Reference material for GHS-R1a identity, ghrelin-receptor pathway, HPLC/LC-MS, and GH-axis assay workflows.',
}
```

## Long Description

GHRP-2 is proposed as a 5mg lyophilized research vial in the GH-axis catalog group. Source pages identify the material as Growth Hormone Releasing Peptide-2, a synthetic hexapeptide with the sequence D-Ala-D-2-Nal-Ala-Trp-D-Phe-Lys-NH2. The Pralmorelin synonym appears in Raw Amino and Alpha Carbon Labs pages, but public naming should remain canonical.

The strongest static identity anchors are peptide class, vial strength, lyophilized format, formula C45H55N9O6, CAS 158861-67-7, and molecular mass near 817 Da. Those identifiers are repeated across exact or near-exact GHRP-2 product pages, though final salt form, purity, fill, and release data should defer to operator batch records.

Research-context language should stay at receptor and analytical level. Suitable page copy can describe GHRP-2 as a reference material for GHS-R1a or ghrelin-receptor pathway mapping, somatotroph cell-model comparison, GH-axis assay development, chromatographic purity review, and LC-MS identity confirmation. These are laboratory workflow contexts, not product benefits. This keeps the GH-axis taxonomy legible while avoiding conversion of pathway observations into buyer-facing outcomes or protocol cues.

The 5mg format is directly supported by Ion Peptide, Blue Sky Peptide, Alpha Carbon Labs, AIO Peptides, and the 5mg Raw Amino variant. Several pages also show COA, mass-spectrometry, HPLC, purity, and third-party testing language. Those signals should appear only when matched by the storefront's actual lot documentation. COA support should be visible at purchase rather than borrowed from vendor pages.

At the requested $39 list price, the SKU prices at $7.80 per mg. `sku_distributions.md` reports a GHRP-2 median of $5.76 per mg and p75 of $6.315 per mg. Raw comparators cluster from $29 to $38.95, while Alpha Carbon Labs lists $50 but sold out, so this should be framed as a premium operator request. The page should not claim market leadership or bargain positioning.

The final product page should be narrow and documentation-led: canonical name, 5mg vial size, lyophilized presentation, price, lot identifier, test date, lab name, COA link, HPLC, and mass-spec fields when available. Avoid preparation instructions, routes, exposure amounts, stack instructions, study-subject outcomes, diagnostic references, appetite, sleep, immune, cardiovascular, muscle, protein, or body-composition language.

## Category And Role Rationale

Category: `gh-axis`. GHRP-2 is a growth-hormone-releasing-peptide class material and the existing catalog already places GHRP-class and GHRH-adjacent references in the GH-axis navigation group. This category should function as research-area taxonomy only, not as an outcome claim.

Role: `catalog-filler`. The existing shared catalog currently lists this SKU as a lower-priced `volume-driver`, but the requested $39 price changes the posture. At $7.80 per mg, the listing sits above the captured GHRP-2 p75, so it should not be merchandised as price-led. It is better treated as a premium GH-axis catalog completion item supported by batch documentation.

Price posture: $39.00 is above the direct 5mg prices observed at Ion Peptide, Raw Amino, AIO Peptides sale pricing, and Blue Sky archived pricing, while remaining below Alpha Carbon Labs' sold-out $50 listing. This supports a premium operator-requested price, not a bargain or market-median claim.

## Search Notes

- Required site files read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Targeted searches used `GHRP-2`, `Growth Hormone Releasing Peptide 2`, and `Pralmorelin` across `/root/peptide-launch-bundle/corpus`.
- Priority search found the strongest structured product support in `02_claude_code_outputs/sku_distributions.md`, with additional matches in pricing matrix rows, vendor evidence files, vendor JSON files, discovery logs, and acquisition-channel files.
- `01_strategic_frame/research_operations_playbook.md` includes GHRP-2 in the benchmark peptide list, but does not provide reusable product-page copy.
- No product-specific matches were found in `04_synthesis`, `DECISIONS`, or `03_final`; the consulted synthesis files are placeholders.
- `Pralmorelin` matched Raw Amino and Alpha Carbon Labs exact product pages, plus unrelated Unewlife catalog or feedback pages. The exact long-form phrase `Growth Hormone Releasing Peptide 2` did not match; hyphenated `Growth Hormone Releasing Peptide-2` appears in raw pages.
- The five raw files consulted in full were selected for exact 5mg support, Pralmorelin synonym support, price comparability to the requested $39, or quality-document signal.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-3/igf-1-lr3-1mg.md` (format precedent only)
- `/root/peptide-site/docs/product-research/wave-3/kisspeptin-10-10mg.md` (format precedent only)
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/research_operations_playbook.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/03_final/brand_name_candidates.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__ghrp-2.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/ionpeptide/product_2__ghrp-2.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/blue-sky-peptide/product_5__ghrp-2-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/alpha-carbon-labs/product_31__ghrp-2.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/aio-peptides/catalog_2.md`

## Omitted Unsupported Or High-Risk Claims

- No preparation, route, exposure amount, protocol, cycle, stack, injection, ingestion, or reconstitution guidance.
- No customer outcome, appetite, sleep, cardiovascular, immune, pain, neurological, body-composition, muscle, protein-synthesis, fat-mass, recovery, wellness, or performance claims.
- No diagnostic use, therapeutic use, approved-product comparison, patient-subject, clinical-study, or disease-related framing.
- No claims about GH release strength, increased hormone output, cortisol, prolactin, IGF-1 changes, food intake, or superiority to GHRP-6 or Ipamorelin.
- No generic purity percentage, sterility, shelf-life, source-country, same-day shipping, third-party testing, pharmaceutical-grade, or HPLC/MS confirmation unless tied to the operator's own batch record.
- No claim that the requested $39 price is competitive, market-low, or median-positioned.

## Thin-Corpus Note

The corpus is not thin for SKU existence or pricing: `sku_distributions.md` captures 15 vendors carrying GHRP-2, 16 priced SKU rows, and exact 5mg support from multiple raw pages. The corpus is thin for compliant long-form copy because product-specific support is absent from the decision and synthesis directories, and many raw pages rely on restricted outcome, protocol, subject, or clinical-adjacent language. Final catalog copy should therefore stay limited to identity, vial format, GH-axis taxonomy, analytical workflows, batch-led documentation, and strict RUO positioning.
