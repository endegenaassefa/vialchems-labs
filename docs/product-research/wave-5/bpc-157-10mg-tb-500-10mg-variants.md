# BPC-157 10mg and TB-500 10mg Variant Research

## Conflict Check

The task note says the user list has BPC-157 5mg as an existing item, but the repo currently contains `BPC-157-10MG`, not `BPC-157-5MG`. In [products.ts](/root/peptide-site/lib/content/products.ts:53), BPC-157 10mg is already present as `slug: 'bpc-157-10mg'`, `sku: 'BPC-157-10MG'`, and `listPriceCents: 5400`. I did not edit the shared catalog files.

## Proposed Product Fields

### BPC-157 10mg

Use the existing catalog fields as-is:

```ts
{
  slug: 'bpc-157-10mg',
  sku: 'BPC-157-10MG',
  name: 'BPC-157, 10mg vial',
  shortName: 'BPC-157',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 5400,
  perMgCents: 540,
  category: 'recovery',
  role: 'loss-leader',
  position: '10% below market median',
  shortDescription:
    'Synthetic 15-amino-acid peptide fragment isolated from bovine gastric juice. Subject of in-vitro and animal-model research on tissue-protective signaling.',
}
```

Assessment: price and position remain supported by the locked opening-SKU decision and the opening recommendation. The existing long description in [product-descriptions.ts](/root/peptide-site/lib/content/product-descriptions.ts:27) should not be reused under this wave standard because it includes exposure amounts, preparation wording, and outcome-led animal-model phrasing. The short product fields do not need a price or position change.

### TB-500 10mg

Add as a new standalone stack-compatible variant:

```ts
{
  slug: 'tb-500-10mg',
  sku: 'TB-500-10MG',
  name: 'TB-500, 10mg vial',
  shortName: 'TB-500',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 7900,
  perMgCents: 790,
  category: 'recovery',
  role: 'volume-driver',
  position:
    '10mg stack variant; below the highest exact 10mg comparators and near the upper-middle exact-page band',
  shortDescription:
    'TB-500 research peptide supplied as a lyophilized 10mg vial. Corpus-supported nomenclature connects the SKU with thymosin beta-4/TB4, actin-binding, cell-migration assay, and peptide-identity workflow contexts.',
}
```

Rationale: exact 10mg raw pages support standalone TB-500 10mg at $49.99, $55.00, $72.00, $80.00, and $84.00 across the five readable exact captures. A $79.00 list keeps the 10mg variant below Paramount and Paradigm, above discount-position Planet and Rivn, and consistent with the repo's current premium TB-500 posture. It also avoids making the 10mg vial the same total price as the existing $69 TB-500 5mg listing.

## TB-500 10mg Long Description

TB-500 10mg is proposed as a lyophilized research vial for laboratories that need a standalone TB-500 strength aligned with BPC-157 10mg stack architecture. The raw corpus repeatedly connects TB-500 with thymosin beta-4, TB4, and actin-binding nomenclature, while exact product pages confirm a 10mg vial presentation across multiple vendors. This is enough support for a clean catalog entry, but not for broad biological promises.

The safest public framing is compound identity, vial strength, analytical posture, and controlled research context. Source pages commonly present TB-500 as a thymosin beta-4-related peptide and list quality signals such as HPLC, mass spectrometry, COA access, lot visibility, and lyophilized powder format. Those terms should remain batch-led in implementation: the storefront should show only the test types, lab names, dates, and release values that match the operator's actual inventory. This preserves future lot flexibility and avoids overclaiming.

Sequence language needs caution. Several exact 10mg pages describe TB-500 as a 43-amino-acid thymosin beta-4 material, while some older marketplace and stack descriptions use fragment language. Static copy should not resolve that discrepancy unless supplier documentation and the live COA confirm the exact identity. Until then, product copy can say that TB-500 is associated with thymosin beta-4/TB4 nomenclature and actin-binding research contexts, leaving sequence, salt form, purity, counterion, and fill verification to batch records.

For catalog architecture, the 10mg variant belongs in recovery because the locked opening-SKU file and raw blend pages repeatedly pair BPC-157 and TB-500 in recovery-stack or blend contexts. The category should work only as navigation shorthand for research-area grouping. It should not become an effect claim.

The final product page should stay sparse: canonical name, 10mg vial strength, lyophilized presentation when verified, price, batch identifier, test date, lab name, COA link, HPLC field, mass-spec field, and concise research-use-only restrictions. Avoid preparation guidance, protocol language, route terms, exposure amounts, customer outcome language, clinical translation, and unsupported manufacturing or quality claims.

## Search Notes

I searched the corpus for `BPC-157`, `Body Protection Compound`, `PL 14736`, `TB-500`, `Thymosin Beta-4`, `TB4`, `BPC-157 10mg`, and `TB-500 10mg`. Exact BPC-157 10mg support was broad, including BioEdge, Planet Peptide, Paramount, Pepsynth, and Rivn. Exact TB-500 10mg support was also present, including BioEdge, Planet Peptide, Paramount, Rivn, and Paradigm. `PL 14736` appeared only as sparse BPC synonym/reference support and is not useful for public catalog naming.

Stack-specific support is meaningful but uneven. The locked opening set names BPC-157 plus TB-500 as the most-attested recovery stack pattern. BioEdge, Planet Peptide, and Edge all have BPC/TB blend pages with 10mg/10mg or bulk 10/10 presentations, but those pages mix useful SKU evidence with claim-heavy language and occasional table inconsistencies. I used them only to support variant demand and stack architecture, not to write mechanism or outcome copy.

## Source Notes

Repo files read first:

- [products.ts](/root/peptide-site/lib/content/products.ts:1)
- [product-descriptions.ts](/root/peptide-site/lib/content/product-descriptions.ts:1)
- [SOURCING_LEDGER.md](/root/peptide-site/SOURCING_LEDGER.md:1)

Decision and synthesis files read:

- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`

Top exact BPC-157 10mg raw pages read:

- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_1__bpc-157-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_1__bpc-157-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paramount-peptides/product_2__bpc-157-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/pepsynth-labs/product_1__bpc-157-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/rivn-peptides/product_1__bpc-157-10mg.md`

Top exact TB-500 10mg raw pages read:

- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_2__tb-500-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_2__tb-500-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paramount-peptides/product_4__tb-500-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/rivn-peptides/product_2__tb-500-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paradigm-peptides/product_2__tb-500-10mg.md`

Stack/blend pages read:

- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_15__bpc-157-tb-500-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_32__bpc157-tb500-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_034__bpc157-tb500-blend-10mg.md`

## Omitted Claims

I omitted preparation instructions, route language, exposure amounts, protocol guidance, end-user outcome claims, clinical translation, disease terms, customer suitability language, and competitor claims about purity, manufacturing, sterility, lab accreditation, or shipping that are not confirmed by the operator's own batch documentation.

## Thin-Corpus Note

This is not a thin corpus for SKU existence: both standalone 10mg products and BPC/TB stack formats are well attested. It is thin for harmonized static TB-500 identity because exact pages disagree on whether public copy should treat the material as full-length thymosin beta-4 or a fragment. Keep TB-500 identity details batch-led until supplier records settle that point.
