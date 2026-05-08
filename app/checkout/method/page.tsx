/**
 * Checkout step 2 — Payment method.
 *
 * Day-1 supported methods (per DECISIONS):
 *   - Crypto (BTCPay): 10-15% discount
 *   - Bank transfer (Plaid ACH): 5% discount
 *   - Cards: disabled (Coming soon) — Phase 2
 *
 * Side panel shows live order summary from the cart store.
 */
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CheckoutSteps } from '../CheckoutSteps';
import { MethodForm } from './MethodForm';

export const metadata: Metadata = {
  title: 'Checkout — Payment',
};

export default function CheckoutMethodPage() {
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
              Payment method
            </h1>
            <CheckoutSteps active="method" />
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-12">
            <MethodForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
