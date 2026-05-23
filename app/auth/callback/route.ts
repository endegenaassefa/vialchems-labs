/**
 * B1 — Magic-link callback handler
 * (Section 6 super-prompt 2026-05-22).
 *
 * Supabase Auth's `signInWithOtp` emails a link that lands here with
 * a `code` query param. We exchange the code for a session via the
 * service-role client, write the session cookies, and redirect to
 * the customer's intended destination (passed through as `next`).
 *
 * When REQUIRE_SUPABASE=false (Day-1 default), `serviceSupabase()`
 * returns null. In that case the handler 302-redirects to /login
 * with a `error=supabase_unavailable` query param so the UI can
 * render a helpful message instead of a blank failure.
 */
import { NextResponse, type NextRequest } from "next/server";
import { serviceSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeNext(value: string | null): string {
  if (!value) return "/account";
  if (!value.startsWith("/")) return "/account";
  if (value.startsWith("//")) return "/account";
  return value;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  const supabase = serviceSupabase();
  if (!supabase) {
    return NextResponse.redirect(
      new URL(`/login?error=supabase_unavailable`, url),
    );
  }
  if (!code) {
    return NextResponse.redirect(new URL(`/login?error=missing_code`, url));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(
        `/login?error=auth_error&message=${encodeURIComponent(error.message)}`,
        url,
      ),
    );
  }

  return NextResponse.redirect(new URL(next, url));
}
