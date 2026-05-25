/**
 * Tests for POST /api/auth/sign-in (pre-flight gate).
 *
 * Codex P1 (checkpoint 6) fix: the pre-flight no longer returns
 * { status: "active" | "pending" | "suspended" | "none" } — that
 * was a public account-enumeration endpoint. Every success path now
 * returns the uniform `{ ok: true }` shape. The route only does
 * rate-limiting + body parsing; status differentiation moved to
 * post-supabase-signIn handling on the client.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { __resetRateLimitForTests } from "@/lib/rate-limit";

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

describe("POST /api/auth/sign-in (uniform pre-flight)", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    captureExceptionMock.mockReset();
  });
  afterEach(() => __resetRateLimitForTests());

  it("returns { ok: true } for any valid email + password body — no status differentiation", async () => {
    const res = await POST(
      makeRequest({ email: "marie@radium.lab", password: "anything12345" }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });

  it("returns the SAME uniform body for an unknown email (anti-enumeration invariant)", async () => {
    const res = await POST(
      makeRequest({ email: "ghost-no-account@example.com", password: "x".repeat(12) }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
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

  it("GET returns 405", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    expect((await res.json()).code).toBe("method_not_allowed");
  });
});
