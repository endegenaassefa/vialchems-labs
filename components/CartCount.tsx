"use client";

import { useCartHydrated, useCartStore } from "@/lib/cart-store";

/**
 * CartCount — client island that subscribes to the cart store and renders the
 * line-item-quantity sum. Lives inside SiteHeader's Cart link.
 *
 * ISSUE-001 fix: previously the count was hardcoded `0` in SiteHeader (a server
 * component). Now this island subscribes to the store.
 *
 * ISSUE-002 follow-up: the store now persists to localStorage. To avoid
 * SSR/client hydration mismatch, render 0 until rehydrate completes.
 */
export function CartCount() {
  const hydrated = useCartHydrated();
  const count = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.qty, 0));
  const display = hydrated ? count : 0;
  return (
    <span
      className="font-mono text-[11px] text-[var(--text-muted)] tabular"
      aria-live="polite"
      aria-label={`Items in cart: ${display}`}
    >
      {display}
    </span>
  );
}
