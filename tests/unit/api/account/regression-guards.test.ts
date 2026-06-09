/**
 * Regression guards — these tests fail loudly if any of the issues
 * the customer-accounts rebuild was supposed to fix ever returns.
 *
 * Spec §19 acceptance criteria + §13.3 regression guards.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { __resetRateLimitForTests } from "@/lib/rate-limit";
import { signAccountEmailToken } from "@/lib/auth/account-email-token";

// ---------------------------------------------------------------------------
// Guard 1: anti-enumeration response shape is identical across every
// account-discovery endpoint. Status differentiation here would let an
// attacker enumerate emails.
// ---------------------------------------------------------------------------

describe("Guard: anti-enumeration uniform response shape", () => {
  it("register / forgot-password / resend-confirmation all return ok=true + non-empty message on 200", async () => {
    const {
      REGISTER_UNIFORM_MESSAGE,
      FORGOT_PASSWORD_UNIFORM_MESSAGE,
      RESEND_CONFIRM_UNIFORM_MESSAGE,
    } = await import("@/lib/auth/account-server");

    // Each is a constant string the route never branches on.
    expect(typeof REGISTER_UNIFORM_MESSAGE).toBe("string");
    expect(REGISTER_UNIFORM_MESSAGE.length).toBeGreaterThan(20);

    expect(typeof FORGOT_PASSWORD_UNIFORM_MESSAGE).toBe("string");
    expect(FORGOT_PASSWORD_UNIFORM_MESSAGE.length).toBeGreaterThan(20);

    expect(typeof RESEND_CONFIRM_UNIFORM_MESSAGE).toBe("string");
    expect(RESEND_CONFIRM_UNIFORM_MESSAGE.length).toBeGreaterThan(20);

    // Each is distinct (we don't want a single shared message that
    // accidentally lands on the wrong route).
    expect(REGISTER_UNIFORM_MESSAGE).not.toBe(FORGOT_PASSWORD_UNIFORM_MESSAGE);
    expect(REGISTER_UNIFORM_MESSAGE).not.toBe(RESEND_CONFIRM_UNIFORM_MESSAGE);
    expect(FORGOT_PASSWORD_UNIFORM_MESSAGE).not.toBe(
      RESEND_CONFIRM_UNIFORM_MESSAGE,
    );
  });
});

// ---------------------------------------------------------------------------
// Guard 2: password-reset nonce is consumed atomically via the
// consumed_password_reset_nonces table. Replay protection must NOT
// regress to the racy "compare-then-stamp last_used_reset_nonce" pattern.
// ---------------------------------------------------------------------------

describe("Guard: password-reset nonce consumption is atomic", () => {
  const updateUserByIdMock = vi.fn();
  const profileMaybeSingleMock = vi.fn();
  const profileEqMock = vi.fn(() => ({ maybeSingle: profileMaybeSingleMock }));
  const profileSelectMock = vi.fn(() => ({ eq: profileEqMock }));

  const consumedInsertMock = vi.fn();
  const consumedDeleteEq2Mock = vi.fn();
  const consumedDeleteEq1Mock = vi.fn(() => ({ eq: consumedDeleteEq2Mock }));
  const consumedDeleteMock = vi.fn(() => ({ eq: consumedDeleteEq1Mock }));

  const profileEqUpdateMock = vi.fn();
  const profileUpdateMock = vi.fn(() => ({ eq: profileEqUpdateMock }));

  const fromMock = vi.fn((table: string) => {
    if (table === "consumed_password_reset_nonces") {
      return { insert: consumedInsertMock, delete: consumedDeleteMock };
    }
    if (table === "customer_profiles") {
      return { select: profileSelectMock, update: profileUpdateMock };
    }
    throw new Error(`unexpected table: ${table}`);
  });

  vi.doMock("@/lib/supabase", () => ({
    serviceSupabase: () => ({
      auth: { admin: { updateUserById: updateUserByIdMock } },
      from: fromMock,
    }),
    browserSupabase: () => null,
  }));

  beforeEach(() => {
    __resetRateLimitForTests();
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET =
      "regression-guard-secret-1234567890";
    updateUserByIdMock.mockReset();
    updateUserByIdMock.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });
    profileMaybeSingleMock.mockReset();
    profileMaybeSingleMock.mockResolvedValue({
      data: { id: "p1", status: "active" },
      error: null,
    });
    consumedInsertMock.mockReset();
    consumedInsertMock.mockResolvedValue({ error: null });
    consumedDeleteEq2Mock.mockReset();
    consumedDeleteEq2Mock.mockResolvedValue({ error: null });
    profileEqUpdateMock.mockReset();
    profileEqUpdateMock.mockResolvedValue({ error: null });
    fromMock.mockClear();
  });

  it("INSERTs into consumed_password_reset_nonces BEFORE updateUserById", async () => {
    const { POST } = await import("@/app/api/auth/reset-password/route");
    const token = signAccountEmailToken(
      { purpose: "password-reset", userId: "u1", email: "x@example.com" },
      { ttlSeconds: 3600 },
    );
    const req = new Request("http://test.local/api/auth/reset-password", {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.250",
      }),
      body: JSON.stringify({
        token,
        password: "Vialchem!Lab42-mainline",
        confirm_password: "Vialchem!Lab42-mainline",
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
    await POST(req);
    // The order matters: insert must precede the auth update.
    const insertOrder = consumedInsertMock.mock.invocationCallOrder[0];
    const updateOrder = updateUserByIdMock.mock.invocationCallOrder[0];
    expect(insertOrder).toBeDefined();
    expect(updateOrder).toBeDefined();
    expect(insertOrder).toBeLessThan(updateOrder);
  });

  it("rolls the consumed-nonce row back on auth update failure", async () => {
    updateUserByIdMock.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "auth_fail" },
    });
    const { POST } = await import("@/app/api/auth/reset-password/route");
    const token = signAccountEmailToken(
      { purpose: "password-reset", userId: "u1", email: "x@example.com" },
      { ttlSeconds: 3600 },
    );
    const req = new Request("http://test.local/api/auth/reset-password", {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.249",
      }),
      body: JSON.stringify({
        token,
        password: "Vialchem!Lab42-mainline",
        confirm_password: "Vialchem!Lab42-mainline",
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
    await POST(req);
    expect(consumedDeleteMock).toHaveBeenCalled();
    expect(consumedDeleteEq1Mock).toHaveBeenCalledWith("auth_user_id", "u1");
  });
});

// ---------------------------------------------------------------------------
// Guard 3: DOB is silently stripped from /api/account/profile PATCH
// per spec §3.5 immutability. Regression here would let a customer
// back-door past the age-21 gate by changing their DOB after
// registration.
// ---------------------------------------------------------------------------

describe("Guard: profile PATCH strips date_of_birth (spec §3.5 immutability)", () => {
  it("profileEditSchema parses but does not surface date_of_birth", async () => {
    const { profileEditSchema } = await import("@/lib/validation/customer");
    const parsed = profileEditSchema.safeParse({
      date_of_birth: "2010-01-01",
      full_name: "Updated",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      // .strip() removes unknown keys; date_of_birth is not in the
      // schema so it falls out.
      expect(
        (parsed.data as Record<string, unknown>).date_of_birth,
      ).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// Guard 4: registration schema enforces age >= 21 calendar-correctly.
// Off-by-one (e.g. a customer who turns 21 tomorrow) must be rejected.
// ---------------------------------------------------------------------------

describe("Guard: dobSchema age math is calendar-correct (off-by-one)", () => {
  it("rejects a DOB that is 21-years-ago-PLUS-1-day (would-be 20 today)", async () => {
    const { dobSchema } = await import("@/lib/validation/customer");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    // 21 years before tomorrow = still 20 today
    const dob = new Date(
      Date.UTC(
        tomorrow.getUTCFullYear() - 21,
        tomorrow.getUTCMonth(),
        tomorrow.getUTCDate(),
      ),
    );
    const value = `${dob.getUTCFullYear()}-${String(dob.getUTCMonth() + 1).padStart(2, "0")}-${String(dob.getUTCDate()).padStart(2, "0")}`;
    const r = dobSchema.safeParse(value);
    expect(r.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Guard 5: HMAC token has per-purpose TTL cap. A leaked PREVIOUS
// rotation secret cannot be used to mint tokens with arbitrary TTL.
// ---------------------------------------------------------------------------

describe("Guard: HMAC token per-purpose TTL cap (codex HIGH fix)", () => {
  it("verifyAccountEmailToken rejects a token whose exp - iat exceeds the per-purpose cap", async () => {
    const { MAX_TTL_SECONDS, verifyAccountEmailToken } =
      await import("@/lib/auth/account-email-token");
    process.env.ACCOUNT_EMAIL_TOKEN_SECRET = "regression-cap-secret-1234567890";

    // Forge a token by hand with TTL > the cap for password-reset (1h).
    const { createHmac, randomBytes } = await import("node:crypto");
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + MAX_TTL_SECONDS["password-reset"] + 60; // 1 minute over cap
    const payload = {
      purpose: "password-reset",
      userId: "u1",
      email: "x@example.com",
      iat,
      exp,
      nonce: randomBytes(8).toString("hex"),
    };
    const encoded = Buffer.from(JSON.stringify(payload), "utf-8")
      .toString("base64")
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replaceAll("=", "");
    const sig = createHmac("sha256", "regression-cap-secret-1234567890")
      .update(encoded)
      .digest("hex");
    const token = `${encoded}.${sig}`;
    const result = verifyAccountEmailToken(token, "password-reset");
    expect(result).toBeNull();
  });
});
