import { describe, expect, it } from "vitest";
import { requiredAttestations } from "@/lib/attestations";
import { REQUEST_LIMITS, buildResearchRequestPayload, validateResearchRequest } from "@/lib/request";

const baseItems = [{ productId: "bpc-157-5mg", quantity: 2 }];
const baseForm = {
  contactName: "Research Lead",
  organization: "Independent Research Lab",
  email: "lead@example.com",
  projectSummary: "Analytical bench research and documentation.",
  attestationIds: requiredAttestations.map((item) => item.id)
};

describe("research request validation", () => {
  it("requires every attestation before submit", () => {
    const result = validateResearchRequest({ ...baseForm, attestationIds: requiredAttestations.slice(0, -1).map((item) => item.id) }, baseItems);
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("All required attestations must be accepted.");
  });

  it("requires cart items and qualified contact fields", () => {
    const result = validateResearchRequest({ ...baseForm, email: "bad" }, []);
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("Add at least one research item before submitting.");
    expect(result.errors).toContain("Enter a valid email address.");
  });

  it("rejects requests over the summary and item quantity limits", () => {
    const result = validateResearchRequest({
      ...baseForm,
      projectSummary: "x".repeat(REQUEST_LIMITS.maxProjectSummaryLength + 1)
    }, [{ productId: "bpc-157-5mg", quantity: REQUEST_LIMITS.maxItems + 1 }]);

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(`Keep the research summary under ${REQUEST_LIMITS.maxProjectSummaryLength} characters.`);
    expect(result.errors).toContain(`Limit research requests to ${REQUEST_LIMITS.maxItems} items per submission.`);
  });

  it("builds an auditable payload with consent snapshots", () => {
    const payload = buildResearchRequestPayload(baseForm, baseItems, "8b9d2051-1498-4b6c-b408-628d0c829f5f");
    expect(payload.clientRequestId).toBe("8b9d2051-1498-4b6c-b408-628d0c829f5f");
    expect(payload.email).toBe("lead@example.com");
    expect(payload.items).toEqual(baseItems);
    expect(payload.attestationIds).toHaveLength(requiredAttestations.length);
  });
});
