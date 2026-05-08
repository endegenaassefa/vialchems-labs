/**
 * Deterministic stub payment adapter.
 *
 * Day-1 default (PAYMENT_PROVIDER=stub). In-memory, no network, auto-confirms
 * intents 2 seconds after creation when NODE_ENV !== 'test'. Test code calls
 * `markPaid(id)` directly to advance state without timers.
 *
 * The factory accepts a `now` clock and `randomId` generator so tests can pin
 * timestamps and IDs without touching globals.
 */
import type {
  CreateIntentInput,
  PaymentIntent,
  PaymentProvider,
  WebhookResult,
} from './types';

export interface StubAdapterOptions {
  /** Override the clock (ISO timestamps). Defaults to `() => new Date()`. */
  now?: () => Date;
  /** Override the ID generator. Defaults to a counter+random hex. */
  randomId?: () => string;
  /** When true, `createIntent` schedules an auto-confirm via setTimeout. */
  autoConfirm?: boolean;
  /** Auto-confirm delay in ms. Default 2000. */
  autoConfirmDelayMs?: number;
}

export interface StubAdapter extends PaymentProvider {
  /** Test/admin helper: force an intent to a given status. */
  markPaid(intentId: string): PaymentIntent | null;
  /** Test helper: drop all in-memory state. */
  reset(): void;
}

const DEFAULT_NOW = (): Date => new Date();
const DEFAULT_RANDOM_ID = (): string => {
  const stamp = Date.now().toString(36);
  const noise = Math.random().toString(36).slice(2, 10);
  return `stub_${stamp}_${noise}`;
};

export function createStubAdapter(
  options: StubAdapterOptions = {},
): StubAdapter {
  const intents = new Map<string, PaymentIntent>();
  const now = options.now ?? DEFAULT_NOW;
  const randomId = options.randomId ?? DEFAULT_RANDOM_ID;
  const autoConfirmDelayMs = options.autoConfirmDelayMs ?? 2000;
  // Default to true except in tests, where determinism matters.
  const isTest =
    typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
  const autoConfirm = options.autoConfirm ?? !isTest;

  function markPaid(intentId: string): PaymentIntent | null {
    const existing = intents.get(intentId);
    if (!existing) return null;
    if (existing.status === 'paid') return existing;
    const updated: PaymentIntent = {
      ...existing,
      status: 'paid',
      updatedAt: now().toISOString(),
    };
    intents.set(intentId, updated);
    return updated;
  }

  return {
    id: 'stub',
    async createIntent(input: CreateIntentInput): Promise<PaymentIntent> {
      const id = randomId();
      const ts = now().toISOString();
      const intent: PaymentIntent = {
        id,
        provider: 'stub',
        method: input.method,
        amountCents: input.amountCents,
        currency: 'USD',
        status: 'pending',
        metadata: {
          orderId: input.orderId,
          customerEmail: input.customerEmail,
          ...(input.metadata ?? {}),
        },
        createdAt: ts,
        updatedAt: ts,
        redirectUrl: `/order/stub/${id}`,
      };
      intents.set(id, intent);

      if (autoConfirm) {
        // Scheduled in real environments only. Tests opt out via
        // autoConfirm: false or via NODE_ENV=test.
        setTimeout(() => {
          markPaid(id);
        }, autoConfirmDelayMs);
      }

      return intent;
    },

    async getIntent(intentId: string): Promise<PaymentIntent | null> {
      return intents.get(intentId) ?? null;
    },

    async handleWebhook(): Promise<WebhookResult> {
      // Stub never receives real webhooks. Returns a no-op result so the
      // generic webhook router can short-circuit safely if mis-routed.
      return { intent: null, eventType: 'noop', verified: false };
    },

    markPaid,

    reset(): void {
      intents.clear();
    },
  };
}
