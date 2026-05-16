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

export const LIVE_CHECKOUT_PAYMENT_METHODS = [
  "bitcoin",
  "zelle",
] as const satisfies readonly CheckoutPaymentMethod[];

export const COMING_SOON_CHECKOUT_PAYMENT_METHODS = [
  "link_money",
  "card",
  "apple_pay",
  "google_pay",
  "paypal",
] as const satisfies readonly CheckoutPaymentMethod[];

export interface CheckoutPaymentMethodInfo {
  id: CheckoutPaymentMethod;
  title: string;
  description: string;
  badge: string;
  route: "main-site" | "woocommerce";
  availability: "live" | "coming-soon";
}

export const CHECKOUT_PAYMENT_METHOD_INFO: CheckoutPaymentMethodInfo[] = [
  {
    id: "link_money",
    title: "Link Money",
    description: "Bank checkout is coming soon.",
    badge: "Coming soon",
    route: "woocommerce",
    availability: "coming-soon",
  },
  {
    id: "bitcoin",
    title: "Bitcoin",
    description: "Pay with Bitcoin on VialChem Labs.",
    badge: "Main site",
    route: "main-site",
    availability: "live",
  },
  {
    id: "zelle",
    title: "Zelle",
    description: "Pay with Zelle on VialChem Labs.",
    badge: "Main site",
    route: "main-site",
    availability: "live",
  },
  {
    id: "card",
    title: "Cards",
    description: "Card checkout is coming soon.",
    badge: "Coming soon",
    route: "woocommerce",
    availability: "coming-soon",
  },
  {
    id: "apple_pay",
    title: "Apple Pay",
    description: "Wallet checkout is coming soon.",
    badge: "Coming soon",
    route: "woocommerce",
    availability: "coming-soon",
  },
  {
    id: "google_pay",
    title: "Google Pay",
    description: "Wallet checkout is coming soon.",
    badge: "Coming soon",
    route: "woocommerce",
    availability: "coming-soon",
  },
  {
    id: "paypal",
    title: "PayPal",
    description: "PayPal checkout is coming soon.",
    badge: "Coming soon",
    route: "woocommerce",
    availability: "coming-soon",
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

export function isLiveCheckoutMethod(
  method: CheckoutPaymentMethod,
): method is (typeof LIVE_CHECKOUT_PAYMENT_METHODS)[number] {
  return (
    LIVE_CHECKOUT_PAYMENT_METHODS as readonly CheckoutPaymentMethod[]
  ).includes(method);
}

export function isComingSoonCheckoutMethod(
  method: CheckoutPaymentMethod,
): method is (typeof COMING_SOON_CHECKOUT_PAYMENT_METHODS)[number] {
  return (
    COMING_SOON_CHECKOUT_PAYMENT_METHODS as readonly CheckoutPaymentMethod[]
  ).includes(method);
}

export function getCheckoutApiRoute(
  method: CheckoutPaymentMethod,
): string | null {
  if (!isLiveCheckoutMethod(method)) return null;
  if (method === "bitcoin") return "/api/create-bitcoin-order";
  if (method === "zelle") return "/api/create-zelle-order";
  return null;
}

export function getCheckoutActionLabel(method: CheckoutPaymentMethod): string {
  if (!isLiveCheckoutMethod(method)) return "Coming Soon";
  if (method === "bitcoin") return "Continue with Bitcoin";
  if (method === "zelle") return "Continue with Zelle";
  return "Continue";
}

export function getCheckoutPendingLabel(method: CheckoutPaymentMethod): string {
  if (!isLiveCheckoutMethod(method)) return "Coming soon";
  if (method === "bitcoin") return "Starting Bitcoin checkout...";
  if (method === "zelle") return "Starting Zelle checkout...";
  return "Starting checkout...";
}
