/**
 * Auth-flow redesign — order-token sign+verify regression guard.
 *
 * Covers: roundtrip, expiry, tampering, missing-secret-at-import,
 * cross-secret rejection, secret rotation (current + previous overlap).
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

const ENV_KEYS = [
  "ORDER_TOKEN_SECRET",
  "ORDER_TOKEN_SECRET_PREVIOUS",
] as const;

function clearEnv() {
  for (const k of ENV_KEYS) delete process.env[k];
  vi.resetModules();
}

async function importToken() {
  return import("@/lib/auth/order-token");
}

describe("order-token — sign + verify", () => {
  beforeEach(() => {
    clearEnv();
    process.env.ORDER_TOKEN_SECRET = "test-secret-current";
  });

  afterEach(() => clearEnv());

  it("round-trips an {order_id, email} payload", async () => {
    const { signOrderToken, verifyOrderToken } = await importToken();
    const token = signOrderToken({
      orderId: "VC-12345",
      email: "buyer@example.com",
    });
    const verified = verifyOrderToken(token);
    expect(verified).not.toBeNull();
    expect(verified!.orderId).toBe("VC-12345");
    expect(verified!.email).toBe("buyer@example.com");
  });

  it("normalises email to lowercase", async () => {
    const { signOrderToken, verifyOrderToken } = await importToken();
    const token = signOrderToken({
      orderId: "VC-1",
      email: "BUYER@Example.com",
    });
    expect(verifyOrderToken(token)!.email).toBe("buyer@example.com");
  });

  it("rejects an expired token", async () => {
    const { signOrderToken, verifyOrderToken } = await importToken();
    const token = signOrderToken({
      orderId: "VC-1",
      email: "buyer@example.com",
      ttlSeconds: -1,
    });
    expect(verifyOrderToken(token)).toBeNull();
  });

  it("rejects a tampered token", async () => {
    const { signOrderToken, verifyOrderToken } = await importToken();
    const token = signOrderToken({
      orderId: "VC-1",
      email: "buyer@example.com",
    });
    const tampered = token.slice(0, -2) + (token.endsWith("AA") ? "BB" : "AA");
    expect(verifyOrderToken(tampered)).toBeNull();
  });

  it("rejects empty / malformed input", async () => {
    const { verifyOrderToken } = await importToken();
    expect(verifyOrderToken("")).toBeNull();
    expect(verifyOrderToken("not-a-token")).toBeNull();
    expect(verifyOrderToken("a.b")).toBeNull();
  });

  it("rejects a token signed by a different secret", async () => {
    const { signOrderToken } = await importToken();
    const token = signOrderToken({
      orderId: "VC-1",
      email: "buyer@example.com",
    });
    clearEnv();
    process.env.ORDER_TOKEN_SECRET = "totally-different-secret";
    const { verifyOrderToken: verifyOther } = await importToken();
    expect(verifyOther(token)).toBeNull();
  });
});

describe("order-token — secret rotation", () => {
  beforeEach(() => clearEnv());
  afterEach(() => clearEnv());

  it("verifies tokens signed by ORDER_TOKEN_SECRET_PREVIOUS", async () => {
    process.env.ORDER_TOKEN_SECRET = "old-secret";
    const { signOrderToken } = await importToken();
    const oldToken = signOrderToken({
      orderId: "VC-99",
      email: "buyer@example.com",
    });

    clearEnv();
    process.env.ORDER_TOKEN_SECRET = "new-secret";
    process.env.ORDER_TOKEN_SECRET_PREVIOUS = "old-secret";
    const { verifyOrderToken } = await importToken();
    const verified = verifyOrderToken(oldToken);
    expect(verified).not.toBeNull();
    expect(verified!.orderId).toBe("VC-99");
  });

  it("signs with current secret, never with previous", async () => {
    process.env.ORDER_TOKEN_SECRET = "new-secret";
    process.env.ORDER_TOKEN_SECRET_PREVIOUS = "old-secret";
    const { signOrderToken } = await importToken();
    const token = signOrderToken({
      orderId: "VC-1",
      email: "buyer@example.com",
    });

    // A verifier that only knows the OLD secret must reject.
    clearEnv();
    process.env.ORDER_TOKEN_SECRET = "old-secret";
    const { verifyOrderToken } = await importToken();
    expect(verifyOrderToken(token)).toBeNull();
  });

  it("rejects tokens once the PREVIOUS secret is removed", async () => {
    process.env.ORDER_TOKEN_SECRET = "old-secret";
    const { signOrderToken } = await importToken();
    const oldToken = signOrderToken({
      orderId: "VC-1",
      email: "buyer@example.com",
    });

    clearEnv();
    process.env.ORDER_TOKEN_SECRET = "new-secret";
    // No PREVIOUS this time -- old links should now fail.
    const { verifyOrderToken } = await importToken();
    expect(verifyOrderToken(oldToken)).toBeNull();
  });
});

describe("order-token — missing secret guard", () => {
  beforeEach(() => clearEnv());
  afterEach(() => clearEnv());

  it("throws at sign() when ORDER_TOKEN_SECRET is unset", async () => {
    const { signOrderToken } = await importToken();
    expect(() =>
      signOrderToken({ orderId: "VC-1", email: "buyer@example.com" }),
    ).toThrow(/order_token_secret_required/i);
  });

  it("verify() returns null (not throws) when no secret is configured", async () => {
    const { verifyOrderToken } = await importToken();
    expect(verifyOrderToken("any-token-value")).toBeNull();
  });

  it("REJECTS verify when only PREVIOUS is set (foot-gun guard)", async () => {
    // First sign a token with what will become 'previous'.
    process.env.ORDER_TOKEN_SECRET = "the-old-secret";
    const { signOrderToken } = await importToken();
    const oldToken = signOrderToken({
      orderId: "VC-1",
      email: "buyer@example.com",
    });

    // Operator misconfigures: moves the value to PREVIOUS but forgets
    // to set a new CURRENT. Verify must refuse — otherwise the system
    // silently keeps trusting a "rotated out" secret.
    clearEnv();
    process.env.ORDER_TOKEN_SECRET_PREVIOUS = "the-old-secret";
    const { verifyOrderToken } = await importToken();
    expect(verifyOrderToken(oldToken)).toBeNull();
  });
});

describe("order-token — max-TTL guard", () => {
  beforeEach(() => {
    clearEnv();
    process.env.ORDER_TOKEN_SECRET = "test-secret";
  });
  afterEach(() => clearEnv());

  it("rejects a token with exp more than 91 days in the future", async () => {
    const { signOrderToken, verifyOrderToken } = await importToken();
    // Sign with TTL of ~2 years; verifier should reject it as exceeding
    // the bound, even though signature is valid.
    const twoYears = 60 * 60 * 24 * 730;
    const token = signOrderToken({
      orderId: "VC-1",
      email: "buyer@example.com",
      ttlSeconds: twoYears,
    });
    expect(verifyOrderToken(token)).toBeNull();
  });

  it("accepts a token with default (90-day) TTL", async () => {
    const { signOrderToken, verifyOrderToken } = await importToken();
    const token = signOrderToken({
      orderId: "VC-1",
      email: "buyer@example.com",
    });
    expect(verifyOrderToken(token)).not.toBeNull();
  });
});
