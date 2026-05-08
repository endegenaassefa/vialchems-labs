/**
 * Public payments API. Importers should use this module rather than reaching
 * into the adapters directly. Tree-shakeable; no side effects on import.
 */
export type {
  CreateIntentInput,
  DiscountCalculation,
  PaymentIntent,
  PaymentMethod,
  PaymentProvider,
  PaymentProviderId,
  PaymentStatus,
  WebhookResult,
} from './types';

export {
  applyPaymentMethodDiscount,
  PAYMENT_DISCOUNT_PCT,
} from './types';

export {
  getPaymentProvider,
  getPaymentProviderById,
  getPaymentRegistry,
  resetPaymentRegistry,
  resolvePaymentProviderId,
} from './config';

export {
  reconcile,
  isTerminalStatus,
  resetReconciliationLedger,
  getReconciliationLedger,
  type ReconcileResult,
} from './reconciliation';

import type {
  CreateIntentInput,
  PaymentIntent,
  PaymentProviderId,
} from './types';
import { getPaymentProvider } from './config';

/**
 * Convenience wrapper: create an intent on the active provider (or override).
 */
export async function createPaymentIntent(
  input: CreateIntentInput,
  override?: PaymentProviderId,
): Promise<PaymentIntent> {
  const provider = getPaymentProvider(override);
  return provider.createIntent(input);
}

/**
 * Convenience wrapper: read an intent on a specific provider.
 */
export async function getPayment(
  intentId: string,
  providerId: PaymentProviderId,
): Promise<PaymentIntent | null> {
  const provider = getPaymentProvider(providerId);
  return provider.getIntent(intentId);
}
