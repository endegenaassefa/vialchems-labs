import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

// Phase A: shared auth helpers for every /api/ops/* endpoint. The token
// itself is OPS_API_TOKEN (single shared secret per CEO plan D16/D14).
// Constant-time compare is mandatory; never use ===.
//
// CSO interim hardening (2026-05-14): the browser flow now carries the
// token in an httpOnly, Secure, SameSite=Strict cookie set by
// /api/ops/session — site JavaScript can no longer read it, so a storefront
// XSS can no longer exfiltrate it. assertOpsToken checks that cookie first
// and still accepts an `Authorization: Bearer` header as a fallback for
// server-to-server / test callers.

// Cookie that carries the ops session token. httpOnly so JS can't read it;
// SameSite=Strict so it is never sent on a cross-site request (CSRF guard).
export const OPS_SESSION_COOKIE = "vialchems_ops_session";

// 12 hours — staff re-authenticate at least once a day. Previously the
// localStorage token had no expiry at all.
export const OPS_SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

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

// Reads the ops session token from the request's Cookie header. Parses only
// the one cookie we care about so this stays sync (no next/headers, no async).
export function readOpsSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === OPS_SESSION_COOKIE) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return null;
}

// Returns null when the request is authorized. Returns a Response when it
// isn't — caller should return that response immediately and stop.
//
//   const authError = assertOpsToken(request);
//   if (authError) return authError;
//
// Checks the httpOnly session cookie first, then falls back to an
// `Authorization: Bearer` header for server-to-server / test callers.
//
// The `x-ops-actor` header is recorded into audit_log for every successful
// write so we can later trace which staff member did what — purely advisory
// and spoofable; the token is the actual auth gate. Per-user attribution is
// the planned follow-up (full per-staff auth).
export function assertOpsToken(request: Request): Response | null {
  const expected = process.env.OPS_API_TOKEN?.trim();
  if (!expected) {
    return jsonError(
      "ops_token_not_configured",
      503,
      "OPS_API_TOKEN must be configured before any ops endpoint can run.",
    );
  }
  const supplied =
    readOpsSessionCookie(request) ??
    request.headers
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
