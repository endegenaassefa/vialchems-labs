/**
 * Phase 10 J1 (v5 closure) — lib/supabase.ts coverage.
 *
 * Iron Law 2.22: service-role key is server-side only; browser must never
 * see it. Iron Law 2.36: compliance-/security-adjacent libs need ≥90% line
 * coverage. The Supabase client factory module is the gate between
 * REQUIRE_SUPABASE=false (Day-1 graceful no-op) and REQUIRE_SUPABASE=true
 * (production, fail-loud on missing creds). It also caches the singletons
 * via module-level state — which is brittle under tests, so we expose
 * `_resetSupabaseCachesForTests` and exercise it here.
 *
 * Test surface:
 *  - browserSupabase(): null when not required; client when env set; throws
 *    when required but env missing.
 *  - serviceSupabase(): null when not required; client when env set; throws
 *    when required but SUPABASE_SERVICE_ROLE_KEY missing.
 *  - production behavior: defaults to required unless
 *    ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION is set.
 *  - singleton caching: repeated calls return the same instance; reset
 *    clears it.
 *
 * We mock `@supabase/supabase-js` so `createClient` doesn't try to open
 * network connections. The factory contract under test is "compose the
 * correct (url, key) tuple and forward to createClient", not the SDK's
 * network behavior.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock @supabase/supabase-js to keep tests offline. The factory is what we're
// testing — we don't need a real Supabase client, just a sentinel that proves
// (a) createClient was called with the expected (url, key) tuple, and
// (b) the result was returned to the caller.
//
// vi.mock is hoisted above imports, so we use vi.hoisted to make the shared
// mock fn available to both the mock factory and the test bodies.
const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(
    (url: string, key: string, options?: Record<string, unknown>) => ({
      __mock__: "supabase-client",
      url,
      key,
      options,
    }),
  ),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

// Imports come AFTER vi.mock so the alias resolves correctly.
import {
  _resetSupabaseCachesForTests,
  browserSupabase,
  serviceSupabase,
} from "@/lib/supabase";

const ORIGINAL_ENV = {
  REQUIRE_SUPABASE: process.env.REQUIRE_SUPABASE,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION:
    process.env.ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION,
};

function clearSupabaseEnv(): void {
  delete process.env.REQUIRE_SUPABASE;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION;
}

function restoreSupabaseEnv(): void {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

beforeEach(() => {
  createClientMock.mockClear();
  _resetSupabaseCachesForTests();
  clearSupabaseEnv();
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("VERCEL_ENV", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
  _resetSupabaseCachesForTests();
  restoreSupabaseEnv();
});

describe("browserSupabase", () => {
  it("returns null when REQUIRE_SUPABASE is unset (Day-1 graceful no-op)", () => {
    expect(browserSupabase()).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("returns null when REQUIRE_SUPABASE='false' explicitly", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "false");
    expect(browserSupabase()).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("returns null when REQUIRE_SUPABASE is any non-'true' string", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "yes-please");
    expect(browserSupabase()).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("returns a client when REQUIRE_SUPABASE='true' and env is set", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-abc");

    const client = browserSupabase();
    expect(client).toEqual(
      expect.objectContaining({
        __mock__: "supabase-client",
        url: "https://example.supabase.co",
        key: "anon-key-abc",
      }),
    );
    expect(createClientMock).toHaveBeenCalledTimes(1);
    // Inspect the auth options forwarded — Iron Law 2.22 expects browser auth
    // persistence (cookies/localStorage) so users stay logged in across reloads.
    expect(createClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "anon-key-abc",
      expect.objectContaining({
        auth: expect.objectContaining({
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        }),
      }),
    );
  });

  it("throws when REQUIRE_SUPABASE='true' but NEXT_PUBLIC_SUPABASE_URL is missing", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-abc");
    expect(() => browserSupabase()).toThrow(
      /REQUIRE_SUPABASE=true but NEXT_PUBLIC_SUPABASE_URL is empty/,
    );
  });

  it("throws when REQUIRE_SUPABASE='true' but NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    expect(() => browserSupabase()).toThrow(
      /REQUIRE_SUPABASE=true but NEXT_PUBLIC_SUPABASE_ANON_KEY is empty/,
    );
  });

  it("throws when REQUIRE_SUPABASE='true' but env values are empty strings", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    expect(() => browserSupabase()).toThrow(/is empty/);
  });

  it("caches the client across calls (singleton)", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-abc");

    const first = browserSupabase();
    const second = browserSupabase();
    expect(first).toBe(second);
    expect(createClientMock).toHaveBeenCalledTimes(1);
  });

  it("caches the null result when not required (no repeated env reads)", () => {
    // First call: not required → cachedBrowser = null.
    expect(browserSupabase()).toBeNull();
    // Even if we now set the env, the cache holds (the singleton was initialized
    // for the "not required" path). _resetSupabaseCachesForTests is the only
    // way to re-evaluate — this is the documented contract.
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-abc");
    expect(browserSupabase()).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });
});

describe("serviceSupabase", () => {
  it("returns null when REQUIRE_SUPABASE is unset (Day-1)", () => {
    expect(serviceSupabase()).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("returns null when REQUIRE_SUPABASE='false'", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "false");
    expect(serviceSupabase()).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("returns a service-role client when REQUIRE_SUPABASE='true' and env is set", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-xyz");

    const client = serviceSupabase();
    expect(client).toEqual(
      expect.objectContaining({
        __mock__: "supabase-client",
        url: "https://example.supabase.co",
        key: "service-role-xyz",
      }),
    );
    // Iron Law 2.22: service-role client must NOT persistSession; it has no
    // user context, only a privileged static key.
    expect(createClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "service-role-xyz",
      expect.objectContaining({
        auth: expect.objectContaining({
          persistSession: false,
          autoRefreshToken: false,
        }),
        db: { schema: "public" },
      }),
    );
  });

  it("throws when REQUIRE_SUPABASE='true' but SUPABASE_SERVICE_ROLE_KEY is missing", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    expect(() => serviceSupabase()).toThrow(
      /REQUIRE_SUPABASE=true but SUPABASE_SERVICE_ROLE_KEY is empty/,
    );
  });

  it("throws when REQUIRE_SUPABASE='true' but NEXT_PUBLIC_SUPABASE_URL is missing", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-xyz");
    expect(() => serviceSupabase()).toThrow(
      /REQUIRE_SUPABASE=true but NEXT_PUBLIC_SUPABASE_URL is empty/,
    );
  });

  it("caches the service client across calls (singleton)", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-xyz");

    const first = serviceSupabase();
    const second = serviceSupabase();
    expect(first).toBe(second);
    expect(createClientMock).toHaveBeenCalledTimes(1);
  });
});

describe("isRequired — production semantics", () => {
  it("defaults to REQUIRED=true in NODE_ENV=production (fail-loud on missing env)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "");
    // No REQUIRE_SUPABASE, no creds → should throw.
    expect(() => browserSupabase()).toThrow(/is empty/);
  });

  it("defaults to REQUIRED=true in VERCEL_ENV=production even when NODE_ENV != production", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(() => serviceSupabase()).toThrow(/is empty/);
  });

  it("allows null fallback in production when ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION=true", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION", "true");
    expect(browserSupabase()).toBeNull();
    expect(serviceSupabase()).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION accepts the canonical truthy values from envFlag", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION", "1");
    expect(browserSupabase()).toBeNull();
  });

  it("ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION='yes' is also accepted", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION", "yes");
    expect(browserSupabase()).toBeNull();
  });

  it("ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION='no' does NOT relax the production gate", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION", "no");
    expect(() => browserSupabase()).toThrow(/is empty/);
  });
});

describe("_resetSupabaseCachesForTests", () => {
  it("clears the cached browser client (next call re-invokes createClient)", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-abc");

    browserSupabase();
    expect(createClientMock).toHaveBeenCalledTimes(1);
    _resetSupabaseCachesForTests();
    browserSupabase();
    expect(createClientMock).toHaveBeenCalledTimes(2);
  });

  it("clears the cached service client (next call re-invokes createClient)", () => {
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-xyz");

    serviceSupabase();
    expect(createClientMock).toHaveBeenCalledTimes(1);
    _resetSupabaseCachesForTests();
    serviceSupabase();
    expect(createClientMock).toHaveBeenCalledTimes(2);
  });

  it("clears both caches so that env changes take effect after reset", () => {
    expect(browserSupabase()).toBeNull();
    expect(serviceSupabase()).toBeNull();

    _resetSupabaseCachesForTests();
    vi.stubEnv("REQUIRE_SUPABASE", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-abc");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-xyz");

    const browser = browserSupabase();
    const service = serviceSupabase();
    expect(browser).not.toBeNull();
    expect(service).not.toBeNull();
    expect(browser).not.toBe(service);
  });
});
