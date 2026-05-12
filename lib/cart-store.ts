/**
 * Cart store — Zustand client-side store with localStorage persistence.
 *
 * ISSUE-002 fix: cart was wiped on full reload because the store was
 * memory-only. Adding zustand/middleware persist with localStorage so a buyer
 * who closes the tab and comes back finds their cart intact.
 *
 * Hydration safety: persist runs only on the client. Server renders with the
 * empty initial state; client hydrates from localStorage post-mount. The
 * `useCartHydrated()` hook flips to true after rehydrate so consumer
 * components (like CartCount) can avoid SSR/client text mismatch by rendering
 * 0 until hydrated.
 *
 * Phase 9 will swap the localStorage source for Supabase rows once Auth is
 * online; the public API stays the same.
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartLine {
  sku: string;
  slug: string;
  name: string;
  unitPriceCents: number;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  _hasHydrated: boolean;
  addLine: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  removeLine: (sku: string) => void;
  setQty: (sku: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotalCents: () => number;
  setHydrated: (v: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      _hasHydrated: false,
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
      setHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: "vialchemlabs:cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export const useCartHydrated = () => useCartStore((s) => s._hasHydrated);
