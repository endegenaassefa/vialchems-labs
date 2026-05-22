import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// Mock supabase before importing the route.
const insertMock = vi.fn();
const fromMock = vi.fn(() => ({ insert: insertMock }));

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => null, // Day-1 default: REQUIRE_SUPABASE=false → null
  _resetSupabaseCachesForTests: () => {},
}));

import { POST } from "@/app/api/access/route";
import { __resetRateLimitForTests } from "@/lib/rate-limit";

afterEach(() => {
  delete process.env.SKIP_RATE_LIMIT;
});

const validPayload = {
  email: "researcher@example.com",
  role: "academic-researcher",
  researchPurpose:
    "Investigating in-vitro fibroblast migration kinetics in cell-culture wound-closure assays per laboratory protocol.",
  ageAcknowledgment: true,
  ruoAcknowledgment: true,
  jurisdictionAcknowledgment: true,
  attestationsAcknowledged: true,
};

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/access", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/access (D7 qualification persistence)", () => {
  beforeEach(() => {
    insertMock.mockReset();
    fromMock.mockClear();
    insertMock.mockResolvedValue({ error: null });
    __resetRateLimitForTests();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 200 with ok:true on a valid submission (Supabase off → no-op write)", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(typeof body.id).toBe("string");
  });

  it("returns 400 on invalid payload (missing required field)", async () => {
    const bad = { ...validPayload, email: "not-an-email" };
    const res = await POST(makeRequest(bad));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(Array.isArray(body.errors)).toBe(true);
  });

  it("returns 400 when researchPurpose contains forbidden marketing copy", async () => {
    const bad = {
      ...validPayload,
      researchPurpose:
        "I want to use this for weight loss and to treat my muscle pain.",
    };
    const res = await POST(makeRequest(bad));
    expect(res.status).toBe(400);
  });

  it("rejects non-JSON request bodies", async () => {
    const req = new Request("http://localhost/api/access", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 429 + Retry-After after 10 requests within 60s (per-IP cap, Iron Law 2.34)", async () => {
    const ip = "203.0.113.99";
    // Use a different email per request so the per-IP gate is the dominant
    // limit (per-email cap is 3/hr; per-IP cap is 10/60s — this test
    // exercises the per-IP path).
    for (let i = 0; i < 10; i += 1) {
      const ok = await POST(
        new Request("http://localhost/api/access", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": ip,
          },
          body: JSON.stringify({
            ...validPayload,
            email: `researcher-${i}@example.com`,
          }),
        }),
      );
      expect(ok.status).toBe(200);
    }
    const blocked = await POST(
      new Request("http://localhost/api/access", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": ip,
        },
        body: JSON.stringify({
          ...validPayload,
          email: "researcher-overflow@example.com",
        }),
      }),
    );
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBeTruthy();
    expect(blocked.headers.get("x-ratelimit-limit")).toBe("10");
    expect(blocked.headers.get("x-ratelimit-remaining")).toBe("0");
    const body = await blocked.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("rate_limited");
    // v5.1 rename: response carries `retryAfterSeconds`, not `retryAfter`.
    expect(body.retryAfterSeconds).toBeGreaterThan(0);
    expect(body.retryAfter).toBeUndefined();
  });

  it("returns 429 when the SAME email is submitted from 3 different IPs (per-email cap, Iron Law 2.34 v5.1)", async () => {
    const email = "abuser@example.com";
    const payload = { ...validPayload, email };
    // 3 unique IPs each post once with this email → per-email cap is hit.
    for (let i = 0; i < 3; i += 1) {
      const ok = await POST(
        new Request("http://localhost/api/access", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": `198.51.100.${i + 1}`,
          },
          body: JSON.stringify(payload),
        }),
      );
      expect(ok.status).toBe(200);
    }
    // 4th IP, same email → blocked on the email gate, not the IP gate.
    const blocked = await POST(
      new Request("http://localhost/api/access", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "198.51.100.99",
        },
        body: JSON.stringify(payload),
      }),
    );
    expect(blocked.status).toBe(429);
    const body = await blocked.json();
    expect(body.error).toBe("rate_limited");
    expect(body.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("SKIP_RATE_LIMIT=true bypasses all gates (test+dev escape hatch)", async () => {
    process.env.SKIP_RATE_LIMIT = "true";
    const ip = "203.0.113.77";
    // 20 calls from the same IP — would normally be 10 ok then blocked.
    for (let i = 0; i < 20; i += 1) {
      const res = await POST(
        new Request("http://localhost/api/access", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": ip,
          },
          body: JSON.stringify(validPayload),
        }),
      );
      expect(res.status).toBe(200);
    }
  });
});
