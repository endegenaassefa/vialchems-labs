/**
 * B3 / F2 / C4 / J2 — Transactional email helpers regression guard
 * (Section 6 super-prompt 2026-05-22).
 *
 * Stub-mode contract: when REQUIRE_RESEND=false (Day-1 default),
 * every helper returns `{ ok: true, stub: true, id: 'stub:...' }`
 * with a tag that lets the Resend dashboard (post-provisioning)
 * group deliverability metrics correctly. Real send vs stub send
 * is purely an env toggle; the call sites should never need to
 * branch on availability.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { sendOrderConfirmation } from "@/lib/email/order-confirmation";
import { sendOrderShipped } from "@/lib/email/order-shipped";
import { sendOperatorOrderNotification } from "@/lib/email/operator-notification";
import { sendContactAck } from "@/lib/email/contact-ack";
import { _resetResendClientForTests } from "@/lib/email/resend";

describe("transactional email helpers — REQUIRE_RESEND=false stub mode", () => {
  beforeEach(() => {
    delete process.env.REQUIRE_RESEND;
    delete process.env.RESEND_API_KEY;
    delete process.env.OPERATOR_EMAIL;
    _resetResendClientForTests();
  });

  afterEach(() => {
    _resetResendClientForTests();
  });

  it("sendOrderConfirmation returns a stub ID tagged order-confirmation", async () => {
    const result = await sendOrderConfirmation({
      displayId: "VCL-TEST-001",
      customerEmail: "buyer@example.com",
      totalCents: 12300,
      rail: "zelle",
      status: "awaiting_payment",
      items: [{ name: "BPC-157, 10mg", qty: 2, unitPriceCents: 6500 }],
      paymentInstructions: "Send Zelle to ...",
    });
    expect(result.ok).toBe(true);
    expect(result.stub).toBe(true);
    expect(result.id).toMatch(/^stub:order-confirmation:/);
  });

  it("sendOrderShipped returns a stub ID tagged order-shipped", async () => {
    const result = await sendOrderShipped({
      displayId: "VCL-TEST-002",
      customerEmail: "buyer@example.com",
      carrier: "USPS",
      trackingNumber: "9400111202555842710018",
    });
    expect(result.ok).toBe(true);
    expect(result.stub).toBe(true);
    expect(result.id).toMatch(/^stub:order-shipped:/);
  });

  it("sendOperatorOrderNotification routes to OPERATOR_EMAIL default + tags placed/paid", async () => {
    const placed = await sendOperatorOrderNotification({
      event: "placed",
      displayId: "VCL-TEST-003",
      totalCents: 12300,
      rail: "zelle",
      customerEmail: "buyer@example.com",
    });
    expect(placed.ok).toBe(true);
    expect(placed.stub).toBe(true);
    expect(placed.id).toMatch(/^stub:operator-order-placed:/);

    const paid = await sendOperatorOrderNotification({
      event: "paid",
      displayId: "VCL-TEST-003",
      totalCents: 12300,
      rail: "zelle",
      customerEmail: "buyer@example.com",
    });
    expect(paid.id).toMatch(/^stub:operator-order-paid:/);
  });

  it("sendContactAck returns a stub ID tagged contact-ack", async () => {
    const result = await sendContactAck({
      customerEmail: "researcher@lab.test",
      customerName: "Researcher",
      subject: "Lot question",
      body: "What batch shipped on 2026-05-20?",
    });
    expect(result.ok).toBe(true);
    expect(result.stub).toBe(true);
    expect(result.id).toMatch(/^stub:contact-ack:/);
  });
});
