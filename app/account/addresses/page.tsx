/**
 * Account addresses — Phase 5 stub.
 *
 * Renders the Add-Address form layout. Persistence to a real account row
 * lands in Phase 8 once Supabase auth is online.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card } from '@/components/ui/Card';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';

export const metadata: Metadata = {
  title: 'Account — Addresses',
};

export default function AddressesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
              Account / Addresses
            </p>
            <h1 className="text-[32px] md:text-[40px] font-light tracking-tight text-[var(--text)] mb-3">
              Address book
            </h1>
            <Pill variant="info">Stub</Pill>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-6 py-12">
            <Card className="p-6 mb-8 text-center">
              <p className="text-[16px] text-[var(--text-muted)]">
                You have no saved addresses yet.
              </p>
              <p className="text-[12px] text-[var(--text-subtle)] mt-2">
                Saved addresses speed up checkout. Add one below.
              </p>
            </Card>

            <Card className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
                Add address
              </p>
              <form className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="addr-label">
                    Label (e.g., &quot;Lab&quot;, &quot;Home&quot;)
                  </FieldLabel>
                  <div className="mt-2">
                    <Input id="addr-label" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="addr-recipient" required>
                    Recipient
                  </FieldLabel>
                  <div className="mt-2">
                    <Input id="addr-recipient" autoComplete="name" required />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="addr-street1" required>
                    Street
                  </FieldLabel>
                  <div className="mt-2">
                    <Input id="addr-street1" autoComplete="address-line1" required />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="addr-city" required>
                    City
                  </FieldLabel>
                  <div className="mt-2">
                    <Input id="addr-city" autoComplete="address-level2" required />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="addr-postal" required>
                    Zip
                  </FieldLabel>
                  <div className="mt-2">
                    <Input id="addr-postal" autoComplete="postal-code" required />
                  </div>
                </div>
                <div className="sm:col-span-2 flex flex-wrap gap-3">
                  <Button type="submit" variant="primary" size="md">
                    Save address
                  </Button>
                  <Link
                    href="/account"
                    className="inline-flex items-center gap-2 px-5 h-10 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
                  >
                    Back to account
                  </Link>
                </div>
                <p className="sm:col-span-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  Saved-address book activates with the public launch
                </p>
              </form>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
