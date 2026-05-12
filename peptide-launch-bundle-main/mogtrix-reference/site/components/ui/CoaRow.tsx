// site/components/ui/CoaRow.tsx
import { cn } from '@/lib/utils';
import { Pill } from './Pill';
import type { CoaStatus } from '@/lib/design/types';

const statusToVariant = {
  verified: 'accent',
  archived: 'info',
  expired: 'error',
  pending: 'electric',
} as const;

const statusLabel: Record<CoaStatus, string> = {
  verified: 'VERIFIED',
  archived: 'ARCHIVED',
  expired: 'EXPIRED',
  pending: 'PENDING',
};

type Props = {
  batch: string;
  info: string;
  status: CoaStatus;
  className?: string;
};

export function CoaRow({ batch, info, status, className }: Props) {
  const verifiedBorder =
    status === 'verified'
      ? 'border-[color-mix(in_srgb,var(--accent)_30%,transparent)]'
      : 'border-[var(--border)]';
  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr_auto] gap-3 items-center p-3.5 rounded-xl bg-[var(--surface-strong)] border',
        verifiedBorder,
        className,
      )}
    >
      <span className="font-mono text-xs text-[var(--text)] tracking-[0.04em]">{batch}</span>
      <span className="text-xs text-[var(--text-muted)]">{info}</span>
      <Pill variant={statusToVariant[status]}>{statusLabel[status]}</Pill>
    </div>
  );
}
