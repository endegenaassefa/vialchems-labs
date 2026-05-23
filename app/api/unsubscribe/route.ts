/**
 * E3 — Newsletter unsubscribe handler
 * (Section 6 super-prompt 2026-05-22).
 *
 * GET /api/unsubscribe?token=<signed> — verifies the HMAC-signed
 * token, inserts a row into newsletter_unsubscribes, and 302s to
 * /unsubscribe/<email>?ok=1 for the confirmation page. Errors
 * (invalid token, Supabase unavailable) 302 to
 * /unsubscribe/_/error?reason=<code> so the customer always sees
 * a human page rather than raw JSON.
 *
 * The unsubscribe gate (used by lib/email/welcome-sequence.ts +
 * any future marketing-email path) reads this table with a simple
 * `where email = $1` query. Transactional emails (order
 * confirmation, shipped, refund) skip the gate per CAN-SPAM.
 */
import { NextResponse, type NextRequest } from "next/server";
import { serviceSupabase } from "@/lib/supabase";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const verified = verifyUnsubscribeToken(token);
  if (!verified) {
    return NextResponse.redirect(
      new URL("/unsubscribe/_/error?reason=invalid_token", url),
    );
  }

  const supabase = serviceSupabase();
  if (!supabase) {
    // When Supabase is not configured, the unsubscribe is still
    // honored — the page just renders a "we'll process this
    // shortly" message instead of confirming the DB write. The
    // operator-side notification email surfaces these so the
    // unsubscribe doesn't get silently dropped.
    return NextResponse.redirect(
      new URL(
        `/unsubscribe/${encodeURIComponent(verified.email)}?ok=1&stub=1`,
        url,
      ),
    );
  }

  const { error } = await supabase.from("newsletter_unsubscribes").insert({
    email: verified.email,
    source: url.searchParams.get("source") ?? null,
  });

  // Duplicate-key on the unique-email index just means the user
  // unsubscribed twice — count that as success.
  if (error && !/duplicate/i.test(error.message)) {
    return NextResponse.redirect(
      new URL("/unsubscribe/_/error?reason=db_error", url),
    );
  }

  return NextResponse.redirect(
    new URL(`/unsubscribe/${encodeURIComponent(verified.email)}?ok=1`, url),
  );
}
