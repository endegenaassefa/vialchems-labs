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

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'data';
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
    'bg-[var(--accent)] text-[#0a0e0f]',
    'border border-[var(--accent)]',
    'hover:bg-[var(--accent-soft)] hover:border-[var(--accent-soft)]',
    'hover:-translate-y-px',
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
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[14px]',
  md: 'h-10 px-4 text-[16px]',
  lg: 'h-12 px-6 text-[18px]',
};

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
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
}
