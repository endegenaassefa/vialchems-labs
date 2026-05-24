/**
 * P2C — contact-form deliverability regression guard.
 *
 * Super-prompt §7.3 fix: when sendEmail throws (e.g. RESEND_API_KEY
 * missing in env, Resend SDK error, etc.) the route MUST return 502
 * with a diagnostic message in every runtime — NOT silently swallow
 * the error and return 200 in dev/preview. Operators discovered the
 * bug because customers' "received" toasts succeeded while the
 * operator inbox stayed empty.
 *
 * Mocks sendEmail to throw; asserts the route surfaces the failure.
 */
import { describe, expect, it, vi } from "vitest";

const sendEmailMock = vi.fn();
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => sendEmailMock(...args),
}));

const sendContactAckMock = vi.fn().mockResolvedValue({ ok: true, id: "ack" });
vi.mock("@/lib/email/contact-ack", () => ({
  sendContactAck: (...args: unknown[]) => sendContactAckMock(...args),
}));

vi.mock("@/lib/sentry", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addRateLimitBreadcrumb: vi.fn(),
  startWebhookTransaction: vi.fn(() => ({ finish: vi.fn() })),
}));

vi.mock("@sentry/nextjs", () => ({
  addBreadcrumb: vi.fn(),
}));

import { POST } from "@/app/api/contact/route";

describe("/api/contact deliverability (P2C — super-prompt §7.3)", () => {
  it("returns 502 with diagnostic hint when sendEmail throws (any runtime)", async () => {
    sendEmailMock.mockRejectedValueOnce(
      new Error("Phase 10.2: REQUIRE_RESEND=true but RESEND_API_KEY is empty."),
    );
    const req = new Request("http://test/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.42",
      },
      body: JSON.stringify({
        name: "Researcher",
        email: "researcher@example.com",
        message: "Question about your BPC-157 batch records.",
      }),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await POST(req as any);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("contact_dispatch_failed");
    expect(body.hint).toMatch(/health\/ready/);
  });

  it("returns 200 + fires ack when send succeeds", async () => {
    sendEmailMock.mockResolvedValueOnce({ ok: true, id: "ok-id" });
    const req = new Request("http://test/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.43",
      },
      body: JSON.stringify({
        name: "Researcher",
        email: "researcher2@example.com",
        message: "Question about your COA batch records.",
      }),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(sendContactAckMock).toHaveBeenCalled();
  });
});
