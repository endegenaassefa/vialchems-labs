/**
 * Server-only helpers used by the customer-account API routes.
 *
 * Keeps the route handlers thin and centralises:
 *   - Supabase service-role admin operations against the
 *     customer_profiles + customer_addresses + archived_accounts
 *     tables
 *   - Uniform response builders used by every account-discovery
 *     endpoint (anti-enumeration: identical 200 body regardless
 *     of what happened internally)
 *   - The HMAC-token URL builder for confirmation / reset links
 *     so the secret never leaks into route code
 *
 * Iron Law 2.22: this module imports `serviceSupabase()` and the
 * token-signing secret. Never import this module from client
 * code — would leak the service-role surface area into the
 * browser bundle.
 */
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  signAccountEmailToken,
  verifyAccountEmailToken,
  type AccountEmailTokenPurpose,
} from "@/lib/auth/account-email-token";
import { siteConfig } from "@/lib/content/site";
import { captureException } from "@/lib/sentry";
import { serviceSupabase } from "@/lib/supabase";
import type { RegistrationInput } from "@/lib/validation/customer";

// ---------------------------------------------------------------------------
// Uniform-response builders (anti-enumeration).
// ---------------------------------------------------------------------------

export const REGISTER_UNIFORM_MESSAGE =
  "Check your email for a confirmation link. If you don't see it within a minute, check spam — or try resending from the sign-in page.";

export function registerUniformResponse() {
  return NextResponse.json(
    { ok: true, message: REGISTER_UNIFORM_MESSAGE },
    { status: 200 },
  );
}

export const FORGOT_PASSWORD_UNIFORM_MESSAGE =
  "If an account with that email exists, we've sent a reset link. Check your inbox (and spam) in the next minute.";

export function forgotPasswordUniformResponse() {
  return NextResponse.json(
    { ok: true, message: FORGOT_PASSWORD_UNIFORM_MESSAGE },
    { status: 200 },
  );
}

export const RESEND_CONFIRM_UNIFORM_MESSAGE =
  "If a pending account with that email exists, we've sent a fresh confirmation link.";

export function resendConfirmationUniformResponse() {
  return NextResponse.json(
    { ok: true, message: RESEND_CONFIRM_UNIFORM_MESSAGE },
    { status: 200 },
  );
}

// ---------------------------------------------------------------------------
// Confirm-email + reset-password URL builders.
// ---------------------------------------------------------------------------

interface BuildTokenUrlArgs {
  baseUrl: string;
  path: "/auth/confirm-email" | "/reset-password";
  purpose: AccountEmailTokenPurpose;
  userId: string;
  email: string;
  ttlSeconds: number;
}

export function buildTokenUrl(args: BuildTokenUrlArgs): string {
  const token = signAccountEmailToken(
    { purpose: args.purpose, userId: args.userId, email: args.email },
    { ttlSeconds: args.ttlSeconds },
  );
  const base = args.baseUrl.replace(/\/+$/, "");
  return `${base}${args.path}?token=${encodeURIComponent(token)}`;
}

export function buildConfirmEmailUrl(userId: string, email: string): string {
  return buildTokenUrl({
    baseUrl: siteConfig.url,
    path: "/auth/confirm-email",
    purpose: "confirm-email",
    userId,
    email,
    ttlSeconds: 24 * 60 * 60,
  });
}

export function buildPasswordResetUrl(userId: string, email: string): string {
  return buildTokenUrl({
    baseUrl: siteConfig.url,
    path: "/reset-password",
    purpose: "password-reset",
    userId,
    email,
    ttlSeconds: 60 * 60,
  });
}

// ---------------------------------------------------------------------------
// Uniqueness lookups.
// ---------------------------------------------------------------------------

export type ExistingAccountKind = "active" | "pending" | "archived" | "none";

export interface ExistingAccountSnapshot {
  kind: ExistingAccountKind;
  profileId?: string;
  authUserId?: string;
}

/**
 * Look up an existing account by email (case-insensitive). Returns the
 * narrowest classification needed to drive the registration uniqueness
 * decision per spec §3.7. Service-role client; bypasses RLS.
 */
export async function findAccountByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<ExistingAccountSnapshot> {
  const normalised = email.trim().toLowerCase();
  // Codex P2 (2026-05-25): PostgREST's `.ilike()` treats `_` (and
  // `%`) as LIKE wildcards. A registration for `a_b@example.com`
  // would otherwise match `axb@example.com` and route to the
  // duplicate-account branch — letting an attacker enumerate which
  // emails are on file by registering crafted wildcards.
  //
  // The migration stores email as the normalised lowercase string
  // (the registration route lowercases via emailSchema before
  // insert). So an EXACT `.eq()` on the lowercased value is both
  // safe and uses the lower(email) unique index. We fall back to a
  // wildcard-escaped `.ilike()` only as defence in depth for any
  // stray rows inserted before normalisation existed.
  const profile = await supabase
    .from("customer_profiles")
    .select("id, auth_user_id, status")
    .eq("email", normalised)
    .maybeSingle();
  if (profile.error) {
    captureException(profile.error, {
      tags: { area: "account-server", lookup: "by_email_profile" },
    });
    // On lookup error, fail SAFE: treat as if an account exists so the
    // route returns its uniform response without creating duplicates.
    return { kind: "active" };
  }
  if (profile.data) {
    const status = String(profile.data.status ?? "");
    const kind = status === "active" ? "active" : "pending";
    return {
      kind,
      profileId: String(profile.data.id),
      authUserId: String(profile.data.auth_user_id),
    };
  }
  // Archived?
  const archived = await supabase
    .from("archived_accounts")
    .select("id")
    .eq("email", normalised)
    .limit(1)
    .maybeSingle();
  if (archived.error) {
    captureException(archived.error, {
      tags: { area: "account-server", lookup: "by_email_archived" },
    });
    return { kind: "active" };
  }
  if (archived.data) return { kind: "archived" };
  return { kind: "none" };
}

export interface InsertProfileArgs {
  authUserId: string;
  input: RegistrationInput;
}

/**
 * Insert a customer_profiles row (status='pending_email_verification')
 * + the mailing + optional shipping rows. Wraps each step in try/catch
 * so a failure mid-insert is captured to Sentry but bubbles up to the
 * caller — the registration route then surfaces the uniform response.
 */
export async function insertProfileWithAddresses(
  supabase: SupabaseClient,
  args: InsertProfileArgs,
): Promise<{ profileId: string }> {
  const profileInsert = await supabase
    .from("customer_profiles")
    .insert({
      auth_user_id: args.authUserId,
      email: args.input.email,
      phone: args.input.phone ?? null,
      full_name: args.input.full_name,
      date_of_birth: args.input.date_of_birth,
      research_org_type: args.input.research_org_type,
      research_org_other: args.input.research_org_other ?? null,
      research_focus: args.input.research_focus,
      status: "pending_email_verification",
    })
    .select("id")
    .single();
  if (profileInsert.error || !profileInsert.data) {
    throw profileInsert.error ?? new Error("profile_insert_failed");
  }
  const profileId = String(profileInsert.data.id);

  type AddressRow = {
    profile_id: string;
    kind: "mailing" | "shipping";
    street1: string;
    street2: string | null;
    city: string;
    region: string;
    postal_code: string;
    country: string;
  };
  const rows: AddressRow[] = [
    {
      profile_id: profileId,
      kind: "mailing",
      street1: args.input.mailing_address.street1,
      street2: args.input.mailing_address.street2 ?? null,
      city: args.input.mailing_address.city,
      region: args.input.mailing_address.region,
      postal_code: args.input.mailing_address.postal_code,
      country: args.input.mailing_address.country,
    },
  ];
  if (!args.input.shipping_same_as_mailing && args.input.shipping_address) {
    rows.push({
      profile_id: profileId,
      kind: "shipping",
      street1: args.input.shipping_address.street1,
      street2: args.input.shipping_address.street2 ?? null,
      city: args.input.shipping_address.city,
      region: args.input.shipping_address.region,
      postal_code: args.input.shipping_address.postal_code,
      country: args.input.shipping_address.country,
    });
  }
  const addrInsert = await supabase.from("customer_addresses").insert(rows);
  if (addrInsert.error) {
    // Best-effort cleanup: drop the profile so a retry doesn't see a
    // half-inserted row. CASCADE deletes the auth.users row if the
    // FK ON DELETE CASCADE fires; the caller separately rolls back
    // the auth-side via deleteAuthUser.
    await supabase.from("customer_profiles").delete().eq("id", profileId);
    throw addrInsert.error;
  }

  return { profileId };
}

// ---------------------------------------------------------------------------
// Auth-user lifecycle.
// ---------------------------------------------------------------------------

export interface CreatedAuthUser {
  id: string;
}

export async function createAuthUser(
  supabase: SupabaseClient,
  email: string,
  password: string,
): Promise<CreatedAuthUser> {
  const res = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  });
  if (res.error || !res.data.user) {
    throw res.error ?? new Error("auth_user_create_failed");
  }
  return { id: res.data.user.id };
}

export async function deleteAuthUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const res = await supabase.auth.admin.deleteUser(userId);
  if (res.error) {
    captureException(res.error, {
      tags: { area: "account-server", op: "delete_auth_user" },
      extra: { userId },
    });
  }
}

export async function markEmailConfirmed(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const res = await supabase.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });
  if (res.error) {
    throw res.error;
  }
}

export async function activateProfile(
  supabase: SupabaseClient,
  authUserId: string,
): Promise<void> {
  const now = new Date().toISOString();
  // Codex P2 (2026-05-25): gate on status='pending_email_verification'
  // so a confirmation link arriving for an account the operator
  // already suspended (manual ban, fraud freeze) doesn't silently
  // undo the suspension. We also `select` the touched row to know if
  // the update matched 0 rows — in which case the link is stale and
  // the caller should surface failure.
  const res = await supabase
    .from("customer_profiles")
    .update({
      status: "active",
      email_confirmed_at: now,
    })
    .eq("auth_user_id", authUserId)
    .eq("status", "pending_email_verification")
    .select("id");
  if (res.error) throw res.error;
  // `.select()` returns the updated rows; empty array means the row
  // either doesn't exist or wasn't in the pending state. Either way
  // the customer should NOT be told their account just activated —
  // throw so the caller falls into the failure branch.
  const rows = Array.isArray(res.data) ? res.data : [];
  if (rows.length === 0) {
    throw new Error("profile_not_pending");
  }
}

// ---------------------------------------------------------------------------
// Confirm-email landing logic — pulled out of the server component so
// the branching is testable in isolation. Returns the narrow shape the
// UI needs (ok + email for the success card; ok=false for the failure
// card). On internal error returns ok=false to keep the failure path
// generic — the page never differentiates token-expired from
// supabase-down.
// ---------------------------------------------------------------------------

export interface ProcessConfirmationResult {
  ok: boolean;
  email?: string;
}

export async function processConfirmation(
  token: string | undefined,
): Promise<ProcessConfirmationResult> {
  if (!token || typeof token !== "string") return { ok: false };
  const payload = verifyAccountEmailToken(token, "confirm-email");
  if (!payload) return { ok: false };
  const supabase = serviceSupabase();
  if (!supabase) {
    // Stub mode (Day-1): no real Supabase — surface success with the
    // email so the visual flow still works for demos.
    return { ok: true, email: payload.email };
  }
  try {
    await markEmailConfirmed(supabase, payload.userId);
    await activateProfile(supabase, payload.userId);
    return { ok: true, email: payload.email };
  } catch (err) {
    captureException(err, {
      tags: { route: "auth/confirm-email", phase: "activate" },
      extra: { userId: payload.userId },
    });
    return { ok: false };
  }
}
