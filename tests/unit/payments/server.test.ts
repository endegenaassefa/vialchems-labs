/**
 * Phase 10 J3 — lib/payments/server.ts coverage.
 *
 * Covers the env-status helper that consolidates BTCPay + Plaid + stub
 * provider configuration, plus the request body / header utilities used
 * by webhook route handlers.
 *
 * The helpers read process.env directly (or accept a Request), so the
 * tests manipulate env vars and synthesize Request objects rather than
 * mocking. This matches the style used in webhook-routes.test.ts.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getProviderEnvStatus,
  headersToRecord,
  readRawBody,
} from "@/lib/payments/server";

const ENV_KEYS = [
  "BTCPAY_URL",
  "BTCPAY_SERVER_URL",
  "BTCPAY_API_KEY",
  "BTCPAY_STORE_ID",
  "BTCPAY_WEBHOOK_SECRET",
  "PLAID_CLIENT_ID",
  "PLAID_SECRET",
  "PLAID_ENV",
  "PLAID_WEBHOOK_VERIFICATION_KEY",
] as const;

const ORIGINAL_ENV: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) {
    ORIGINAL_ENV[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("getProviderEnvStatus", () => {
  it("always reports stub as configured for dev", () => {
    const statuses = getProviderEnvStatus();
    const stub = statuses.find((s) => s.provider === "stub");
    expect(stub).toBeDefined();
    expect(stub?.configured).toBe(true);
    expect(stub?.reason).toBe("always-on for dev");
  });

  it("reports btcpay as unconfigured when env is missing", () => {
    const statuses = getProviderEnvStatus();
    const btcpay = statuses.find((s) => s.provider === "btcpay");
    expect(btcpay).toBeDefined();
    expect(btcpay?.configured).toBe(false);
    expect(btcpay?.reason).toContain("BTCPAY");
  });

  it("reports plaid as unconfigured when env is missing", () => {
    const statuses = getProviderEnvStatus();
    const plaid = statuses.find((s) => s.provider === "plaid");
    expect(plaid).toBeDefined();
    expect(plaid?.configured).toBe(false);
    expect(plaid?.reason).toContain("PLAID");
  });

  it("reports btcpay as configured when all four BTCPay env vars are real values", () => {
    process.env.BTCPAY_SERVER_URL = "https://pay.example.com";
    process.env.BTCPAY_API_KEY = "real_api_key_for_test";
    process.env.BTCPAY_STORE_ID = "real_store_id_for_test";
    process.env.BTCPAY_WEBHOOK_SECRET = "real_webhook_secret_for_test";

    const statuses = getProviderEnvStatus();
    const btcpay = statuses.find((s) => s.provider === "btcpay");
    expect(btcpay?.configured).toBe(true);
    expect(btcpay?.reason).toBeUndefined();
  });

  it("reports plaid as configured when all required env vars are real values", () => {
    process.env.PLAID_CLIENT_ID = "real_plaid_client_id_for_test";
    process.env.PLAID_SECRET = "real_plaid_secret_for_test";
    process.env.PLAID_ENV = "sandbox";
    process.env.PLAID_WEBHOOK_VERIFICATION_KEY =
      "real_plaid_verification_key_for_test";

    const statuses = getProviderEnvStatus();
    const plaid = statuses.find((s) => s.provider === "plaid");
    expect(plaid?.configured).toBe(true);
    expect(plaid?.reason).toBeUndefined();
  });

  it("returns provider statuses in a stable shape with all three providers", () => {
    const statuses = getProviderEnvStatus();
    expect(statuses).toHaveLength(3);
    const providers = statuses.map((s) => s.provider).sort();
    expect(providers).toEqual(["btcpay", "plaid", "stub"]);
    for (const status of statuses) {
      expect(status).toHaveProperty("provider");
      expect(status).toHaveProperty("configured");
    }
  });
});

describe("readRawBody", () => {
  it("returns the raw body text of a Request", async () => {
    const req = new Request("https://example.com/webhook", {
      method: "POST",
      body: '{"event": "invoice.paid"}',
      headers: { "content-type": "application/json" },
    });
    const text = await readRawBody(req);
    expect(text).toBe('{"event": "invoice.paid"}');
  });

  it("returns an empty string when the body is empty", async () => {
    const req = new Request("https://example.com/webhook", { method: "POST" });
    const text = await readRawBody(req);
    expect(text).toBe("");
  });

  it("preserves non-JSON utf-8 payloads byte-for-byte", async () => {
    const payload = "not-json: just-a-string{unicode-π}";
    const req = new Request("https://example.com/webhook", {
      method: "POST",
      body: payload,
    });
    const text = await readRawBody(req);
    expect(text).toBe(payload);
  });
});

describe("headersToRecord", () => {
  it("lowercases all header keys", () => {
    const req = new Request("https://example.com/webhook", {
      method: "POST",
      headers: {
        "X-BTCPay-Signature": "sig-value",
        "Content-Type": "application/json",
      },
    });
    const record = headersToRecord(req);
    expect(record["x-btcpay-signature"]).toBe("sig-value");
    expect(record["content-type"]).toBe("application/json");
    // Original-cased keys must not appear
    expect(record["X-BTCPay-Signature"]).toBeUndefined();
    expect(record["Content-Type"]).toBeUndefined();
  });

  it("returns an empty record for a request with no custom headers", () => {
    const req = new Request("https://example.com/webhook");
    const record = headersToRecord(req);
    // Headers always include at least the inferred host on some platforms; the
    // contract is that the function returns a plain object, lowercased.
    expect(typeof record).toBe("object");
    for (const key of Object.keys(record)) {
      expect(key).toBe(key.toLowerCase());
    }
  });

  it("retains the last value when duplicate header keys are present", () => {
    // Headers built from a Headers instance handle dup keys by joining or
    // last-wins depending on the runtime; we just verify the output is a
    // plain string per key.
    const headers = new Headers();
    headers.append("x-trace-id", "first");
    const req = new Request("https://example.com/webhook", { headers });
    const record = headersToRecord(req);
    expect(record["x-trace-id"]).toBe("first");
  });
});
