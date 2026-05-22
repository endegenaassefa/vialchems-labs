import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  rateLimitByIp,
  rateLimitByEmail,
  isRateLimited,
  __resetRateLimitForTests,
} from "@/lib/rate-limit";

// Spy hook for breadcrumb assertions. Hoisted so vi.mock() resolves it before
// the rate-limit module's static import binds the symbol.
const { addRateLimitBreadcrumbSpy, captureMessageSpy } = vi.hoisted(() => ({
  addRateLimitBreadcrumbSpy: vi.fn(),
  captureMessageSpy: vi.fn(),
}));

vi.mock("@/lib/sentry", () => ({
  addRateLimitBreadcrumb: addRateLimitBreadcrumbSpy,
  captureMessage: captureMessageSpy,
}));

/**
 * Iron Law 2.34 — rate-limit unit tests.
 *
 * Day-1 implementation is in-memory sliding-window LRU; tests inject `now`
 * to verify window expiry without sleep-based flakiness.
 *
 * v5.1 additions:
 *   - `isRateLimited({ route, ip, email? })` — high-level entry that
 *     gates IP first, then email when supplied
 *   - `SKIP_RATE_LIMIT=true` env bypass for tests + local dev
 *   - Upstash adapter swap via `UPSTASH_REDIS_REST_URL` +
 *     `UPSTASH_REDIS_REST_TOKEN`
 *   - LRU eviction cap (`RATE_LIMIT_MAX_KEYS`, default 10_000)
 *   - Sentry breadcrumb on every limit denial
 */
describe("rateLimitByIp (sliding-window)", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    addRateLimitBreadcrumbSpy.mockClear();
    captureMessageSpy.mockClear();
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
    // Record 10 timestamps clustered at t0 (all within a few ms).
    for (let i = 0; i < 10; i += 1) {
      rateLimitByIp("access", ip, t0 + i);
    }
    const denied = rateLimitByIp("access", ip, t0 + 20);
    expect(denied.success).toBe(false);

    // Advance well past the 60s window so every prior timestamp ages out.
    const afterWindow = rateLimitByIp("access", ip, t0 + 70_000);
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
    addRateLimitBreadcrumbSpy.mockClear();
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
    expect(
      rateLimitByEmail("access", "fresh@example.com", t0 + 11).success,
    ).toBe(true);
  });

  it("normalises email casing/whitespace before counting", () => {
    const t0 = 9_000_000_000;
    rateLimitByEmail("access", "User@Example.com", t0);
    rateLimitByEmail("access", "  user@example.com  ", t0 + 1);
    rateLimitByEmail("access", "USER@EXAMPLE.COM", t0 + 2);
    const blocked = rateLimitByEmail("access", "user@example.com", t0 + 3);
    expect(blocked.success).toBe(false);
  });

  it("throws on an unknown email route", () => {
    expect(() =>
      // @ts-expect-error — purposely passing a bogus route to assert runtime guard
      rateLimitByEmail("does-not-exist", "user@example.com"),
    ).toThrow(/Unknown route/);
  });
});

describe("storage selection", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  it("uses the in-memory adapter when UPSTASH_REDIS_REST_URL is absent", async () => {
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    try {
      const { getRateLimitAdapter } = await import("@/lib/rate-limit");
      expect(getRateLimitAdapter()).toBe("in-memory");
    } finally {
      if (originalUrl !== undefined)
        process.env.UPSTASH_REDIS_REST_URL = originalUrl;
      if (originalToken !== undefined)
        process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
    }
  });

  it("flags 'upstash' when BOTH env vars are present", async () => {
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
    try {
      const { getRateLimitAdapter } = await import("@/lib/rate-limit");
      expect(getRateLimitAdapter()).toBe("upstash");
    } finally {
      if (originalUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
      else process.env.UPSTASH_REDIS_REST_URL = originalUrl;
      if (originalToken === undefined)
        delete process.env.UPSTASH_REDIS_REST_TOKEN;
      else process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
    }
  });

  it("falls back to 'in-memory' when only URL is set (no token)", async () => {
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    try {
      const { getRateLimitAdapter } = await import("@/lib/rate-limit");
      expect(getRateLimitAdapter()).toBe("in-memory");
    } finally {
      if (originalUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
      else process.env.UPSTASH_REDIS_REST_URL = originalUrl;
      if (originalToken !== undefined)
        process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
    }
  });
});

describe("isRateLimited (high-level entry)", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    addRateLimitBreadcrumbSpy.mockClear();
  });

  afterEach(() => {
    delete process.env.SKIP_RATE_LIMIT;
  });

  it("returns { limited: false } under cap", async () => {
    const result = await isRateLimited({
      route: "access",
      ip: "203.0.113.1",
    });
    expect(result.limited).toBe(false);
  });

  it("returns { limited: true, scope: 'ip' } when IP exceeds the per-route cap", async () => {
    const ip = "203.0.113.2";
    const t0 = 1_700_000_000_000;
    for (let i = 0; i < 10; i += 1) {
      await isRateLimited({ route: "access", ip, now: t0 + i });
    }
    const blocked = await isRateLimited({ route: "access", ip, now: t0 + 11 });
    expect(blocked.limited).toBe(true);
    if (blocked.limited) {
      expect(blocked.scope).toBe("ip");
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
      expect(blocked.limit).toBe(10);
    }
  });

  it("returns { limited: true, scope: 'email' } when IP is fresh but email exceeds 3/hr", async () => {
    const email = "abuser@example.com";
    const t0 = 1_700_000_010_000;
    // Different IPs so per-IP gate stays fresh. Per-email cap is 3/3600s.
    for (let i = 0; i < 3; i += 1) {
      const r = await isRateLimited({
        route: "access",
        ip: `198.51.100.${i + 1}`,
        email,
        now: t0 + i,
      });
      expect(r.limited).toBe(false);
    }
    const blocked = await isRateLimited({
      route: "access",
      ip: "198.51.100.99",
      email,
      now: t0 + 4,
    });
    expect(blocked.limited).toBe(true);
    if (blocked.limited) {
      expect(blocked.scope).toBe("email");
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it("skips the email check when arg omitted (IP-only gate)", async () => {
    // Even with no email, the IP gate stands alone for the contact route.
    const t0 = 1_700_000_020_000;
    for (let i = 0; i < 3; i += 1) {
      const r = await isRateLimited({
        route: "contact",
        ip: "203.0.113.55",
        now: t0 + i,
      });
      expect(r.limited).toBe(false);
    }
    const blocked = await isRateLimited({
      route: "contact",
      ip: "203.0.113.55",
      now: t0 + 4,
    });
    expect(blocked.limited).toBe(true);
    if (blocked.limited) {
      expect(blocked.scope).toBe("ip");
    }
  });

  it("SKIP_RATE_LIMIT=true bypasses both gates", async () => {
    process.env.SKIP_RATE_LIMIT = "true";
    const ip = "203.0.113.3";
    // Even with 100 calls, never trips.
    for (let i = 0; i < 100; i += 1) {
      const r = await isRateLimited({ route: "access", ip });
      expect(r.limited).toBe(false);
    }
  });

  it("emits a Sentry breadcrumb on IP limit denial", async () => {
    const ip = "203.0.113.4";
    const t0 = 1_700_000_030_000;
    for (let i = 0; i < 10; i += 1) {
      await isRateLimited({ route: "access", ip, now: t0 + i });
    }
    addRateLimitBreadcrumbSpy.mockClear();
    const blocked = await isRateLimited({
      route: "access",
      ip,
      now: t0 + 11,
    });
    expect(blocked.limited).toBe(true);
    expect(addRateLimitBreadcrumbSpy).toHaveBeenCalledTimes(1);
    expect(addRateLimitBreadcrumbSpy).toHaveBeenCalledWith(
      "access",
      "ip",
      expect.any(Number),
    );
  });

  it("emits a Sentry breadcrumb on email limit denial", async () => {
    const email = "spammer@example.com";
    const t0 = 1_700_000_040_000;
    for (let i = 0; i < 3; i += 1) {
      await isRateLimited({
        route: "access",
        ip: `198.51.100.${100 + i}`,
        email,
        now: t0 + i,
      });
    }
    addRateLimitBreadcrumbSpy.mockClear();
    const blocked = await isRateLimited({
      route: "access",
      ip: "198.51.100.200",
      email,
      now: t0 + 4,
    });
    expect(blocked.limited).toBe(true);
    expect(addRateLimitBreadcrumbSpy).toHaveBeenCalledWith(
      "access",
      "email",
      expect.any(Number),
    );
  });
});

describe("LRU eviction cap", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  afterEach(() => {
    delete process.env.RATE_LIMIT_MAX_KEYS;
  });

  it("evicts the least-recently-used entry once the cap is exceeded", async () => {
    // Tighten the cap so the test stays fast.
    process.env.RATE_LIMIT_MAX_KEYS = "5";
    // Force re-import so the new env value seeds the store.
    vi.resetModules();
    const mod = await import("@/lib/rate-limit");
    mod.__resetRateLimitForTests();

    const t0 = 1_700_001_000_000;
    // Fill the cap (5 distinct IPs).
    for (let i = 0; i < 5; i += 1) {
      mod.rateLimitByIp("access", `10.0.0.${i + 1}`, t0);
    }
    // 6th distinct IP triggers eviction of the LRU entry (10.0.0.1).
    mod.rateLimitByIp("access", "10.0.0.99", t0 + 1);

    // 10.0.0.1's counter was evicted, so it now appears fresh.
    // (If we hadn't evicted, its prior call would still count.)
    const re = mod.rateLimitByIp("access", "10.0.0.1", t0 + 2);
    expect(re.success).toBe(true);
    // First call to a fresh bucket → remaining = limit - 1.
    expect(re.remaining).toBe(9);
  });
});
