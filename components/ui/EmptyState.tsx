/**
 * EmptyState — standardized empty-state pattern.
 *
 * Centered icon + headline + body + CTA. Used for cart-empty,
 * orders-empty, addresses-empty, COA-no-results, shop-no-results
 * (super-prompt §7.3).
 *
 * Heading is <h2> (assumes the page has an h1 already; Phase 8 a11y lift
 * verifies heading hierarchy across pages).
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ref,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'gap-4 py-16 px-6',
        className,
      )}
      {...rest}
    >
      {icon ? (
        <div className="text-[var(--text-subtle)]" aria-hidden>
          {icon}
        </div>
      ) : null}
      <h2 className="text-[24px] font-medium text-[var(--text)] leading-tight">
        {title}
      </h2>
      {description ? (
        <p className="max-w-md text-[15px] leading-[1.6] text-[var(--text-muted)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
