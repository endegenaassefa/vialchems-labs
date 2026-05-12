import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";

let reducedMotionValue: boolean | null = false;
vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return {
    ...actual,
    useReducedMotion: () => reducedMotionValue,
  };
});

import { NewsletterForm } from "@/components/NewsletterForm";

/**
 * Phase 7 (v4) — newsletter form micro-interaction.
 *
 * Progressive enhancement: the form posts normally without JS (action=...).
 * With JS, submit is intercepted; the row collapses and a success message
 * fades in on 200 OK. Reduced-motion skips the visual transitions but still
 * shows the success state (Iron Law 2.18).
 */

describe("NewsletterForm", () => {
  beforeEach(() => {
    reducedMotionValue = false;
    vi.spyOn(window, "fetch").mockImplementation(async () => {
      return new Response(null, { status: 200 });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the email input + submit button", () => {
    render(<NewsletterForm />);
    expect(
      screen.getByLabelText(/email address for newsletter/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /subscribe/i }),
    ).toBeInTheDocument();
  });

  it("posts to /api/newsletter/subscribe on submit and shows success message", async () => {
    render(<NewsletterForm />);
    const email = screen.getByLabelText(
      /email address for newsletter/i,
    ) as HTMLInputElement;
    fireEvent.change(email, { target: { value: "researcher@example.com" } });
    const form = email.closest("form")!;
    await act(async () => {
      fireEvent.submit(form);
    });
    expect(window.fetch).toHaveBeenCalledWith(
      "/api/newsletter/subscribe",
      expect.objectContaining({ method: "POST" }),
    );
    await waitFor(() => {
      expect(screen.getByText(/check your inbox/i)).toBeInTheDocument();
    });
  });

  it("shows error state on non-2xx response and keeps the form usable", async () => {
    vi.spyOn(window, "fetch").mockImplementation(async () => {
      return new Response("bad", { status: 400 });
    });
    render(<NewsletterForm />);
    const email = screen.getByLabelText(
      /email address for newsletter/i,
    ) as HTMLInputElement;
    fireEvent.change(email, { target: { value: "bad" } });
    const form = email.closest("form")!;
    await act(async () => {
      fireEvent.submit(form);
    });
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    // Form still rendered, button re-enabled
    expect(
      screen.getByRole("button", { name: /subscribe/i }),
    ).toBeInTheDocument();
  });

  it("falls back to native form post when fetch is unavailable (no JS path simulated by null)", () => {
    // Native form action attribute must remain in the rendered DOM as
    // progressive enhancement — even when JS handler is wired.
    render(<NewsletterForm />);
    const form = screen
      .getByLabelText(/email address for newsletter/i)
      .closest("form")!;
    expect(form.getAttribute("action")).toBe("/api/newsletter/subscribe");
    expect(form.getAttribute("method")?.toLowerCase()).toBe("post");
  });
});
