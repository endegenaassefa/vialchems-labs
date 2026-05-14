import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

// Phase A: shared auth helpers for every /api/ops/* endpoint. The token
// itself is OPS_API_TOKEN (single shared secret per CEO plan D16/D14 — the
// owner and staff all use the same token pasted from localStorage on each
// browser session). Constant-time compare is mandatory; never use ===.

export function jsonError(
  error: string,
  status: number,
  message?: string,
): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
}

export function secureEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

// Returns null when the request is authorized. Returns a Response when it
// isn't — caller should return that response immediately and stop.
//
//   const authError = assertOpsToken(request);
//   if (authError) return authError;
//
// The `actorHint` header (`x-ops-actor`) is recorded into audit_log for
// every successful write so we can later trace which staff member did what
// — purely advisory, the token is the actual auth gate.
export function assertOpsToken(request: Request): Response | null {
  const expected = process.env.OPS_API_TOKEN?.trim();
  if (!expected) {
    return jsonError(
      "ops_token_not_configured",
      503,
      "OPS_API_TOKEN must be configured before any ops endpoint can run.",
    );
  }
  const supplied = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  if (!supplied || !secureEqual(supplied, expected)) {
    return jsonError("unauthorized", 401);
  }
  return null;
}

export function getOpsActor(request: Request, fallback = "ops-api"): string {
  const header = request.headers.get("x-ops-actor")?.trim();
  return header && header.length > 0 ? header : fallback;
}
