# Longevity Stack Research

## Proposed Bundle Fields

Proposed only. This worker does not modify shared catalog files.

```ts
{
  slug: 'longevity-stack',
  sku: 'BUNDLE-LONGEVITY-STACK',
  name: 'Longevity Stack',
  constituents: ['MOTS-C-10MG', 'EPITALON-10MG', 'NAD-500MG'],
  listPriceCents: 17900,
  effectiveDiscountPct: 13.5,
  description:
    'Three-vial metabolic-pathway research bundle pairing MOTS-c 10mg, Epitalon 10mg, and NAD+ 500mg. Use as RUO pathway/category framing only: mitochondrial-derived peptide, Khavinson tetrapeptide, and redox coenzyme reference materials.',
}
```

A la carte total from the current catalog is $207.00, so the requested $179.00 bundle price creates a $28.00 discount, or 13.5% effective discount.

## Stack Long Description

Longevity Stack is proposed as a three-vial research bundle containing MOTS-c 10mg, Epitalon 10mg, and NAD+ 500mg. The name should be treated as an operator-selected catalog label, not as a statement about expected biological outcomes. The compliant public frame is metabolic-pathway, mitochondrial-signaling, redox-coenzyme, and Khavinson-bioregulator research taxonomy for qualified laboratory purchasers. That boundary should be visible anywhere the stack name appears.

MOTS-c supplies the mitochondrial-derived peptide side of the bundle. Existing catalog copy and component research identify MOTS-c as a 16-amino-acid peptide encoded within the mitochondrial 12S rRNA region. Suitable pathway language stays at the level of mitochondrial-derived peptide classification, mitochondrial-nuclear communication models, AMPK-pathway investigation, folate-methionine cycle mapping, and stress-responsive gene-expression research.

Epitalon supplies the Khavinson tetrapeptide side. The supported identity frame is synthetic Ala-Glu-Asp-Gly, also abbreviated AEDG, with Epitalon and Epithalon appearing as corpus spellings. Suitable research context includes telomere-related cellular signaling, telomerase-marker investigation, chromatin or gene-expression models, and pineal-axis or circadian-pathway laboratory systems. Those topics should remain research categories rather than claims about subject-level effects.

NAD+ supplies the non-peptide coenzyme reference. The current SKU is nicotinamide adenine dinucleotide in a 500mg research-vial presentation, and the existing description places it in redox, mitochondrial, sirtuin, and PARP-pathway laboratory models. Although NAD+ is not a peptide in the strict sequence sense, the catalog already places it in the metabolic lane beside peptide research materials.

As a bundle, the relationship among the three components should be presented as catalog convenience and pathway adjacency, not synergy. The corpus did not surface an exact MOTS-c + Epitalon + NAD+ stack page. It did surface adjacent MOTS-c/NAD+ blend patterns and separate Epitalon catalog support, so the safest page is a multi-vial bundle description rather than a combined-vial, protocol, or interaction narrative. The storefront can describe the bundle as three separately specified research materials under one bundle SKU, with each component retaining its own identity, vial strength, and lot documentation.

Quality language should remain batch-specific. Suitable fields include lot number, test date, laboratory name, COA link, HPLC field, mass-oriented identity confirmation, and applicable endotoxin, microbial, heavy-metal, or sterility fields only when supported by the operator's own inventory records. The page should include strict research-use-only restrictions and no preparation, route, exposure amount, diagnostic, clinical, human-use, veterinary-use, or practical application guidance.

Word count: 373 words across 6 paragraphs.

## Rationale

The current catalog already contains all three constituent SKUs, so the proposed bundle does not require new component objects. The bundle price is commercially coherent with existing bundle mechanics: $179.00 is 13.5% below the $207.00 catalog total, close to the existing Recovery Stack discount pattern while still preserving premium positioning for the three underlying catalog-filler components.

Corpus support is strongest for individual component availability and weaker for this exact three-item stack. MOTS-c is in the locked opening SKU set and has dedicated component research. Epitalon 10mg and NAD+ 500mg have dedicated Wave 2 reports and current catalog entries. Raw pages support adjacent marketplace behavior: MyPurePeptide and BioLongevity list MOTS-c/NAD+ blend patterns, while RevivaCore lists standalone MOTS-c, NAD+, Epitalon, a Cellular Energy Stack, and a Metabolic Ignition Kit.

The report should therefore support the bundle as a documentation-led, three-vial research-category grouping. It should not claim this exact stack is broadly attested, and it should not import outcome-led language from competitor pages.

## Component-Role Explanation

- **MOTS-c 10mg:** mitochondrial-derived peptide reference for mitochondrial-signaling, AMPK-pathway, mitochondrial-nuclear communication, and stress-responsive gene-expression models.
- **Epitalon 10mg:** Khavinson-class AEDG tetrapeptide reference for telomere-related cellular signaling, telomerase-marker, gene-expression, chromatin, pineal-axis, and circadian-pathway models.
- **NAD+ 500mg:** nicotinamide adenine dinucleotide coenzyme reference for redox, mitochondrial bioenergetics, sirtuin-family, PARP-family, and intracellular-signaling laboratory models.

## Search Notes

- Read the required repo files first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Searched `/root/peptide-launch-bundle/corpus` for `Longevity Stack`; no exact matches were found.
- Searched component-pair and stack terms including `MOTS-c Epitalon`, `Epitalon NAD`, `MOTS-c NAD`, `NAD+ MOTS-c`, `bundle`, `stack`, `combo`, `blend`, and `kit`.
- Priority decision and synthesis review found useful compliance and opening-set context, but `04_synthesis/unified_decision_brief.md` and `04_synthesis/master_channel_ranking.md` are placeholders and provide no product-specific support.
- Strongest adjacent raw signals were MOTS-c/NAD+ blend listings from MyPurePeptide and BioLongevity, plus RevivaCore's metabolic-category products and named stack/kit catalog entries.
- No raw page read in full supported the exact requested MOTS-c 10mg + Epitalon 10mg + NAD+ 500mg bundle composition.

## Sources

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-1/mots-c-10mg.md`
- `/root/peptide-site/docs/product-research/wave-2/epitalon-10mg.md`
- `/root/peptide-site/docs/product-research/wave-2/nad-500mg.md`
- `/root/peptide-site/docs/research/sub_2_pricing.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/mypurepeptide/homepage.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/mypurepeptide/lab_tests.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/biolongevity-labs/catalog_1.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/biolongevity-labs/catalog_2.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/revivacore/catalog_1.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/revivacore/product_1__mots-c.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/revivacore/product_1__nad-plus.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/revivacore/product_1__epitalon.md`

## Omitted Claims

- No claims about lifespan, healthspan, age reversal, rejuvenation, vitality, cosmetic benefit, performance, body composition, cognition, sleep, disease risk, or subject-level outcomes.
- No treatment, prevention, diagnostic, clinical, medical, supplement, dietary, cosmetic, compounding, human-use, or veterinary-use framing.
- No dosing, route, administration, injection, ingestion, preparation, reconstitution, exposure amount, timing, cycle, schedule, or protocol guidance.
- No synergy, amplification, combined-effect, or "works together" claim for the three constituents.
- No vendor-specific purity, facility, USA-made, sterility, endotoxin, heavy-metal, microbial, shipping, review, guarantee, or COA claims unless the operator has matching lot-specific documentation.

## Thin-Corpus Note

This is a thin-corpus stack. The individual components are well supported in current catalog files and prior component reports, and adjacent raw pages support MOTS-c/NAD+ blend behavior. The exact three-vial Longevity Stack composition was not found in the corpus, so the bundle should launch only as conservative RUO pathway/category framing with explicit documentation limits.
