import { NextResponse } from 'next/server';
import { z } from 'zod';

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
 */

const subscribeSchema = z.object({
  email: z.string().email(),
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  let email: string | null = null;
  if (contentType.includes('application/json')) {
    try {
      const json = await request.json();
      const parsed = subscribeSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json(
          { ok: false, error: 'invalid_email' },
          { status: 400 },
        );
      }
      email = parsed.data.email;
    } catch {
      return NextResponse.json(
        { ok: false, error: 'invalid_body' },
        { status: 400 },
      );
    }
  } else {
    const form = await request.formData();
    const candidate = form.get('email');
    const parsed = subscribeSchema.safeParse({ email: candidate });
    if (!parsed.success) {
      return NextResponse.redirect(new URL('/newsletter?error=invalid_email', request.url), 303);
    }
    email = parsed.data.email;
  }

  if (!email) {
    return NextResponse.json({ ok: false, error: 'missing_email' }, { status: 400 });
  }

  // PLACEHOLDER: Phase 10 wires this to:
  //   1. Insert into Supabase email_subscriptions table
  //   2. Generate per-email promo code (or assign WELCOME15 default)
  //   3. Trigger Resend welcome-sequence email 1 of 4
  //   4. Schedule emails 2/3/4 at days +3, +7, +14
  // For now, log + redirect.
  // eslint-disable-next-line no-console
  // (intentional: stub diagnostic; replaced in Phase 10)

  // Form submissions redirect for non-JS clients.
  if (!contentType.includes('application/json')) {
    return NextResponse.redirect(new URL('/newsletter/thanks', request.url), 303);
  }

  return NextResponse.json({ ok: true, promoCode: 'WELCOME15' });
}
