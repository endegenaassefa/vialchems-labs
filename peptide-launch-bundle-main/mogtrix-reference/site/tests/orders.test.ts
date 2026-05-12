import { describe, expect, it } from "vitest";

import { StubPaymentAdapter } from "@/lib/payments/stub";
import {
  buildOrderDraft,
  createOrderId,
  getCustomerOrderState,
  getOrderStatusLabel,
  type CheckoutProductSnapshot
} from "@/lib/orders";

const products: CheckoutProductSnapshot[] = [
  {
    id: "bpc-157-5mg",
    sku: "MGX-REC-BPC-005",
    name: "BPC-157 5mg",
    priceCents: 4900,
    active: true,
    checkoutEnabled: true
  },
  {
    id: "cjc-1295-no-dac-5mg",
    sku: "MGX-GH-CJC-005",
    name: "CJC-1295 No DAC 5mg",
    priceCents: 6900,
    active: true,
    checkoutEnabled: true
  }
];

describe("order helpers", () => {
  it("calculates subtotal and total from live product prices", () => {
    const draft = buildOrderDraft({
      customerId: "customer_1",
      idempotencyKey: "49356ae0-f1a7-4601-b54d-a33d5f80ab70",
      items: [
        { productId: "bpc-157-5mg", quantity: 2 },
        { productId: "cjc-1295-no-dac-5mg", quantity: 1 }
      ],
      products,
      shipping: {
        shippingName: "Research Lead",
        shippingAddressLine1: "100 Lab Way",
        shippingAddressLine2: "Suite 4",
        shippingCity: "Boston",
        shippingState: "MA",
        shippingPostalCode: "02110",
        shippingCountry: "US"
      }
    });

    expect(draft.order.subtotalCents).toBe(16700);
    expect(draft.order.totalCents).toBe(16700);
    expect(draft.order.status).toBe("draft");
    expect(draft.order.paymentStatus).toBe("pending");
    expect(draft.order.externalPaymentUrl).toBeNull();
    expect(draft.order.externalPaymentReference).toBeNull();
    expect(draft.order.customerNextStep).toContain("checkout");
    expect(draft.items).toHaveLength(2);
    expect(draft.items[0]).toMatchObject({
      productId: "bpc-157-5mg",
      priceCents: 4900,
      quantity: 2
    });
  });

  it("rejects missing or inactive products", () => {
    expect(() =>
      buildOrderDraft({
        customerId: "customer_1",
        idempotencyKey: "49356ae0-f1a7-4601-b54d-a33d5f80ab70",
        items: [{ productId: "missing", quantity: 1 }],
        products,
        shipping: {
          shippingName: "Research Lead",
          shippingAddressLine1: "100 Lab Way",
          shippingCity: "Boston",
          shippingState: "MA",
          shippingPostalCode: "02110",
          shippingCountry: "US"
        }
      })
    ).toThrow(/not available/i);
  });

  it("rejects products outside the pilot checkout set", () => {
    expect(() =>
      buildOrderDraft({
        customerId: "customer_1",
        idempotencyKey: "49356ae0-f1a7-4601-b54d-a33d5f80ab70",
        items: [{ productId: "bpc-157-5mg", quantity: 1 }],
        products: [
          {
            ...products[0],
            checkoutEnabled: false
          }
        ],
        shipping: {
          shippingName: "Research Lead",
          shippingAddressLine1: "100 Lab Way",
          shippingCity: "Boston",
          shippingState: "MA",
          shippingPostalCode: "02110",
          shippingCountry: "US"
        }
      })
    ).toThrow(/pilot checkout set/i);
  });

  it("rejects non-US shipping destinations for the first-sale pilot", () => {
    expect(() =>
      buildOrderDraft({
        customerId: "customer_1",
        idempotencyKey: "49356ae0-f1a7-4601-b54d-a33d5f80ab70",
        items: [{ productId: "bpc-157-5mg", quantity: 1 }],
        products,
        shipping: {
          shippingName: "Research Lead",
          shippingAddressLine1: "100 Lab Way",
          shippingCity: "Toronto",
          shippingState: "ON",
          shippingPostalCode: "M5V 2T6",
          shippingCountry: "CA"
        }
      })
    ).toThrow(/US shipping/i);
  });

  it("creates a stable order id prefix", () => {
    expect(createOrderId()).toMatch(/^ord_/);
  });

  it("maps the hosted-payment order lifecycle to customer-facing labels", () => {
    expect(getOrderStatusLabel("payment_requested")).toBe("Payment requested");
    expect(getOrderStatusLabel("payment_pending")).toBe("Payment pending");
    expect(getOrderStatusLabel("completed")).toBe("Completed");
    expect(getOrderStatusLabel("issue")).toBe("Issue");

    expect(
      getCustomerOrderState({
        status: "payment_pending",
        paymentStatus: "pending"
      })
    ).toMatchObject({
      label: "Payment pending",
      actionRequired: false
    });

    expect(
      getCustomerOrderState({
        status: "issue",
        paymentStatus: "failed"
      })
    ).toMatchObject({
      label: "Issue / follow-up required",
      actionRequired: true
    });
  });
});

describe("stub payment adapter", () => {
  it("creates hosted payment sessions without auto-succeeding the order", async () => {
    const adapter = new StubPaymentAdapter();
    const session = await adapter.createHostedPaymentSession({
      amountCents: 16700,
      currency: "usd",
      orderId: "ord_test",
      customerEmail: "lead@example.com"
    });

    expect(session.provider).toBe("stub");
    expect(session.status).toBe("payment_requested");
    expect(session.reference).toMatch(/^stub_pay_/);
    expect(session.hostedUrl).toContain(session.reference);
    expect(session.customerMessage).toMatch(/hosted payment/i);
  });

  it("verifies and parses stub webhook payloads", async () => {
    const adapter = new StubPaymentAdapter();
    const payload = JSON.stringify({
      eventId: "evt_test",
      eventType: "payment.paid",
      reference: "stub_pay_test",
      orderId: "ord_test"
    });

    await expect(
      adapter.verifyWebhook(payload, process.env.STUB_PAYMENT_WEBHOOK_SECRET ?? "stub_signature")
    ).resolves.toMatchObject({
      valid: true,
      eventId: "evt_test",
      eventType: "payment.paid",
      reference: "stub_pay_test",
      orderId: "ord_test"
    });
  });
});
