/**
 * Card — surface container.
 *
 * Default: `--surface` bg, 1px border, 14px radius.
 * Interactive: hover accent border + 1px translate-y lift (premium-out 200ms).
 *
 * Polymorphic via `as`: 'div' (default) | 'article' | 'section'. Use 'article'
 * for catalog tiles (each peptide card is a self-contained unit) and 'section'
 * for grouping regions inside a larger flow.
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'interactive';
export type CardAs = 'div' | 'article' | 'section';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  as?: CardAs;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

const variantClasses: Record<CardVariant, string> = {
  default: '',
  interactive: [
    'cursor-pointer',
    'transition-[transform,border-color,box-shadow]',
    'duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
    'hover:border-[var(--accent)]',
    'hover:-translate-y-px',
  ].join(' '),
};

export function Card({
  variant = 'default',
  as = 'div',
  className,
  children,
  ref,
  ...rest
}: CardProps) {
  const Component = as;
  return (
    <Component
      ref={ref as Ref<HTMLDivElement>}
      className={cn(
        'bg-[var(--surface)]',
        'border border-[var(--border)]',
        'rounded-[14px]',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
