/**
 * Toast — transient feedback surface.
 *
 * role="alert" + aria-live="polite" so AT announce on appearance without
 * stealing focus. Auto-dismisses after `duration` ms (default 4000; 0
 * disables). Used in Phase 4 to replace the inline `justAdded` Pill state
 * in AddToCartIsland; Phase 5 success/error confirmations.
 *
 * Reduced-motion fallback: the slide-in animation is a CSS class. The
 * global `@media (prefers-reduced-motion: reduce)` rule in globals.css
 * suppresses the animation; the alert content still renders.
 */
"use client";

import { useEffect, type HTMLAttributes, type Ref } from "react";
import { cn } from "@/lib/utils";

export type ToastTone = "info" | "success" | "error";

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  tone?: ToastTone;
  /** Milliseconds before onDismiss fires automatically. 0 disables. Default 4000. */
  duration?: number;
  onDismiss?: () => void;
  ref?: Ref<HTMLDivElement>;
}

const toneClasses: Record<ToastTone, string> = {
  info: "border-[var(--border-strong)] bg-[var(--surface-elevated)]",
  success:
    "border-[var(--accent-soft)] bg-[color:color-mix(in_srgb,var(--accent-soft)_8%,var(--surface-elevated))]",
  error:
    "border-[var(--pill-error)] bg-[color:color-mix(in_srgb,var(--pill-error)_8%,var(--surface-elevated))]",
};

export function Toast({
  message,
  tone = "info",
  duration = 4000,
  onDismiss,
  className,
  ref,
  ...rest
}: ToastProps) {
  useEffect(() => {
    if (!onDismiss || duration <= 0) return;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-center gap-3",
        "border rounded-[var(--radius-md)]",
        "px-4 py-3",
        "shadow-[var(--shadow-lg)]",
        "text-[14px] text-[var(--text)]",
        // Slide-in micro-animation; honors prefers-reduced-motion globally.
        "[animation:reveal-up_var(--dur-medium)_var(--ease-premium-out)_both]",
        toneClasses[tone],
        className,
      )}
      {...rest}
    >
      <span className="flex-1">{message}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn(
            "inline-flex items-center justify-center",
            "h-6 w-6 rounded-[var(--radius-sm)]",
            "text-[var(--text-muted)] hover:text-[var(--text)]",
            "transition-colors duration-[var(--dur-short)]",
          )}
        >
          <span aria-hidden>×</span>
        </button>
      ) : null}
    </div>
  );
}
