import type { Product, ProductCategory } from "@/lib/types";

export class CatalogUnavailableError extends Error {
  constructor(message = "The Mogtrix catalog is unavailable right now.") {
    super(message);
    this.name = "CatalogUnavailableError";
  }
}

export type CatalogProductRow = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  summary: string;
  category: ProductCategory;
  format: string;
  storage: string;
  price_cents: number;
  checkout_enabled: boolean;
  research_use_only: boolean;
};

export function mapCatalogProductRow(row: CatalogProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    summary: row.summary,
    category: row.category,
    format: row.format,
    storage: row.storage,
    priceCents: row.price_cents,
    checkoutEnabled: row.checkout_enabled,
    researchUseOnly: row.research_use_only
  };
}

export function filterProducts(products: Product[], input: { query?: string; category?: ProductCategory | "all" }) {
  const query = input.query?.trim().toLowerCase() ?? "";
  const category = input.category ?? "all";

  return products.filter((product) => {
    const matchesQuery = !query || [product.name, product.sku, product.summary].some((value) => value.toLowerCase().includes(query));
    const matchesCategory = category === "all" || product.category === category;
    return matchesQuery && matchesCategory;
  });
}

export function getProductBySlug(products: Product[], slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
