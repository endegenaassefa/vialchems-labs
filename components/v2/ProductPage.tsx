"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useCartStore } from "@/lib/cart-store";
import { track } from "@/lib/analytics/plausible";
import { catalogItems, displayPrice, getCatalogItem, skuCode } from "./data";
import { Icon } from "./icons";
import { V2Footer, V2Header } from "./Shell";
import { ProductVisual } from "./Visuals";

export function V2ProductPage({ slug }: { slug: string }) {
  const item = getCatalogItem(slug);
  const addLine = useCartStore((s) => s.addLine);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // D4: product_viewed funnel event. Fires once per PDP mount.
  // track() no-ops when Plausible isn't configured.
  useEffect(() => {
    if (!item) return;
    track({
      event: "product_viewed",
      props: { slug: item.slug, sku: item.sku, family: item.family },
    });
  }, [item]);

  if (!item) {
    return (
      <>
        <V2Header />
        <main id="main" className="section">
          <div className="container">
            <div className="card" style={{ padding: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                Not found
              </div>
              <h1 style={{ marginBottom: 16 }}>Material record unavailable.</h1>
              <Link href="/shop" className="btn btn-accent">
                Back to catalog
              </Link>
            </div>
          </div>
        </main>
        <V2Footer />
      </>
    );
  }

  const addToCart = () => {
    if (!item.purchasable) return;
    addLine({
      sku: item.sku,
      slug: item.slug,
      name: item.name,
      unitPriceCents: item.priceCents,
      qty,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const related = catalogItems
    .filter(
      (candidate) =>
        candidate.slug !== item.slug && candidate.family === item.family,
    )
    .slice(0, 3);
  const subtotal = displayPrice(item.priceCents * qty);
  const requestHref = `/contact?topic=custom-order&sku=${encodeURIComponent(
    item.sku,
  )}&product=${encodeURIComponent(item.shortName)}`;
  const accessLabel = item.restricted
    ? "Verified lab account required"
    : "Research-use verification required";
  const availabilityLabel = item.purchasable
    ? `${item.stock} units available`
    : "Custom request only";

  return (
    <>
      <V2Header />
      <main id="main">
        <section className="v2-product-hero">
          <div className="container v2-product-container">
            <div className="v2-product-back">
              <Link href="/shop" className="btn btn-link">
                ← Catalog
              </Link>
            </div>
            <div
              className="v2-product-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(360px, 0.95fr) minmax(0, 1.05fr)",
                gap: 48,
                alignItems: "start",
              }}
            >
              <div
                className="card v2-product-media-card"
                style={{ padding: 18, position: "sticky", top: 88 }}
              >
                <div
                  className="product-media v2-product-main-media"
                  style={{ aspectRatio: "1 / 1.12", marginBottom: 0 }}
                >
                  <ProductVisual item={item} />
                </div>
                <div className="v2-product-media-meta">
                  <span>{skuCode(item.sku)}</span>
                  <span>{item.dose}</span>
                  <span>RUO</span>
                </div>
              </div>

              <div className="v2-product-info">
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <span className="badge badge-ruo">RESEARCH USE</span>
                  <span className="badge badge-coa">COA PENDING</span>
                  {item.restricted && (
                    <span className="badge badge-restricted">
                      RESTRICTED ACCESS
                    </span>
                  )}
                </div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>
                  {skuCode(item.sku)} · {item.family}
                </div>
                <h1 style={{ marginBottom: 16 }}>{item.shortName}</h1>
                <p
                  className="v2-product-description"
                  style={{
                    fontSize: 17,
                    color: "var(--fg-muted)",
                    lineHeight: 1.58,
                    maxWidth: 640,
                    marginBottom: 24,
                  }}
                >
                  {item.description}
                </p>
                <div
                  className="v2-product-price-row"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 14,
                    marginBottom: 26,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 28,
                      fontWeight: 500,
                    }}
                  >
                    {displayPrice(item.priceCents)}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--fg-muted)",
                    }}
                  >
                    {item.dose} · {availabilityLabel}
                  </span>
                </div>

                <div
                  className="card v2-product-buy-card"
                  style={{ padding: 18, display: "grid", gap: 16 }}
                >
                  <div
                    className="v2-product-order-head"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div className="eyebrow">Order controls</div>
                      <p
                        style={{
                          color: "var(--fg-muted)",
                          fontSize: 13,
                          marginTop: 4,
                        }}
                      >
                        {item.purchasable
                          ? `Qualified research purchasers only · ${subtotal} subtotal.`
                          : "Custom-order requests are reviewed by staff before quote or dispatch."}
                      </p>
                    </div>
                    {item.purchasable ? (
                      <div
                        className="v2-product-qty-stepper"
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
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          aria-label="Decrease quantity"
                        >
                          <Icon.minus size={14} strokeWidth={1.5} />
                        </button>
                        <span
                          className="mono"
                          style={{ width: 36, textAlign: "center" }}
                        >
                          {qty}
                        </span>
                        <button
                          type="button"
                          className="icon-btn"
                          style={{ border: 0, borderRadius: 0 }}
                          onClick={() => setQty(Math.min(10, qty + 1))}
                          aria-label="Increase quantity"
                        >
                          <Icon.plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    ) : (
                      <span className="badge badge-restricted">
                        CUSTOM REQUEST
                      </span>
                    )}
                  </div>
                  <div
                    className="v2-product-button-row"
                    style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                  >
                    {item.purchasable ? (
                      <>
                        <button
                          type="button"
                          onClick={addToCart}
                          className="btn btn-accent btn-lg"
                        >
                          {added ? "Added to cart" : "Add to cart"}{" "}
                          <Icon.cart size={14} strokeWidth={1.5} />
                        </button>
                        <Link href="/cart" className="btn btn-ghost btn-lg">
                          Review cart
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href={requestHref}
                          className="btn btn-accent btn-lg"
                        >
                          Request custom order{" "}
                          <Icon.arrow size={14} strokeWidth={1.5} />
                        </Link>
                        <Link href="/shop" className="btn btn-ghost btn-lg">
                          Back to catalog
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="v2-product-proof-grid">
                  <ProductProof
                    icon={<Icon.doc size={16} strokeWidth={1.5} />}
                    title="COA gate"
                    body="Production COA required before shipment."
                  />
                  <ProductProof
                    icon={<Icon.shield size={16} strokeWidth={1.5} />}
                    title="Access check"
                    body={accessLabel}
                  />
                  <ProductProof
                    icon={<Icon.check size={16} strokeWidth={1.5} />}
                    title="Release tests"
                    body="HPLC purity, sterility, and endotoxin screening."
                  />
                  <ProductProof
                    icon={<Icon.download size={16} strokeWidth={1.5} />}
                    title="Lot trace"
                    body="Batch records stay tied to the material code."
                  />
                </div>

                <div
                  className="card v2-product-spec-card"
                  style={{ padding: 18, marginBottom: 18 }}
                >
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td>Material code</td>
                        <td>{skuCode(item.sku)}</td>
                      </tr>
                      <tr>
                        <td>SKU</td>
                        <td>{item.sku}</td>
                      </tr>
                      <tr>
                        <td>Mass</td>
                        <td>{item.dose}</td>
                      </tr>
                      <tr>
                        <td>Availability</td>
                        <td>
                          {item.purchasable
                            ? "In stock for checkout"
                            : "Available by custom request"}
                        </td>
                      </tr>
                      <tr>
                        <td>Documentation</td>
                        <td>
                          Production COA required before shipment · RUO
                          attestation required
                        </td>
                      </tr>
                      <tr>
                        <td>Release tests</td>
                        <td>HPLC purity · sterility · endotoxin screening</td>
                      </tr>
                      <tr>
                        <td>Access</td>
                        <td>{accessLabel}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-hd">
              <div className="hd-l">
                <div className="eyebrow">Related materials</div>
                <h2>Same documentation posture.</h2>
              </div>
            </div>
            <div className="catalog-grid">
              {(related.length ? related : catalogItems.slice(0, 3)).map(
                (relatedItem) => (
                  <Link
                    href={`/products/${relatedItem.slug}`}
                    className="card card-hover product-card"
                    key={relatedItem.slug}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 5,
                        marginBottom: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <span className="badge badge-ruo">RESEARCH USE</span>
                      <span className="badge badge-coa">COA PENDING</span>
                    </div>
                    <div className="product-media">
                      <ProductVisual item={relatedItem} />
                    </div>
                    <div className="product-title-row">
                      <h2 style={{ fontSize: 14 }}>{relatedItem.shortName}</h2>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {displayPrice(relatedItem.priceCents)}
                      </span>
                    </div>
                    <div className="product-code-line">
                      {skuCode(relatedItem.sku)} · {relatedItem.dose}
                    </div>
                    <div className="card-action">
                      <span
                        style={{
                          color: relatedItem.purchasable
                            ? "var(--ok)"
                            : "var(--fg-muted)",
                        }}
                      >
                        ·{" "}
                        {relatedItem.purchasable
                          ? `${relatedItem.stock} IN STOCK`
                          : "CUSTOM REQUEST"}
                      </span>
                      <span>
                        {relatedItem.purchasable ? "VIEW LOT →" : "REQUEST →"}
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}

function ProductProof({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="v2-product-proof">
      <div className="v2-product-proof-icon">{icon}</div>
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </div>
  );
}
