import { describe, expect, it } from "vitest";
import { faqEntries } from "@/lib/content/faq";

describe("FAQ — no banned compounds named (Iron Law 2.7 perpetual ban + 2.13 no claim-crossover)", () => {
  it("no FAQ answer contains a banned compound name", () => {
    const allFaqText = faqEntries
      .map((entry) => `Q: ${entry.q}\nA: ${entry.a}`)
      .join("\n\n");
    // Direct names that MUST NOT appear in customer-facing marketing copy
    // per Iron Law 2.7 (perpetual ban) and v5 supplemental S6 closure.
    const explicitlyBanned = [
      "tesamorelin",
      "Reta",
      "Tirz",
      "KLOW",
      "Melanotan",
      "PT-141",
      "Bremelanotide",
    ];
    for (const term of explicitlyBanned) {
      const regex = new RegExp(`\\b${term}\\b`, "i");
      expect(
        regex.test(allFaqText),
        `Iron Law 2.7 violation: FAQ marketing copy names "${term}".\n` +
          `Banned compounds must not appear in customer-facing copy.`,
      ).toBe(false);
    }
  });
});
