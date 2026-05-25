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

// Mock the supabase service client. processConfirmation calls
// markEmailConfirmed (auth.admin.updateUserById) + activateProfile
// (.from(...).update(...).eq('auth_user_id', ...).eq('status', 'pending_email_verification').select('id')).
const updateUserByIdMock = vi.fn();
const selectMock = vi.fn();
const eqStatusMock = vi.fn(() => ({ select: selectMock }));
const eqAuthIdMock = vi.fn(() => ({ eq: eqStatusMock }));
const updateMock = vi.fn(() => ({ eq: eqAuthIdMock }));
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
    selectMock.mockReset();
    selectMock.mockResolvedValue({ error: null, data: [{ id: "profile-1" }] });
    eqStatusMock.mockClear();
    eqAuthIdMock.mockClear();
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
    expect(eqAuthIdMock).toHaveBeenCalledWith("auth_user_id", "user-uuid-1");
    expect(eqStatusMock).toHaveBeenCalledWith(
      "status",
      "pending_email_verification",
    );
    expect(selectMock).toHaveBeenCalledWith("id");
  });

  it("returns ok=false when the profile is not pending (suspended/active already)", async () => {
    // Codex P2 (2026-05-25): a stale confirmation link arriving for a
    // suspended account must NOT undo the suspension. The activation
    // update is gated on status='pending_email_verification', and a
    // 0-row result throws so the failure card renders.
    selectMock.mockResolvedValueOnce({ error: null, data: [] });
    const token = freshToken();
    const r = await processConfirmation(token);
    expect(r).toEqual({ ok: false });
    expect(captureExceptionMock).toHaveBeenCalled();
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
    selectMock.mockResolvedValueOnce({
      error: { message: "profile_update_failed" },
      data: null,
    });
    const token = freshToken();
    const r = await processConfirmation(token);
    expect(r).toEqual({ ok: false });
    expect(captureExceptionMock).toHaveBeenCalled();
  });
});
