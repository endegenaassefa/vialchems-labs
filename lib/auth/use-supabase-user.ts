/**
 * Auth-flow redesign — single source of truth for "is this person signed in?".
 *
 * Subscribes to the supabase-js auth state and exposes a tiny
 * `{ user, loading, session }` shape. Replaces the legacy
 * useCurrentUser/useAuthHydrated hooks from lib/auth-store.ts which
 * read from a localStorage PBKDF2 store. With this hook, the whole
 * site agrees on one signed-in identity (the Supabase user).
 */
"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { browserSupabase } from "@/lib/supabase";

export interface SupabaseUserState {
  user: User | null;
  session: Session | null;
  /** True until the first getSession() resolves OR onAuthStateChange fires. */
  loading: boolean;
  /** False when REQUIRE_SUPABASE=false (stub mode); always false otherwise. */
  unavailable: boolean;
}

export function useSupabaseUser(): SupabaseUserState {
  // 2026-06-12: hydration-safe initial state. Server AND first client
  // render BOTH return loading=true, unavailable=false. The post-mount
  // effect below then upgrades to the real value (real user, real
  // unavailable). Without this guard, pages that branched on
  // `unavailable` rendered different markup on SSR vs first client
  // render (loading vs unavailable banner), triggering hydration
  // mismatches on /account + /login + every page using this hook.
  const [state, setState] = useState<SupabaseUserState>({
    user: null,
    session: null,
    loading: true,
    unavailable: false,
  });

  useEffect(() => {
    const supabase = browserSupabase();
    // Stub mode: no Supabase client at all. Flip to unavailable from
    // its hydration-safe loading default. Set-state-in-effect is
    // acceptable here because we only run this once and the alternative
    // is a permanent loading spinner in stub builds.
    if (!supabase) {
      // Hydration-safe upgrade from loading=true → unavailable=true.
      // setState-in-effect is intentional: SSR + first client render
      // both need to render the same `loading` skeleton to avoid
      // hydration mismatches; this one-time flip happens after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({
        user: null,
        session: null,
        loading: false,
        unavailable: true,
      });
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setState({
        user: data.session?.user ?? null,
        session: data.session,
        loading: false,
        unavailable: false,
      });
    });

    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        unavailable: false,
      });
    });

    return () => {
      cancelled = true;
      sub.data.subscription.unsubscribe();
    };
  }, []);

  return state;
}
