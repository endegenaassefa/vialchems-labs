import { describe, expect, it } from "vitest";
import { isAllowedHandoffOrigin } from "@/lib/woocommerce/security";

describe("isAllowedHandoffOrigin", () => {
  it("allows the configured main site origin", () => {
    expect(
      isAllowedHandoffOrigin(
        "https://vialchemlabs.net",
        "https://vialchemlabs.net",
      ),
    ).toBe(true);
  });

  it("allows additional explicit origins", () => {
    expect(
      isAllowedHandoffOrigin(
        "https://preview.vialchemlabs.net",
        "https://vialchemlabs.net",
        "https://preview.vialchemlabs.net, https://staging.vialchemlabs.net",
      ),
    ).toBe(true);
  });

  it("rejects cross-site browser origins", () => {
    expect(
      isAllowedHandoffOrigin("https://example.com", "https://vialchemlabs.net"),
    ).toBe(false);
  });

  it("allows missing origin for non-browser server checks", () => {
    expect(isAllowedHandoffOrigin(null, "https://vialchemlabs.net")).toBe(true);
  });
});
