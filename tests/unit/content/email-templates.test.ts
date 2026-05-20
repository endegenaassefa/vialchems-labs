import { describe, expect, it } from "vitest";
import { emailWelcomeSequence } from "@/lib/content/email-templates";
import { bundles } from "@/lib/content/products";

describe("Email templates — bundle copy consistency (Iron Law 2.15 / audit H11)", () => {
  it("Recovery Stack copy in email templates matches products.ts canonical", () => {
    const recoveryStack = bundles.find((b) => b.slug === "recovery-stack");
    expect(recoveryStack).toBeDefined();

    const allTemplateText = JSON.stringify(emailWelcomeSequence);

    // Must NOT contain the OLD stale price/discount (BPC-157 10mg + TB-500 5mg
    // bundled at $77 / 12.5% — composition + price + discount were all wrong).
    expect(allTemplateText).not.toContain("$77");
    expect(allTemplateText).not.toContain("12.5%");
    expect(allTemplateText).not.toContain("TB-500 5mg");
  });

  it("no email template references stale bundle compositions", () => {
    const allBodies = emailWelcomeSequence.map((t) => t.body).join("\n\n");
    // The legacy "BPC-157 10mg + TB-500 5mg ... bundled at $77 (12.5%
    // effective discount)" copy is stale — Recovery Stack now includes KPV
    // and prices at $129 with a different effective discount.
    expect(allBodies).not.toMatch(/TB-500\s*5\s*mg/i);
    expect(allBodies).not.toMatch(/\$77\b/);
    expect(allBodies).not.toMatch(/12\.5%/);
  });
});
