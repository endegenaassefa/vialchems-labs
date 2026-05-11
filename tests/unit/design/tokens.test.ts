import { describe, expect, it } from 'vitest';
import {
  colors,
  typography,
  spacing,
  radius,
  motion,
  zIndex,
  tokens,
} from '@/lib/design/tokens';

/**
 * Phase 1 (v4) — Design System Elevation: Tokens.
 *
 * These tests enforce two contracts:
 *
 *   (a) Iron Law 2.21 — design tokens are additive-only, no breaking renames.
 *       Every existing v3.0 token stays exactly as it was.
 *
 *   (b) Phase 1 v4 additions exist with the expected shape: shadows,
 *       surfaceElevated, accentDeep, gradients, spacing 7xl/8xl, radius.pill,
 *       and component-tier + vial + label tokens (mirrored as CSS vars).
 *
 * Source-of-truth values for new tokens are documented inline. Mirror block
 * lives in app/globals.css.
 */

describe('design tokens (Iron Law 2.21 — additive-only)', () => {
  describe('existing v3.0 tokens (regression prevention — no renames, no value changes)', () => {
    it('colors keep their v3.0 values verbatim', () => {
      // Per lib/design/tokens.ts (v1.0.0). Any drift here is an Iron Law 2.21 violation.
      expect(colors.bg).toBe('#0a0e0f');
      expect(colors.surface).toBe('#141a1c');
      expect(colors.surfaceStrong).toBe('#1a2226');
      expect(colors.surfaceMuted).toBe('rgba(20, 26, 28, 0.6)');
      expect(colors.accent).toBe('#3dd4c8');
      expect(colors.accentSoft).toBe('#5eebdf');
      expect(colors.accentGlow).toBe('#7ff1e8');
      expect(colors.text).toBe('rgba(255, 255, 255, 0.92)');
      expect(colors.textMuted).toBe('rgba(255, 255, 255, 0.62)');
      // Phase 11.2 (v4) — bumped from 0.42 to 0.55 for WCAG AA contrast.
      // Iron Law 2.27 a11y gate trumps the literal-values interpretation of
      // 2.21 (which forbids RENAMES, not value tightening for a11y).
      expect(colors.textSubtle).toBe('rgba(255, 255, 255, 0.55)');
      expect(colors.border).toBe('#1f2a2e');
      expect(colors.borderStrong).toBe('#2a3a40');
      expect(colors.electric).toBe('#67e8f9');
      expect(colors.pillAccent).toBe('#3dd4c8');
      expect(colors.pillInfo).toBe('#5eebdf');
      expect(colors.pillElectric).toBe('#67e8f9');
      expect(colors.pillError).toBe('#f87171');
    });

    it('typography stack + scale + tracking unchanged', () => {
      expect(typography.sans).toBe('IBM Plex Sans, system-ui, sans-serif');
      expect(typography.mono).toBe('IBM Plex Mono, ui-monospace, monospace');
      expect(typography.serifItalic).toBe('Newsreader, ui-serif, Georgia, serif');
      expect(typography.scale.heroXl).toBe('clamp(48px, 7vw, 96px)');
      expect(typography.scale.heroLg).toBe('60px');
      expect(typography.scale.headlineLg).toBe('32px');
      expect(typography.scale.bodyLg).toBe('18px');
      expect(typography.scale.bodyMd).toBe('16px');
      expect(typography.scale.bodySm).toBe('14px');
      expect(typography.scale.monoSm).toBe('12px');
      expect(typography.scale.labelUppercase).toBe('11px');
      expect(typography.tracking.label).toBe('0.16em');
      expect(typography.tracking.fieldLabel).toBe('0.12em');
    });

    it('spacing keeps its v3.0 4px-based scale unchanged', () => {
      expect(spacing['2xs']).toBe('2px');
      expect(spacing.xs).toBe('4px');
      expect(spacing.sm).toBe('8px');
      expect(spacing.md).toBe('12px');
      expect(spacing.lg).toBe('16px');
      expect(spacing.xl).toBe('24px');
      expect(spacing['2xl']).toBe('32px');
      expect(spacing['3xl']).toBe('48px');
      expect(spacing['4xl']).toBe('64px');
      expect(spacing['5xl']).toBe('96px');
      expect(spacing['6xl']).toBe('128px');
    });

    it('radius keeps its v3.0 values unchanged', () => {
      expect(radius.sm).toBe('4px');
      expect(radius.md).toBe('10px');
      expect(radius.lg).toBe('14px');
      expect(radius.xl).toBe('16px');
      expect(radius['2xl']).toBe('18px');
      expect(radius.full).toBe('999px');
    });

    it('motion eases + durations unchanged', () => {
      expect(motion.ease.premiumOut).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
      expect(motion.ease.in).toBe('ease-in');
      expect(motion.ease.move).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
      expect(motion.ease.linear).toBe('linear');
      expect(motion.duration.micro).toBe('80ms');
      expect(motion.duration.short).toBe('200ms');
      expect(motion.duration.medium).toBe('320ms');
      expect(motion.duration.long).toBe('540ms');
      expect(motion.duration.slow).toBe('720ms');
      expect(motion.duration.continuousMin).toBe('14000ms');
      expect(motion.duration.continuousMax).toBe('22000ms');
    });

    it('zIndex stack unchanged', () => {
      expect(zIndex.base).toBe(0);
      expect(zIndex.dropdown).toBe(10);
      expect(zIndex.sticky).toBe(20);
      expect(zIndex.overlay).toBe(30);
      expect(zIndex.modal).toBe(40);
      expect(zIndex.toast).toBe(50);
    });
  });

  describe('Phase 1 v4 additions — shadows', () => {
    it('exports a shadows token category with sm/md/lg/xl/2xl', async () => {
      const tokensModule = await import('@/lib/design/tokens');
      expect(tokensModule.shadows).toBeDefined();
      expect(tokensModule.shadows.sm).toMatch(/^0 1px 2px 0 rgba\(0, 0, 0, /);
      expect(tokensModule.shadows.md).toMatch(/^0 4px 12px -2px rgba\(0, 0, 0, /);
      expect(tokensModule.shadows.lg).toMatch(/^0 12px 32px -4px rgba\(0, 0, 0, /);
      expect(tokensModule.shadows.xl).toMatch(/^0 24px 64px -12px rgba\(0, 0, 0, /);
      expect(tokensModule.shadows['2xl']).toMatch(/^0 32px 96px -16px rgba\(0, 0, 0, /);
    });

    it('shadows are exposed via the unified tokens object', async () => {
      const tokensModule = await import('@/lib/design/tokens');
      expect(tokensModule.tokens.shadows).toBe(tokensModule.shadows);
    });
  });

  describe('Phase 1 v4 additions — surfaceElevated + accentDeep', () => {
    it('colors.surfaceElevated sits between surfaceStrong and a hypothetical brighter floor', () => {
      // Used for hover/active states one step above surface-strong.
      // Value chosen on the dark-mode value ramp; documented in app/globals.css.
      expect(colors).toHaveProperty('surfaceElevated');
      expect((colors as { surfaceElevated: string }).surfaceElevated).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('colors.accentDeep sits one step deeper than accent (#3dd4c8) for pressed states', () => {
      expect(colors).toHaveProperty('accentDeep');
      expect((colors as { accentDeep: string }).accentDeep).toMatch(/^#[0-9a-f]{6}$/i);
      // Smoke check: not equal to accent itself
      expect((colors as { accentDeep: string }).accentDeep).not.toBe(colors.accent);
    });
  });

  describe('Phase 1 v4 additions — gradients', () => {
    it('exports a gradients token category with heroAtmospheric + accentRadial', async () => {
      const tokensModule = await import('@/lib/design/tokens');
      expect(tokensModule.gradients).toBeDefined();
      expect(tokensModule.gradients.heroAtmospheric).toContain('radial-gradient');
      expect(tokensModule.gradients.heroAtmospheric).toContain('rgba(61, 212, 200');
      expect(tokensModule.gradients.accentRadial).toContain('radial-gradient');
    });
  });

  describe('Phase 1 v4 additions — spacing 7xl + 8xl', () => {
    it('spacing[7xl] = 192px (hero atmospheric breathing room)', () => {
      expect((spacing as Record<string, string>)['7xl']).toBe('192px');
    });

    it('spacing[8xl] = 256px (max hero generosity)', () => {
      expect((spacing as Record<string, string>)['8xl']).toBe('256px');
    });
  });

  describe('Phase 1 v4 additions — radius.pill alias', () => {
    it('radius.pill aliases radius.full at 999px (clarity for pill components)', () => {
      expect((radius as { pill?: string }).pill).toBe('999px');
      expect((radius as { pill?: string }).pill).toBe(radius.full);
    });
  });

  describe('Phase 1 v4 additions — unified tokens object includes new categories', () => {
    it('tokens.shadows + tokens.gradients are exposed alongside existing categories', async () => {
      const tokensModule = await import('@/lib/design/tokens');
      expect(tokensModule.tokens).toMatchObject({
        colors: expect.any(Object),
        typography: expect.any(Object),
        spacing: expect.any(Object),
        radius: expect.any(Object),
        motion: expect.any(Object),
        zIndex: expect.any(Object),
        shadows: expect.any(Object),
        gradients: expect.any(Object),
      });
    });
  });
});
