/**
 * ShopCatalog — client island for /shop page.
 *
 * Owns: search query, category filter set, in-stock toggle, sort selection.
 * Renders the Recovery Stack bundle as a separate accent card at the top,
 * then the filtered SKU grid below.
 *
 * Search uses Fuse.js across name + sku + category label (fuzzy threshold 0.4).
 *
 * In-stock state is hardcoded `true` for all SKUs in Phase 5 (real inventory
 * lands in Phase 9). The toggle filter is wired but always passes for now.
 */
'use client';

import Link from 'next/link';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Vial } from '@/components/ui/Vial';
import { useCartStore } from '@/lib/cart-store';
import {
  bundles,
  formatPerMg,
  formatPrice,
  productCategories,
  products,
  type Product,
  type ProductCategory,
} from '@/lib/content/products';

type SortKey = 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low → high' },
  { value: 'price-desc', label: 'Price: high → low' },
  { value: 'name-asc', label: 'Name: A → Z' },
];

export function ShopCatalog() {
  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<ProductCategory>>(
    new Set(),
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('newest');

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ['name', 'sku', 'category', 'shortName'],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [],
  );

  const visible = useMemo<Product[]>(() => {
    let list: Product[] =
      query.trim().length > 0
        ? fuse.search(query).map((r) => r.item)
        : [...products];

    if (activeCategories.size > 0) {
      list = list.filter((p) => activeCategories.has(p.category));
    }
    if (inStockOnly) {
      // PLACEHOLDER: real inventory lands in Phase 9. Currently all SKUs treated as in-stock.
      list = list.filter(() => true);
    }

    switch (sortKey) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.listPriceCents - b.listPriceCents);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.listPriceCents - a.listPriceCents);
        break;
      case 'name-asc':
        list = [...list].sort((a, b) => a.shortName.localeCompare(b.shortName));
        break;
      case 'newest':
      default:
        // Keep insertion order from the catalog seed.
        break;
    }
    return list;
  }, [query, activeCategories, inStockOnly, sortKey, fuse]);

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
        {/* RECOVERY STACK BUNDLE — separate accent card */}
        {bundles.map((bundle) => (
          <Card
            as="article"
            key={bundle.slug}
            variant="interactive"
            className="mb-12 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
          >
            <div className="flex items-center gap-5">
              <Vial size="md" aria-hidden="true" />
              <div>
                <Pill variant="accent" className="mb-2">
                  Bundle
                </Pill>
                <h2 className="text-[24px] md:text-[28px] font-medium tracking-tight text-[var(--text)] mb-1">
                  {bundle.name}
                </h2>
                <p className="text-[14px] text-[var(--text-muted)] max-w-xl leading-relaxed">
                  {bundle.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="font-mono tabular text-[24px] font-semibold text-[var(--text)]">
                  {formatPrice(bundle.listPriceCents)}
                </span>
                <span className="font-mono text-[12px] text-[var(--text-subtle)]">
                  {bundle.effectiveDiscountPct}% off
                </span>
              </div>
              <Link
                href={`/products/${bundle.slug}`}
                className="inline-flex items-center gap-2 px-5 h-10 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
              >
                View bundle
              </Link>
            </div>
          </Card>
        ))}

        {/* CONTROLS: search / filters / sort */}
        <div className="mb-8 grid gap-6 md:grid-cols-[2fr_3fr_1fr]">
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
                      'inline-flex items-center h-8 px-3 rounded-[var(--radius-full)]',
                      'font-mono uppercase tracking-[0.12em] text-[11px]',
                      'transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      active
                        ? 'bg-[color:color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)] border border-[var(--accent)]'
                        : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-strong)]',
                    ].join(' ')}
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

        <div className="mb-6 flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-[14px] text-[var(--text-muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span>In stock only</span>
          </label>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
            {visible.length} / {products.length} shown
          </span>
        </div>

        {/* GRID */}
        {visible.length === 0 ? (
          <p className="py-16 text-center text-[var(--text-muted)]">
            No products match the current filters.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <li key={product.slug}>
                <ProductTile product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ProductTile({ product }: { product: Product }) {
  const addLine = useCartStore((s) => s.addLine);
  const categoryLabel =
    productCategories.find((c) => c.id === product.category)?.label ?? product.category;

  return (
    <Card
      as="article"
      variant="interactive"
      className="p-5 h-full flex flex-col gap-4"
    >
      <Link
        href={`/products/${product.slug}`}
        className="flex items-start gap-4 group"
        aria-label={`View ${product.name}`}
      >
        <Vial size="sm" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Pill variant="info">{categoryLabel}</Pill>
            <Pill variant="accent">In stock</Pill>
          </div>
          <h3 className="text-[18px] font-medium leading-tight text-[var(--text)] mb-1 group-hover:text-[var(--accent-soft)] transition-colors">
            {product.shortName}
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
            {product.dose} · {product.sku}
          </p>
        </div>
      </Link>

      <p className="text-[13px] leading-[1.55] text-[var(--text-muted)] flex-1">
        {product.shortDescription}
      </p>

      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="font-mono tabular text-[20px] font-semibold text-[var(--text)]">
            {formatPrice(product.listPriceCents)}
          </p>
          <p className="font-mono text-[11px] text-[var(--text-subtle)]">
            {formatPerMg(product.perMgCents)}
          </p>
        </div>
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
      </div>
    </Card>
  );
}
