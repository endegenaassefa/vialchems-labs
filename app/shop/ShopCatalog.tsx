/**
 * ShopCatalog — client island for /shop page.
 *
 * Owns: search query, category filter set, in-stock toggle, sort selection.
 * Renders the filtered live catalog grid with multi-strength variants grouped.
 * Non-live materials stay off the public grid and are handled through the
 * custom-request path.
 *
 * Search uses Fuse.js across name + sku + category label (fuzzy threshold 0.4).
 *
 * v4 design overhaul: removed the placebo "In stock only" toggle (it was a
 * `list.filter(() => true)` no-op until real inventory lands in Phase 9).
 * Re-introduce when product.inStock is wired to real data; until then, do not
 * render UI for state we cannot honor. Iron Law spirit: do not fake controls.
 */
"use client";

import Link from "next/link";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button, buttonClassNames } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { ProductStudioVisual } from "@/components/ui/ProductStudioVisual";
import { EmptyState } from "@/components/ui/EmptyState";
import { StaggerReveal } from "@/components/ui/StaggerReveal";
import { useCartStore } from "@/lib/cart-store";
import {
  formatPerMg,
  formatPrice,
  isPublicLaunchProduct,
  isPurchasableProduct,
  productCategories,
  products,
  sortProductsByLaunchOrder,
  type Product,
  type ProductCategory,
} from "@/lib/content/products";

type SortKey = "price-asc" | "price-desc" | "name-asc" | "newest";
type CatalogProductDisplay = Product & {
  variants: Product[];
  variantSearch: string;
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
  { value: "name-asc", label: "Name: A → Z" },
];

function groupProductVariants(productsForCatalog: Product[]) {
  const groups = new Map<string, Product[]>();

  for (const product of productsForCatalog) {
    const key = product.shortName.toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), product]);
  }

  return [...groups.values()].map((variants): CatalogProductDisplay => {
    const variantSearch = variants
      .map((variant) =>
        [
          variant.name,
          variant.shortName,
          variant.sku,
          variant.dose,
          formatPrice(variant.listPriceCents),
          formatPerMg(variant.perMgCents),
        ].join(" "),
      )
      .join(" ");

    return {
      ...variants[0],
      variants,
      variantSearch,
    };
  });
}

function minVariantPrice(product: CatalogProductDisplay) {
  return Math.min(...product.variants.map((variant) => variant.listPriceCents));
}

function maxVariantPrice(product: CatalogProductDisplay) {
  return Math.max(...product.variants.map((variant) => variant.listPriceCents));
}

function displayPriceLabel(product: CatalogProductDisplay) {
  return product.variants
    .map((variant) => formatPrice(variant.listPriceCents))
    .join(" / ");
}

function displayDoseLabel(product: CatalogProductDisplay) {
  return product.variants.map((variant) => variant.dose).join(" / ");
}

function displaySkuLabel(product: CatalogProductDisplay) {
  return product.variants.map((variant) => variant.sku).join(" / ");
}

function displayPerMgLabel(product: CatalogProductDisplay) {
  return product.variants
    .map((variant) => formatPerMg(variant.perMgCents))
    .join(" / ");
}

export function ShopCatalog() {
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<
    Set<ProductCategory>
  >(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const catalogProducts = useMemo(
    () =>
      groupProductVariants(
        products
          .filter((product) => isPublicLaunchProduct(product))
          .sort(sortProductsByLaunchOrder),
      ),
    [],
  );

  const fuse = useMemo(
    () =>
      new Fuse(catalogProducts, {
        keys: ["name", "sku", "category", "shortName", "variantSearch"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [catalogProducts],
  );

  const visible = useMemo<CatalogProductDisplay[]>(() => {
    let list: CatalogProductDisplay[] =
      query.trim().length > 0
        ? fuse.search(query).map((r) => r.item)
        : [...catalogProducts];

    if (activeCategories.size > 0) {
      list = list.filter((p) => activeCategories.has(p.category));
    }
    // v4: in-stock filter removed (was placebo; inventory not yet wired)

    switch (sortKey) {
      case "price-asc":
        list = [...list].sort(
          (a, b) => minVariantPrice(a) - minVariantPrice(b),
        );
        break;
      case "price-desc":
        list = [...list].sort(
          (a, b) => maxVariantPrice(b) - maxVariantPrice(a),
        );
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.shortName.localeCompare(b.shortName));
        break;
      case "newest":
      default:
        // Keep insertion order from the catalog seed.
        break;
    }
    return list;
  }, [query, activeCategories, sortKey, fuse, catalogProducts]);

  function toggleCategory(cat: ProductCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* CONTROLS: search / filters / sort */}
        <div className="mb-8 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1.35fr)_minmax(0,2fr)_180px]">
            <div>
              <FieldLabel htmlFor="catalog-search">Search</FieldLabel>
              <div className="mt-2">
                <Input
                  id="catalog-search"
                  placeholder="Peptide name or SKU"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Category</FieldLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {productCategories.map((cat) => {
                  const active = activeCategories.has(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      aria-pressed={active}
                      className={[
                        "inline-flex items-center h-8 px-3 rounded-[var(--radius-full)]",
                        "font-mono uppercase tracking-[0.12em] text-[11px]",
                        "transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        active
                          ? "bg-[color:color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)] border border-[var(--accent)]"
                          : "bg-[var(--surface-strong)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-strong)]",
                      ].join(" ")}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="catalog-sort">Sort</FieldLabel>
              <div className="mt-2">
                <select
                  id="catalog-sort"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-strong)] text-[14px] text-[var(--text)]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* v4: "In stock only" placebo toggle removed. Counter retained. */}
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
            {visible.length} / {catalogProducts.length} shown
          </span>
        </div>

        {/* GRID */}
        {visible.length === 0 ? (
          <EmptyState
            title="No matching peptides"
            description="No products match the current search query and category filters. Try clearing one or both."
            action={
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setQuery("");
                  setActiveCategories(new Set());
                }}
              >
                Clear all filters
              </Button>
            }
          />
        ) : (
          <StaggerReveal
            as="ul"
            itemAs="li"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {visible.map((product) => (
              <ProductTile key={product.slug} product={product} />
            ))}
          </StaggerReveal>
        )}
      </div>
    </section>
  );
}

function ProductTile({ product }: { product: CatalogProductDisplay }) {
  const addLine = useCartStore((s) => s.addLine);
  const purchasable = isPurchasableProduct(product);
  const hasVariants = product.variants.length > 1;
  const categoryLabel =
    productCategories.find((c) => c.id === product.category)?.label ??
    product.category;

  return (
    <Card
      as="article"
      variant="interactive"
      className="group/product h-full overflow-hidden p-0 flex flex-col"
    >
      <Link
        href={`/products/${product.slug}`}
        className="block p-3 pb-0"
        aria-label={`View ${product.name}`}
      >
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Pill variant="electric" className="h-5 px-1.5 text-[9px]">
            RUO
          </Pill>
          <Pill variant="accent" className="h-5 px-1.5 text-[9px]">
            COA
          </Pill>
          <Pill variant="info" kind="tag" className="h-5 px-1.5 text-[9px]">
            {categoryLabel}
          </Pill>
        </div>
        <ProductStudioVisual
          product={product}
          className="mb-4 aspect-[4/5] rounded-[8px] border border-[color:color-mix(in_srgb,var(--accent)_16%,transparent)]"
          fallbackClassName="scale-[0.92]"
        />
        <div className="px-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[18px] font-semibold leading-tight text-[var(--text)] group-hover/product:text-[var(--accent-soft)] transition-colors">
              {product.shortName}
            </h3>
            <p className="font-mono tabular text-[16px] font-semibold text-[var(--text)]">
              {displayPriceLabel(product)}
            </p>
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
            {displaySkuLabel(product)} · {displayDoseLabel(product)} ·{" "}
            {displayPerMgLabel(product)}
          </p>
        </div>
      </Link>

      <p className="px-4 pt-3 text-[13px] leading-[1.55] text-[var(--text-muted)] flex-1">
        {product.shortDescription}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
          {purchasable
            ? hasVariants
              ? `${product.variants.length} options`
              : "In stock"
            : "Custom request"}
        </span>
        {purchasable && hasVariants ? (
          <div className="flex flex-wrap justify-end gap-2">
            {product.variants.map((variant) => (
              <Link
                key={variant.slug}
                href={`/products/${variant.slug}`}
                className={buttonClassNames("outline", "sm")}
              >
                {variant.dose}
              </Link>
            ))}
          </div>
        ) : purchasable ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              addLine({
                sku: product.sku,
                slug: product.slug,
                name: product.name,
                unitPriceCents: product.listPriceCents,
              })
            }
          >
            Add to cart
          </Button>
        ) : (
          <Link
            href={`/contact?topic=custom-order&sku=${encodeURIComponent(
              product.sku,
            )}&product=${encodeURIComponent(product.shortName)}`}
            className={buttonClassNames("outline", "sm")}
          >
            Request
          </Link>
        )}
      </div>
    </Card>
  );
}
