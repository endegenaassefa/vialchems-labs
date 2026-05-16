import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendEmailMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn(),
}));

vi.mock("@/lib/email/resend", () => ({
  sendEmail: sendEmailMock,
}));

import { POST } from "@/app/api/zelle/receipt/route";
import { signZelleCheckoutParams } from "@/lib/checkout/direct-payment";

function signedPayment(overrides: Record<string, string> = {}) {
  const params = new URLSearchParams();
  params.set("order", overrides.order ?? "VC-260515-ZELLE001");
  params.set("amount_cents", overrides.amount_cents ?? "100");
  params.set("recipient_name", overrides.recipient_name ?? "Vialchem Labs LLC");
  params.set("recipient_handle", overrides.recipient_handle ?? "vialchem-pay");
  params.set("memo", overrides.memo ?? "VCL-VC-260515-ZELLE001");
  params.set(
    "zelle_email",
    overrides.zelle_email ?? "abhinav@vialchemlabs.net",
  );
  params.set(
    "support_email",
    overrides.support_email ?? "abhinav@vialchemlabs.net",
  );
  params.set(
    "sig",
    signZelleCheckoutParams(params, "local-zelle-checkout-signing-secret"),
  );
  return params;
}

function receiptBody(overrides: Record<string, unknown> = {}) {
  const payment = signedPayment();
  return {
    order: payment.get("order"),
    amountCents: Number(payment.get("amount_cents")),
    recipientName: payment.get("recipient_name"),
    recipientHandle: payment.get("recipient_handle"),
    memo: payment.get("memo"),
    zelleEmail: payment.get("zelle_email"),
    supportEmail: payment.get("support_email"),
    sig: payment.get("sig"),
    customer: {
      name: "Research Buyer",
      email: "buyer@example.com",
      senderName: "Research Buyer",
      street: "4448 Ammendale Road",
      street2: "",
      city: "Beltsville",
      stateCode: "MD",
      zip: "20705",
      countryCode: "US",
      attestation: true,
    },
    ...overrides,
  };
}

function request(body: unknown): Request {
  return new Request("http://localhost/api/zelle/receipt", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/zelle/receipt", () => {
  beforeEach(() => {
    sendEmailMock.mockReset();
    sendEmailMock.mockResolvedValue({ ok: true, id: "stub:zelle" });
  });

  it("emails staff a signed Zelle receipt with fulfillment details", async () => {
    const response = await POST(request(receiptBody()));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      order: "VC-260515-ZELLE001",
    });

    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: "buyer@example.com",
        subject: "Zelle receipt: VC-260515-ZELLE001",
        text: expect.stringContaining("Zelle ID: vialchem-pay"),
      }),
    );
  });

  it("rejects tampered payment amounts", async () => {
    const response = await POST(request(receiptBody({ amountCents: 200 })));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "invalid_signature",
    });
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("rejects non-US shipping countries", async () => {
    const body = receiptBody({
      customer: {
        ...receiptBody().customer,
        countryCode: "CA",
      },
    });
    const response = await POST(request(body));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "invalid_receipt",
    });
  });
});
