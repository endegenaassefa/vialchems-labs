"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PaymentMethodSelector,
  type CheckoutPaymentMethod,
} from "@/components/PaymentMethodSelector";
import { useCartStore } from "@/lib/cart-store";
import { siteConfig } from "@/lib/content/site";
import { catalogItems, displayPrice, getCatalogItem } from "./data";
import { Icon } from "./icons";
import { V2Footer, V2Header } from "./Shell";
import { ProductVisual } from "./Visuals";

export function V2Cart() {
  const lines = useCartStore((s) => s.lines);
  const subtotalCents = useCartStore((s) => s.subtotalCents)();
  const setQty = useCartStore((s) => s.setQty);
  const removeLine = useCartStore((s) => s.removeLine);
  const [preferredPaymentMethod, setPreferredPaymentMethod] =
    useState<CheckoutPaymentMethod>("link_money");
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const shippingCents = lines.length ? siteConfig.shipping.pilotUSCents : 0;
  const freeShip =
    subtotalCents >= siteConfig.shipping.freeShippingThresholdCents;
  const totalCents = subtotalCents + (freeShip ? 0 : shippingCents);

  async function handleSecureCheckout() {
    if (checkoutPending || lines.length === 0) return;
    setCheckoutPending(true);
    setCheckoutError(null);

    let response: Response;
    try {
      response = await fetch("/api/create-woo-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          preferredPaymentMethod,
          returnPath:
            typeof window === "undefined"
              ? "/cart"
              : `${window.location.pathname}${window.location.search}`,
          lines: lines.map((line) => ({
            sku: line.sku,
            slug: line.slug,
            qty: line.qty,
          })),
        }),
      });
    } catch {
      setCheckoutPending(false);
      setCheckoutError("Unable to reach secure checkout. Please try again.");
      return;
    }

    const body = (await response.json().catch(() => null)) as {
      ok?: boolean;
      checkoutUrl?: string;
      message?: string;
    } | null;

    if (!response.ok || !body?.ok || !body.checkoutUrl) {
      setCheckoutPending(false);
      setCheckoutError(
        body?.message ??
          "Secure checkout could not be started. Please try again.",
      );
      return;
    }

    window.location.assign(body.checkoutUrl);
  }

  return (
    <>
      <V2Header />
      <main id="main">
        <div className="catalog-hero">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              · Cart
            </div>
            <h1 style={{ fontSize: 42, marginBottom: 8 }}>Review your order</h1>
            <p style={{ color: "var(--fg-muted)" }}>
              Research-use terms and buyer qualification are checked before
              dispatch.
            </p>
          </div>
        </div>

        <section className="section">
          <div className="container">
            {lines.length === 0 ? (
              <div
                className="card"
                style={{ padding: 40, textAlign: "center" }}
              >
                <div className="eyebrow" style={{ marginBottom: 12 }}>
                  Empty cart
                </div>
                <h2 style={{ marginBottom: 12 }}>
                  No research materials selected.
                </h2>
                <p style={{ color: "var(--fg-muted)", marginBottom: 24 }}>
                  Add a vial or stack from the catalog to begin checkout.
                </p>
                <Link href="/shop" className="btn btn-accent">
                  Browse catalog
                </Link>
              </div>
            ) : (
              <div
                className="v2-cart-layout"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 420px)",
                  gap: 32,
                  alignItems: "start",
                }}
              >
                <div
                  className="v2-cart-lines"
                  style={{ display: "grid", gap: 12 }}
                >
                  {lines.map((line) => {
                    const item = getCatalogItem(line.slug) ?? catalogItems[0];
                    return (
                      <div
                        key={line.sku}
                        className="card v2-cart-line"
                        style={{
                          padding: 14,
                          display: "grid",
                          gridTemplateColumns: "74px minmax(0, 1fr) auto auto",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <Link
                          href={`/products/${line.slug}`}
                          className="product-media"
                          style={{ height: 88, marginBottom: 0 }}
                        >
                          <ProductVisual item={item} small />
                        </Link>
                        <div>
                          <Link
                            href={`/products/${line.slug}`}
                            style={{ fontWeight: 500 }}
                          >
                            {line.name}
                          </Link>
                          <div
                            className="mono"
                            style={{
                              fontSize: 10,
                              color: "var(--fg-muted)",
                              marginTop: 4,
                            }}
                          >
                            {line.sku}
                          </div>
                          <button
                            type="button"
                            className="btn btn-link"
                            style={{ marginTop: 8 }}
                            onClick={() => removeLine(line.sku)}
                          >
                            Remove
                          </button>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid var(--line)",
                            borderRadius: "var(--r-sm)",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            type="button"
                            className="icon-btn"
                            style={{ border: 0, borderRadius: 0 }}
                            onClick={() => setQty(line.sku, line.qty - 1)}
                            aria-label={`Decrease ${line.name}`}
                          >
                            <Icon.minus size={14} strokeWidth={1.5} />
                          </button>
                          <span
                            className="mono"
                            style={{ width: 34, textAlign: "center" }}
                          >
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            className="icon-btn"
                            style={{ border: 0, borderRadius: 0 }}
                            onClick={() => setQty(line.sku, line.qty + 1)}
                            aria-label={`Increase ${line.name}`}
                          >
                            <Icon.plus size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                        <div
                          className="mono"
                          style={{ fontSize: 15, fontWeight: 500 }}
                        >
                          {displayPrice(line.unitPriceCents * line.qty)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <aside
                  className="card"
                  style={{ padding: 22, position: "sticky", top: 86 }}
                >
                  <div className="eyebrow" style={{ marginBottom: 18 }}>
                    Order summary
                  </div>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td>Subtotal</td>
                        <td>{displayPrice(subtotalCents)}</td>
                      </tr>
                      <tr>
                        <td>Shipping</td>
                        <td>
                          {freeShip ? "Free" : displayPrice(shippingCents)}
                        </td>
                      </tr>
                      <tr>
                        <td>Discount</td>
                        <td>—</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td style={{ fontSize: 18 }}>
                          {displayPrice(totalCents)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
                    <PaymentMethodSelector
                      value={preferredPaymentMethod}
                      onChange={setPreferredPaymentMethod}
                    />
                    {checkoutError && (
                      <p className="v2-cart-error" role="alert">
                        {checkoutError}
                      </p>
                    )}
                    <button
                      type="button"
                      className="btn btn-accent btn-lg"
                      style={{ justifyContent: "center", width: "100%" }}
                      disabled={checkoutPending}
                      onClick={handleSecureCheckout}
                    >
                      {checkoutPending
                        ? "Starting secure checkout..."
                        : "Proceed to Secure Checkout"}
                    </button>
                    <Link
                      href="/shop"
                      className="btn btn-ghost"
                      style={{ justifyContent: "center" }}
                    >
                      Continue shopping
                    </Link>
                  </div>
                  <p
                    style={{
                      marginTop: 16,
                      fontSize: 12,
                      color: "var(--fg-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    Free shipping on orders over{" "}
                    {displayPrice(
                      siteConfig.shipping.freeShippingThresholdCents,
                    )}
                    . US shipping only at this time.
                  </p>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}
