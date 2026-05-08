/**
 * Checkout step 1 — Address.
 *
 * Server shell + AddressForm client island. Client island is responsible for
 * the live state-blocking warning (CA, TX, NY, FL) and the country lock to US
 * for Day-1 (per Iron Law 2.8 + DECISIONS/compliance_posture.md).
 *
 * On submit: navigates to /checkout/method. Real address persistence lives in
 * Phase 9 (Supabase orders row).
 */
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CheckoutSteps } from '../CheckoutSteps';
import { AddressForm } from './AddressForm';

export const metadata: Metadata = {
  title: 'Checkout — Address',
};

export default function CheckoutAddressPage() {
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
              Shipping address
            </h1>
            <CheckoutSteps active="address" />
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-2xl px-6 py-12">
            <AddressForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
