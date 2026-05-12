// site/lib/design/motion.ts
// Mogtrix Design System v2 — motion vocabulary.

export const easing = {
  premiumOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  move: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'ease-in',
  linear: 'linear',
} as const;

export const duration = {
  micro: 80,
  short: 200,
  medium: 320,
  long: 540,
  slow: 720,
  vialRotate: { min: 14000, max: 22000 } as const,
  sheen: 5400,
  pulse: 3600,
  float: 7800,
  fillRipple: 4000,
} as const;

export const motion = {
  hoverShort: `${duration.short}ms ${easing.premiumOut}`,
  hoverMedium: `${duration.medium}ms ${easing.premiumOut}`,
  staggerStep: 70,
} as const;
