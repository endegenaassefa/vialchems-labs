/**
 * Tests for lib/auth/account-server.ts — the security-sensitive
 * helpers behind the registration + confirmation routes.
 *
 * Codex P2 (2026-05-25) findings that drove these tests:
 *   - findAccountByEmail must NOT use ILIKE — PostgREST treats `_`
 *     and `%` as wildcards and a registration for `a_b@example.com`
 *     would false-match `axb@example.com`.
 *   - activateProfile must gate on status='pending_email_verification'
 *     so a stale link can't undo a suspension.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  findAccountByEmail,
  activateProfile,
  buildConfirmEmailUrl,
  buildPasswordResetUrl,
} from "@/lib/auth/account-server";

describe("findAccountByEmail", () => {
  it("queries customer_profiles via EXACT eq() on lowercased email (not ilike, to avoid `_`/`%` wildcard false-matches)", async () => {
    const eqProfile = vi.fn(() => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }));
    const selectProfile = vi.fn(() => ({ eq: eqProfile }));
    const eqArchived = vi.fn(() => ({ limit: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }));
    const selectArchived = vi.fn(() => ({ eq: eqArchived }));
    const fromMock = vi.fn((table: string) => {
      if (table === "customer_profiles") return { select: selectProfile };
      if (table === "archived_accounts") return { select: selectArchived };
      throw new Error(`unexpected table: ${table}`);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase: any = { from: fromMock };

    const r = await findAccountByEmail(supabase, "A_B@Example.COM");
    expect(r).toEqual({ kind: "none" });
    expect(eqProfile).toHaveBeenCalledWith("email", "a_b@example.com");
    expect(eqArchived).toHaveBeenCalledWith("email", "a_b@example.com");
  });

  it("returns active when the profile exists with status=active", async () => {
    const supabase = makeStub({
      profile: {
        data: { id: "p1", auth_user_id: "u1", status: "active" },
        error: null,
      },
    });
    const r = await findAccountByEmail(supabase, "x@example.com");
    expect(r).toMatchObject({ kind: "active", profileId: "p1", authUserId: "u1" });
  });

  it("returns pending when the profile exists with status=pending_email_verification", async () => {
    const supabase = makeStub({
      profile: {
        data: { id: "p1", auth_user_id: "u1", status: "pending_email_verification" },
        error: null,
      },
    });
    const r = await findAccountByEmail(supabase, "x@example.com");
    expect(r.kind).toBe("pending");
  });

  it("returns archived when only an archived row matches", async () => {
    const supabase = makeStub({
      profile: { data: null, error: null },
      archived: { data: { id: "a1" }, error: null },
    });
    const r = await findAccountByEmail(supabase, "x@example.com");
    expect(r.kind).toBe("archived");
  });

  it("fails SAFE (returns active) on profile lookup error so the route still returns uniform", async () => {
    const supabase = makeStub({
      profile: { data: null, error: { message: "db_down" } },
    });
    const r = await findAccountByEmail(supabase, "x@example.com");
    expect(r.kind).toBe("active");
  });

  it("fails SAFE (returns active) on archived lookup error", async () => {
    const supabase = makeStub({
      profile: { data: null, error: null },
      archived: { data: null, error: { message: "db_down" } },
    });
    const r = await findAccountByEmail(supabase, "x@example.com");
    expect(r.kind).toBe("active");
  });
});

describe("activateProfile", () => {
  it("gates on status='pending_email_verification' AND throws when 0 rows match", async () => {
    const select = vi.fn().mockResolvedValue({ error: null, data: [] });
    const eqStatus = vi.fn(() => ({ select }));
    const eqAuth = vi.fn(() => ({ eq: eqStatus }));
    const update = vi.fn(() => ({ eq: eqAuth }));
    const from = vi.fn(() => ({ update }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase: any = { from };
    await expect(activateProfile(supabase, "user-uuid-1")).rejects.toThrow(
      "profile_not_pending",
    );
    expect(eqAuth).toHaveBeenCalledWith("auth_user_id", "user-uuid-1");
    expect(eqStatus).toHaveBeenCalledWith("status", "pending_email_verification");
    expect(select).toHaveBeenCalledWith("id");
  });

  it("resolves on 1-row match", async () => {
    const select = vi.fn().mockResolvedValue({ error: null, data: [{ id: "p1" }] });
    const eqStatus = vi.fn(() => ({ select }));
    const eqAuth = vi.fn(() => ({ eq: eqStatus }));
    const update = vi.fn(() => ({ eq: eqAuth }));
    const from = vi.fn(() => ({ update }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase: any = { from };
    await expect(activateProfile(supabase, "user-uuid-1")).resolves.toBeUndefined();
  });

  it("throws when the underlying Supabase response has an error", async () => {
    const select = vi.fn().mockResolvedValue({ error: { message: "boom" }, data: null });
    const eqStatus = vi.fn(() => ({ select }));
    const eqAuth = vi.fn(() => ({ eq: eqStatus }));
    const update = vi.fn(() => ({ eq: eqAuth }));
    const from = vi.fn(() => ({ update }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase: any = { from };
    await expect(activateProfile(supabase, "user-uuid-1")).rejects.toBeTruthy();
  });
});

describe("URL builders", () => {
  beforeEach(() => {
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET = "test-secret-account-server-1234567890";
  });
  it("builds a /auth/confirm-email URL with a confirm-email token", () => {
    const url = buildConfirmEmailUrl("user-uuid-1", "marie@radium.lab");
    expect(url).toContain("/auth/confirm-email?token=");
  });
  it("builds a /reset-password URL with a password-reset token", () => {
    const url = buildPasswordResetUrl("user-uuid-1", "marie@radium.lab");
    expect(url).toContain("/reset-password?token=");
  });
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function makeStub(opts: {
  profile?: { data: unknown; error: unknown };
  archived?: { data: unknown; error: unknown };
}) {
  const profile = opts.profile ?? { data: null, error: null };
  const archived = opts.archived ?? { data: null, error: null };
  const profileChain = {
    select: () => ({
      eq: () => ({
        maybeSingle: () => Promise.resolve(profile),
      }),
    }),
  };
  const archivedChain = {
    select: () => ({
      eq: () => ({
        limit: () => ({
          maybeSingle: () => Promise.resolve(archived),
        }),
      }),
    }),
  };
  return {
    from: (table: string) =>
      table === "customer_profiles"
        ? profileChain
        : table === "archived_accounts"
          ? archivedChain
          : (() => {
              throw new Error(`unexpected table ${table}`);
            })(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as unknown as any;
}
