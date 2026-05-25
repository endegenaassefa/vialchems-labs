/**
 * /api/track-order — uniform-response invariant tests.
 *
 * The route MUST return identical 200 + body regardless of whether:
 *   - the email matches an order (real lookup)
 *   - the email matches nothing
 *   - the email/displayId pair mismatches
 *   - the body is malformed
 *   - the request is rate-limited
 *
 * Status differentiation would let an attacker enumerate which emails
 * have orders on file.
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { __resetRateLimitForTests } from "@/lib/rate-limit";

const maybeSingleMock = vi.fn();
const eqEmailMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const eqDisplayMock = vi.fn(() => ({ eq: eqEmailMock }));
const selectMock = vi.fn(() => ({ eq: eqDisplayMock }));
const fromMock = vi.fn(() => ({ select: selectMock }));
let serviceClientReturn: { from: typeof fromMock } | null = { from: fromMock };

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => serviceClientReturn,
  browserSupabase: () => null,
}));

const sendLinkMock = vi.fn();
vi.mock("@/lib/email/order-view-link", () => ({
  sendOrderViewLink: (...args: unknown[]) => sendLinkMock(...args),
}));

import { POST } from "@/app/api/track-order/route";

function makeRequest(
  body: unknown,
  ip = "203.0.113.7",
): import("next/server").NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    "x-forwarded-for": ip,
  });
  return new Request("http://test.local/api/track-order", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;
}

const UNIFORM_MESSAGE =
  "If an order matching that email exists, a link has been sent. Check your inbox (and spam) in the next minute.";

describe("/api/track-order POST — uniform response", () => {
  beforeEach(() => {
    maybeSingleMock.mockReset();
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    sendLinkMock.mockReset();
    sendLinkMock.mockResolvedValue({ ok: true, id: "stub:order-view-link" });
    serviceClientReturn = { from: fromMock };
    __resetRateLimitForTests();
  });

  afterEach(() => {
    __resetRateLimitForTests();
  });

  it("returns 200 + uniform body when no order matches", async () => {
    const res = await POST(
      makeRequest({ email: "ghost@example.com", displayId: "VC-NOPE" }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, message: UNIFORM_MESSAGE });
    expect(sendLinkMock).not.toHaveBeenCalled();
  });

  it("returns SAME uniform body when an order DOES match (and sends the link)", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { display_id: "VC-REAL", email: "buyer@example.com" },
      error: null,
    });
    const res = await POST(
      makeRequest({ email: "buyer@example.com", displayId: "VC-REAL" }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, message: UNIFORM_MESSAGE });
    expect(sendLinkMock).toHaveBeenCalledTimes(1);
    expect(sendLinkMock).toHaveBeenCalledWith({
      displayId: "VC-REAL",
      email: "buyer@example.com",
    });
  });

  it("returns 200 + uniform body for a malformed body (does not 400)", async () => {
    const res = await POST(makeRequest("not-json"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, message: UNIFORM_MESSAGE });
    expect(sendLinkMock).not.toHaveBeenCalled();
  });

  it("returns 200 + uniform body for missing fields (does not 400)", async () => {
    const res = await POST(makeRequest({ email: "no-display@example.com" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, message: UNIFORM_MESSAGE });
  });

  it("returns 200 + uniform body when invalid email format", async () => {
    const res = await POST(
      makeRequest({ email: "not-an-email", displayId: "VC-1" }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, message: UNIFORM_MESSAGE });
    expect(sendLinkMock).not.toHaveBeenCalled();
  });

  it("returns 200 + uniform body when rate-limited (per-email)", async () => {
    // The email config is 3/hr. Fire 4 requests; the 4th should be limited
    // but the response shape stays identical.
    for (let i = 0; i < 3; i += 1) {
      const ok = await POST(
        makeRequest({
          email: "spammer@example.com",
          displayId: `VC-${i}`,
        }),
      );
      expect(ok.status).toBe(200);
      expect((await ok.json()).message).toBe(UNIFORM_MESSAGE);
    }
    const throttled = await POST(
      makeRequest({
        email: "spammer@example.com",
        displayId: "VC-FOURTH",
      }),
    );
    expect(throttled.status).toBe(200);
    expect((await throttled.json()).message).toBe(UNIFORM_MESSAGE);
  });

  it("returns 200 + uniform body in stub mode (no Supabase)", async () => {
    serviceClientReturn = null;
    const res = await POST(
      makeRequest({ email: "stub@example.com", displayId: "VC-S" }),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe(UNIFORM_MESSAGE);
    expect(sendLinkMock).not.toHaveBeenCalled();
  });

  it("normalises email to lowercase before lookup", async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { display_id: "VC-CASE", email: "buyer@example.com" },
      error: null,
    });
    await POST(
      makeRequest({ email: "BUYER@Example.com", displayId: "VC-CASE" }),
    );
    expect(eqEmailMock).toHaveBeenCalledWith("email", "buyer@example.com");
  });
});
