"use client";

/**
 * AuthHeaderLink — small client island for the SiteHeader auth area.
 *
 * Renders "Sign in" when signed out, or the user's display name when signed
 * in (linking to /account). Hydration-safe via useAuthHydrated() — the
 * server-rendered fallback is the "Sign in" state, which matches the most
 * common case for first-load.
 */

import Link from "next/link";
import { useAuthHydrated, useCurrentUser } from "@/lib/auth-store";

export function AuthHeaderLink() {
  const hydrated = useAuthHydrated();
  const user = useCurrentUser();

  // Pre-hydration: render the "Sign in" fallback so SSR + first paint match.
  if (!hydrated || !user) {
    return (
      <Link
        href="/login"
        className="hidden md:inline-flex items-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors px-3 py-2"
      >
        Sign in
      </Link>
    );
  }
  return (
    <Link
      href="/account"
      className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors px-3 py-2"
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
      />
      <span>{user.displayName}</span>
    </Link>
  );
}
