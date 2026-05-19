import {
  bundles,
  formatPrice,
  getProductAvailability,
  isPurchasableProduct,
  launchProductOrder,
  products,
  sortProductsByLaunchOrder,
  type CatalogAvailability,
  type Bundle,
  type Product,
} from "@/lib/content/products";

export type CatalogItem =
  | {
      kind: "product";
      slug: string;
      sku: string;
      name: string;
      shortName: string;
      dose: string;
      family: string;
      priceCents: number;
      description: string;
      restricted: boolean;
      availability: CatalogAvailability;
      purchasable: boolean;
      stock: number;
      image: string;
      marketRange: string;
      source: Product;
    }
  | {
      kind: "bundle";
      slug: string;
      sku: string;
      name: string;
      shortName: string;
      dose: string;
      family: string;
      priceCents: number;
      description: string;
      restricted: boolean;
      availability: CatalogAvailability;
      purchasable: boolean;
      stock: number;
      image: string;
      marketRange: string;
      source: Bundle;
    };

export const catalogFamilyOrder = [
  "Reference peptide",
  "Secretagogue",
  "Blend",
  "Neuropeptide",
  "Metabolic peptide",
  "Research peptide",
  "Growth factor",
  "Popular stack",
] as const;

const blendSlugs = new Set([
  "cjc-1295-ipamorelin-5mg",
  "cjc-1295-ipamorelin-10mg",
  "sermorelin-ipamorelin-10mg",
]);

const familyBySlug = new Map<string, string>([
  ["bpc-157-10mg", "Reference peptide"],
  ["checkout-verification-1usd", "Research peptide"],
  ["tb-500-5mg", "Reference peptide"],
  ["tb-500-10mg", "Reference peptide"],
  ["ghk-cu-50mg", "Reference peptide"],
  ["kpv-5mg", "Reference peptide"],
  ["kpv-10mg", "Reference peptide"],
  ["kpv-500mcg", "Reference peptide"],
  ["ipamorelin-10mg", "Secretagogue"],
  ["ipamorelin-5mg", "Secretagogue"],
  ["cjc-1295-no-dac-5mg", "Secretagogue"],
  ["cjc-1295-dac-2mg", "Secretagogue"],
  ["cjc-1295-ipamorelin-5mg", "Blend"],
  ["sermorelin-2mg", "Secretagogue"],
  ["sermorelin-5mg", "Secretagogue"],
  ["tesamorelin-5mg", "Secretagogue"],
  ["ghrp-2-5mg", "Secretagogue"],
  ["ghrp-6-5mg", "Secretagogue"],
  ["hexarelin-2mg", "Secretagogue"],
  ["selank-10mg", "Neuropeptide"],
  ["semax-30mg", "Neuropeptide"],
  ["semax-10mg", "Neuropeptide"],
  ["dsip-5mg", "Neuropeptide"],
  ["mots-c-10mg", "Metabolic peptide"],
  ["nad-500mg", "Metabolic peptide"],
  ["klow-80mg", "Metabolic peptide"],
  ["reta-10mg", "Metabolic peptide"],
  ["tirz-25mg", "Metabolic peptide"],
  ["epitalon-50mg", "Metabolic peptide"],
  ["epitalon-10mg", "Metabolic peptide"],
  ["aod-9604-5mg", "Metabolic peptide"],
  ["pt-141-10mg", "Research peptide"],
  ["melanotan-ii-10mg", "Research peptide"],
  ["kisspeptin-10-10mg", "Research peptide"],
  ["thymosin-alpha-1-5mg", "Research peptide"],
  ["thymosin-alpha-1-10mg", "Research peptide"],
  ["ll-37-5mg", "Research peptide"],
  ["follistatin-344-1mg", "Growth factor"],
  ["igf-1-lr3-1mg", "Growth factor"],
  ["peg-mgf-2mg", "Growth factor"],
  ["igf-1-des-1mg", "Growth factor"],
]);

function catalogFamily(product: Product) {
  if (blendSlugs.has(product.slug)) return "Blend";
  return familyBySlug.get(product.slug) ?? "Research peptide";
}

const bundleImageBySlug: Record<string, string> = {
  "glow-stack": "vialchemlabs_glow-stack_suggested-169.png",
  "longevity-stack": "vialchemlabs_longevity-stack_suggested-179.png",
  "neuro-stack": "vialchemlabs_neuro-stack_suggested-69.png",
  "recovery-stack": "vialchemlabs_recovery-stack_suggested-129.png",
  "wolverine-stack": "vialchemlabs_wolverine-stack_suggested-99.png",
};

export function productImagePath(slug: string) {
  if (products.some((product) => product.slug === slug)) {
    return `/product-shots/${slug}.png`;
  }
  const file =
    bundleImageBySlug[slug] ?? "vialchemlabs_recovery-stack_suggested-129.png";
  return `/v2-assets/vialchemlabs-products/${file}`;
}

export function skuCode(sku: string) {
  const product = products.find((p) => p.sku === sku);
  if (product) {
    const launchOrder = launchProductOrder.get(product.slug);
    if (launchOrder !== undefined) {
      return `VC-${String(launchOrder + 1).padStart(3, "0")}`;
    }
    if (getProductAvailability(product) === "test-only") return "VC-TEST";
    const requestIndex = products
      .filter(
        (candidate) => getProductAvailability(candidate) === "request-only",
      )
      .findIndex((candidate) => candidate.sku === sku);
    return `VC-R${String(requestIndex + 1).padStart(3, "0")}`;
  }
  const bundleIndex = bundles.findIndex((b) => b.sku === sku);
  return `VC-R${String(products.length + bundleIndex + 1).padStart(3, "0")}`;
}

export function isRestricted(product: Product) {
  return product.category === "gh-axis" || product.role === "volume-driver";
}

function productStock(product: Product, index: number) {
  const availability = getProductAvailability(product);
  if (availability === "request-only") return 0;
  if (availability === "test-only") return 1;
  return 18 + ((index * 5) % 18);
}

function catalogSortValue(item: CatalogItem) {
  if (item.kind === "product") {
    const launchOrder = launchProductOrder.get(item.slug);
    if (launchOrder !== undefined) return launchOrder;
    if (item.availability === "test-only") return 9000;
    return 1000 + products.findIndex((product) => product.slug === item.slug);
  }
  return 2000 + bundles.findIndex((bundle) => bundle.slug === item.slug);
}

const productCatalogItems = [...products]
  .sort(sortProductsByLaunchOrder)
  .map((product, index): CatalogItem => {
    const availability = getProductAvailability(product);
    return {
      kind: "product",
      slug: product.slug,
      sku: product.sku,
      name: product.name.replace(", ", " · "),
      shortName: product.shortName,
      dose: product.dose,
      family: catalogFamily(product),
      priceCents: product.listPriceCents,
      description: product.shortDescription,
      restricted: isRestricted(product),
      availability,
      purchasable: isPurchasableProduct(product),
      stock: productStock(product, index),
      image: productImagePath(product.slug),
      marketRange: product.position,
      source: product,
    };
  });

const bundleCatalogItems = bundles.map(
  (bundle): CatalogItem => ({
    kind: "bundle",
    slug: bundle.slug,
    sku: bundle.sku,
    name: bundle.name,
    shortName: bundle.name,
    dose: "Set",
    family: "Popular stack",
    priceCents: bundle.listPriceCents,
    description: bundle.description,
    restricted: true,
    availability: "request-only",
    purchasable: false,
    stock: 0,
    image: productImagePath(bundle.slug),
    marketRange: `${bundle.effectiveDiscountPct.toFixed(1)}% effective discount`,
    source: bundle,
  }),
);

export const allCatalogItems: CatalogItem[] = [
  ...productCatalogItems,
  ...bundleCatalogItems,
].sort((a, b) => catalogSortValue(a) - catalogSortValue(b));

export const catalogItems: CatalogItem[] = allCatalogItems.filter(
  (item) => item.availability === "in-stock",
);

export type CatalogDisplayItem = CatalogItem & {
  variants: CatalogItem[];
};

export function groupCatalogDisplayItems(
  items: CatalogItem[],
): CatalogDisplayItem[] {
  const groups = new Map<string, CatalogItem[]>();

  for (const item of items) {
    const key = `${item.kind}:${item.shortName.toLowerCase()}`;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  return [...groups.values()].map((variants) => ({
    ...variants[0],
    variants,
  }));
}

export const catalogDisplayItems = groupCatalogDisplayItems(catalogItems);

export function getCatalogItem(slug: string) {
  return allCatalogItems.find((item) => item.slug === slug);
}

export function displayPrice(cents: number) {
  return formatPrice(cents);
}
