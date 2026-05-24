"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { track } from "@/lib/analytics/plausible";
import { getProductTestPanel } from "@/lib/content/coa";
import { catalogItems, displayPrice, getCatalogItem, skuCode } from "./data";
import { Icon } from "./icons";
import { V2Footer, V2Header } from "./Shell";
import { ProductVisual } from "./Visuals";

/**
 * Phase 1F (super-prompt §6.6) — panel-aware status badge for the
 * COA tab. Replaces the hardcoded "COA PENDING" Iron Law 2.41
 * violation with three explicit states:
 *
 *   - "LAB TESTED" (purity available)  → green/ok badge
 *   - "TESTING IN PROGRESS" (panel exists, purity not yet released)
 *   - null  (no panel)  → hide the badge entirely. Per Iron Law 2.42
 *     a panel-less SKU should not be in the public catalog; defensive
 *     fallback keeps the surface clean rather than re-introducing the
 *     "COA PENDING" string.
 */
type CoaBadge = { text: string; cls: string } | null;
function coaBadgeFor(slug: string): CoaBadge {
  const panel = getProductTestPanel(slug);
  if (!panel) return null;
  if (panel.purity.available) return { text: "LAB TESTED", cls: "badge-coa" };
  return { text: "TESTING IN PROGRESS", cls: "badge-coa" };
}

export function V2ProductPage({ slug }: { slug: string }) {
  const item = getCatalogItem(slug);
  const panel = getProductTestPanel(slug);
  const addLine = useCartStore((s) => s.addLine);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  // Phase 1I (operator feedback 2026-05-24): PDP gets a media toggle so
  // customers can flip from the product visual to a Purity-COA thumbnail
  // preview without leaving the page. Default = "product". When panel
  // exists + purity available, the "COA preview" tab unlocks.
  const [mediaView, setMediaView] = useState<"product" | "coa">("product");

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
                {/* Phase 1I — media toggle (Vial / COA preview). The COA
                    tab only renders when this SKU has a published Purity
                    panel; otherwise the toggle is hidden so the section
                    stays clean for custom-order SKUs. */}
                {panel?.purity.available && panel.purity.thumbPath ? (
                  <div
                    role="tablist"
                    aria-label="Product media view"
                    style={{
                      display: "flex",
                      gap: 4,
                      marginBottom: 12,
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    {(
                      [
                        { key: "product", label: "Vial" },
                        { key: "coa", label: "COA preview" },
                      ] as const
                    ).map((tab) => {
                      const active = mediaView === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setMediaView(tab.key)}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: "8px 12px",
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            cursor: "pointer",
                            color: active ? "var(--text)" : "var(--fg-muted)",
                            borderBottom: active
                              ? "2px solid var(--accent)"
                              : "2px solid transparent",
                            marginBottom: -1,
                          }}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
                <div
                  className="product-media v2-product-main-media"
                  style={{ aspectRatio: "1 / 1.12", marginBottom: 0 }}
                >
                  {mediaView === "coa" &&
                  panel?.purity.available &&
                  panel.purity.thumbPath ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        background: "var(--bg-sunken)",
                        borderRadius: "var(--r-sm)",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={panel.purity.thumbPath}
                        alt={`${item.shortName} Purity COA preview`}
                        fill
                        sizes="(min-width: 1024px) 480px, 90vw"
                        style={{ objectFit: "contain", objectPosition: "top" }}
                      />
                    </div>
                  ) : (
                    <ProductVisual item={item} />
                  )}
                </div>
                {mediaView === "coa" && panel?.purity.available ? (
                  <p
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      color: "var(--fg-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    Showing Purity (HPLC) report preview.{" "}
                    <Link
                      href={`/verify/${item.slug}`}
                      style={{
                        color: "var(--accent)",
                        textDecoration: "underline",
                      }}
                    >
                      See the full 4-test panel →
                    </Link>
                  </p>
                ) : null}
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
                  {(() => {
                    const badge = coaBadgeFor(item.slug);
                    return badge ? (
                      <span className={`badge ${badge.cls}`}>{badge.text}</span>
                    ) : null;
                  })()}
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

                {/* Phase 1I — panel-aware lab-panel summary. Replaces the
                    previous 4-card "Production COA required before shipment"
                    proof grid (which was duplicative with the spec table
                    AND used stale 'COA required' language now that COAs
                    are published). When LAB TESTED: shows the 4 test
                    results inline + CTA to /verify/[slug]. When no panel
                    exists: a single line about custom-order workflow. */}
                {panel ? (
                  <div
                    className="card"
                    style={{ padding: 18, marginBottom: 18 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 16,
                        marginBottom: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div className="eyebrow" style={{ marginBottom: 4 }}>
                          Independent third-party lab panel
                        </div>
                        <div
                          className="mono"
                          style={{
                            fontSize: 11,
                            color: "var(--fg-muted)",
                          }}
                        >
                          Batch {panel.batch}
                        </div>
                      </div>
                      <Link
                        href={`/verify/${item.slug}`}
                        style={{
                          fontSize: 12,
                          color: "var(--accent)",
                          textDecoration: "underline",
                        }}
                      >
                        See full test panel →
                      </Link>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(140px, 1fr))",
                        gap: 12,
                      }}
                    >
                      {(
                        [
                          { key: "purity", label: "Purity (HPLC)" },
                          { key: "sterility", label: "Sterility" },
                          { key: "endotoxin", label: "Endotoxin" },
                          { key: "heavyMetals", label: "Heavy metals" },
                        ] as const
                      ).map((t) => {
                        const test = panel[t.key];
                        return (
                          <div
                            key={t.key}
                            style={{
                              padding: "10px 12px",
                              border: "1px solid var(--line)",
                              borderRadius: "var(--r-sm)",
                              background: "var(--bg-sunken)",
                            }}
                          >
                            <div
                              className="mono"
                              style={{
                                fontSize: 10,
                                textTransform: "uppercase",
                                letterSpacing: "0.12em",
                                color: "var(--fg-muted)",
                                marginBottom: 4,
                              }}
                            >
                              {t.label}
                            </div>
                            <div
                              className="mono"
                              style={{
                                fontSize: 14,
                                color: test.available
                                  ? "var(--text)"
                                  : "var(--fg-muted)",
                                fontWeight: 500,
                              }}
                            >
                              {test.available
                                ? (test.resultSummary ?? "Available")
                                : "Pending"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div
                    className="card"
                    style={{
                      padding: 18,
                      marginBottom: 18,
                      borderStyle: "dashed",
                    }}
                  >
                    <div className="eyebrow" style={{ marginBottom: 6 }}>
                      Custom-order item
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--fg-muted)",
                        lineHeight: 1.55,
                      }}
                    >
                      Not in the public-launch catalog. Lab panel published on
                      order.{" "}
                      <Link
                        href="/contact"
                        style={{
                          color: "var(--accent)",
                          textDecoration: "underline",
                        }}
                      >
                        Contact support
                      </Link>{" "}
                      to discuss this material.
                    </p>
                  </div>
                )}

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
                      {/* Phase 1J — Documentation row only renders for SKUs
                          WITHOUT a published panel. For LAB TESTED SKUs the
                          panel-summary card above already conveys the
                          "Independent third-party lab panel" message + 4 test
                          results + Lab Reports link, so a Documentation row
                          duplicating that wording was operator-flagged as
                          repetitive. Custom-order SKUs (no panel) still need
                          the row because there's no panel-summary card. */}
                      {panel ? null : (
                        <tr>
                          <td>Documentation</td>
                          <td>
                            Lab panel published on order · RUO attestation
                            required at checkout
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>Release tests</td>
                        <td>
                          HPLC purity · sterility · endotoxin · heavy metals
                        </td>
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
                <h2>More from the catalog.</h2>
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
                      {(() => {
                        const badge = coaBadgeFor(relatedItem.slug);
                        return badge ? (
                          <span className={`badge ${badge.cls}`}>
                            {badge.text}
                          </span>
                        ) : null;
                      })()}
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
