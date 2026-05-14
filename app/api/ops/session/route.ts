import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  OPS_SESSION_COOKIE,
  OPS_SESSION_MAX_AGE_SECONDS,
  jsonError,
  readOpsSessionCookie,
  secureEqual,
} from "@/lib/ops/auth";
import {
  checkOpsAuthRateLimit,
  hashIp,
  recordOpsAuthAttempt,
} from "@/lib/ops/rate-limit";
import { serviceSupabase } from "@/lib/supabase";
import { isProductionRuntime } from "@/lib/runtime-env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// CSO interim hardening (2026-05-14): the ops session endpoint.
//
// POST   — verify a pasted OPS_API_TOKEN, then set it in an httpOnly,
//          Secure, SameSite=Strict cookie. The token never touches
//          localStorage, so a storefront XSS can't read it. Brute-force
//          guesses are rate-limited via lib/ops/rate-limit.
// DELETE — clear the cookie (logout).
// GET    — report whether the current cookie is a valid session, so the
//          client-side OpsAuthGate can decide whether to redirect to login
//          without ever seeing the token value.

function expectedToken(): string | null {
  return process.env.OPS_API_TOKEN?.trim() || null;
}

function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isProductionRuntime(),
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

export async function POST(request: Request): Promise<Response> {
  const expected = expectedToken();
  if (!expected) {
    return jsonError(
      "ops_token_not_configured",
      503,
      "OPS_API_TOKEN must be configured before ops sign-in can run.",
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  const token =
    typeof raw === "object" && raw !== null && "token" in raw
      ? String((raw as { token?: unknown }).token ?? "").trim()
      : "";
  if (!token) {
    return jsonError("token_required", 400);
  }

  // Brute-force protection. Best-effort: when Supabase isn't wired (the
  // Day-1 demo default) there's nowhere to track attempts, so we skip it
  // rather than block sign-in.
  let supabase: SupabaseClient | null = null;
  try {
    supabase = serviceSupabase();
  } catch {
    supabase = null;
  }
  const ipHash = hashIp(
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  );

  if (supabase) {
    const limit = await checkOpsAuthRateLimit(supabase, ipHash);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: "rate_limited",
          message: "Too many sign-in attempts. Try again in a few minutes.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds ?? 900) },
        },
      );
    }
  }

  const tokenOk = secureEqual(token, expected);
  if (supabase) {
    await recordOpsAuthAttempt(supabase, ipHash, tokenOk);
  }
  if (!tokenOk) {
    return jsonError("unauthorized", 401);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    OPS_SESSION_COOKIE,
    token,
    sessionCookieOptions(OPS_SESSION_MAX_AGE_SECONDS),
  );
  return response;
}

export async function DELETE(): Promise<Response> {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(OPS_SESSION_COOKIE, "", sessionCookieOptions(0));
  return response;
}

export async function GET(request: Request): Promise<Response> {
  const expected = expectedToken();
  const supplied = readOpsSessionCookie(request);
  const authenticated = Boolean(
    expected && supplied && secureEqual(supplied, expected),
  );
  return NextResponse.json({ authenticated });
}
