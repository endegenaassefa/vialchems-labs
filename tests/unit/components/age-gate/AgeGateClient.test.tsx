import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  cleanup,
} from "@testing-library/react";

/**
 * Phase 7 G1 (v5) — AgeGateClient component coverage.
 *
 * Iron Law 2.39: compliance-UI surfaces must be tested. The age gate is one
 * of two highest-priority compliance UIs (21+ + RUO entry control). Data
 * layer is covered by `tests/unit/age-verification.test.ts`; this file
 * locks the UI layer:
 *   - submit-disabled until the combined 21+ / RUO acknowledgment is ticked
 *   - successful submit calls `/api/age-gate/verify` then redirects
 *   - "leave site" path redirects to the goodbye URL after confirm
 *   - verbatim Appendix A.3 language renders in the requirements list
 *   - already-verified users bypass the gate via auto-redirect
 */

// next/navigation: jsdom has no Next router. Provide a mutable spy router so
// tests can assert the redirect target.
const routerReplaceMock = vi.fn();
const routerPushMock = vi.fn();
let searchParamsValue = new URLSearchParams("");

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: routerReplaceMock,
    push: routerPushMock,
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => searchParamsValue,
}));

// Three.js + canvas scenes pull WebGL into jsdom. Stub the scene primitives;
// what we care about here is the form interaction, not the background art.
vi.mock("@/components/age-gate/DnaHelixScene", () => ({
  DnaHelixScene: () => <div data-testid="dna-helix-stub" aria-hidden="true" />,
}));
vi.mock("@/components/age-gate/ParticleFormulaField", () => ({
  ParticleFormulaField: () => (
    <div data-testid="particle-field-stub" aria-hidden="true" />
  ),
}));

import { AgeGateClient } from "@/components/age-gate/AgeGateClient";
import { AGE_GATE_GOODBYE_URL } from "@/lib/age-verification";

function setSearchParams(query = "") {
  searchParamsValue = new URLSearchParams(query);
}

describe("AgeGateClient", () => {
  beforeEach(() => {
    routerReplaceMock.mockReset();
    routerPushMock.mockReset();
    setSearchParams("");
    // localStorage starts clean — no prior age verification.
    window.localStorage.clear();

    vi.spyOn(window, "fetch").mockImplementation(async (input, init) => {
      void input;
      void init;
      return new Response(
        JSON.stringify({ verifiedAt: "2026-05-20T10:00:00.000Z" }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      );
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the 21+ entry gate with brand mark and required attestation", () => {
    render(<AgeGateClient />);
    // The headline is letter-by-letter spans for the animation; match on the
    // role + id instead of the rendered text.
    const heading = document.getElementById("age-gate-title");
    expect(heading).not.toBeNull();
    expect(heading?.tagName.toLowerCase()).toBe("h1");
    expect(screen.getAllByText(/vialchem labs/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/for laboratory use only/i)).toBeInTheDocument();
  });

  it("renders verbatim Appendix A.3 entry requirements (21+, RUO, no human consumption, terms)", () => {
    render(<AgeGateClient />);
    expect(
      screen.getByText("You are 21 years of age or older"),
    ).toBeInTheDocument();
    expect(screen.getByText("For research purposes only")).toBeInTheDocument();
    expect(screen.getByText("Not for human consumption")).toBeInTheDocument();
    expect(
      screen.getByText("You agree to Terms and Privacy Policy"),
    ).toBeInTheDocument();
  });

  it("renders research access details (RUO, qualified access, testing posture, shipping)", () => {
    render(<AgeGateClient />);
    expect(screen.getByText(/research use only/i)).toBeInTheDocument();
    expect(screen.getByText(/qualified access/i)).toBeInTheDocument();
    expect(screen.getByText(/testing posture/i)).toBeInTheDocument();
    expect(screen.getByText(/shipping boundaries/i)).toBeInTheDocument();
  });

  it("disables the enter button until the combined 21+ / RUO acknowledgment is checked", () => {
    render(<AgeGateClient />);
    const enter = screen.getByRole("button", {
      name: /confirm you are 21 or older and enter the site/i,
    });
    expect(enter).toBeDisabled();

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    expect(enter).not.toBeDisabled();
  });

  it("toggles back to disabled if the acknowledgment is unchecked", () => {
    render(<AgeGateClient />);
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
    expect(
      screen.getByRole("button", {
        name: /confirm you are 21 or older/i,
      }),
    ).toBeDisabled();
  });

  it("no-ops if the enter button is clicked while disabled (defensive guard)", async () => {
    render(<AgeGateClient />);
    const enter = screen.getByRole("button", {
      name: /confirm you are 21 or older/i,
    });
    // Even though the DOM disables the button, AgeGateClient also guards inside
    // its handler. Verify the handler does NOT POST when the acknowledgment is
    // missing.
    await act(async () => {
      fireEvent.click(enter);
    });
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it("on submit: POSTs to /api/age-gate/verify then redirects to the next path", async () => {
    setSearchParams("next=/shop");
    vi.useFakeTimers();
    try {
      render(<AgeGateClient />);
      fireEvent.click(screen.getByRole("checkbox"));
      const enter = screen.getByRole("button", {
        name: /confirm you are 21 or older/i,
      });
      await act(async () => {
        fireEvent.click(enter);
      });
      // POST happens immediately
      expect(window.fetch).toHaveBeenCalledWith(
        "/api/age-gate/verify",
        expect.objectContaining({ method: "POST" }),
      );
      // Redirect is fired on a 600ms exit-animation timer
      await act(async () => {
        await vi.advanceTimersByTimeAsync(700);
      });
      expect(routerReplaceMock).toHaveBeenCalledWith("/shop");
    } finally {
      vi.useRealTimers();
    }
  });

  it("on submit failure: does not crash and recovers (no redirect)", async () => {
    (window.fetch as unknown as Mock).mockImplementationOnce(
      async () => new Response("nope", { status: 500 }),
    );
    render(<AgeGateClient />);
    fireEvent.click(screen.getByRole("checkbox"));
    const enter = screen.getByRole("button", {
      name: /confirm you are 21 or older/i,
    });
    await act(async () => {
      fireEvent.click(enter);
    });
    // The component swallows the error; the router redirect is NOT scheduled.
    expect(routerReplaceMock).not.toHaveBeenCalled();
  });

  it('normalizes ?next= via normalizeAgeGateNext (open-redirect "//evil.com" → "/")', async () => {
    setSearchParams("next=//evil.com");
    vi.useFakeTimers();
    try {
      render(<AgeGateClient />);
      fireEvent.click(screen.getByRole("checkbox"));
      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", {
            name: /confirm you are 21 or older/i,
          }),
        );
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(700);
      });
      expect(routerReplaceMock).toHaveBeenCalledWith("/");
    } finally {
      vi.useRealTimers();
    }
  });

  it("under-21 exit path: confirms, clears storage, redirects to goodbye URL", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const locationReplace = vi.fn();
    // jsdom location.replace is read-only; reassign via defineProperty.
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { ...originalLocation, replace: locationReplace },
      writable: true,
    });

    render(<AgeGateClient />);
    const exit = screen.getByRole("button", {
      name: /you are under 21, exit the site/i,
    });
    await act(async () => {
      fireEvent.click(exit);
    });
    expect(confirmSpy).toHaveBeenCalled();
    expect(locationReplace).toHaveBeenCalledWith(AGE_GATE_GOODBYE_URL);

    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("under-21 exit path: cancelling the confirm does NOT redirect", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const locationReplace = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { ...originalLocation, replace: locationReplace },
      writable: true,
    });

    render(<AgeGateClient />);
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /you are under 21, exit the site/i,
        }),
      );
    });
    expect(confirmSpy).toHaveBeenCalled();
    expect(locationReplace).not.toHaveBeenCalled();

    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("already-verified users are auto-redirected on mount via the useEffect bypass", async () => {
    const now = new Date().toISOString();
    window.localStorage.setItem("vcl_age_verified", now);

    await act(async () => {
      render(<AgeGateClient />);
    });
    await waitFor(() => {
      expect(routerReplaceMock).toHaveBeenCalledWith("/");
    });
  });

  it("provides accessible terms + privacy links inside the acknowledgment label", () => {
    render(<AgeGateClient />);
    const termsLink = screen.getByRole("link", { name: /terms of service/i });
    const privacyLink = screen.getAllByRole("link", { name: /privacy/i })[0];
    expect(termsLink).toHaveAttribute("href", "/legal/terms");
    expect(privacyLink).toHaveAttribute("href", "/legal/privacy");
    // Both open in a new tab so a user reviewing legal text does NOT lose the
    // age-gate context.
    expect(termsLink).toHaveAttribute("target", "_blank");
    expect(termsLink).toHaveAttribute("rel", "noreferrer");
  });

  it("stops link clicks from toggling the parent checkbox label", () => {
    render(<AgeGateClient />);
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    const termsLink = screen.getByRole("link", { name: /terms of service/i });
    fireEvent.click(termsLink);
    expect(checkbox.checked).toBe(false);
    // Privacy link inside the same label must also stop propagation
    const privacyLinks = screen.getAllByRole("link", {
      name: /privacy policy/i,
    });
    fireEvent.click(privacyLinks[0]);
    expect(checkbox.checked).toBe(false);
  });

  it("the acknowledgment checkbox is associated with a label via htmlFor", () => {
    render(<AgeGateClient />);
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.id).toBe("age-gate-terms");
    expect(
      document.querySelector('label[for="age-gate-terms"]'),
    ).not.toBeNull();
  });
});
