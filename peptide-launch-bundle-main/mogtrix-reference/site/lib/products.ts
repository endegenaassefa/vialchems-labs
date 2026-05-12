import { canonicalCatalogProducts } from "@/lib/catalog-seed";
import type { Product, ProductCategory } from "@/lib/types";

export const products: Product[] = canonicalCatalogProducts.map((product) => ({
  id: product.id,
  slug: product.slug,
  sku: product.sku,
  name: product.name,
  summary: product.summary,
    category: product.category,
    format: product.format,
    priceCents: product.priceCents,
    checkoutEnabled: product.checkoutEnabled,
    researchUseOnly: product.researchUseOnly,
    storage: product.storage
  }));

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function filterProducts(input: { query?: string; category?: ProductCategory | "all" }) {
  const query = input.query?.trim().toLowerCase() ?? "";
  const category = input.category ?? "all";

  return products.filter((product) => {
    const matchesQuery = !query || [product.name, product.sku, product.summary].some((value) => value.toLowerCase().includes(query));
    const matchesCategory = category === "all" || product.category === category;
    return matchesQuery && matchesCategory;
  });
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
