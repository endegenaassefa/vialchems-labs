"use client";

import { useEffect, useState } from "react";

import {
  mergeProductWithStorefrontContent,
  type StorefrontProduct
} from "@/lib/content/products";
import type { CartItem, Product } from "@/lib/types";

type CatalogRoutePayload = {
  products?: Product[];
  missingIds?: string[];
  error?: string;
};

export type CartCatalogRow = {
  item: CartItem;
  product: Product | StorefrontProduct;
};

export type CartCatalogState = {
  rows: CartCatalogRow[];
  loading: boolean;
  error: string | null;
  missingIds: string[];
  manualRequestIds: string[];
};

const fallbackCatalogError = "The Mogtrix catalog is unavailable right now.";

export function getCartCatalogNotice({
  error,
  missingIds,
  manualRequestIds
}: Pick<CartCatalogState, "error" | "missingIds" | "manualRequestIds">) {
  if (error) {
    return error;
  }

  if (manualRequestIds.length) {
    return `${manualRequestIds.length} cart record${
      manualRequestIds.length === 1 ? " is" : "s are"
    } outside the hosted checkout pilot. Move ${
      manualRequestIds.length === 1 ? "it" : "them"
    } to the manual request path before continuing.`;
  }

  if (!missingIds.length) {
    return null;
  }

  return `${missingIds.length} cart record${
    missingIds.length === 1 ? " is" : "s are"
  } no longer available in the canonical catalog. Remove ${
    missingIds.length === 1 ? "it" : "them"
  } before continuing.`;
}

export function useCartCatalogRows(items: CartItem[]): CartCatalogState {
  const [products, setProducts] = useState<Product[]>([]);
  const [missingIds, setMissingIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      if (!items.length) {
        setProducts([]);
        setMissingIds([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const ids = Array.from(new Set(items.map((item) => item.productId)));
        const response = await fetch(
          `/api/catalog?ids=${encodeURIComponent(ids.join(","))}`
        );
        const payload = (await response.json().catch(() => null)) as
          | CatalogRoutePayload
          | null;

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setProducts([]);
          setMissingIds([]);
          setError(
            typeof payload?.error === "string"
              ? payload.error
              : fallbackCatalogError
          );
          setLoading(false);
          return;
        }

        setProducts(Array.isArray(payload?.products) ? payload.products : []);
        setMissingIds(
          Array.isArray(payload?.missingIds) ? payload.missingIds : []
        );
        setError(null);
        setLoading(false);
      } catch {
        if (cancelled) {
          return;
        }

        setProducts([]);
        setMissingIds([]);
        setError(fallbackCatalogError);
        setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [items]);

  const productsById = new Map(
    products.map((product) => [
      product.id,
      mergeProductWithStorefrontContent(product) ?? product
    ])
  );
  const unresolvedIds = new Set(missingIds);
  const manualRequestIds = new Set<string>();
  const rows: CartCatalogRow[] = [];

  for (const item of items) {
    const product = productsById.get(item.productId);

    if (!product) {
      unresolvedIds.add(item.productId);
      continue;
    }

    if (!product.checkoutEnabled) {
      manualRequestIds.add(item.productId);
    }

    rows.push({ item, product });
  }

  return {
    rows,
    loading,
    error,
    missingIds: Array.from(unresolvedIds),
    manualRequestIds: Array.from(manualRequestIds)
  };
}
