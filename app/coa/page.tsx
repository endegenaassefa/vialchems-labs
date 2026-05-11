'use client';

/**
 * COA library index. Renders all 7 placeholder COAs in a searchable
 * batch-lot table. Search is client-side Fuse.js over peptide name + batch
 * + lab.
 */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Pill } from '@/components/ui/Pill';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { coaRecords, type CoaRecord } from '@/lib/content/coa';

export default function CoaIndexPage() {
  const [query, setQuery] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse<CoaRecord>(coaRecords, {
        keys: ['peptideName', 'batch', 'lab'],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return coaRecords;
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse]);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* v4 hero — varied. COA library uses an all-mono data-card hero with
            three test-method badges; "Every batch. On file." retained as a
            small footer line because that's the actual brand promise of the
            page. Pattern borrowed from composio.dev's stat displays. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-10">
              C E R T I F I C A T E S · O F · A N A L Y S I S
            </p>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-10 max-w-3xl">
              The number on the vial resolves to a published certificate.
            </h1>
            <div className="grid gap-px bg-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden grid-cols-1 md:grid-cols-3 mb-8">
              {[
                {
                  method: 'HPLC',
                  caption: 'Reverse-phase, area-percent at 220nm',
                  value: '99.1%',
                  unit: 'avg purity',
                },
                {
                  method: 'USP <71>',
                  caption: 'Broth-based growth assay, 14-day incubation',
                  value: 'PASS',
                  unit: 'sterility',
                },
                {
                  method: 'LAL',
                  caption: 'Limulus Amebocyte Lysate gel-clot',
                  value: '0.05',
                  unit: 'EU/mg',
                },
              ].map((t) => (
                <div key={t.method} className="bg-[var(--surface)] px-6 py-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
                    {t.method}
                  </p>
                  <p className="font-mono tabular text-[28px] text-[var(--text)] leading-none mb-2">
                    {t.value}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-subtle)] mb-3">
                    {t.unit}
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)] leading-[1.5]">
                    {t.caption}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              Independent third-party laboratory · HPLC + USP &lt;71&gt; + LAL
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="mb-8 max-w-md">
              <label
                htmlFor="coa-search"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2"
              >
                Search
              </label>
              <Input
                id="coa-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="BPC-157, BATCH-2026, lab…"
                aria-controls="coa-table"
              />
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                title="No matching certificates"
                description={`No COAs match "${query}". Try a peptide name (BPC-157), batch ID, or laboratory name.`}
                action={
                  <Button variant="outline" size="md" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                }
              />
            ) : (
              <Card variant="elevated" id="coa-table" className="overflow-x-auto p-0">
                <table className="w-full text-left text-[14px]">
                  <thead className="border-b border-[var(--border)]">
                    <tr className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      <th className="px-4 py-3 font-normal">Peptide</th>
                      <th className="px-4 py-3 font-normal">Batch</th>
                      <th className="px-4 py-3 font-normal">Test date</th>
                      <th className="px-4 py-3 font-normal">Laboratory</th>
                      <th className="px-4 py-3 font-normal">HPLC purity</th>
                      <th className="px-4 py-3 font-normal">Status</th>
                      <th className="px-4 py-3 font-normal sr-only">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filtered.map((r, idx) => (
                      <tr
                        key={`${r.peptide}-${r.batch}`}
                        data-stagger-row=""
                        style={{ animationDelay: `${idx * 40}ms` }}
                        className="hover:bg-[var(--surface-strong)] transition-colors duration-[var(--dur-short)]"
                      >
                        <td className="px-4 py-4 text-[var(--text)]">
                          {r.peptideName}
                        </td>
                        <td className="px-4 py-4 font-mono text-[var(--text-muted)]">
                          {r.batch}
                        </td>
                        <td className="px-4 py-4 font-mono text-[var(--text-muted)]">
                          {r.testDate}
                        </td>
                        <td className="px-4 py-4 text-[var(--text-muted)]">
                          {r.lab}
                        </td>
                        <td className="px-4 py-4 font-mono tabular text-[var(--text)]">
                          {r.hplcPurityPct.toFixed(1)}%
                        </td>
                        <td className="px-4 py-4">
                          <Pill variant="accent">Verified</Pill>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link
                            href={`/coa/${r.peptide}/${r.batch}`}
                            className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)]"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
