/**
 * AddToCartIsland — client wrapper around the Add-to-Cart button + qty picker.
 *
 * Owns the qty input local state, calls into the cart store on submit. Phase 4
 * v4: replaces the inline `justAdded` Pill with the Phase 2 `<Toast>` primitive
 * for transient success feedback. Toast carries role="alert" + aria-live so AT
 * announce the cart-add without requiring focus shift; auto-dismisses after
 * 3000ms (faster than default 4000ms — cart adds are quick interactions).
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useCartStore } from "@/lib/cart-store";

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
  const [toast, setToast] = useState<string | null>(null);

  function handleAdd() {
    addLine({ sku, slug, name, unitPriceCents, qty });
    setToast(
      qty === 1 ? `Added ${name} to research order` : `Added ${qty} × ${name}`,
    );
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
      {toast ? (
        <Toast
          message={toast}
          tone="success"
          duration={3000}
          onDismiss={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}
