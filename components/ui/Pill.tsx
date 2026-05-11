/**
 * Pill — short status / metadata badge.
 *
 * Used for: VERIFIED, RUO ONLY, SHIPS US, IN STOCK, ALLOCATED, EXPIRED.
 *
 * A11y rule (Iron Law): color is never the sole indicator. Every pill
 * carries a text label. Variant only adjusts color; never removes text.
 *
 * Phase 2 v4 — `kind` prop extends Pill into a Badge surface (per super-
 * prompt §8 PHASE 2 step 13: "extend Pill with kind: 'status' | 'category'
 * | 'tag' prop"). Default kind="status" preserves the existing v3.0
 * color-mix tinted bg. kind="category" uses --surface (lower visual
 * weight; for catalog category labels). kind="tag" uses --surface-muted
 * with --text-muted (for inline data tags like SKU codes).
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/utils';

export type PillVariant = 'accent' | 'info' | 'electric' | 'error';
export type PillKind = 'status' | 'category' | 'tag';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant: PillVariant;
  /**
   * Visual weight kind. Default 'status' (existing v3.0 behavior).
   * 'category' uses surface bg; 'tag' uses surface-muted + muted text.
   */
  kind?: PillKind;
  children: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

// Status kind — existing v3.0 visual: text + border tinted with the
// variant color, ~12% bg fill via color-mix.
const statusVariantClasses: Record<PillVariant, string> = {
  accent:
    'text-[var(--pill-accent)] border-[color:color-mix(in_srgb,var(--pill-accent)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-accent)_12%,transparent)]',
  info: 'text-[var(--pill-info)] border-[color:color-mix(in_srgb,var(--pill-info)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-info)_12%,transparent)]',
  electric:
    'text-[var(--pill-electric)] border-[color:color-mix(in_srgb,var(--pill-electric)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-electric)_12%,transparent)]',
  error:
    'text-[var(--pill-error)] border-[color:color-mix(in_srgb,var(--pill-error)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--pill-error)_12%,transparent)]',
};

// Category kind — surface bg with variant text color (lower visual weight
// than status; used for catalog category tags).
const categoryVariantClasses: Record<PillVariant, string> = {
  accent:
    'text-[var(--pill-accent)] border-[var(--border)] bg-[var(--surface)]',
  info: 'text-[var(--pill-info)] border-[var(--border)] bg-[var(--surface)]',
  electric:
    'text-[var(--pill-electric)] border-[var(--border)] bg-[var(--surface)]',
  error: 'text-[var(--pill-error)] border-[var(--border)] bg-[var(--surface)]',
};

// Tag kind — muted bg + muted text. Variant only tints the border so the
// tag reads as low-importance (inline SKU codes, dose readouts in tables).
const tagVariantClasses: Record<PillVariant, string> = {
  accent:
    'text-[var(--text-muted)] border-[color:color-mix(in_srgb,var(--pill-accent)_30%,transparent)] bg-[var(--surface-muted)]',
  info: 'text-[var(--text-muted)] border-[color:color-mix(in_srgb,var(--pill-info)_30%,transparent)] bg-[var(--surface-muted)]',
  electric:
    'text-[var(--text-muted)] border-[color:color-mix(in_srgb,var(--pill-electric)_30%,transparent)] bg-[var(--surface-muted)]',
  error:
    'text-[var(--text-muted)] border-[color:color-mix(in_srgb,var(--pill-error)_30%,transparent)] bg-[var(--surface-muted)]',
};

const kindClassMap: Record<PillKind, Record<PillVariant, string>> = {
  status: statusVariantClasses,
  category: categoryVariantClasses,
  tag: tagVariantClasses,
};

export function Pill({
  variant,
  kind = 'status',
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
        'h-[var(--pill-h)] px-2',
        'border rounded-full',
        'font-mono uppercase tracking-[0.12em]',
        'text-[11px] leading-none',
        'whitespace-nowrap',
        kindClassMap[kind][variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
