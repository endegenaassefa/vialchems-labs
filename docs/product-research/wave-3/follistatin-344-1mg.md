# Follistatin-344 1mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'follistatin-344-1mg',
  sku: 'FOLLISTATIN-344-1MG',
  name: 'Follistatin-344, 1mg vial',
  shortName: 'Follistatin-344',
  dose: '1mg',
  format: 'vial',
  listPriceCents: 14900,
  perMgCents: 14900,
  category: 'recovery',
  role: 'catalog-filler',
  position:
    'operator-requested premium 1mg format above captured median and below captured p75',
  shortDescription:
    'Recombinant human Follistatin-344 (FST-344) research reference supplied as a 1mg lyophilized vial. Cataloged for protein identity, TGF-beta-family ligand-binding, myostatin/activin pathway, and analytical workflow contexts only.',
}
```

## Long Description

Follistatin-344 is a recombinant human follistatin isoform, commonly abbreviated FST-344, supplied as a 1mg lyophilized research vial. This listing is intended for qualified laboratory teams that need a protein reference for identity confirmation, ligand-binding models, and analytical workflows rather than application-oriented or consumer contexts. The page should frame the material as a cataloged research reagent, with pathway terminology serving as taxonomy rather than an objective.

The identity frame should stay precise and batch-led. Available corpus material identifies FST344 with UniProt P19883 and describes a 344-amino-acid precursor, a mature core near 315 amino acids, and an unglycosylated monomer near 37.8 kDa. Final page metadata should defer to the operator's lot record and COA for purity, counterion, and exact analytical release details. Because protein specifications can vary by supplier record, identity language should remain conservative until reconciled with the live batch.

The supported pathway vocabulary is limited to follistatin's ligand-binding relationship within TGF-beta-family research. Corpus pages connect FST-344 with activin-binding terminology and myostatin/activin pathway analysis. Those terms should be presented as research context only, without translating receptor or ligand language into outcomes, benefits, or practical applications.

For quality framing, the page can emphasize the 1mg vial format, lyophilized presentation, batch/lot visibility, test date, COA access, HPLC purity assessment, and mass-oriented identity confirmation when matching documents exist. Vendor-specific purity percentages, manufacturing origin, sterility, guarantees, and handling directions should not appear as static claims without operator documentation.

The requested $149 price equals $149 per mg. Captured market rows place the SKU above the $129/mg median and below the $158/mg 75th percentile, making it a premium but not outlier 1mg listing. Merchandising should therefore be restrained: this is a catalog-completion SKU supported by documentation, not a discount-led acquisition item.

Follistatin-344 should remain in a research-use-only register focused on material identity, pathway nomenclature, and analytical traceability. Product copy should avoid experimental setup instructions, workflow directions, translational extrapolation, and non-laboratory applications. The strongest page is short, technical, and anchored to batch-specific verification rather than broad scientific narratives from competitor pages.

## Category And Role Rationale

`recovery` is the least-bad existing category because the current `ProductCategory` union does not include a TGF-beta-family, protein-signaling, or pathway-analysis bucket. The label should function only as navigation shorthand for tissue-signaling and ligand-binding research adjacency, not as an outcome statement.

`catalog-filler` is the right role. The requested $149 price is not a loss-leader: `sku_distributions.md` places the SKU above the captured $129/mg median and below the $158/mg p75. The corpus also has enough exact 1mg listings to justify the SKU, but not enough compliant depth to make it a core volume driver.

## Search Notes

Searches covered `Follistatin-344`, `FST-344`, `Follistatin 344`, and `myostatin` across the decision files, synthesis outputs, final outputs, and raw fetches. Decision and synthesis layers did not provide direct product support; the substantive non-raw support came from `sku_distributions.md`.

The top relevant raw fetches were exact or near-exact listing pages from Raw Amino, Paramount Peptides, Peptide Sciences, Core Peptides, and Paradigm Peptides. Exact `FST-344` support came from Raw Amino, while Paramount used `FST344` and supplied the strongest identity/specification details. `myostatin` appeared mostly in outcome-heavy vendor copy; it is usable only as pathway adjacency, not as a results claim.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-2/pt-141-10mg.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__follistatin-344.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paramount-peptides/product_27__follistatin344-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/peptide-sciences/homepage_active_state.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/core-peptides/catalog.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paradigm-peptides/catalog_1.md`

## Omitted Unsupported Claims

- Muscle growth, muscle mass, strength, bodybuilding, recovery outcomes, body-composition effects, and performance framing.
- Myostatin inhibition/blockade as a practical result or customer-facing promise; retained only as pathway vocabulary.
- Diabetes, beta-cell, blood-sugar, pancreatic, cancer, fibrosis, disease, treatment, prevention, cure, or diagnostic narratives.
- Gene-expression intervention, overexpression, vector, mRNA, nanoparticle, and gene-therapy translation claims.
- Dosing, route, administration, reconstitution, solubility, storage, shelf-life, and protocol instructions.
- Human or veterinary suitability, clinical extrapolation, consumer use, or personal application language.
- Vendor-specific purity percentages, manufacturing-origin claims, guarantees, shipping speed, and review/rating signals unless confirmed by operator batch/source documentation.

## Thin-Corpus Note

The corpus is adequate for existence, naming, 1mg format, and price positioning: five consulted raw sources show exact 1mg listings or catalog rows, and `sku_distributions.md` captures eight vendor rows. It is thin for compliant product copy because most usable detail comes from Paramount identity fields and Raw Amino synonym/pathway text, while much of the surrounding vendor language is outcome-heavy or operationally unsupported. Final live copy should stay batch-led until supplier terms and COA artifacts are locked.
