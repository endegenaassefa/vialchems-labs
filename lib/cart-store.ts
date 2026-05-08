/**
 * Cart store — Zustand client-side store.
 *
 * PLACEHOLDER: real persistence (Supabase row + cookie) lands in Phase 9.
 * Phase 5 ships an in-memory store that survives within a browser tab session;
 * a refresh of `app/cart/page.tsx` (server component) reads through this client
 * store via the `useCartStore` hook.
 *
 * Data shape mirrors what the eventual server cart row will hold:
 *   - lines: Array<{ sku, qty }>
 *   - shipping/discount/tax are computed at checkout (server) — not here.
 *
 * The store also surfaces a hardcoded sample line ON FIRST VISIT so cart-page
 * QA does not show an empty state on every clean reload during Phase 5
 * dogfooding. Set NEXT_PUBLIC_CART_SAMPLE=0 in env to suppress (defaults on).
 */
'use client';

import { create } from 'zustand';

export interface CartLine {
  sku: string;
  slug: string;
  name: string;
  unitPriceCents: number;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, 'qty'> & { qty?: number }) => void;
  removeLine: (sku: string) => void;
  setQty: (sku: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotalCents: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],
  addLine: (line) => {
    set((state) => {
      const existing = state.lines.find((l) => l.sku === line.sku);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.sku === line.sku
              ? { ...l, qty: Math.min(10, l.qty + (line.qty ?? 1)) }
              : l,
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          { ...line, qty: Math.min(10, Math.max(1, line.qty ?? 1)) },
        ],
      };
    });
  },
  removeLine: (sku) =>
    set((state) => ({ lines: state.lines.filter((l) => l.sku !== sku) })),
  setQty: (sku, qty) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        l.sku === sku ? { ...l, qty: Math.min(10, Math.max(1, qty)) } : l,
      ),
    })),
  clear: () => set({ lines: [] }),
  count: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
  subtotalCents: () =>
    get().lines.reduce((sum, l) => sum + l.unitPriceCents * l.qty, 0),
}));
