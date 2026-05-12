/**
 * Specs — definition list for compound metadata.
 *
 * Used on product pages: Sequence, Mass, Purity, Lot, Storage, COA link, etc.
 *
 * Semantics: native <dl> / <dt> / <dd>. Each row is a flex pair with a dotted
 * bottom-border separator (last row optionally suppresses via :last-child if
 * needed by the consumer's wrapping context).
 *
 * The `term` is mono and muted; the `value` is mono and full-text. Values may
 * be arbitrary ReactNodes (e.g., a COA <a> link).
 */
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

export interface SpecsItem {
  term: string;
  value: string | ReactNode;
}

export interface SpecsProps extends HTMLAttributes<HTMLDListElement> {
  items: ReadonlyArray<SpecsItem>;
  /**
   * Phase 2 v4 — `dense` tightens row spacing (py-2 → py-1) and drops dt/dd
   * font sizes one step (12px → 11px / 14px → 13px). Used in the PDP sidebar
   * (per Appendix AD §5 Metrics & Usage) where vertical space is at a premium.
   */
  dense?: boolean;
  ref?: Ref<HTMLDListElement>;
}

export function Specs({
  items,
  className,
  dense = false,
  ref,
  ...rest
}: SpecsProps) {
  return (
    <dl ref={ref} className={cn("w-full", className)} {...rest}>
      {items.map((item, index) => (
        <div
          key={`${item.term}-${index}`}
          className={cn(
            "flex items-baseline justify-between gap-4",
            dense ? "py-1" : "py-2",
            "border-b border-dotted border-[var(--border)]",
            // last row drops the divider so the list does not look unfinished
            "last:border-b-0",
          )}
        >
          <dt
            className={cn(
              "font-mono uppercase tracking-[0.12em] text-[var(--text-muted)]",
              dense ? "text-[11px]" : "text-[12px]",
            )}
          >
            {item.term}
          </dt>
          <dd
            className={cn(
              "font-mono text-[var(--text)] tabular-nums text-right",
              dense ? "text-[13px]" : "text-[14px]",
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
