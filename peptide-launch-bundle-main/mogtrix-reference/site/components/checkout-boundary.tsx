"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import type { CheckoutState } from "@/lib/content/checkout";
import { getCartCatalogNotice, useCartCatalogRows } from "@/lib/use-cart-catalog";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

export function CheckoutBoundary({ state }: { state: CheckoutState }) {
  const items = useCartStore((store) => store.items);
  const catalogState = useCartCatalogRows(items);
  const { rows, loading } = catalogState;
  const catalogNotice = getCartCatalogNotice(catalogState);
  const primaryAction = catalogNotice
    ? { href: "/cart", label: "Return to cart" }
    : { href: state.actionHref, label: state.actionLabel };

  const subtotalCents = rows.reduce(
    (sum, row) => sum + row.product.priceCents * row.item.quantity,
    0
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <article className="metal rounded-[28px] p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Account-controlled checkout
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">{state.title}</h1>
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
          {state.message}
        </p>
        <div className="mt-5 rounded-[24px] border border-[var(--border)] bg-[rgba(8,12,8,0.68)] p-5 text-sm leading-7 text-[var(--text-muted)]">
          Mogtrix hides pricing from the public storefront, unlocks cart and
          checkout after verification plus qualification, and then hands payment
          to a hosted offsite flow before webhook confirmation updates the order.
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
            href={primaryAction.href}
          >
            {primaryAction.label}
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
            href="/cart"
          >
            Return to cart
          </Link>
        </div>
      </article>

      <aside className="metal rounded-[28px] p-7">
        <h2 className="text-2xl font-black text-white">Cart summary</h2>
        {rows.length ? (
          <div className="mt-5 grid gap-4">
            {rows.map(({ item, product }) => (
              <div
                key={item.productId}
                className="rounded-[20px] border border-[var(--border)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-[var(--accent)]">
                      {"catalogCode" in product ? product.catalogCode : product.sku}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-white">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatPrice(product.priceCents * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
              <p className="text-sm text-[var(--text-muted)]">Estimated subtotal</p>
              <p className="text-lg font-black text-white">
                {formatPrice(subtotalCents)}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-[20px] border border-[var(--border)] p-4 text-sm text-[var(--text-muted)]">
            {loading
              ? "Loading current catalog records..."
              : catalogNotice ??
                "No cart items are loaded yet. Add products from the shop before continuing into checkout."}
          </div>
        )}
        {catalogNotice && rows.length ? (
          <p className="mt-4 text-sm text-[#ffb1a3]">{catalogNotice}</p>
        ) : null}
      </aside>
    </div>
  );
}
