/**
 * Tests for the /auth/confirm-email landing logic.
 *
 * The page is a server component but the branching lives in
 * `processConfirmation()` (lib/auth/account-server.ts) so we can
 * exercise every branch — valid token, expired, tampered, wrong
 * purpose, Supabase down, activation throws — without rendering React.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { signAccountEmailToken } from "@/lib/auth/account-email-token";

const TEST_SECRET = "confirm-email-test-secret-1234567890";

// Mock the supabase service client. The processConfirmation function
// calls markEmailConfirmed (auth.admin.updateUserById) +
// activateProfile (.from(...).update(...).eq(...)), both implemented
// against the supabase client returned here.
const updateUserByIdMock = vi.fn();
const eqMock = vi.fn();
const updateMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ update: updateMock }));
const supabaseStub = {
  auth: { admin: { updateUserById: updateUserByIdMock } },
  from: fromMock,
};
let serviceSupabaseReturn: unknown = supabaseStub;
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

import { processConfirmation } from "@/lib/auth/account-server";

function freshToken(overrides: { purpose?: "confirm-email" | "password-reset" | "email-change" } = {}) {
  process.env.ACCOUNT_EMAIL_TOKEN_SECRET = TEST_SECRET;
  return signAccountEmailToken(
    {
      purpose: overrides.purpose ?? "confirm-email",
      userId: "user-uuid-1",
      email: "marie@radium.lab",
    },
    { ttlSeconds: 3600 },
  );
}

describe("processConfirmation", () => {
  beforeEach(() => {
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET = TEST_SECRET;
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS;
    updateUserByIdMock.mockReset();
    updateUserByIdMock.mockResolvedValue({ error: null, data: { user: { id: "user-uuid-1" } } });
    eqMock.mockReset();
    eqMock.mockResolvedValue({ error: null });
    updateMock.mockClear();
    fromMock.mockClear();
    captureExceptionMock.mockReset();
    serviceSupabaseReturn = supabaseStub;
  });
  afterEach(() => {
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET;
    delete process.env.ACCOUNT_EMAIL_TOKEN_SECRET_PREVIOUS;
  });

  it("returns ok=false when token is undefined", async () => {
    const r = await processConfirmation(undefined);
    expect(r).toEqual({ ok: false });
    expect(updateUserByIdMock).not.toHaveBeenCalled();
  });

  it("returns ok=false when token is empty string", async () => {
    const r = await processConfirmation("");
    expect(r).toEqual({ ok: false });
  });

  it("returns ok=false when token is malformed (no dot)", async () => {
    const r = await processConfirmation("notarealtoken");
    expect(r).toEqual({ ok: false });
  });

  it("returns ok=false when signature is tampered", async () => {
    const token = freshToken();
    const tampered = `${token.slice(0, -8)}deadbeef`;
    const r = await processConfirmation(tampered);
    expect(r).toEqual({ ok: false });
    expect(updateUserByIdMock).not.toHaveBeenCalled();
  });

  it("returns ok=false on wrong purpose (password-reset token)", async () => {
    const token = freshToken({ purpose: "password-reset" });
    const r = await processConfirmation(token);
    expect(r).toEqual({ ok: false });
  });

  it("returns ok=true + email on a valid token + activates the profile", async () => {
    const token = freshToken();
    const r = await processConfirmation(token);
    expect(r).toEqual({ ok: true, email: "marie@radium.lab" });
    expect(updateUserByIdMock).toHaveBeenCalledWith("user-uuid-1", {
      email_confirm: true,
    });
    expect(fromMock).toHaveBeenCalledWith("customer_profiles");
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: "active" }),
    );
    expect(eqMock).toHaveBeenCalledWith("auth_user_id", "user-uuid-1");
  });

  it("returns ok=true (stub-mode success) when Supabase isn't configured", async () => {
    serviceSupabaseReturn = null;
    const token = freshToken();
    const r = await processConfirmation(token);
    expect(r).toEqual({ ok: true, email: "marie@radium.lab" });
    expect(updateUserByIdMock).not.toHaveBeenCalled();
  });

  it("returns ok=false (and captures Sentry) when auth.admin.updateUserById errors", async () => {
    updateUserByIdMock.mockResolvedValueOnce({ error: { message: "auth_admin_503" }, data: { user: null } });
    const token = freshToken();
    const r = await processConfirmation(token);
    expect(r).toEqual({ ok: false });
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("returns ok=false (and captures Sentry) when profile update errors", async () => {
    eqMock.mockResolvedValueOnce({ error: { message: "profile_update_failed" } });
    const token = freshToken();
    const r = await processConfirmation(token);
    expect(r).toEqual({ ok: false });
    expect(captureExceptionMock).toHaveBeenCalled();
  });
});
