/**
 * Phase A Shippo client — unit tests.
 *
 * Covers:
 *   - HMAC-SHA256 webhook signature verification: known-good + tampered
 *   - Webhook payload schema parsing
 *   - shippoStatusToOrderStatus mapping
 *
 * The actual fetch() calls to Shippo are NOT tested here — they would need
 * a real API key. Integration via Playwright lands in commit 11.
 */
import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  shippoStatusToOrderStatus,
  trackingWebhookSchema,
  verifyWebhookSignature,
} from "@/lib/shipping/shippo";

describe("verifyWebhookSignature", () => {
  const secret = "test-secret-do-not-use-in-prod";
  const body = JSON.stringify({
    event: "track_updated",
    data: { tracking_number: "9400111899223334445566" },
  });
  const validSig = createHmac("sha256", secret).update(body).digest("hex");

  it("accepts the correct HMAC-SHA256 signature", () => {
    expect(verifyWebhookSignature(body, validSig, secret)).toBe(true);
  });

  it("rejects a tampered signature", () => {
    const tampered = validSig.slice(0, -2) + "ff";
    expect(verifyWebhookSignature(body, tampered, secret)).toBe(false);
  });

  it("rejects when body is tampered (signature no longer matches)", () => {
    const tamperedBody = body.replace("9400111", "9400112");
    expect(verifyWebhookSignature(tamperedBody, validSig, secret)).toBe(false);
  });

  it("rejects when secret is wrong", () => {
    expect(verifyWebhookSignature(body, validSig, "wrong-secret")).toBe(false);
  });

  it("rejects when signature header is missing", () => {
    expect(verifyWebhookSignature(body, null, secret)).toBe(false);
    expect(verifyWebhookSignature(body, undefined, secret)).toBe(false);
    expect(verifyWebhookSignature(body, "", secret)).toBe(false);
  });

  it("rejects when signatures differ in length (no leakage via timingSafeEqual)", () => {
    expect(verifyWebhookSignature(body, "abc", secret)).toBe(false);
  });
});

describe("trackingWebhookSchema", () => {
  it("parses a typical DELIVERED payload", () => {
    const payload = {
      event: "track_updated",
      data: {
        tracking_number: "9400111899223334445566",
        tracking_status: {
          status: "DELIVERED",
          status_date: "2026-05-14T12:00:00Z",
        },
        carrier: "usps",
      },
    };
    const result = trackingWebhookSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("rejects an unknown status", () => {
    const payload = {
      event: "track_updated",
      data: {
        tracking_number: "9400111899223334445566",
        tracking_status: { status: "SOMETHING_ELSE" },
      },
    };
    const result = trackingWebhookSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("accepts payloads without tracking_status (pre-shipment events)", () => {
    const payload = {
      event: "track_updated",
      data: { tracking_number: "9400111899223334445566" },
    };
    const result = trackingWebhookSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });
});

describe("shippoStatusToOrderStatus", () => {
  it("maps DELIVERED to delivered", () => {
    expect(shippoStatusToOrderStatus("DELIVERED")).toBe("delivered");
  });

  it("returns null for every other status (no state transition v1)", () => {
    for (const s of [
      "UNKNOWN",
      "PRE_TRANSIT",
      "TRANSIT",
      "RETURNED",
      "FAILURE",
    ]) {
      expect(shippoStatusToOrderStatus(s)).toBeNull();
    }
  });
});
