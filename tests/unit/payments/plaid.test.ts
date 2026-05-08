/**
 * Plaid adapter tests. Same shape as BTCPay tests: stub-env guard,
 * signature verification, status mapping, webhook routing.
 */
import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  createPlaidAdapter,
  envIsConfigured,
  mapPlaidStatus,
  verifyPlaidSignature,
  type PlaidEnv,
} from '@/lib/payments/plaid';

const STUB_ENV: PlaidEnv = {
  PLAID_CLIENT_ID: 'stub_plaid_client_id',
  PLAID_SECRET: 'stub_plaid_secret',
  PLAID_ENV: 'sandbox',
  PLAID_WEBHOOK_VERIFICATION_KEY: 'stub_plaid_webhook_verification_key',
};

const REAL_ENV: PlaidEnv = {
  PLAID_CLIENT_ID: 'real_client_id',
  PLAID_SECRET: 'real_secret_xyz',
  PLAID_ENV: 'sandbox',
  PLAID_WEBHOOK_VERIFICATION_KEY: 'real_webhook_key',
};

function sign(body: string, key: string): string {
  return (
    'sha256=' +
    crypto.createHmac('sha256', key).update(body).digest('hex')
  );
}

describe('Plaid envIsConfigured', () => {
  it('returns false when stub values are set', () => {
    expect(envIsConfigured(STUB_ENV)).toBe(false);
  });

  it('returns true when CLIENT_ID + SECRET are real', () => {
    expect(envIsConfigured(REAL_ENV)).toBe(true);
  });

  it('returns false when client id is missing', () => {
    expect(
      envIsConfigured({ ...REAL_ENV, PLAID_CLIENT_ID: undefined }),
    ).toBe(false);
  });
});

describe('mapPlaidStatus', () => {
  it('maps POSTED / SETTLED / COMPLETED → paid', () => {
    expect(mapPlaidStatus('TRANSFER_POSTED')).toBe('paid');
    expect(mapPlaidStatus('TRANSFER_SETTLED')).toBe('paid');
    expect(mapPlaidStatus('TRANSFER_COMPLETED')).toBe('paid');
  });

  it('maps RETURNED / FAILED / CANCELED → failed', () => {
    expect(mapPlaidStatus('TRANSFER_RETURNED')).toBe('failed');
    expect(mapPlaidStatus('TRANSFER_FAILED')).toBe('failed');
    expect(mapPlaidStatus('TRANSFER_CANCELED')).toBe('failed');
    expect(mapPlaidStatus('TRANSFER_CANCELLED')).toBe('failed');
  });

  it('maps AUTH / VERIFIED → authorized', () => {
    expect(mapPlaidStatus('AUTH_AUTOMATICALLY_VERIFIED')).toBe('authorized');
    expect(mapPlaidStatus('AUTH_MANUALLY_VERIFIED')).toBe('authorized');
  });

  it('falls back to pending on unknown', () => {
    expect(mapPlaidStatus('SOMETHING_ELSE')).toBe('pending');
    expect(mapPlaidStatus('')).toBe('pending');
  });
});

describe('verifyPlaidSignature', () => {
  const key = 'real_webhook_key';
  const body = '{"webhook_type":"TRANSFER","webhook_code":"POSTED"}';

  it('accepts a valid signature', () => {
    expect(verifyPlaidSignature(body, sign(body, key), key)).toBe(true);
  });

  it('rejects forged signatures', () => {
    expect(
      verifyPlaidSignature(body, 'sha256=' + 'b'.repeat(64), key),
    ).toBe(false);
  });

  it('rejects tampered body', () => {
    const sig = sign(body, key);
    expect(verifyPlaidSignature(body + ' ', sig, key)).toBe(false);
  });

  it('rejects missing inputs', () => {
    expect(verifyPlaidSignature(body, undefined, key)).toBe(false);
    expect(verifyPlaidSignature(body, sign(body, key), '')).toBe(false);
  });
});

describe('createPlaidAdapter — stub env guards', () => {
  it('throws on createIntent when env is stubbed', async () => {
    const adapter = createPlaidAdapter({ env: STUB_ENV });
    await expect(
      adapter.createIntent({
        amountCents: 5400,
        method: 'ach',
        orderId: 'order_x',
        customerEmail: 'r@example.com',
      }),
    ).rejects.toThrow(/plaid_not_configured/);
  });

  it('returns null on getIntent with stub env', async () => {
    const adapter = createPlaidAdapter({ env: STUB_ENV });
    expect(await adapter.getIntent('any')).toBeNull();
  });

  it('throws not-implemented even with real env', async () => {
    const adapter = createPlaidAdapter({ env: REAL_ENV });
    await expect(
      adapter.createIntent({
        amountCents: 5400,
        method: 'ach',
        orderId: 'order_x',
        customerEmail: 'r@example.com',
      }),
    ).rejects.toThrow(/plaid_create_intent_not_implemented/);
  });
});

describe('createPlaidAdapter — handleWebhook', () => {
  const key = 'real_webhook_key';
  const env: PlaidEnv = { ...REAL_ENV, PLAID_WEBHOOK_VERIFICATION_KEY: key };

  it('rejects unverified payloads', async () => {
    const adapter = createPlaidAdapter({ env });
    const body = '{"webhook_type":"TRANSFER","webhook_code":"POSTED"}';
    const result = await adapter.handleWebhook(body, {});
    expect(result.verified).toBe(false);
    expect(result.intent).toBeNull();
  });

  it('verifies and maps a posted transfer to paid', async () => {
    const adapter = createPlaidAdapter({ env });
    const body = JSON.stringify({
      webhook_type: 'TRANSFER',
      webhook_code: 'POSTED',
      transfer_id: 'tr_42',
      metadata: { intentId: 'pi_77' },
    });
    const result = await adapter.handleWebhook(body, {
      'plaid-verification': sign(body, key),
    });
    expect(result.verified).toBe(true);
    expect(result.eventType).toBe('TRANSFER:POSTED');
    expect(result.intent?.status).toBe('paid');
    expect(result.intent?.id).toBe('pi_77');
    expect(result.intent?.provider).toBe('plaid');
    expect(result.intent?.method).toBe('ach');
    expect(result.intent?.externalId).toBe('tr_42');
  });

  it('falls back to transfer_id when metadata.intentId is missing', async () => {
    const adapter = createPlaidAdapter({ env });
    const body = JSON.stringify({
      webhook_type: 'TRANSFER',
      webhook_code: 'POSTED',
      transfer_id: 'tr_99',
    });
    const result = await adapter.handleWebhook(body, {
      'plaid-verification': sign(body, key),
    });
    expect(result.verified).toBe(true);
    expect(result.intent?.id).toBe('tr_99');
  });

  it('AUTH webhook → authorized status', async () => {
    const adapter = createPlaidAdapter({ env });
    const body = JSON.stringify({
      webhook_type: 'AUTH',
      webhook_code: 'AUTOMATICALLY_VERIFIED',
      item_id: 'item_42',
      metadata: { intentId: 'pi_5' },
    });
    const result = await adapter.handleWebhook(body, {
      'plaid-verification': sign(body, key),
    });
    expect(result.verified).toBe(true);
    expect(result.intent?.status).toBe('authorized');
  });
});
