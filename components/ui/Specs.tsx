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
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/utils';

export interface SpecsItem {
  term: string;
  value: string | ReactNode;
}

export interface SpecsProps extends HTMLAttributes<HTMLDListElement> {
  items: ReadonlyArray<SpecsItem>;
  ref?: Ref<HTMLDListElement>;
}

export function Specs({ items, className, ref, ...rest }: SpecsProps) {
  return (
    <dl
      ref={ref}
      className={cn('w-full', className)}
      {...rest}
    >
      {items.map((item, index) => (
        <div
          key={`${item.term}-${index}`}
          className={cn(
            'flex items-baseline justify-between gap-4',
            'py-2',
            'border-b border-dotted border-[var(--border)]',
            // last row drops the divider so the list does not look unfinished
            'last:border-b-0',
          )}
        >
          <dt className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {item.term}
          </dt>
          <dd className="font-mono text-[14px] text-[var(--text)] tabular-nums text-right">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
