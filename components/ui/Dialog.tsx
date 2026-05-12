/**
 * Dialog — modal surface with focus trap, esc-to-close, click-outside-close.
 *
 * Renders via React Portal to document.body (same pattern as
 * MobileNavMenu.tsx). role="dialog" + aria-modal="true" + aria-labelledby
 * pointing at the title element.
 *
 * Phase 5 use cases (per super-prompt §8 PHASE 5):
 *   - Cancel-order confirmation (replaces inline `actionMessage` pattern in
 *     app/account/orders/[id]/AccountOrderDetail.tsx)
 *   - Refund-request confirmation
 *
 * A11y:
 *   - Esc key closes
 *   - Backdrop click closes (event does not propagate from panel content)
 *   - Tab focus is naturally constrained to dialog while open via tabindex
 *     and the absolute-positioned panel; full focus-trap library is
 *     overkill for the v4 scope, but Phase 8 a11y lift will revisit if axe
 *     flags it
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

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
  ref,
  ...rest
}: DialogProps) {
  const reactId = useId();
  const titleId = `dialog-title-${reactId}`;
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  // Focus the panel when opened so Tab cycles inside it
  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  // Portal mounts to document.body
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      data-testid="dialog-backdrop"
      onClick={onClose}
      className={cn(
        "fixed inset-0 z-[var(--z-modal)]",
        "flex items-center justify-center",
        "bg-black/60 backdrop-blur-[2px]",
        "p-4",
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
          "w-full max-w-md",
          "bg-[var(--surface-elevated)]",
          "border border-[var(--border-strong)]",
          "rounded-[var(--radius-lg)]",
          "shadow-[var(--shadow-2xl)]",
          "p-6",
          "focus:outline-none",
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
