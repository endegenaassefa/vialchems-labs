# DSIP 5mg Product Research

## Proposed Product Object

```ts
{
  slug: 'dsip-5mg',
  sku: 'DSIP-5MG',
  name: 'DSIP, 5mg vial',
  shortName: 'DSIP',
  dose: '5mg',
  format: 'vial',
  listPriceCents: 4900,
  perMgCents: 980,
  category: 'nootropic',
  role: 'catalog-filler',
  position: 'operator-requested premium above captured DSIP 75th percentile',
  shortDescription:
    'Delta Sleep-Inducing Peptide, a nine-amino-acid neuropeptide supplied as a 5mg lyophilized research vial. Studied in non-clinical research on CNS signaling, circadian-pathway models, and neurotransmitter-system assay contexts.',
}
```

## Long Description

DSIP (Delta Sleep-Inducing Peptide) is a naturally occurring nine-amino-acid neuropeptide supplied as a 5mg lyophilized research vial. Supported identity markers include the sequence Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu, CAS 62568-57-4, molecular formula C35H48N10O15, and molecular weight near 848.8 g/mol.

The compound name reflects historical nomenclature and is presented as identity language, not as an outcome statement. This listing is framed for non-clinical laboratories evaluating central-nervous-system signaling, hypothalamic pathway models, neurotransmitter-system assays, and circadian-rhythm research designs.

The 5mg vial format is directly supported across multiple raw product pages, with lyophilized powder listed as the expected presentation. Several consulted pages also show quality-document structures such as HPLC purity fields, COA tabs, mass-spectrometry tabs, batch or lot identifiers, and third-party testing language. Those patterns support a batch-led commerce page rather than benefit-led merchandising.

Static product copy should stay close to those verifiable attributes. Actual purity percentages, lab names, test dates, endotoxin results, mass-spectrometry confirmation, and lot numbers belong in batch-specific documentation rather than general descriptive copy. This keeps the page accurate when lots change and avoids borrowing unverified vendor claims.

The usable pathway context is intentionally restrained. DSIP appears in corpus material alongside serotonergic, dopaminergic, opioidergic, GABAergic, adrenergic, HPA-axis, and nociceptive research terms. These terms are appropriate as laboratory investigation topics, not as expected results, customer outcomes, or practical applications. Broader endpoint language from vendor education sections, including comfort, behavior, mood, withdrawal, oncology, metabolic, muscle, and neuroprotection framing, remains outside this compliant description unless independently substantiated and compliance-reviewed.

For catalog architecture, DSIP fits the neuropeptide side of the nootropic research group while remaining a catalog-completion SKU rather than a flagship acquisition product. The page should read technical and spare: compound identity, vial quantity, research-only restrictions, analytical-documentation posture, and high-level pathway context.

This material is supplied for laboratory research, analytical comparison, and non-clinical pathway investigation only. It is not a drug, dietary supplement, food, cosmetic, or compounding product, and it is not for human or veterinary use, diagnostic use, clinical administration, or therapeutic application.

## Short Description

Delta Sleep-Inducing Peptide, a nine-amino-acid neuropeptide supplied as a 5mg lyophilized research vial. Studied in non-clinical research on CNS signaling, circadian-pathway models, and neurotransmitter-system assay contexts.

## Category And Role Rationale

DSIP belongs in `nootropic` because the existing catalog already places DSIP in that category and the corpus positions it with neuropeptide, CNS-signaling, and circadian-pathway research products. This is a research-area navigation label, not a cognition, sleep, mood, or human-use promise.

The proposed role is `catalog-filler`. `sku_distributions.md` records 50 vendors carrying DSIP, 55 total SKU rows, 51 priced rows, and vial plus nasal formats. The captured DSIP median is $7.00 per mg and the 75th percentile is $9.05 per mg. At the requested $49.00 for 5mg, this SKU lands at $9.80 per mg, above the captured 75th percentile. That supports a premium catalog-completion position, not a loss-leader or volume-driver position.

## Corpus Notes

Targeted searches were run under `/root/peptide-launch-bundle/corpus` for `DSIP`, `Delta Sleep-Inducing Peptide`, `Delta Sleep Inducing Peptide`, and DSIP-matching file names. No DSIP-named directories were found, but 17 DSIP-named raw product files were identified.

The prioritized 02 output match with the strongest product support was `sku_distributions.md`, which supplies the DSIP vendor count, SKU-row count, format spread, pricing percentiles, outliers, and stockout signal. `sku_distributions_summary.json` also matched but was not needed because the Markdown distribution file carried the same actionable DSIP section in readable form.

In `01_strategic_frame`, `research_operations_playbook.md` mentions DSIP only as part of a broader longtail peptide list. `04_synthesis/unified_decision_brief.md` is still a placeholder and did not provide DSIP-specific support. `DECISIONS/compliance_posture.md` and `DECISIONS/source_terms.md` provided compliance and source-status constraints rather than product-specific support. Searches of `DECISIONS` and `03_final` did not surface DSIP-specific product decisions.

The top five raw-fetch files read were direct DSIP product pages or concise product extracts supporting the 5mg vial format, identity markers, price context, lyophilized format, RUO language, and batch/COA posture: Edge Peptides, Paramount Peptides, Planet Peptide, Raw Amino, and Next Generation Compounds. Additional DSIP product pages, including OROS Research and several non-5mg listings, were identified during search but not used as the top-five read set because the selected files already covered the requested format and because some alternates were long template-heavy pages or less direct dose matches.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-1/semax-10mg.md`
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/research_operations_playbook.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_016__dsip-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paramount-peptides/product_37__dsip-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_18__dsip-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__dsip.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/next-generation-compounds/product_17__dsip.md`

## Omitted Unsupported Claims

- Sleep-benefit, sleep-quality, sedation, restfulness, or sleep-architecture claims were omitted except where the compound's canonical name requires `Delta Sleep-Inducing Peptide`.
- Human clinical, therapeutic, diagnostic, disease, wellness, dietary-supplement, food, cosmetic, or compounding use claims were omitted.
- Vendor-page claims around stress response, pain, mood, withdrawal, oncology, mitochondrial protection, metabolic effects, muscle physiology, immune effects, and neuroprotection were not promoted into product copy.
- Route, protocol, dosage, exposure-amount, reconstitution, and customer-use guidance was omitted.
- Global claims about purity, sterility, lab names, manufacturing location, third-party testing, cGMP, or ISO status were not asserted outside batch-specific documentation because source-side terms remain pending.

## Thin-Corpus Note

The corpus is not thin for market availability or price positioning: DSIP has a full aggregate distribution across 50 vendors and 55 SKU rows, and the selected raw files provide direct 5mg support. The corpus is thinner for independently substantiated, compliance-safe mechanism language because many raw pages are vendor-controlled and several drift into endpoint or human-adjacent claims. Final copy should therefore stay close to identity, vial format, RUO posture, batch documentation, and high-level non-clinical pathway context.
