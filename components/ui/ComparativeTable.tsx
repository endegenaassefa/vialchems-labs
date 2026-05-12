/**
 * ComparativeTable — "Industry standard vs vialchemlabs standard" table primitive.
 *
 * Inspired by titanintake.com's "WITH vs WITHOUT" 6-row comparative table,
 * which is the strongest single trust signal observed across the v4 design
 * dissection set. Renders a dense, scannable comparison with one column
 * visually emphasized (the brand column).
 *
 * Pure presentational. No TDD-blocking logic; verified by snapshot test.
 */
import { cn } from "@/lib/utils";

export interface ComparativeRow {
  label: string;
  industry: string;
  vialchemlabs: string;
}

export interface ComparativeTableProps {
  /** Optional eyebrow above the table (mono uppercase). */
  eyebrow?: string;
  /** Optional table caption (used as visually-hidden caption for a11y). */
  caption?: string;
  /** Column header for the industry column. Defaults to "Industry typical". */
  industryHeader?: string;
  /** Column header for the brand column. Defaults to "vialchemlabs". */
  vialchemlabsHeader?: string;
  /** Rows of the comparison. */
  rows: ComparativeRow[];
  /** Optional className passthrough on the wrapper section. */
  className?: string;
}

export function ComparativeTable({
  eyebrow,
  caption,
  industryHeader = "Industry typical",
  vialchemlabsHeader = "vialchemlabs",
  rows,
  className,
}: ComparativeTableProps) {
  return (
    <section className={cn("w-full", className)}>
      {eyebrow ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-4">
          {eyebrow}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
        <table className="w-full border-collapse text-left">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="bg-[var(--surface-strong)]">
              <th
                scope="col"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] px-5 py-4 w-[28%]"
              >
                Standard
              </th>
              <th
                scope="col"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] px-5 py-4 w-[36%]"
              >
                {industryHeader}
              </th>
              <th
                scope="col"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] px-5 py-4 w-[36%]"
              >
                {vialchemlabsHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.label}
                className={cn(
                  i !== rows.length - 1 && "border-b border-[var(--border)]",
                )}
              >
                <th
                  scope="row"
                  className="px-5 py-4 text-[14px] font-medium text-[var(--text)] align-top"
                >
                  {row.label}
                </th>
                <td className="px-5 py-4 text-[14px] text-[var(--text-muted)] leading-[1.55] align-top">
                  {row.industry}
                </td>
                <td className="px-5 py-4 text-[14px] text-[var(--text)] leading-[1.55] align-top bg-[color:color-mix(in_srgb,var(--accent)_6%,transparent)]">
                  {row.vialchemlabs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
