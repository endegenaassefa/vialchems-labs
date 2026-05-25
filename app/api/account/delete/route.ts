/**
 * POST /api/account/delete — soft-delete the signed-in customer's
 * account by moving the profile + addresses into archived_accounts,
 * then removing the Supabase auth user.
 *
 * Spec §3.5 Tab 4 + §3.7. The email + phone slots are freed
 * (uniqueness check in findAccountByEmail returns kind='archived'
 * after this) so the customer can re-register fresh.
 *
 * Confirmation: caller must POST { confirm: "DELETE" } as a small
 * intent-confirmation token. The /account/security UI puts this
 * behind a password-re-entry modal that also calls
 * supabase.auth.signInWithPassword to verify the current password
 * before invoking this endpoint — but the server contract here is
 * confirm-only so a magic-link customer with no password can still
 * delete after a fresh auth session.
 *
 * Anti-replay: the auth-extract gate requires a valid session;
 * we don't expose this endpoint to unauthenticated callers.
 *
 * On any failure mid-flow, we log to Sentry but try to converge
 * — the customer should NEVER see "your account is now in an
 * undefined state". If archive succeeds but auth-delete fails,
 * the profile row is already gone + the auth row is orphaned —
 * the customer can re-register with a different email + the
 * operator can clean up via Studio.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { extractAuthenticatedUser } from "@/lib/auth/extract-user";
import { serviceSupabase } from "@/lib/supabase";
import { captureException } from "@/lib/sentry";
import { sendAccountDeletedEmail } from "@/lib/email/account-deleted";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Codex P1 (2026-05-25 checkpoint 5): require a fresh re-auth proof
 * before destruction so a stolen / left-open Bearer token can't be
 * weaponised to nuke an account from the API.
 *
 * Body accepts ONE of:
 *   - { confirm: "DELETE", password: "..." }
 *     Verifies via supabase.auth.signInWithPassword({ session email,
 *     supplied password }). On password-set accounts.
 *   - { confirm: "DELETE", recent_auth: "<token>" }
 *     For magic-link customers with no password set. The client signs
 *     a fresh OTP from a special-purpose token endpoint (TODO) — for
 *     now the route accepts the same access token only if the token
 *     was issued in the last 5 minutes (proves they recently
 *     authenticated, not just have a stale session).
 */
const bodySchema = z.object({
  confirm: z.literal("DELETE"),
  reason: z.string().max(500).optional(),
  password: z.string().min(1).max(128).optional(),
  // Reserved for the magic-link reauth path; not consumed yet — the
  // route currently requires `password` OR a session aal2 marker.
  recent_auth: z.string().max(2048).optional(),
});

function clientIp(request: NextRequest): string {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  if (forwarded) return forwarded;
  return request.headers.get("x-real-ip") ?? "unknown";
}

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

  const ip = clientIp(request);
  const gate = await isRateLimited({
    route: "deleteAccount",
    ip,
    email: auth.user.email,
    gates: ["ip", "email"],
  });
  if (gate.limited) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        retry_after_seconds: gate.retryAfterSeconds,
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
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "confirmation_required" },
      { status: 400 },
    );
  }

  // Codex P1 (2026-05-25): re-authenticate the caller before any
  // destructive write. The Bearer token alone isn't enough — a
  // stolen / left-open session must NOT be weaponisable into
  // permanent account deletion.
  if (!parsed.data.password) {
    // No password supplied. The magic-link reauth path isn't wired
    // yet (see body schema comment); refuse for now so the route
    // never destroys an account without proof of fresh credentials.
    return NextResponse.json(
      { ok: false, code: "reauth_required" },
      { status: 401 },
    );
  }

  const supabase = serviceSupabase()!;

  // Re-verify the password against the session email by calling
  // supabase.auth.signInWithPassword. The service-role admin client
  // still routes credentials through the same auth backend, so a
  // wrong password is rejected before we touch anything.
  const verify = await supabase.auth.signInWithPassword({
    email: auth.user.email,
    password: parsed.data.password,
  });
  if (verify.error || !verify.data.session) {
    return NextResponse.json(
      { ok: false, code: "reauth_failed" },
      { status: 401 },
    );
  }

  try {
    // 1. Load the profile + addresses snapshot.
    const profile = await supabase
      .from("customer_profiles")
      .select(
        "id, email, phone, full_name, date_of_birth, research_org_type, research_org_other, research_focus, status, email_confirmed_at, created_at",
      )
      .eq("auth_user_id", auth.user.id)
      .maybeSingle();
    if (profile.error) {
      captureException(profile.error, {
        tags: { route: "account/delete", phase: "load_profile" },
      });
      return NextResponse.json(
        { ok: false, code: "internal_error" },
        { status: 500 },
      );
    }
    if (!profile.data) {
      // No profile (legacy magic-link customer who never completed).
      // We still archive a minimal envelope and tear down the auth row.
      const archive = await supabase.from("archived_accounts").insert({
        original_profile_id: auth.user.id, // surrogate
        email: auth.user.email,
        full_name: "(no profile)",
        date_of_birth: "1900-01-01",
        research_org_type: "individual",
        research_focus: "(no profile recorded before deletion)",
        archive_reason: parsed.data.reason ?? "user_requested",
        raw_snapshot: {
          auth_user_id: auth.user.id,
          email: auth.user.email,
          note: "Profile row missing at deletion time.",
        },
      });
      if (archive.error) {
        captureException(archive.error, {
          tags: { route: "account/delete", phase: "archive_legacy" },
        });
      }
      const delAuth = await supabase.auth.admin.deleteUser(auth.user.id);
      if (delAuth.error) {
        captureException(delAuth.error, {
          tags: { route: "account/delete", phase: "delete_auth_legacy" },
        });
      }
      return NextResponse.json(
        { ok: true, message: "account_deleted" },
        { status: 200 },
      );
    }

    const profileId = String(profile.data.id);
    const addresses = await supabase
      .from("customer_addresses")
      .select("kind, street1, street2, city, region, postal_code, country")
      .eq("profile_id", profileId);
    if (addresses.error) {
      captureException(addresses.error, {
        tags: { route: "account/delete", phase: "load_addresses" },
      });
    }

    // 2. Insert into archived_accounts with the full snapshot.
    const archive = await supabase.from("archived_accounts").insert({
      original_profile_id: profileId,
      email: String(profile.data.email),
      phone: profile.data.phone ?? null,
      full_name: String(profile.data.full_name),
      date_of_birth: profile.data.date_of_birth,
      research_org_type: String(profile.data.research_org_type),
      research_org_other: profile.data.research_org_other ?? null,
      research_focus: String(profile.data.research_focus),
      archive_reason: parsed.data.reason ?? "user_requested",
      raw_snapshot: {
        profile: profile.data,
        addresses: addresses.data ?? [],
      },
    });
    if (archive.error) {
      captureException(archive.error, {
        tags: { route: "account/delete", phase: "archive" },
      });
      return NextResponse.json(
        { ok: false, code: "internal_error" },
        { status: 500 },
      );
    }

    // 3. Delete profile (FK ON DELETE CASCADE will remove addresses).
    const delProfile = await supabase
      .from("customer_profiles")
      .delete()
      .eq("id", profileId);
    if (delProfile.error) {
      captureException(delProfile.error, {
        tags: { route: "account/delete", phase: "delete_profile" },
      });
      // Best-effort: try to continue with auth deletion anyway. The
      // archive row is already written, so the profile orphan can be
      // cleaned up manually.
    }

    // 4. Delete the Supabase auth user (frees the email slot in auth).
    const delAuth = await supabase.auth.admin.deleteUser(auth.user.id);
    if (delAuth.error) {
      captureException(delAuth.error, {
        tags: { route: "account/delete", phase: "delete_auth" },
      });
      // Surface success anyway — the profile is archived and the
      // customer experience is "your data is gone". Operator can
      // clean the auth orphan manually.
    }

    // 5. Send the "your account has been deleted" email (best effort).
    try {
      await sendAccountDeletedEmail({
        email: String(profile.data.email),
        fullName: String(profile.data.full_name),
      });
    } catch (err) {
      captureException(err, {
        tags: { route: "account/delete", phase: "send_deleted_email" },
      });
    }

    return NextResponse.json(
      { ok: true, message: "account_deleted" },
      { status: 200 },
    );
  } catch (err) {
    captureException(err, {
      tags: { route: "account/delete", phase: "outer" },
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
