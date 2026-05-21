import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
}));

vi.mock("@/lib/email/welcome-sequence", () => ({
  dispatchWelcomeSequence: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "@/app/api/newsletter/subscribe/route";
import { __resetRateLimitForTests } from "@/lib/rate-limit";

function makeRequest(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://localhost/api/newsletter/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/newsletter/subscribe (rate-limited)", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  it("accepts a valid email submission", async () => {
    const res = await POST(
      makeRequest(
        { email: "researcher@example.com" },
        { "x-forwarded-for": "9.0.0.1" },
      ),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.promoCode).toBe("WELCOME15");
  });

  it("returns 429 with Retry-After after exceeding the 5/300s per-IP cap (Iron Law 2.34)", async () => {
    const ip = "9.0.0.2";
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(
        makeRequest({ email: `n${i}@example.com` }, { "x-forwarded-for": ip }),
      );
      expect(ok.status).toBe(200);
    }
    const blocked = await POST(
      makeRequest({ email: "spam@example.com" }, { "x-forwarded-for": ip }),
    );
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBeTruthy();
    expect(blocked.headers.get("x-ratelimit-limit")).toBe("5");
    const body = await blocked.json();
    expect(body.error).toBe("rate_limited");
  });
});
