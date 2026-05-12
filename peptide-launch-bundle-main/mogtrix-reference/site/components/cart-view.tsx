"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { useCartStore } from "@/lib/cart-store";
import { getResearchRequestItemCount } from "@/lib/request";
import { getCartCatalogNotice, useCartCatalogRows } from "@/lib/use-cart-catalog";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

export function CartView() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const catalogState = useCartCatalogRows(items);
  const { rows, loading } = catalogState;
  const catalogNotice = getCartCatalogNotice(catalogState);
  const checkoutBlocked = Boolean(catalogNotice);
  const itemCount = getResearchRequestItemCount(items);
  const subtotalCents = rows.reduce(
    (sum, row) => sum + row.product.priceCents * row.item.quantity,
    0
  );

  if (loading && items.length) {
    return (
      <section className="shell py-20">
        <div className="metal rounded-[22px] p-8 text-[var(--text-muted)]">
          Loading current storefront records for this cart...
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="shell py-20">
        <div className="metal rounded-[22px] p-8">
          <h1 className="text-4xl font-black text-white">Cart is empty.</h1>
          <p className="mt-4 text-[var(--text-muted)]">Add research materials from the shop before continuing.</p>
          <ButtonLink href="/shop" className="mt-6">Return to shop</ButtonLink>
        </div>
      </section>
    );
  }

  if (!rows.length) {
    return (
      <section className="shell py-20">
        <div className="metal rounded-[22px] p-8">
          <h1 className="text-4xl font-black text-white">
            {catalogNotice ? "Cart needs attention." : "Cart is empty."}
          </h1>
          <p className="mt-4 text-[var(--text-muted)]">
            {catalogNotice
              ? "The saved cart could not be matched to active canonical catalog records."
              : "Add research materials from the shop before continuing."}
          </p>
          {catalogNotice ? <p className="mt-3 text-sm text-[#ffb1a3]">{catalogNotice}</p> : null}
          <ButtonLink href="/shop" className="mt-6">Return to shop</ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section className="shell py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Cart review</p>
        <h1 className="mt-3 text-4xl font-black text-white">Review cart</h1>
        <p className="mt-4 text-[var(--text-muted)]">
          Pricing is visible for qualified storefront buyers. The next step captures shipping and payment on one protected checkout page.
        </p>
      </div>
      {catalogNotice ? (
        <div className="mt-6 rounded-[22px] border border-[#7a2a22] bg-[#210b08] p-4 text-sm text-[#ffb1a3]">
          {catalogNotice}
        </div>
      ) : null}
      <div className="mt-8 grid gap-4">
        {rows.map(({ item, product }) => (
          <article key={item.productId} className="metal flex flex-col gap-4 rounded-[22px] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                {"catalogCode" in product ? product.catalogCode : product.sku}
              </p>
              <h2 className="mt-1 text-xl font-black text-white">{product.name}</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {"descriptor" in product ? product.descriptor : product.summary}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {"displayPrice" in product ? product.displayPrice : formatPrice(product.priceCents)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="min-h-11 min-w-11 rounded-2xl border border-[var(--border)]" aria-label={`Decrease ${product.name}`} onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                <Minus className="mx-auto" size={16} />
              </button>
              <span className="min-w-8 text-center text-white">{item.quantity}</span>
              <button className="min-h-11 min-w-11 rounded-2xl border border-[var(--border)]" aria-label={`Increase ${product.name}`} onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                <Plus className="mx-auto" size={16} />
              </button>
              <button className="min-h-11 min-w-11 rounded-2xl border border-[var(--border)] text-[#ff8e7c]" aria-label={`Remove ${product.name}`} onClick={() => removeItem(item.productId)}>
                <Trash2 className="mx-auto" size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-4 rounded-[22px] border border-[var(--border)] p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg text-white">Selected items: <strong>{itemCount}</strong></p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Estimated subtotal: {formatPrice(subtotalCents)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]" href="/coa">
            Review COA Library
          </Link>
          {checkoutBlocked ? (
            <Link className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]" href="/shop">
              Return to shop
            </Link>
          ) : (
            <Link className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black" href="/checkout">
              Continue to checkout
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
