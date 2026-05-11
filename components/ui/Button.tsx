/**
 * Button — Posture A clean clinical primitive.
 *
 * Variants: primary, outline, ghost, data
 * Sizes:    sm, md, lg
 *
 * Iron Law: focus-visible rings come from globals.css (2px solid accent + 2px
 * offset). We do not override that here — it is global and contractual.
 *
 * Touch target: `sm` size is intentionally 32px high for desktop-only contexts
 * (filter chips, table-row actions). On mobile primary actions, prefer `md`+.
 */
import type { ButtonHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'data'
  | 'success'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  ref?: Ref<HTMLButtonElement>;
}

const baseClasses = [
  // layout
  'inline-flex items-center justify-center gap-2',
  'rounded-[10px]',
  // typography
  'font-medium',
  'whitespace-nowrap',
  // motion (premium-out, 200ms — Appendix V.2)
  'transition-[transform,background-color,border-color,color,box-shadow]',
  'duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
  // active scale (80ms micro)
  'active:scale-[0.98] active:duration-[80ms]',
  // disabled
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
].join(' ');

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--accent)] text-[var(--text-on-accent)]',
    'border border-[var(--accent)]',
    // Phase 2 v4 — additive shadow elevation per Phase 1 token system
    'shadow-[var(--shadow-sm)]',
    'hover:bg-[var(--accent-deep)] hover:border-[var(--accent-deep)]',
    'hover:-translate-y-px hover:shadow-[var(--shadow-md)]',
    // Phase 2 v4 — pressed state uses deeper teal (Iron Law 2.26 compliant)
    'active:bg-[var(--accent-deep)] active:border-[var(--accent-deep)]',
  ].join(' '),
  outline: [
    'bg-transparent text-[var(--text)]',
    'border border-[var(--border-strong)]',
    'hover:border-[var(--accent)] hover:text-[var(--accent)]',
    'hover:-translate-y-px',
  ].join(' '),
  ghost: [
    'bg-transparent text-[var(--text-muted)]',
    'hover:text-[var(--accent)] hover:bg-[var(--surface)]',
  ].join(' '),
  data: [
    'font-mono uppercase tracking-[0.12em]',
    'bg-[var(--surface-strong)] text-[var(--text)]',
    'border border-[var(--border)]',
    'hover:border-[var(--accent)] hover:text-[var(--accent)]',
  ].join(' '),
  // Phase 2 v4 — success variant for transactional confirmations.
  // Uses --accent-soft (lighter teal) to read as "ok / confirmed" within
  // Posture A; not a green-out (Iron Law 2.26 — no acid green).
  success: [
    'bg-[var(--accent-soft)] text-[var(--text-on-accent)]',
    'border border-[var(--accent-soft)]',
    'shadow-[var(--shadow-sm)]',
    'hover:bg-[var(--accent-glow)] hover:border-[var(--accent-glow)]',
    'hover:-translate-y-px hover:shadow-[var(--shadow-md)]',
  ].join(' '),
  // Phase 2 v4 — danger variant for destructive transactional surfaces
  // (cancel-order, refund-request — Phase 5 Dialog flows).
  danger: [
    'bg-[var(--pill-error)] text-[var(--text-on-accent)]',
    'border border-[var(--pill-error)]',
    'shadow-[var(--shadow-sm)]',
    'hover:opacity-90',
    'hover:-translate-y-px hover:shadow-[var(--shadow-md)]',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[14px]',
  md: 'h-10 px-4 text-[16px]',
  lg: 'h-12 px-6 text-[18px]',
};

/**
 * Phase 3 v4 — `buttonClassNames` exports the same className computation
 * the `Button` component uses, so that consumers needing button visuals on a
 * non-`<button>` element (typically `<Link>` for navigation CTAs) can reuse
 * the elevation + variant + size system without duplicating Tailwind classes.
 *
 * Nesting `<button>` inside `<Link>` (or vice versa) is invalid HTML; this
 * helper avoids that anti-pattern while keeping consumers on Phase 2 tokens.
 */
export function buttonClassNames(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string,
): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], extra);
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      // Default to type="button" to avoid accidental form submits — opt-in to
      // submit explicitly via the `type` prop.
      type={type ?? 'button'}
      className={buttonClassNames(variant, size, className)}
      {...rest}
    />
  );
}
