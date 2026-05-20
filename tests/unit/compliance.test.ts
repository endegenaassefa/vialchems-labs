import { describe, expect, it } from "vitest";
import {
  assertMarketingCopySafe,
  findMarketingCopyViolation,
} from "@/lib/compliance";

describe("assertMarketingCopySafe", () => {
  describe("forbidden patterns (must throw)", () => {
    const cases: Array<[string, string]> = [
      [
        "outcome claim — weight loss",
        "BPC-157 supports weight loss in animals",
      ],
      ["outcome claim — fat loss", "helps with fat loss"],
      ["outcome claim — muscle growth", "increases muscle growth"],
      [
        "outcome claim — appetite suppression",
        "reduces appetite suppression effect",
      ],
      ["outcome claim — blood sugar", "regulates blood sugar levels"],
      ["therapeutic verb — treats", "treats inflammation"],
      ["therapeutic verb — cures", "cures the condition"],
      ["therapeutic verb — diagnose", "diagnoses metabolic dysfunction"],
      ["therapeutic noun — therapy", "a useful therapy for recovery"],
      ["therapeutic noun — therapeutic", "has therapeutic effects"],
      ["compared drug — Ozempic", "similar mechanism to Ozempic"],
      ["compared drug — Wegovy", "comparable to Wegovy"],
      ["compared drug — Mounjaro", "analog of Mounjaro"],
      ["compared drug — Zepbound", "similar to Zepbound"],
      ["catalog exclusion — GLP-1", "GLP-1 receptor agonist"],
      [
        "catalog exclusion — semaglutide",
        "studies on semaglutide pharmacokinetics",
      ],
      ["catalog exclusion — tirzepatide", "tirzepatide research applications"],
      ["catalog exclusion — retatrutide", "retatrutide is a triple agonist"],
      ["catalog exclusion — insulin", "insulin sensitivity research"],
      ["catalog exclusion — diabetes", "studied in diabetes models"],
      ["quality claim — clinically proven", "clinically proven for recovery"],
      ["quality claim — medical grade", "medical grade purity"],
      ["quality claim — pharmaceutical grade", "pharmaceutical grade peptide"],
      [
        "quality claim — prescription strength",
        "prescription strength formulation",
      ],
      ["false claim — FDA approved", "FDA approved for research"],
      ["false claim — FDA-approved", "FDA-approved formulation"],
      ["false claim — safe for human", "safe for human consumption"],
      ["false claim — medical advice", "consult for medical advice"],
      ["human-use intent — human use", "intended for human use"],
      [
        "human-use intent — human consumption",
        "not for human consumption is wrong context — this should still flag",
      ],
      ["human-use intent — human dosing", "human dosing protocols"],
      [
        "dosing protocol — dosing recommendation",
        "follow our dosing recommendation",
      ],
      ["dosing protocol — dose protocol", "dose protocol available"],
      ["personal pronoun — makes you", "makes you stronger"],
      ["personal pronoun — helps you", "helps you recover faster"],
      ["personal pronoun — your weight", "reduces your weight"],
      ["personal pronoun — your gains", "maximizes your gains"],
      ["personal pronoun — improves your", "improves your performance"],

      // v5 §2.29 extensions — FDA approved-drug-analog (Tesamorelin/Egrifta)
      [
        "Iron Law 2.29 — tesamorelin lowercase",
        "tesamorelin pharmacokinetics study",
      ],
      [
        "Iron Law 2.29 — tesamorelin mixed case + suffix",
        "Tesamorelin 5mg vial",
      ],
      ["Iron Law 2.29 — th9507 code", "TH9507 in animal model"],
      ["Iron Law 2.29 — egrifta brand", "egrifta brand reference"],

      // v5 §2.29 extensions — Melanocortin FDA enforcement
      ["Iron Law 2.29 — melanotan plain", "melanotan in research"],
      ["Iron Law 2.29 — melanotan-i", "melanotan-i preparations"],
      ["Iron Law 2.29 — melanotan-ii", "melanotan-ii preparations"],
      ["Iron Law 2.29 — Melanotan II", "Melanotan II reference"],
      ["Iron Law 2.29 — MT-2 uppercase", "MT-2 in study"],
      ["Iron Law 2.29 — MT-II uppercase", "MT-II in study"],
      ["Iron Law 2.29 — mt-1 lowercase", "mt-1 lyophilized"],
      ["Iron Law 2.29 — mt-i lowercase", "mt-i lyophilized"],
      ["Iron Law 2.29 — bremelanotide", "bremelanotide pharmacology"],
      ["Iron Law 2.29 — PT-141 uppercase", "PT-141 mechanism"],
      ["Iron Law 2.29 — pt-141 lowercase", "pt-141 mechanism"],
      ["Iron Law 2.29 — Vyleesi brand", "Vyleesi brand reference"],

      // v5 §2.29 extensions — RUO bypass vector (BAC water family)
      [
        "Iron Law 2.29 — bacteriostatic water",
        "bacteriostatic water 30mL vial",
      ],
      ["Iron Law 2.29 — BAC water", "BAC water 30mL vial"],
      [
        "Iron Law 2.29 — bacteriostatic-water hyphen",
        "bacteriostatic-water 30mL",
      ],
      ["Iron Law 2.29 — bac-water hyphen", "bac-water 30mL"],

      // v5 §2.29 extensions — SS-31 / elamipretide
      ["Iron Law 2.29 — SS-31 uppercase", "SS-31 mitochondrial"],
      ["Iron Law 2.29 — ss-31 lowercase", "ss-31 mitochondrial"],
      ["Iron Law 2.29 — elamipretide", "elamipretide reference"],

      // v5 §2.29 extensions — GLP-1 cousins
      ["Iron Law 2.29 — liraglutide", "liraglutide pharmacokinetics"],
      ["Iron Law 2.29 — dulaglutide", "dulaglutide pharmacokinetics"],

      // v5 §2.29 extensions — short-code GLP-1 obfuscations (catalog used
      // shortName='Reta', 'Tirz', 'Sema' before audit C5 + S1 removal).
      ["Iron Law 2.29 — Reta standalone short-code", "Reta 10mg research vial"],
      ["Iron Law 2.29 — Tirz standalone short-code", "Tirz 25mg research vial"],
      ["Iron Law 2.29 — Sema standalone short-code", "Sema 5mg research vial"],

      // v5.0 supplemental S1 — undetermined-composition blend
      ["Iron Law 2.29 — klow standalone", "klow 80mg lyophilized"],

      // Audit M1 — hyphen-fix bypass (currently the `\s*` patterns silently
      // bypass hyphenated forms; this MUST now throw).
      ["audit M1 — pharmaceutical-grade hyphen", "pharmaceutical-grade vial"],
      ["audit M1 — medical-grade hyphen", "medical-grade reference"],
      ["audit M1 — human-use hyphen", "intended for human-use applications"],
      ["audit M1 — human-dosing hyphen", "human-dosing protocols"],
      ["audit M1 — dosing-protocol hyphen", "dosing-protocol available"],
      ["audit M1 — human-consumption hyphen", "no human-consumption disclaim"],
    ];

    it.each(cases)("throws on: %s", (_label, copy) => {
      expect(() => assertMarketingCopySafe(copy)).toThrow(
        /assertMarketingCopySafe violation/,
      );
    });
  });

  describe("safe copy (must NOT throw)", () => {
    const safeCases: string[] = [
      "BPC-157 is a 15-amino-acid peptide fragment isolated from bovine gastric juice.",
      "In vitro cell-culture studies have documented activity on protective signaling.",
      "For research use only. Not for human or veterinary use.",
      "Per-batch Certificate of Analysis published at /coa.",
      "Recovery Stack: BPC-157 10mg + TB-500 5mg at $77.",
      "Animal-model research has documented effects on tissue repair kinetics.",
    ];

    it.each(safeCases.map((s, i) => [`case ${i + 1}`, s]))(
      "safe: %s",
      (_label, copy) => {
        expect(() => assertMarketingCopySafe(copy)).not.toThrow();
      },
    );
  });

  describe("safe copy — regression cases (must NOT throw; no over-blocking)", () => {
    // These names contain banned-token-like substrings, but as DIFFERENT
    // words. Regex must use word boundaries so legitimate copy passes.
    const safeRegressionCases: Array<[string, string]> = [
      [
        "BPC-157 should not match 'reta' (distinct compound, no 'reta' substring as whole word)",
        "BPC-157 lyophilized research reference",
      ],
      [
        "'retreat' should not match \\breta\\b (different word, starts with reta)",
        "research retreat held quarterly",
      ],
      [
        "'sermorelin' should not match \\bsema\\b (sermorelin contains 'serm', not 'sema' as standalone)",
        "Sermorelin research applications in animal models",
      ],
      [
        "'medical professional' should not match (only medical-grade / medical grade banned)",
        "consult a medical professional for any concerns",
      ],
      [
        "'klowinski' should not match \\bklow\\b (different word)",
        "Dr Klowinski published animal-model results",
      ],
      [
        "'tirzon' should not match \\btirz\\b (different word)",
        "Tirzon study published this quarter",
      ],
    ];

    it.each(safeRegressionCases)("safe regression: %s", (_label, copy) => {
      expect(() => assertMarketingCopySafe(copy)).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("does not throw on empty string", () => {
      expect(() => assertMarketingCopySafe("")).not.toThrow();
    });

    it("does not throw on non-string input", () => {
      expect(() =>
        assertMarketingCopySafe(undefined as unknown as string),
      ).not.toThrow();
      expect(() =>
        assertMarketingCopySafe(null as unknown as string),
      ).not.toThrow();
    });
  });
});

describe("findMarketingCopyViolation", () => {
  it("returns the matched pattern source on violation", () => {
    const violation = findMarketingCopyViolation("weight loss is bad");
    expect(violation).toMatch(/weight/);
  });

  it("returns null on safe copy", () => {
    const violation = findMarketingCopyViolation("a 15-amino-acid peptide");
    expect(violation).toBeNull();
  });

  it("returns null on empty string", () => {
    expect(findMarketingCopyViolation("")).toBeNull();
  });

  // v5 §2.29 + audit M1 — findMarketingCopyViolation must also surface
  // the extended regex set (parity with assertMarketingCopySafe).
  it("returns a violation for tesamorelin (Iron Law 2.29)", () => {
    expect(findMarketingCopyViolation("Tesamorelin 5mg")).not.toBeNull();
  });

  it("returns a violation for pharmaceutical-grade (audit M1)", () => {
    expect(
      findMarketingCopyViolation("pharmaceutical-grade vial"),
    ).not.toBeNull();
  });

  it("returns a violation for short-code 'Reta' (Iron Law 2.29 + S1)", () => {
    expect(findMarketingCopyViolation("Reta 10mg vial")).not.toBeNull();
  });

  it("returns a violation for KLOW (supplemental S1)", () => {
    expect(findMarketingCopyViolation("klow 80mg vial")).not.toBeNull();
  });
});
