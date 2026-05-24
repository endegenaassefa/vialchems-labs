/**
 * P2B — /api/affiliate route contract tests.
 *
 * Covers super-prompt §7.2 closure: validation, rate limiting (Iron
 * Law 2.34), Supabase persist (best-effort), Resend dispatch (operator
 * notification + applicant ack), stub-mode no-op safety.
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { __resetRateLimitForTests } from "@/lib/rate-limit";

const insertMock = vi.fn();
const fromMock = vi.fn(() => ({ insert: insertMock }));
const fakeSupabase = { from: fromMock };
let serviceClientReturn: typeof fakeSupabase | null = fakeSupabase;

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceClientReturn,
  browserSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
}));

const sendOperatorMock = vi.fn();
const sendApplicantMock = vi.fn();
vi.mock("@/lib/email/affiliate-application", () => ({
  sendAffiliateOperatorNotification: (...args: unknown[]) =>
    sendOperatorMock(...args),
  sendAffiliateApplicantAck: (...args: unknown[]) => sendApplicantMock(...args),
}));

const captureExceptionMock = vi.fn();
vi.mock("@/lib/sentry", () => ({
  captureException: (...args: unknown[]) => captureExceptionMock(...args),
  captureMessage: vi.fn(),
  addRateLimitBreadcrumb: vi.fn(),
  startWebhookTransaction: vi.fn(() => ({ finish: vi.fn() })),
}));
vi.mock("@sentry/nextjs", () => ({
  addBreadcrumb: vi.fn(),
}));

const isProductionMock = vi.fn(() => false);
vi.mock("@/lib/runtime-env", () => ({
  isProductionRuntime: () => isProductionMock(),
}));

// findMarketingCopyViolation must not trip on a benign payload.
vi.mock("@/lib/compliance", () => ({
  findMarketingCopyViolation: (_value: string) => null,
}));

import { POST } from "@/app/api/affiliate/route";

function makeRequest(
  body: unknown,
  init: {
    ip?: string;
    contentType?: string;
    userAgent?: string;
  } = {},
): import("next/server").NextRequest {
  const headers = new Headers({
    "content-type": init.contentType ?? "application/json",
    "x-forwarded-for": init.ip ?? "203.0.113.7",
    "user-agent": init.userAgent ?? "vitest",
  });
  return new Request("http://test.local/api/affiliate", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

describe("/api/affiliate POST", () => {
  beforeEach(() => {
    insertMock.mockReset();
    insertMock.mockResolvedValue({ error: null });
    sendOperatorMock.mockReset();
    sendOperatorMock.mockResolvedValue({ ok: true, id: "stub:operator" });
    sendApplicantMock.mockReset();
    sendApplicantMock.mockResolvedValue({ ok: true, id: "stub:applicant" });
    captureExceptionMock.mockReset();
    fromMock.mockClear();
    serviceClientReturn = fakeSupabase;
    isProductionMock.mockReturnValue(false);
    __resetRateLimitForTests();
  });

  afterEach(() => {
    __resetRateLimitForTests();
  });

  it("rejects missing-fields payload with 400", async () => {
    const res = await POST(makeRequest({ name: "", email: "" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ ok: false, error: "missing_fields" });
    expect(sendOperatorMock).not.toHaveBeenCalled();
  });

  it("rejects invalid-email shape with 400", async () => {
    const res = await POST(
      makeRequest({ name: "Test", email: "not-an-email" }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ ok: false, error: "invalid_email" });
  });

  it("rejects non-JSON body with invalid_json 400", async () => {
    const res = await POST(
      makeRequest("not-json-bytes", { contentType: "application/json" }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ ok: false, error: "invalid_json" });
  });

  it("persists to affiliate_applications + fires operator + applicant emails on happy path", async () => {
    const res = await POST(
      makeRequest({
        name: "Jane Researcher",
        email: "jane@lab.example",
        audience: "12000",
        views: "5000",
        handles: "@jane",
        focus: "research peptide reconstitution tutorials",
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(fromMock).toHaveBeenCalledWith("affiliate_applications");
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Jane Researcher",
        email: "jane@lab.example",
        audience: "12000",
        views: "5000",
        handles: "@jane",
        focus: "research peptide reconstitution tutorials",
        ip_address: "203.0.113.7",
        user_agent: "vitest",
      }),
    );
    expect(sendOperatorMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Jane Researcher" }),
    );
    expect(sendApplicantMock).toHaveBeenCalledWith(
      expect.objectContaining({ email: "jane@lab.example" }),
    );
  });

  it("still returns 200 when Supabase is unavailable (REQUIRE_SUPABASE=false stub mode)", async () => {
    serviceClientReturn = null;
    const res = await POST(
      makeRequest({ name: "Test", email: "test@example.com" }),
    );
    expect(res.status).toBe(200);
    expect(fromMock).not.toHaveBeenCalled();
    expect(sendOperatorMock).toHaveBeenCalled();
  });

  it("captures Supabase insert errors to Sentry but still returns 200", async () => {
    insertMock.mockResolvedValueOnce({
      error: { message: "constraint violation" },
    });
    const res = await POST(
      makeRequest({ name: "Test", email: "test2@example.com" }),
    );
    expect(res.status).toBe(200);
    expect(captureExceptionMock).toHaveBeenCalled();
  });

  it("rate-limits per IP after the configured ceiling", async () => {
    // Send 4 requests from the same IP; the 4th should 429 (limit is 3/hr).
    for (let i = 0; i < 3; i++) {
      const res = await POST(
        makeRequest(
          { name: `User ${i}`, email: `user${i}@example.com` },
          { ip: "198.51.100.1" },
        ),
      );
      expect(res.status, `request ${i} should pass`).toBe(200);
    }
    const blocked = await POST(
      makeRequest(
        { name: "User 4", email: "user4@example.com" },
        { ip: "198.51.100.1" },
      ),
    );
    expect(blocked.status).toBe(429);
    const body = await blocked.json();
    expect(body.error).toBe("rate_limited");
  });

  it("returns 502 in production when operator notification email throws", async () => {
    isProductionMock.mockReturnValue(true);
    sendOperatorMock.mockRejectedValueOnce(new Error("resend down"));
    const res = await POST(
      makeRequest({ name: "Test", email: "test3@example.com" }),
    );
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toBe("affiliate_dispatch_failed");
    expect(captureExceptionMock).toHaveBeenCalled();
  });
});
