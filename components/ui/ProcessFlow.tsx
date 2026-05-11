/**
 * ProcessFlow — Numbered 01 / 02 / 03 process narrative primitive.
 *
 * Inspired by titanintake.com's "From Fax to Act" 4-step (Capture → Extract →
 * Organize → Integrate) process flow with monospace step numbers, and by
 * composio.dev's ASCII-art-as-brand-punctuation discipline. Renders as a
 * vertical-on-mobile, horizontal-on-desktop sequence of numbered steps.
 *
 * Each step gets a Plex Mono "01" eyebrow + Plex Sans heading + leading copy.
 * Steps connect visually with subtle dotted borders.
 */
import { cn } from '@/lib/utils';

export interface ProcessStep {
  /** Display label for the step number, e.g. "01", "02". Auto-padded if numeric. */
  n: number | string;
  title: string;
  description: string;
}

export interface ProcessFlowProps {
  /** Optional eyebrow above the flow (mono uppercase). */
  eyebrow?: string;
  /** Optional headline for the section. */
  headline?: string;
  steps: ProcessStep[];
  /** Layout: vertical column (default) or horizontal row on desktop. */
  layout?: 'vertical' | 'horizontal';
  /** Optional className passthrough on the wrapper. */
  className?: string;
}

function pad(n: number | string): string {
  if (typeof n === 'string') return n;
  return n.toString().padStart(2, '0');
}

// Static class lookup — Tailwind JIT cannot detect dynamic class strings, so
// we materialize the small valid range explicitly (1-6 step columns).
const HORIZONTAL_COLS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

export function ProcessFlow({
  eyebrow,
  headline,
  steps,
  layout = 'vertical',
  className,
}: ProcessFlowProps) {
  return (
    <section className={cn('w-full', className)}>
      {eyebrow ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
          {eyebrow}
        </p>
      ) : null}
      {headline ? (
        <h2 className="text-[clamp(28px,3.5vw,40px)] font-light leading-[1.15] tracking-tight text-[var(--text)] mb-10 max-w-3xl">
          {headline}
        </h2>
      ) : null}
      <ol
        className={cn(
          'grid gap-8',
          layout === 'horizontal'
            ? HORIZONTAL_COLS[Math.min(Math.max(steps.length, 1), 6)] ??
                'md:grid-cols-3'
            : 'grid-cols-1',
        )}
      >
        {steps.map((step, i) => (
          <li
            key={`${step.n}-${i}`}
            className={cn(
              'relative pl-0',
              layout === 'vertical' && 'md:pl-8',
            )}
          >
            <div
              className={cn(
                'flex items-baseline gap-4',
                layout === 'horizontal' && 'flex-col items-start gap-3',
              )}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] tabular shrink-0">
                {pad(step.n)}
              </span>
              <div className="flex-1">
                <h3 className="text-[18px] font-medium text-[var(--text)] mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[var(--text-muted)] leading-[1.55]">
                  {step.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
