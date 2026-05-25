/**
 * Tests for lib/auth/account-email-token.ts — HMAC-signed tokens for
 * email confirmation + password reset.
 *
 * Spec §8 token format: base64url(payload).hmac_hex. Payload includes
 * purpose ('confirm-email' | 'password-reset' | 'email-change'),
 * userId, email, exp (epoch seconds), nonce. Secret rotation
 * supported via ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createHmac } from "node:crypto";
import {
  signAccountEmailToken,
  verifyAccountEmailToken,
  type AccountEmailTokenPayload,
} from "@/lib/auth/account-email-token";

const TEST_SECRET = "test-secret-for-account-email-token-1234567890";
const PREV_SECRET = "previous-rotation-secret-9876543210";

const basePayload: Pick<AccountEmailTokenPayload, "purpose" | "userId" | "email"> = {
  purpose: "confirm-email",
  userId: "11111111-2222-3333-4444-555555555555",
  email: "researcher@example.com",
};

describe("signAccountEmailToken", () => {
  beforeEach(() => {
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET = TEST_SECRET;
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS;
  });
  afterEach(() => {
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET;
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS;
  });

  it("returns a non-empty string with the payload.signature dotted form", () => {
    const token = signAccountEmailToken(basePayload, { ttlSeconds: 3600 });
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);
    expect(token.split(".").length).toBe(2);
  });

  it("throws when the secret is empty", () => {
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET;
    expect(() => signAccountEmailToken(basePayload, { ttlSeconds: 3600 })).toThrow(
      /account_email_token_secret_required/i,
    );
  });

  it("produces a different token for different purposes (cross-purpose replay protection)", () => {
    const a = signAccountEmailToken({ ...basePayload, purpose: "confirm-email" }, { ttlSeconds: 3600 });
    const b = signAccountEmailToken({ ...basePayload, purpose: "password-reset" }, { ttlSeconds: 3600 });
    expect(a).not.toBe(b);
  });

  it("produces a different token each call (nonce randomises payload)", () => {
    const a = signAccountEmailToken(basePayload, { ttlSeconds: 3600 });
    const b = signAccountEmailToken(basePayload, { ttlSeconds: 3600 });
    expect(a).not.toBe(b);
  });
});

describe("verifyAccountEmailToken", () => {
  beforeEach(() => {
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET = TEST_SECRET;
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS;
  });
  afterEach(() => {
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET;
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS;
  });

  it("round-trips a valid token", () => {
    const token = signAccountEmailToken(basePayload, { ttlSeconds: 3600 });
    const result = verifyAccountEmailToken(token, "confirm-email");
    expect(result).not.toBeNull();
    expect(result?.email).toBe("researcher@example.com");
    expect(result?.userId).toBe(basePayload.userId);
    expect(result?.purpose).toBe("confirm-email");
  });

  it("returns null for the empty string", () => {
    expect(verifyAccountEmailToken("", "confirm-email")).toBeNull();
  });

  it("returns null for malformed (no dot)", () => {
    expect(verifyAccountEmailToken("not-a-token", "confirm-email")).toBeNull();
  });

  it("returns null when the signature is tampered with", () => {
    const token = signAccountEmailToken(basePayload, { ttlSeconds: 3600 });
    const [payload] = token.split(".");
    const tampered = `${payload}.0000000000000000000000000000000000000000000000000000000000000000`;
    expect(verifyAccountEmailToken(tampered, "confirm-email")).toBeNull();
  });

  it("returns null when the payload is tampered with (signature mismatch)", () => {
    const token = signAccountEmailToken(basePayload, { ttlSeconds: 3600 });
    const [, sig] = token.split(".");
    // Swap to a different payload but keep the original sig.
    const otherPayload = signAccountEmailToken(
      { ...basePayload, userId: "00000000-0000-0000-0000-000000000000" },
      { ttlSeconds: 3600 },
    ).split(".")[0];
    const tampered = `${otherPayload}.${sig}`;
    expect(verifyAccountEmailToken(tampered, "confirm-email")).toBeNull();
  });

  it("returns null when the token has expired", () => {
    const t0 = 1_700_000_000;
    const token = signAccountEmailToken(basePayload, {
      ttlSeconds: 60,
      nowSeconds: t0,
    });
    // Advance clock past expiry.
    expect(
      verifyAccountEmailToken(token, "confirm-email", { nowSeconds: t0 + 61 }),
    ).toBeNull();
  });

  it("clamps ttlSeconds to the per-purpose MAX_TTL_SECONDS cap on issuance (codex HIGH)", () => {
    const t0 = 1_700_000_000;
    // Try to mint a 30-day password-reset (caller-supplied huge ttl);
    // the sign function must clamp to MAX_TTL_SECONDS['password-reset']
    // (3600s) so the token expires within the policy bound.
    const token = signAccountEmailToken(
      { purpose: "password-reset", userId: basePayload.userId, email: basePayload.email },
      { ttlSeconds: 30 * 24 * 60 * 60, nowSeconds: t0 },
    );
    // Verifies at t0 + 3000s (under cap).
    expect(
      verifyAccountEmailToken(token, "password-reset", { nowSeconds: t0 + 3000 }),
    ).not.toBeNull();
    // Does NOT verify at t0 + 3700s (past clamped exp).
    expect(
      verifyAccountEmailToken(token, "password-reset", { nowSeconds: t0 + 3700 }),
    ).toBeNull();
  });

  it("rejects a forged token whose exp - iat exceeds MAX_TTL_SECONDS even if signature is valid (rotation-leak defense)", () => {
    // Simulate an attacker who has the secret and tries to mint a token
    // valid for 30 days for password-reset. We bypass signAccountEmailToken
    // and craft the payload directly.
    const iat = 1_700_000_000;
    const exp = iat + 30 * 24 * 60 * 60; // 30 days
    const forged = {
      purpose: "password-reset",
      userId: basePayload.userId,
      email: basePayload.email.toLowerCase(),
      iat,
      exp,
      nonce: "deadbeefdeadbeef",
    };
    const encoded = Buffer.from(JSON.stringify(forged), "utf-8")
      .toString("base64")
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replaceAll("=", "");
    const sig = createHmac("sha256", TEST_SECRET).update(encoded).digest("hex");
    const token = `${encoded}.${sig}`;
    expect(
      verifyAccountEmailToken(token, "password-reset", { nowSeconds: iat + 100 }),
    ).toBeNull();
  });

  it("rejects a token whose iat is in the future (clock-skew slack is 5 minutes)", () => {
    const t0 = 1_700_000_000;
    const token = signAccountEmailToken(basePayload, {
      ttlSeconds: 600,
      nowSeconds: t0,
    });
    // Verifier clock is 10 minutes earlier — iat is 10m in the future.
    expect(
      verifyAccountEmailToken(token, "confirm-email", { nowSeconds: t0 - 10 * 60 }),
    ).toBeNull();
    // Within slack: iat is 4 minutes in the future. Accepted.
    expect(
      verifyAccountEmailToken(token, "confirm-email", { nowSeconds: t0 - 4 * 60 }),
    ).not.toBeNull();
  });

  it("returns null when the purpose does not match (cross-purpose replay)", () => {
    const resetToken = signAccountEmailToken(
      { ...basePayload, purpose: "password-reset" },
      { ttlSeconds: 3600 },
    );
    // A password-reset token must NOT verify as a confirm-email token.
    expect(verifyAccountEmailToken(resetToken, "confirm-email")).toBeNull();
    expect(verifyAccountEmailToken(resetToken, "password-reset")).not.toBeNull();
  });

  it("returns null for the email-change purpose mismatch", () => {
    const change = signAccountEmailToken(
      {
        purpose: "email-change",
        userId: basePayload.userId,
        email: "new@example.com",
      },
      { ttlSeconds: 3600 },
    );
    expect(verifyAccountEmailToken(change, "confirm-email")).toBeNull();
    expect(verifyAccountEmailToken(change, "email-change")).not.toBeNull();
  });

  it("returns null when the secret is missing", () => {
    const token = signAccountEmailToken(basePayload, { ttlSeconds: 3600 });
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET;
    expect(verifyAccountEmailToken(token, "confirm-email")).toBeNull();
  });

  it("returns null for a token signed by an unknown secret (no rotation entry)", () => {
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET = "different-secret-not-rotated";
    const token = signAccountEmailToken(basePayload, { ttlSeconds: 3600 });
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET = TEST_SECRET;
    expect(verifyAccountEmailToken(token, "confirm-email")).toBeNull();
  });

  it("accepts a token signed under the PREVIOUS secret during rotation overlap", () => {
    // 1. Sign under old secret.
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET = PREV_SECRET;
    const token = signAccountEmailToken(basePayload, { ttlSeconds: 3600 });
    // 2. Operator rotates: new secret becomes primary, old becomes _PREVIOUS.
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET = TEST_SECRET;
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS = PREV_SECRET;
    // 3. Old token still verifies.
    expect(verifyAccountEmailToken(token, "confirm-email")).not.toBeNull();
  });

  it("rejects oversized tokens (> 2048 chars)", () => {
    const huge = "a".repeat(2049) + "." + "b".repeat(64);
    expect(verifyAccountEmailToken(huge, "confirm-email")).toBeNull();
  });

  it("rejects a signature that is not hex (no timing-attack panic)", () => {
    const token = signAccountEmailToken(basePayload, { ttlSeconds: 3600 });
    const [payload] = token.split(".");
    const bad = `${payload}.not-hex!!!`;
    expect(verifyAccountEmailToken(bad, "confirm-email")).toBeNull();
  });
});
