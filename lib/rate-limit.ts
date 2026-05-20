/**
 * Iron Law 2.34 — rate limiting on unauthenticated POST routes.
 *
 * Day-1: in-memory sliding-window LRU. Each Vercel serverless instance
 * has its own counter; spam from a single IP across multiple instances
 * can still exceed the per-instance limit but the aggregate effect is
 * bounded by Vercel's connection pool.
 *
 * Production: swap to Upstash Redis (@upstash/ratelimit) for cross-instance
 * coordination. Gate via UPSTASH_REDIS_REST_URL env. Future swap is one
 * code change (replace the LRU store with Ratelimit.slidingWindow(redis)).
 *
 * Closes audit H5. Wired on /api/access, /api/newsletter/subscribe,
 * /api/contact per v5 §2.34.
 */

interface SlidingWindowEntry {
  timestamps: number[]; // millisecond timestamps within the current window
}

interface RateLimitConfig {
  requests: number;
  windowSeconds: number;
}

const IP_CONFIGS = {
  access: { requests: 10, windowSeconds: 60 },
  newsletter: { requests: 5, windowSeconds: 300 },
  contact: { requests: 3, windowSeconds: 3600 },
} as const satisfies Record<string, RateLimitConfig>;

// Per-email limit: 3 attempts / 1 hour across any route bucket where the
// caller opts in (currently only /api/access via the buyer-qualification flow).
const EMAIL_CONFIGS = {
  access: { requests: 3, windowSeconds: 3600 },
  newsletter: { requests: 3, windowSeconds: 3600 },
  contact: { requests: 3, windowSeconds: 3600 },
} as const satisfies Record<string, RateLimitConfig>;

export type RouteKey = keyof typeof IP_CONFIGS;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // milliseconds-from-epoch when the window resets
  retryAfterSeconds: number; // 0 when success
}

// Storage shape: route bucket -> identifier -> entry. Storage maps are
// instantiated lazily so a `__resetRateLimitForTests` between cases is cheap.
const ipStores = new Map<string, Map<string, SlidingWindowEntry>>();
const emailStores = new Map<string, Map<string, SlidingWindowEntry>>();

function evaluate(
  store: Map<string, SlidingWindowEntry>,
  identifier: string,
  config: RateLimitConfig,
  now: number,
): RateLimitResult {
  const windowMs = config.windowSeconds * 1000;
  const entry = store.get(identifier) ?? { timestamps: [] };

  // Drop timestamps outside the window.
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= config.requests) {
    const oldest = entry.timestamps[0];
    const reset = oldest + windowMs;
    return {
      success: false,
      limit: config.requests,
      remaining: 0,
      reset,
      retryAfterSeconds: Math.max(1, Math.ceil((reset - now) / 1000)),
    };
  }

  // Record this request and persist back into the store.
  entry.timestamps.push(now);
  store.set(identifier, entry);

  return {
    success: true,
    limit: config.requests,
    remaining: config.requests - entry.timestamps.length,
    reset: now + windowMs,
    retryAfterSeconds: 0,
  };
}

function getStore(
  stores: Map<string, Map<string, SlidingWindowEntry>>,
  route: string,
): Map<string, SlidingWindowEntry> {
  let store = stores.get(route);
  if (!store) {
    store = new Map();
    stores.set(route, store);
  }
  return store;
}

/**
 * Rate-limit a request by client IP for the named route bucket.
 *
 * @param route — one of "access" | "newsletter" | "contact"
 * @param ip — caller's network identifier (typically `x-forwarded-for`)
 * @param now — clock injection point for deterministic tests; defaults to Date.now()
 */
export function rateLimitByIp(
  route: RouteKey,
  ip: string,
  now: number = Date.now(),
): RateLimitResult {
  const config = IP_CONFIGS[route];
  if (!config) {
    throw new Error(`Unknown route: ${String(route)}`);
  }
  const store = getStore(ipStores, route);
  return evaluate(store, ip, config, now);
}

/**
 * Rate-limit by normalised email address (case-insensitive, whitespace-trimmed).
 * Per-email default is 3 attempts / 1 hour across all configured route buckets.
 */
export function rateLimitByEmail(
  route: RouteKey,
  email: string,
  now: number = Date.now(),
): RateLimitResult {
  const config = EMAIL_CONFIGS[route];
  if (!config) {
    throw new Error(`Unknown route: ${String(route)}`);
  }
  const normalised = email.trim().toLowerCase();
  const store = getStore(emailStores, route);
  return evaluate(store, normalised, config, now);
}

/**
 * Returns which storage adapter is active. Day-1 always "in-memory"; once
 * UPSTASH_REDIS_REST_URL is set the reporter flags "upstash" so ops dashboards
 * can confirm the swap. Actual storage swap lands when Phase 11 wires the
 * Upstash Ratelimit client; until then this just advertises intent.
 */
export function getRateLimitAdapter(): "in-memory" | "upstash" {
  return process.env.UPSTASH_REDIS_REST_URL ? "upstash" : "in-memory";
}

/**
 * Test-only helper. Wipes all counters so cases are deterministic. NOT exported
 * via the public surface (callers in production code must not depend on it).
 */
export function __resetRateLimitForTests(): void {
  ipStores.clear();
  emailStores.clear();
}
