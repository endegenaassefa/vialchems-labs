"use client";

/**
 * AuthHeaderLink — small client island for the SiteHeader auth area.
 *
 * Single source of truth: useSupabaseUser(). Server-renders the "Sign in"
 * fallback so SSR + first paint match; switches to the signed-in pill
 * once the Supabase session resolves.
 */

import Link from "next/link";
import { useSupabaseUser } from "@/lib/auth/use-supabase-user";

export function AuthHeaderLink() {
  const { user, loading } = useSupabaseUser();

  if (loading || !user) {
    return (
      <Link
        href="/login"
        className="hidden md:inline-flex items-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors px-3 py-2"
      >
        Sign in
      </Link>
    );
  }
  // Compact display: email's local-part (the bit before @). Falls back to
  // "Account" when the email is somehow missing.
  const label = user.email?.split("@")[0] ?? "Account";
  return (
    <Link
      href="/account"
      className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors px-3 py-2"
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
      />
      <span>{label}</span>
    </Link>
  );
}
