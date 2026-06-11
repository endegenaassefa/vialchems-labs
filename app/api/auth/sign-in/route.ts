/**
 * POST /api/auth/sign-in — pre-flight gate for password sign-in.
 *
 * Codex P1 (2026-05-25 checkpoint 6): the previous version returned
 * `status: "active" | "pending" | "suspended" | "none"` which
 * differentiated existing-from-nonexistent emails BEFORE the
 * password was verified — a public enumeration endpoint. Fix:
 *
 *   - Only return a status discriminator when it materially changes
 *     UX *after* the credential check (currently: nothing). Until
 *     we have a way to fold pending-email handling into the post-
 *     signin path, this route does rate-limiting ONLY and returns
 *     a uniform `{ ok: true }` on every success path.
 *   - The pending-email message is surfaced from the subsequent
 *     supabase.auth.signInWithPassword() call: Supabase returns a
 *     specific error when email_confirm is false, which the client
 *     intercepts. See app/login/page.tsx.
 *
 * Response shape:
 *   200 { ok: true } — proceed to signInWithPassword on the client.
 *   429 { ok: false, code: "rate_limited", retry_after_seconds }
 *   400 { ok: false, code: "invalid_body" }
 */
import { NextResponse, type NextRequest } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { captureException } from "@/lib/sentry";
import { signInWithPasswordSchema } from "@/lib/validation/customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const ip = clientIp(request);
    const ipGate = await isRateLimited({
      route: "signIn",
      ip,
      gates: ["ip"],
    });
    if (ipGate.limited) {
      return NextResponse.json(
        {
          ok: false,
          code: "rate_limited",
          retry_after_seconds: ipGate.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, code: "invalid_body" },
        { status: 400 },
      );
    }

    const parsed = signInWithPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, code: "invalid_body" },
        { status: 400 },
      );
    }
    const { email } = parsed.data;

    const emailGate = await isRateLimited({
      route: "signIn",
      ip,
      email,
      gates: ["email"],
    });
    if (emailGate.limited) {
      return NextResponse.json(
        {
          ok: false,
          code: "rate_limited",
          retry_after_seconds: emailGate.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    // Codex P1 fix (2026-05-25 checkpoint 6): no DB lookup here.
    // The route does rate-limiting ONLY; the actual credential check
    // and any status-dependent branching happens via Supabase Auth
    // on the client. Returning the same `{ ok: true }` for every
    // email — known or unknown — guarantees this endpoint can't be
    // used to enumerate accounts.
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    captureException(err, { tags: { route: "auth/sign-in", phase: "outer" } });
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, code: "method_not_allowed" },
    { status: 405 },
  );
}
