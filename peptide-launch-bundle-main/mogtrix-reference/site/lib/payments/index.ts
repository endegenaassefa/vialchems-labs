import { StubPaymentAdapter } from "@/lib/payments/stub";
import {
  PaymentConfigurationError,
  requireStripeSecrets,
  resolvePaymentProvider,
  type PaymentEnv
} from "@/lib/payments/config";
import { StripePaymentAdapter } from "@/lib/payments/stripe";
import type { PaymentAdapter } from "@/lib/payments/types";

export function getPaymentAdapter(env: PaymentEnv = process.env as PaymentEnv): PaymentAdapter {
  switch (resolvePaymentProvider(env)) {
    case "stub":
      if (resolvePaymentProvider(env) === "stub" && env.NODE_ENV === "production") {
        throw new PaymentConfigurationError(
          "Stub payments cannot run in production."
        );
      }
      return new StubPaymentAdapter();
    case "stripe": {
      const { secretKey, webhookSecret } = requireStripeSecrets(env);
      return new StripePaymentAdapter(secretKey, webhookSecret);
    }
    default:
      throw new PaymentConfigurationError("Unsupported payment provider configuration.");
  }
}

export type {
  HostedPaymentSession,
  HostedPaymentLineItem,
  HostedPaymentShippingAddress,
  PaymentAdapter,
  PaymentIntent,
  PaymentStatusSnapshot,
  PaymentWebhookVerification
} from "@/lib/payments/types";

export { PaymentConfigurationError } from "@/lib/payments/config";
