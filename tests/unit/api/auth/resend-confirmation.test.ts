/**
 * Tests for POST /api/auth/resend-confirmation — uniform-response
 * invariant + the gate that limits resend to pending accounts only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { __resetRateLimitForTests } from "@/lib/rate-limit";

const sendAccountConfirmEmailMock = vi.fn();
vi.mock("@/lib/email/account-email-confirm", () => ({
  sendAccountConfirmEmail: (...a: unknown[]) =>
    sendAccountConfirmEmailMock(...a),
}));

const buildConfirmEmailUrlMock = vi.fn(
  (..._args: unknown[]) => "https://example.test/auth/confirm-email?token=stub",
);
vi.mock("@/lib/auth/account-server", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/auth/account-server")
  >("@/lib/auth/account-server");
  return {
    ...actual,
    buildConfirmEmailUrl: (...a: unknown[]) => buildConfirmEmailUrlMock(...a),
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
  const actual =
    await vi.importActual<typeof import("@/lib/sentry")>("@/lib/sentry");
  return {
    ...actual,
    captureException: (...a: unknown[]) => captureExceptionMock(...a),
  };
});

import { POST, GET } from "@/app/api/auth/resend-confirmation/route";
import { RESEND_CONFIRM_UNIFORM_MESSAGE } from "@/lib/auth/account-server";

function makeRequest(
  body: unknown,
  ip = "203.0.113.50",
): import("next/server").NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    "x-forwarded-for": ip,
  });
  return new Request("http://test.local/api/auth/resend-confirmation", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

async function expectUniform(res: Response) {
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body).toEqual({ ok: true, message: RESEND_CONFIRM_UNIFORM_MESSAGE });
}

describe("POST /api/auth/resend-confirmation", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    maybeSingleMock.mockReset();
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    sendAccountConfirmEmailMock.mockReset();
    sendAccountConfirmEmailMock.mockResolvedValue({ ok: true, id: "stub:1" });
    buildConfirmEmailUrlMock.mockClear();
    eqMock.mockClear();
    selectMock.mockClear();
    fromMock.mockClear();
    serviceSupabaseReturn = { from: fromMock };
    captureExceptionMock.mockReset();
  });
  afterEach(() => __resetRateLimitForTests());

  it("sends a fresh link when the account is pending", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: {
        auth_user_id: "auth-uuid-1",
        full_name: "Dr. Curie",
        status: "pending_email_verification",
      },
      error: null,
    });
    const res = await POST(makeRequest({ email: "marie@radium.lab" }));
    await expectUniform(res);
    expect(sendAccountConfirmEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "marie@radium.lab",
        fullName: "Dr. Curie",
      }),
    );
  });

  it("returns uniform body but DOES NOT send when account is already active", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: {
        auth_user_id: "auth-uuid-1",
        full_name: "Dr. Curie",
        status: "active",
      },
      error: null,
    });
    const res = await POST(makeRequest({ email: "marie@radium.lab" }));
    await expectUniform(res);
    expect(sendAccountConfirmEmailMock).not.toHaveBeenCalled();
  });

  it("returns uniform body when no account matches the email", async () => {
    maybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const res = await POST(makeRequest({ email: "ghost@example.com" }));
    await expectUniform(res);
    expect(sendAccountConfirmEmailMock).not.toHaveBeenCalled();
  });

  it("returns uniform body for malformed JSON", async () => {
    const res = await POST(makeRequest("not-json"));
    await expectUniform(res);
    expect(sendAccountConfirmEmailMock).not.toHaveBeenCalled();
  });

  it("returns uniform body for malformed email", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    await expectUniform(res);
    expect(sendAccountConfirmEmailMock).not.toHaveBeenCalled();
  });

  it("returns uniform body when Supabase is unavailable", async () => {
    serviceSupabaseReturn = null;
    const res = await POST(makeRequest({ email: "marie@radium.lab" }));
    await expectUniform(res);
    expect(sendAccountConfirmEmailMock).not.toHaveBeenCalled();
  });

  it("returns uniform body when send throws (no rollback)", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: {
        auth_user_id: "auth-uuid-1",
        full_name: "Dr. Curie",
        status: "pending_email_verification",
      },
      error: null,
    });
    sendAccountConfirmEmailMock.mockRejectedValueOnce(new Error("resend_500"));
    const res = await POST(makeRequest({ email: "marie@radium.lab" }));
    await expectUniform(res);
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("returns uniform body when rate-limited (per email)", async () => {
    // EMAIL cap is 3/hr.
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
    const body = await res.json();
    expect(body).toEqual({ ok: true, message: "method_not_allowed" });
  });
});
