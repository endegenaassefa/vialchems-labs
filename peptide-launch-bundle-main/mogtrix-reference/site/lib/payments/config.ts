export class PaymentConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentConfigurationError";
  }
}

export type PaymentEnv = NodeJS.ProcessEnv & {
  NEXT_PUBLIC_SITE_URL?: string;
  NODE_ENV?: string;
  VERCEL_ENV?: string;
  PAYMENT_PROVIDER?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  PILOT_US_SHIPPING_CENTS?: string;
};

function isLocalHostUrl(value?: string) {
  return Boolean(value && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(value));
}

export function isLocalPaymentDevelopment(env: PaymentEnv = process.env as PaymentEnv) {
  return env.NODE_ENV === "development" || isLocalHostUrl(env.NEXT_PUBLIC_SITE_URL);
}

export function resolvePaymentProvider(env: PaymentEnv = process.env as PaymentEnv) {
  const configured = env.PAYMENT_PROVIDER?.trim().toLowerCase();
  if (configured) {
    return configured;
  }

  return isLocalPaymentDevelopment(env) ? "stub" : "stripe";
}

export function getSiteUrl(env: PaymentEnv = process.env as PaymentEnv) {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    return siteUrl.replace(/\/+$/, "");
  }

  if (isLocalPaymentDevelopment(env)) {
    return "http://localhost:3000";
  }

  throw new PaymentConfigurationError(
    "NEXT_PUBLIC_SITE_URL must be configured before hosted payments can go live."
  );
}

export function requireStripeSecrets(env: PaymentEnv = process.env as PaymentEnv) {
  const secretKey = env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!secretKey || !webhookSecret) {
    throw new PaymentConfigurationError(
      "Stripe is selected for hosted payments, but STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are not fully configured."
    );
  }

  return {
    secretKey,
    webhookSecret
  };
}

export function getPilotUsShippingCents(env: PaymentEnv = process.env as PaymentEnv) {
  const raw = env.PILOT_US_SHIPPING_CENTS?.trim();
  if (raw) {
    const cents = Number.parseInt(raw, 10);
    if (Number.isInteger(cents) && cents >= 0) {
      return cents;
    }

    throw new PaymentConfigurationError(
      "PILOT_US_SHIPPING_CENTS must be a whole number of cents."
    );
  }

  if (isLocalPaymentDevelopment(env)) {
    return 1500;
  }

  throw new PaymentConfigurationError(
    "PILOT_US_SHIPPING_CENTS must be configured before the US checkout pilot can go live."
  );
}
