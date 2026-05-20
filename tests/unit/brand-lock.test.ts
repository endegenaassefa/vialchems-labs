import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/content/site";
import { colors } from "@/lib/design/tokens";

/**
 * v5 Phase 5 — Brand-lock regression guard (Iron Law 2.26 + 2.37).
 *
 * Source of truth: docs/DECISIONS/locked_override_2026-05-20.md
 *
 * Any change to siteConfig brand fields (name, tagline, domain, posture,
 * llcName, llcJurisdiction) OR globals.css color tokens MUST be authorized
 * by a docs/DECISIONS/locked_override_<YYYY-MM-DD>.md document AND
 * reflected here. If this test fails, either:
 *   1. The code change is unauthorized (revert and commit a LOCKED_OVERRIDE
 *      doc first), OR
 *   2. The LOCKED_OVERRIDE has been updated (sync this test to the new
 *      LOCKED values and document the operator override in the test
 *      narrative below).
 *
 * This test is the FINAL gate that catches accidental brand drift.
 */

describe("v5 LOCKED brand expression (Iron Law 2.26 + 2.37 — per LOCKED_OVERRIDE 2026-05-20)", () => {
  describe("siteConfig brand fields", () => {
    it("name is 'VialChem Labs' (proper case, capital VC + L, single space)", () => {
      // Honors operator commit 148fb0e2 "fix: correct VialChem brand
      // spelling" — overrides v5 prompt §1.3 lowercase prescription.
      expect(siteConfig.name).toBe("VialChem Labs");
    });

    it("brandStem is 'vialchemlabs' (lowercase, one word — used in slugs + env)", () => {
      expect(siteConfig.brandStem).toBe("vialchemlabs");
    });

    it("tagline is 'Counted, weighed, verified.' (v3/v4 LOCKED retained)", () => {
      // The deprecated "Research-grade peptides, shipped with the COA."
      // tagline that briefly shipped post-anchor is REMOVED in v5.0.0
      // per LOCKED_OVERRIDE.
      expect(siteConfig.tagline).toBe("Counted, weighed, verified.");
      expect(siteConfig.tagline).not.toContain("Research-grade peptides");
    });

    it("domain defaults to 'vialchemlabs.net' when BRAND_DOMAIN unset", () => {
      const expected = process.env.BRAND_DOMAIN ?? "vialchemlabs.net";
      expect(siteConfig.domain).toBe(expected);
      // No matter env override, the LOCKED canonical .com / .labs / typo
      // variants must never become the resolved value.
      expect(siteConfig.domain).not.toContain("vialchemlabs.com");
      expect(siteConfig.domain).not.toContain("vialchems.labs");
      expect(siteConfig.domain).not.toContain("vialchemslabs");
    });

    it("posture is 'A' (Clean Clinical — LIGHT variant in v5)", () => {
      expect(siteConfig.posture).toBe("A");
    });

    it("llcName carries the LLC entity identity", () => {
      const expected = process.env.NEXT_PUBLIC_LLC_NAME ?? "VialChem Labs LLC";
      expect(siteConfig.llcName).toBe(expected);
    });

    it("llcJurisdiction defaults to Wyoming", () => {
      const expected = process.env.NEXT_PUBLIC_LLC_JURISDICTION ?? "Wyoming";
      expect(siteConfig.llcJurisdiction).toBe(expected);
    });

    it("labPartner is lab-agnostic by default (v1.3 operator override retained)", () => {
      const expected =
        process.env.LAB_PARTNER_NAME ?? "an independent third-party laboratory";
      expect(siteConfig.labPartner.name).toBe(expected);
      // No specific lab partner named in public-facing default
      expect(siteConfig.labPartner.name).not.toContain("Janoshik");
    });
  });

  describe("design tokens (v5 light clinical theme — LOCKED_OVERRIDE migration)", () => {
    it("bg color is light cream #fafaf7 (post-migration from dark #0a0e0f)", () => {
      expect(colors.bg).toBe("#fafaf7");
    });

    it("primary accent is deep navy #0f3a5f (post-migration from teal #3dd4c8)", () => {
      expect(colors.accent).toBe("#0f3a5f");
    });

    it("accent glow is cyan #06b6d4 (v5 high-key brand accent)", () => {
      expect(colors.accentGlow).toBe("#06b6d4");
    });

    it("text color is near-black #0a0e14 (17:1 WCAG AAA on cream bg)", () => {
      expect(colors.text).toBe("#0a0e14");
    });
  });

  describe("LOCKED_OVERRIDE escape hatch", () => {
    it("brand fields are present + non-empty (sanity check)", () => {
      expect(siteConfig.name).toBeTruthy();
      expect(siteConfig.brandStem).toBeTruthy();
      expect(siteConfig.tagline).toBeTruthy();
      expect(siteConfig.domain).toBeTruthy();
      expect(siteConfig.url).toBeTruthy();
      expect(siteConfig.description).toBeTruthy();
    });

    it("color tokens are all string hex/rgba (no undefined drift)", () => {
      expect(typeof colors.bg).toBe("string");
      expect(typeof colors.accent).toBe("string");
      expect(typeof colors.text).toBe("string");
    });
  });
});
