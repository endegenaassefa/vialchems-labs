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
      "Supplied as lyophilized pharmaceutical-grade research reference.",
      "Animal-model research has documented effects on tissue repair kinetics.",
    ];

    it.each(safeCases.map((s, i) => [`case ${i + 1}`, s]))(
      "safe: %s",
      (_label, copy) => {
        expect(() => assertMarketingCopySafe(copy)).not.toThrow();
      },
    );
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
});
