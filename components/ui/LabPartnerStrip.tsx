/**
 * LabPartnerStrip — Horizontal strip of independent lab partners.
 *
 * Inspired by composio.dev's live integration logo strip. v4 ships with
 * monospace placeholder labels for each partner since real lab logos / brand
 * marks aren't licensed yet (Iron Law 2.10 spirit — no fake or unlicensed
 * marks). Janoshik Analytical is the v3.0 default lab partner per
 * lib/content/site.ts, with optional alternates listed in Appendix R.
 */
import { cn } from "@/lib/utils";

export interface LabPartner {
  name: string;
  /** Region/specialization caption shown under the name. */
  caption?: string;
  /** Whether this is the primary partner (default highlighted). */
  primary?: boolean;
}

export interface LabPartnerStripProps {
  /** Optional eyebrow above the strip. */
  eyebrow?: string;
  partners: LabPartner[];
  className?: string;
}

export function LabPartnerStrip({
  eyebrow = "Independent verification",
  partners,
  className,
}: LabPartnerStripProps) {
  return (
    <section className={cn("w-full", className)}>
      {eyebrow ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] mb-5">
          {eyebrow}
        </p>
      ) : null}
      <ul className="grid gap-px bg-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden grid-cols-2 md:grid-cols-4">
        {partners.map((partner) => (
          <li
            key={partner.name}
            className={cn(
              "bg-[var(--surface)] px-5 py-6 flex flex-col gap-1",
              partner.primary && "bg-[var(--surface-strong)]",
            )}
          >
            <span
              className={cn(
                "font-mono text-[12px] uppercase tracking-[0.12em] leading-tight",
                partner.primary ? "text-[var(--accent)]" : "text-[var(--text)]",
              )}
            >
              {partner.name}
            </span>
            {partner.caption ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-subtle)] leading-tight">
                {partner.caption}
              </span>
            ) : null}
            {partner.primary ? (
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--accent)] mt-1">
                Day 1 default
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
