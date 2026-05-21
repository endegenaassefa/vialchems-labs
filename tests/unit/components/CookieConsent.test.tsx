import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
  within,
} from "@testing-library/react";

/**
 * Phase 7 G1 (v5) — CookieConsent component coverage.
 *
 * Iron Law 2.23 contract (storage parser is covered by
 * `tests/unit/consent-store.test.ts`; this file exercises the banner UI):
 *   - banner hidden until the client mounts
 *   - banner hidden on /age-gate (the age gate owns that surface)
 *   - banner hidden when the user has already decided
 *   - "Necessary" toggle is locked checked + disabled (can't opt out)
 *   - all opt-in toggles default OFF (functional, analytics, marketing)
 *   - Accept all / Reject all / Customize commit to the cookie
 *   - GPC signal auto-decides + persists without showing the banner
 */

let pathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

import { CookieConsent } from "@/components/CookieConsent";
import { CONSENT_COOKIE, parseConsent } from "@/lib/consent-store";

function clearAllCookies() {
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (!name) continue;
    document.cookie = `${name}=; Path=/; Max-Age=0`;
  }
}

function readDocumentCookie(name: string): string | null {
  const target = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(target)) {
      return decodeURIComponent(trimmed.slice(target.length));
    }
  }
  return null;
}

describe("CookieConsent", () => {
  beforeEach(() => {
    pathname = "/";
    clearAllCookies();
    // Reset any GPC stub between tests
    delete (window.navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    clearAllCookies();
  });

  it("renders the banner when no decision has been made", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    expect(
      screen.getByRole("region", { name: /cookie consent/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /accept all/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reject all/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /customize/i }),
    ).toBeInTheDocument();
  });

  it("hides the banner when on the /age-gate route (age gate owns that surface)", async () => {
    pathname = "/age-gate";
    await act(async () => {
      render(<CookieConsent />);
    });
    expect(
      screen.queryByRole("region", { name: /cookie consent/i }),
    ).not.toBeInTheDocument();
  });

  it("hides the banner when the user has already made a decision", async () => {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
      JSON.stringify({
        version: 1,
        decidedAt: "2026-05-10T00:00:00.000Z",
        categories: {
          necessary: true,
          functional: true,
          analytics: false,
          marketing: false,
        },
      }),
    )}; Path=/`;
    await act(async () => {
      render(<CookieConsent />);
    });
    expect(
      screen.queryByRole("region", { name: /cookie consent/i }),
    ).not.toBeInTheDocument();
  });

  it("does not render the customize panel initially", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    expect(document.getElementById("cookie-consent-customize")).toBeNull();
  });

  it("opens the customize panel on Customize click and toggles aria-expanded", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    const customize = screen.getByRole("button", { name: /customize/i });
    expect(customize.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(customize);
    expect(customize.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("cookie-consent-customize")).not.toBeNull();
  });

  it("renders four consent rows in the customize panel: necessary + 3 opt-ins", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    fireEvent.click(screen.getByRole("button", { name: /customize/i }));
    const panel = document.getElementById("cookie-consent-customize")!;
    expect(within(panel).getByText(/strictly necessary/i)).toBeInTheDocument();
    expect(within(panel).getByText(/functional/i)).toBeInTheDocument();
    expect(within(panel).getByText(/^analytics/i)).toBeInTheDocument();
    expect(within(panel).getByText(/^marketing/i)).toBeInTheDocument();
  });

  it("'necessary' toggle is locked checked + disabled (Iron Law 2.23 cannot opt out)", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    fireEvent.click(screen.getByRole("button", { name: /customize/i }));
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    const necessary = checkboxes[0];
    expect(necessary.checked).toBe(true);
    expect(necessary.disabled).toBe(true);
    expect(necessary.getAttribute("aria-disabled")).toBe("true");
  });

  it("opt-in toggles default OFF (functional, analytics, marketing)", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    fireEvent.click(screen.getByRole("button", { name: /customize/i }));
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    // [necessary, functional, analytics, marketing]
    expect(checkboxes[1].checked).toBe(false);
    expect(checkboxes[2].checked).toBe(false);
    expect(checkboxes[3].checked).toBe(false);
  });

  it("clicking Accept all persists every category to true and hides the banner", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /accept all/i }));
    });
    const stored = parseConsent(readDocumentCookie(CONSENT_COOKIE));
    expect(stored.categories.necessary).toBe(true);
    expect(stored.categories.functional).toBe(true);
    expect(stored.categories.analytics).toBe(true);
    expect(stored.categories.marketing).toBe(true);
    expect(stored.decidedAt).not.toBeNull();
    expect(
      screen.queryByRole("region", { name: /cookie consent/i }),
    ).not.toBeInTheDocument();
  });

  it("clicking Reject all persists necessary=true + others=false and hides the banner", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /reject all/i }));
    });
    const stored = parseConsent(readDocumentCookie(CONSENT_COOKIE));
    expect(stored.categories.necessary).toBe(true);
    expect(stored.categories.functional).toBe(false);
    expect(stored.categories.analytics).toBe(false);
    expect(stored.categories.marketing).toBe(false);
    expect(stored.decidedAt).not.toBeNull();
  });

  it("Customize → Save preferences persists the user's selected categories", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    fireEvent.click(screen.getByRole("button", { name: /customize/i }));
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    // Turn on functional + analytics; leave marketing off
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: /save preferences/i }),
      );
    });
    const stored = parseConsent(readDocumentCookie(CONSENT_COOKIE));
    expect(stored.categories.necessary).toBe(true);
    expect(stored.categories.functional).toBe(true);
    expect(stored.categories.analytics).toBe(true);
    expect(stored.categories.marketing).toBe(false);
  });

  it("GPC signal auto-applies opt-out defaults and hides the banner", async () => {
    (
      window.navigator as Navigator & {
        globalPrivacyControl?: boolean;
      }
    ).globalPrivacyControl = true;
    await act(async () => {
      render(<CookieConsent />);
    });
    // Banner should not render (GPC = recorded decision)
    expect(
      screen.queryByRole("region", { name: /cookie consent/i }),
    ).not.toBeInTheDocument();
    const stored = parseConsent(readDocumentCookie(CONSENT_COOKIE));
    expect(stored.categories.necessary).toBe(true);
    expect(stored.categories.analytics).toBe(false);
    expect(stored.categories.marketing).toBe(false);
    expect(stored.decidedAt).not.toBeNull();
  });

  it("renders the Cookie Policy link for further disclosure (Iron Law 2.23 transparency)", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    const link = screen.getByRole("link", { name: /cookie policy/i });
    expect(link).toHaveAttribute("href", "/legal/cookies");
  });

  it("survives a malformed cookie value (parseConsent fallback)", async () => {
    document.cookie = `${CONSENT_COOKIE}=garbage; Path=/`;
    await act(async () => {
      render(<CookieConsent />);
    });
    // Malformed cookie → defaultConsent() with decidedAt=null → banner shows
    expect(
      screen.getByRole("region", { name: /cookie consent/i }),
    ).toBeInTheDocument();
  });

  it("toggling Customize twice collapses the panel again", async () => {
    await act(async () => {
      render(<CookieConsent />);
    });
    const button = screen.getByRole("button", { name: /customize/i });
    fireEvent.click(button);
    expect(document.getElementById("cookie-consent-customize")).not.toBeNull();
    fireEvent.click(button);
    expect(document.getElementById("cookie-consent-customize")).toBeNull();
  });
});
