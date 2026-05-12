import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  CatalogUnavailableError,
  mapCatalogProductRow,
  type CatalogProductRow
} from "@/lib/catalog";
import type { Product } from "@/lib/types";

async function getCatalogClient() {
  return createServerSupabaseClient();
}

const catalogSelect = [
  "id",
  "slug",
  "sku",
  "name",
  "summary",
  "category",
  "format",
  "storage",
  "price_cents",
  "checkout_enabled",
  "research_use_only"
].join(", ");

function mapCatalogRows(rows: unknown[]): Product[] {
  return rows.map((row) => mapCatalogProductRow(row as CatalogProductRow));
}

export async function listCatalogProducts() {
  const supabase = await getCatalogClient();
  if (!supabase) {
    throw new CatalogUnavailableError();
  }

  const { data, error } = await supabase
    .from("products")
    .select(catalogSelect)
    .eq("active", true)
    .eq("research_use_only", true)
    .eq("visible_to_approved", true)
    .order("name", { ascending: true });

  if (error || !data) {
    throw new CatalogUnavailableError();
  }

  return mapCatalogRows(data as unknown[]);
}

export async function getCatalogProductsByIds(ids: string[]) {
  const normalizedIds = Array.from(
    new Set(ids.map((value) => value.trim()).filter(Boolean))
  );
  if (!normalizedIds.length) return [];

  const supabase = await getCatalogClient();
  if (!supabase) {
    throw new CatalogUnavailableError();
  }

  const { data, error } = await supabase
    .from("products")
    .select(catalogSelect)
    .in("id", normalizedIds)
    .eq("active", true)
    .eq("research_use_only", true)
    .eq("visible_to_approved", true);

  if (error || !data) {
    throw new CatalogUnavailableError();
  }

  return mapCatalogRows(data as unknown[]);
}

export async function getCatalogProductBySlug(slug: string) {
  const supabase = await getCatalogClient();
  if (!supabase) {
    throw new CatalogUnavailableError();
  }

  const { data, error } = await supabase
    .from("products")
    .select(catalogSelect)
    .eq("slug", slug)
    .eq("active", true)
    .eq("research_use_only", true)
    .eq("visible_to_approved", true)
    .maybeSingle();

  if (error) {
    throw new CatalogUnavailableError();
  }

  if (!data) return null;

  return mapCatalogProductRow(data as unknown as CatalogProductRow);
}
