/**
 * E3 — HMAC unsubscribe-token regression guard
 * (Section 6 super-prompt 2026-05-22).
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  signUnsubscribeToken,
  verifyUnsubscribeToken,
  getUnsubscribeSigningSecret,
} from "@/lib/email/unsubscribe-token";

describe("unsubscribe-token — sign + verify round trip", () => {
  beforeEach(() => {
    delete process.env.UNSUBSCRIBE_SIGNING_SECRET;
    delete process.env.AGE_GATE_SECRET;
  });

  afterEach(() => {
    delete process.env.UNSUBSCRIBE_SIGNING_SECRET;
    delete process.env.AGE_GATE_SECRET;
  });

  it("round-trips an email through sign + verify (dev fallback)", () => {
    const token = signUnsubscribeToken("buyer@example.com");
    const verified = verifyUnsubscribeToken(token);
    expect(verified).not.toBeNull();
    expect(verified!.email).toBe("buyer@example.com");
  });

  it("normalises email casing before signing", () => {
    const upperToken = signUnsubscribeToken("BUYER@example.com");
    const verified = verifyUnsubscribeToken(upperToken);
    expect(verified!.email).toBe("buyer@example.com");
  });

  it("rejects a token signed with a different secret", () => {
    process.env.UNSUBSCRIBE_SIGNING_SECRET = "secret-a";
    const token = signUnsubscribeToken("buyer@example.com");
    process.env.UNSUBSCRIBE_SIGNING_SECRET = "secret-b";
    expect(verifyUnsubscribeToken(token)).toBeNull();
  });

  it("rejects a tampered token", () => {
    const token = signUnsubscribeToken("buyer@example.com");
    const tampered = token.slice(0, -2) + "AA";
    expect(verifyUnsubscribeToken(tampered)).toBeNull();
  });

  it("rejects an empty token", () => {
    expect(verifyUnsubscribeToken("")).toBeNull();
  });

  it("rejects a token without a valid hex signature", () => {
    const decoded = Buffer.from("buyer@example.com.not-hex", "utf-8")
      .toString("base64")
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replaceAll("=", "");
    expect(verifyUnsubscribeToken(decoded)).toBeNull();
  });

  it("returns the dev-fallback secret when nothing is configured outside production", () => {
    expect(getUnsubscribeSigningSecret()).toBe("dev-only-unsubscribe-secret");
  });

  it("returns the configured UNSUBSCRIBE_SIGNING_SECRET first", () => {
    process.env.UNSUBSCRIBE_SIGNING_SECRET = "explicit-secret";
    expect(getUnsubscribeSigningSecret()).toBe("explicit-secret");
  });

  it("falls back to AGE_GATE_SECRET when UNSUBSCRIBE_SIGNING_SECRET is unset", () => {
    process.env.AGE_GATE_SECRET = "age-gate-secret";
    expect(getUnsubscribeSigningSecret()).toBe("age-gate-secret");
  });
});
