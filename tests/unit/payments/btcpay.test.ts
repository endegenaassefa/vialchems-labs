/**
 * BTCPay adapter tests. Covers stub-env guard, signature verification,
 * status mapping, and webhook routing.
 */
import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  createBtcpayAdapter,
  envIsConfigured,
  mapBtcpayStatus,
  verifyBtcpaySignature,
  type BtcpayEnv,
} from '@/lib/payments/btcpay';

const STUB_ENV: BtcpayEnv = {
  BTCPAY_URL: 'https://stub-btcpay.example.com',
  BTCPAY_API_KEY: 'stub_btcpay_api_key',
  BTCPAY_STORE_ID: 'stub_store_id',
  BTCPAY_WEBHOOK_SECRET: 'stub_btcpay_webhook_secret',
};

const REAL_ENV: BtcpayEnv = {
  BTCPAY_URL: 'https://btcpay.real.example',
  BTCPAY_API_KEY: 'real_key_xyz',
  BTCPAY_STORE_ID: 'real_store_42',
  BTCPAY_WEBHOOK_SECRET: 'real_webhook_secret',
};

function sign(body: string, secret: string): string {
  return (
    'sha256=' +
    crypto.createHmac('sha256', secret).update(body).digest('hex')
  );
}

describe('envIsConfigured', () => {
  it('returns false when all values are stub defaults', () => {
    expect(envIsConfigured(STUB_ENV)).toBe(false);
  });

  it('returns false when any value is missing', () => {
    expect(envIsConfigured({ ...REAL_ENV, BTCPAY_API_KEY: '' })).toBe(false);
    expect(envIsConfigured({ ...REAL_ENV, BTCPAY_URL: undefined })).toBe(false);
  });

  it('returns true when all values are non-stub', () => {
    expect(envIsConfigured(REAL_ENV)).toBe(true);
  });
});

describe('mapBtcpayStatus', () => {
  it('maps New / PaidPartial / InvoiceCreated to pending', () => {
    expect(mapBtcpayStatus('New')).toBe('pending');
    expect(mapBtcpayStatus('PaidPartial')).toBe('pending');
    expect(mapBtcpayStatus('InvoiceCreated')).toBe('pending');
  });

  it('maps Processing → authorized', () => {
    expect(mapBtcpayStatus('Processing')).toBe('authorized');
    expect(mapBtcpayStatus('InvoiceProcessing')).toBe('authorized');
  });

  it('maps Settled / Paid / InvoiceSettled → paid', () => {
    expect(mapBtcpayStatus('Settled')).toBe('paid');
    expect(mapBtcpayStatus('Paid')).toBe('paid');
    expect(mapBtcpayStatus('InvoiceSettled')).toBe('paid');
  });

  it('maps Expired / Invalid → failed', () => {
    expect(mapBtcpayStatus('Expired')).toBe('failed');
    expect(mapBtcpayStatus('Invalid')).toBe('failed');
    expect(mapBtcpayStatus('InvoiceExpired')).toBe('failed');
  });

  it('falls back to pending on unknown statuses', () => {
    expect(mapBtcpayStatus('FooBar')).toBe('pending');
    expect(mapBtcpayStatus('')).toBe('pending');
  });
});

describe('verifyBtcpaySignature', () => {
  const secret = 'real_webhook_secret';
  const body = '{"type":"InvoiceSettled","invoiceId":"inv_1"}';

  it('accepts a valid signature', () => {
    expect(verifyBtcpaySignature(body, sign(body, secret), secret)).toBe(true);
  });

  it('rejects a missing signature', () => {
    expect(verifyBtcpaySignature(body, undefined, secret)).toBe(false);
    expect(verifyBtcpaySignature(body, '', secret)).toBe(false);
  });

  it('rejects a forged signature', () => {
    const forged = 'sha256=' + 'a'.repeat(64);
    expect(verifyBtcpaySignature(body, forged, secret)).toBe(false);
  });

  it('rejects when body is tampered after signing', () => {
    const sig = sign(body, secret);
    expect(verifyBtcpaySignature(body + 'tamper', sig, secret)).toBe(false);
  });

  it('accepts a signature without the sha256= prefix', () => {
    const sig = sign(body, secret).slice('sha256='.length);
    expect(verifyBtcpaySignature(body, sig, secret)).toBe(true);
  });

  it('rejects when secret is empty', () => {
    expect(verifyBtcpaySignature(body, sign(body, secret), '')).toBe(false);
  });

  it('rejects malformed hex without throwing', () => {
    const badHex = 'sha256=not-valid-hex-zzz';
    expect(verifyBtcpaySignature(body, badHex, secret)).toBe(false);
  });
});

describe('createBtcpayAdapter — stub env guards', () => {
  it('throws on createIntent when env is stubbed', async () => {
    const adapter = createBtcpayAdapter({ env: STUB_ENV });
    await expect(
      adapter.createIntent({
        amountCents: 5400,
        method: 'crypto',
        orderId: 'order_x',
        customerEmail: 'r@example.com',
      }),
    ).rejects.toThrow(/btcpay_not_configured/);
  });

  it('returns null on getIntent when env is stubbed', async () => {
    const adapter = createBtcpayAdapter({ env: STUB_ENV });
    expect(await adapter.getIntent('any_id')).toBeNull();
  });

  it('throws not-implemented even with real env (Phase 10 wires HTTP)', async () => {
    const adapter = createBtcpayAdapter({ env: REAL_ENV });
    await expect(
      adapter.createIntent({
        amountCents: 5400,
        method: 'crypto',
        orderId: 'order_x',
        customerEmail: 'r@example.com',
      }),
    ).rejects.toThrow(/btcpay_create_intent_not_implemented/);
  });
});

describe('createBtcpayAdapter — handleWebhook', () => {
  const secret = 'real_webhook_secret';
  const env: BtcpayEnv = { ...REAL_ENV, BTCPAY_WEBHOOK_SECRET: secret };

  it('rejects unverified payloads', async () => {
    const adapter = createBtcpayAdapter({ env });
    const body = '{"type":"InvoiceSettled","invoiceId":"inv_1"}';
    const result = await adapter.handleWebhook(body, {});
    expect(result.verified).toBe(false);
    expect(result.eventType).toBe('unverified');
    expect(result.intent).toBeNull();
  });

  it('verifies and maps a settled invoice to a paid intent', async () => {
    const adapter = createBtcpayAdapter({ env });
    const body = JSON.stringify({
      type: 'InvoiceSettled',
      invoiceId: 'inv_1',
      status: 'Settled',
      metadata: { intentId: 'pi_42' },
    });
    const result = await adapter.handleWebhook(body, {
      'btcpay-sig': sign(body, secret),
    });
    expect(result.verified).toBe(true);
    expect(result.eventType).toBe('InvoiceSettled');
    expect(result.intent).not.toBeNull();
    expect(result.intent?.id).toBe('pi_42');
    expect(result.intent?.provider).toBe('btcpay');
    expect(result.intent?.status).toBe('paid');
    expect(result.intent?.method).toBe('crypto');
    expect(result.intent?.externalId).toBe('inv_1');
  });

  it('verified-but-missing-intentId returns null intent', async () => {
    const adapter = createBtcpayAdapter({ env });
    const body = JSON.stringify({
      type: 'InvoiceCreated',
      status: 'New',
    });
    const result = await adapter.handleWebhook(body, {
      'btcpay-sig': sign(body, secret),
    });
    expect(result.verified).toBe(true);
    expect(result.intent).toBeNull();
  });

  it('falls back to invoiceId when metadata.intentId is missing', async () => {
    const adapter = createBtcpayAdapter({ env });
    const body = JSON.stringify({
      type: 'InvoiceSettled',
      invoiceId: 'inv_99',
      status: 'Settled',
    });
    const result = await adapter.handleWebhook(body, {
      'btcpay-sig': sign(body, secret),
    });
    expect(result.verified).toBe(true);
    expect(result.intent?.id).toBe('inv_99');
  });
});
