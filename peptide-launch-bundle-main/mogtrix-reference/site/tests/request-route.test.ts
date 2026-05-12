import { beforeEach, describe, expect, it, vi } from "vitest";
import { OPTIONS, POST } from "@/app/api/research-requests/route";
import { buildResearchRequestPayload } from "@/lib/request";
import { requiredAttestations } from "@/lib/attestations";

const { rpcMock, createServiceRoleSupabaseClient } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
  createServiceRoleSupabaseClient: vi.fn()
}));

vi.mock("@/lib/supabase/service", () => ({
  createServiceRoleSupabaseClient
}));

const validPayload = buildResearchRequestPayload({
  contactName: "Research Lead",
  organization: "Independent Research Lab",
  email: "lead@example.com",
  projectSummary: "Analytical bench research and documentation.",
  attestationIds: requiredAttestations.map((item) => item.id)
}, [{ productId: "bpc-157-5mg", quantity: 1 }], "8b9d2051-1498-4b6c-b408-628d0c829f5f");

describe("research request route", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    createServiceRoleSupabaseClient.mockReset();
    delete process.env.REQUIRE_SUPABASE;
  });

  it("rejects invalid JSON bodies", async () => {
    const response = await POST(new Request("https://mogtrix.test/api/research-requests", {
      method: "POST",
      body: "{broken",
      headers: { "Content-Type": "application/json" }
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid research request payload." });
  });

  it("answers OPTIONS for post-deploy smoke checks", async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(200);
    expect(response.headers.get("Allow")).toBe("POST, OPTIONS");
  });

  it("returns validation details for malformed payloads", async () => {
    const response = await POST(new Request("https://mogtrix.test/api/research-requests", {
      method: "POST",
      body: JSON.stringify({ ...validPayload, email: "bad" }),
      headers: { "Content-Type": "application/json" }
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Invalid research request payload.",
      details: expect.arrayContaining(["Enter a valid email address."])
    });
  });

  it("falls back to local demo mode when no service client is available", async () => {
    createServiceRoleSupabaseClient.mockReturnValue(null);

    const response = await POST(new Request("https://mogtrix.test/api/research-requests", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: { "Content-Type": "application/json" }
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: validPayload.clientRequestId,
      status: "pending_review",
      mode: "local-demo"
    });
  });

  it("fails closed when Supabase is required but no service client is available", async () => {
    process.env.REQUIRE_SUPABASE = "true";
    createServiceRoleSupabaseClient.mockReturnValue(null);

    const response = await POST(new Request("https://mogtrix.test/api/research-requests", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: { "Content-Type": "application/json" }
    }));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Request intake is not connected to the production database. Try again later."
    });
  });

  it("maps rate-limited RPC failures to a 429", async () => {
    createServiceRoleSupabaseClient.mockReturnValue({ rpc: rpcMock });
    rpcMock.mockResolvedValue({ data: null, error: { message: "RATE_LIMITED" } });

    const response = await POST(new Request("https://mogtrix.test/api/research-requests", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: { "Content-Type": "application/json" }
    }));

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error: "Too many request attempts from this network. Wait a few minutes and retry."
    });
  });

  it("maps invalid product ids to a 400", async () => {
    createServiceRoleSupabaseClient.mockReturnValue({ rpc: rpcMock });
    rpcMock.mockResolvedValue({ data: null, error: { message: "INVALID_PRODUCT_IDS" } });

    const response = await POST(new Request("https://mogtrix.test/api/research-requests", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: { "Content-Type": "application/json" }
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "One or more requested products are no longer available. Refresh the catalog and retry."
    });
  });

  it("returns a 500 when the RPC response is malformed", async () => {
    createServiceRoleSupabaseClient.mockReturnValue({ rpc: rpcMock });
    rpcMock.mockResolvedValue({ data: [{ id: null, status: null }], error: null });

    const response = await POST(new Request("https://mogtrix.test/api/research-requests", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: { "Content-Type": "application/json" }
    }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "The request could not be saved. Check the connection and retry."
    });
  });

  it("returns 200 for duplicate submits and preserves the API contract", async () => {
    createServiceRoleSupabaseClient.mockReturnValue({ rpc: rpcMock });
    rpcMock.mockResolvedValue({
      data: [{ id: "req_duplicate", status: "pending_review", duplicate: true }],
      error: null
    });

    const response = await POST(new Request("https://mogtrix.test/api/research-requests", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: { "Content-Type": "application/json" }
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: "req_duplicate",
      status: "pending_review",
      duplicate: true,
      mode: "supabase"
    });
  });
});
