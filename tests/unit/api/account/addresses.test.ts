/**
 * Tests for GET + PUT /api/account/addresses.
 *
 * Critical invariants:
 *   - GET returns both rows; shipping_same_as_mailing=true when no
 *     shipping row exists
 *   - PUT upserts mailing always; shipping conditional
 *   - PUT with shipping_same_as_mailing=true DELETEs any existing
 *     shipping row (toggle round-trip is non-destructive in either direction)
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

const extractMock = vi.fn();
vi.mock("@/lib/auth/extract-user", () => ({
  extractAuthenticatedUser: (...a: unknown[]) => extractMock(...a),
}));

// Profile lookup: from('customer_profiles').select().eq().maybeSingle()
const profileMaybeSingleMock = vi.fn();
const profileEqMock = vi.fn(() => ({ maybeSingle: profileMaybeSingleMock }));
const profileSelectMock = vi.fn(() => ({ eq: profileEqMock }));

// GET addresses: from('customer_addresses').select().eq()
const addrEqMock = vi.fn();
const addrSelectMock = vi.fn(() => ({ eq: addrEqMock }));

// PUT addresses: from('customer_addresses').upsert(...)
const upsertMock = vi.fn();

// DELETE addresses: from('customer_addresses').delete().eq('profile_id', X).eq('kind', Y)
const deleteEq2Mock = vi.fn();
const deleteEq1Mock = vi.fn(() => ({ eq: deleteEq2Mock }));
const deleteMock = vi.fn(() => ({ eq: deleteEq1Mock }));

const fromMock = vi.fn((table: string) => {
  if (table === "customer_profiles") return { select: profileSelectMock };
  if (table === "customer_addresses") {
    return {
      select: addrSelectMock,
      upsert: upsertMock,
      delete: deleteMock,
    };
  }
  throw new Error(`unexpected table: ${table}`);
});
let serviceSupabaseReturn: unknown = { from: fromMock };
vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceSupabaseReturn,
  browserSupabase: () => null,
}));

const captureExceptionMock = vi.fn();
vi.mock("@/lib/sentry", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/sentry")>("@/lib/sentry");
  return {
    ...actual,
    captureException: (...a: unknown[]) => captureExceptionMock(...a),
  };
});

import { GET, PUT } from "@/app/api/account/addresses/route";

function makeGet(): import("next/server").NextRequest {
  return new Request("http://test.local/api/account/addresses", {
    method: "GET",
    headers: new Headers(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

function makePut(body: unknown): import("next/server").NextRequest {
  return new Request("http://test.local/api/account/addresses", {
    method: "PUT",
    headers: new Headers({ "content-type": "application/json" }),
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

const VALID_ADDR = {
  street1: "1 Main",
  city: "Boston",
  region: "MA",
  postal_code: "02101",
  country: "US",
};

describe("GET /api/account/addresses", () => {
  beforeEach(() => {
    extractMock.mockReset();
    extractMock.mockResolvedValue({
      kind: "ok",
      user: { id: "u1", email: "x@example.com" },
    });
    profileMaybeSingleMock.mockReset();
    profileMaybeSingleMock.mockResolvedValue({
      data: { id: "p1" },
      error: null,
    });
    addrEqMock.mockReset();
    addrEqMock.mockResolvedValue({ data: [], error: null });
    upsertMock.mockReset();
    upsertMock.mockResolvedValue({ error: null });
    deleteEq2Mock.mockReset();
    deleteEq2Mock.mockResolvedValue({ error: null });
    serviceSupabaseReturn = { from: fromMock };
    captureExceptionMock.mockReset();
  });

  it("returns empty + shipping_same=true when no addresses on file", async () => {
    const res = await GET(makeGet());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.mailing).toBeNull();
    expect(body.shipping).toBeNull();
    expect(body.shipping_same_as_mailing).toBe(true);
  });

  it("returns rows + shipping_same=false when shipping row present", async () => {
    addrEqMock.mockResolvedValueOnce({
      data: [
        { kind: "mailing", ...VALID_ADDR, street2: null },
        { kind: "shipping", ...VALID_ADDR, city: "Cambridge", street2: null },
      ],
      error: null,
    });
    const res = await GET(makeGet());
    const body = await res.json();
    expect(body.mailing.city).toBe("Boston");
    expect(body.shipping.city).toBe("Cambridge");
    expect(body.shipping_same_as_mailing).toBe(false);
  });

  it("returns shipping_same=true when only mailing exists", async () => {
    addrEqMock.mockResolvedValueOnce({
      data: [{ kind: "mailing", ...VALID_ADDR, street2: null }],
      error: null,
    });
    const res = await GET(makeGet());
    expect((await res.json()).shipping_same_as_mailing).toBe(true);
  });

  it("401 without session", async () => {
    extractMock.mockResolvedValueOnce({ kind: "no_session" });
    const res = await GET(makeGet());
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/account/addresses", () => {
  beforeEach(() => {
    extractMock.mockReset();
    extractMock.mockResolvedValue({
      kind: "ok",
      user: { id: "u1", email: "x@example.com" },
    });
    profileMaybeSingleMock.mockReset();
    profileMaybeSingleMock.mockResolvedValue({
      data: { id: "p1" },
      error: null,
    });
    upsertMock.mockReset();
    upsertMock.mockResolvedValue({ error: null });
    deleteEq2Mock.mockReset();
    deleteEq2Mock.mockResolvedValue({ error: null });
    deleteEq1Mock.mockClear();
    deleteMock.mockClear();
    serviceSupabaseReturn = { from: fromMock };
    captureExceptionMock.mockReset();
  });

  it("upserts mailing only when shipping_same_as_mailing=true and deletes any existing shipping", async () => {
    const res = await PUT(
      makePut({ mailing: VALID_ADDR, shipping_same_as_mailing: true }),
    );
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledTimes(1);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "mailing", city: "Boston" }),
      expect.objectContaining({ onConflict: "profile_id,kind" }),
    );
    // Delete shipping row called regardless of whether one existed
    expect(deleteMock).toHaveBeenCalled();
    expect(deleteEq1Mock).toHaveBeenCalledWith("profile_id", "p1");
    expect(deleteEq2Mock).toHaveBeenCalledWith("kind", "shipping");
  });

  it("upserts BOTH when shipping_same_as_mailing=false + shipping provided", async () => {
    const shippingAddr = { ...VALID_ADDR, city: "Cambridge" };
    const res = await PUT(
      makePut({
        mailing: VALID_ADDR,
        shipping_same_as_mailing: false,
        shipping: shippingAddr,
      }),
    );
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledTimes(2);
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it("400 invalid_body when shipping_same_as_mailing=false without a shipping payload", async () => {
    const res = await PUT(
      makePut({ mailing: VALID_ADDR, shipping_same_as_mailing: false }),
    );
    expect(res.status).toBe(400);
  });

  it("400 profile_not_found when no profile exists yet", async () => {
    profileMaybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const res = await PUT(
      makePut({ mailing: VALID_ADDR, shipping_same_as_mailing: true }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("profile_not_found");
  });

  it("500 on mailing upsert error", async () => {
    upsertMock.mockResolvedValueOnce({ error: { message: "db_500" } });
    const res = await PUT(
      makePut({ mailing: VALID_ADDR, shipping_same_as_mailing: true }),
    );
    expect(res.status).toBe(500);
    expect(captureExceptionMock).toHaveBeenCalled();
  });
});
