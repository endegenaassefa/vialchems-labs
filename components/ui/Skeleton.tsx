/**
 * Skeleton — loading-state placeholder. Per super-prompt §7.3:
 * "skeleton screens, NOT spinners".
 *
 * Variants:
 *   - text     (default; inline-block line)
 *   - card     (block-level surface, h-32 default)
 *   - tableRow (full-width thin bar, h-10 default)
 *   - image    (aspect-square block, for image/SVG placeholders)
 *
 * A11y: role="status" + aria-busy="true" + aria-label="Loading" so AT
 * announce the loading state without spamming announcements.
 *
 * Reduced-motion fallback: the optional pulse animation honors the
 * global `@media (prefers-reduced-motion: reduce)` rule in globals.css.
 */
import type { HTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/utils';

export type SkeletonVariant = 'text' | 'card' | 'tableRow' | 'image';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  ref?: Ref<HTMLDivElement>;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'inline-block h-4 w-32 align-middle',
  card: 'block h-32 w-full',
  tableRow: 'block h-10 w-full',
  image: 'block w-full aspect-square',
};

export function Skeleton({
  variant = 'text',
  className,
  ref,
  ...rest
}: SkeletonProps) {
  return (
    <div
      ref={ref}
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className={cn(
        'bg-[var(--surface-strong)]',
        'rounded-[var(--radius-sm)]',
        // Subtle pulse keeps the surface from feeling dead. Honors
        // prefers-reduced-motion globally.
        'animate-pulse',
        variantClasses[variant],
        className,
      )}
      {...rest}
    />
  );
}
