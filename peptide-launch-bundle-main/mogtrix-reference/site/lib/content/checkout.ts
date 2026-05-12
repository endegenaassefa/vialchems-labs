export type CheckoutStage =
  | "preview_only"
  | "access_required"
  | "pending_review"
  | "pilot_checkout";

export type CheckoutState = {
  stage: CheckoutStage;
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
};

export const checkoutStates: Record<CheckoutStage, CheckoutState> = {
  preview_only: {
    stage: "preview_only",
    title: "Catalog preview only",
    message:
      "Public visitors can browse products, but pricing and checkout stay inside verified and qualified customer accounts.",
    actionLabel: "Sign in for full access",
    actionHref: "/login"
  },
  access_required: {
    stage: "access_required",
    title: "Access review required",
    message:
      "Verify your email and complete the short qualification flow before pricing, cart tools, and checkout are unlocked.",
    actionLabel: "Finish account setup",
    actionHref: "/qualify"
  },
  pending_review: {
    stage: "pending_review",
    title: "Account setup pending",
    message:
      "Your account is not ready for pricing and checkout yet. Finish verification or qualification to continue into the private catalog.",
    actionLabel: "Verify email",
    actionHref: "/verify"
  },
  pilot_checkout: {
    stage: "pilot_checkout",
    title: "Pilot hosted checkout",
    message:
      "Qualified buyers can purchase selected pilot SKUs through hosted checkout. Final US shipping and tax are locked in the payment provider window, then status updates return to the account timeline by webhook.",
    actionLabel: "Continue to checkout",
    actionHref: "/checkout"
  }
};

export function getCheckoutState(stage: CheckoutStage = "access_required") {
  return checkoutStates[stage];
}
