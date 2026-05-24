/**
 * B1 — Supabase Auth magic-link wrapper
 * (Section 6 super-prompt 2026-05-22).
 *
 * Replaces the Zustand+PBKDF2 auth flow in `lib/auth-store.ts` as the
 * canonical identity source for new customers. The PBKDF2 path remains
 * for legacy localStorage accounts; new customers go through Supabase
 * Auth's `signInWithOtp` (passwordless magic-link) and the callback
 * handler at `app/auth/callback/route.ts`.
 *
 * Degrades gracefully when REQUIRE_SUPABASE=false (Day-1 default):
 * the underlying `browserSupabase()` returns null, every helper
 * here returns a `{ ok: false, code: "supabase_unavailable" }`
 * response, and the login UI can fall back to a "check your inbox"
 * stub message that won't trigger a real send.
 */
import type { Session, User, AuthChangeEvent } from "@supabase/supabase-js";
import { siteConfig } from "@/lib/content/site";
import { browserSupabase } from "@/lib/supabase";

/**
 * `redirectTo` defaults to the standard `/auth/callback` route — the
 * one that exchanges the magic-link code for a session. Callers may
 * pass a `next` query param via the `redirectTo` argument to drive
 * post-login routing (e.g. back to the cart after the link click).
 */
export interface SignInWithOtpInput {
  email: string;
  redirectTo?: string;
}

export type AuthCallResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; code: "supabase_unavailable" | "auth_error"; message: string };

/**
 * Resolve the magic-link emailRedirectTo URL.
 *
 * Iron Law (super-prompt §7.1): NEVER use window.location.origin.
 * That fallback bakes localhost into the magic link whenever a
 * developer signs up from a dev environment and breaks production
 * traffic where Supabase's redirect-allowlist excludes localhost.
 *
 * Always resolves to a siteConfig.url-rooted URL. Per-callsite override
 * is accepted (used for special flows that want a non-default callback
 * path); when the override is omitted we default to /account.
 *
 * Open-redirect prevention: nextPath must be a same-origin absolute
 * path (starts with "/", not "//"); otherwise we ignore it and use
 * /account.
 */
export function resolveAuthRedirectTo(
  callerOverride?: string,
  nextPath?: string,
): string {
  if (callerOverride) return callerOverride;
  const safeNext =
    nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/account";
  return `${siteConfig.url}/auth/callback?next=${encodeURIComponent(safeNext)}`;
}

export async function signInWithOtp({
  email,
  redirectTo,
}: SignInWithOtpInput): Promise<AuthCallResult> {
  const supabase = browserSupabase();
  if (!supabase) {
    return {
      ok: false,
      code: "supabase_unavailable",
      message:
        "Supabase Auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY + REQUIRE_SUPABASE=true to enable magic-link login.",
    };
  }
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: resolveAuthRedirectTo(redirectTo),
    },
  });
  if (error) {
    return { ok: false, code: "auth_error", message: error.message };
  }
  return { ok: true, data: undefined };
}

export async function signOut(): Promise<AuthCallResult> {
  const supabase = browserSupabase();
  if (!supabase) {
    return {
      ok: false,
      code: "supabase_unavailable",
      message: "Supabase Auth is not configured.",
    };
  }
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { ok: false, code: "auth_error", message: error.message };
  }
  return { ok: true, data: undefined };
}

export async function getSession(): Promise<Session | null> {
  const supabase = browserSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Register a listener for auth-state changes. Returns an unsubscribe
 * function. When Supabase is not configured, the listener is never
 * fired and unsubscribe is a no-op.
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): () => void {
  const supabase = browserSupabase();
  if (!supabase) {
    return () => {};
  }
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => subscription.unsubscribe();
}

export function isSupabaseAuthAvailable(): boolean {
  return browserSupabase() !== null;
}
