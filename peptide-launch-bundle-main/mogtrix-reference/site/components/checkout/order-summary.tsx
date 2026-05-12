"use client";

import type { CartItem, Product } from "@/lib/types";
import type { StorefrontProduct } from "@/lib/content/products";
import { formatOrderCurrency } from "@/lib/orders";

type CheckoutRow = {
  item: CartItem;
  product: Product | StorefrontProduct;
};

export function OrderSummary({
  rows,
  subtotalCents,
  shippingCents,
  taxCents,
  totalCents,
  orderId,
  loading,
  notice,
  emptyMessage
}: {
  rows: CheckoutRow[];
  subtotalCents: number;
  shippingCents?: number | null;
  taxCents?: number | null;
  totalCents?: number | null;
  orderId: string | null;
  loading?: boolean;
  notice?: string | null;
  emptyMessage?: string;
}) {
  const finalTotalReady = typeof totalCents === "number";

  return (
    <aside className="metal rounded-[28px] p-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Summary
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">Order review</h2>
        </div>
        {orderId ? (
          <span className="rounded-full border border-[var(--border)] px-3 py-2 text-xs text-white">
            {orderId}
          </span>
        ) : null}
      </div>

      {notice ? (
        <div className="mt-5 rounded-[20px] border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
          {notice}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4">
        {rows.length ? (
          rows.map(({ item, product }) => (
            <div
              key={item.productId}
              className="rounded-[20px] border border-[var(--border)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                    {"catalogCode" in product ? product.catalogCode : product.sku}
                  </p>
                  <p className="mt-2 text-base font-bold text-white">
                    {product.name}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-white">
                  {formatOrderCurrency(product.priceCents * item.quantity)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[20px] border border-[var(--border)] p-4 text-sm text-[var(--text-muted)]">
            {loading
              ? "Loading current catalog records..."
              : emptyMessage ?? "Your cart is empty."}
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-[var(--border)] pt-5">
        <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>Subtotal</span>
          <span className="text-white">{formatOrderCurrency(subtotalCents)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>Shipping</span>
          <span className="text-white">
            {typeof shippingCents === "number"
              ? formatOrderCurrency(shippingCents)
              : "Locked in secure checkout"}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>Tax</span>
          <span className="text-white">
            {typeof taxCents === "number"
              ? formatOrderCurrency(taxCents)
              : "Calculated by provider"}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <span className="text-sm text-[var(--text-muted)]">
            {finalTotalReady ? "Final total due" : "Final total after shipping and tax"}
          </span>
          <span className="text-xl font-black text-white">
            {finalTotalReady ? formatOrderCurrency(totalCents) : "Prepared in secure checkout"}
          </span>
        </div>
      </div>
    </aside>
  );
}
