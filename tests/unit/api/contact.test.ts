import { describe, expect, it, beforeEach } from "vitest";
import { POST } from "@/app/api/contact/route";
import { __resetRateLimitForTests } from "@/lib/rate-limit";

function makeReq(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  it("returns ok on a complete payload", async () => {
    const res = await POST(
      makeReq({
        name: "Researcher",
        email: "r@example.com",
        message: "COA batch question",
      }) as never,
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });

  it("rejects missing name", async () => {
    const res = await POST(
      makeReq({ name: "", email: "r@example.com", message: "msg" }) as never,
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("missing_fields");
  });

  it("rejects missing email", async () => {
    const res = await POST(
      makeReq({ name: "R", email: "", message: "msg" }) as never,
    );
    expect(res.status).toBe(400);
  });

  it("rejects missing message", async () => {
    const res = await POST(
      makeReq({ name: "R", email: "r@example.com", message: "" }) as never,
    );
    expect(res.status).toBe(400);
  });

  it("rejects invalid JSON", async () => {
    const res = await POST(makeReq("not json {[") as never);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("invalid_json");
  });

  it("rejects non-string fields", async () => {
    const res = await POST(
      makeReq({ name: 123, email: null, message: { hi: true } }) as never,
    );
    expect(res.status).toBe(400);
  });

  it("returns 429 + Retry-After after 3 requests within 3600s (Iron Law 2.34)", async () => {
    const ip = "198.51.100.7";
    const body = {
      name: "Researcher",
      email: "r@example.com",
      message: "COA batch question",
    };
    for (let i = 0; i < 3; i += 1) {
      const ok = await POST(
        makeReq(body, { "x-forwarded-for": ip }) as never,
      );
      expect(ok.status).toBe(200);
    }
    const blocked = await POST(
      makeReq(body, { "x-forwarded-for": ip }) as never,
    );
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBeTruthy();
    expect(blocked.headers.get("x-ratelimit-limit")).toBe("3");
    const json = await blocked.json();
    expect(json.error).toBe("rate_limited");
  });
});
