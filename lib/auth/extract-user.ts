/**
 * Phase 2A4 — shared helper to extract the authenticated Supabase user
 * from either the `sb-access-token` cookie OR an `Authorization: Bearer`
 * header. The browser supabase-js client stores its session in
 * localStorage by default (not cookies), so client-side fetch() calls
 * to our API routes must forward the access token as a Bearer header.
 * The cookie path is preserved for any server-side caller that uses
 * @supabase/ssr.
 *
 * Returns a discriminated union so callers can distinguish "no session"
 * (401 → /login) from "supabase not configured" (503 stub mode).
 */
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { serviceSupabase } from "@/lib/supabase";

export interface ExtractedUser {
  email: string;
  id: string;
}

export type ExtractResult =
  | { kind: "ok"; user: ExtractedUser }
  | { kind: "no_session" }
  | { kind: "supabase_unavailable" };

function readBearer(request: NextRequest | undefined): string | null {
  if (!request) return null;
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export async function extractAuthenticatedUser(
  request?: NextRequest,
): Promise<ExtractResult> {
  const supabase = serviceSupabase();
  if (!supabase) return { kind: "supabase_unavailable" };

  let token = readBearer(request);
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("sb-access-token")?.value ?? null;
  }
  if (!token) return { kind: "no_session" };

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) return { kind: "no_session" };

  return {
    kind: "ok",
    user: { email: data.user.email, id: data.user.id },
  };
}
