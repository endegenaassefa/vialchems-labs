import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/bitcoin/receipt/route";
import { signBitcoinDirectCheckoutParams } from "@/lib/payments/bitcoin-direct";

vi.mock("@/lib/email/resend", () => ({
  sendEmail: vi.fn(async () => ({ id: "email_1" })),
}));

import { sendEmail } from "@/lib/email/resend";

const address = "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080";

function signedSig(overrides: Record<string, string> = {}) {
  const params = new URLSearchParams();
  params.set("order", overrides.order ?? "VC-260517-BTC001");
  params.set("amount_cents", overrides.amount_cents ?? "100");
  params.set("btc_sats", overrides.btc_sats ?? "1000");
  params.set("btc_amount", overrides.btc_amount ?? "0.00001");
  params.set("btc_usd_cents", overrides.btc_usd_cents ?? "10000000");
  params.set("address", overrides.address ?? address);
  params.set("rate_source", overrides.rate_source ?? "https://rate.example");
  params.set("quoted_at", overrides.quoted_at ?? "2026-05-17T00:00:00.000Z");
  params.set(
    "support_email",
    overrides.support_email ?? "abhinav@vialchemlabs.net",
  );
  return signBitcoinDirectCheckoutParams(
    params,
    "local-bitcoin-direct-signing-secret",
  );
}

function receiptBody(overrides: Record<string, unknown> = {}) {
  return {
    order: "VC-260517-BTC001",
    amountCents: 100,
    btcSats: 1000,
    btcAmount: "0.00001",
    btcUsdCents: 10000000,
    address,
    rateSource: "https://rate.example",
    quotedAt: "2026-05-17T00:00:00.000Z",
    supportEmail: "abhinav@vialchemlabs.net",
    sig: signedSig(),
    txid: "a".repeat(64),
    customer: {
      name: "Endegena Elias Assefa",
      email: "endegenaassefa@gmail.com",
      street: "49 Highland Ave",
      street2: "Apt 18",
      city: "Randolph",
      stateCode: "MA",
      zip: "02368",
      countryCode: "US",
      attestation: true,
    },
    ...overrides,
  };
}

function request(body: unknown) {
  return new Request("http://localhost/api/bitcoin/receipt", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/bitcoin/receipt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("emails staff a signed Bitcoin receipt with transaction details", async () => {
    const response = await POST(request(receiptBody()));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, order: "VC-260517-BTC001" });
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Bitcoin receipt: VC-260517-BTC001",
        text: expect.stringContaining("Transaction ID: " + "a".repeat(64)),
      }),
    );
  });

  it("rejects edited signed payment details", async () => {
    const response = await POST(request(receiptBody({ btcSats: 2000 })));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("invalid_signature");
  });
});
