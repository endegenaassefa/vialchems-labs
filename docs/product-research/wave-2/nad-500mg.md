# NAD+ 500mg Product Research

## Proposed Product Object Fields

Proposed only. This worker does not modify shared catalog files.

```ts
{
  slug: 'nad-500mg',
  sku: 'NAD-500MG',
  name: 'NAD+, 500mg vial',
  shortName: 'NAD+',
  dose: '500mg',
  format: 'vial',
  listPriceCents: 7900,
  perMgCents: 15.8,
  category: 'metabolic',
  role: 'catalog-filler',
  position: 'operator-requested price, slightly below captured NAD+ median',
  shortDescription:
    'Nicotinamide adenine dinucleotide supplied as a lyophilized 500mg research vial. Coenzyme reference for redox, mitochondrial, sirtuin, and PARP-pathway laboratory models.',
}
```

## Variant Flag

The corpus clearly indicates 100mg NAD+ variants, including `raw-amino:nad-100mg` at $57.00 and a `nantong-guangyuan-chemical-gyc` 100mg row in `sku_distributions.md`. That variant should be flagged separately and should not replace the requested 500mg entry, which is directly supported by exact 500mg raw product pages.

## Long Description

NAD+ is nicotinamide adenine dinucleotide, an oxidized dinucleotide coenzyme found in living cells. The selected raw corpus supports a 500mg vial presentation and labels the material as a coenzyme or non-peptide small molecule rather than a peptide. For this catalog, it should read as a lyophilized research reference for metabolic-pathway work, not as a consumer wellness SKU.

The core research context is redox chemistry and cellular-energy model systems. Vendor pages consistently describe NAD+ as an electron carrier in redox reactions and as a reference for mitochondrial bioenergetics, oxidative phosphorylation, and ATP-pathway assays. That supports mechanism-level language only; it should not become claims about energy, vitality, performance, or human outcomes.

NAD+ also appears in the corpus as a substrate for sirtuins and PARP-family enzymes, with CD38 or cADPRS signaling sometimes discussed. Those terms can describe research directions: post-translational protein-modification models, DNA-repair pathway assays, and intracellular signaling studies. The page should present those as assay contexts, not product benefits.

The 500mg format is directly attested by Prime Lab Peptides, OROS Research, Pepsynth Labs, Genoscience, and Planet Peptide. Several pages list lyophilized powder, CAS 53-84-9, molecular weight near 663.43 g/mol, and batch or COA language. Formula and PubChem identifiers vary by source rendering, so final identity details should defer to the operator's own lot documentation.

At $79, the requested price equals $0.158/mg. That is near the aggregate NAD+ median captured in sku_distributions.md and close to the 500mg-specific signal, while still below several exact 500mg raw pages. This makes the SKU a catalog-completion item rather than a price-led loss leader.

Public copy should stay clinical-commerce and RUO-specific: compound identity, vial size, research category, qualified-researcher access controls, and batch-level analytical traceability only. Avoid reconstitution, dosing, administration, longevity, disease, supplement, or human-use language. This material should be framed only for controlled laboratory, analytical, and in vitro research workflows, with no veterinary, diagnostic, clinical, or therapeutic positioning.

Word count: 310 words across 6 paragraphs.

## Category And Role Rationale

Category: `metabolic`. NAD+ is not a peptide in the strict sequence sense, but the raw corpus places it beside research-peptide catalogs and describes it as a coenzyme for redox, mitochondrial bioenergetics, sirtuin, PARP, and cellular-energy pathway models. Among the existing category union, `metabolic` is the closest compliant navigation lane. It does not fit recovery, GH-axis, cosmetic-pathway, nootropic, or immune as the primary product category.

Role: `catalog-filler`. NAD+ has real corpus support, but it is outside the locked opening SKU set and has lower aggregate coverage than core peptide SKUs. The requested $79 price is near the captured median rather than a major undercut, so it should complete the metabolic/coenzyme research lane instead of functioning as a launch loss-leader or primary volume driver.

## Corpus Workflow Notes

- Read the required site files before writing: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Ran targeted searches for `NAD+`, `NAD`, and `nicotinamide adenine dinucleotide` across the prioritized corpus paths: `02_claude_code_outputs`, `01_strategic_frame`, `04_synthesis`, `DECISIONS`, and `03_final`.
- Priority matches were found in `02_claude_code_outputs/sku_distributions.md`, `02_claude_code_outputs/checkpoint_4_tier2_summary.md`, `02_claude_code_outputs/DISCOVERY_RUN_FINAL_DOCUMENT.md`, `02_claude_code_outputs/slice_B2_influencer_tier_map.md`, and `01_strategic_frame/research_operations_playbook.md`.
- `04_synthesis`, `DECISIONS`, and `03_final` had no NAD+ product-support matches in the targeted search. `DECISIONS/compliance_posture.md` and `DECISIONS/source_terms.md` were still consulted for compliance posture and source-term limits.
- Ran matching-directory checks for `nad` and `nicotinamide`; no matching corpus directories were found.
- Raw fetch review was limited to the top five exact 500mg NAD+ product pages with direct product support: Prime Lab Peptides, OROS Research, Pepsynth Labs, Genoscience, and Planet Peptide.
- The 100mg variant flag comes from `sku_distributions.md`; the proposed product object remains the requested 500mg vial because exact 500mg pages support it.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-1/mots-c-10mg.md` (format precedent only)
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/checkpoint_4_tier2_summary.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/DISCOVERY_RUN_FINAL_DOCUMENT.md`
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/research_operations_playbook.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/prime-lab-peptides/product_16__nad-500mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/oros-research/product_16__nad-500mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/pepsynth-labs/product_11__nad-500mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/genoscience/product_6__nad-500mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_12__nad-500mg.md`

## Omitted Unsupported Claims

- Human outcome, clinical-use, therapeutic, diagnostic, supplement, wellness, vitality, performance, or anti-aging claims.
- Dosing, route, administration, preparation, reconstitution, injection, ingestion, or protocol guidance.
- Disease-specific and disorder-adjacent claims from raw vendor pages, including claims tied to neurodegenerative models, ischemic stress, obesity, hepatitis, kidney injury, cardiac injury, insulin resistance, and metabolic disorders.
- Customer-facing claims around healthspan extension, cellular rejuvenation, neuroprotection, cognitive function, physical activity, lipid profile, weight gain, liver function, kidney function, cardiac function, or skeletal function.
- Vendor-specific quality claims such as cGMP, ISO, U.S. formulation, sterility, endotoxin testing, heavy-metals testing, microbial testing, purity percentages, or COA availability unless the operator has matching lot-specific documentation.
- Formula, PubChem, and buffer-state assertions in final copy until the operator's own batch COA resolves source rendering differences.

## Thin-Corpus Note

The corpus is not thin for 500mg SKU existence: five exact raw product pages support the requested vial-size entry, and the aggregate distribution captures NAD+ as a priced vial-format category. It is thinner than core launch peptides for high-priority strategic support: NAD+ is not in the locked opening SKU set, has no `04_synthesis`, `DECISIONS`, or `03_final` product-support matches, and the aggregate distribution records only 9 carrying vendors and 12 priced rows. Copy should therefore stay conservative and mechanism-level.
