/**
 * Iron Law 2.34 — rate limiting on unauthenticated POST routes.
 *
 * Two adapters share a single contract:
 *
 *  • "in-memory" (default): sliding-window LRU keyed by IP or normalised
 *    email. Each Vercel serverless instance has its own counter — aggregate
 *    cap is bounded by the connection pool. Suitable for Day-1 traffic
 *    (≲100 RPS sustained).
 *
 *  • "upstash" (production, opt-in): `@upstash/ratelimit` slidingWindow
 *    backed by Upstash Redis REST. Coordinates across every Vercel region
 *    + instance. Activated when BOTH `UPSTASH_REDIS_REST_URL` and
 *    `UPSTASH_REDIS_REST_TOKEN` are set.
 *
 * Upstash failures (timeouts, 5xx, anything thrown by the client) fail
 * OPEN: the request goes through the in-memory adapter and we emit a
 * `rate_limit.upstash_fallback` Sentry warning. Failing open is the right
 * call here — rate limiting is anti-abuse, not security, and a hard fail
 * would lock real users out during a transient Redis outage.
 *
 * Tests + local dev: set `SKIP_RATE_LIMIT=true` to bypass every gate. A
 * one-time module-load Sentry alert fires if `NODE_ENV=production` AND
 * `SKIP_RATE_LIMIT=true`, so a forgotten env var can't silently disable
 * production protection.
 *
 * Storage:
 *   • Tunable LRU cap via `RATE_LIMIT_MAX_KEYS` (default 10_000). Caps
 *     memory per Vercel instance — IPs evicted in LRU order. Ignored when
 *     the Upstash adapter is active (Redis handles eviction).
 *
 * Closes audit H5 + v5.1 closure brief.
 */
import { LRUCache } from "lru-cache";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { addRateLimitBreadcrumb, captureMessage } from "@/lib/sentry";

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
// caller opts in (currently /api/access via buyer-qualification and
// /api/newsletter/subscribe via the form).
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

// ---------------------------------------------------------------------------
// In-memory adapter (LRU)
// ---------------------------------------------------------------------------

const MAX_KEYS_DEFAULT = 10_000;
// Widest window across all configs (contact = 3600s); LRU TTL is set just
// above it so a key that ages out also drops in the eviction view.
const LRU_TTL_MS = 3600 * 1000 + 60_000;

function resolveMaxKeys(): number {
  const raw = process.env.RATE_LIMIT_MAX_KEYS;
  if (!raw) return MAX_KEYS_DEFAULT;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return MAX_KEYS_DEFAULT;
  return parsed;
}

interface Stores {
  ip: Map<string, LRUCache<string, SlidingWindowEntry>>;
  email: Map<string, LRUCache<string, SlidingWindowEntry>>;
}

let stores: Stores = { ip: new Map(), email: new Map() };

function makeLru(): LRUCache<string, SlidingWindowEntry> {
  return new LRUCache<string, SlidingWindowEntry>({
    max: resolveMaxKeys(),
    ttl: LRU_TTL_MS,
  });
}

function getInMemoryStore(
  bucket: Map<string, LRUCache<string, SlidingWindowEntry>>,
  route: string,
): LRUCache<string, SlidingWindowEntry> {
  let store = bucket.get(route);
  if (!store) {
    store = makeLru();
    bucket.set(route, store);
  }
  return store;
}

function evaluate(
  store: LRUCache<string, SlidingWindowEntry>,
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
  const store = getInMemoryStore(stores.ip, route);
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
  const store = getInMemoryStore(stores.email, route);
  return evaluate(store, normalised, config, now);
}

// ---------------------------------------------------------------------------
// Upstash adapter
// ---------------------------------------------------------------------------

interface UpstashGateResult {
  ok: boolean;
  limit: number;
  remaining: number;
  reset: number; // ms-since-epoch
}

// Lazy singleton Upstash limiters per (route, scope). We construct them on
// first use so test cases that swap env vars mid-run still see the right
// config. Reset via `__resetRateLimitForTests`.
let upstashRedis: Redis | null = null;
const upstashIpLimiters = new Map<string, Ratelimit>();
const upstashEmailLimiters = new Map<string, Ratelimit>();

function getUpstashRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!upstashRedis) {
    upstashRedis = new Redis({ url, token });
  }
  return upstashRedis;
}

function getUpstashLimiter(
  scope: "ip" | "email",
  route: RouteKey,
): Ratelimit | null {
  const redis = getUpstashRedis();
  if (!redis) return null;
  const cache = scope === "ip" ? upstashIpLimiters : upstashEmailLimiters;
  const existing = cache.get(route);
  if (existing) return existing;
  const config = scope === "ip" ? IP_CONFIGS[route] : EMAIL_CONFIGS[route];
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      config.requests,
      `${config.windowSeconds} s`,
    ),
    prefix: `vcl:rl:${scope}:${route}`,
    analytics: false,
  });
  cache.set(route, limiter);
  return limiter;
}

async function upstashGate(
  scope: "ip" | "email",
  route: RouteKey,
  identifier: string,
): Promise<UpstashGateResult | null> {
  const limiter = getUpstashLimiter(scope, route);
  if (!limiter) return null;
  try {
    const res = await limiter.limit(identifier);
    return {
      ok: res.success,
      limit: res.limit,
      remaining: res.remaining,
      reset: res.reset,
    };
  } catch (err) {
    // Fail open: log the regression to Sentry and let the caller fall back.
    captureMessage("rate_limit.upstash_fallback", "warning", {
      tags: { route, scope },
      extra: { error: String((err as Error)?.message ?? err) },
    });
    return null;
  }
}

// ---------------------------------------------------------------------------
// SKIP_RATE_LIMIT bypass + adapter selection
// ---------------------------------------------------------------------------

function skipRateLimit(): boolean {
  return process.env.SKIP_RATE_LIMIT === "true";
}

/**
 * Returns which storage adapter is active. Once both Upstash env vars are
 * set, this flips to "upstash" so ops dashboards can confirm the swap;
 * `isRateLimited()` actually dispatches to the Upstash client at that
 * point.
 */
export function getRateLimitAdapter(): "in-memory" | "upstash" {
  return process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
    ? "upstash"
    : "in-memory";
}

// Module-load safety alert: bypass active in production is a misconfiguration.
// Fire ONCE so a forgotten env var doesn't silently disable protection.
let bypassWarningEmitted = false;
function maybeEmitBypassWarning(): void {
  if (bypassWarningEmitted) return;
  if (process.env.NODE_ENV === "production" && skipRateLimit()) {
    bypassWarningEmitted = true;
    captureMessage("rate_limit.bypass_active", "error", {
      tags: { route: "all", scope: "all" },
      extra: { reason: "SKIP_RATE_LIMIT=true in production" },
    });
  }
}

// ---------------------------------------------------------------------------
// High-level entry point — IP-first, then email gate when supplied.
// ---------------------------------------------------------------------------

export interface IsRateLimitedArgs {
  route: RouteKey;
  ip: string;
  email?: string;
  now?: number;
}

export type IsRateLimitedResult =
  | { limited: false }
  | {
      limited: true;
      scope: "ip" | "email";
      retryAfterSeconds: number;
      limit: number;
      reset: number;
    };

/**
 * Returns `{ limited: false }` when the caller is under cap, or `{ limited:
 * true, scope, retryAfterSeconds, limit, reset }` on denial. Pre-validation
 * IP gate runs first; if email is supplied, the per-email gate runs after
 * (so a fresh IP can still be blocked when the email is exhausted).
 *
 * Bypass: SKIP_RATE_LIMIT=true → `{ limited: false }` without consulting
 * any store. Module-load Sentry alert fires when this is active in
 * production.
 *
 * Adapter: Upstash when both env vars are set, else in-memory. Upstash
 * failure falls back to in-memory + Sentry warning (fail-open).
 */
export async function isRateLimited(
  args: IsRateLimitedArgs,
): Promise<IsRateLimitedResult> {
  maybeEmitBypassWarning();
  if (skipRateLimit()) {
    return { limited: false };
  }

  const now = args.now ?? Date.now();
  const adapter = getRateLimitAdapter();

  // ---- IP gate ----
  if (adapter === "upstash") {
    const res = await upstashGate("ip", args.route, args.ip);
    if (res !== null) {
      if (!res.ok) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil((res.reset - now) / 1000),
        );
        addRateLimitBreadcrumb(args.route, "ip", retryAfterSeconds);
        return {
          limited: true,
          scope: "ip",
          retryAfterSeconds,
          limit: res.limit,
          reset: res.reset,
        };
      }
    } else {
      // Upstash failed (already warned via Sentry). Fall back to in-memory.
      const fallback = rateLimitByIp(args.route, args.ip, now);
      if (!fallback.success) {
        addRateLimitBreadcrumb(args.route, "ip", fallback.retryAfterSeconds);
        return {
          limited: true,
          scope: "ip",
          retryAfterSeconds: fallback.retryAfterSeconds,
          limit: fallback.limit,
          reset: fallback.reset,
        };
      }
    }
  } else {
    const r = rateLimitByIp(args.route, args.ip, now);
    if (!r.success) {
      addRateLimitBreadcrumb(args.route, "ip", r.retryAfterSeconds);
      return {
        limited: true,
        scope: "ip",
        retryAfterSeconds: r.retryAfterSeconds,
        limit: r.limit,
        reset: r.reset,
      };
    }
  }

  // ---- Email gate (only if supplied) ----
  if (args.email !== undefined) {
    if (adapter === "upstash") {
      const res = await upstashGate(
        "email",
        args.route,
        args.email.trim().toLowerCase(),
      );
      if (res !== null) {
        if (!res.ok) {
          const retryAfterSeconds = Math.max(
            1,
            Math.ceil((res.reset - now) / 1000),
          );
          addRateLimitBreadcrumb(args.route, "email", retryAfterSeconds);
          return {
            limited: true,
            scope: "email",
            retryAfterSeconds,
            limit: res.limit,
            reset: res.reset,
          };
        }
      } else {
        const fallback = rateLimitByEmail(args.route, args.email, now);
        if (!fallback.success) {
          addRateLimitBreadcrumb(
            args.route,
            "email",
            fallback.retryAfterSeconds,
          );
          return {
            limited: true,
            scope: "email",
            retryAfterSeconds: fallback.retryAfterSeconds,
            limit: fallback.limit,
            reset: fallback.reset,
          };
        }
      }
    } else {
      const r = rateLimitByEmail(args.route, args.email, now);
      if (!r.success) {
        addRateLimitBreadcrumb(args.route, "email", r.retryAfterSeconds);
        return {
          limited: true,
          scope: "email",
          retryAfterSeconds: r.retryAfterSeconds,
          limit: r.limit,
          reset: r.reset,
        };
      }
    }
  }

  return { limited: false };
}

/**
 * Test-only helper. Wipes all counters + adapters so cases are deterministic.
 * NOT exported via the public surface (callers in production code must not
 * depend on it).
 */
export function __resetRateLimitForTests(): void {
  stores = { ip: new Map(), email: new Map() };
  upstashRedis = null;
  upstashIpLimiters.clear();
  upstashEmailLimiters.clear();
  bypassWarningEmitted = false;
}
