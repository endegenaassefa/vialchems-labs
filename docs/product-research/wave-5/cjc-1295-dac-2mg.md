# CJC-1295 DAC 2mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'cjc-1295-dac-2mg',
  sku: 'CJC-1295-DAC-2MG',
  name: 'CJC-1295 DAC, 2mg vial',
  shortName: 'CJC-1295 DAC',
  dose: '2mg',
  format: 'vial',
  listPriceCents: 5900,
  perMgCents: 2950,
  category: 'gh-axis',
  role: 'catalog-filler',
  position:
    'operator-requested 2mg DAC variant; premium catalog-completion SKU above Swiss/Paradigm exact 2mg comparators and below Strate exact 2mg high',
  shortDescription:
    'Drug Affinity Complex-modified CJC-1295 research peptide supplied as a 2mg vial. Catalog reference for DAC vs No DAC identity, GH-axis taxonomy, and analytical confirmation workflows.',
}
```

## Long Description

CJC-1295 DAC is proposed as a 2mg lyophilized research vial for controlled laboratory and analytical workflows. The clearest identity frame is CJC-1295 with Drug Affinity Complex: a DAC-modified GHRH analog, not the CJC-1295 No DAC / Modified GRF 1-29 SKU already represented in the catalog.

The DAC distinction should remain visible anywhere Modified GRF language appears. Vendor pages use overlapping terms such as CJC-1295 with DAC, CJC-1295 W/DAC, Modified GRF 1-29 with DAC, and Drug Affinity Complex. Because plain Modified GRF 1-29 can point to the No DAC form, this listing should not shorten the name in a way that collapses the two identities.

Product copy can describe GH-axis research taxonomy, GHRH analog classification, peptide identity confirmation, and the DAC modification as an albumin-affinity taxonomy marker. Those are compound-identity and analytical-context statements only. The page should not translate DAC language into claims about subject response, endocrine outcomes, comparative behavior, or practical applications.

Exact 2mg market support appears in Swiss Chems, Paradigm Peptides, and Strate Labs captures. Swiss lists CJC-1295 with DAC 2mg per vial; Paradigm lists both with-DAC and No DAC 2mg entries; Strate lists CJC-1295 DAC 2mg at a higher price. OROS was reviewed because the URL included 2mg but the captured page text and COA table identify 5mg, so it should be treated only as an inconsistency signal.

At $59.00, this SKU prices at $29.50 per mg. That sits above the broad CJC-1295 distribution median and 75th percentile, above the Swiss and Paradigm exact 2mg comparators, and below the Strate exact 2mg high. It should therefore read as a premium catalog-completion listing, not a loss leader or volume driver.

Final public language should be sparse: canonical name, 2mg vial format, lyophilized presentation when verified, batch/lot number, test date, lab name, COA link, HPLC, mass confirmation, endotoxin, and sterility fields where applicable. Avoid preparation, route, schedule, protocol, human or animal use, treatment, performance, and other application language.

## Category And Role Rationale

Category should be `gh-axis` because the existing catalog places CJC-1295 No DAC in that category and the source corpus consistently frames both DAC and No DAC variants as CJC/GHRH-adjacent research peptides. The product should not create a new category or be grouped with blends.

Role should be `catalog-filler`, not `volume-driver`. The locked opening SKU set selected CJC-1295 No DAC 5mg as the GH-axis CJC entry, and the opening recommendation treated with-DAC as outside the initial launch set. The requested 2mg DAC item fills a variant gap for customers searching exact DAC terminology, but it is not supported as a price-led acquisition SKU.

The requested $59 price equals $29.50 per mg. In `sku_distributions.md`, the broad CJC-1295 distribution centers far lower, while exact 2mg DAC comparators show a more premium niche: Paradigm at $37.00, Swiss at $47.95, and Strate at $69.95. That makes $59 defensible only as a premium 2mg DAC variant with clear identity separation from No DAC.

## Corpus Search Notes

Required project files were read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`. The ledger was used for sourcing context only and was not edited.

Authorized corpus search terms included `CJC-1295 DAC`, `DAC:GRF`, `Drug Affinity Complex`, `Modified GRF`, `CJC-1295 with DAC`, `CJC-1295 W/DAC`, and regex variants for CJC/DAC ordering. The exact `DAC:GRF` string was not found in the consulted corpus; it should remain a search alias rather than a supported public synonym.

The most useful authorized synthesis file was `sku_distributions.md`, especially the broad `CJC-1295`, `CJC-1295 (with DAC)`, and limited `CJC-1295 (DAC)` sections. The strategic opening-set documents support caution because the launch decision favored No DAC, while source terms remain pending and do not support static supplier, MOQ, or fulfillment claims.

The top five relevant raw fetches were read in full. Swiss, Paradigm, and Strate gave the cleanest exact 2mg market support. NuScience provided synonym and GRF-with-DAC framing but carried high-risk outcome and protocol copy. OROS had an exact 2mg URL but page content and COA rows identified CJC-1295 DAC 5mg, so it was not treated as clean 2mg evidence.

## Source Files Consulted

- `lib/content/products.ts`
- `lib/content/product-descriptions.ts`
- `SOURCING_LEDGER.md`
- `docs/product-research/wave-4/peg-mgf-2mg.md`
- `docs/product-research/wave-1/cjc-1295-no-dac-5mg.md`
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/research_operations_playbook.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/swiss-chems/product_cjc1295dac.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paradigm-peptides/catalog_1.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/strate-labs-llc/homepage.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/nuscience-peptides/product_14__cjc1295-dac.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/oros-research/product_10__cjc-1295-dac-2mg.md`

## Omitted Unsupported Or High-Risk Claims

- Half-life, long-acting, sustained-release, or comparative duration claims, even when vendor pages made them.
- Dosing, administration, reconstitution instructions, storage after preparation, schedules, protocols, or route language.
- GH, IGF-1, anti-aging, recovery, muscle, fat-loss, sleep, repair, wellness, performance, or subject-response outcomes.
- Human-use, veterinary-use, therapeutic, diagnostic, clinical, prescription, FDA-approved, disease, treatment, cure, or prevention language.
- Static purity, USA-made, cGMP, ISO, third-party-tested, sterility, endotoxin, or COA claims unless tied to operator-owned batch documentation.
- Vendor shipping, discounts, subscription, guarantee, review, and payment-process claims.
- The plain synonym `Modified GRF 1-29` without the DAC modifier, because it can describe the existing No DAC SKU.

## Thin-Corpus Note

The corpus is adequate for naming the SKU, distinguishing DAC from No DAC, assigning the GH-axis category, and supporting a 2mg premium-market comparator range. It is thin for clean, compliant exact-2mg DAC content: several useful pages include high-risk claims, while the OROS exact-URL capture conflicts with its own 5mg page content. Before implementation, supplier documentation should confirm exact CJC-1295 DAC identity, 2mg vial fill, lyophilized format, and batch-test fields.
