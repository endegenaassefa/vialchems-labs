// site/components/ui/Button.tsx
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ButtonVariant } from '@/lib/design/types';

const base = 'inline-flex items-center justify-center gap-2 min-h-11 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ease-out';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-black shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_50%,transparent),0_12px_30px_rgba(124,255,0,0.18)] hover:bg-[var(--accent-soft)] hover:-translate-y-px hover:shadow-[0_0_0_1px_var(--accent-soft),0_18px_44px_rgba(124,255,0,0.32)]',
  outline:
    'bg-[color-mix(in_srgb,var(--surface)_60%,transparent)] text-[var(--text)] border border-[var(--border-strong)] backdrop-blur-sm hover:border-[var(--accent)] hover:text-[var(--accent)]',
  ghost:
    'bg-transparent text-[var(--text-muted)] hover:text-[var(--text)]',
  data:
    'bg-[var(--surface-data)] text-[var(--text)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] font-mono text-xs px-3 py-2 rounded-lg',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
};

export function ButtonLink({ className, variant = 'primary', href, ...props }: ButtonLinkProps) {
  return <Link href={href} className={cn(base, variants[variant], className)} {...props} />;
}
