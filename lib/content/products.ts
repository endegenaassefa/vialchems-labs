/**
 * Catalog seed metadata.
 *
 * v1.3 — catalog expanded from 7 → 16 SKUs + 1 → 3 bundles per operator
 * direction (more density à la peer reference catalogs). The 9 added SKUs
 * are deliberately compliance-safe per Iron Law 2.7 + 2.14: no GLP-1 class,
 * no Tirzepatide / Semaglutide / Retatrutide / Tesamorelin, no
 * bacteriostatic water, no SS-31, no PT-141. Each addition is a research
 * peptide with established in vitro / animal-model literature and no
 * FDA-approved drug analog in the US that would invite enforcement
 * comparison. Iron Law 2.11: canonical names only, no obfuscated codes.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5/2.19).
 * Each new shortDescription audited against assertMarketingCopySafe in
 * lib/compliance.ts; verified by tests/unit/catalog-safety.test.ts which
 * iterates the full products array.
 */

export type ProductCategory =
  | 'recovery'
  | 'gh-axis'
  | 'cosmetic-pathway'
  | 'metabolic'
  | 'nootropic'
  | 'immune';

export interface Product {
  slug: string;
  sku: string;
  name: string;
  shortName: string;
  dose: string;
  format: 'vial';
  listPriceCents: number;
  perMgCents: number;
  category: ProductCategory;
  role: 'loss-leader' | 'volume-driver' | 'catalog-filler';
  position: string;
  shortDescription: string;
}

export interface Bundle {
  slug: string;
  sku: string;
  name: string;
  constituents: string[];
  listPriceCents: number;
  effectiveDiscountPct: number;
  description: string;
}

export const products: Product[] = [
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
  },
  {
    slug: 'tb-500-5mg',
    sku: 'TB-500-5MG',
    name: 'TB-500, 5mg vial',
    shortName: 'TB-500',
    dose: '5mg',
    format: 'vial',
    listPriceCents: 3400,
    perMgCents: 680,
    category: 'recovery',
    role: 'loss-leader',
    position: '5% below market median',
    shortDescription:
      'Synthetic 17-amino-acid C-terminal actin-binding fragment of thymosin beta-4. Studied in animal-model and in-vitro research on tissue repair and angiogenesis.',
  },
  {
    slug: 'ghk-cu-50mg',
    sku: 'GHK-CU-50MG',
    name: 'GHK-Cu, 50mg vial',
    shortName: 'GHK-Cu',
    dose: '50mg',
    format: 'vial',
    listPriceCents: 3400,
    perMgCents: 68,
    category: 'cosmetic-pathway',
    role: 'loss-leader',
    position: '9% below market median',
    shortDescription:
      'Bioactive tripeptide (Gly-His-Lys) complexed with copper. Studied in cell-culture research on fibroblast function and collagen metabolism.',
  },
  {
    slug: 'ipamorelin-10mg',
    sku: 'IPAMORELIN-10MG',
    name: 'Ipamorelin, 10mg vial',
    shortName: 'Ipamorelin',
    dose: '10mg',
    format: 'vial',
    listPriceCents: 5000,
    perMgCents: 500,
    category: 'gh-axis',
    role: 'volume-driver',
    position: 'just below 25th percentile',
    shortDescription:
      'Selective pentapeptide growth-hormone-releasing peptide agonist. Studied in animal-model research on isolated GH-axis activation.',
  },
  {
    slug: 'cjc-1295-no-dac-5mg',
    sku: 'CJC-1295-NO-DAC-5MG',
    name: 'CJC-1295 (no DAC), 5mg vial',
    shortName: 'CJC-1295 (no DAC)',
    dose: '5mg',
    format: 'vial',
    listPriceCents: 2500,
    perMgCents: 500,
    category: 'gh-axis',
    role: 'volume-driver',
    position: 'just below 25th percentile',
    shortDescription:
      'Synthetic 30-amino-acid GHRH agonist without Drug Affinity Complex. Research tool for acute pulsatile-secretion paradigm investigation.',
  },
  {
    slug: 'mots-c-10mg',
    sku: 'MOTS-C-10MG',
    name: 'MOTS-c, 10mg vial',
    shortName: 'MOTS-c',
    dose: '10mg',
    format: 'vial',
    listPriceCents: 4800,
    perMgCents: 480,
    category: 'metabolic',
    role: 'catalog-filler',
    position: 'market median',
    shortDescription:
      'Mitochondrial-derived 16-amino-acid peptide encoded within the mitochondrial genome. Studied in cell-culture and animal-model metabolic research.',
  },
  {
    slug: 'selank-10mg',
    sku: 'SELANK-10MG',
    name: 'Selank, 10mg vial',
    shortName: 'Selank',
    dose: '10mg',
    format: 'vial',
    listPriceCents: 4800,
    perMgCents: 480,
    category: 'nootropic',
    role: 'catalog-filler',
    position: 'just below median',
    shortDescription:
      'Synthetic heptapeptide derived from tuftsin. Studied in cell-culture and animal-model research on immune-cell activation and neuroprotection.',
  },
  /* ===== v1.3 catalog expansion (9 new SKUs) ===== */
  {
    slug: 'sermorelin-2mg',
    sku: 'SERMORELIN-2MG',
    name: 'Sermorelin, 2mg vial',
    shortName: 'Sermorelin',
    dose: '2mg',
    format: 'vial',
    listPriceCents: 3000,
    perMgCents: 1500,
    category: 'gh-axis',
    role: 'volume-driver',
    position: 'just below market median',
    shortDescription:
      'Synthetic 29-amino-acid analog of growth-hormone-releasing hormone (GHRH 1-29). Research tool for somatotroph activation studies in cell culture and animal models.',
  },
  {
    slug: 'ghrp-2-5mg',
    sku: 'GHRP-2-5MG',
    name: 'GHRP-2, 5mg vial',
    shortName: 'GHRP-2',
    dose: '5mg',
    format: 'vial',
    listPriceCents: 2500,
    perMgCents: 500,
    category: 'gh-axis',
    role: 'volume-driver',
    position: 'just below 25th percentile',
    shortDescription:
      'Synthetic hexapeptide growth-hormone-releasing-peptide. Studied in pituitary cell-culture research and animal-model investigations of the GH-secretagogue receptor pathway.',
  },
  {
    slug: 'ghrp-6-5mg',
    sku: 'GHRP-6-5MG',
    name: 'GHRP-6, 5mg vial',
    shortName: 'GHRP-6',
    dose: '5mg',
    format: 'vial',
    listPriceCents: 2500,
    perMgCents: 500,
    category: 'gh-axis',
    role: 'volume-driver',
    position: 'just below 25th percentile',
    shortDescription:
      'Synthetic hexapeptide GH secretagogue with a binding profile distinct from GHRP-2. Research tool for ghrelin-receptor pathway investigation in animal-model studies.',
  },
  {
    slug: 'hexarelin-2mg',
    sku: 'HEXARELIN-2MG',
    name: 'Hexarelin, 2mg vial',
    shortName: 'Hexarelin',
    dose: '2mg',
    format: 'vial',
    listPriceCents: 3000,
    perMgCents: 1500,
    category: 'gh-axis',
    role: 'catalog-filler',
    position: 'market median',
    shortDescription:
      'Synthetic six-amino-acid growth-hormone-releasing peptide. Studied in cell-culture research on GHS-receptor binding and in animal-model investigations of cardiac-tissue signaling.',
  },
  {
    slug: 'semax-30mg',
    sku: 'SEMAX-30MG',
    name: 'Semax, 30mg vial',
    shortName: 'Semax',
    dose: '30mg',
    format: 'vial',
    listPriceCents: 6000,
    perMgCents: 200,
    category: 'nootropic',
    role: 'volume-driver',
    position: 'just below market median',
    shortDescription:
      'Synthetic heptapeptide derived from ACTH (4-10). Subject of Russian-published research literature on neuropeptide signaling and cognitive-paradigm investigation in animal models.',
  },
  {
    slug: 'epitalon-50mg',
    sku: 'EPITALON-50MG',
    name: 'Epitalon, 50mg vial',
    shortName: 'Epitalon',
    dose: '50mg',
    format: 'vial',
    listPriceCents: 6000,
    perMgCents: 120,
    category: 'metabolic',
    role: 'catalog-filler',
    position: 'market median',
    shortDescription:
      'Synthetic tetrapeptide (Ala-Glu-Asp-Gly) of the Khavinson bioregulator class. Studied in cell-culture research on telomere-related cellular signaling and in animal-model longevity paradigms.',
  },
  {
    slug: 'thymosin-alpha-1-5mg',
    sku: 'THYMOSIN-ALPHA-1-5MG',
    name: 'Thymosin Alpha-1, 5mg vial',
    shortName: 'Thymosin α-1',
    dose: '5mg',
    format: 'vial',
    listPriceCents: 7500,
    perMgCents: 1500,
    category: 'immune',
    role: 'catalog-filler',
    position: 'market median',
    shortDescription:
      'Synthetic 28-amino-acid peptide identical to the naturally occurring thymic peptide. Studied in cell-culture and animal-model research on immune-cell signaling and lymphocyte differentiation.',
  },
  {
    slug: 'dsip-5mg',
    sku: 'DSIP-5MG',
    name: 'DSIP, 5mg vial',
    shortName: 'DSIP',
    dose: '5mg',
    format: 'vial',
    listPriceCents: 4500,
    perMgCents: 900,
    category: 'nootropic',
    role: 'catalog-filler',
    position: 'just below market median',
    shortDescription:
      'Delta Sleep-Inducing Peptide, a nine-amino-acid neuropeptide. Studied in animal-model research on circadian-rhythm signaling and central-nervous-system pathway investigation.',
  },
  {
    slug: 'kpv-5mg',
    sku: 'KPV-5MG',
    name: 'KPV, 5mg vial',
    shortName: 'KPV',
    dose: '5mg',
    format: 'vial',
    listPriceCents: 4500,
    perMgCents: 900,
    category: 'recovery',
    role: 'catalog-filler',
    position: 'just below market median',
    shortDescription:
      'Synthetic tripeptide (Lys-Pro-Val) corresponding to the C-terminal sequence of alpha-MSH. Studied in cell-culture research on inflammatory pathway signaling.',
  },
];

export const bundles: Bundle[] = [
  {
    slug: 'recovery-stack',
    sku: 'BUNDLE-RECOVERY-STACK',
    name: 'Recovery Stack',
    constituents: ['BPC-157-10MG', 'TB-500-5MG'],
    listPriceCents: 7700,
    effectiveDiscountPct: 12.5,
    description:
      'Pairs the gastric-protective peptide BPC-157 with the actin-binding TB-500 fragment. The recovery-pathway research bundle most-attested across the vendor universe (298 of 3388 SKU rows).',
  },
  /* ===== v1.3 bundle expansion ===== */
  {
    slug: 'gh-pulsatile-stack',
    sku: 'BUNDLE-GH-PULSATILE-STACK',
    name: 'GH Pulsatile Stack',
    constituents: ['CJC-1295-NO-DAC-5MG', 'IPAMORELIN-10MG'],
    listPriceCents: 7000,
    effectiveDiscountPct: 6.7,
    description:
      'Pairs the GHRH agonist CJC-1295 (no DAC) with the selective GHRP Ipamorelin. The most-attested research stack for GH-axis pulsatile-secretion paradigm investigation in animal models.',
  },
  {
    slug: 'khavinson-stack',
    sku: 'BUNDLE-KHAVINSON-STACK',
    name: 'Khavinson Bioregulator Stack',
    constituents: ['EPITALON-50MG', 'THYMOSIN-ALPHA-1-5MG'],
    listPriceCents: 12500,
    effectiveDiscountPct: 7.4,
    description:
      'Pairs Epitalon (Khavinson tetrapeptide) with Thymosin Alpha-1 (thymic peptide). Bundle for cell-culture and animal-model research on bioregulator-class peptide signaling.',
  },
];

export const productCategories: { id: ProductCategory; label: string }[] = [
  { id: 'recovery', label: 'Recovery' },
  { id: 'gh-axis', label: 'GH-Axis' },
  { id: 'cosmetic-pathway', label: 'Cosmetic Pathway' },
  { id: 'metabolic', label: 'Metabolic' },
  { id: 'nootropic', label: 'Nootropic' },
  { id: 'immune', label: 'Immune' },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getBundleBySlug(slug: string): Bundle | undefined {
  return bundles.find((b) => b.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatPerMg(cents: number): string {
  return `$${(cents / 100).toFixed(2)}/mg`;
}
