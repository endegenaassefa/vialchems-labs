import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/**
 * Iron Law 2.34 v5.1 — Upstash adapter integration test.
 *
 * Asserts:
 *   1. When `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set,
 *      `getRateLimitAdapter()` reports `"upstash"`.
 *   2. `isRateLimited()` dispatches to the Upstash `Ratelimit` client.
 *   3. On Upstash failure (5xx/timeout), the adapter falls back to in-memory
 *      and emits a Sentry warning so ops can detect the regression.
 *
 * The Upstash client and Redis transport are mocked. We do NOT make real
 * network calls.
 */

// Hoisted spies so vi.mock factories can capture them.
const {
  ratelimitLimitMock,
  ratelimitCtorMock,
  redisCtorMock,
  captureMessageMock,
  addBreadcrumbMock,
  slidingWindowMock,
} = vi.hoisted(() => ({
  ratelimitLimitMock: vi.fn(),
  ratelimitCtorMock: vi.fn(),
  redisCtorMock: vi.fn(),
  captureMessageMock: vi.fn(),
  addBreadcrumbMock: vi.fn(),
  slidingWindowMock: vi.fn(() => ({ __sliding_window_limiter__: true })),
}));

vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    public limit = ratelimitLimitMock;
    constructor(opts: unknown) {
      ratelimitCtorMock(opts);
    }
    static slidingWindow = slidingWindowMock;
  }
  return { Ratelimit };
});

vi.mock("@upstash/redis", () => {
  class Redis {
    constructor(opts: unknown) {
      redisCtorMock(opts);
    }
  }
  return { Redis };
});

vi.mock("@/lib/sentry", () => ({
  addRateLimitBreadcrumb: addBreadcrumbMock,
  captureMessage: captureMessageMock,
}));

describe("Upstash adapter (Iron Law 2.34 v5.1)", () => {
  beforeEach(() => {
    ratelimitLimitMock.mockReset();
    ratelimitCtorMock.mockReset();
    redisCtorMock.mockReset();
    captureMessageMock.mockReset();
    addBreadcrumbMock.mockReset();
    slidingWindowMock.mockClear();
    vi.resetModules();
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
    delete process.env.SKIP_RATE_LIMIT;
  });

  afterEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.SKIP_RATE_LIMIT;
  });

  it("reports the upstash adapter when both env vars are set", async () => {
    const { getRateLimitAdapter } = await import("@/lib/rate-limit");
    expect(getRateLimitAdapter()).toBe("upstash");
  });

  it("dispatches isRateLimited() to the Upstash Ratelimit client", async () => {
    ratelimitLimitMock.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 60_000,
    });
    const { isRateLimited } = await import("@/lib/rate-limit");
    const result = await isRateLimited({
      route: "access",
      ip: "203.0.113.50",
    });
    expect(result.limited).toBe(false);
    // The Upstash limiter is called once per gate.
    expect(ratelimitLimitMock).toHaveBeenCalled();
    // The Ratelimit constructor was invoked at least once (lazy init).
    expect(ratelimitCtorMock).toHaveBeenCalled();
  });

  it("reports limited=true when Upstash returns success=false", async () => {
    const reset = Date.now() + 30_000;
    ratelimitLimitMock.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset,
    });
    const { isRateLimited } = await import("@/lib/rate-limit");
    const result = await isRateLimited({
      route: "access",
      ip: "203.0.113.51",
    });
    expect(result.limited).toBe(true);
    if (result.limited) {
      expect(result.scope).toBe("ip");
      expect(result.retryAfterSeconds).toBeGreaterThan(0);
      expect(result.limit).toBe(10);
    }
    expect(addBreadcrumbMock).toHaveBeenCalledWith(
      "access",
      "ip",
      expect.any(Number),
    );
  });

  it("falls back to in-memory on Upstash failure and emits a Sentry warning", async () => {
    ratelimitLimitMock.mockRejectedValue(new Error("upstash 503"));
    const { isRateLimited } = await import("@/lib/rate-limit");
    const result = await isRateLimited({
      route: "access",
      ip: "203.0.113.52",
    });
    // Fallback to in-memory: first call goes through.
    expect(result.limited).toBe(false);
    expect(captureMessageMock).toHaveBeenCalledWith(
      "rate_limit.upstash_fallback",
      "warning",
      expect.any(Object),
    );
  });
});
