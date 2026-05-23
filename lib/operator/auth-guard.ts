/**
 * C1 — Operator auth-guard helper
 * (Section 6 super-prompt 2026-05-22).
 *
 * Reads the Supabase session via `serviceSupabase()` (server-side),
 * extracts the user's email, and checks it against the
 * `ALLOWED_OPERATOR_EMAILS` env var (comma-separated, default
 * `endegenaassefa2@gmail.com` per the user_operator_identity
 * memory).
 *
 * Returns one of three states so the layout / route can render
 * the right response:
 *   - "authorized"    → operator session valid, render the dashboard
 *   - "unauthenticated" → no session, redirect to /login
 *   - "forbidden"       → session valid but not an operator email
 *
 * When REQUIRE_SUPABASE=false (Day-1 default), the guard returns
 * `"unauthenticated"` so the dashboard renders the "log in to
 * continue" branch rather than crashing.
 */
import { cookies } from "next/headers";
import { serviceSupabase } from "@/lib/supabase";

export type OperatorAuthState = "authorized" | "unauthenticated" | "forbidden";

export interface OperatorAuthCheck {
  state: OperatorAuthState;
  email?: string;
}

function allowedOperators(): string[] {
  const value = process.env.ALLOWED_OPERATOR_EMAILS?.trim();
  if (!value) return ["endegenaassefa2@gmail.com"];
  return value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isOperatorEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return allowedOperators().includes(email.trim().toLowerCase());
}

export async function checkOperatorAuth(): Promise<OperatorAuthCheck> {
  const supabase = serviceSupabase();
  if (!supabase) {
    return { state: "unauthenticated" };
  }
  // The Supabase auth cookie is set by `app/auth/callback/route.ts`
  // after a magic-link exchange. cookies() here is the read-only
  // server side; we delegate the actual JWT verification to
  // Supabase's getUser() which validates the bearer.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  if (!accessToken) {
    return { state: "unauthenticated" };
  }
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user?.email) {
    return { state: "unauthenticated" };
  }
  if (!isOperatorEmail(data.user.email)) {
    return { state: "forbidden", email: data.user.email };
  }
  return { state: "authorized", email: data.user.email };
}
