/**
 * Payment provider registry. Selects the active adapter from PAYMENT_PROVIDER
 * env, defaulting to 'stub'. Iron Law 2.5 + 2.9: Day-1 universe is exactly
 * { stub, btcpay, plaid }. No card rails Day-1.
 */
import { createBtcpayAdapter } from './btcpay';
import { createPlaidAdapter } from './plaid';
import { createStubAdapter } from './stub';
import type { PaymentProvider, PaymentProviderId } from './types';

let cachedRegistry: Record<PaymentProviderId, PaymentProvider> | null = null;

function buildRegistry(): Record<PaymentProviderId, PaymentProvider> {
  return {
    stub: createStubAdapter(),
    btcpay: createBtcpayAdapter(),
    plaid: createPlaidAdapter(),
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

const VALID_IDS: PaymentProviderId[] = ['stub', 'btcpay', 'plaid'];

export function resolvePaymentProviderId(
  raw: string | undefined,
): PaymentProviderId {
  if (raw && (VALID_IDS as string[]).includes(raw)) {
    return raw as PaymentProviderId;
  }
  return 'stub';
}

export function getPaymentProvider(
  override?: PaymentProviderId,
): PaymentProvider {
  const id =
    override ?? resolvePaymentProviderId(process.env.PAYMENT_PROVIDER);
  return getPaymentRegistry()[id];
}

export function getPaymentProviderById(
  id: PaymentProviderId,
): PaymentProvider {
  return getPaymentRegistry()[id];
}
