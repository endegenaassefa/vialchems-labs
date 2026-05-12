// site/components/ui/Input.tsx
import type { InputHTMLAttributes, LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const inputBase = 'block w-full px-3.5 py-3 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] text-[var(--text)] text-sm transition-colors focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent)] focus:border-[var(--accent)]';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />;
}

const labelBase = 'block text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-muted)] mb-1.5';

export function FieldLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn(labelBase, className)} {...props} />;
}
