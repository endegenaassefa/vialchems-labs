/**
 * Tests for POST /api/auth/reset-password.
 *
 * Unlike forgot-password, this endpoint differentiates between
 * token-invalid and password-invalid (the customer needs to know
 * which one to fix), but still returns generic 400 codes.
 *
 * Critical invariants:
 *   - missing/expired/tampered token → 400 invalid_or_expired_token
 *   - replayed nonce → 400 invalid_or_expired_token (defence in depth)
 *   - password fails policy → 400 invalid_password with errors[]
 *   - rate-limited → 429 rate_limited + retry_after_seconds
 *   - suspended profile → 400 invalid_or_expired_token (don't differentiate)
 *   - Supabase updateUserById error → 500 internal_error
 *   - success → 200 password_updated AND nonce stamped
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { __resetRateLimitForTests } from "@/lib/rate-limit";
import { signAccountEmailToken } from "@/lib/auth/account-email-token";

const TEST_SECRET = "reset-password-test-secret-1234567890";

const updateUserByIdMock = vi.fn();
const maybeSingleMock = vi.fn();
const eqLookupMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const selectMock = vi.fn(() => ({ eq: eqLookupMock }));
const eqUpdateMock = vi.fn();
const updateMock = vi.fn(() => ({ eq: eqUpdateMock }));
const fromMock = vi.fn(() => ({ select: selectMock, update: updateMock }));
let serviceSupabaseReturn: unknown = {
  auth: { admin: { updateUserById: updateUserByIdMock } },
  from: fromMock,
};
vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceSupabaseReturn,
  browserSupabase: () => null,
}));

const captureExceptionMock = vi.fn();
vi.mock("@/lib/sentry", async () => {
  const actual = await vi.importActual<typeof import("@/lib/sentry")>(
    "@/lib/sentry",
  );
  return {
    ...actual,
    captureException: (...a: unknown[]) => captureExceptionMock(...a),
  };
});

import { POST, GET } from "@/app/api/auth/reset-password/route";

function makeRequest(body: unknown, ip = "203.0.113.30"): import("next/server").NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    "x-forwarded-for": ip,
  });
  return new Request("http://test.local/api/auth/reset-password", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

function freshToken(overrides: { ttlSeconds?: number; userId?: string; purpose?: "confirm-email" | "password-reset" | "email-change" } = {}) {
  process.env.ACCOUNT_EMAIL_TOKEN_SECRET = TEST_SECRET;
  return signAccountEmailToken(
    {
      purpose: overrides.purpose ?? "password-reset",
      userId: overrides.userId ?? "user-uuid-1",
      email: "marie@radium.lab",
    },
    { ttlSeconds: overrides.ttlSeconds ?? 3600 },
  );
}

const VALID_PASSWORD = "Vialchem!Lab42-mainline";

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET = TEST_SECRET;
    updateUserByIdMock.mockReset();
    updateUserByIdMock.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    maybeSingleMock.mockReset();
    maybeSingleMock.mockResolvedValue({
      data: {
        id: "profile-1",
        last_used_reset_nonce: null,
        status: "active",
      },
      error: null,
    });
    eqUpdateMock.mockReset();
    eqUpdateMock.mockResolvedValue({ error: null });
    eqLookupMock.mockClear();
    selectMock.mockClear();
    updateMock.mockClear();
    fromMock.mockClear();
    captureExceptionMock.mockReset();
    serviceSupabaseReturn = {
      auth: { admin: { updateUserById: updateUserByIdMock } },
      from: fromMock,
    };
  });
  afterEach(() => {
    __resetRateLimitForTests();
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET;
  });

  it("updates password + stamps nonce when token + payload are valid", async () => {
    const token = freshToken();
    const res = await POST(
      makeRequest({
        token,
        password: VALID_PASSWORD,
        confirm_password: VALID_PASSWORD,
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, message: "password_updated" });
    expect(updateUserByIdMock).toHaveBeenCalledWith("user-uuid-1", {
      password: VALID_PASSWORD,
    });
    // Nonce stamp
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        last_used_reset_nonce: expect.any(String),
      }),
    );
    expect(eqUpdateMock).toHaveBeenCalledWith("id", "profile-1");
  });

  it("rejects malformed JSON with 400 invalid_body", async () => {
    const res = await POST(makeRequest("not-json"));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_body");
  });

  it("rejects missing token with 400 invalid_or_expired_token", async () => {
    const res = await POST(
      makeRequest({ password: VALID_PASSWORD, confirm_password: VALID_PASSWORD }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_or_expired_token");
  });

  it("rejects tampered token with 400 invalid_or_expired_token", async () => {
    const token = freshToken();
    const tampered = `${token.slice(0, -8)}deadbeef`;
    const res = await POST(
      makeRequest({
        token: tampered,
        password: VALID_PASSWORD,
        confirm_password: VALID_PASSWORD,
      }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_or_expired_token");
    expect(updateUserByIdMock).not.toHaveBeenCalled();
  });

  it("rejects a confirm-email-purpose token used here (purpose mismatch)", async () => {
    const token = freshToken({ purpose: "confirm-email" });
    const res = await POST(
      makeRequest({
        token,
        password: VALID_PASSWORD,
        confirm_password: VALID_PASSWORD,
      }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_or_expired_token");
  });

  it("rejects weak password with 400 invalid_password + errors", async () => {
    const token = freshToken();
    const res = await POST(
      makeRequest({
        token,
        password: "weak",
        confirm_password: "weak",
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("invalid_password");
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.errors.length).toBeGreaterThan(0);
  });

  it("rejects mismatched confirm_password with 400 invalid_password", async () => {
    const token = freshToken();
    const res = await POST(
      makeRequest({
        token,
        password: VALID_PASSWORD,
        confirm_password: `${VALID_PASSWORD}X`,
      }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_password");
  });

  it("rejects replayed nonce with 400 invalid_or_expired_token (defence in depth)", async () => {
    const token = freshToken();
    // Pre-set the lookup to return THIS token's nonce as already-used.
    // Decoding the nonce requires the same payload — easier to seed
    // with a known nonce by extracting it after sign.
    const [encoded] = token.split(".");
    const payload = JSON.parse(Buffer.from(encoded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8"));
    maybeSingleMock.mockResolvedValueOnce({
      data: {
        id: "profile-1",
        last_used_reset_nonce: payload.nonce,
        status: "active",
      },
      error: null,
    });
    const res = await POST(
      makeRequest({
        token,
        password: VALID_PASSWORD,
        confirm_password: VALID_PASSWORD,
      }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_or_expired_token");
    expect(updateUserByIdMock).not.toHaveBeenCalled();
  });

  it("rejects suspended account with 400 invalid_or_expired_token (don't differentiate)", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { id: "profile-1", last_used_reset_nonce: null, status: "suspended" },
      error: null,
    });
    const token = freshToken();
    const res = await POST(
      makeRequest({
        token,
        password: VALID_PASSWORD,
        confirm_password: VALID_PASSWORD,
      }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_or_expired_token");
  });

  it("rejects missing profile (orphan token) with 400 invalid_or_expired_token", async () => {
    maybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const token = freshToken();
    const res = await POST(
      makeRequest({
        token,
        password: VALID_PASSWORD,
        confirm_password: VALID_PASSWORD,
      }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_or_expired_token");
  });

  it("returns 500 internal_error when DB lookup errors", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: null,
      error: { message: "db_down" },
    });
    const token = freshToken();
    const res = await POST(
      makeRequest({
        token,
        password: VALID_PASSWORD,
        confirm_password: VALID_PASSWORD,
      }),
    );
    expect(res.status).toBe(500);
    expect((await res.json()).code).toBe("internal_error");
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("returns 500 internal_error when supabase.auth.admin.updateUserById errors", async () => {
    updateUserByIdMock.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "auth_500" },
    });
    const token = freshToken();
    const res = await POST(
      makeRequest({
        token,
        password: VALID_PASSWORD,
        confirm_password: VALID_PASSWORD,
      }),
    );
    expect(res.status).toBe(500);
    expect((await res.json()).code).toBe("internal_error");
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("returns 200 success even if nonce-stamp errors (auth password is already updated; non-fatal)", async () => {
    eqUpdateMock.mockResolvedValueOnce({ error: { message: "stamp_err" } });
    const token = freshToken();
    const res = await POST(
      makeRequest({
        token,
        password: VALID_PASSWORD,
        confirm_password: VALID_PASSWORD,
      }),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe("password_updated");
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("returns 429 + retry_after_seconds when rate-limited (per IP cap 10/hr)", async () => {
    // Send 10 requests from the same IP with DIFFERENT signed tokens
    // (different userIds = different per-email buckets) so only the
    // IP gate trips, not the per-email cap of 5/hr.
    for (let i = 0; i < 10; i += 1) {
      const token = signAccountEmailToken(
        {
          purpose: "password-reset",
          userId: `user-uuid-${i}`,
          email: `reset-${i}@example.com`,
        },
        { ttlSeconds: 3600 },
      );
      const ok = await POST(
        makeRequest(
          {
            token,
            password: VALID_PASSWORD,
            confirm_password: VALID_PASSWORD,
          },
          "203.0.113.55",
        ),
      );
      expect(ok.status).toBe(200);
    }
    const token = signAccountEmailToken(
      {
        purpose: "password-reset",
        userId: "user-uuid-final",
        email: "reset-final@example.com",
      },
      { ttlSeconds: 3600 },
    );
    const limited = await POST(
      makeRequest(
        {
          token,
          password: VALID_PASSWORD,
          confirm_password: VALID_PASSWORD,
        },
        "203.0.113.55",
      ),
    );
    expect(limited.status).toBe(429);
    const body = await limited.json();
    expect(body.code).toBe("rate_limited");
    expect(body.retry_after_seconds).toBeGreaterThan(0);
  });

  it("returns 200 (stub) in Supabase-unavailable mode", async () => {
    serviceSupabaseReturn = null;
    const token = freshToken();
    const res = await POST(
      makeRequest({
        token,
        password: VALID_PASSWORD,
        confirm_password: VALID_PASSWORD,
      }),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe("password_updated");
  });

  it("GET returns 405", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    expect((await res.json()).code).toBe("method_not_allowed");
  });
});
