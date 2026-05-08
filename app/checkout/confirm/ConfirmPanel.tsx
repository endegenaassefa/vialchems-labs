/**
 * ConfirmPanel — client island for /checkout/confirm.
 *
 * Reads the placeholder order from sessionStorage. Phase 5 stub — production
 * order persistence (Supabase + payment-status webhooks) lands in Phase 7+8.
 */
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Specs } from '@/components/ui/Specs';
import { formatPrice } from '@/lib/content/products';
import { useSessionStorageItem } from '@/lib/use-session-storage';

const ORDER_KEY = 'vialchems:checkout:order';

interface StoredOrder {
  id: string;
  placedAt: string;
  method: 'crypto' | 'ach';
  lines: {
    sku: string;
    slug: string;
    name: string;
    unitPriceCents: number;
    qty: number;
  }[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  address: {
    name: string;
    street: string;
    street2: string;
    city: string;
    stateCode: string;
    zip: string;
    countryCode: string;
  };
}

const METHOD_LABELS: Record<string, string> = {
  crypto: 'Cryptocurrency (BTC / LTC)',
  ach: 'Bank transfer (US ACH)',
};

export function ConfirmPanel() {
  const order = useSessionStorageItem<StoredOrder>(ORDER_KEY);

  if (!order) {
    return (
      <Card className="p-12 text-center">
        <p className="text-[18px] text-[var(--text-muted)] mb-3">
          No recent order found in this session.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
        >
          Browse the catalog →
        </Link>
      </Card>
    );
  }

  const placedAt = new Date(order.placedAt);
  const expectedShip = new Date(placedAt.getTime());
  // Same-business-day if before 3pm Mon-Fri (heuristic only — Phase 5 stub)
  expectedShip.setDate(expectedShip.getDate() + 1);

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
              Order ID
            </p>
            <p className="font-mono text-[28px] font-semibold tabular text-[var(--text)]">
              {order.id}
            </p>
          </div>
          <Pill variant="accent">
            {order.method === 'crypto' ? 'Awaiting BTC confirmation' : 'Awaiting ACH clearance'}
          </Pill>
        </div>

        <p className="text-[16px] leading-[1.6] text-[var(--text-muted)] max-w-2xl">
          Thank you for your order. A confirmation email is on its way to{' '}
          <span className="text-[var(--text)]">your address on file</span>. Your
          Certificate of Analysis will be emailed once a batch is allocated, and
          will also be visible on the product page.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Specs
            items={[
              { term: 'Placed', value: placedAt.toLocaleString() },
              { term: 'Method', value: METHOD_LABELS[order.method] ?? order.method },
              {
                term: 'Expected ship',
                value: expectedShip.toLocaleDateString(),
              },
            ]}
          />
          <Specs
            items={[
              { term: 'Subtotal', value: formatPrice(order.subtotalCents) },
              {
                term: 'Discount',
                value:
                  order.discountCents > 0
                    ? `− ${formatPrice(order.discountCents)}`
                    : '—',
              },
              {
                term: 'Shipping',
                value: order.shippingCents === 0 ? 'Free' : formatPrice(order.shippingCents),
              },
              {
                term: 'Total',
                value: (
                  <span className="text-[18px] font-semibold">
                    {formatPrice(order.totalCents)}
                  </span>
                ),
              },
            ]}
          />
        </div>
      </Card>

      <Card className="p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
          Items ordered
        </p>
        <ul className="divide-y divide-[var(--border)]">
          {order.lines.map((l) => (
            <li
              key={l.sku}
              className="py-3 flex items-baseline justify-between gap-3"
            >
              <Link
                href={`/products/${l.slug}`}
                className="text-[14px] text-[var(--text)] hover:text-[var(--accent-soft)]"
              >
                {l.name}{' '}
                <span className="font-mono text-[12px] text-[var(--text-subtle)]">
                  × {l.qty}
                </span>
              </Link>
              <span className="font-mono tabular text-[14px] text-[var(--text)]">
                {formatPrice(l.unitPriceCents * l.qty)}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/order/${order.id}`}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-[var(--radius-md)] bg-[var(--accent)] text-[#0a0e0f] font-medium text-[14px] hover:bg-[var(--accent-soft)] transition-colors"
        >
          View order detail
        </Link>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
        >
          All orders
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
