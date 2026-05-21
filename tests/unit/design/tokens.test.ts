import { describe, expect, it } from "vitest";
import {
  colors,
  typography,
  spacing,
  radius,
  motion,
  zIndex,
  shadows,
  gradients,
  tokens,
} from "@/lib/design/tokens";

/**
 * v5 — Design System Tokens (light clinical theme per LOCKED_OVERRIDE).
 *
 * Asserts:
 *   (a) Iron Law 2.21 + 2.26/2.37 — tokens mirror app/globals.css :root,
 *       which ships the v5 LOCKED light theme per
 *       docs/DECISIONS/locked_override_2026-05-20.md. The dark→light
 *       migration is an authorized LOCKED_OVERRIDE; values below are the
 *       NEW LOCKED canonical (no longer the v3/v4 dark+teal).
 *   (b) Iron Law 2.27 — text contrast values pre-verified WCAG AA on
 *       cream #fafaf7 background.
 *   (c) Phase 1 v4 additions exist with the expected shape: shadows,
 *       surfaceElevated, accentDeep, gradients, spacing 7xl/8xl, radius.pill.
 *
 * Source-of-truth values: app/globals.css :root (runtime authority);
 * lib/design/tokens.ts mirrors for JS-driven consumers (recharts, pdf-lib,
 * motion timings, etc.).
 */

describe("design tokens (v5 LOCKED light theme — Iron Law 2.26/2.37 amendment)", () => {
  describe("colors (v5 light clinical — mirrors app/globals.css :root)", () => {
    it("surfaces use the cream + white scale (light theme)", () => {
      expect(colors.bg).toBe("#fafaf7");
      expect(colors.surface).toBe("#ffffff");
      expect(colors.surfaceStrong).toBe("#f4f4f0");
      expect(colors.surfaceMuted).toBe("rgba(244, 244, 240, 0.7)");
      expect(colors.surfaceElevated).toBe("#ffffff");
    });

    it("brand accents use the cyan-navy palette (v5 LOCKED)", () => {
      expect(colors.accent).toBe("#0f3a5f"); // primary deep navy
      expect(colors.accentSoft).toBe("#e8f7fb"); // accent tint
      expect(colors.accentGlow).toBe("#06b6d4"); // cyan high-key
      expect(colors.accentDeep).toBe("#082842"); // pressed
      expect(colors.electric).toBe("#06b6d4");
    });

    it("text contrast pre-verified WCAG AA on cream background", () => {
      expect(colors.text).toBe("#0a0e14"); // 17:1 on #fafaf7
      expect(colors.textMuted).toBe("#4d5663"); // 7.1:1
      expect(colors.textSubtle).toBe("#6b7280"); // 4.8:1 (just clears AA)
    });

    it("borders use hairline-only scale", () => {
      expect(colors.border).toBe("#e6e4dc");
      expect(colors.borderStrong).toBe("#c9c6bb");
    });

    it("status pills paired with text per A11y rules", () => {
      expect(colors.pillAccent).toBe("#0f3a5f");
      expect(colors.pillInfo).toBe("#06b6d4");
      expect(colors.pillElectric).toBe("#06b6d4");
      expect(colors.pillError).toBe("#b3261e");
    });

    it("typography stack + scale + tracking unchanged from v3/v4", () => {
      expect(typography.sans).toBe("IBM Plex Sans, system-ui, sans-serif");
      expect(typography.mono).toBe("IBM Plex Mono, ui-monospace, monospace");
      expect(typography.serifItalic).toBe(
        "Newsreader, ui-serif, Georgia, serif",
      );
      expect(typography.scale.heroXl).toBe("clamp(48px, 7vw, 96px)");
      expect(typography.scale.heroLg).toBe("60px");
      expect(typography.scale.headlineLg).toBe("32px");
      expect(typography.scale.bodyLg).toBe("18px");
      expect(typography.scale.bodyMd).toBe("16px");
      expect(typography.scale.bodySm).toBe("14px");
      expect(typography.scale.monoSm).toBe("12px");
      expect(typography.scale.labelUppercase).toBe("11px");
      expect(typography.tracking.label).toBe("0.16em");
      expect(typography.tracking.fieldLabel).toBe("0.12em");
    });

    it("spacing keeps its v3.0 4px-based scale unchanged", () => {
      expect(spacing["2xs"]).toBe("2px");
      expect(spacing.xs).toBe("4px");
      expect(spacing.sm).toBe("8px");
      expect(spacing.md).toBe("12px");
      expect(spacing.lg).toBe("16px");
      expect(spacing.xl).toBe("24px");
      expect(spacing["2xl"]).toBe("32px");
      expect(spacing["3xl"]).toBe("48px");
      expect(spacing["4xl"]).toBe("64px");
      expect(spacing["5xl"]).toBe("96px");
      expect(spacing["6xl"]).toBe("128px");
    });

    it("radius keeps its v3.0 values unchanged", () => {
      expect(radius.sm).toBe("4px");
      expect(radius.md).toBe("10px");
      expect(radius.lg).toBe("14px");
      expect(radius.xl).toBe("16px");
      expect(radius["2xl"]).toBe("18px");
      expect(radius.full).toBe("999px");
    });

    it("motion eases + durations unchanged", () => {
      expect(motion.ease.premiumOut).toBe("cubic-bezier(0.16, 1, 0.3, 1)");
      expect(motion.ease.in).toBe("ease-in");
      expect(motion.ease.move).toBe("cubic-bezier(0.4, 0, 0.2, 1)");
      expect(motion.ease.linear).toBe("linear");
      expect(motion.duration.micro).toBe("80ms");
      expect(motion.duration.short).toBe("200ms");
      expect(motion.duration.medium).toBe("320ms");
      expect(motion.duration.long).toBe("540ms");
      expect(motion.duration.slow).toBe("720ms");
      expect(motion.duration.continuousMin).toBe("14000ms");
      expect(motion.duration.continuousMax).toBe("22000ms");
    });

    it("zIndex stack unchanged", () => {
      expect(zIndex.base).toBe(0);
      expect(zIndex.dropdown).toBe(10);
      expect(zIndex.sticky).toBe(20);
      expect(zIndex.overlay).toBe(30);
      expect(zIndex.modal).toBe(40);
      expect(zIndex.toast).toBe(50);
    });
  });

  describe("Phase 1 v4 additions — shadows (v5 light-theme opacity ramp)", () => {
    it("shadows use light-theme low-opacity navy tinting (was dark-theme black ramp)", () => {
      // v5 amendment: opacity ramp from 0.06→0.16 (light) vs 0.32→0.7 (dark)
      // because shadows must read as depth on cream #fafaf7 without becoming
      // dirty/muddy. Navy tint (15, 58, 95) gives subtle "cool depth" feel.
      expect(shadows.sm).toMatch(/^0 1px 2px 0 rgba\(15, 58, 95, /);
      expect(shadows.md).toMatch(/^0 4px 12px -2px rgba\(15, 58, 95, /);
      expect(shadows.lg).toMatch(/^0 12px 32px -4px rgba\(15, 58, 95, /);
      expect(shadows.xl).toMatch(/^0 24px 64px -12px rgba\(15, 58, 95, /);
      expect(shadows["2xl"]).toMatch(/^0 32px 96px -16px rgba\(15, 58, 95, /);
    });

    it("shadows are exposed via the unified tokens object", () => {
      expect(tokens.shadows).toBe(shadows);
    });
  });

  describe("Phase 1 v4 additions — surfaceElevated + accentDeep", () => {
    it("colors.surfaceElevated exists for hover/active surfaces", () => {
      expect(colors).toHaveProperty("surfaceElevated");
      expect(colors.surfaceElevated).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it("colors.accentDeep sits deeper than accent for pressed states", () => {
      expect(colors).toHaveProperty("accentDeep");
      expect(colors.accentDeep).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colors.accentDeep).not.toBe(colors.accent);
    });
  });

  describe("Phase 1 v4 additions — gradients (v5 light-theme cyan-navy mix)", () => {
    it("gradients use cyan + navy at very low opacity (light-theme ambient)", () => {
      expect(gradients.heroAtmospheric).toContain("radial-gradient");
      // v5 amendment: cyan/navy tints replace the dark-theme teal tints
      expect(gradients.heroAtmospheric).toMatch(
        /rgba\(6, 182, 212|rgba\(15, 58, 95/,
      );
      expect(gradients.accentRadial).toContain("radial-gradient");
    });
  });

  describe("Phase 1 v4 additions — spacing 7xl + 8xl", () => {
    it("spacing[7xl] = 192px (hero atmospheric breathing room)", () => {
      expect((spacing as Record<string, string>)["7xl"]).toBe("192px");
    });

    it("spacing[8xl] = 256px (max hero generosity)", () => {
      expect((spacing as Record<string, string>)["8xl"]).toBe("256px");
    });
  });

  describe("Phase 1 v4 additions — radius.pill alias", () => {
    it("radius.pill aliases radius.full at 999px (clarity for pill components)", () => {
      expect((radius as { pill?: string }).pill).toBe("999px");
      expect((radius as { pill?: string }).pill).toBe(radius.full);
    });
  });

  describe("unified tokens object exposes all categories", () => {
    it("tokens.shadows + tokens.gradients alongside existing categories", () => {
      expect(tokens).toMatchObject({
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

  describe("v3/v4 dark-theme migration (Iron Law 2.26 LOCKED_OVERRIDE artifact)", () => {
    it("colors.bg is NO LONGER the v3/v4 dark charcoal #0a0e0f", () => {
      // Post-LOCKED_OVERRIDE 2026-05-20, the v3/v4 LOCKED dark+teal palette
      // is migrated to v5 light+cyan-navy. This test asserts the regression
      // direction: a future revert without explicit LOCKED_OVERRIDE doc
      // would break this assertion and require operator review per Iron
      // Law 2.26 + 2.37.
      expect(colors.bg).not.toBe("#0a0e0f");
      expect(colors.accent).not.toBe("#3dd4c8");
    });
  });
});
