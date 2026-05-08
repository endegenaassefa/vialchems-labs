/**
 * useSessionStorageItem — React hook to read a JSON value from sessionStorage.
 *
 * Uses useSyncExternalStore so the lint rule
 * `react-hooks/set-state-in-effect` does not fire on hydration patterns
 * common in the checkout flow (Phase 5 stub data is bound to sessionStorage).
 *
 * SSR: returns null until the first client subscription fires. The consumer
 * pages render an SSR-safe placeholder until hydration completes.
 *
 * Phase 9 will replace this with Supabase-backed reads.
 */
'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }
  const handler = () => callback();
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

function getServerSnapshot(): string | null {
  return null;
}

function readKey(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function useSessionStorageItem<T>(key: string): T | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => readKey(key),
    getServerSnapshot,
  );
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Like useSessionStorageItem but returns the raw string (no JSON parse).
 * Use for primitive string flags such as the payment-method radio choice.
 */
export function useSessionStorageString(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => readKey(key),
    getServerSnapshot,
  );
}
