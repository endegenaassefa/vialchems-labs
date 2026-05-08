/**
 * ProductTabs — client island.
 *
 * Three tabs: Description / Certificate of Analysis / Related Products.
 * Description is shortDescription for Phase 5 (Phase 6 swaps in 336-345 word
 * copy from Appendix E.1).
 *
 * COA tab renders a placeholder batch row using `coaRecords` from
 * `@/lib/content/coa`. PDF link points at the placeholder pdfPath; the actual
 * artifact is generated in Phase 7.
 *
 * Related Products tab picks 3 SKUs from the same category, falling back to
 * adjacent categories if fewer than 3 in-category siblings exist.
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Pill } from '@/components/ui/Pill';
import { Specs } from '@/components/ui/Specs';
import { Vial } from '@/components/ui/Vial';
import { coaRecords } from '@/lib/content/coa';
import {
  formatPerMg,
  formatPrice,
  getProductBySlug,
  products,
  type Product,
} from '@/lib/content/products';
import { siteConfig } from '@/lib/content/site';

type TabKey = 'description' | 'coa' | 'related';

interface ProductTabsProps {
  slug: string;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'description', label: 'Description' },
  { key: 'coa', label: 'Certificate of Analysis' },
  { key: 'related', label: 'Related products' },
];

export function ProductTabs({ slug }: ProductTabsProps) {
  const product = getProductBySlug(slug);
  const [active, setActive] = useState<TabKey>('description');

  if (!product) {
    return null;
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Product detail tabs"
        className="flex gap-1 border-b border-[var(--border)] mb-6 overflow-x-auto"
      >
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab.key}`}
              id={`tab-${tab.key}`}
              type="button"
              onClick={() => setActive(tab.key)}
              className={[
                'px-4 h-11 text-[14px] font-medium whitespace-nowrap',
                'border-b-2 -mb-px transition-colors',
                isActive
                  ? 'border-[var(--accent)] text-[var(--text)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {active === 'description' && <DescriptionPanel product={product} />}
      {active === 'coa' && <CoaPanel product={product} />}
      {active === 'related' && <RelatedPanel product={product} />}
    </div>
  );
}

function DescriptionPanel({ product }: { product: Product }) {
  return (
    <div
      role="tabpanel"
      id="tab-panel-description"
      aria-labelledby="tab-description"
      className="grid gap-10 md:grid-cols-[3fr_2fr]"
    >
      <div className="space-y-4 text-[16px] leading-[1.65] text-[var(--text-muted)]">
        <p className="text-[var(--text)]">{product.shortDescription}</p>
        <p>
          Each vial contains {product.dose} of lyophilized peptide. Sealed amber
          vial; reconstitute in laboratory-grade solvent according to the
          researcher&apos;s established protocol. Store at 2-8 °C until reconstitution.
        </p>
        <p className="text-[14px] text-[var(--text-subtle)] font-mono">
          Phase 6 will replace this body with the verbatim 336-345 word
          description from Appendix E.1.
        </p>
      </div>
      <Specs
        items={[
          { term: 'SKU', value: product.sku },
          { term: 'Format', value: 'Lyophilized vial' },
          { term: 'Dose', value: product.dose },
          { term: 'Storage', value: '2-8 °C, sealed' },
          { term: 'List price', value: formatPrice(product.listPriceCents) },
          { term: 'Per mg', value: formatPerMg(product.perMgCents) },
        ]}
      />
    </div>
  );
}

function CoaPanel({ product }: { product: Product }) {
  const record = coaRecords.find((r) => r.peptide === product.slug);
  if (!record) {
    return (
      <div role="tabpanel" id="tab-panel-coa" aria-labelledby="tab-coa">
        <p className="text-[var(--text-muted)]">No Certificate of Analysis on file.</p>
      </div>
    );
  }
  return (
    <div
      role="tabpanel"
      id="tab-panel-coa"
      aria-labelledby="tab-coa"
      className="grid gap-8 md:grid-cols-[3fr_2fr]"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Pill variant="accent">Verified</Pill>
          <Pill variant="info">Independent lab</Pill>
        </div>
        <p className="text-[15px] leading-[1.6] text-[var(--text-muted)]">
          Each batch of {product.shortName} is independently tested by{' '}
          <span className="text-[var(--text)]">{record.lab}</span> for purity by
          reverse-phase HPLC, sterility under USP &lt;71&gt;, and endotoxin level by
          LAL. The full report is available below.
        </p>
        <Link
          href={record.pdfPath}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
        >
          Download COA PDF
          <span aria-hidden="true">↓</span>
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
          Lab partner portal: {siteConfig.labPartner.name}
        </p>
      </div>
      <Specs
        items={[
          { term: 'Batch', value: record.batch },
          { term: 'Test date', value: record.testDate },
          { term: 'Lab', value: record.lab },
          { term: 'Purity (HPLC)', value: `${record.hplcPurityPct}%` },
          { term: 'Sterility (USP <71>)', value: record.sterilityResult },
          { term: 'Endotoxin (LAL)', value: record.endotoxinEU_per_mg },
        ]}
      />
    </div>
  );
}

function RelatedPanel({ product }: { product: Product }) {
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );
  const different = products.filter(
    (p) => p.category !== product.category && p.slug !== product.slug,
  );
  const related = [...sameCategory, ...different].slice(0, 3);

  return (
    <div
      role="tabpanel"
      id="tab-panel-related"
      aria-labelledby="tab-related"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {related.map((p) => (
        <Link
          key={p.slug}
          href={`/products/${p.slug}`}
          className="group border border-[var(--border)] rounded-[var(--radius-lg)] p-5 bg-[var(--surface)] hover:border-[var(--accent)] transition-colors"
        >
          <div className="flex items-start gap-4 mb-3">
            <Vial size="sm" aria-hidden="true" />
            <div>
              <h4 className="text-[15px] font-medium text-[var(--text)] group-hover:text-[var(--accent-soft)] transition-colors">
                {p.shortName}
              </h4>
              <p className="font-mono text-[11px] text-[var(--text-subtle)]">
                {p.dose} · {p.sku}
              </p>
            </div>
          </div>
          <p className="text-[13px] text-[var(--text-muted)] leading-[1.55] mb-3">
            {p.shortDescription}
          </p>
          <p className="font-mono tabular text-[14px] text-[var(--text)]">
            {formatPrice(p.listPriceCents)}
          </p>
        </Link>
      ))}
    </div>
  );
}
