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
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              Certificates of Analysis
            </p>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-6">
              <span className="block">Every batch.</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">On file.</span>
            </h1>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] max-w-2xl mb-2">
              Per-batch HPLC purity, USP &lt;71&gt; sterility, and LAL endotoxin.
              Tested by Janoshik Analytical. Filter by peptide, batch, or laboratory.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              Records below are placeholders ahead of first production batch.
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
                placeholder="BPC-157, BATCH-2026, Janoshik…"
                aria-controls="coa-table"
              />
            </div>

            <div
              id="coa-table"
              className="overflow-x-auto rounded-[14px] border border-[var(--border)] bg-[var(--surface)]"
            >
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-[var(--text-muted)]"
                      >
                        No COAs match &quot;{query}&quot;.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={`${r.peptide}-${r.batch}`}>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
