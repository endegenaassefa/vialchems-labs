/**
 * Sheet — bottom-anchored drawer for mobile.
 *
 * Optional alternative to Dialog on narrow viewports. Same a11y posture
 * (role="dialog" + aria-modal + aria-labelledby) but slides from the
 * bottom edge of the viewport instead of centering.
 *
 * Phase 5 considered using Sheet for mobile checkout step transitions;
 * default keeps the page-per-step pattern and Sheet stays as opt-in.
 */
"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface SheetProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  className,
  ref,
  ...rest
}: SheetProps) {
  const reactId = useId();
  const titleId = `sheet-title-${reactId}`;
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (open && panelRef.current) panelRef.current.focus();
  }, [open]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      data-testid="sheet-backdrop"
      onClick={onClose}
      className={cn(
        "fixed inset-0",
        "flex items-end justify-center",
        "bg-black/60 backdrop-blur-[2px]",
      )}
      style={{ zIndex: 40 }}
    >
      <div
        ref={(node) => {
          panelRef.current = node;
          if (ref) {
            if (typeof ref === "function") {
              ref(node);
            } else {
              (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                node;
            }
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "fixed bottom-0 left-0 right-0",
          "mx-auto max-w-2xl",
          "bg-[var(--surface-elevated)]",
          "border-t border-[var(--border-strong)]",
          "rounded-t-[var(--radius-lg)]",
          "shadow-[var(--shadow-2xl)]",
          "p-6",
          "focus:outline-none",
          // Slide-from-bottom; reduced-motion fallback global
          "[animation:reveal-up_var(--dur-medium)_var(--ease-premium-out)_both]",
          className,
        )}
        {...rest}
      >
        <h2
          id={titleId}
          className="text-[20px] font-medium text-[var(--text)] mb-4"
        >
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
