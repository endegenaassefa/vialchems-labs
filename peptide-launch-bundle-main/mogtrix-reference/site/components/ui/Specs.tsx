// site/components/ui/Specs.tsx
import { cn } from '@/lib/utils';

export type SpecRow = { label: string; value: string };

type Props = {
  rows: SpecRow[];
  className?: string;
};

export function Specs({ rows, className }: Props) {
  return (
    <dl
      className={cn(
        'grid grid-cols-[auto_1fr] gap-y-1.5 gap-x-4 py-3.5 border-y border-[var(--border)]',
        className,
      )}
    >
      {rows.map((row) => (
        <SpecRowEl key={row.label} label={row.label} value={row.value} />
      ))}
    </dl>
  );
}

function SpecRowEl({ label, value }: SpecRow) {
  return (
    <>
      <dt className="font-mono text-[10px] tracking-[0.10em] uppercase text-[var(--text-subtle)]">
        {label}
      </dt>
      <dd className="font-mono text-xs text-[var(--text)] m-0 break-all">{value}</dd>
    </>
  );
}
