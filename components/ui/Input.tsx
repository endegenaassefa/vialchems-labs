/**
 * Input — text input field.
 *
 * Visual: surface-strong bg, 1px border, 10px radius. Focus ring comes from
 * globals.css `*:focus-visible` (2px solid accent + 2px offset).
 *
 * A11y:
 *  - When `error` is set, render an error message paired via aria-describedby
 *    and toggle aria-invalid="true". Error region is role="alert" so AT
 *    announces it on appearance.
 *  - Pair with a <FieldLabel htmlFor={id}> upstream for full association.
 */
import { useId, type InputHTMLAttributes, type Ref } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  id,
  error,
  className,
  ref,
  'aria-describedby': ariaDescribedByProp,
  ...rest
}: InputProps) {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [ariaDescribedByProp, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={cn(
          'w-full',
          'bg-[var(--surface-strong)]',
          'text-[var(--text)]',
          'placeholder:text-[var(--text-subtle)]',
          'border border-[var(--border)]',
          'rounded-[10px]',
          'h-10 px-3',
          'text-[16px]',
          'transition-[colors,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'hover:border-[var(--border-strong)]',
          // Phase 2 v4 — inset shadow on focus for depth perception
          // (complements global *:focus-visible 2px outline; Apple Dev Docs feel).
          'focus:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.32)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-[var(--pill-error)] hover:border-[var(--pill-error)]'
            : '',
          className,
        )}
        {...rest}
      />
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1 text-[12px] font-mono text-[var(--pill-error)]"
        >
          {error}
        </p>
      ) : null}
    </>
  );
}
