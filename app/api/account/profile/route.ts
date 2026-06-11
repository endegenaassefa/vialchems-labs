/**
 * GET + PATCH /api/account/profile — read + edit the signed-in
 * customer's profile row.
 *
 * GET: returns { profile: {...fields...} } for the authenticated
 *   customer. 401 if no session, 503 in stub-mode.
 * PATCH: accepts profileEditSchema; DOB is silently stripped per
 *   spec §3.5 (immutable). Returns the updated profile shape.
 *
 * Email change is intentionally NOT permitted via this endpoint —
 * spec §3.5 mandates a re-verification flow. A future
 * /api/account/email-change endpoint owns that.
 */
import { NextResponse, type NextRequest } from "next/server";
import { extractAuthenticatedUser } from "@/lib/auth/extract-user";
import { serviceSupabase } from "@/lib/supabase";
import { profileEditSchema } from "@/lib/validation/customer";
import { captureException } from "@/lib/sentry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROFILE_SELECT =
  "id, email, phone, full_name, date_of_birth, research_org_type, research_org_other, research_focus, status, email_confirmed_at, created_at";

async function loadProfile(
  supabase: ReturnType<typeof serviceSupabase>,
  authUserId: string,
) {
  if (!supabase) throw new Error("supabase_unavailable");
  return supabase
    .from("customer_profiles")
    .select(PROFILE_SELECT)
    .eq("auth_user_id", authUserId)
    .maybeSingle();
}

export async function GET(request: NextRequest) {
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
  const supabase = serviceSupabase()!;
  try {
    const res = await loadProfile(supabase, auth.user.id);
    if (res.error) {
      captureException(res.error, {
        tags: { route: "account/profile", phase: "get" },
      });
      return NextResponse.json(
        { ok: false, code: "internal_error" },
        { status: 500 },
      );
    }
    if (!res.data) {
      // Existing magic-link customer with no profile yet — surface
      // the "complete profile" hint.
      return NextResponse.json(
        { ok: true, profile: null, needs_completion: true },
        { status: 200 },
      );
    }
    return NextResponse.json({ ok: true, profile: res.data }, { status: 200 });
  } catch (err) {
    captureException(err, {
      tags: { route: "account/profile", phase: "outer" },
    });
    return NextResponse.json(
      { ok: false, code: "internal_error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
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

  const parsed = profileEditSchema.safeParse(body);
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
  // Per spec §3.5, profileEditSchema strips date_of_birth. Belt-and-
  // suspenders: defensively delete from the patch object.
  //
  // Codex P2 (2026-05-25 checkpoint 6): we need to distinguish between
  // "field omitted" and "field present but empty" so a user who clears
  // their phone number actually clears the DB column rather than
  // silently keeping the old value. We inspect the RAW body for which
  // keys were sent, and pass `null` for the cleared ones.
  const rawBody = body as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  if ("full_name" in rawBody && parsed.data.full_name !== undefined) {
    patch.full_name = parsed.data.full_name;
  }
  if ("phone" in rawBody) {
    // phoneSchema coerces empty string → undefined; interpret that
    // as an explicit clear by writing null. A genuine "no change to
    // phone" request omits the key entirely.
    patch.phone = parsed.data.phone ?? null;
  }
  if (
    "research_org_type" in rawBody &&
    parsed.data.research_org_type !== undefined
  ) {
    patch.research_org_type = parsed.data.research_org_type;
  }
  if ("research_org_other" in rawBody) {
    patch.research_org_other = parsed.data.research_org_other ?? null;
  }
  if ("research_focus" in rawBody && parsed.data.research_focus !== undefined) {
    patch.research_focus = parsed.data.research_focus;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json(
      { ok: false, code: "no_changes" },
      { status: 400 },
    );
  }

  const supabase = serviceSupabase()!;
  try {
    const update = await supabase
      .from("customer_profiles")
      .update(patch)
      .eq("auth_user_id", auth.user.id)
      .eq("status", "active")
      .select(PROFILE_SELECT)
      .maybeSingle();
    if (update.error) {
      captureException(update.error, {
        tags: { route: "account/profile", phase: "update" },
      });
      return NextResponse.json(
        { ok: false, code: "internal_error" },
        { status: 500 },
      );
    }
    if (!update.data) {
      // The customer's profile is either missing or not active.
      return NextResponse.json(
        { ok: false, code: "profile_not_editable" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: true, profile: update.data },
      { status: 200 },
    );
  } catch (err) {
    captureException(err, {
      tags: { route: "account/profile", phase: "outer" },
    });
    return NextResponse.json(
      { ok: false, code: "internal_error" },
      { status: 500 },
    );
  }
}
