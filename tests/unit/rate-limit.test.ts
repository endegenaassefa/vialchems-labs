import { describe, expect, it, beforeEach } from "vitest";
import {
  rateLimitByIp,
  rateLimitByEmail,
  __resetRateLimitForTests,
} from "@/lib/rate-limit";

/**
 * Iron Law 2.34 — rate-limit unit tests.
 *
 * Day-1 implementation is in-memory sliding-window LRU; tests inject `now`
 * to verify window expiry without sleep-based flakiness.
 */
describe("rateLimitByIp (sliding-window)", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  it("permits the first call against the 'access' bucket", () => {
    const result = rateLimitByIp("access", "1.2.3.4");
    expect(result.success).toBe(true);
    expect(result.limit).toBe(10);
    expect(result.remaining).toBe(9);
    expect(result.retryAfterSeconds).toBe(0);
  });

  it("permits 10 calls within 60s on 'access' and denies the 11th", () => {
    const ip = "1.2.3.4";
    const t0 = 1_000_000_000;
    for (let i = 0; i < 10; i += 1) {
      const r = rateLimitByIp("access", ip, t0 + i * 1000);
      expect(r.success).toBe(true);
      expect(r.remaining).toBe(10 - (i + 1));
    }
    const eleventh = rateLimitByIp("access", ip, t0 + 10 * 1000);
    expect(eleventh.success).toBe(false);
    expect(eleventh.remaining).toBe(0);
    expect(eleventh.retryAfterSeconds).toBeGreaterThan(0);
    expect(eleventh.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it("resets the counter once the window has fully elapsed", () => {
    const ip = "5.6.7.8";
    const t0 = 2_000_000_000;
    for (let i = 0; i < 10; i += 1) {
      rateLimitByIp("access", ip, t0 + i * 1000);
    }
    const denied = rateLimitByIp("access", ip, t0 + 10_000);
    expect(denied.success).toBe(false);

    // Advance past the window (60s + 1s buffer)
    const afterWindow = rateLimitByIp("access", ip, t0 + 61_000);
    expect(afterWindow.success).toBe(true);
    expect(afterWindow.remaining).toBe(9);
  });

  it("tracks different IPs independently", () => {
    const t0 = 3_000_000_000;
    for (let i = 0; i < 10; i += 1) {
      rateLimitByIp("access", "10.0.0.1", t0 + i);
    }
    const blocked = rateLimitByIp("access", "10.0.0.1", t0 + 11);
    expect(blocked.success).toBe(false);

    const otherIp = rateLimitByIp("access", "10.0.0.2", t0 + 12);
    expect(otherIp.success).toBe(true);
  });

  it("applies different limits per route", () => {
    // 'contact' is 3 req / 3600s
    const ip = "9.9.9.9";
    const t0 = 4_000_000_000;
    expect(rateLimitByIp("contact", ip, t0).success).toBe(true);
    expect(rateLimitByIp("contact", ip, t0 + 1).success).toBe(true);
    expect(rateLimitByIp("contact", ip, t0 + 2).success).toBe(true);
    const blocked = rateLimitByIp("contact", ip, t0 + 3);
    expect(blocked.success).toBe(false);
    expect(blocked.limit).toBe(3);
  });

  it("applies the newsletter limit (5/300s)", () => {
    const ip = "7.7.7.7";
    const t0 = 5_000_000_000;
    for (let i = 0; i < 5; i += 1) {
      expect(rateLimitByIp("newsletter", ip, t0 + i).success).toBe(true);
    }
    const blocked = rateLimitByIp("newsletter", ip, t0 + 5);
    expect(blocked.success).toBe(false);
    expect(blocked.limit).toBe(5);
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(300);
  });

  it("throws on an unknown route", () => {
    expect(() =>
      // @ts-expect-error — purposely passing a bogus route to assert runtime guard
      rateLimitByIp("does-not-exist", "1.2.3.4"),
    ).toThrow(/Unknown route/);
  });

  it("returns a `reset` timestamp aligned to the oldest in-window request", () => {
    const ip = "11.11.11.11";
    const t0 = 6_000_000_000;
    for (let i = 0; i < 10; i += 1) {
      rateLimitByIp("access", ip, t0 + i * 100);
    }
    const r = rateLimitByIp("access", ip, t0 + 1_000);
    expect(r.success).toBe(false);
    // Reset = oldest (t0) + 60s window
    expect(r.reset).toBe(t0 + 60_000);
  });
});

describe("rateLimitByEmail", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  it("permits the first call and denies after the configured count", () => {
    // Per-email limit is 3 attempts / 1 hour.
    const email = "user@example.com";
    const t0 = 7_000_000_000;
    expect(rateLimitByEmail("access", email, t0).success).toBe(true);
    expect(rateLimitByEmail("access", email, t0 + 1).success).toBe(true);
    expect(rateLimitByEmail("access", email, t0 + 2).success).toBe(true);
    const blocked = rateLimitByEmail("access", email, t0 + 3);
    expect(blocked.success).toBe(false);
    expect(blocked.limit).toBe(3);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks emails independently of IPs", () => {
    const t0 = 8_000_000_000;
    for (let i = 0; i < 10; i += 1) {
      rateLimitByIp("access", "1.2.3.4", t0 + i);
    }
    // Per-IP exhausted, per-email still fresh
    expect(rateLimitByEmail("access", "fresh@example.com", t0 + 11).success).toBe(
      true,
    );
  });

  it("normalises email casing/whitespace before counting", () => {
    const t0 = 9_000_000_000;
    rateLimitByEmail("access", "User@Example.com", t0);
    rateLimitByEmail("access", "  user@example.com  ", t0 + 1);
    rateLimitByEmail("access", "USER@EXAMPLE.COM", t0 + 2);
    const blocked = rateLimitByEmail("access", "user@example.com", t0 + 3);
    expect(blocked.success).toBe(false);
  });
});

describe("storage selection", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  it("uses the in-memory adapter when UPSTASH_REDIS_REST_URL is absent", async () => {
    const original = process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;
    try {
      const { getRateLimitAdapter } = await import("@/lib/rate-limit");
      expect(getRateLimitAdapter()).toBe("in-memory");
    } finally {
      if (original !== undefined) process.env.UPSTASH_REDIS_REST_URL = original;
    }
  });

  it("flags 'upstash' when the env var is present (Day-1: planned swap)", async () => {
    const original = process.env.UPSTASH_REDIS_REST_URL;
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    try {
      const { getRateLimitAdapter } = await import("@/lib/rate-limit");
      expect(getRateLimitAdapter()).toBe("upstash");
    } finally {
      if (original === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
      else process.env.UPSTASH_REDIS_REST_URL = original;
    }
  });
});
