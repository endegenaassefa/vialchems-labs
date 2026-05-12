// site/lib/design/types.ts
// Shared types for design system primitives.

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'data';
export type PillVariant = 'accent' | 'info' | 'electric' | 'warn' | 'error';
export type CardVariant = 'surface' | 'strong' | 'data';
export type CoaStatus = 'verified' | 'archived' | 'expired' | 'pending';

export type Size = 'sm' | 'md' | 'lg';

export type DesignToken = {
  color: Record<string, string>;
  cssVar: Record<string, string>;
  space: Record<string, string>;
  radius: Record<string, string>;
};
