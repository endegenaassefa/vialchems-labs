import { describe, expect, it } from "vitest";
import {
  ATTESTATIONS,
  QualificationRoles,
  validateQualification,
} from "@/lib/customer-qualification";

describe("customer qualification", () => {
  describe("ATTESTATIONS", () => {
    it("has exactly 7 verbatim attestations from Appendix A.5", () => {
      expect(ATTESTATIONS).toHaveLength(7);
    });

    it("includes 21+ age affirmation", () => {
      expect(ATTESTATIONS.some((a) => a.includes("21+"))).toBe(true);
    });

    it("includes RUO research-only framing", () => {
      expect(
        ATTESTATIONS.some((a) => a.includes("in-vitro laboratory research")),
      ).toBe(true);
    });

    it("includes no-resale clause", () => {
      expect(ATTESTATIONS.some((a) => a.includes("not resell"))).toBe(true);
    });
  });

  describe("QualificationRoles", () => {
    it("includes 6 institutional roles", () => {
      expect(QualificationRoles).toHaveLength(6);
      expect(QualificationRoles).toContain("academic-researcher");
      expect(QualificationRoles).toContain("clinical-research");
      expect(QualificationRoles).toContain("biotech-researcher");
      expect(QualificationRoles).toContain("lab-technician");
      expect(QualificationRoles).toContain("compounding-pharmacy");
      expect(QualificationRoles).toContain("other");
    });
  });

  describe("validateQualification", () => {
    const validInput = {
      email: "researcher@example.edu",
      role: "academic-researcher",
      researchPurpose:
        "In-vitro studies on fibroblast migration in cell-culture wound-closure assays.",
      ageAcknowledgment: true,
      ruoAcknowledgment: true,
      jurisdictionAcknowledgment: true,
      attestationsAcknowledged: true,
    };

    it("accepts valid input", () => {
      const result = validateQualification(validInput);
      expect(result.ok).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = validateQualification({
        ...validInput,
        email: "not-an-email",
      });
      expect(result.ok).toBe(false);
    });

    it("rejects missing age acknowledgment", () => {
      const result = validateQualification({
        ...validInput,
        ageAcknowledgment: false,
      });
      expect(result.ok).toBe(false);
    });

    it("rejects missing RUO acknowledgment", () => {
      const result = validateQualification({
        ...validInput,
        ruoAcknowledgment: false,
      });
      expect(result.ok).toBe(false);
    });

    it("rejects missing jurisdiction acknowledgment", () => {
      const result = validateQualification({
        ...validInput,
        jurisdictionAcknowledgment: false,
      });
      expect(result.ok).toBe(false);
    });

    it("rejects research purpose with forbidden marketing pattern", () => {
      const result = validateQualification({
        ...validInput,
        researchPurpose:
          "Studying weight loss applications for clients in our clinic.",
      });
      expect(result.ok).toBe(false);
    });

    it("rejects research purpose under 20 characters", () => {
      const result = validateQualification({
        ...validInput,
        researchPurpose: "too short",
      });
      expect(result.ok).toBe(false);
    });

    it("rejects unknown role", () => {
      const result = validateQualification({
        ...validInput,
        role: "rogue-role",
      });
      expect(result.ok).toBe(false);
    });
  });
});
