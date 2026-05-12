import { describe, expect, it } from "vitest";

import { parseCatalogItem } from "@/lib/validation/catalog";

const validCatalogItem = {
  documentationStatus: "coa-ready",
  availabilityStatus: "requestable",
  checkoutEnabled: true,
  visibleToApproved: true
};

describe("catalog metadata validation", () => {
  it("accepts valid metadata payloads", () => {
    const parsed = parseCatalogItem(validCatalogItem);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(validCatalogItem);
    }
  });

  it("rejects unknown documentation status values", () => {
    const parsed = parseCatalogItem({
      ...validCatalogItem,
      documentationStatus: "released"
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects unknown availability status values", () => {
    const parsed = parseCatalogItem({
      ...validCatalogItem,
      availabilityStatus: "public"
    });

    expect(parsed.success).toBe(false);
  });

  it("requires a boolean visibility flag", () => {
    const parsed = parseCatalogItem({
      ...validCatalogItem,
      visibleToApproved: "yes"
    });

    expect(parsed.success).toBe(false);
  });
});
