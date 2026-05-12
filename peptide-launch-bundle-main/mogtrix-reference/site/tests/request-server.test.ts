import { describe, expect, it } from "vitest";
import { requiredAttestations } from "@/lib/attestations";
import { buildResearchRequestPayload } from "@/lib/request";
import {
  buildResearchRequestWriteInput,
  hashIpAddress,
  validateResearchRequestSubmission
} from "@/lib/request.server";

const baseItems = [{ productId: "bpc-157-5mg", quantity: 2 }];
const baseForm = {
  contactName: "Research Lead",
  organization: "Independent Research Lab",
  email: "Lead@Example.com",
  projectSummary: "Analytical bench research and documentation.",
  attestationIds: requiredAttestations.map((item) => item.id)
};

describe("request server helpers", () => {
  it("validates a well-formed submission payload", () => {
    const payload = buildResearchRequestPayload(baseForm, baseItems, "8b9d2051-1498-4b6c-b408-628d0c829f5f");
    const result = validateResearchRequestSubmission(payload);

    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.submission?.clientRequestId).toBe(payload.clientRequestId);
  });

  it("builds server-owned consent logs and metadata", () => {
    const payload = buildResearchRequestPayload(baseForm, baseItems, "8b9d2051-1498-4b6c-b408-628d0c829f5f");
    const writeInput = buildResearchRequestWriteInput(payload, {
      source: "web-request-form",
      requestOrigin: "https://mogtrix.test/request",
      originIp: "203.0.113.44",
      userAgent: "Vitest",
      now: new Date("2026-05-01T18:00:00.000Z")
    });

    expect(writeInput.normalizedEmail).toBe("lead@example.com");
    expect(writeInput.consentLogs).toHaveLength(requiredAttestations.length);
    expect(writeInput.consentLogs[0]).toMatchObject({
      accepted: true,
      source: "web-request-form",
      acceptedAt: "2026-05-01T18:00:00.000Z"
    });
    expect(writeInput.originIpHash).toBe(hashIpAddress("203.0.113.44"));
  });

  it("rejects malformed idempotency keys", () => {
    const result = validateResearchRequestSubmission({
      ...buildResearchRequestPayload(baseForm, baseItems, "short"),
      clientRequestId: "short"
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("Request fingerprint is missing or malformed.");
  });

  it("rejects payloads that exceed the total item quantity limit", () => {
    const result = validateResearchRequestSubmission(
      buildResearchRequestPayload(baseForm, [{ productId: "bpc-157-5mg", quantity: 21 }], "8b9d2051-1498-4b6c-b408-628d0c829f5f")
    );

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("Limit research requests to 20 items per submission.");
  });
});
