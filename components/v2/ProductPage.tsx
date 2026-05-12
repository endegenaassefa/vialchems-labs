'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { catalogItems, displayPrice, getCatalogItem, skuCode } from './data';
import { Icon } from './icons';
import { V2Footer, V2Header } from './Shell';
import { ProductVisual } from './Visuals';

export function V2ProductPage({ slug }: { slug: string }) {
  const item = getCatalogItem(slug);
  const addLine = useCartStore((s) => s.addLine);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) {
    return (
      <>
        <V2Header />
        <main id="main" className="section">
          <div className="container">
            <div className="card" style={{ padding: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Not found</div>
              <h1 style={{ marginBottom: 16 }}>Material record unavailable.</h1>
              <Link href="/shop" className="btn btn-accent">Back to catalog</Link>
            </div>
          </div>
        </main>
        <V2Footer />
      </>
    );
  }

  const addToCart = () => {
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

  const related = catalogItems.filter((candidate) => candidate.slug !== item.slug && candidate.family === item.family).slice(0, 3);

  return (
    <>
      <V2Header />
      <main id="main">
        <section style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="container" style={{ padding: '42px 24px 72px' }}>
            <div style={{ marginBottom: 24 }}>
              <Link href="/shop" className="btn btn-link">← Catalog</Link>
            </div>
            <div className="v2-product-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(360px, 0.95fr) minmax(0, 1.05fr)', gap: 48, alignItems: 'start' }}>
              <div className="card v2-product-media-card" style={{ padding: 18, position: 'sticky', top: 88 }}>
                <div className="product-media" style={{ aspectRatio: '1 / 1.12', marginBottom: 0 }}>
                  <ProductVisual item={item} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span className="badge badge-ruo">RESEARCH USE</span>
                  <span className="badge badge-coa">COA</span>
                  {item.restricted && <span className="badge badge-restricted">RESTRICTED ACCESS</span>}
                </div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{skuCode(item.sku)} · {item.family}</div>
                <h1 style={{ marginBottom: 16 }}>{item.shortName}</h1>
                <p style={{ fontSize: 17, color: 'var(--fg-muted)', lineHeight: 1.58, maxWidth: 640, marginBottom: 24 }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 26 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 500 }}>{displayPrice(item.priceCents)}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{item.dose} · {item.stock} units available</span>
                </div>

                <div className="card" style={{ padding: 18, marginBottom: 18 }}>
                  <table className="spec-table">
                    <tbody>
                      <tr><td>Material code</td><td>{skuCode(item.sku)}</td></tr>
                      <tr><td>SKU</td><td>{item.sku}</td></tr>
                      <tr><td>Mass</td><td>{item.dose}</td></tr>
                      <tr><td>Documentation</td><td>COA-linked lot · SDS available · RUO attestation required</td></tr>
                      <tr><td>Release tests</td><td>HPLC purity · USP &lt;71&gt; sterility · LAL endotoxin</td></tr>
                      <tr><td>Access</td><td>{item.restricted ? 'Verified lab account required' : 'Research-use verification required'}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="card" style={{ padding: 18, display: 'grid', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <div className="eyebrow">Order controls</div>
                      <p style={{ color: 'var(--fg-muted)', fontSize: 13, marginTop: 4 }}>Qualified research purchasers only.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
                      <button type="button" className="icon-btn" style={{ border: 0, borderRadius: 0 }} onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
                        <Icon.minus size={14} strokeWidth={1.5} />
                      </button>
                      <span className="mono" style={{ width: 36, textAlign: 'center' }}>{qty}</span>
                      <button type="button" className="icon-btn" style={{ border: 0, borderRadius: 0 }} onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase quantity">
                        <Icon.plus size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button type="button" onClick={addToCart} className="btn btn-accent btn-lg">
                      {added ? 'Added to cart' : 'Add to cart'} <Icon.cart size={14} strokeWidth={1.5} />
                    </button>
                    <Link href="/coa" className="btn btn-ghost btn-lg">View COA records</Link>
                  </div>
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
              {(related.length ? related : catalogItems.slice(0, 3)).map((relatedItem) => (
                <Link href={`/products/${relatedItem.slug}`} className="card card-hover product-card" key={relatedItem.slug}>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span className="badge badge-ruo">RESEARCH USE</span>
                    <span className="badge badge-coa">COA</span>
                  </div>
                  <div className="product-media"><ProductVisual item={relatedItem} /></div>
                  <div className="product-title-row">
                    <h2 style={{ fontSize: 14 }}>{relatedItem.shortName}</h2>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500 }}>{displayPrice(relatedItem.priceCents)}</span>
                  </div>
                  <div className="product-code-line">{skuCode(relatedItem.sku)} · {relatedItem.dose}</div>
                  <div className="card-action">
                    <span style={{ color: 'var(--ok)' }}>· {relatedItem.stock} IN STOCK</span>
                    <span>VIEW LOT →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}
