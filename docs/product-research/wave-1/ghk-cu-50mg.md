# GHK-Cu 50mg Product Research

## Proposed Product Object Fields

```ts
{
  slug: 'ghk-cu-50mg',
  sku: 'GHK-CU-50MG',
  name: 'GHK-Cu, 50mg vial',
  shortName: 'GHK-Cu',
  dose: '50mg',
  format: 'vial',
  listPriceCents: 8900,
  perMgCents: 178,
  category: 'cosmetic-pathway',
  role: 'catalog-filler',
  position: 'operator-directed premium price above captured p75',
  shortDescription:
    'Copper-complexed Gly-His-Lys tripeptide supplied as a lyophilized research vial. Studied in cell-culture and tissue-model work on fibroblast activity, extracellular-matrix signaling, and collagen metabolism.',
}
```

Price math: $89.00 / 50mg = $1.78 per mg.

## Long Description

GHK-Cu is a copper-complexed form of the tripeptide Gly-His-Lys, supplied as a 50mg lyophilized vial for qualified laboratory research. The corpus consistently identifies this material by CAS 89030-95-5 and by the synonym Copper Tripeptide-1, with product-page taxonomies placing it in dermal, cosmetic-pathway, and broader cellular-signaling research categories.

In vitro research framing centers on fibroblast and keratinocyte assay systems. Supported mechanism language includes extracellular-matrix protein expression, collagen-related metabolism, matrix metalloproteinase and TIMP balance, decorin expression, and copper-dependent signaling models. These terms keep the description in laboratory pathway language without converting cell-model observations into outcomes.

The copper coordination is central to the identity of this reference material. Corpus pages describe GHK-Cu as a copper-binding peptide or copper chaperone, and the existing catalog copy treats the Cu-complexed form separately from apo-peptide controls. The product page should preserve that distinction rather than reducing the SKU to generic GHK.

The 50mg vial format is an established standalone unit in the raw vendor corpus, appearing alongside 100mg listings and GHK-Cu-containing blends. This presentation gives researchers a familiar catalog unit while keeping the product narrow: one compound, one vial size, and no stack, protocol, or application-oriented language.

Quality context should stay batch-specific. The corpus supports lot number, test date, lab name, COA link, HPLC, Mass Spec, endotoxin, heavy-metals, and microbial-testing vocabulary as quality signals, but only actual batch records should be used as proof for this SKU.

Because source-side terms remain pending, avoid unverified claims about manufacture, sterility, ISO status, cGMP processing, or US formulation. Those assertions appear in competitor pages but should not be copied unless the operator has matching documentation for this product.

This material is for in vitro, laboratory, and analytical research use only. It is not for human or veterinary use, and the page should provide no preparation, dosing, administration, or application guidance. Keep language focused on compound identity, assay context, storage expectations, and compliance posture rather than outcomes.

## Short Description

Copper-complexed Gly-His-Lys tripeptide supplied as a lyophilized research vial. Studied in cell-culture and tissue-model work on fibroblast activity, extracellular-matrix signaling, and collagen metabolism.

## Category And Role Rationale

`cosmetic-pathway` is the most defensible category. The current protected catalog already places GHK-Cu there, and the raw corpus repeatedly locates GHK-Cu in dermal, cosmetic-pathway, or extracellular-matrix research contexts. This category should be understood as a research taxonomy, not as a cosmetic-use claim.

`catalog-filler` is the safest role at the operator-directed $89 price. The opening SKU decision previously positioned GHK-Cu 50mg as a $34 loss-leader at $0.68/mg, below a captured median of $0.75/mg and p75 of $1.00/mg. At $89, this proposal is $1.78/mg, which is above that captured p75 and should not be described as a loss leader or value-priced volume driver. A premium role would need source-side proof such as confirmed COA depth, source reliability, and packaging standards.

## Corpus Workflow Notes

Required searches were run for `GHK-Cu`, `Copper Peptide`, and `Glycyl-Histidyl-Lysine` under `/root/peptide-launch-bundle/corpus`. `GHK-Cu` produced broad matches across strategic, decision, generated-output, and raw-fetch files. `Copper Peptide` matched pricing/vendor outputs and raw product pages. `Glycyl-Histidyl-Lysine` matched the Paradigm 50mg raw product page. Matching file-containing directories were broad across `02_claude_code_outputs`, `01_strategic_frame`, `DECISIONS`, and many `03_raw_fetches` vendor directories; no matching files were found in `04_synthesis` or `03_final`.

Top raw fetches were selected for direct 50mg relevance and read in full: Paradigm, Prime Lab, OROS, Edge, and Blue Sky.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/combined_context.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paradigm-peptides/product_3__ghk-cu-50mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/prime-lab-peptides/product_12__ghk-cu-50mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/oros-research/product_3__ghk-cu-50mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_030__ghk-cu-50mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/blue-sky-peptide/product_10__ghk-cu-50mg.md`

## Omitted Unsupported Claims

- Human reviews and first-person use reports, including energy, focus, taking the product, or result-update language.
- Therapeutic or disease-oriented claims from competitor pages, including acute lung injury, ARDS, pulmonary fibrosis, diabetic ulcer, neurodegenerative conditions, and post-procedure recovery.
- Outcome claims such as skin rejuvenation, anti-aging effects, hair follicle effects, scar reduction, antioxidant benefit, anti-inflammatory benefit, improved tissue repair, or healing acceleration.
- Preparation, dosing, injection, ingestion, topical application, protocol, or reconstitution guidance.
- Unverified premium quality claims, including cGMP, ISO, USA-made, sterility, pharmaceutical-grade, prescription-strength, or lab-accreditation statements, unless source-side terms later support them.

## Thin-Corpus Note

The corpus is not thin for market fit, catalog fit, or compliance posture: GHK-Cu has broad vendor coverage and direct 50mg raw-fetch support. It is thinner for primary scientific substantiation inside the local corpus because the consulted files are mostly competitor product pages, generated market summaries, and decision memos. For that reason, the proposed copy limits itself to compound identity, assay taxonomy, and pathway language already present across the corpus.
