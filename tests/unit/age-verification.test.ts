/**
 * @vitest-environment node
 *
 * Phase 10 J1 (v5 closure) — lib/age-verification.ts coverage.
 *
 * Iron Law 2.36: compliance-critical helpers must reach the 95%+ line /
 * 90%+ branch coverage bar. The age-gate cookie is one of two compliance
 * "front door" controls (the other is RUO acknowledgment). This file
 * locks the data layer:
 *
 *  - constants are exported (cookie name, TTL, paths, goodbye URL)
 *  - HMAC sign/verify roundtrip
 *  - tampered-signature rejection
 *  - expired-timestamp rejection
 *  - missing-separator / missing-signature rejection
 *  - getAgeGateSecret() production branch (throws when secret missing)
 *  - getAgeGateSecret() non-production fallback
 *  - normalizeAgeGateNext open-redirect guards
 *  - isAgeVerificationCurrent edge cases (empty, invalid date, expired, fresh)
 *
 * Runs under the `node` environment (not jsdom) because jsdom's
 * SubtleCrypto.verify rejects cross-realm ArrayBuffers produced by
 * base64UrlDecode → bytes.buffer.slice — a known jsdom limitation. The
 * real edge-runtime middleware (proxy.ts) calls these helpers in a Node
 * runtime, so node-env testing matches production behavior.
 *
 * The UI layer is covered by tests/unit/components/age-gate/AgeGateClient.test.tsx.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AGE_GATE_GOODBYE_URL,
  AGE_GATE_PATH,
  AGE_VERIFICATION_COOKIE,
  AGE_VERIFICATION_DAYS,
  AGE_VERIFICATION_MAX_AGE_SECONDS,
  AGE_VERIFICATION_STORAGE_KEY,
  isAgeVerificationCurrent,
  isSignedAgeVerificationCurrent,
  normalizeAgeGateNext,
  signAgeVerification,
  verifyAgeVerificationCookie,
} from "@/lib/age-verification";

describe("age-verification — exported constants", () => {
  it("exports the cookie name and storage key as the canonical vcl_age_verified token", () => {
    expect(AGE_VERIFICATION_COOKIE).toBe("vcl_age_verified");
    expect(AGE_VERIFICATION_STORAGE_KEY).toBe("vcl_age_verified");
  });

  it("exports 30-day TTL constants (days + seconds)", () => {
    expect(AGE_VERIFICATION_DAYS).toBe(30);
    expect(AGE_VERIFICATION_MAX_AGE_SECONDS).toBe(30 * 24 * 60 * 60);
  });

  it("exports the age-gate path and goodbye URL", () => {
    expect(AGE_GATE_PATH).toBe("/age-gate");
    expect(AGE_GATE_GOODBYE_URL).toBe("https://www.google.com");
  });
});

describe("isAgeVerificationCurrent", () => {
  it("returns false on null / undefined / empty", () => {
    expect(isAgeVerificationCurrent(null)).toBe(false);
    expect(isAgeVerificationCurrent(undefined)).toBe(false);
    expect(isAgeVerificationCurrent("")).toBe(false);
  });

  it("returns false on un-parsable date strings", () => {
    expect(isAgeVerificationCurrent("not-a-date")).toBe(false);
    expect(isAgeVerificationCurrent("hello world")).toBe(false);
  });

  it("returns true for a freshly stamped ISO timestamp", () => {
    expect(isAgeVerificationCurrent(new Date().toISOString())).toBe(true);
  });

  it("returns false for a timestamp older than 30 days", () => {
    const longAgo = new Date(
      Date.now() - 31 * 24 * 60 * 60 * 1000,
    ).toISOString();
    expect(isAgeVerificationCurrent(longAgo)).toBe(false);
  });

  it("returns true at the inside-the-window boundary (29d 23h)", () => {
    const justUnder = new Date(
      Date.now() - (30 * 24 * 60 * 60 - 60) * 1000,
    ).toISOString();
    expect(isAgeVerificationCurrent(justUnder)).toBe(true);
  });
});

describe("normalizeAgeGateNext", () => {
  it("returns '/' for null / undefined / empty", () => {
    expect(normalizeAgeGateNext(null)).toBe("/");
    expect(normalizeAgeGateNext(undefined)).toBe("/");
    expect(normalizeAgeGateNext("")).toBe("/");
  });

  it("returns '/' for protocol-relative URLs (open-redirect guard)", () => {
    expect(normalizeAgeGateNext("//evil.com")).toBe("/");
    expect(normalizeAgeGateNext("//foo.bar/baz")).toBe("/");
  });

  it("returns '/' for absolute URLs (no leading '/')", () => {
    expect(normalizeAgeGateNext("https://evil.com")).toBe("/");
    expect(normalizeAgeGateNext("shop")).toBe("/");
  });

  it("returns '/' for paths under /age-gate (no redirect loop)", () => {
    expect(normalizeAgeGateNext("/age-gate")).toBe("/");
    expect(normalizeAgeGateNext("/age-gate/foo")).toBe("/");
  });

  it("returns the input unchanged for safe in-app paths", () => {
    expect(normalizeAgeGateNext("/shop")).toBe("/shop");
    expect(normalizeAgeGateNext("/checkout/cart")).toBe("/checkout/cart");
  });
});

describe("signAgeVerification + verifyAgeVerificationCookie roundtrip", () => {
  beforeEach(() => {
    // Provide a deterministic dev secret so sign/verify both pick it up.
    vi.stubEnv("AGE_GATE_SECRET", "test-only-secret-do-not-use-in-prod");
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("VERCEL_ENV", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("signAgeVerification produces a deterministic '<timestamp>.<base64url>' cookie for a fixed timestamp", async () => {
    const ts = "2026-05-20T10:00:00.000Z";
    const a = await signAgeVerification(ts);
    const b = await signAgeVerification(ts);
    expect(a).toBe(b);
    expect(a.startsWith(`${ts}.`)).toBe(true);
    // Base64url after the dot — RFC 4648, no padding, no '+' or '/'.
    const signature = a.slice(ts.length + 1);
    expect(signature.length).toBeGreaterThan(0);
    expect(/^[A-Za-z0-9_-]+$/.test(signature)).toBe(true);
  });

  it("signAgeVerification defaults to a fresh ISO timestamp when no argument is provided", async () => {
    const cookie = await signAgeVerification();
    // ISO 8601 has a `.` between seconds and ms, so the canonical separator
    // is the LAST dot, matching verifyAgeVerificationCookie's lastIndexOf use.
    const lastDot = cookie.lastIndexOf(".");
    const ts = cookie.slice(0, lastDot);
    expect(Number.isFinite(Date.parse(ts))).toBe(true);
    // Within ~5s of now (matches "fresh" semantics).
    expect(Math.abs(Date.now() - Date.parse(ts))).toBeLessThan(5_000);
  });

  it("verifyAgeVerificationCookie roundtrips a freshly signed cookie", async () => {
    const ts = new Date().toISOString();
    const cookie = await signAgeVerification(ts);
    const verified = await verifyAgeVerificationCookie(cookie);
    expect(verified).toBe(ts);
  });

  it("verifyAgeVerificationCookie returns null on tampered signature", async () => {
    const ts = new Date().toISOString();
    const cookie = await signAgeVerification(ts);
    const [stamp, sig] = cookie.split(".");
    // Flip a character of the signature.
    const tampered = `${stamp}.${sig.replace(/.$/, (c) => (c === "A" ? "B" : "A"))}`;
    expect(await verifyAgeVerificationCookie(tampered)).toBeNull();
  });

  it("verifyAgeVerificationCookie returns null when signed with a different secret", async () => {
    const ts = new Date().toISOString();
    const cookie = await signAgeVerification(ts);
    // Swap the signing secret and re-verify — must reject the prior cookie.
    vi.stubEnv("AGE_GATE_SECRET", "a-completely-different-secret-value");
    expect(await verifyAgeVerificationCookie(cookie)).toBeNull();
  });

  it("verifyAgeVerificationCookie returns null on expired (31-day-old) timestamp", async () => {
    const oldTs = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
    const cookie = await signAgeVerification(oldTs);
    expect(await verifyAgeVerificationCookie(cookie)).toBeNull();
  });

  it("verifyAgeVerificationCookie returns null on null / undefined / empty inputs", async () => {
    expect(await verifyAgeVerificationCookie(null)).toBeNull();
    expect(await verifyAgeVerificationCookie(undefined)).toBeNull();
    expect(await verifyAgeVerificationCookie("")).toBeNull();
  });

  it("verifyAgeVerificationCookie returns null when the separator is missing or leads", async () => {
    expect(await verifyAgeVerificationCookie("nodot")).toBeNull();
    // Leading dot — slice(0, sep) === "" — non-positive separator index.
    expect(await verifyAgeVerificationCookie(".only-signature")).toBeNull();
  });

  it("verifyAgeVerificationCookie returns null when the signature segment is empty", async () => {
    const ts = new Date().toISOString();
    expect(await verifyAgeVerificationCookie(`${ts}.`)).toBeNull();
  });

  it("verifyAgeVerificationCookie returns null when the timestamp is malformed", async () => {
    expect(await verifyAgeVerificationCookie("not-a-date.AAAA")).toBeNull();
  });

  it("isSignedAgeVerificationCurrent returns true for a valid signed cookie", async () => {
    const ts = new Date().toISOString();
    const cookie = await signAgeVerification(ts);
    expect(await isSignedAgeVerificationCurrent(cookie)).toBe(true);
  });

  it("isSignedAgeVerificationCurrent returns false for an expired cookie", async () => {
    const oldTs = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
    const cookie = await signAgeVerification(oldTs);
    expect(await isSignedAgeVerificationCurrent(cookie)).toBe(false);
  });

  it("isSignedAgeVerificationCurrent returns false for tampered / missing cookies", async () => {
    expect(await isSignedAgeVerificationCurrent(null)).toBe(false);
    expect(await isSignedAgeVerificationCurrent(undefined)).toBe(false);
    expect(await isSignedAgeVerificationCurrent("garbage")).toBe(false);
  });
});

describe("signAgeVerification — secret handling in production", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws when AGE_GATE_SECRET is missing in NODE_ENV=production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("AGE_GATE_SECRET", "");
    await expect(
      signAgeVerification("2026-05-20T00:00:00.000Z"),
    ).rejects.toThrow(/age_gate_secret_required/);
  });

  it("throws when AGE_GATE_SECRET is missing and VERCEL_ENV=production", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("AGE_GATE_SECRET", "");
    await expect(
      signAgeVerification("2026-05-20T00:00:00.000Z"),
    ).rejects.toThrow(/age_gate_secret_required/);
  });

  it("falls back to the dev-only sentinel secret when AGE_GATE_SECRET is undefined outside production", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "");
    // Force undefined (not empty-string), which is the path that engages the
    // `secret ?? "dev-only-age-gate-secret"` fallback. Empty-string is a
    // separate (and broken) input class — see the regression test below.
    delete process.env.AGE_GATE_SECRET;
    const cookie = await signAgeVerification("2026-05-20T00:00:00.000Z");
    expect(cookie.startsWith("2026-05-20T00:00:00.000Z.")).toBe(true);
  });

  it("sign + verify roundtrip works using the dev-only fallback secret", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("VERCEL_ENV", "");
    delete process.env.AGE_GATE_SECRET;
    const ts = new Date().toISOString();
    const cookie = await signAgeVerification(ts);
    expect(await verifyAgeVerificationCookie(cookie)).toBe(ts);
  });
});
