/**
 * ThemeToggle — flips `data-theme` on <html> and persists choice.
 *
 * v5: dark is the default; light is opt-in via [data-theme="light"] on <html>.
 * Tiny client island; lives in the header right cluster. No hydration flicker
 * because the inline script in `<head>` (set in app/layout.tsx) sets the
 * attribute before React mounts.
 */
"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem("vc-theme");
    return stored === "dark" || stored === "light" ? stored : "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("vc-theme", theme);
    window.dispatchEvent(new Event("vc-theme-change"));
  } catch {
    /* ignore storage errors (private mode etc.) */
  }
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("vc-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("vc-theme-change", callback);
  };
}

function readServerTheme(): Theme {
  return "dark";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readInitialTheme,
    readServerTheme,
  );

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="inline-flex items-center justify-center h-9 w-9 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors duration-[var(--dur-short)]"
    >
      {theme === "light" ? (
        <Moon size={15} strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Sun size={15} strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}
