"use client";

/**
 * Phase 10.6 (v4) — D14 cookie consent banner.
 *
 * Self-hosted default per Iron Law 2.23. Renders nothing until the
 * client mounts (cookie can't be read on the server in a streaming
 * RSC), then either:
 *   - exits silently if the user already decided (decidedAt set),
 *   - exits silently after auto-applying GPC defaults if navigator
 *     reports globalPrivacyControl=true,
 *   - else shows the banner.
 *
 * Three primary actions: Accept all / Customize / Reject all. Customize
 * opens an in-place panel (no Dialog primitive — bottom-anchored bar
 * stays visible to keep cookie context intact) with one toggle per
 * non-necessary category.
 *
 * Iron Law 2.5 / 2.19: integration code joins the protected paths list
 * as regulatory artifact.
 */

import { usePathname } from "next/navigation";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  CONSENT_COOKIE,
  acceptAll,
  applyGPCDefaults,
  customize,
  defaultConsent,
  detectGPC,
  parseConsent,
  rejectAll,
  serializeConsent,
  type ConsentState,
} from "@/lib/consent-store";

const COOKIE_MAX_AGE_DAYS = 365;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const target = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(target)) {
      return decodeURIComponent(trimmed.slice(target.length));
    }
  }
  return null;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  const secure =
    typeof location !== "undefined" && location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

export function CookieConsent() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<ConsentState>(defaultConsent());
  const [customizing, setCustomizing] = useState(false);

  useEffect(() => {
    // Client-only: cookie + navigator are unavailable during SSR, so the
    // mounted/state flip in this effect is the correct shape (Iron Law
    // 2.23 — banner must reflect the user's actual decision, not a
    // pre-decided server snapshot). Disable the linter heuristic on the
    // setState calls here for the same reason as RecoveryStackSheen.
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true);
    const raw = readCookie(CONSENT_COOKIE);
    let next = parseConsent(raw);
    if (next.decidedAt === null && detectGPC(navigator)) {
      next = applyGPCDefaults(next);
      writeCookie(CONSENT_COOKIE, serializeConsent(next));
    }
    setState(next);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function commit(next: ConsentState) {
    setState(next);
    writeCookie(CONSENT_COOKIE, serializeConsent(next));
    setCustomizing(false);
  }

  if (!mounted) return null;
  if (pathname === "/age-gate") return null;
  if (state.decidedAt) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-strong)] bg-[var(--surface-elevated)]/95 backdrop-blur-md shadow-[var(--shadow-xl)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-[14px] leading-[1.55] text-[var(--text-muted)] max-w-3xl">
          We use strictly-necessary cookies for cart, checkout, and security.
          Optional categories (analytics, functional, marketing) are off by
          default and only enabled if you accept. See our{" "}
          <a
            href="/legal/cookies"
            className="text-[var(--accent)] hover:text-[var(--accent-soft)] underline underline-offset-2"
          >
            Cookie Policy
          </a>
          .
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => commit(rejectAll())}
            className="font-mono text-[12px] uppercase tracking-[0.14em] px-4 h-10 border border-[var(--border-strong)] rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors"
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={() => setCustomizing((c) => !c)}
            className="font-mono text-[12px] uppercase tracking-[0.14em] px-4 h-10 border border-[var(--border-strong)] rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors"
            aria-expanded={customizing}
            aria-controls="cookie-consent-customize"
          >
            Customize
          </button>
          <button
            type="button"
            onClick={() => commit(acceptAll())}
            className="font-mono text-[12px] uppercase tracking-[0.14em] px-4 h-10 bg-[var(--accent)] text-[var(--text-on-accent)] rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
      {customizing ? <CustomizePanel onCommit={commit} /> : null}
    </div>
  );
}

function CustomizePanel({ onCommit }: { onCommit: (s: ConsentState) => void }) {
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div
      id="cookie-consent-customize"
      className="border-t border-[var(--border-strong)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-5 grid gap-3 md:grid-cols-2">
        <ConsentRow
          label="Strictly necessary"
          description="Auth, cart, checkout, CSRF. Always on — required to operate the site."
          locked
          checked
        />
        <ConsentRow
          label="Functional"
          description="Remember preferences (theme, last-used filters)."
          checked={functional}
          onChange={setFunctional}
        />
        <ConsentRow
          label="Analytics"
          description="Aggregated usage telemetry — page-views, error rates. No marketing trackers."
          checked={analytics}
          onChange={setAnalytics}
        />
        <ConsentRow
          label="Marketing"
          description="Off by default. vialchemlabs runs no third-party advertising trackers Day-1."
          checked={marketing}
          onChange={setMarketing}
        />
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-5 flex justify-end">
        <button
          type="button"
          onClick={() =>
            onCommit(customize({ functional, analytics, marketing }))
          }
          className="font-mono text-[12px] uppercase tracking-[0.14em] px-4 h-10 bg-[var(--accent)] text-[var(--text-on-accent)] rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors"
        >
          Save preferences
        </button>
      </div>
    </div>
  );
}

function ConsentRow({
  label,
  description,
  locked,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  locked?: boolean;
  checked: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <label className="flex items-start gap-4 text-[14px] leading-[1.5]">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-[var(--accent)]"
        checked={checked}
        disabled={locked}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-disabled={locked || undefined}
      />
      <span>
        <span className="font-medium text-[var(--text)]">{label}</span>
        <span className="block text-[13px] text-[var(--text-muted)]">
          {description}
        </span>
      </span>
    </label>
  );
}
