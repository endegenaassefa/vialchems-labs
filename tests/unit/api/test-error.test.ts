/**
 * D2 verification endpoint tests
 * (Section 6 super-prompt 2026-05-22, /api/test-error).
 */
import { describe, expect, it, beforeEach, vi } from "vitest";

const captureExceptionMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/sentry", () => ({
  captureException: captureExceptionMock,
  captureMessage: vi.fn(),
  beforeSend: vi.fn(),
}));

import { GET } from "@/app/api/test-error/route";

function makeReq(url = "http://test/api/test-error"): Request {
  return new Request(url, { method: "GET" });
}

beforeEach(() => {
  captureExceptionMock.mockReset();
});

describe("GET /api/test-error — D2 Sentry probe", () => {
  it("returns 403 without the probe token (no Sentry call)", async () => {
    const res = await GET(makeReq() as never);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("forbidden");
    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it("returns 403 on the wrong token (no Sentry call)", async () => {
    const res = await GET(
      makeReq("http://test/api/test-error?token=wrong") as never,
    );
    expect(res.status).toBe(403);
    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it("with the correct token, captures a SentryProbeError and returns 500", async () => {
    const res = await GET(
      makeReq("http://test/api/test-error?token=vc-sentry-probe") as never,
    );
    expect(res.status).toBe(500);
    expect(captureExceptionMock).toHaveBeenCalledTimes(1);
    const [err, ctx] = captureExceptionMock.mock.calls[0] ?? [];
    expect((err as Error).name).toBe("SentryProbeError");
    expect((ctx as { tags?: Record<string, string> })?.tags).toEqual(
      expect.objectContaining({ route: "test-error", probe: "sentry" }),
    );
  });

  it("response body documents the probe outcome", async () => {
    const res = await GET(
      makeReq("http://test/api/test-error?token=vc-sentry-probe") as never,
    );
    const body = await res.json();
    expect(body.code).toBe("sentry_probe_fired");
    expect(body.message).toMatch(/Sentry/);
  });
});
