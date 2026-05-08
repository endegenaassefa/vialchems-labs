/**
 * Pill — short status / metadata badge.
 *
 * Used for: VERIFIED, RUO ONLY, SHIPS US, IN STOCK, ALLOCATED, EXPIRED.
 *
 * A11y rule (Iron Law): color is never the sole indicator. Every pill
 * carries a text label. Variant only adjusts color; never removes text.
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/utils';

export type PillVariant = 'accent' | 'info' | 'electric' | 'error';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant: PillVariant;
  children: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

const variantClasses: Record<PillVariant, string> = {
  // text + border tinted with the variant color, ~10% bg fill
  accent:
    'text-[var(--pill-accent)] border-[color:color-mix(in_srgb,var(--pill-accent)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-accent)_12%,transparent)]',
  info: 'text-[var(--pill-info)] border-[color:color-mix(in_srgb,var(--pill-info)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-info)_12%,transparent)]',
  electric:
    'text-[var(--pill-electric)] border-[color:color-mix(in_srgb,var(--pill-electric)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-electric)_12%,transparent)]',
  error:
    'text-[var(--pill-error)] border-[color:color-mix(in_srgb,var(--pill-error)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-error)_12%,transparent)]',
};

export function Pill({
  variant,
  className,
  children,
  ref,
  ...rest
}: PillProps) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center',
        'h-6 px-2',
        'border rounded-full',
        'font-mono uppercase tracking-[0.12em]',
        'text-[11px] leading-none',
        'whitespace-nowrap',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
