/**
 * Phase 14 — Plaid JWKS live-fetch with in-memory cache.
 *
 * Pre-Phase-14 `buildJwksFetcher` read keys ONLY from the static
 * `PLAID_JWKS_KEYS` env var. Production guidance was to leave the env
 * unset, which meant every Plaid webhook in production failed with
 * `jwks_fetch_failed`. Codex flagged this as B5 ([P2]) at PR #2 review.
 *
 * Phase 14 fix: when the static map has no key for the kid, fall through
 * to a live fetch against Plaid's `/webhook_verification_key/get`
 * endpoint, cache by kid for ~24h, and surface fetch failures as null
 * so the JWT verifier returns `jwks_fetch_failed` (existing reason —
 * the *signal* doesn't change, only the *source* of keys).
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  buildJwksFetcher,
  _resetPlaidJwksCacheForTests,
  type PlaidEnv,
} from "@/lib/payments/plaid";
import type { PlaidJwksKey } from "@/lib/payments/plaid-jwks";

const SAMPLE_KEY: PlaidJwksKey = {
  kty: "EC",
  crv: "P-256",
  x: "placeholder-x",
  y: "placeholder-y",
  alg: "ES256",
  use: "sig",
  kid: "kid-live-1",
};

function jsonResponse(
  status: number,
  body: unknown,
): { ok: boolean; status: number; json: () => Promise<unknown> } {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe("buildJwksFetcher — Phase 14 live-fetch + cache (codex B5)", () => {
  beforeEach(() => {
    _resetPlaidJwksCacheForTests();
  });

  it("static map takes precedence over live fetch when kid is present", async () => {
    const env: PlaidEnv = {
      PLAID_CLIENT_ID: "real_client",
      PLAID_SECRET: "real_secret",
      PLAID_JWKS_KEYS: JSON.stringify({ "kid-static": SAMPLE_KEY }),
    };
    const fetchImpl = vi.fn();
    const fetcher = buildJwksFetcher(env, { fetchImpl });

    const key = await fetcher("kid-static");

    expect(key).toEqual(SAMPLE_KEY);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("falls through to live fetch when static map has no entry for the kid", async () => {
    const env: PlaidEnv = {
      PLAID_CLIENT_ID: "real_client",
      PLAID_SECRET: "real_secret",
      PLAID_ENV: "production",
      PLAID_JWKS_KEYS: JSON.stringify({ "different-kid": SAMPLE_KEY }),
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(200, { key: SAMPLE_KEY }));
    const fetcher = buildJwksFetcher(env, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const key = await fetcher("kid-live-1");

    expect(key).toEqual(SAMPLE_KEY);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] ?? [];
    expect(url).toBe(
      "https://production.plaid.com/webhook_verification_key/get",
    );
    const body = JSON.parse((init as { body: string })?.body ?? "{}");
    expect(body).toEqual({
      client_id: "real_client",
      secret: "real_secret",
      key_id: "kid-live-1",
    });
  });

  it("calls live fetch when static map is absent entirely", async () => {
    const env: PlaidEnv = {
      PLAID_CLIENT_ID: "real_client",
      PLAID_SECRET: "real_secret",
      PLAID_ENV: "production",
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(200, { key: SAMPLE_KEY }));
    const fetcher = buildJwksFetcher(env, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const key = await fetcher("kid-live-1");

    expect(key).toEqual(SAMPLE_KEY);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("caches the fetched key — second call for same kid does NOT re-fetch", async () => {
    const env: PlaidEnv = {
      PLAID_CLIENT_ID: "real_client",
      PLAID_SECRET: "real_secret",
      PLAID_ENV: "production",
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(200, { key: SAMPLE_KEY }));
    const fetcher = buildJwksFetcher(env, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const first = await fetcher("kid-live-1");
    const second = await fetcher("kid-live-1");

    expect(first).toEqual(SAMPLE_KEY);
    expect(second).toEqual(SAMPLE_KEY);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("returns null when live fetch responds with non-2xx (Plaid auth fail / rate limit / etc.)", async () => {
    const env: PlaidEnv = {
      PLAID_CLIENT_ID: "real_client",
      PLAID_SECRET: "real_secret",
      PLAID_ENV: "production",
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(401, { error_code: "INVALID_API_KEYS" }),
      );
    const fetcher = buildJwksFetcher(env, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const key = await fetcher("kid-live-1");

    expect(key).toBeNull();
  });

  it("returns null when live fetch throws (network failure)", async () => {
    const env: PlaidEnv = {
      PLAID_CLIENT_ID: "real_client",
      PLAID_SECRET: "real_secret",
      PLAID_ENV: "production",
    };
    const fetchImpl = vi.fn().mockRejectedValueOnce(new Error("ECONNREFUSED"));
    const fetcher = buildJwksFetcher(env, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const key = await fetcher("kid-live-1");

    expect(key).toBeNull();
  });

  it("returns null when fetched body has no `key` field", async () => {
    const env: PlaidEnv = {
      PLAID_CLIENT_ID: "real_client",
      PLAID_SECRET: "real_secret",
      PLAID_ENV: "production",
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(200, { error_code: "KEY_NOT_FOUND" }),
      );
    const fetcher = buildJwksFetcher(env, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const key = await fetcher("kid-live-1");

    expect(key).toBeNull();
  });

  it("returns null when client credentials are missing (no PLAID_CLIENT_ID)", async () => {
    const env: PlaidEnv = {
      PLAID_SECRET: "real_secret",
      PLAID_ENV: "production",
    };
    const fetchImpl = vi.fn();
    const fetcher = buildJwksFetcher(env, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const key = await fetcher("kid-live-1");

    expect(key).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("uses sandbox endpoint when PLAID_ENV=sandbox", async () => {
    const env: PlaidEnv = {
      PLAID_CLIENT_ID: "sandbox_client",
      PLAID_SECRET: "sandbox_secret",
      PLAID_ENV: "sandbox",
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(200, { key: SAMPLE_KEY }));
    const fetcher = buildJwksFetcher(env, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await fetcher("kid-live-1");

    const [url] = fetchImpl.mock.calls[0] ?? [];
    expect(url).toBe("https://sandbox.plaid.com/webhook_verification_key/get");
  });

  it("returns null when static map JSON is malformed AND live fetch fails (closes the gap codex flagged)", async () => {
    const env: PlaidEnv = {
      PLAID_CLIENT_ID: "real_client",
      PLAID_SECRET: "real_secret",
      PLAID_ENV: "production",
      PLAID_JWKS_KEYS: "{not-valid-json",
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(500, { error: "internal" }));
    const fetcher = buildJwksFetcher(env, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const key = await fetcher("kid-live-1");

    expect(key).toBeNull();
    // malformed JSON falls through to live fetch, which also fails → null
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
