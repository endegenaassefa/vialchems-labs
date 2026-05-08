/**
 * AddToCartIsland — client wrapper around the Add-to-Cart button + qty picker.
 *
 * Owns the qty input local state, calls into the cart store on submit. Disables
 * itself with a visual "added" pill for 1.5s after a successful add (Phase 5
 * cosmetic — real cart-drawer + toast lands in Phase 9).
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { useCartStore } from '@/lib/cart-store';

interface AddToCartIslandProps {
  sku: string;
  slug: string;
  name: string;
  unitPriceCents: number;
}

export function AddToCartIsland({
  sku,
  slug,
  name,
  unitPriceCents,
}: AddToCartIslandProps) {
  const addLine = useCartStore((s) => s.addLine);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addLine({ sku, slug, name, unitPriceCents, qty });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="h-12 w-12 text-[18px] text-[var(--text-muted)] hover:text-[var(--accent)]"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          max={10}
          value={qty}
          onChange={(e) => {
            const n = Math.min(10, Math.max(1, Number(e.target.value) || 1));
            setQty(n);
          }}
          className="h-12 w-12 bg-transparent text-center font-mono tabular text-[16px] text-[var(--text)] focus:outline-none"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(10, q + 1))}
          className="h-12 w-12 text-[18px] text-[var(--text-muted)] hover:text-[var(--accent)]"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <Button variant="primary" size="lg" onClick={handleAdd}>
        Add to cart
      </Button>
      {justAdded && <Pill variant="accent">Added</Pill>}
    </div>
  );
}
