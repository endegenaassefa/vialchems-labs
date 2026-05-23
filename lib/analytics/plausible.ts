/**
 * D1 — Plausible analytics wrapper
 * (Section 6 super-prompt 2026-05-22).
 *
 * The Plausible `script.outbound-links.js` snippet is loaded by
 * `app/layout.tsx` in production. It attaches a global
 * `window.plausible(event, props?)` function. This wrapper is
 * the typed call-site for components + API routes; it no-ops in
 * environments where the script never loaded (e.g. dev mode,
 * test runs, or when the user blocks the script via uBlock /
 * Brave shields).
 *
 * Funnel events (per D4) are also routed through this helper so
 * the call sites don't have to know whether they're running
 * client-side (inline window.plausible) or server-side (POST to
 * /api/analytics/track which proxies to Plausible Events API).
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, unknown> },
    ) => void;
  }
}

export interface TrackInput {
  event: string;
  props?: Record<string, string | number | boolean>;
}

export function track({ event, props }: TrackInput): void {
  if (typeof window === "undefined") return;
  const fn = window.plausible;
  if (typeof fn !== "function") return;
  try {
    fn(event, props ? { props } : undefined);
  } catch {
    // Plausible is best-effort; never throw from analytics into a
    // user-visible code path.
  }
}

export function isPlausibleConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
}
