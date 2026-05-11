# MOTS-c 10mg Product Research

## Proposed Product Object Fields

Proposed only. This worker does not modify shared catalog files.

```ts
{
  slug: 'mots-c-10mg',
  sku: 'MOTS-C-10MG',
  name: 'MOTS-c, 10mg vial',
  shortName: 'MOTS-c',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 7900,
  perMgCents: 790,
  category: 'metabolic',
  role: 'catalog-filler',
  position: 'premium-position override above prior market median',
  shortDescription:
    'Mitochondrial-derived 16-amino-acid peptide encoded within the mitochondrial 12S rRNA region. Studied in cell-culture and animal-model research on mitochondrial signaling and metabolic-pathway models.',
}
```

## Long Description

MOTS-c is a mitochondrial-derived, 16-amino-acid peptide encoded within the mitochondrial 12S rRNA region. The launch corpus places it in the metabolic research lane because MOTS-c is discussed as a mitochondrial-signaling reagent rather than a recovery, GH-axis, cosmetic-pathway, nootropic, or immune-category peptide. It fits best as a technical catalog item for mitochondrial-pathway research.

This 10mg vial is proposed as a lyophilized research material for qualified laboratory workflows examining mitochondrial-derived peptide signaling, mitochondrial-nuclear communication, and stress-responsive gene-expression models. Competitor pages consistently identify MOTS-c with the sequence MRWQEMGYIFYPRKRR and molecular weight near 2174 Da; final identity, purity, counterion, and analytical details should defer to batch-specific documentation rather than static marketing copy.

Cell-culture and animal-model literature summarized in the corpus centers MOTS-c around AMPK-pathway investigation, folate-methionine cycle mapping, glucose and lipid metabolism assays, and mitochondrial stress-response research. Those topics are framed here as experimental contexts only. They should not be converted into outcomes, protocols, dosing instructions, or end-user performance claims.

The product page should keep MOTS-c in a controlled research register. Suitable copy can mention mitochondrial-derived peptide classification, 12S rRNA encoding, lyophilized vial format, and analytical traceability. It should avoid translating pathway observations into body-composition, performance, longevity, cognitive, cardiovascular, skeletal, weight-management, or disease-related statements, even when those themes appear in raw vendor pages.

The 10mg presentation gives the catalog a recognizable metabolic-pathway SKU without expanding into GLP-1 analogues or other higher-scrutiny classes excluded by the opening SKU decision. At the requested $79 list price, the object should be treated as a premium-position override; the internal opening recommendation supported a $48 median-market MOTS-c 10mg vial.

MOTS-c 10mg should be presented with age-gated access, research-use-only acknowledgments, and source-confirmed batch/lot traceability once supplier terms are locked. No administration language, clinical framing, consumer-use directions, or implied suitability outside controlled research should appear on the page. The safest commerce posture is concise, technical, and limited to research, laboratory, and analytical use.

## Short Description

Mitochondrial-derived 16-amino-acid peptide encoded within the mitochondrial 12S rRNA region. Studied in cell-culture and animal-model research on mitochondrial signaling and metabolic-pathway models.

## Category And Role Rationale

Category: `metabolic`. MOTS-c is consistently framed in the corpus as a mitochondrial-derived peptide used in metabolic-signaling, AMPK-pathway, mitochondrial stress-response, and mitochondrial-nuclear communication research contexts. It does not match the recovery, GH-axis, cosmetic-pathway, nootropic, or immune catalog lanes.

Role: `catalog-filler`. The opening SKU recommendation classifies MOTS-c 10mg as a catalog-filler SKU with strong enough vendor presence to signal catalog completeness, but not as a top-three loss leader or a position-four/five volume driver. The requested $79 price strengthens the catalog-filler reading because it overrides the prior $48 median-market recommendation rather than competing as a price-led SKU.

## Corpus Workflow Notes

- Ran `grep -ril "MOTS-c" /root/peptide-launch-bundle/corpus`.
- Ran `grep -ril "Mitochondrial Open Reading Frame" /root/peptide-launch-bundle/corpus`.
- Ran matching-directory checks for `mots`, `mitochondrial`, and `open reading frame`; no directory names matched those terms directly.
- Priority tier matches found in `02_claude_code_outputs`, `01_strategic_frame`, and `DECISIONS`.
- No MOTS-c or "Mitochondrial Open Reading Frame" matches were found in `04_synthesis` or `03_final`.
- Raw fetch review was limited to five exact MOTS-c product pages, prioritized for exact 10mg pages that also matched "Mitochondrial Open Reading Frame" where available.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/combined_context.md`
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/bible_final.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/core-peptides/product_05__mots-c-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/rivn-peptides/product_7__mots-c-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/eternal-peptides/product_8__mots-c-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/biolongevity-labs/product_5__mots-c-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/pepsynth-labs/product_6__mots-c-10mg.md`

## Omitted Unsupported Claims

- Human outcome, clinical application, treatment, prevention, or diagnostic statements from raw vendor pages.
- Disease-specific claims, including claims around metabolic disorders, obesity, diabetes, osteoporosis, cognitive decline, traumatic brain injury, Alzheimer-type models, cardiovascular dysfunction, and age-related diseases.
- Performance, exercise-mimetic, muscle-growth, weight-management, body-composition, longevity, anti-aging, bone-density, neuroprotection, and cardiac-function claims.
- Dosing, route, administration, reconstitution, and storage-duration guidance for buyers.
- Vendor-specific quality claims such as Janoshik testing, GMP-compliant facilities, ISO accreditation, same-day shipping, satisfaction guarantees, review counts, and purity guarantees unless separately confirmed for this product's own source and lot.
- A median-market price position. The corpus supports $48 as the original market-median recommendation; $79 is recorded here as a requested premium-position override.

## Thin-Corpus Note

The corpus is not thin for SKU existence, category fit, and original pricing support: MOTS-c appears in the locked opening SKU set and in multiple exact 10mg raw product pages. It is thinner for clean, site-ready claim language because many raw pages include disease, performance, longevity, dosing, or therapeutic-adjacent claims that should not be imported. With no `04_synthesis` or `03_final` MOTS-c matches, product copy should stay conservative and mechanism-level.
