/**
 * Payment registry tests. Verifies env-based selection and the
 * { stub, btcpay, plaid } universe constraint (Iron Law 2.9).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPaymentProvider,
  getPaymentProviderById,
  getPaymentRegistry,
  resetPaymentRegistry,
  resolvePaymentProviderId,
} from "@/lib/payments/config";

describe("resolvePaymentProviderId", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns stub for undefined env", () => {
    expect(resolvePaymentProviderId(undefined)).toBe("stub");
  });

  it("returns stub for empty string", () => {
    expect(resolvePaymentProviderId("")).toBe("stub");
  });

  it("returns stub for invalid value (Iron Law 2.9 — no card rails Day-1)", () => {
    expect(resolvePaymentProviderId("stripe")).toBe("stub");
    expect(resolvePaymentProviderId("paypal")).toBe("stub");
    expect(resolvePaymentProviderId("square")).toBe("stub");
    expect(resolvePaymentProviderId("shopify")).toBe("stub");
  });

  it("returns btcpay for btcpay", () => {
    expect(resolvePaymentProviderId("btcpay")).toBe("btcpay");
  });

  it("returns plaid for plaid", () => {
    expect(resolvePaymentProviderId("plaid")).toBe("plaid");
  });

  it("fails closed when production env is missing or invalid", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => resolvePaymentProviderId(undefined)).toThrow(
      /payment_provider_required/,
    );
    expect(() => resolvePaymentProviderId("stripe")).toThrow(
      /payment_provider_required/,
    );
  });

  it("rejects the stub provider in production unless explicitly allowed", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => resolvePaymentProviderId("stub")).toThrow(
      /payment_provider_stub_forbidden/,
    );

    vi.stubEnv("ALLOW_STUB_PAYMENTS_IN_PRODUCTION", "true");
    expect(resolvePaymentProviderId("stub")).toBe("stub");
  });
});

describe("getPaymentRegistry", () => {
  beforeEach(() => resetPaymentRegistry());
  afterEach(() => resetPaymentRegistry());

  it("exposes exactly { stub, btcpay, plaid }", () => {
    const registry = getPaymentRegistry();
    expect(Object.keys(registry).sort()).toEqual(
      ["btcpay", "plaid", "stub"].sort(),
    );
  });

  it("caches across calls", () => {
    const a = getPaymentRegistry();
    const b = getPaymentRegistry();
    expect(a).toBe(b);
  });

  it("rebuilds after reset", () => {
    const a = getPaymentRegistry();
    resetPaymentRegistry();
    const b = getPaymentRegistry();
    expect(a).not.toBe(b);
  });

  it("each adapter advertises its id", () => {
    const registry = getPaymentRegistry();
    expect(registry.stub.id).toBe("stub");
    expect(registry.btcpay.id).toBe("btcpay");
    expect(registry.plaid.id).toBe("plaid");
  });
});

describe("getPaymentProvider", () => {
  const ORIGINAL = process.env.PAYMENT_PROVIDER;

  beforeEach(() => {
    resetPaymentRegistry();
  });

  afterEach(() => {
    if (ORIGINAL === undefined) {
      delete process.env.PAYMENT_PROVIDER;
    } else {
      process.env.PAYMENT_PROVIDER = ORIGINAL;
    }
    resetPaymentRegistry();
  });

  it("defaults to stub when env unset", () => {
    delete process.env.PAYMENT_PROVIDER;
    expect(getPaymentProvider().id).toBe("stub");
  });

  it("uses PAYMENT_PROVIDER env when set", () => {
    process.env.PAYMENT_PROVIDER = "btcpay";
    expect(getPaymentProvider().id).toBe("btcpay");
  });

  it("honors explicit override over env", () => {
    process.env.PAYMENT_PROVIDER = "btcpay";
    expect(getPaymentProvider("plaid").id).toBe("plaid");
  });

  it("falls back to stub on garbage env", () => {
    process.env.PAYMENT_PROVIDER = "stripe";
    expect(getPaymentProvider().id).toBe("stub");
  });
});

describe("getPaymentProviderById", () => {
  beforeEach(() => resetPaymentRegistry());

  it("returns the requested adapter", () => {
    expect(getPaymentProviderById("btcpay").id).toBe("btcpay");
    expect(getPaymentProviderById("plaid").id).toBe("plaid");
    expect(getPaymentProviderById("stub").id).toBe("stub");
  });
});
