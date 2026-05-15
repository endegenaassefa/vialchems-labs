export const CHECKOUT_PAYMENT_METHODS = [
  "link_money",
  "bitcoin",
  "zelle",
  "card",
  "apple_pay",
  "google_pay",
  "paypal",
] as const;

export type CheckoutPaymentMethod = (typeof CHECKOUT_PAYMENT_METHODS)[number];

export const WOO_CHECKOUT_METHODS = [
  "link_money",
  "card",
  "apple_pay",
  "google_pay",
  "paypal",
] as const satisfies readonly CheckoutPaymentMethod[];

export type WooCheckoutPaymentMethod = (typeof WOO_CHECKOUT_METHODS)[number];

export const MAIN_SITE_CHECKOUT_METHODS = [
  "bitcoin",
  "zelle",
] as const satisfies readonly CheckoutPaymentMethod[];

export type MainSiteCheckoutPaymentMethod =
  (typeof MAIN_SITE_CHECKOUT_METHODS)[number];

export interface CheckoutPaymentMethodInfo {
  id: CheckoutPaymentMethod;
  title: string;
  description: string;
  badge: string;
  route: "main-site" | "woocommerce";
}

export const CHECKOUT_PAYMENT_METHOD_INFO: CheckoutPaymentMethodInfo[] = [
  {
    id: "link_money",
    title: "Link Money",
    description: "Pay by bank at secure checkout.",
    badge: "Woo checkout",
    route: "woocommerce",
  },
  {
    id: "bitcoin",
    title: "Bitcoin",
    description: "Pay with Bitcoin on VialChem Labs.",
    badge: "Main site",
    route: "main-site",
  },
  {
    id: "zelle",
    title: "Zelle",
    description: "Pay with Zelle on VialChem Labs.",
    badge: "Main site",
    route: "main-site",
  },
  {
    id: "card",
    title: "Cards",
    description: "Credit and debit cards at secure checkout.",
    badge: "Woo checkout",
    route: "woocommerce",
  },
  {
    id: "apple_pay",
    title: "Apple Pay",
    description: "Shown when supported by secure checkout.",
    badge: "Woo checkout",
    route: "woocommerce",
  },
  {
    id: "google_pay",
    title: "Google Pay",
    description: "Shown when supported by secure checkout.",
    badge: "Woo checkout",
    route: "woocommerce",
  },
  {
    id: "paypal",
    title: "PayPal",
    description: "Available when enabled at secure checkout.",
    badge: "Woo checkout",
    route: "woocommerce",
  },
];

export function isWooCheckoutMethod(
  method: CheckoutPaymentMethod,
): method is WooCheckoutPaymentMethod {
  return (WOO_CHECKOUT_METHODS as readonly CheckoutPaymentMethod[]).includes(
    method,
  );
}

export function isMainSiteCheckoutMethod(
  method: CheckoutPaymentMethod,
): method is MainSiteCheckoutPaymentMethod {
  return (
    MAIN_SITE_CHECKOUT_METHODS as readonly CheckoutPaymentMethod[]
  ).includes(method);
}

export function getCheckoutApiRoute(method: CheckoutPaymentMethod): string {
  if (method === "bitcoin") return "/api/create-bitcoin-order";
  if (method === "zelle") return "/api/create-zelle-order";
  return "/api/create-woo-order";
}

export function getCheckoutActionLabel(method: CheckoutPaymentMethod): string {
  if (method === "bitcoin") return "Continue with Bitcoin";
  if (method === "zelle") return "Continue with Zelle";
  return "Proceed to Secure Checkout";
}

export function getCheckoutPendingLabel(method: CheckoutPaymentMethod): string {
  if (method === "bitcoin") return "Starting Bitcoin checkout...";
  if (method === "zelle") return "Starting Zelle checkout...";
  return "Starting secure checkout...";
}
