/**
 * Account dashboard — /account.
 *
 * Phase 5 stub. Cards link to nested account pages. Real account data binds in
 * Phase 8 once Supabase auth/clients are ported.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

export const metadata: Metadata = {
  title: 'Account',
  description:
    'Account dashboard. View recent orders, manage addresses, download Certificates of Analysis, and update email preferences.',
};

const TILES = [
  {
    href: '/account/orders',
    title: 'Recent orders',
    body: 'Order history, status, tracking, and per-batch COA reference.',
  },
  {
    href: '/account/addresses',
    title: 'Address book',
    body: 'Saved shipping addresses for faster checkout.',
  },
  {
    href: '/coa',
    title: 'Downloads',
    body: 'Certificates of Analysis for every batch you have ordered, plus our research index PDFs.',
  },
  {
    href: '/account/settings',
    title: 'Email preferences',
    body: 'Subscribe or unsubscribe from new-batch and research-index emails.',
  },
];

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-4">
              Account
            </p>
            <h1 className="text-[clamp(36px,5vw,60px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-6">
              Welcome back
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Pill variant="info">Stub</Pill>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                Real account data binds in Phase 8 (Supabase auth port)
              </span>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-5xl px-6 py-12 grid gap-6 sm:grid-cols-2">
            {TILES.map((tile) => (
              <Link key={tile.href} href={tile.href} className="block">
                <Card variant="interactive" className="p-6 h-full">
                  <h2 className="text-[20px] font-medium text-[var(--text)] mb-2">
                    {tile.title}
                  </h2>
                  <p className="text-[14px] leading-[1.55] text-[var(--text-muted)]">
                    {tile.body}
                  </p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
                    Open →
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
