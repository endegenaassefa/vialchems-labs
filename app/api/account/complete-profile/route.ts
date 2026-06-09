/**
 * POST /api/account/complete-profile — legacy magic-link customer
 * migration. Creates a customer_profiles row + addresses for an
 * already-authenticated user who never registered through /register.
 *
 * Spec §3.8. Pre-conditions:
 *   - Caller is authenticated (Supabase session via Bearer or cookie)
 *   - No existing customer_profiles row for their auth_user_id
 *
 * Pipeline:
 *   1. Validate body with completeProfileSchema
 *   2. Refuse if a profile already exists (use the dashboard
 *      Edit affordance instead)
 *   3. Insert profile row with status='active' (we trust the
 *      Supabase auth session as proof of email ownership; no
 *      separate email-confirmation step needed)
 *   4. Insert mailing + optional shipping rows
 *   5. Return { ok: true }
 *
 * Failures are differentiated (the client surfaces "couldn't save"
 * and the user can retry) because this isn't an anti-enumeration
 * path — caller is already authenticated.
 */
import { NextResponse, type NextRequest } from "next/server";
import { extractAuthenticatedUser } from "@/lib/auth/extract-user";
import { serviceSupabase } from "@/lib/supabase";
import { captureException } from "@/lib/sentry";
import { completeProfileSchema } from "@/lib/validation/customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await extractAuthenticatedUser(request);
  if (auth.kind === "supabase_unavailable") {
    return NextResponse.json(
      { ok: false, code: "supabase_unavailable" },
      { status: 503 },
    );
  }
  if (auth.kind !== "ok") {
    return NextResponse.json(
      { ok: false, code: "unauthorized" },
      { status: 401 },
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

  const parsed = completeProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_body",
        errors: parsed.error.issues.map((i) => ({
          path: i.path,
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // The session's email is the source of truth; ignore any
  // tampered email on the body and use the auth session.
  if (
    input.email.trim().toLowerCase() !== auth.user.email.trim().toLowerCase()
  ) {
    return NextResponse.json(
      { ok: false, code: "email_mismatch" },
      { status: 400 },
    );
  }

  const supabase = serviceSupabase()!;
  try {
    const existing = await supabase
      .from("customer_profiles")
      .select("id")
      .eq("auth_user_id", auth.user.id)
      .maybeSingle();
    if (existing.error) {
      captureException(existing.error, {
        tags: { route: "account/complete-profile", phase: "lookup" },
      });
      return NextResponse.json(
        { ok: false, code: "internal_error" },
        { status: 500 },
      );
    }
    if (existing.data) {
      return NextResponse.json(
        { ok: false, code: "profile_already_exists" },
        { status: 400 },
      );
    }

    const profileInsert = await supabase
      .from("customer_profiles")
      .insert({
        auth_user_id: auth.user.id,
        email: input.email,
        phone: input.phone ?? null,
        full_name: input.full_name,
        date_of_birth: input.date_of_birth,
        research_org_type: input.research_org_type,
        research_org_other: input.research_org_other ?? null,
        research_focus: input.research_focus,
        // Trust the Supabase session as proof of email ownership —
        // they already received and clicked a confirmation/magic
        // link to get here. Set status active directly.
        status: "active",
        email_confirmed_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (profileInsert.error || !profileInsert.data) {
      captureException(
        profileInsert.error ?? new Error("profile_insert_failed"),
        {
          tags: { route: "account/complete-profile", phase: "insert_profile" },
        },
      );
      return NextResponse.json(
        { ok: false, code: "internal_error" },
        { status: 500 },
      );
    }
    const profileId = String(profileInsert.data.id);

    type AddrRow = {
      profile_id: string;
      kind: "mailing" | "shipping";
      street1: string;
      street2: string | null;
      city: string;
      region: string;
      postal_code: string;
      country: string;
    };
    const rows: AddrRow[] = [
      {
        profile_id: profileId,
        kind: "mailing",
        street1: input.mailing_address.street1,
        street2: input.mailing_address.street2 ?? null,
        city: input.mailing_address.city,
        region: input.mailing_address.region,
        postal_code: input.mailing_address.postal_code,
        country: input.mailing_address.country,
      },
    ];
    if (!input.shipping_same_as_mailing && input.shipping_address) {
      rows.push({
        profile_id: profileId,
        kind: "shipping",
        street1: input.shipping_address.street1,
        street2: input.shipping_address.street2 ?? null,
        city: input.shipping_address.city,
        region: input.shipping_address.region,
        postal_code: input.shipping_address.postal_code,
        country: input.shipping_address.country,
      });
    }
    const addrInsert = await supabase.from("customer_addresses").insert(rows);
    if (addrInsert.error) {
      captureException(addrInsert.error, {
        tags: {
          route: "account/complete-profile",
          phase: "insert_addresses",
        },
      });
      // Roll the profile back so a retry doesn't see a half-baked row.
      await supabase.from("customer_profiles").delete().eq("id", profileId);
      return NextResponse.json(
        { ok: false, code: "internal_error" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    captureException(err, {
      tags: { route: "account/complete-profile", phase: "outer" },
    });
    return NextResponse.json(
      { ok: false, code: "internal_error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, code: "method_not_allowed" },
    { status: 405 },
  );
}
