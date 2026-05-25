/**
 * Tests for GET + PATCH /api/account/profile.
 *
 * Critical invariants:
 *   - GET returns 401 without a session, 503 in stub mode
 *   - GET returns { needs_completion: true } when there's no profile
 *     row for a session (legacy magic-link customer)
 *   - PATCH rejects DOB updates per spec §3.5 (immutable)
 *   - PATCH rejects email/auth_user_id updates (handled by trigger
 *     on the DB side too, but the route never builds those into
 *     the patch object)
 *   - PATCH gates on status='active'
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

const extractMock = vi.fn();
vi.mock("@/lib/auth/extract-user", () => ({
  extractAuthenticatedUser: (...a: unknown[]) => extractMock(...a),
}));

// GET: from('customer_profiles').select().eq().maybeSingle()
const getMaybeSingleMock = vi.fn();
const getEqMock = vi.fn(() => ({ maybeSingle: getMaybeSingleMock }));
const getSelectMock = vi.fn(() => ({ eq: getEqMock }));

// PATCH: from('customer_profiles').update().eq().eq().select().maybeSingle()
const patchMaybeSingleMock = vi.fn();
const patchSelectChainMock = vi.fn(() => ({ maybeSingle: patchMaybeSingleMock }));
const patchEqStatusMock = vi.fn(() => ({ select: patchSelectChainMock }));
const patchEqAuthMock = vi.fn(() => ({ eq: patchEqStatusMock }));
const patchUpdateMock = vi.fn(() => ({ eq: patchEqAuthMock }));

const fromMock = vi.fn(() => ({ select: getSelectMock, update: patchUpdateMock }));
let serviceSupabaseReturn: unknown = { from: fromMock };
vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceSupabaseReturn,
  browserSupabase: () => null,
}));

const captureExceptionMock = vi.fn();
vi.mock("@/lib/sentry", async () => {
  const actual = await vi.importActual<typeof import("@/lib/sentry")>(
    "@/lib/sentry",
  );
  return { ...actual, captureException: (...a: unknown[]) => captureExceptionMock(...a) };
});

import { GET, PATCH } from "@/app/api/account/profile/route";

function makeGet(): import("next/server").NextRequest {
  return new Request("http://test.local/api/account/profile", {
    method: "GET",
    headers: new Headers(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

function makePatch(body: unknown): import("next/server").NextRequest {
  return new Request("http://test.local/api/account/profile", {
    method: "PATCH",
    headers: new Headers({ "content-type": "application/json" }),
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

describe("GET /api/account/profile", () => {
  beforeEach(() => {
    extractMock.mockReset();
    extractMock.mockResolvedValue({ kind: "ok", user: { id: "u1", email: "x@example.com" } });
    getMaybeSingleMock.mockReset();
    getEqMock.mockClear();
    getSelectMock.mockClear();
    fromMock.mockClear();
    captureExceptionMock.mockReset();
    serviceSupabaseReturn = { from: fromMock };
  });

  it("401 when no session", async () => {
    extractMock.mockResolvedValueOnce({ kind: "no_session" });
    const res = await GET(makeGet());
    expect(res.status).toBe(401);
  });

  it("503 when supabase unavailable", async () => {
    extractMock.mockResolvedValueOnce({ kind: "supabase_unavailable" });
    const res = await GET(makeGet());
    expect(res.status).toBe(503);
  });

  it("returns profile when row exists", async () => {
    getMaybeSingleMock.mockResolvedValueOnce({
      data: { id: "p1", email: "x@example.com", full_name: "X" },
      error: null,
    });
    const res = await GET(makeGet());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.profile).toMatchObject({ id: "p1", full_name: "X" });
  });

  it("returns needs_completion=true when no profile row exists (legacy magic-link customer)", async () => {
    getMaybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const res = await GET(makeGet());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.needs_completion).toBe(true);
    expect(body.profile).toBeNull();
  });

  it("500 + Sentry capture on lookup error", async () => {
    getMaybeSingleMock.mockResolvedValueOnce({
      data: null,
      error: { message: "db_down" },
    });
    const res = await GET(makeGet());
    expect(res.status).toBe(500);
    expect(captureExceptionMock).toHaveBeenCalled();
  });
});

describe("PATCH /api/account/profile", () => {
  beforeEach(() => {
    extractMock.mockReset();
    extractMock.mockResolvedValue({ kind: "ok", user: { id: "u1", email: "x@example.com" } });
    patchMaybeSingleMock.mockReset();
    patchMaybeSingleMock.mockResolvedValue({
      data: { id: "p1", full_name: "New" },
      error: null,
    });
    patchUpdateMock.mockClear();
    patchEqAuthMock.mockClear();
    patchEqStatusMock.mockClear();
    patchSelectChainMock.mockClear();
    fromMock.mockClear();
    captureExceptionMock.mockReset();
  });

  it("updates allowed fields + gates on status='active'", async () => {
    const res = await PATCH(makePatch({ full_name: "Updated Name" }));
    expect(res.status).toBe(200);
    expect(patchUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({ full_name: "Updated Name" }),
    );
    expect(patchEqAuthMock).toHaveBeenCalledWith("auth_user_id", "u1");
    expect(patchEqStatusMock).toHaveBeenCalledWith("status", "active");
  });

  it("silently strips date_of_birth — spec §3.5 immutability", async () => {
    await PATCH(
      makePatch({ date_of_birth: "1980-01-01", full_name: "Strip Test" }),
    );
    expect(patchUpdateMock).toHaveBeenCalledTimes(1);
    const calls = patchUpdateMock.mock.calls as unknown as Array<Array<unknown>>;
    const patchArg = calls[0][0] as Record<string, unknown>;
    expect(patchArg.full_name).toBe("Strip Test");
    expect(patchArg.date_of_birth).toBeUndefined();
  });

  it("400 invalid_body for malformed JSON", async () => {
    const res = await PATCH(makePatch("not-json"));
    expect(res.status).toBe(400);
  });

  it("400 no_changes when patch is empty (after strip)", async () => {
    // date_of_birth gets stripped; nothing else → empty patch
    const res = await PATCH(makePatch({ date_of_birth: "1980-01-01" }));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("no_changes");
  });

  it("400 profile_not_editable when DB returns 0 rows (account not active)", async () => {
    patchMaybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const res = await PATCH(makePatch({ full_name: "Real Name" }));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("profile_not_editable");
  });
});
