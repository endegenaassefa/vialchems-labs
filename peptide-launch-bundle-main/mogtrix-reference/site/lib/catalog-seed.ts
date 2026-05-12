import { storefrontProducts } from "./content/products.ts";
import type {
  CatalogAvailabilityStatus,
  CatalogDocumentationStatus
} from "./db/types.ts";

export type CanonicalCatalogProduct = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  summary: string;
  category: "analytical" | "reference" | "handling";
  format: string;
  storage: string;
  priceCents: number;
  researchUseOnly: true;
  active: true;
  documentationStatus: CatalogDocumentationStatus;
  availabilityStatus: CatalogAvailabilityStatus;
  visibleToApproved: boolean;
  checkoutEnabled: boolean;
};

export const legacyPlaceholderProductIds = [
  "mtrx-reference-a",
  "mtrx-analytical-b",
  "mtrx-handling-c"
] as const;

function deriveDocumentationStatus(
  documentation: string
): CatalogDocumentationStatus {
  const normalized = documentation.toLowerCase();

  if (normalized.includes("coa-ready")) {
    return "coa-ready";
  }

  if (normalized.includes("pending")) {
    return "pending-records";
  }

  return "document-review";
}

function deriveAvailabilityStatus(
  index: number
): CatalogAvailabilityStatus {
  return index < 5 ? "requestable" : "limited-review";
}

export const canonicalCatalogProducts: CanonicalCatalogProduct[] =
  storefrontProducts.map((product, index) => ({
    id: product.slug,
    slug: product.slug,
    sku: product.catalogCode,
    name: product.name,
    summary: product.short,
    category: product.category,
    format: product.form,
    storage: product.storage,
    priceCents: product.basePriceCents,
    researchUseOnly: true,
    active: true,
    documentationStatus: deriveDocumentationStatus(product.documentation),
    availabilityStatus: deriveAvailabilityStatus(index),
    visibleToApproved: true,
    checkoutEnabled: deriveAvailabilityStatus(index) === "requestable"
  }));

function sqlString(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlBoolean(value: boolean) {
  return value ? "true" : "false";
}

export function buildCatalogProductsUpsertSql() {
  const values = canonicalCatalogProducts
    .map(
      (product) => `  (
    ${sqlString(product.id)},
    ${sqlString(product.slug)},
    ${sqlString(product.sku)},
    ${sqlString(product.name)},
    ${sqlString(product.summary)},
    ${sqlString(product.category)},
    ${sqlString(product.format)},
    ${sqlString(product.storage)},
    ${product.priceCents},
    ${sqlBoolean(product.researchUseOnly)},
    ${sqlBoolean(product.active)},
    ${sqlString(product.documentationStatus)},
    ${sqlString(product.availabilityStatus)},
    ${sqlBoolean(product.visibleToApproved)},
    ${sqlBoolean(product.checkoutEnabled)}
  )`
    )
    .join(",\n");

  return `insert into public.products (
  id,
  slug,
  sku,
  name,
  summary,
  category,
  format,
  storage,
  price_cents,
  research_use_only,
  active,
  documentation_status,
  availability_status,
  visible_to_approved,
  checkout_enabled
)
values
${values}
on conflict (id) do update
set slug = excluded.slug,
    sku = excluded.sku,
    name = excluded.name,
    summary = excluded.summary,
    category = excluded.category,
    format = excluded.format,
    storage = excluded.storage,
    price_cents = excluded.price_cents,
    research_use_only = excluded.research_use_only,
    active = excluded.active,
    documentation_status = excluded.documentation_status,
    availability_status = excluded.availability_status,
    visible_to_approved = excluded.visible_to_approved,
    checkout_enabled = excluded.checkout_enabled,
    updated_at = timezone('utc', now());`;
}
