import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  parseWooOrderWebhook,
  verifyWooWebhookSignature,
} from "@/lib/woocommerce/webhook";

describe("WooCommerce webhook signature verification", () => {
  it("accepts WooCommerce base64 HMAC-SHA256 signatures", () => {
    const body = JSON.stringify({ id: 727, status: "processing" });
    const secret = "whsec_test";
    const signature = createHmac("sha256", secret)
      .update(body)
      .digest("base64");

    expect(verifyWooWebhookSignature(body, signature, secret)).toBe(true);
  });

  it("rejects mismatched signatures and missing secrets", () => {
    const body = JSON.stringify({ id: 727, status: "processing" });
    const secret = "whsec_test";
    const signature = createHmac("sha256", secret)
      .update(body)
      .digest("base64");

    expect(verifyWooWebhookSignature(`${body}\n`, signature, secret)).toBe(
      false,
    );
    expect(verifyWooWebhookSignature(body, signature, "")).toBe(false);
    expect(verifyWooWebhookSignature(body, "", secret)).toBe(false);
  });
});

describe("parseWooOrderWebhook", () => {
  it("extracts the minimal order status update", () => {
    expect(
      parseWooOrderWebhook(
        JSON.stringify({
          id: 727,
          status: "processing",
          order_key: "wc_order_58d2d042d1d",
        }),
      ),
    ).toEqual({
      id: 727,
      status: "processing",
      orderKey: "wc_order_58d2d042d1d",
      shippingAddress: null,
    });
  });

  it("extracts shipping address (Phase 3.3 Layer 3 guard)", () => {
    expect(
      parseWooOrderWebhook(
        JSON.stringify({
          id: 728,
          status: "processing",
          shipping: { country: "US", state: "WA" },
        }),
      ),
    ).toMatchObject({
      id: 728,
      shippingAddress: { countryCode: "US", stateCode: "WA" },
    });
  });

  it("falls back to billing address when shipping is missing (Phase 3.3)", () => {
    expect(
      parseWooOrderWebhook(
        JSON.stringify({
          id: 729,
          status: "processing",
          billing: { country: "US", state: "TX" },
        }),
      ),
    ).toMatchObject({
      shippingAddress: { countryCode: "US", stateCode: "TX" },
    });
  });

  it("returns null for invalid order payloads", () => {
    expect(parseWooOrderWebhook("{")).toBeNull();
    expect(
      parseWooOrderWebhook(JSON.stringify({ status: "processing" })),
    ).toBeNull();
    expect(parseWooOrderWebhook(JSON.stringify({ id: 727 }))).toBeNull();
  });
});
