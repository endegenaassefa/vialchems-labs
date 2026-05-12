# Epitalon 10mg Product Research

## Proposed Product Object

```ts
{
  slug: 'epitalon-10mg',
  sku: 'EPITALON-10MG',
  name: 'Epitalon, 10mg vial',
  shortName: 'Epitalon',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 4900,
  perMgCents: 490,
  category: 'metabolic',
  role: 'catalog-filler',
  position: 'operator-requested premium 10mg format above captured p75',
  shortDescription:
    'Synthetic tetrapeptide (Ala-Glu-Asp-Gly; AEDG) of the Khavinson bioregulator class, supplied as a 10mg lyophilized research vial. Studied in cell-culture and animal-model work on telomere-related cellular signaling and pineal-axis models.',
}
```

## Long Description

Epitalon is a synthetic tetrapeptide commonly identified by the sequence Ala-Glu-Asp-Gly, or AEDG. The 10mg vial should be framed as a lyophilized research reference in the same Khavinson bioregulator lane already used for the existing Epitalon 50mg catalog entry.

Corpus sources support Epitalon and Epithalon as interchangeable retail spellings. Direct 10mg product pages document vial-format listings, lyophilized powder presentation, sequence or molecular-weight details, COA-oriented quality language, and repeated research-use-only limitations. Those concrete attributes are the safest basis for product-page copy.

The appropriate mechanism context is narrow. Existing site copy and raw vendor pages support references to telomere-related cellular signaling, telomerase-marker investigation, gene-expression models, chromatin or epigenetic regulatory research, and pineal-axis or circadian-pathway models. These should remain research topics, not promised effects.

The 10mg presentation gives the catalog a smaller Epitalon vial beside the current 50mg SKU and the Khavinson Bioregulator Stack. Aggregate market data records Epithalon across 69 vendors and 80 SKU rows, with vial and nasal formats observed, so the product is not an obscure one-off addition. This smaller format also gives page copy a standalone basis instead of borrowing from the 50mg listing.

At the requested $49 list price, this SKU lands at $4.90 per mg. That is above the captured Epithalon median of $3.50 and above the 75th percentile of $4.50, making it a premium catalog-completion format rather than a price-led launch driver.

Public copy should avoid vendor-page language around longevity outcomes, anti-aging effects, sleep regulation, retinal conditions, antioxidant activity, reproductive models, tumor findings, or geriatric subject results. Batch-specific support can carry trust signals through lot, test-date, purity, HPLC, mass-spec, and COA fields when the operator has matching documentation.

This material should be described only for controlled laboratory, analytical, in-vitro, and permitted animal-model research contexts. The page should not include preparation guidance, dosing amounts, administration routes, clinical translation, consumer wellness language, or any claim that implies suitability for human or veterinary use.

## Short Description

Synthetic tetrapeptide (Ala-Glu-Asp-Gly; AEDG) of the Khavinson bioregulator class, supplied as a 10mg lyophilized research vial. Studied in cell-culture and animal-model work on telomere-related cellular signaling and pineal-axis models.

## Category And Role Rationale

Epitalon 10mg should use `metabolic` because the existing catalog already places Epitalon 50mg in that category, and no existing union value maps cleanly to Khavinson bioregulators. This category should function as a research-area navigation bucket, not as a metabolic outcome claim.

The proposed role is `catalog-filler`. Epitalon is commercially available, with the corpus distribution grouping Epithalon across 69 vendors and 80 SKU rows, but it is not part of the locked seven-SKU opening set. At $49 for 10mg, the SKU is $4.90 per mg, above the captured Epithalon median of $3.50 and above the 75th percentile of $4.50. That supports a premium catalog-completion posture rather than `loss-leader` or `volume-driver`.

## Corpus Search Notes

Targeted searches were run under `/root/peptide-launch-bundle/corpus` for `Epitalon`, `Epithalon`, `Epithalone`, `Epitalone`, `Ala-Glu-Asp-Gly`, `Ala Glu Asp Gly`, `AEDG`, `Epithalamin`, `Khavinson`, `bioregulator`, and `tetrapeptide`. No directories matched Epitalon or the spelling variants. Targeted search returned no `03_final` files with these exact terms, so no `03_final` file was opened.

The strongest aggregate support came from `02_claude_code_outputs/sku_distributions.md`, where the priced market is grouped primarily under `Epithalon`. That file reports 69 vendors carrying Epithalon, 80 total SKU rows, 71 priced rows, vial and nasal formats, a $3.50 median, a $4.50 75th percentile, and three vendors with out-of-stock rows. A separate `Epitalon` no-pricing bucket appears for one Certapeptides row, which indicates spelling fragmentation rather than a distinct catalog category.

`02_claude_code_outputs/opening_sku_recommendation.md` does not include Epitalon in the locked opening set, but it does identify Epithalon as part of the demand-ranking group that would need tighter channel measurement alongside MOTS-c, Selank, Semax, and KPV. `01_strategic_frame/research_operations_playbook.md` confirms Epithalon as a priority benchmark peptide for the pricing matrix. `04_synthesis/unified_decision_brief.md` is a placeholder and gives no product-specific support. `DECISIONS/opening_sku_set.md` gives only opening-set context; `DECISIONS/compliance_posture.md` gives RUO and forbidden-claim constraints.

The five direct raw-fetch pages consulted were all 10mg Epitalon or Epithalon product pages. They support the 10mg vial/lyophilized presentation, AEDG or Ala-Glu-Asp-Gly identity, COA or HPLC-oriented quality posture, and strict research-use-only limitations. The raw vendor pages also contain many claims that should not be imported into storefront copy.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-1/semax-10mg.md` (format reference only)
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/research_operations_playbook.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/pepsynth-labs/product_8__epithalon-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paramount-peptides/product_12__epithalon-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_013__epithalon-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/silverstone-labs-co/product_1__epitalon-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/thepeptidelabs/product_8__epitalon-10mg.md`

## Omitted Unsupported Claims

- Vendor claims around anti-aging, longevity, lifespan extension, geroprotection, sleep regulation, melatonin normalization, retinal preservation, antioxidant activity, reproductive models, immune function, anti-carcinogenic activity, tumor or metastasis findings, and geriatric subject outcomes were omitted.
- Human-subject, disease, diagnostic, treatment, medical, dietary-supplement, cosmetic-benefit, or wellness framing was omitted.
- Preparation, solvent, reconstitution, storage-after-preparation, dose amount, route, and protocol language was omitted from the proposed commerce copy.
- Purity, HPLC, mass-spec, lot, and COA statements should be displayed only when backed by this operator's batch documentation, not copied from competitor pages.
- Epithalamin was treated only as a synonym-adjacent corpus search term and related historical context, not as interchangeable material identity for the proposed SKU.

## Thin-Corpus Note

The corpus is not thin for market availability or price positioning: the aggregate distribution covers Epithalon across 69 vendors and 80 SKU rows, and five direct 10mg product pages were read in full. It is thinner for independent, product-specific scientific synthesis because `04_synthesis`, `DECISIONS`, and `03_final` do not provide Epitalon-specific science review. Product copy should therefore stay close to compound identity, vial format, high-level research pathway context, batch-document posture, and RUO-only restrictions.
