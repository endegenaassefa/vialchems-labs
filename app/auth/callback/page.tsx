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
 * instantiation, sets the session, persists it to localStorage, and
 * fires onAuthStateChange. This page just waits for the session to
 * land + navigates to the requested `next` destination.
 *
 * Supports BOTH:
 *   - Implicit flow (default): tokens arrive in URL fragment, supabase
 *     auto-handles + this page just reads getSession()
 *   - PKCE flow (if enabled): `?code=...` query param, supabase auto-
 *     handles + this page just reads getSession()
 *
 * Errors redirect to /login?error=auth_error (or supabase_unavailable
 * when REQUIRE_SUPABASE=false stub mode).
 */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { browserSupabase } from "@/lib/supabase";

function safeNext(value: string | null): string {
  if (!value) return "/account";
  if (!value.startsWith("/")) return "/account";
  if (value.startsWith("//")) return "/account";
  return value;
}

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [state, setState] = useState<
    "idle" | "exchanging" | "success" | "error" | "unavailable"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = browserSupabase();
    if (!supabase) {
      setState("unavailable");
      router.replace("/login?error=supabase_unavailable");
      return;
    }
    setState("exchanging");

    async function run() {
      // With detectSessionInUrl=true (lib/supabase.ts), supabase-js auto-
      // parses tokens from the URL fragment on first read. We give it a
      // tick to settle, then check getSession(). For PKCE flow ?code=...
      // we exchange explicitly; otherwise getSession() should already
      // carry the implicit-flow session.
      const code = params.get("code");
      if (code && supabase) {
        const exchanged = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (exchanged.error) {
          setErrorMessage(exchanged.error.message);
          setState("error");
          router.replace(
            `/login?error=auth_error&message=${encodeURIComponent(
              exchanged.error.message,
            )}`,
          );
          return;
        }
      }

      const { data, error } = supabase
        ? await supabase.auth.getSession()
        : { data: { session: null }, error: null };
      if (cancelled) return;
      if (error) {
        setErrorMessage(error.message);
        setState("error");
        router.replace(
          `/login?error=auth_error&message=${encodeURIComponent(error.message)}`,
        );
        return;
      }
      if (!data.session) {
        // No tokens in URL hash, no code in query — link was incomplete.
        setState("error");
        router.replace("/login?error=missing_code");
        return;
      }
      setState("success");
      const next = safeNext(params.get("next"));
      router.replace(next);
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
          {state === "unavailable"
            ? "Magic-link sign-in isn't enabled in this environment. Redirecting…"
            : state === "error"
              ? (errorMessage ??
                "Could not verify the sign-in link. Redirecting back to /login…")
              : state === "success"
                ? "Verified. Redirecting to your account…"
                : "Verifying your sign-in link with Supabase Auth."}
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
