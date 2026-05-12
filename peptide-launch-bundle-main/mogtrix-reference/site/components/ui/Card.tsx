// site/components/ui/Card.tsx
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { CardVariant } from '@/lib/design/types';

const base = 'border rounded-2xl p-6 transition-colors';

const variants: Record<CardVariant, string> = {
  surface: 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)]',
  strong: 'bg-[var(--surface-strong)] border-[var(--border)]',
  data: 'bg-[var(--surface-data)] border-[color-mix(in_srgb,var(--accent)_24%,transparent)]',
};

type CardProps = HTMLAttributes<HTMLDivElement> & { variant?: CardVariant };

export function Card({ className, variant = 'surface', ...props }: CardProps) {
  return <div className={cn(base, variants[variant], className)} {...props} />;
}
