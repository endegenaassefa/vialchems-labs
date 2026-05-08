/**
 * CheckoutSteps — shared progress indicator across the 4 checkout steps.
 *
 * Renders 4 numbered pills with completion + active styling. Pure server
 * component (just markup + active prop).
 */
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'address', label: 'Address', n: 1 },
  { id: 'method', label: 'Payment', n: 2 },
  { id: 'review', label: 'Review', n: 3 },
  { id: 'confirm', label: 'Confirm', n: 4 },
] as const;

export type CheckoutStepId = (typeof STEPS)[number]['id'];

export function CheckoutSteps({ active }: { active: CheckoutStepId }) {
  const activeIdx = STEPS.findIndex((s) => s.id === active);
  return (
    <ol
      role="list"
      aria-label="Checkout progress"
      className="flex items-center gap-3 flex-wrap"
    >
      {STEPS.map((step, idx) => {
        const isActive = step.id === active;
        const isComplete = idx < activeIdx;
        return (
          <li key={step.id} className="flex items-center gap-3">
            <span
              className={cn(
                'inline-flex items-center gap-2',
                'font-mono text-[11px] uppercase tracking-[0.16em]',
                isActive
                  ? 'text-[var(--accent)]'
                  : isComplete
                    ? 'text-[var(--text)]'
                    : 'text-[var(--text-subtle)]',
              )}
            >
              <span
                className={cn(
                  'inline-flex items-center justify-center h-6 w-6 rounded-full border text-[10px]',
                  isActive
                    ? 'border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]'
                    : isComplete
                      ? 'border-[var(--text)] bg-[var(--text)] text-[var(--bg)]'
                      : 'border-[var(--border-strong)] text-[var(--text-subtle)]',
                )}
              >
                {step.n}
              </span>
              {step.label}
            </span>
            {idx < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="h-px w-6 bg-[var(--border-strong)]"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
