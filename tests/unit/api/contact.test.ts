import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/contact/route";

function makeReq(body: unknown): Request {
  return new Request("http://test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
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
});
