/**
 * Auth-flow redesign — /api/track-order
 *
 * Customer submits {email, displayId}; we look up the order and (if it
 * exists with that email pair) send a fresh tokenized link to the email.
 *
 * Iron rule: uniform response. The status code + body are IDENTICAL
 * whether the order exists, the email mismatches, the order is missing,
 * the body is malformed, OR the request is rate-limited. Status
 * differentiation would let an attacker enumerate which emails have
 * orders on file. Rate limiting stays as defense in depth.
 *
 * Failures (Supabase error, Resend error) are caught + logged to Sentry
 * but never surface to the caller.
 *
 * Codex review fixes:
 *   - Use the production-grade isRateLimited() (Upstash-aware) instead
 *     of the low-level in-memory primitives.
 *   - Await the email send so the serverless function doesn't terminate
 *     mid-send.
 *   - try/catch the whole body so a thrown Supabase error doesn't
 *     become a differentiated 500.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { serviceSupabase } from "@/lib/supabase";
import { sendOrderViewLink } from "@/lib/email/order-view-link";
import { captureException } from "@/lib/sentry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inputSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  displayId: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid order id format"),
});

const UNIFORM_BODY = {
  ok: true,
  message:
    "If an order matching that email exists, a link has been sent. Check your inbox (and spam) in the next minute.",
};

function uniformResponse() {
  return NextResponse.json(UNIFORM_BODY, { status: 200 });
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  if (forwarded) return forwarded;
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    // IP gate FIRST — before body parsing. A flood of malformed bodies
    // would otherwise bypass rate limiting entirely (codex review).
    const ip = clientIp(request);
    const ipGate = await isRateLimited({
      route: "trackOrder",
      ip,
      gates: ["ip"],
    });
    if (ipGate.limited) return uniformResponse();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return uniformResponse();
    }

    const parsed = inputSchema.safeParse(body);
    if (!parsed.success) return uniformResponse();
    const { email, displayId } = parsed.data;

    // Email gate (post-parse, since we need the email).
    const emailGate = await isRateLimited({
      route: "trackOrder",
      ip,
      email,
      gates: ["email"],
    });
    if (emailGate.limited) return uniformResponse();

    const supabase = serviceSupabase();
    if (!supabase) return uniformResponse();

    const { data, error } = await supabase
      .from("orders")
      .select("display_id, email")
      .eq("display_id", displayId)
      .eq("email", email)
      .maybeSingle();

    if (error) {
      // Log internally, present uniform success outwardly.
      captureException(error, {
        tags: { route: "track-order" },
      });
      return uniformResponse();
    }

    if (data?.display_id && data.email) {
      // AWAIT the send so the serverless function doesn't freeze before
      // it completes. Failures are logged internally; the caller still
      // sees the uniform success body (so failure ≠ enumeration signal).
      try {
        await sendOrderViewLink({
          displayId: data.display_id,
          email: data.email,
        });
      } catch (sendErr) {
        captureException(sendErr, {
          tags: { route: "track-order", phase: "send" },
        });
      }
    }

    return uniformResponse();
  } catch (err) {
    // Any uncaught throw becomes a uniform 200 too — never let an
    // exception path differentiate the response shape.
    captureException(err, { tags: { route: "track-order", phase: "outer" } });
    return uniformResponse();
  }
}
