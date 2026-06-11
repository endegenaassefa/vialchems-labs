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
  const [state, setState] = useState<SupabaseUserState>(() => {
    if (typeof window === "undefined") {
      return { user: null, session: null, loading: true, unavailable: false };
    }
    const supabase = browserSupabase();
    if (!supabase) {
      return { user: null, session: null, loading: false, unavailable: true };
    }
    return { user: null, session: null, loading: true, unavailable: false };
  });

  useEffect(() => {
    const supabase = browserSupabase();
    // Stub mode: the lazy initializer already set unavailable=true at
    // mount, so no setState here (the set-state-in-effect lint rule would
    // flag it as a cascading render).
    if (!supabase) return;

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
