import { describe, expect, it } from "vitest";

import { lookupBatch, sampleBatches } from "@/lib/content/verification";

describe("verification lookup", () => {
  it("returns an empty state without a query", () => {
    expect(lookupBatch("  ")).toMatchObject({ state: "empty" });
  });

  it("finds a known batch with trimmed lowercase input", () => {
    const result = lookupBatch(" mgx-bpc-2604 ");

    expect(result.state).toBe("found");
    if (result.state === "found") {
      expect(result.batch.batchId).toBe("MGX-BPC-2604");
      expect(result.batch.productSlug).toBe("bpc-157-5mg");
      expect(result.batch.testingLab).toBeTruthy();
    }
  });

  it("returns a missing state for unknown batch codes", () => {
    expect(lookupBatch("MGX-NOPE-0000")).toMatchObject({ state: "missing" });
  });

  it("exposes library-ready batch cards with a clear document state", () => {
    for (const batch of sampleBatches) {
      expect(batch.documentSet.length).toBeGreaterThan(0);
      expect(batch.productSlug).toBeTruthy();
      expect(batch.documentStatus).toBeTruthy();
    }
  });
});
