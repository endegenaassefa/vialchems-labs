import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

// CSO interim hardening (2026-05-14): brute-force protection for ops
// sign-in. The shared OPS_API_TOKEN is the single gate to every ops
// capability, so /api/ops/session must not accept unlimited guesses.
//
// Backed by the ops_auth_attempts table (migration 20260514000001). Every
// sign-in attempt is recorded; new attempts from an IP are refused once
// PER_IP_MAX recent FAILED attempts are crossed (self-healing — attempts
// age out of the window).
//
// Per-IP only, deliberately. An earlier draft also had a global counter to
// catch X-Forwarded-For rotation, but a global hard-lock is itself a DoS:
// any anonymous caller could fire GLOBAL_MAX bad guesses and lock every
// staff member out of sign-in. A self-inflicted outage is worse than the
// rotation it defended against. An attacker who spoofs X-Forwarded-For can
// still spread guesses across buckets — the real protection there is the
// entropy of OPS_API_TOKEN itself, and the planned per-staff auth (with
// per-account lockout) is what closes it properly.
//
// Fail-open by design: if the backing queries error, sign-in still works.
// A database blip disabling brute-force protection is far less bad than a
// database blip locking every staff member out of order fulfillment.

const WINDOW_MINUTES = 15;
const PER_IP_MAX = 10;

const WINDOW_MS = WINDOW_MINUTES * 60_000;
const RETRY_AFTER_SECONDS = WINDOW_MINUTES * 60;

// Hashes the client IP so the rate-limit table never stores raw addresses.
// A missing IP collapses to a single "unknown" bucket on purpose — an
// attacker who strips X-Forwarded-For shares one aggressive limit.
export function hashIp(ip: string | null | undefined): string {
  return createHash("sha256")
    .update(ip && ip.length > 0 ? ip : "unknown")
    .digest("hex");
}

export interface RateLimitResult {
  allowed: boolean;
  reason?: "per_ip_locked";
  retryAfterSeconds?: number;
}

export async function checkOpsAuthRateLimit(
  supabase: SupabaseClient,
  ipHash: string,
): Promise<RateLimitResult> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const perIp = await supabase
    .from("ops_auth_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("succeeded", false)
    .gte("attempted_at", since);
  if (!perIp.error && (perIp.count ?? 0) >= PER_IP_MAX) {
    return {
      allowed: false,
      reason: "per_ip_locked",
      retryAfterSeconds: RETRY_AFTER_SECONDS,
    };
  }

  return { allowed: true };
}

// Records one sign-in attempt. On success it also clears that IP's prior
// failures so a staff member who fat-fingered the token a few times isn't
// left one mistake away from a lockout. Best-effort: errors are swallowed
// so a logging hiccup never blocks a legitimate sign-in. Also purges rows
// outside the window so the table stays small without a scheduled job.
export async function recordOpsAuthAttempt(
  supabase: SupabaseClient,
  ipHash: string,
  succeeded: boolean,
): Promise<void> {
  try {
    await supabase
      .from("ops_auth_attempts")
      .insert({ ip_hash: ipHash, succeeded });

    if (succeeded) {
      await supabase
        .from("ops_auth_attempts")
        .delete()
        .eq("ip_hash", ipHash)
        .eq("succeeded", false);
    }

    const cutoff = new Date(Date.now() - WINDOW_MS).toISOString();
    await supabase
      .from("ops_auth_attempts")
      .delete()
      .lt("attempted_at", cutoff);
  } catch {
    // Best-effort — never block sign-in on a logging failure.
  }
}
