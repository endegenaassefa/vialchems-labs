/**
 * Tests for POST /api/auth/sign-in (pre-flight gate).
 *
 * The actual credential check runs on the browser via
 * supabase.auth.signInWithPassword. This endpoint exists for:
 *   - per-IP + per-email rate-limit before the password is even sent
 *   - status check (pending / suspended) so the UI can surface
 *     "confirm your email" instead of the generic invalid-creds reply
 *
 * Anti-enum invariant: missing/unknown emails return
 * { ok: true, status: "none" } — same shape as the active path.
 * Per-email rate-limit fires on whatever email was supplied so the
 * counter still bounds credential-stuffing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { __resetRateLimitForTests } from "@/lib/rate-limit";

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

import { POST, GET } from "@/app/api/auth/sign-in/route";

function makeRequest(body: unknown, ip = "203.0.113.40"): import("next/server").NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    "x-forwarded-for": ip,
  });
  return new Request("http://test.local/api/auth/sign-in", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

describe("POST /api/auth/sign-in", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    maybeSingleMock.mockReset();
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    eqMock.mockClear();
    selectMock.mockClear();
    fromMock.mockClear();
    serviceSupabaseReturn = { from: fromMock };
    captureExceptionMock.mockReset();
  });
  afterEach(() => __resetRateLimitForTests());

  it("returns status=active when profile is active", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { status: "active" },
      error: null,
    });
    const res = await POST(
      makeRequest({ email: "marie@radium.lab", password: "anything12345" }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, status: "active" });
  });

  it("returns status=pending when profile is pending_email_verification", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { status: "pending_email_verification" },
      error: null,
    });
    const res = await POST(
      makeRequest({ email: "marie@radium.lab", password: "anything12345" }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, status: "pending" });
  });

  it("returns status=suspended when profile is suspended", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { status: "suspended" },
      error: null,
    });
    const res = await POST(
      makeRequest({ email: "x@example.com", password: "anything12345" }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, status: "suspended" });
  });

  it("returns status=none when no profile exists (uniform shape)", async () => {
    maybeSingleMock.mockResolvedValueOnce({ data: null, error: null });
    const res = await POST(
      makeRequest({ email: "ghost@example.com", password: "anything12345" }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, status: "none" });
  });

  it("rejects malformed body with 400 invalid_body", async () => {
    const res = await POST(makeRequest("not-json"));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_body");
  });

  it("rejects missing email with 400 invalid_body", async () => {
    const res = await POST(makeRequest({ password: "x" }));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_body");
  });

  it("returns 429 with retry_after when rate-limited (per IP)", async () => {
    // signIn IP cap is 20/hr. Send 20 from same IP with DIFFERENT
    // emails to avoid tripping the per-email cap first.
    for (let i = 0; i < 20; i += 1) {
      const ok = await POST(
        makeRequest(
          { email: `unique-${i}@example.com`, password: "anything12345" },
          "203.0.113.77",
        ),
      );
      expect(ok.status).toBe(200);
    }
    const limited = await POST(
      makeRequest(
        { email: "another@example.com", password: "anything12345" },
        "203.0.113.77",
      ),
    );
    expect(limited.status).toBe(429);
    const body = await limited.json();
    expect(body.code).toBe("rate_limited");
    expect(body.retry_after_seconds).toBeGreaterThan(0);
  });

  it("returns status=active on stub-mode (no supabase) — never blocks the client", async () => {
    serviceSupabaseReturn = null;
    const res = await POST(
      makeRequest({ email: "x@example.com", password: "anything12345" }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, status: "active" });
  });

  it("returns status=active on lookup error (fail-safe; no enumeration signal)", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: null,
      error: { message: "db_down" },
    });
    const res = await POST(
      makeRequest({ email: "x@example.com", password: "anything12345" }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, status: "active" });
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("GET returns 405", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    expect((await res.json()).code).toBe("method_not_allowed");
  });
});
