/**
 * TestCard — one of the four cells in the /verify/[slug] 2x2 grid.
 *
 * Per super-prompt §5.1 (WWB layout):
 *   - Icon + Test name (h3) + technical subtitle
 *   - "Available" / "Pending" pill on right
 *   - PDF thumbnail (left column on desktop, stacked on mobile)
 *   - Two stacked CTAs:
 *       Primary: "View Full Report" → opens REDACTED PDF in new tab
 *       Secondary: disabled "External verification — coming soon" per
 *                  Iron Law 2.45 (no external lab portal links)
 *
 * Iron Law 2.45: this component MUST NOT render any <a> tag with an
 * external lab URL. The "External verification" slot is a visually
 * disabled placeholder reserved for a future Vialchems-owned
 * verification surface.
 */
import Image from "next/image";
import {
  Beaker,
  Microscope,
  Hexagon,
  Atom,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import type { ProductTest } from "@/lib/content/coa";

export type TestKey = "purity" | "sterility" | "endotoxin" | "heavyMetals";

const TEST_META: Record<
  TestKey,
  { title: string; subtitle: string; icon: typeof Beaker }
> = {
  purity: {
    title: "Purity (HPLC)",
    subtitle: "High-Performance Liquid Chromatography",
    icon: Beaker,
  },
  sterility: {
    title: "Sterility",
    subtitle: "Microbial Contamination Testing",
    icon: Microscope,
  },
  endotoxin: {
    title: "Endotoxin",
    subtitle: "LAL Endotoxin Assay",
    icon: Hexagon,
  },
  heavyMetals: {
    title: "Heavy Metals",
    subtitle: "ICP-MS Heavy Metals Screening",
    icon: Atom,
  },
};

export interface TestCardProps {
  test: ProductTest;
  testKey: TestKey;
  productName: string;
}

export function TestCard({ test, testKey, productName }: TestCardProps) {
  const meta = TEST_META[testKey];
  const IconComponent = meta.icon;
  const available = test.available;

  return (
    <article
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-4"
      aria-labelledby={`testcard-${testKey}-title`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-[var(--surface-muted)] text-[var(--accent)]"
            aria-hidden="true"
          >
            <IconComponent size={18} strokeWidth={1.5} />
          </span>
          <div>
            <h3
              id={`testcard-${testKey}-title`}
              className="text-[15px] font-semibold text-[var(--text)] leading-tight"
            >
              {meta.title}
            </h3>
            <p className="text-[12px] text-[var(--text-muted)] mt-1">
              {meta.subtitle}
            </p>
          </div>
        </div>
        <Pill variant={available ? "accent" : "info"}>
          {available ? "Available" : "Pending"}
        </Pill>
      </header>

      <div className="flex gap-4">
        {available && test.thumbPath ? (
          <div
            className="relative flex-shrink-0 w-[88px] h-[110px] rounded border border-[var(--border)] overflow-hidden bg-[var(--surface-muted)]"
            aria-hidden="true"
          >
            <Image
              src={test.thumbPath}
              alt=""
              fill
              sizes="88px"
              className="object-cover object-top"
            />
          </div>
        ) : (
          <div
            className="flex-shrink-0 w-[88px] h-[110px] rounded border border-dashed border-[var(--border)] bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-muted)]"
            aria-hidden="true"
          >
            <FileText size={20} strokeWidth={1.2} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {test.resultSummary && (
            <div className="mb-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-1">
                Result
              </p>
              <p className="font-mono text-[16px] font-semibold text-[var(--text)]">
                {test.resultSummary}
              </p>
            </div>
          )}
          {test.testDate && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-1">
                Tested
              </p>
              <p className="font-mono text-[13px] text-[var(--text-muted)]">
                {test.testDate}
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="flex flex-col gap-2 mt-auto">
        {available && test.pdfPath ? (
          <a
            href={test.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[var(--accent)] text-[#ffffff] text-[14px] font-semibold hover:opacity-90 transition-opacity"
            aria-label={`View ${meta.title} report for ${productName} (opens PDF in new tab)`}
          >
            <FileText size={14} strokeWidth={2} aria-hidden="true" />
            View Full Report
          </a>
        ) : (
          <span
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[var(--surface-muted)] text-[var(--text-muted)] text-[14px] font-medium cursor-not-allowed"
            aria-disabled="true"
          >
            Report pending
          </span>
        )}
        {/*
         * Iron Law 2.45 placeholder. NO href attribute. The slot reserves
         * visual space for a future Vialchems-owned verification surface.
         */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-[var(--border)] bg-transparent text-[var(--text-muted)] text-[13px] font-medium opacity-60 cursor-not-allowed"
        >
          <ExternalLink
            size={13}
            strokeWidth={1.5}
            className="opacity-50"
            aria-hidden="true"
          />
          External verification — coming soon
        </button>
      </footer>
    </article>
  );
}
