/**
 * Catalog seed metadata. LOCKED via DECISIONS/opening_sku_set.md.
 *
 * Seven opening SKUs + Recovery Stack bundle. Verbatim 336-345 word product
 * descriptions live in `productDescriptions` (sourced from SUPER_PROMPT_v3
 * Appendix E.1, written in Phase 6).
 *
 * Iron Law 2.7 + 2.14: NO BAC water, NO tirzepatide, NO semaglutide,
 * NO retatrutide. Iron Law 2.11: canonical names only (no GLP1-S, ION-1S,
 * EDGE R3, etc.).
 */

export type ProductCategory =
  | 'recovery'
  | 'gh-axis'
  | 'cosmetic-pathway'
  | 'metabolic'
  | 'nootropic';

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
];

export const productCategories: { id: ProductCategory; label: string }[] = [
  { id: 'recovery', label: 'Recovery' },
  { id: 'gh-axis', label: 'GH-Axis' },
  { id: 'cosmetic-pathway', label: 'Cosmetic Pathway' },
  { id: 'metabolic', label: 'Metabolic' },
  { id: 'nootropic', label: 'Nootropic' },
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
