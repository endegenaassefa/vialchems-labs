/**
 * Cart page — client component, reads/writes through useCartStore.
 *
 * Phase 5: in-memory store. PLACEHOLDER: durable cart persistence and the
 * cookie-bound cart row land in Phase 9.
 *
 * Layout:
 *   - Empty state with link to /shop when no lines
 *   - Otherwise: line items table + summary card with subtotal + flat $15 ship
 *     placeholder + total + CTA to /checkout
 */
'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card } from '@/components/ui/Card';
import { Vial } from '@/components/ui/Vial';
import { Specs } from '@/components/ui/Specs';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/content/products';
import { siteConfig } from '@/lib/content/site';

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const subtotalCents = useCartStore((s) => s.subtotalCents)();
  const setQty = useCartStore((s) => s.setQty);
  const removeLine = useCartStore((s) => s.removeLine);

  const shippingCents = lines.length > 0 ? siteConfig.shipping.pilotUSCents : 0;
  const totalCents = subtotalCents + shippingCents;
  const freeShipQualified =
    subtotalCents >= siteConfig.shipping.freeShippingThresholdCents;

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-4">
              Cart
            </p>
            <h1 className="text-[clamp(36px,5vw,60px)] font-light leading-[1.05] tracking-tight text-[var(--text)]">
              Review your order
            </h1>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-12">
            {lines.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-[18px] text-[var(--text-muted)] mb-4">
                  Your cart is empty.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 h-11 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
                >
                  Browse the catalog →
                </Link>
              </Card>
            ) : (
              <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
                <ul className="space-y-4">
                  {lines.map((line) => {
                    const lineTotal = line.unitPriceCents * line.qty;
                    return (
                      <li key={line.sku}>
                        <Card className="p-5 flex items-center gap-4">
                          <Vial size="sm" aria-hidden="true" />
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${line.slug}`}
                              className="text-[16px] font-medium text-[var(--text)] hover:text-[var(--accent-soft)]"
                            >
                              {line.name}
                            </Link>
                            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                              {line.sku}
                            </p>
                          </div>
                          <div className="inline-flex items-center border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden">
                            <button
                              type="button"
                              onClick={() => setQty(line.sku, line.qty - 1)}
                              className="h-10 w-10 text-[16px] text-[var(--text-muted)] hover:text-[var(--accent)]"
                              aria-label={`Decrease quantity of ${line.name}`}
                            >
                              −
                            </button>
                            <span className="font-mono tabular text-[14px] w-8 text-center text-[var(--text)]">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(line.sku, line.qty + 1)}
                              className="h-10 w-10 text-[16px] text-[var(--text-muted)] hover:text-[var(--accent)]"
                              aria-label={`Increase quantity of ${line.name}`}
                            >
                              +
                            </button>
                          </div>
                          <p className="font-mono tabular text-[16px] text-[var(--text)] w-24 text-right">
                            {formatPrice(lineTotal)}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeLine(line.sku)}
                            className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)] hover:text-[var(--pill-error)] transition-colors"
                            aria-label={`Remove ${line.name}`}
                          >
                            Remove
                          </button>
                        </Card>
                      </li>
                    );
                  })}
                </ul>

                <div>
                  <Card className="p-6 sticky top-24">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
                      Order summary
                    </p>
                    <Specs
                      items={[
                        { term: 'Subtotal', value: formatPrice(subtotalCents) },
                        {
                          term: 'Shipping',
                          value: freeShipQualified
                            ? 'Free'
                            : formatPrice(shippingCents),
                        },
                        { term: 'Discount', value: '—' },
                        {
                          term: 'Total',
                          value: (
                            <span className="text-[18px] font-semibold">
                              {formatPrice(
                                freeShipQualified ? subtotalCents : totalCents,
                              )}
                            </span>
                          ),
                        },
                      ]}
                    />
                    <div className="mt-6 flex flex-col gap-3">
                      <Link
                        href="/checkout?step=address"
                        className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-[var(--radius-md)] bg-[var(--accent)] text-[#0a0e0f] font-medium text-[15px] hover:bg-[var(--accent-soft)] transition-colors"
                      >
                        Proceed to checkout
                      </Link>
                      <Link
                        href="/shop"
                        className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
                      >
                        Continue shopping
                      </Link>
                    </div>
                    <p className="mt-6 text-[12px] text-[var(--text-subtle)] leading-[1.55]">
                      Free shipping on orders over{' '}
                      {formatPrice(siteConfig.shipping.freeShippingThresholdCents)}.
                      US shipping only at this time.
                    </p>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

