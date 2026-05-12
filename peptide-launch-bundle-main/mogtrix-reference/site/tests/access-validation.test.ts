import { describe, expect, it } from "vitest";

import { parseAccessRequest } from "@/lib/validation/access";

const validRequest = {
  fullName: "  Ada Lovelace  ",
  email: "ada@example.test",
  company: "Analytical Group",
  industry: "Analytical / Scientific Research",
  roleTitle: "Research Scientist",
  credentials: "Credential details for a qualified internal reviewer.",
  researchEnvironment:
    "Controlled research environment with documented handling procedures.",
  intendedUseSummary:
    "Documentation review and controlled catalog access assessment.",
  legalName: "Ada Lovelace",
  attestations: {
    age: true,
    qualified: true,
    ruoBoundary: true,
    noPersonalUse: true,
    legalReview: true
  }
};

describe("access request validation", () => {
  it("accepts a complete request and trims strings", () => {
    const parsed = parseAccessRequest(validRequest);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.fullName).toBe("Ada Lovelace");
    }
  });

  it("rejects missing legal acknowledgements", () => {
    const parsed = parseAccessRequest({
      ...validRequest,
      attestations: { ...validRequest.attestations, noPersonalUse: false }
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects invalid email addresses", () => {
    const parsed = parseAccessRequest({
      ...validRequest,
      email: "not-an-email"
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects vague environment descriptions", () => {
    const parsed = parseAccessRequest({
      ...validRequest,
      researchEnvironment: "lab"
    });

    expect(parsed.success).toBe(false);
  });
});
