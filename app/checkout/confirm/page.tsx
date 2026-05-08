/**
 * Checkout step 4 — Confirm.
 *
 * Reads the placeholder order from sessionStorage (written by ReviewPanel) and
 * renders order ID, expected ship date, payment status, line items, and links
 * to /order/[id] + /account/orders.
 */
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CheckoutSteps } from '../CheckoutSteps';
import { ConfirmPanel } from './ConfirmPanel';

export const metadata: Metadata = {
  title: 'Checkout — Confirmation',
};

export default function CheckoutConfirmPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-4xl px-6 py-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-4">
              Checkout
            </p>
            <h1 className="text-[32px] md:text-[40px] font-light leading-tight tracking-tight text-[var(--text)] mb-6">
              Order placed
            </h1>
            <CheckoutSteps active="confirm" />
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-12">
            <ConfirmPanel />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
