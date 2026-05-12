// site/components/ui/Pill.tsx
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { PillVariant } from '@/lib/design/types';

const base = 'inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[11px] tracking-[0.06em] uppercase border';

const variants: Record<PillVariant, string> = {
  accent: 'bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_28%,transparent)]',
  info: 'bg-[color-mix(in_srgb,var(--muted-blue)_14%,transparent)] text-[var(--muted-blue)] border-[color-mix(in_srgb,var(--muted-blue)_28%,transparent)]',
  electric: 'bg-[color-mix(in_srgb,var(--electric)_14%,transparent)] text-[var(--electric)] border-[color-mix(in_srgb,var(--electric)_28%,transparent)]',
  warn: 'bg-[color-mix(in_srgb,var(--amber)_14%,transparent)] text-[var(--amber)] border-[color-mix(in_srgb,var(--amber)_28%,transparent)]',
  error: 'bg-[color-mix(in_srgb,var(--error)_14%,transparent)] text-[var(--error)] border-[color-mix(in_srgb,var(--error)_28%,transparent)]',
};

type PillProps = HTMLAttributes<HTMLSpanElement> & { variant: PillVariant };

export function Pill({ className, variant, ...props }: PillProps) {
  return <span className={cn(base, variants[variant], className)} {...props} />;
}
