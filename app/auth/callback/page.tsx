/**
 * Phase 2A2 — Magic-link callback (client page).
 *
 * Replaces the server-side route handler with a client page because
 * Supabase Auth (with default implicit flow) puts session tokens in
 * the URL fragment (#access_token=&refresh_token=) which never reaches
 * the server. The previous server route only saw the query string and
 * redirected with `?error=missing_code` even on a valid link.
 *
 * The supabase-js browser client is configured with `detectSessionInUrl:
 * true` (lib/supabase.ts) which auto-parses the URL fragment on
 * instantiation, sets the session, and persists it to localStorage.
 * This page just waits for the session to land + navigates to the
 * requested `next` destination.
 *
 * Supports BOTH:
 *   - Implicit flow (default): tokens arrive in URL fragment, supabase
 *     auto-handles + this page just reads getSession()
 *   - PKCE flow (if enabled): `?code=...` query param, this page calls
 *     exchangeCodeForSession before reading getSession()
 *
 * Errors redirect to /login?error=auth_error (or supabase_unavailable
 * when REQUIRE_SUPABASE=false stub mode).
 *
 * react-hooks/set-state-in-effect: this page deliberately does NOT call
 * setState in the effect body — the only state transitions are the
 * router.replace() redirects, which unmount the page entirely.
 */
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { browserSupabase } from "@/lib/supabase";

function safeNext(value: string | null): string {
  if (!value) return "/account?welcome=1";
  if (!value.startsWith("/")) return "/account?welcome=1";
  if (value.startsWith("//")) return "/account?welcome=1";
  // If the destination is /account exactly, tag it as a fresh sign-in so
  // the dashboard shows the welcome pill. Don't add it to deep links.
  if (value === "/account") return "/account?welcome=1";
  return value;
}

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const supabase = browserSupabase();
      if (!supabase) {
        router.replace("/login?error=supabase_unavailable");
        return;
      }

      // With detectSessionInUrl=true (lib/supabase.ts), supabase-js auto-
      // parses tokens from the URL fragment on first read. For PKCE flow
      // ?code=... we exchange explicitly; otherwise getSession() carries
      // the implicit-flow session.
      const code = params.get("code");
      if (code) {
        const exchanged = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (exchanged.error) {
          router.replace(
            `/login?error=auth_error&message=${encodeURIComponent(
              exchanged.error.message,
            )}`,
          );
          return;
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;
      if (error) {
        router.replace(
          `/login?error=auth_error&message=${encodeURIComponent(error.message)}`,
        );
        return;
      }
      if (!data.session) {
        router.replace("/login?error=missing_code");
        return;
      }
      router.replace(safeNext(params.get("next")));
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [params, router]);

  return (
    <main
      id="main"
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p
          className="font-mono"
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "var(--accent)",
            marginBottom: 12,
          }}
        >
          Signing you in
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 500, marginBottom: 12 }}>
          One moment.
        </h1>
        <p style={{ color: "var(--fg-muted)", lineHeight: 1.55 }}>
          Verifying your sign-in link with Supabase Auth. You will be redirected
          to your account shortly.
        </p>
        <p style={{ marginTop: 24, fontSize: 13 }}>
          <Link href="/login" style={{ color: "var(--accent)" }}>
            Back to sign in →
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
