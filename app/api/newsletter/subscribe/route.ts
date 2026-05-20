import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitByIp } from "@/lib/rate-limit";
import { isProductionRuntime } from "@/lib/runtime-env";

/**
 * Newsletter subscribe stub.
 *
 * Phase 7 wires the form + promo code path. Phase 10 connects to real Resend
 * provider with full 4-email welcome sequence (Appendix K). For now: accept
 * email, return success, redirect to /newsletter/thanks.
 *
 * The promo code WELCOME15 is the default 15% off first-order code per
 * SUPER_PROMPT_v3 Appendix E intro promo + Appendix K Email 4. Real generation
 * (per-email unique codes) lands when Phase 10 wires Supabase + Resend.
 *
 * Iron Law 2.34: anti-abuse gate at the head of the handler (5 req / 300s per IP).
 */

const subscribeSchema = z.object({
  email: z.string().email(),
});

export const dynamic = "force-dynamic";

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimitByIp("newsletter", ip);
  if (!limit.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        retryAfter: limit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSeconds),
          "X-RateLimit-Limit": String(limit.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(limit.reset),
        },
      },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";

  let email: string | null = null;
  if (contentType.includes("application/json")) {
    try {
      const json = await request.json();
      const parsed = subscribeSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json(
          { ok: false, error: "invalid_email" },
          { status: 400 },
        );
      }
      email = parsed.data.email;
    } catch {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 },
      );
    }
  } else {
    const form = await request.formData();
    const candidate = form.get("email");
    const parsed = subscribeSchema.safeParse({ email: candidate });
    if (!parsed.success) {
      return NextResponse.redirect(
        new URL("/newsletter?error=invalid_email", request.url),
        303,
      );
    }
    email = parsed.data.email;
  }

  if (!email) {
    return NextResponse.json(
      { ok: false, error: "missing_email" },
      { status: 400 },
    );
  }

  // Phase 10.2 wiring: persist + dispatch welcome sequence. When
  // REQUIRE_SUPABASE=false / REQUIRE_RESEND=false (Day-1 default), both
  // call paths return synthetic stub ids so the form still feels real
  // and the redirect lands.
  let subscriptionId: string | undefined;
  try {
    const sb = (await import("@/lib/supabase")).serviceSupabase();
    if (sb && email) {
      const { data: existing } = await sb
        .from("email_subscriptions")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (existing?.id) {
        subscriptionId = existing.id;
      } else {
        const { data: inserted, error } = await sb
          .from("email_subscriptions")
          .insert({ email, promo_code: "WELCOME15" })
          .select("id")
          .single();
        if (!error && inserted?.id) subscriptionId = inserted.id;
      }
    }
    const dispatcher = await import("@/lib/email/welcome-sequence");
    if (email) {
      await dispatcher.dispatchWelcomeSequence({ email, subscriptionId });
    }
  } catch (error) {
    if (isProductionRuntime()) {
      return NextResponse.json(
        {
          ok: false,
          error: "newsletter_dispatch_failed",
          message: (error as Error).message,
        },
        { status: 502 },
      );
    }
  }

  // Form submissions redirect for non-JS clients.
  if (!contentType.includes("application/json")) {
    return NextResponse.redirect(
      new URL("/newsletter/thanks", request.url),
      303,
    );
  }

  return NextResponse.json({ ok: true, promoCode: "WELCOME15" });
}
