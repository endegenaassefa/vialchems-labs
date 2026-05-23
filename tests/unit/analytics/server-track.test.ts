/**
 * D4 — Server-side Plausible event proxy tests
 * (Section 6 super-prompt 2026-05-22).
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { trackServerEvent } from "@/lib/analytics/server-track";

const ORIGINAL_FETCH = globalThis.fetch;

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
});

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
});

describe("trackServerEvent — Plausible Events API proxy", () => {
  it("returns plausible_disabled when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is not set (stub mode)", async () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await trackServerEvent({ event: "test_event" });
    expect(result.ok).toBe(false);
    expect(result.code).toBe("plausible_disabled");
    // Must not make any network call when stub-mode.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("POSTs to plausible.io/api/event with the configured domain and event body", async () => {
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "vialchemlabs.net";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 202,
    } as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await trackServerEvent({
      event: "order_paid",
      props: { provider: "btcpay", total_cents: 4590 },
      visitorIp: "1.2.3.4",
      userAgent: "TestAgent/1.0",
    });

    expect(result.ok).toBe(true);
    expect(result.code).toBe("sent");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://plausible.io/api/event");
    expect(init.method).toBe("POST");
    const headers = init.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["X-Forwarded-For"]).toBe("1.2.3.4");
    expect(headers["User-Agent"]).toBe("TestAgent/1.0");
    const body = JSON.parse(init.body as string);
    expect(body.domain).toBe("vialchemlabs.net");
    expect(body.name).toBe("order_paid");
    expect(body.props).toEqual({ provider: "btcpay", total_cents: 4590 });
  });

  it("returns ok=false with non_2xx when Plausible rejects the event", async () => {
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "vialchemlabs.net";
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
    } as Response) as unknown as typeof fetch;

    const result = await trackServerEvent({ event: "weird_event" });
    expect(result.ok).toBe(false);
    expect(result.code).toBe("non_2xx");
    expect(result.status).toBe(400);
  });

  it("returns ok=false with network_error when fetch throws", async () => {
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "vialchemlabs.net";
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(new Error("net")) as unknown as typeof fetch;

    const result = await trackServerEvent({ event: "test" });
    expect(result.ok).toBe(false);
    expect(result.code).toBe("network_error");
  });

  it("supplies a fallback User-Agent when caller omits one (Plausible drops events without UA)", async () => {
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "vialchemlabs.net";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 202,
    } as Response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await trackServerEvent({ event: "test" });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers["User-Agent"]).toBeTruthy();
  });
});
