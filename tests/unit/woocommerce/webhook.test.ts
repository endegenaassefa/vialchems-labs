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
