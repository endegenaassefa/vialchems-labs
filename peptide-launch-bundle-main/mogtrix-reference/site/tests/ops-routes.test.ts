import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as postStatus } from "@/app/api/ops/requests/[id]/status/route";
import { POST as postNote } from "@/app/api/ops/requests/[id]/notes/route";

const { getStaffSessionState, rpcMock, maybeSingleMock } = vi.hoisted(() => ({
  getStaffSessionState: vi.fn(),
  rpcMock: vi.fn(),
  maybeSingleMock: vi.fn()
}));

vi.mock("@/lib/ops", async () => {
  const actual = await vi.importActual<typeof import("@/lib/ops")>("@/lib/ops");
  return {
    ...actual,
    getStaffSessionState
  };
});

describe("ops request routes", () => {
  beforeEach(() => {
    getStaffSessionState.mockReset();
    rpcMock.mockReset();
    maybeSingleMock.mockReset();
  });

  it("rejects anonymous status updates", async () => {
    getStaffSessionState.mockResolvedValue({
      kind: "anonymous",
      supabase: {}
    });

    const response = await postStatus(new Request("https://mogtrix.test/api/ops/requests/req_1/status", {
      method: "POST",
      body: JSON.stringify({ nextStatus: "approved" }),
      headers: { "Content-Type": "application/json" }
    }), { params: Promise.resolve({ id: "req_1" }) });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Sign in to update request statuses."
    });
  });

  it("validates status payloads before calling RPC", async () => {
    getStaffSessionState.mockResolvedValue({
      kind: "ready",
      profile: { id: "profile_1" },
      user: { id: "user_1" },
      supabase: { rpc: rpcMock }
    });

    const response = await postStatus(new Request("https://mogtrix.test/api/ops/requests/req_1/status", {
      method: "POST",
      body: JSON.stringify({ nextStatus: "shipped" }),
      headers: { "Content-Type": "application/json" }
    }), { params: Promise.resolve({ id: "req_1" }) });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Choose a valid request status."
    });
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("returns status update results from the transition RPC", async () => {
    getStaffSessionState.mockResolvedValue({
      kind: "ready",
      profile: { id: "profile_1" },
      user: { id: "user_1" },
      supabase: { rpc: rpcMock }
    });
    rpcMock.mockResolvedValue({
      data: [{ id: "req_1", status: "approved", last_status_changed_at: "2026-05-02T05:10:00.000Z" }],
      error: null
    });

    const response = await postStatus(new Request("https://mogtrix.test/api/ops/requests/req_1/status", {
      method: "POST",
      body: JSON.stringify({ nextStatus: "approved", note: "Manual review passed." }),
      headers: { "Content-Type": "application/json" }
    }), { params: Promise.resolve({ id: "req_1" }) });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: "req_1",
      status: "approved",
      lastStatusChangedAt: "2026-05-02T05:10:00.000Z"
    });
  });

  it("rejects blank note bodies", async () => {
    getStaffSessionState.mockResolvedValue({
      kind: "ready",
      profile: { id: "profile_1" },
      user: { id: "user_1" },
      supabase: {
        from: () => ({
          insert: () => ({
            select: () => ({
              maybeSingle: maybeSingleMock
            })
          })
        })
      }
    });

    const response = await postNote(new Request("https://mogtrix.test/api/ops/requests/req_1/notes", {
      method: "POST",
      body: JSON.stringify({ body: "   " }),
      headers: { "Content-Type": "application/json" }
    }), { params: Promise.resolve({ id: "req_1" }) });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Enter a note before saving."
    });
    expect(maybeSingleMock).not.toHaveBeenCalled();
  });

  it("creates notes for ready staff sessions", async () => {
    getStaffSessionState.mockResolvedValue({
      kind: "ready",
      profile: { id: "profile_1" },
      user: { id: "user_1" },
      supabase: {
        from: () => ({
          insert: () => ({
            select: () => ({
              maybeSingle: maybeSingleMock
            })
          })
        })
      }
    });
    maybeSingleMock.mockResolvedValue({
      data: {
        id: 7,
        request_id: "req_1",
        author_profile_id: "profile_1",
        body: "Need COA before approval.",
        created_at: "2026-05-02T05:12:00.000Z",
        updated_at: "2026-05-02T05:12:00.000Z"
      },
      error: null
    });

    const response = await postNote(new Request("https://mogtrix.test/api/ops/requests/req_1/notes", {
      method: "POST",
      body: JSON.stringify({ body: "Need COA before approval." }),
      headers: { "Content-Type": "application/json" }
    }), { params: Promise.resolve({ id: "req_1" }) });

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      note: {
        id: 7,
        request_id: "req_1",
        author_profile_id: "profile_1",
        body: "Need COA before approval.",
        created_at: "2026-05-02T05:12:00.000Z",
        updated_at: "2026-05-02T05:12:00.000Z"
      }
    });
  });
});
