/**
 * "Frequently Researched Together" — biocollex-style bundle CTA.
 *
 * Mirrors the biocollexresearch.com PDP "Frequently Bought Together" pattern:
 * the current product is anchored + 2 complementary SKUs are pre-selected;
 * the user can toggle each, and the bundle total recomputes live. One CTA
 * adds every checked SKU to the cart in one shot.
 *
 * vialchemlabs theme: dark surface, teal accent, mono prices, tabular numerals.
 */
'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { ProductStudioVisual } from '@/components/ui/ProductStudioVisual';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice, type Product } from '@/lib/content/products';

interface FrequentlyTogetherIslandProps {
  anchor: Product;
  partners: Product[];
}

interface Selection extends Product {
  checked: boolean;
}

export function FrequentlyTogetherIsland({
  anchor,
  partners,
}: FrequentlyTogetherIslandProps) {
  const addLine = useCartStore((s) => s.addLine);
  const [items, setItems] = useState<Selection[]>(() => [
    { ...anchor, checked: true },
    ...partners.map((p) => ({ ...p, checked: true })),
  ]);
  const [toast, setToast] = useState<string | null>(null);

  const selected = items.filter((i) => i.checked);
  const total = useMemo(
    () => selected.reduce((sum, i) => sum + i.listPriceCents, 0),
    [selected],
  );

  function toggle(sku: string, locked: boolean) {
    if (locked) return;
    setItems((prev) =>
      prev.map((i) => (i.sku === sku ? { ...i, checked: !i.checked } : i)),
    );
  }

  function handleAddAll() {
    if (selected.length === 0) return;
    selected.forEach((i) => {
      addLine({
        sku: i.sku,
        slug: i.slug,
        name: i.name,
        unitPriceCents: i.listPriceCents,
        qty: 1,
      });
    });
    setToast(`Added ${selected.length} item${selected.length === 1 ? '' : 's'} to research order`);
  }

  return (
    <section className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
            Frequently researched together
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            Common cell-culture pairings
          </p>
        </div>
        <h2 className="text-[28px] font-light tracking-tight text-[var(--text)] mb-6">
          Pair {anchor.shortName} with peers
        </h2>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto] items-stretch">
          {/* Bundle row — anchor + plus + each partner */}
          <ul className="flex flex-col md:flex-row md:items-stretch gap-3">
            {items.map((item, idx) => {
              const locked = idx === 0;
              return (
                <li key={item.sku} className="contents">
                  <label
                    className={[
                      'group relative flex-1 flex items-center gap-4 p-4',
                      'border rounded-[14px] transition-colors duration-200',
                      'bg-[var(--surface)]',
                      item.checked
                        ? 'border-[var(--border-strong)]'
                        : 'border-[var(--border)] opacity-60',
                      locked ? 'cursor-default' : 'cursor-pointer hover:border-[var(--accent)]',
                    ].join(' ')}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      disabled={locked}
                      onChange={() => toggle(item.sku, locked)}
                      className="sr-only"
                      aria-label={`Include ${item.name} in bundle`}
                    />
                    <span
                      aria-hidden="true"
                      className={[
                        'flex-none h-5 w-5 rounded-[6px] border-2 grid place-items-center transition-colors',
                        item.checked
                          ? 'border-[var(--accent)] bg-[var(--accent)]'
                          : 'border-[var(--border-strong)]',
                      ].join(' ')}
                    >
                      {item.checked && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2.5 6.2L4.8 8.5L9.5 3.8"
                            stroke="#0a0e0f"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <div
                      className="relative h-14 w-14 flex-none overflow-hidden rounded-[4px] border border-white/10"
                      style={{ background: '#02070b' }}
                      aria-hidden="true"
                    >
                      <ProductStudioVisual
                        product={item}
                        sizes="56px"
                        className="absolute inset-0"
                        fallbackClassName="scale-[0.8]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-[var(--text)] truncate">
                        {item.shortName}
                        {locked && (
                          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
                            This item
                          </span>
                        )}
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                        {item.dose} · {item.sku}
                      </p>
                    </div>
                    <span className="font-mono tabular text-[14px] text-[var(--text)] flex-none">
                      {formatPrice(item.listPriceCents)}
                    </span>
                  </label>
                  {idx < items.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="flex-none self-center hidden md:grid place-items-center text-[var(--text-subtle)]"
                    >
                      <Plus size={18} strokeWidth={1.5} />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Total + CTA */}
          <div className="flex flex-col justify-center gap-3 lg:min-w-[220px] p-5 rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Bundle total
            </p>
            <p className="font-mono tabular text-[28px] font-semibold text-[var(--text)] leading-none">
              {formatPrice(total)}
            </p>
            <p className="font-mono text-[11px] text-[var(--text-subtle)]">
              {selected.length} item{selected.length === 1 ? '' : 's'} selected
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleAddAll}
              disabled={selected.length === 0}
              className="mt-1"
            >
              Add all to cart
            </Button>
          </div>
        </div>
        {toast && (
          <Toast
            message={toast}
            tone="success"
            duration={3000}
            onDismiss={() => setToast(null)}
          />
        )}
      </div>
    </section>
  );
}
