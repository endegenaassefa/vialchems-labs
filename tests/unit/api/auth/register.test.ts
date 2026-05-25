/**
 * Tests for POST /api/auth/register — uniform-response + uniqueness.
 *
 * The route must return an IDENTICAL 200 body regardless of branch
 * taken (per spec §3.7 anti-enumeration). Specifically verify:
 *   • new email + valid payload → creates auth user + profile, sends email
 *   • email already on an active profile → no auth user created
 *   • email already on a pending profile → no auth user created
 *   • email on an archived profile → fresh registration succeeds
 *   • malformed body → uniform 200
 *   • missing fields → uniform 200
 *   • rate-limited (per IP and per email) → uniform 200
 *   • Supabase unavailable → uniform 200
 *   • createAuthUser throws → uniform 200 + Sentry capture
 *   • insertProfileWithAddresses throws → uniform 200 + auth user rollback
 *   • sendAccountConfirmEmail throws → uniform 200 (no rollback)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { __resetRateLimitForTests } from "@/lib/rate-limit";

// ---------------------------------------------------------------------------
// Stub the heavy collaborators BEFORE importing the route.
// ---------------------------------------------------------------------------

const findAccountByEmailMock = vi.fn();
const createAuthUserMock = vi.fn();
const deleteAuthUserMock = vi.fn();
const insertProfileWithAddressesMock = vi.fn();
const buildConfirmEmailUrlMock = vi.fn(
  (..._args: unknown[]) => "https://example.test/auth/confirm-email?token=stub",
);

vi.mock("@/lib/auth/account-server", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/auth/account-server")
  >("@/lib/auth/account-server");
  return {
    ...actual,
    findAccountByEmail: (...a: unknown[]) => findAccountByEmailMock(...a),
    createAuthUser: (...a: unknown[]) => createAuthUserMock(...a),
    deleteAuthUser: (...a: unknown[]) => deleteAuthUserMock(...a),
    insertProfileWithAddresses: (...a: unknown[]) => insertProfileWithAddressesMock(...a),
    buildConfirmEmailUrl: (...a: unknown[]) => buildConfirmEmailUrlMock(...a),
  };
});

const sendAccountConfirmEmailMock = vi.fn();
vi.mock("@/lib/email/account-email-confirm", () => ({
  sendAccountConfirmEmail: (...a: unknown[]) => sendAccountConfirmEmailMock(...a),
}));

const serviceSupabaseStub = { __stub: true };
let serviceSupabaseReturn: unknown = serviceSupabaseStub;
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

import { POST, GET } from "@/app/api/auth/register/route";
import { REGISTER_UNIFORM_MESSAGE } from "@/lib/auth/account-server";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dobFor(yearsAgo: number) {
  const t = new Date();
  return `${t.getFullYear() - yearsAgo}-01-01`;
}

const validBody = (overrides: Partial<Record<string, unknown>> = {}) => ({
  full_name: "Dr. Marie Curie",
  email: "marie@radium.lab",
  phone: "+14155552671",
  date_of_birth: dobFor(50),
  research_org_type: "university",
  research_focus: "Investigating radioactive decay across heavy nuclei.",
  password: "Vialchem!Lab42-mainline",
  confirm_password: "Vialchem!Lab42-mainline",
  terms_accepted: true,
  mailing_address: {
    street1: "1 Radium Lane",
    city: "Paris",
    region: "Île-de-France",
    postal_code: "75005",
    country: "FR",
  },
  shipping_same_as_mailing: true,
  ...overrides,
});

function makeRequest(body: unknown, ip = "203.0.113.10"): import("next/server").NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    "x-forwarded-for": ip,
  });
  return new Request("http://test.local/api/auth/register", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

async function expectUniform(res: Response) {
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body).toEqual({ ok: true, message: REGISTER_UNIFORM_MESSAGE });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    findAccountByEmailMock.mockReset();
    findAccountByEmailMock.mockResolvedValue({ kind: "none" });
    createAuthUserMock.mockReset();
    createAuthUserMock.mockResolvedValue({ id: "auth-uuid-1" });
    deleteAuthUserMock.mockReset();
    deleteAuthUserMock.mockResolvedValue(undefined);
    insertProfileWithAddressesMock.mockReset();
    insertProfileWithAddressesMock.mockResolvedValue({ profileId: "profile-uuid-1" });
    buildConfirmEmailUrlMock.mockReset();
    buildConfirmEmailUrlMock.mockReturnValue("https://example.test/auth/confirm-email?token=stub");
    sendAccountConfirmEmailMock.mockReset();
    sendAccountConfirmEmailMock.mockResolvedValue({ ok: true, id: "stub:1" });
    captureExceptionMock.mockReset();
    serviceSupabaseReturn = serviceSupabaseStub;
  });
  afterEach(() => __resetRateLimitForTests());

  it("creates auth user + profile + sends confirmation when email is new", async () => {
    const res = await POST(makeRequest(validBody()));
    await expectUniform(res);
    expect(createAuthUserMock).toHaveBeenCalledTimes(1);
    expect(insertProfileWithAddressesMock).toHaveBeenCalledTimes(1);
    expect(sendAccountConfirmEmailMock).toHaveBeenCalledTimes(1);
    expect(sendAccountConfirmEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "marie@radium.lab",
        fullName: "Dr. Marie Curie",
        confirmUrl: expect.stringContaining("/auth/confirm-email?token="),
      }),
    );
  });

  it("returns SAME uniform body when email is on an active profile (no auth user created)", async () => {
    findAccountByEmailMock.mockResolvedValueOnce({
      kind: "active",
      profileId: "p1",
      authUserId: "u1",
    });
    const res = await POST(makeRequest(validBody()));
    await expectUniform(res);
    expect(createAuthUserMock).not.toHaveBeenCalled();
    expect(insertProfileWithAddressesMock).not.toHaveBeenCalled();
    expect(sendAccountConfirmEmailMock).not.toHaveBeenCalled();
  });

  it("returns SAME uniform body when email is on a pending profile (no duplicate auth user)", async () => {
    findAccountByEmailMock.mockResolvedValueOnce({
      kind: "pending",
      profileId: "p1",
      authUserId: "u1",
    });
    const res = await POST(makeRequest(validBody()));
    await expectUniform(res);
    expect(createAuthUserMock).not.toHaveBeenCalled();
  });

  it("registers fresh when email is on an archived profile (uniqueness slot freed)", async () => {
    findAccountByEmailMock.mockResolvedValueOnce({ kind: "archived" });
    const res = await POST(makeRequest(validBody()));
    await expectUniform(res);
    expect(createAuthUserMock).toHaveBeenCalledTimes(1);
    expect(insertProfileWithAddressesMock).toHaveBeenCalledTimes(1);
  });

  it("returns 200 + uniform body for a malformed JSON body", async () => {
    const res = await POST(makeRequest("not-json"));
    await expectUniform(res);
    expect(createAuthUserMock).not.toHaveBeenCalled();
  });

  it("returns 200 + uniform body for missing fields (does not 400)", async () => {
    const res = await POST(makeRequest({ email: "missing@example.com" }));
    await expectUniform(res);
    expect(createAuthUserMock).not.toHaveBeenCalled();
  });

  it("returns 200 + uniform body for a sub-21 DOB (does not echo validation error)", async () => {
    const res = await POST(
      makeRequest(validBody({ date_of_birth: dobFor(18) })),
    );
    await expectUniform(res);
    expect(createAuthUserMock).not.toHaveBeenCalled();
  });

  it("returns 200 + uniform body when password mismatch", async () => {
    const res = await POST(
      makeRequest(validBody({ confirm_password: "Different!Lab42-mainline" })),
    );
    await expectUniform(res);
    expect(createAuthUserMock).not.toHaveBeenCalled();
  });

  it("returns 200 + uniform body when rate-limited (per IP)", async () => {
    // register IP cap is 5/hr. Fire 5 from one IP, expect a 6th to be limited
    // but still show the same shape — using different emails so the per-email
    // gate doesn't trip first.
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(
        makeRequest(validBody({ email: `dup${i}@example.com` })),
      );
      await expectUniform(ok);
    }
    findAccountByEmailMock.mockClear();
    const limited = await POST(
      makeRequest(validBody({ email: "sixth@example.com" })),
    );
    await expectUniform(limited);
    // findAccountByEmail should NOT have been called on the rate-limited
    // request — gate fires before the lookup.
    expect(findAccountByEmailMock).not.toHaveBeenCalled();
  });

  it("returns 200 + uniform body when rate-limited (per email)", async () => {
    // register EMAIL cap is 2/hr. Fire 2 from different IPs with the same
    // email; the 3rd should be limited.
    for (let i = 0; i < 2; i += 1) {
      const ok = await POST(
        makeRequest(validBody({ email: "spam-target@example.com" }), `203.0.113.${i + 1}`),
      );
      await expectUniform(ok);
    }
    const limited = await POST(
      makeRequest(validBody({ email: "spam-target@example.com" }), "203.0.113.99"),
    );
    await expectUniform(limited);
  });

  it("returns 200 + uniform body when Supabase is unavailable (stub mode)", async () => {
    serviceSupabaseReturn = null;
    const res = await POST(makeRequest(validBody()));
    await expectUniform(res);
    expect(createAuthUserMock).not.toHaveBeenCalled();
  });

  it("returns 200 + uniform body when createAuthUser throws (logged to Sentry)", async () => {
    createAuthUserMock.mockRejectedValueOnce(new Error("email_taken_in_auth"));
    const res = await POST(makeRequest(validBody()));
    await expectUniform(res);
    expect(captureExceptionMock).toHaveBeenCalled();
    expect(insertProfileWithAddressesMock).not.toHaveBeenCalled();
  });

  it("rolls back the auth user when profile insert fails", async () => {
    insertProfileWithAddressesMock.mockRejectedValueOnce(
      new Error("profile_insert_failed"),
    );
    const res = await POST(makeRequest(validBody()));
    await expectUniform(res);
    expect(deleteAuthUserMock).toHaveBeenCalledWith(
      expect.anything(),
      "auth-uuid-1",
    );
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("returns 200 + uniform body when sendAccountConfirmEmail throws (no rollback)", async () => {
    sendAccountConfirmEmailMock.mockRejectedValueOnce(new Error("resend_500"));
    const res = await POST(makeRequest(validBody()));
    await expectUniform(res);
    // No rollback when the email send fails — the account is real and
    // the customer can request a fresh link.
    expect(deleteAuthUserMock).not.toHaveBeenCalled();
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("normalises email to lowercase before lookup + insert", async () => {
    await POST(makeRequest(validBody({ email: "MARIE@Radium.LAB" })));
    expect(findAccountByEmailMock).toHaveBeenCalledWith(
      expect.anything(),
      "marie@radium.lab",
    );
    expect(createAuthUserMock).toHaveBeenCalledWith(
      expect.anything(),
      "marie@radium.lab",
      expect.any(String),
    );
  });

  it("GET returns 405 with a flat ok-shaped body", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const body = await res.json();
    expect(body).toEqual({ ok: true, message: "method_not_allowed" });
  });
});
