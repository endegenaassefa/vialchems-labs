/**
 * ReviewPanel — client island for /checkout/review.
 *
 * Reads address + method from sessionStorage, line items from cart store, and
 * renders a final pre-place-order page with:
 *   - Address summary
 *   - Payment method summary
 *   - Line items + totals
 *   - 21+ age-gate text checkbox (verbatim Appendix A.3)
 *   - RUO acknowledgment checkbox
 *   - Buyer-qualification stub link (real form lands in Phase 8)
 *   - Place Order button
 *
 * Submit: writes a placeholder order ID to sessionStorage, clears the cart,
 * routes to /checkout/confirm.
 */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Specs } from '@/components/ui/Specs';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/content/products';
import { siteConfig } from '@/lib/content/site';
import { validateShippingAddress } from '@/lib/compliance/jurisdictions';
import {
  useSessionStorageItem,
  useSessionStorageString,
} from '@/lib/use-session-storage';

const ADDRESS_KEY = 'vialchems:checkout:address';
const METHOD_KEY = 'vialchems:checkout:method';
const ORDER_KEY = 'vialchems:checkout:order';

interface AddressSnapshot {
  name: string;
  email: string;
  street: string;
  street2: string;
  city: string;
  stateCode: string;
  zip: string;
  countryCode: string;
}

const METHOD_LABELS: Record<string, string> = {
  crypto: 'Cryptocurrency (BTC / LTC)',
  ach: 'Bank transfer (US ACH)',
};

const METHOD_DISCOUNT_PCT: Record<string, number> = {
  crypto: 12.5,
  ach: 5,
};

export function ReviewPanel() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const subtotalCents = useCartStore((s) => s.subtotalCents)();
  const clear = useCartStore((s) => s.clear);

  const address = useSessionStorageItem<AddressSnapshot>(ADDRESS_KEY);
  const methodRaw = useSessionStorageString(METHOD_KEY);
  const method =
    methodRaw === 'crypto' || methodRaw === 'ach' ? methodRaw : null;

  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [ruoConfirmed, setRuoConfirmed] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const discountPct = method ? METHOD_DISCOUNT_PCT[method] ?? 0 : 0;
  const discountCents = useMemo(
    () => Math.round(subtotalCents * (discountPct / 100)),
    [subtotalCents, discountPct],
  );
  const shippingCents =
    subtotalCents >= siteConfig.shipping.freeShippingThresholdCents
      ? 0
      : siteConfig.shipping.pilotUSCents;
  const totalCents = subtotalCents - discountCents + shippingCents;

  const canSubmit =
    ageConfirmed &&
    ruoConfirmed &&
    lines.length > 0 &&
    address !== null &&
    method !== null;

  function handlePlaceOrder() {
    setSubmitError(null);
    if (!canSubmit || !address) {
      setSubmitError(
        'Please confirm both acknowledgments, complete address and method, and add at least one item to your cart.',
      );
      return;
    }
    const validation = validateShippingAddress({
      countryCode: address.countryCode,
      stateCode: address.stateCode,
    });
    if (!validation.ok) {
      setSubmitError(validation.reason);
      return;
    }
    const orderId = generateOrderId();
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        ORDER_KEY,
        JSON.stringify({
          id: orderId,
          placedAt: new Date().toISOString(),
          method,
          lines,
          subtotalCents,
          discountCents,
          shippingCents,
          totalCents,
          address,
        }),
      );
    }
    clear();
    router.push('/checkout/confirm');
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
      <div className="space-y-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Shipping address
            </p>
            <Link
              href="/checkout/address"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
            >
              Edit
            </Link>
          </div>
          {address ? (
            <div className="text-[14px] text-[var(--text-muted)] leading-[1.6]">
              <p className="text-[var(--text)] font-medium">{address.name}</p>
              <p>{address.email}</p>
              <p>
                {address.street}
                {address.street2 ? `, ${address.street2}` : ''}
              </p>
              <p>
                {address.city}, {address.stateCode} {address.zip}
              </p>
              <p>{address.countryCode}</p>
            </div>
          ) : (
            <p className="text-[14px] text-[var(--pill-error)]">
              No address on file. Return to step 1.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Payment method
            </p>
            <Link
              href="/checkout/method"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]"
            >
              Edit
            </Link>
          </div>
          {method ? (
            <div className="flex items-center gap-3">
              <span className="text-[16px] text-[var(--text)]">
                {METHOD_LABELS[method] ?? method}
              </span>
              <Pill variant="accent">{discountPct}% off</Pill>
            </div>
          ) : (
            <p className="text-[14px] text-[var(--pill-error)]">
              No method on file. Return to step 2.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
            Acknowledgments
          </p>
          {/* Verbatim text per Appendix A.3 — text-based contractual checkbox, NOT modal */}
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--accent)]"
            />
            <span className="text-[14px] text-[var(--text-muted)] leading-[1.6]">
              I confirm that I am 21+ years of age and will use these products
              solely for laboratory research in non-clinical settings. Products
              are not for human consumption.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ruoConfirmed}
              onChange={(e) => setRuoConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--accent)]"
            />
            <span className="text-[14px] text-[var(--text-muted)] leading-[1.6]">
              I understand these products are sold for research use only (RUO),
              are not approved by any regulatory authority for any indication,
              and are not for human or veterinary use.
            </span>
          </label>
          <p className="mt-5 text-[12px] text-[var(--text-subtle)]">
            Buyer qualification is required and stored with your account.{' '}
            <Link href="/account" className="text-[var(--accent)]">
              Complete qualification →
            </Link>
            <span className="font-mono ml-2 text-[var(--text-subtle)]">
              [stub — Phase 8]
            </span>
          </p>
        </Card>

        {submitError && (
          <div
            role="alert"
            className="border border-[var(--pill-error)] rounded-[var(--radius-md)] p-3 text-[14px] text-[var(--pill-error)]"
          >
            {submitError}
          </div>
        )}
      </div>

      <Card className="p-6 sticky top-24 h-fit">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
          Order summary
        </p>
        {lines.length === 0 ? (
          <p className="text-[14px] text-[var(--pill-error)]">
            Cart is empty. Return to{' '}
            <Link href="/shop" className="text-[var(--accent)]">
              the catalog
            </Link>
            .
          </p>
        ) : (
          <>
            <ul className="space-y-2 mb-4 text-[13px]">
              {lines.map((l) => (
                <li
                  key={l.sku}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="text-[var(--text-muted)]">
                    {l.name} × {l.qty}
                  </span>
                  <span className="font-mono tabular text-[var(--text)]">
                    {formatPrice(l.unitPriceCents * l.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <Specs
              items={[
                { term: 'Subtotal', value: formatPrice(subtotalCents) },
                {
                  term: 'Discount',
                  value:
                    discountCents > 0
                      ? `− ${formatPrice(discountCents)} (${discountPct}%)`
                      : '—',
                },
                {
                  term: 'Shipping',
                  value: shippingCents === 0 ? 'Free' : formatPrice(shippingCents),
                },
                {
                  term: 'Total',
                  value: (
                    <span className="text-[18px] font-semibold">
                      {formatPrice(totalCents)}
                    </span>
                  ),
                },
              ]}
            />
          </>
        )}
        <Button
          variant="primary"
          size="lg"
          className="mt-6 w-full"
          onClick={handlePlaceOrder}
          disabled={!canSubmit}
        >
          Place order
        </Button>
        <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-subtle)] text-center">
          Phase 5 stub · BTCPay + Plaid wiring in Phase 7
        </p>
      </Card>
    </div>
  );
}

function generateOrderId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `VC-${(crypto as { randomUUID: () => string }).randomUUID().slice(0, 8).toUpperCase()}`;
  }
  return `VC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}
