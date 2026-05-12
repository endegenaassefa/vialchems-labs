"use client";

import {
  Children,
  isValidElement,
  useSyncExternalStore,
  type ComponentType,
  type ElementType,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * Phase 7 (v4) — Motion & Interaction Layer.
 *
 * Wraps a list of children, fading each in with a small upward translate and
 * a stagger delay per child. Per Iron Law 2.18 (reduced-motion non-negotiable),
 * `prefers-reduced-motion: reduce` hard-disables the animation: children render
 * plain wrapped only in semantic `itemAs` elements, with no motion-driven
 * transform.
 *
 * Stagger 70ms per child / 320ms duration matches §7.4 + §8 PHASE 7 step 3.
 *
 * `as` controls the parent element type (e.g. 'ul', 'tbody', 'div').
 * `itemAs` controls the per-child wrapper element type (e.g. 'li', 'tr', 'div').
 * itemAs is what enables semantically correct HTML: a `<ul>` with `<li>`
 * children, a `<tbody>` with `<tr>` children, etc. — no invalid divs in
 * between, even when motion is active.
 */

type StaggerRevealProps = {
  as?: ElementType;
  /** Per-child wrapper element. Defaults to 'div'. */
  itemAs?: ElementType;
  children: ReactNode;
  className?: string;
  /** Per-child stagger delay in seconds. Default 0.07 = 70ms (within 60-80ms spec). */
  stagger?: number;
  /** Per-child animation duration in seconds. Default 0.32 = 320ms. */
  duration?: number;
  /** Vertical translate offset (px) for the entrance. */
  initialY?: number;
  /** Optional test hook. */
  "data-testid"?: string;
};

type DynamicTagProps = {
  children?: ReactNode;
  className?: string;
  "data-stagger-reveal"?: string;
  "data-testid"?: string;
};

const containerVariants = (stagger: number): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: 0 },
  },
});

const itemVariants = (duration: number, initialY: number): Variants => ({
  hidden: { opacity: 0, y: initialY },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
});

const subscribeHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

// Resolve the motion-fied version of a tag using the module-scoped motion
// proxy. Limited to the tag set vialchemlabs actually uses for stagger lists
// — ul, ol, li, div, span, tbody, tr — which lets the linter confirm at
// type-check time that no dynamic motion.create() is happening per render.
type AllowedStaggerTag = "div" | "span" | "ul" | "ol" | "li" | "tbody" | "tr";

type MotionTagProps = Record<string, unknown> & { children?: ReactNode };

function resolveMotionTag(tag: ElementType): ComponentType<MotionTagProps> {
  const t = (typeof tag === "string" ? tag : "div") as AllowedStaggerTag;
  switch (t) {
    case "span":
      return motion.span as unknown as ComponentType<Record<string, unknown>>;
    case "ul":
      return motion.ul as unknown as ComponentType<Record<string, unknown>>;
    case "ol":
      return motion.ol as unknown as ComponentType<Record<string, unknown>>;
    case "li":
      return motion.li as unknown as ComponentType<Record<string, unknown>>;
    case "tbody":
      return motion.tbody as unknown as ComponentType<Record<string, unknown>>;
    case "tr":
      return motion.tr as unknown as ComponentType<Record<string, unknown>>;
    case "div":
    default:
      return motion.div as unknown as ComponentType<Record<string, unknown>>;
  }
}

export function StaggerReveal({
  as = "div",
  itemAs = "div",
  children,
  className,
  stagger = 0.07,
  duration = 0.32,
  initialY = 8,
  "data-testid": testId,
}: StaggerRevealProps) {
  const reduced = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );
  const Tag = as as ElementType<DynamicTagProps>;
  const ItemTag = itemAs as ElementType<{ children?: ReactNode }>;

  if (!hydrated || reduced) {
    return (
      <Tag className={className} data-stagger-reveal="" data-testid={testId}>
        {Children.map(children, (child, index) => (
          <ItemTag key={getKey(child, index)}>{child}</ItemTag>
        ))}
      </Tag>
    );
  }

  // resolveMotionTag returns a stable, module-level motion proxy
  // (motion.div, motion.ul, motion.tbody, etc.) — no per-render component
  // creation despite what the linter heuristic suggests.
  const MotionTag = resolveMotionTag(Tag);
  const MotionItem = resolveMotionTag(ItemTag);

  return (
    /* eslint-disable react-hooks/static-components */
    <MotionTag
      className={className}
      data-stagger-reveal=""
      data-testid={testId}
      variants={containerVariants(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      {Children.map(children, (child, index) => (
        <MotionItem
          key={getKey(child, index)}
          variants={itemVariants(duration, initialY)}
        >
          {child}
        </MotionItem>
      ))}
    </MotionTag>
    /* eslint-enable react-hooks/static-components */
  );
}

function getKey(child: ReactNode, fallback: number): string | number {
  if (isValidElement(child)) {
    const k = (child as { key?: string | null }).key;
    if (k !== null && k !== undefined) return k;
  }
  return fallback;
}
