# GHRP-6 5mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'ghrp-6-5mg',
  sku: 'GHRP-6-5MG',
  name: 'GHRP-6, 5mg vial',
  shortName: 'GHRP-6',
  dose: '5mg',
  format: 'vial',
  listPriceCents: 3900,
  perMgCents: 780,
  category: 'gh-axis',
  role: 'catalog-filler',
  position:
    'operator-requested $39 price; above captured GHRP-6 p75 and below highest captured 5mg comparator',
  shortDescription:
    'Synthetic growth-hormone-releasing hexapeptide supplied as a 5mg lyophilized research vial. Reference material for GHS-R1a, pituitary somatotroph, GH-axis, and peptide-identity assay contexts.',
}
```

## Long Description

GHRP-6 is a synthetic growth-hormone-releasing hexapeptide proposed here as a 5mg lyophilized research vial. The strongest static identity anchor is the sequence His-D-Trp-Ala-Trp-D-Phe-Lys-NH2, with source pages also listing molecular formula C46H56N12O6, molecular mass near 873 Da, and CAS 87616-84-0.

Product-page copy should treat those identifiers as reference-material metadata, not as a basis for broader biological promises. Growth Hormone Releasing Peptide-6 can appear as a synonym for search and identification, while final salt form, purity, water content, fill accuracy, and chromatographic release values should remain tied to the operator's batch documentation.

That distinction matters because vendor pages often mix stable catalog facts with broad narrative claims. For this listing, the evergreen page should hold only terms a future lot can continue to support without rewriting the science story: compound name, vial strength, format, and batch-visible analytical fields.

The allowed research frame is narrow: GHS-R1a receptor interaction, pituitary somatotroph signaling models, GH-axis assay comparison, second-messenger pathway mapping, and peptide-identity workflows. Alpha Carbon Labs, Ion Peptide, Raw Amino, and Edge all connect GHRP-6 with ghrelin-receptor or GHSR terminology, but their outcome-led language needs substantial claim removal.

The 5mg vial format is directly supported by Raw Amino, Ion Peptide, Alpha Carbon Labs, and Paradigm Peptides, with adjacent 10mg and multi-vial support from Raw Amino and Edge. This is enough for SKU existence, price comparison, and catalog placement, but not enough to borrow customer reviews, shipping promises, or vendor purity percentages.

At $39.00, the proposed listing equals $7.80 per mg. That places the SKU above the captured GHRP-6 75th percentile of $5.9950 per mg, while remaining below the $10.00 per-mg high from the distribution. Merchandising should therefore be documentation-led, not discount-led.

The final page should read as a controlled GH-axis research-commerce listing: canonical name, 5mg vial strength, lyophilized format, batch/lot identifier, test date, lab name, COA link, HPLC, mass-spec confirmation, and concise RUO restrictions. It should not include preparation guidance, route language, exposure amounts, stack instructions, subject outcomes, disease terms, or approved-product comparisons.

## Rationale

Category: `gh-axis`. GHRP-6 is consistently presented in the corpus as a growth-hormone-releasing peptide, GH secretagogue, or GHS-R1a/ghrelin-receptor research material. The category should remain a navigation label for endocrine-axis research context, not a purchaser-facing result claim.

Role: `catalog-filler`. The existing seed catalog had GHRP-6 positioned as a lower-priced volume-driver, but the requested $39 list price changes the merchandising logic. `sku_distributions.md` reports a GHRP-6 median of $5.7600/mg and p75 of $5.9950/mg; this proposal is $7.80/mg, above p75. That supports a documentation-led catalog-completion role rather than a loss-leader or price-led volume position.

## Search Notes

- Required site files read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Authorized-corpus searches used `GHRP-6`, `Growth Hormone Releasing Peptide 6`, and `His-D-Trp` across `/root/peptide-launch-bundle/corpus`.
- `DECISIONS` did not contain a product-specific GHRP-6 decision. Compliance posture and pending source-side terms were used only for RUO, COA, and batch-documentation discipline.
- `sku_distributions.md` reports 16 vendors carrying GHRP-6, 17 total SKU rows, 15 priced rows, and vial-only formats. Pricing rows include exact 5mg support from Raw Amino, Ion Peptide, Alpha Carbon Labs, Paradigm Peptides, and other catalog pages.
- Top raw-fetch priority went to exact or near-exact GHRP-6 pages with product identity, price, format, analytical identifiers, or claim-risk signal. Bachem's `(D-Lys3)-GHRP-6` search hit was excluded from support because it is a modified antagonist analog, not the requested GHRP-6 SKU.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-3/aod-9604-5mg.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__ghrp-6.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/ionpeptide/product_2__ghrp-6.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/alpha-carbon-labs/product_32__ghrp-6.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_024__ghrp6-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paradigm-peptides/catalog_2.md`

## Omitted Unsupported Or High-Risk Claims

- No appetite, hunger, food-intake, orexigenic, NPY/AgRP, cachexia, or weight-management framing.
- No body-composition, muscle-growth, tissue-repair, wound, cardiac, cognitive, mood, neurological, or disease-model outcome claims.
- No dosing, preparation, reconstitution, route, protocol, cycle, stack, synergy, or researcher instruction language.
- No clinical-study translation, approved-product comparison, diagnostic, therapeutic, or suitability language.
- No blanket purity, sterility, manufacture-location, shipping-speed, free-supply, customer-review, or lab-accreditation claims unless matched by operator batch documentation.
- No `(D-Lys3)-GHRP-6` antagonist claims, because that search hit refers to a different analog.

## Thin-Corpus Note

The corpus is not thin for SKU existence or pricing: the distribution file captures 16 GHRP-6 vendors and 17 rows, and the raw corpus includes several exact 5mg signals. It is thin for compliant long-form copy because the strongest product pages repeatedly use appetite, body-composition, clinical, route, and outcome language. Final page copy should therefore stay close to identity, vial format, GH-axis taxonomy, analytical traceability, and RUO restrictions.
