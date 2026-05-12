/**
 * Card — surface container.
 *
 * Default: `--surface` bg, 1px border, 14px radius.
 * Interactive: hover accent border + 1px translate-y lift (premium-out 200ms).
 *
 * Polymorphic via `as`: 'div' (default) | 'article' | 'section'. Use 'article'
 * for catalog tiles (each peptide card is a self-contained unit) and 'section'
 * for grouping regions inside a larger flow.
 */
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "interactive" | "elevated";
export type CardAs = "div" | "article" | "section";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  as?: CardAs;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

// Phase 2 v4 — Card surface backgrounds vary by variant.
// `elevated` swaps to --surface-elevated for a one-step-brighter floor that
// reads as a raised plinth against the page bg + atmospheric gradient.
const surfaceClasses: Record<CardVariant, string> = {
  default: "bg-[var(--surface)]",
  interactive: "bg-[var(--surface)]",
  elevated: "bg-[var(--surface-elevated)]",
};

const variantClasses: Record<CardVariant, string> = {
  // Phase 2 v4 — additive shadow on default for subtle separation from page bg.
  default: "shadow-[var(--shadow-sm)]",
  interactive: [
    "cursor-pointer",
    "transition-[transform,border-color,box-shadow]",
    "duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
    // Phase 2 v4 — resting shadow + lift to --shadow-md on hover
    "shadow-[var(--shadow-sm)]",
    "hover:border-[var(--accent)]",
    "hover:-translate-y-px hover:shadow-[var(--shadow-md)]",
  ].join(" "),
  // Phase 2 v4 — `elevated` variant for raised surfaces (PDP price strip,
  // Recovery Stack CTA card, account-dashboard tiles). Static raised plinth
  // — does NOT also hover-translate (would be visually busy per Iron Law 2.18).
  elevated: "shadow-[var(--shadow-lg)]",
};

export function Card({
  variant = "default",
  as = "div",
  className,
  children,
  ref,
  ...rest
}: CardProps) {
  const Component = as;
  return (
    <Component
      ref={ref as Ref<HTMLDivElement>}
      className={cn(
        surfaceClasses[variant],
        "border border-[var(--border)]",
        "rounded-[14px]",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
