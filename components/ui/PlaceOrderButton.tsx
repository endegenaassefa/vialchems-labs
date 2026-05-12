"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button, buttonClassNames } from "@/components/ui/Button";

/**
 * Phase 7 (v4) — place-order button.
 *
 * Wraps the Posture A primary button with a brief loading state
 * (~300ms during which the button is disabled, aria-busy, and shows a
 * spinner) before the supplied onSubmit handler fires.
 *
 * Visual press-feedback comes from motion's whileTap, which honors
 * useReducedMotion (Iron Law 2.18). When motion is reduced, the scale
 * animation is suppressed; the loading state still runs.
 */

type PlaceOrderButtonProps = {
  onSubmit: () => void | Promise<void>;
  /** Visible label. Default: "Place order" if no children. */
  children?: ReactNode;
  /** Loading delay in ms — feels intentional, not laggy. Default 300. */
  loadingDelay?: number;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "className">;

export function PlaceOrderButton({
  onSubmit,
  children = "Place order",
  loadingDelay = 300,
  disabled = false,
  className,
}: PlaceOrderButtonProps) {
  const reduced = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const isDisabled = disabled || submitting;

  function handleClick() {
    if (isDisabled) return;
    setSubmitting(true);
    window.setTimeout(() => {
      void Promise.resolve(onSubmit()).finally(() => {
        setSubmitting(false);
      });
    }, loadingDelay);
  }

  if (reduced) {
    return (
      <Button
        variant="primary"
        size="lg"
        className={className}
        onClick={handleClick}
        disabled={isDisabled}
        aria-busy={submitting}
      >
        {submitting ? <Spinner /> : null}
        {children}
      </Button>
    );
  }

  return (
    <motion.button
      type="button"
      className={buttonClassNames("primary", "lg", className)}
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={submitting}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
    >
      {submitting ? <Spinner /> : null}
      {children}
    </motion.button>
  );
}

function Spinner() {
  return (
    <span
      data-testid="place-order-spinner"
      aria-hidden="true"
      className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px]"
    />
  );
}
