/**
 * FieldLabel — uppercase Plex Mono label for form fields.
 *
 * Visual: 11px / mono / uppercase / 0.12em tracking / muted text color.
 * A11y:
 *  - Renders a real `<label>` element (so click-to-focus works).
 *  - Required marker is visual-only (`aria-hidden`); the `required` attribute
 *    on the input itself is the source of truth for assistive tech.
 *  - Pair with an Input that has a matching `id`.
 */
import type { LabelHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/utils';

export interface FieldLabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLLabelElement>;
}

export function FieldLabel({
  required = false,
  className,
  children,
  ref,
  ...rest
}: FieldLabelProps) {
  return (
    <label
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1',
        'font-mono uppercase',
        'text-[11px] tracking-[0.12em]',
        'text-[var(--text-muted)]',
        className,
      )}
      {...rest}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="text-[var(--accent)]">
          *
        </span>
      ) : null}
    </label>
  );
}
