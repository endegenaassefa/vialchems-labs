/**
 * Payment provider registry. Selects the active adapter from PAYMENT_PROVIDER
 * env, defaulting to 'stub'. Iron Law 2.5 + 2.9: Day-1 universe is exactly
 * { stub, btcpay, plaid, zelle }. No card rails Day-1.
 */
import { createBtcpayAdapter } from "./btcpay";
import { createPlaidAdapter } from "./plaid";
import { createStubAdapter } from "./stub";
import { createZelleAdapter } from "./zelle";
import type { PaymentProvider, PaymentProviderId } from "./types";
import { envFlag, isProductionRuntime } from "@/lib/runtime-env";

let cachedRegistry: Record<PaymentProviderId, PaymentProvider> | null = null;

function buildRegistry(): Record<PaymentProviderId, PaymentProvider> {
  return {
    stub: createStubAdapter(),
    btcpay: createBtcpayAdapter(),
    plaid: createPlaidAdapter(),
    zelle: createZelleAdapter(),
  };
}

export function getPaymentRegistry(): Record<
  PaymentProviderId,
  PaymentProvider
> {
  if (!cachedRegistry) {
    cachedRegistry = buildRegistry();
  }
  return cachedRegistry;
}

/**
 * Test-only helper: drop the cached registry so a fresh one rebuilds with
 * current env. Production code should not call this.
 */
export function resetPaymentRegistry(): void {
  cachedRegistry = null;
}

const VALID_IDS: PaymentProviderId[] = ["stub", "btcpay", "plaid", "zelle"];

function productionPaymentsRequired(): boolean {
  return isProductionRuntime() && !envFlag("ALLOW_STUB_PAYMENTS_IN_PRODUCTION");
}

export function resolvePaymentProviderId(
  raw: string | undefined,
): PaymentProviderId {
  if (raw && (VALID_IDS as string[]).includes(raw)) {
    const id = raw as PaymentProviderId;
    if (id === "stub" && productionPaymentsRequired()) {
      throw new Error(
        "payment_provider_stub_forbidden: PAYMENT_PROVIDER=stub is not allowed in production. Configure btcpay before launch.",
      );
    }
    return id;
  }
  if (productionPaymentsRequired()) {
    throw new Error(
      "payment_provider_required: PAYMENT_PROVIDER must be btcpay, plaid, or zelle in production.",
    );
  }
  return "stub";
}

export function getPaymentProvider(
  override?: PaymentProviderId,
): PaymentProvider {
  const id = override ?? resolvePaymentProviderId(process.env.PAYMENT_PROVIDER);
  return getPaymentRegistry()[id];
}

export function getPaymentProviderById(id: PaymentProviderId): PaymentProvider {
  return getPaymentRegistry()[id];
}
