/**
 * v5 Phase 1 — siteConfig invariants regression lock.
 *
 * Asserts that lib/content/site.ts ships values consistent with
 * docs/DECISIONS/locked_override_2026-05-20.md. This is the canonical
 * site-config test; brand-lock (full LOCKED_OVERRIDE field-by-field check)
 * lives at tests/unit/brand-lock.test.ts after Phase 5.
 */
import { describe, it, expect } from "vitest";
import { siteConfig } from "@/lib/content/site";

describe("siteConfig invariants", () => {
  it("brand stem is the lowercase one-word form used in slugs + env vars", () => {
    expect(siteConfig.brandStem).toBe("vialchemlabs");
  });

  it("domain is the v5 LOCKED canonical (vialchemlabs.net) by default", () => {
    // The default applies when BRAND_DOMAIN env is not set; in test env we
    // expect the .env.example default to apply.
    const expected = process.env.BRAND_DOMAIN ?? "vialchemlabs.net";
    expect(siteConfig.domain).toBe(expected);
  });

  it("site URL is the canonical absolute URL", () => {
    const expectedDomain = process.env.BRAND_DOMAIN ?? "vialchemlabs.net";
    const expectedUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.SITE_URL ??
      `https://${expectedDomain}`;
    expect(siteConfig.url).toBe(expectedUrl);
  });

  it("posture is 'A' (clinical-minimal LIGHT in v5)", () => {
    expect(siteConfig.posture).toBe("A");
  });

  it("llcName carries a non-empty default", () => {
    expect(siteConfig.llcName).toBeTruthy();
    expect(typeof siteConfig.llcName).toBe("string");
  });

  it("llcJurisdiction is 'Wyoming' by default", () => {
    const expected = process.env.NEXT_PUBLIC_LLC_JURISDICTION ?? "Wyoming";
    expect(siteConfig.llcJurisdiction).toBe(expected);
  });

  it("labPartner is lab-agnostic by default (per v1.3 operator override)", () => {
    const expected =
      process.env.LAB_PARTNER_NAME ?? "an independent third-party laboratory";
    expect(siteConfig.labPartner.name).toBe(expected);
  });

  it("labPartner.portalUrl is null by default (no named partner URL)", () => {
    const expected = process.env.LAB_PARTNER_PORTAL_URL ?? null;
    expect(siteConfig.labPartner.portalUrl).toBe(expected);
  });

  it("brand name is a non-empty string (full LOCKED_OVERRIDE field check in brand-lock.test.ts)", () => {
    expect(siteConfig.name).toBeTruthy();
    expect(typeof siteConfig.name).toBe("string");
    expect(siteConfig.name.length).toBeGreaterThan(0);
  });

  it("tagline is a non-empty string ending with a period", () => {
    expect(siteConfig.tagline).toBeTruthy();
    expect(siteConfig.tagline).toMatch(/\.$/);
  });

  it("shipping config exposes numeric constants", () => {
    expect(typeof siteConfig.shipping.pilotUSCents).toBe("number");
    expect(siteConfig.shipping.pilotUSCents).toBeGreaterThan(0);
    expect(typeof siteConfig.shipping.freeShippingThresholdCents).toBe(
      "number",
    );
    expect(siteConfig.shipping.freeShippingThresholdCents).toBeGreaterThan(0);
  });

  it("email.from defaults reference the canonical domain", () => {
    const expectedDomain = process.env.BRAND_DOMAIN ?? "vialchemlabs.net";
    const expectedFrom =
      process.env.ORDER_EMAIL_FROM ?? `research@${expectedDomain}`;
    expect(siteConfig.email.from).toBe(expectedFrom);
  });

  it("email.staff is a non-empty array of strings", () => {
    expect(Array.isArray(siteConfig.email.staff)).toBe(true);
    expect(siteConfig.email.staff.length).toBeGreaterThan(0);
    siteConfig.email.staff.forEach((addr) => {
      expect(typeof addr).toBe("string");
      expect(addr.length).toBeGreaterThan(0);
    });
  });
});
