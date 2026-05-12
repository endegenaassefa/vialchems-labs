import { describe, expect, it } from "vitest";

import { checkoutStates, getCheckoutState } from "@/lib/content/checkout";

describe("pilot checkout states", () => {
  it("describes the hosted payment pilot state", () => {
    const state = getCheckoutState("pilot_checkout");

    expect(state.title).toContain("Pilot");
    expect(state.message).toContain("selected pilot SKUs");
    expect(state.message).toContain("webhook");
    expect(state.actionHref).toBe("/checkout");
  });

  it("keeps card entry offsite in copy", () => {
    const allCopy = Object.values(checkoutStates)
      .map((state) => `${state.title} ${state.message}`)
      .join(" ");

    expect(allCopy).not.toMatch(/card number|enter card details on this site/i);
  });
});
