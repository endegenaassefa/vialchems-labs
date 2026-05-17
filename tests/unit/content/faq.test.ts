import { describe, expect, it } from "vitest";
import { faqEntries } from "@/lib/content/faq";

describe("FAQ content", () => {
  it("exposes exactly 20 entries (Appendix M)", () => {
    expect(faqEntries).toHaveLength(20);
  });

  it("every entry has non-empty question and answer", () => {
    for (const e of faqEntries) {
      expect(e.q).toMatch(/.+\?$/);
      expect(e.a.length).toBeGreaterThan(20);
    }
  });

  it("substitutes vialchem.labs for the brand placeholder", () => {
    const allCopy = faqEntries.map((e) => `${e.q} ${e.a}`).join(" ");
    expect(allCopy).toContain("vialchem.labs");
    expect(allCopy).not.toContain("vialchemlabs ");
    expect(allCopy).not.toContain("{{BRAND_NAME}}");
    expect(allCopy).not.toContain("{{LAB_PARTNER}}");
    expect(allCopy).not.toContain("{{SITE_URL}}");
    expect(allCopy).not.toContain("{{BRAND_DOMAIN}}");
  });

  it("Q5 confirms independent third-party testing (lab-agnostic per v1.3)", () => {
    // v1.3 Iron Law 2.26 operator override — no specific lab name in
    // public-facing copy. The contractual lab partner is operator-side / private.
    expect(faqEntries[4].a).toMatch(/independent third-party/i);
    expect(faqEntries[4].a).toContain("third-party");
    expect(faqEntries[4].a).not.toContain("Janoshik");
  });
});
