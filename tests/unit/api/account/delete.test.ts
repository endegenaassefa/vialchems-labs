/**
 * Tests for POST /api/account/delete.
 *
 * Critical invariants:
 *   - Requires fresh re-auth (codex P1 fix): bare { confirm:"DELETE" }
 *     without a password is rejected with 401 reauth_required.
 *   - Wrong password → 401 reauth_failed (no enumeration signal —
 *     same code as missing password).
 *   - Successful delete: archived_accounts insert + customer_profiles
 *     delete + auth.admin.deleteUser + best-effort email send.
 *   - No profile (legacy) → still archives a minimal envelope and
 *     deletes the auth user.
 *   - Rate-limit: 5/hr per IP + per email; 429 on excess.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { __resetRateLimitForTests } from "@/lib/rate-limit";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Codex P1 (checkpoint 6) fix: delete route uses a throwaway anon
// client for password re-verification — NOT the cached serviceSupabase().
// Mock @supabase/supabase-js.createClient at the source so the ephemeral
// client's signInWithPassword is observable.
const ephemeralSignInMock = vi.fn();
const ephemeralSignOutMock = vi.fn(() => Promise.resolve({ error: null }));
vi.mock("@supabase/supabase-js", async () => {
  const actual = await vi.importActual<typeof import("@supabase/supabase-js")>(
    "@supabase/supabase-js",
  );
  return {
    ...actual,
    createClient: vi.fn(() => ({
      auth: {
        signInWithPassword: ephemeralSignInMock,
        signOut: ephemeralSignOutMock,
      },
    })),
  };
});

const deleteUserMock = vi.fn();

const insertArchiveMock = vi.fn();

// load profile chain: from('customer_profiles').select(...).eq().maybeSingle()
const profileMaybeSingleMock = vi.fn();
const profileEqMock = vi.fn(() => ({ maybeSingle: profileMaybeSingleMock }));
const profileSelectMock = vi.fn(() => ({ eq: profileEqMock }));

// load addresses chain: from('customer_addresses').select(...).eq()
const addressesEqMock = vi.fn();
const addressesSelectMock = vi.fn(() => ({ eq: addressesEqMock }));

// delete profile chain: from('customer_profiles').delete().eq()
const deleteProfileEqMock = vi.fn();
const deleteProfileFn = vi.fn(() => ({ eq: deleteProfileEqMock }));

// from() dispatcher
const fromMock = vi.fn((table: string) => {
  if (table === "archived_accounts") return { insert: insertArchiveMock };
  if (table === "customer_profiles") {
    return {
      select: profileSelectMock,
      delete: deleteProfileFn,
    };
  }
  if (table === "customer_addresses") return { select: addressesSelectMock };
  throw new Error(`unexpected table: ${table}`);
});

let serviceSupabaseReturn: unknown = {
  auth: { admin: { deleteUser: deleteUserMock } },
  from: fromMock,
};
vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceSupabaseReturn,
  browserSupabase: () => null,
}));

const extractMock = vi.fn();
vi.mock("@/lib/auth/extract-user", () => ({
  extractAuthenticatedUser: (...a: unknown[]) => extractMock(...a),
}));

const sendDeletedEmailMock = vi.fn();
vi.mock("@/lib/email/account-deleted", () => ({
  sendAccountDeletedEmail: (...a: unknown[]) => sendDeletedEmailMock(...a),
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

import { POST, GET } from "@/app/api/account/delete/route";

function makeRequest(body: unknown, ip = "203.0.113.80"): import("next/server").NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    "x-forwarded-for": ip,
  });
  return new Request("http://test.local/api/account/delete", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/account/delete", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    // verifyPasswordWithEphemeralClient reads these env vars before
    // building the throwaway client.
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "stub-anon-key";
    extractMock.mockReset();
    extractMock.mockResolvedValue({
      kind: "ok",
      user: { id: "auth-uuid-1", email: "marie@radium.lab" },
    });
    ephemeralSignInMock.mockReset();
    ephemeralSignInMock.mockResolvedValue({
      data: { session: { access_token: "fresh" } },
      error: null,
    });
    ephemeralSignOutMock.mockClear();
    deleteUserMock.mockReset();
    deleteUserMock.mockResolvedValue({ error: null });
    insertArchiveMock.mockReset();
    insertArchiveMock.mockResolvedValue({ error: null });
    profileMaybeSingleMock.mockReset();
    profileMaybeSingleMock.mockResolvedValue({
      data: {
        id: "profile-1",
        email: "marie@radium.lab",
        phone: "+14155552671",
        full_name: "Dr. Curie",
        date_of_birth: "1950-11-07",
        research_org_type: "university",
        research_org_other: null,
        research_focus: "radium decay",
        status: "active",
        email_confirmed_at: "2026-01-01T00:00:00Z",
        created_at: "2026-01-01T00:00:00Z",
      },
      error: null,
    });
    addressesEqMock.mockReset();
    addressesEqMock.mockResolvedValue({
      data: [
        {
          kind: "mailing",
          street1: "1 Radium Lane",
          street2: null,
          city: "Paris",
          region: "IDF",
          postal_code: "75005",
          country: "FR",
        },
      ],
      error: null,
    });
    deleteProfileEqMock.mockReset();
    deleteProfileEqMock.mockResolvedValue({ error: null });
    profileEqMock.mockClear();
    profileSelectMock.mockClear();
    addressesSelectMock.mockClear();
    deleteProfileFn.mockClear();
    fromMock.mockClear();
    sendDeletedEmailMock.mockReset();
    sendDeletedEmailMock.mockResolvedValue({ ok: true, id: "stub:1" });
    captureExceptionMock.mockReset();
    serviceSupabaseReturn = {
      auth: { admin: { deleteUser: deleteUserMock } },
      from: fromMock,
    };
  });
  afterEach(() => __resetRateLimitForTests());

  it("returns 401 unauthorized when no session", async () => {
    extractMock.mockResolvedValueOnce({ kind: "no_session" });
    const res = await POST(makeRequest({ confirm: "DELETE", password: "x12345678901" }));
    expect(res.status).toBe(401);
    expect((await res.json()).code).toBe("unauthorized");
  });

  it("returns 503 supabase_unavailable in stub mode", async () => {
    extractMock.mockResolvedValueOnce({ kind: "supabase_unavailable" });
    const res = await POST(makeRequest({ confirm: "DELETE", password: "x12345678901" }));
    expect(res.status).toBe(503);
  });

  it("returns 400 confirmation_required when body lacks confirm", async () => {
    const res = await POST(makeRequest({ password: "x12345678901" }));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("confirmation_required");
  });

  it("returns 401 reauth_required when password is omitted (codex P1 fix)", async () => {
    const res = await POST(makeRequest({ confirm: "DELETE" }));
    expect(res.status).toBe(401);
    expect((await res.json()).code).toBe("reauth_required");
    expect(insertArchiveMock).not.toHaveBeenCalled();
    expect(deleteUserMock).not.toHaveBeenCalled();
  });

  it("returns 401 reauth_failed when password is wrong", async () => {
    ephemeralSignInMock.mockResolvedValueOnce({
      data: { session: null },
      error: { message: "Invalid credentials" },
    });
    const res = await POST(
      makeRequest({ confirm: "DELETE", password: "wrong-password-1" }),
    );
    expect(res.status).toBe(401);
    expect((await res.json()).code).toBe("reauth_failed");
    expect(insertArchiveMock).not.toHaveBeenCalled();
  });

  it("archives + deletes + emails on success", async () => {
    const res = await POST(
      makeRequest({ confirm: "DELETE", password: "correct-password-1" }),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe("account_deleted");
    expect(insertArchiveMock).toHaveBeenCalledWith(
      expect.objectContaining({
        original_profile_id: "profile-1",
        email: "marie@radium.lab",
        full_name: "Dr. Curie",
        archive_reason: "user_requested",
        raw_snapshot: expect.objectContaining({
          profile: expect.any(Object),
          addresses: expect.any(Array),
        }),
      }),
    );
    expect(deleteProfileEqMock).toHaveBeenCalledWith("id", "profile-1");
    expect(deleteUserMock).toHaveBeenCalledWith("auth-uuid-1");
    expect(sendDeletedEmailMock).toHaveBeenCalledWith({
      email: "marie@radium.lab",
      fullName: "Dr. Curie",
    });
  });

  it("includes the optional reason in archive_reason", async () => {
    await POST(
      makeRequest({
        confirm: "DELETE",
        password: "correct-password-1",
        reason: "switching providers",
      }),
    );
    expect(insertArchiveMock).toHaveBeenCalledWith(
      expect.objectContaining({ archive_reason: "switching providers" }),
    );
  });

  it("legacy path: archives a minimal envelope + deletes auth when no profile exists", async () => {
    profileMaybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const res = await POST(
      makeRequest({ confirm: "DELETE", password: "correct-password-1" }),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe("account_deleted");
    expect(insertArchiveMock).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: "(no profile)",
        date_of_birth: "1900-01-01",
      }),
    );
    expect(deleteUserMock).toHaveBeenCalledWith("auth-uuid-1");
  });

  it("returns 500 + captures Sentry on archive error", async () => {
    insertArchiveMock.mockResolvedValueOnce({
      error: { message: "archive_fail" },
    });
    const res = await POST(
      makeRequest({ confirm: "DELETE", password: "correct-password-1" }),
    );
    expect(res.status).toBe(500);
    expect(captureExceptionMock).toHaveBeenCalled();
    expect(deleteUserMock).not.toHaveBeenCalled();
  });

  it("still returns success when send-email throws (best-effort)", async () => {
    sendDeletedEmailMock.mockRejectedValueOnce(new Error("resend_500"));
    const res = await POST(
      makeRequest({ confirm: "DELETE", password: "correct-password-1" }),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe("account_deleted");
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("still returns success when auth-user delete fails (orphan acceptable; archived row exists)", async () => {
    deleteUserMock.mockResolvedValueOnce({
      error: { message: "auth_admin_500" },
    });
    const res = await POST(
      makeRequest({ confirm: "DELETE", password: "correct-password-1" }),
    );
    expect(res.status).toBe(200);
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("returns 429 + retry_after when rate-limited (per-email)", async () => {
    // email cap is 5/hr; trigger via 5 successful + 1 limited.
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(
        makeRequest(
          { confirm: "DELETE", password: "correct-password-1" },
          `203.0.113.${100 + i}`,
        ),
      );
      expect(ok.status).toBe(200);
    }
    const limited = await POST(
      makeRequest(
        { confirm: "DELETE", password: "correct-password-1" },
        "203.0.113.200",
      ),
    );
    expect(limited.status).toBe(429);
    expect((await limited.json()).code).toBe("rate_limited");
  });

  it("GET returns 405", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    expect((await res.json()).code).toBe("method_not_allowed");
  });
});
