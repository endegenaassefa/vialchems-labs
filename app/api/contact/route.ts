import { NextResponse, type NextRequest } from 'next/server';

/**
 * Contact-form stub. Phase 5 returns a JSON ok response without persisting
 * the submission. Phase 7 will wire this to Resend + Supabase via the same
 * pattern used for buyer qualification.
 *
 * The endpoint validates payload shape and rejects empty fields; that is
 * enough for the contact page to test its happy + error paths today and for
 * the Phase-7 wiring to slot in without a contract change.
 */
export const dynamic = 'force-dynamic';

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

export async function POST(req: NextRequest) {
  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_json' },
      { status: 400 },
    );
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message =
    typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: 'missing_fields' },
      { status: 400 },
    );
  }

  // Phase 5: log-and-ack, no persistence.
  return NextResponse.json({ ok: true });
}
