/**
 * Tests for POST /api/auth/forgot-password — uniform-response
 * invariant (spec §3.4 anti-enumeration).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { __resetRateLimitForTests } from "@/lib/rate-limit";

const sendPasswordResetEmailMock = vi.fn();
vi.mock("@/lib/email/account-password-reset", () => ({
  sendPasswordResetEmail: (...a: unknown[]) => sendPasswordResetEmailMock(...a),
}));

const buildPasswordResetUrlMock = vi.fn(
  (..._args: unknown[]) => "https://example.test/reset-password?token=stub",
);
vi.mock("@/lib/auth/account-server", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/auth/account-server")
  >("@/lib/auth/account-server");
  return {
    ...actual,
    buildPasswordResetUrl: (...a: unknown[]) => buildPasswordResetUrlMock(...a),
  };
});

const maybeSingleMock = vi.fn();
const eqMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const selectMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));
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
  return {
    ...actual,
    captureException: (...a: unknown[]) => captureExceptionMock(...a),
  };
});

import { POST, GET } from "@/app/api/auth/forgot-password/route";
import { FORGOT_PASSWORD_UNIFORM_MESSAGE } from "@/lib/auth/account-server";

function makeRequest(body: unknown, ip = "203.0.113.20"): import("next/server").NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    "x-forwarded-for": ip,
  });
  return new Request("http://test.local/api/auth/forgot-password", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

async function expectUniform(res: Response) {
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body).toEqual({ ok: true, message: FORGOT_PASSWORD_UNIFORM_MESSAGE });
}

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    maybeSingleMock.mockReset();
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    sendPasswordResetEmailMock.mockReset();
    sendPasswordResetEmailMock.mockResolvedValue({ ok: true, id: "stub:1" });
    buildPasswordResetUrlMock.mockClear();
    eqMock.mockClear();
    fromMock.mockClear();
    serviceSupabaseReturn = { from: fromMock };
    captureExceptionMock.mockReset();
  });
  afterEach(() => __resetRateLimitForTests());

  it("sends reset link when account is active", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { auth_user_id: "u1", full_name: "Dr. Curie", status: "active" },
      error: null,
    });
    const res = await POST(makeRequest({ email: "marie@radium.lab" }));
    await expectUniform(res);
    expect(sendPasswordResetEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "marie@radium.lab",
        resetUrl: expect.stringContaining("/reset-password?token="),
      }),
    );
  });

  it("sends reset link when account is pending (so the customer can recover even before confirming)", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: {
        auth_user_id: "u1",
        full_name: "Dr. Curie",
        status: "pending_email_verification",
      },
      error: null,
    });
    const res = await POST(makeRequest({ email: "marie@radium.lab" }));
    await expectUniform(res);
    expect(sendPasswordResetEmailMock).toHaveBeenCalled();
  });

  it("returns uniform body but does NOT send when no account exists", async () => {
    maybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const res = await POST(makeRequest({ email: "ghost@example.com" }));
    await expectUniform(res);
    expect(sendPasswordResetEmailMock).not.toHaveBeenCalled();
  });

  it("returns uniform body but does NOT send when account is suspended", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { auth_user_id: "u1", full_name: "X", status: "suspended" },
      error: null,
    });
    const res = await POST(makeRequest({ email: "x@example.com" }));
    await expectUniform(res);
    expect(sendPasswordResetEmailMock).not.toHaveBeenCalled();
  });

  it("returns uniform body for a malformed JSON body", async () => {
    const res = await POST(makeRequest("not-json"));
    await expectUniform(res);
  });

  it("returns uniform body for malformed email", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    await expectUniform(res);
    expect(sendPasswordResetEmailMock).not.toHaveBeenCalled();
  });

  it("returns uniform body when Supabase is unavailable", async () => {
    serviceSupabaseReturn = null;
    const res = await POST(makeRequest({ email: "marie@radium.lab" }));
    await expectUniform(res);
    expect(sendPasswordResetEmailMock).not.toHaveBeenCalled();
  });

  it("returns uniform body when DB lookup errors (logs Sentry)", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: null,
      error: { message: "db_down" },
    });
    const res = await POST(makeRequest({ email: "marie@radium.lab" }));
    await expectUniform(res);
    expect(captureExceptionMock).toHaveBeenCalled();
    expect(sendPasswordResetEmailMock).not.toHaveBeenCalled();
  });

  it("returns uniform body when email send throws (no rollback)", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { auth_user_id: "u1", full_name: "X", status: "active" },
      error: null,
    });
    sendPasswordResetEmailMock.mockRejectedValueOnce(new Error("resend_500"));
    const res = await POST(makeRequest({ email: "x@example.com" }));
    await expectUniform(res);
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("returns uniform body when rate-limited (per email cap 3/hr)", async () => {
    for (let i = 0; i < 3; i += 1) {
      const ok = await POST(
        makeRequest({ email: "spam@example.com" }, `203.0.113.${i + 1}`),
      );
      await expectUniform(ok);
    }
    maybeSingleMock.mockClear();
    const limited = await POST(
      makeRequest({ email: "spam@example.com" }, "203.0.113.99"),
    );
    await expectUniform(limited);
  });

  it("GET returns 405", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    expect(await res.json()).toEqual({ ok: true, message: "method_not_allowed" });
  });
});
