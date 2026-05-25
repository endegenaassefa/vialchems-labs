/**
 * Tests for POST /api/account/complete-profile.
 *
 * Critical invariants:
 *   - Auth required (401 without session, 503 in stub mode)
 *   - email-mismatch check: body email MUST match session email
 *   - Refuses to overwrite an existing profile (400 profile_already_exists)
 *   - Inserts profile with status='active' (Supabase session = proof
 *     of email ownership)
 *   - Insert + addresses are wrapped: address-insert failure rolls
 *     back the profile
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

const extractMock = vi.fn();
vi.mock("@/lib/auth/extract-user", () => ({
  extractAuthenticatedUser: (...a: unknown[]) => extractMock(...a),
}));

// Lookup chain: from('customer_profiles').select().eq().maybeSingle()
const lookupMaybeSingleMock = vi.fn();
const lookupEqMock = vi.fn(() => ({ maybeSingle: lookupMaybeSingleMock }));
const lookupSelectMock = vi.fn(() => ({ eq: lookupEqMock }));

// Insert profile: from('customer_profiles').insert(...).select().single()
const insertSingleMock = vi.fn();
const insertSelectMock = vi.fn(() => ({ single: insertSingleMock }));
const insertProfileMock = vi.fn(() => ({ select: insertSelectMock }));

// Delete profile (rollback): from('customer_profiles').delete().eq()
const deleteEqMock = vi.fn();
const deleteProfileMock = vi.fn(() => ({ eq: deleteEqMock }));

// Insert addresses
const insertAddressesMock = vi.fn();

const fromMock = vi.fn((table: string) => {
  if (table === "customer_profiles") {
    return {
      select: lookupSelectMock,
      insert: insertProfileMock,
      delete: deleteProfileMock,
    };
  }
  if (table === "customer_addresses") {
    return { insert: insertAddressesMock };
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
  const actual = await vi.importActual<typeof import("@/lib/sentry")>(
    "@/lib/sentry",
  );
  return { ...actual, captureException: (...a: unknown[]) => captureExceptionMock(...a) };
});

import { POST, GET } from "@/app/api/account/complete-profile/route";

function dobFor(yearsAgo: number) {
  const t = new Date();
  return `${t.getFullYear() - yearsAgo}-01-01`;
}

const VALID_BODY = {
  full_name: "Dr. Marie Curie",
  email: "marie@radium.lab",
  date_of_birth: dobFor(50),
  research_org_type: "university",
  research_focus: "Investigating radioactive decay across heavy nuclei.",
  terms_accepted: true,
  mailing_address: {
    street1: "1 Radium Lane",
    city: "Paris",
    region: "IDF",
    postal_code: "75005",
    country: "FR",
  },
  shipping_same_as_mailing: true,
};

function makeRequest(body: unknown): import("next/server").NextRequest {
  return new Request("http://test.local/api/account/complete-profile", {
    method: "POST",
    headers: new Headers({ "content-type": "application/json" }),
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

describe("POST /api/account/complete-profile", () => {
  beforeEach(() => {
    extractMock.mockReset();
    extractMock.mockResolvedValue({
      kind: "ok",
      user: { id: "u1", email: "marie@radium.lab" },
    });
    lookupMaybeSingleMock.mockReset();
    lookupMaybeSingleMock.mockResolvedValue({ data: null, error: null });
    insertSingleMock.mockReset();
    insertSingleMock.mockResolvedValue({
      data: { id: "p1" },
      error: null,
    });
    insertProfileMock.mockClear();
    insertSelectMock.mockClear();
    deleteEqMock.mockReset();
    deleteEqMock.mockResolvedValue({ error: null });
    insertAddressesMock.mockReset();
    insertAddressesMock.mockResolvedValue({ error: null });
    fromMock.mockClear();
    serviceSupabaseReturn = { from: fromMock };
    captureExceptionMock.mockReset();
  });

  it("401 without session", async () => {
    extractMock.mockResolvedValueOnce({ kind: "no_session" });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(401);
  });

  it("503 in stub mode", async () => {
    extractMock.mockResolvedValueOnce({ kind: "supabase_unavailable" });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(503);
  });

  it("400 invalid_body on malformed JSON", async () => {
    const res = await POST(makeRequest("not-json"));
    expect(res.status).toBe(400);
  });

  it("400 invalid_body when zod parse fails", async () => {
    const res = await POST(
      makeRequest({ ...VALID_BODY, date_of_birth: dobFor(18) }),
    );
    expect(res.status).toBe(400);
  });

  it("400 email_mismatch when body email differs from session email", async () => {
    const res = await POST(
      makeRequest({ ...VALID_BODY, email: "different@example.com" }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("email_mismatch");
  });

  it("400 profile_already_exists when a profile exists for this user", async () => {
    lookupMaybeSingleMock.mockResolvedValueOnce({
      data: { id: "p-existing" },
      error: null,
    });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("profile_already_exists");
    expect(insertProfileMock).not.toHaveBeenCalled();
  });

  it("inserts profile + addresses with status='active' on success", async () => {
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(200);
    expect(insertProfileMock).toHaveBeenCalledWith(
      expect.objectContaining({
        auth_user_id: "u1",
        email: "marie@radium.lab",
        status: "active",
      }),
    );
    expect(insertAddressesMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ kind: "mailing", city: "Paris" }),
      ]),
    );
  });

  it("rolls back the profile when address insert fails", async () => {
    insertAddressesMock.mockResolvedValueOnce({
      error: { message: "addr_fail" },
    });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(500);
    expect(deleteEqMock).toHaveBeenCalledWith("id", "p1");
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("inserts shipping row when shipping_same_as_mailing=false", async () => {
    const res = await POST(
      makeRequest({
        ...VALID_BODY,
        shipping_same_as_mailing: false,
        shipping_address: {
          street1: "2 Faraday",
          city: "London",
          region: "England",
          postal_code: "WC1",
          country: "GB",
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertAddressesMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ kind: "mailing" }),
        expect.objectContaining({ kind: "shipping", city: "London" }),
      ]),
    );
  });

  it("GET returns 405", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
  });
});
