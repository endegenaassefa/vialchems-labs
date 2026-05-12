import "server-only";

import { getStorefrontProductContent } from "@/lib/content/products";
import type {
  CatalogItem,
  CatalogItemUpdate
} from "@/lib/db/types";
import { CatalogUnavailableError } from "@/lib/catalog";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

type CatalogItemRow = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  summary: string;
  category: string;
  price_cents: number;
  active: boolean;
  documentation_status: CatalogItem["documentationStatus"];
  availability_status: CatalogItem["availabilityStatus"];
  visible_to_approved: boolean;
  checkout_enabled: boolean;
  created_at: string;
  updated_at: string;
};

function mapRow(row: CatalogItemRow): CatalogItem {
  const content = getStorefrontProductContent(row.slug);

  return {
    id: row.id,
    slug: row.slug,
    catalogCode: row.sku,
    categoryTitle: content?.categoryTitle ?? row.category,
    title: row.name,
    neutralDescriptor: row.summary,
    priceCents: row.price_cents,
    active: row.active,
    documentationStatus: row.documentation_status,
    availabilityStatus: row.availability_status,
    visibleToApproved: row.visible_to_approved,
    checkoutEnabled: row.checkout_enabled,
    submittedAt: row.created_at,
    updatedAt: row.updated_at,
    source: "supabase"
  };
}

const adminCatalogSelect = [
  "id",
  "slug",
  "sku",
  "name",
  "summary",
  "category",
  "price_cents",
  "active",
  "documentation_status",
  "availability_status",
  "visible_to_approved",
  "checkout_enabled",
  "created_at",
  "updated_at"
].join(", ");

export async function listCatalogItems({
  includeHidden = false
}: { includeHidden?: boolean } = {}): Promise<CatalogItem[]> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    throw new CatalogUnavailableError(
      "Catalog review data is unavailable right now."
    );
  }

  let query = supabase
    .from("products")
    .select(adminCatalogSelect)
    .eq("research_use_only", true)
    .order("name", { ascending: true });

  if (!includeHidden) {
    query = query.eq("active", true).eq("visible_to_approved", true);
  }

  const { data, error } = await query.returns<CatalogItemRow[]>();

  if (error || !data) {
    throw new CatalogUnavailableError(
      "Catalog review data is unavailable right now."
    );
  }

  return data.map(mapRow);
}

export async function createCatalogItem() {
  throw new CatalogUnavailableError(
    "Canonical catalog rows are seeded from the storefront fixture."
  );
}

export async function updateCatalogItem(
  id: string,
  update: CatalogItemUpdate
): Promise<CatalogItem | null> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    throw new CatalogUnavailableError(
      "Catalog review data is unavailable right now."
    );
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      documentation_status: update.documentationStatus,
      availability_status: update.availabilityStatus,
      visible_to_approved: update.visibleToApproved,
      checkout_enabled: update.checkoutEnabled
    })
    .eq("id", id)
    .eq("research_use_only", true)
    .select(adminCatalogSelect)
    .maybeSingle<CatalogItemRow>();

  if (error) {
    throw new CatalogUnavailableError(
      "Catalog review data is unavailable right now."
    );
  }

  if (!data) {
    return null;
  }

  await supabase.from("admin_audit_log").insert({
    actor_id: update.reviewedBy,
    action: "catalog_product.updated",
    target_table: "products",
    target_id: id,
    metadata: {
      documentationStatus: update.documentationStatus,
      availabilityStatus: update.availabilityStatus,
      visibleToApproved: update.visibleToApproved,
      checkoutEnabled: update.checkoutEnabled
    }
  });

  return mapRow(data);
}
