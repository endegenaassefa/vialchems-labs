/**
 * Phase 10.1 (v4) — Supabase clients.
 *
 * Two clients:
 *   - browserSupabase(): anon-key client for client components / RSC where
 *     the caller is the buyer (auth.uid() drives RLS).
 *   - serviceSupabase(): service-role key client for server-only paths
 *     (webhooks, scheduled jobs, audit-log writes). NEVER export this from
 *     a client module — Iron Law 2.22.
 *
 * REQUIRE_SUPABASE=false is the Day-1 default. When false, browserSupabase()
 * returns null and callers must degrade gracefully (no-op writes, fall back
 * to sessionStorage / in-memory state). When true, missing creds throw.
 *
 * Iron Law 2.22: service-role key is read from process.env.SUPABASE_SERVICE_ROLE_KEY
 * which is server-side only. The .env.local file is gitignored.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { envFlag, isProductionRuntime } from "@/lib/runtime-env";

let cachedBrowser: SupabaseClient | null | undefined;
let cachedService: SupabaseClient | null | undefined;

function require(value: string | undefined, name: string): string {
  if (!value || value.length === 0) {
    throw new Error(
      `Phase 10.1: REQUIRE_SUPABASE=true but ${name} is empty. Provide a real value in .env.local before deploying.`,
    );
  }
  return value;
}

function isRequired(): boolean {
  if (isProductionRuntime()) {
    return !envFlag("ALLOW_SUPABASE_OPTIONAL_IN_PRODUCTION");
  }
  return process.env.REQUIRE_SUPABASE === "true";
}

/**
 * Returns null when REQUIRE_SUPABASE=false (Day-1) so call sites can fall
 * through to a stub path without throwing. Returns the cached anon client
 * otherwise.
 */
export function browserSupabase(): SupabaseClient | null {
  if (cachedBrowser !== undefined) return cachedBrowser;
  if (!isRequired()) {
    cachedBrowser = null;
    return null;
  }
  const url = require(process.env
    .NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
  const anon = require(process.env
    .NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
  cachedBrowser = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cachedBrowser;
}

/**
 * Server-only service-role client. Throws if REQUIRE_SUPABASE=true and the
 * key is missing — callers in webhook routes MUST be ready for that, since
 * silently no-op'ing on missing creds would hide misconfiguration.
 */
export function serviceSupabase(): SupabaseClient | null {
  if (cachedService !== undefined) return cachedService;
  if (!isRequired()) {
    cachedService = null;
    return null;
  }
  const url = require(process.env
    .NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
  const service = require(process.env
    .SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY");
  cachedService = createClient(url, service, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: { schema: "public" },
  });
  return cachedService;
}

/** Test-only — drop the cached singletons between vitest cases. */
export function _resetSupabaseCachesForTests(): void {
  cachedBrowser = undefined;
  cachedService = undefined;
}
