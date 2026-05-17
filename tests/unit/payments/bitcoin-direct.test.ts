import { describe, expect, it, vi } from "vitest";
import {
  buildBitcoinDirectCheckoutUrl,
  buildBitcoinUri,
  fetchBitcoinQuote,
  getMissingBitcoinDirectCredentials,
  isBitcoinDirectConfigured,
  verifyBitcoinDirectCheckoutSignature,
} from "@/lib/payments/bitcoin-direct";

const address = "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080";
const env = {
  BITCOIN_DIRECT_CHECKOUT_ENABLED: "true",
  BITCOIN_RECEIVE_ADDRESS: address,
  BITCOIN_DIRECT_SIGNING_SECRET: "direct-secret",
};

describe("Bitcoin direct checkout", () => {
  it("requires a receive address and signing secret", () => {
    expect(getMissingBitcoinDirectCredentials({})).toEqual([
      "BITCOIN_RECEIVE_ADDRESS",
      "BITCOIN_DIRECT_SIGNING_SECRET",
    ]);
    expect(getMissingBitcoinDirectCredentials(env)).toEqual([]);
    expect(isBitcoinDirectConfigured(env)).toBe(true);
  });

  it("quotes BTC from a USD spot price", async () => {
    const quote = await fetchBitcoinQuote({
      amountCents: 100,
      details: {
        receiveAddress: address,
        supportEmail: "abhinav@vialchemlabs.net",
        confirmationsRequired: 1,
        rateBufferBps: 0,
        rateUrl: "https://rate.example.test",
      },
      fetchImpl: vi.fn(async () => {
        return new Response(
          JSON.stringify({ data: { amount: "100000.00", currency: "USD" } }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }),
    });

    expect(quote.btcUsdCents).toBe(10000000);
    expect(quote.sats).toBe(1000);
    expect(quote.btcAmount).toBe("0.00001");
  });

  it("builds and verifies a signed direct checkout URL", () => {
    const url = new URL(
      buildBitcoinDirectCheckoutUrl({
        siteUrl: "https://vialchemlabs.net",
        orderId: "VC-TEST-BTC",
        amountCents: 100,
        details: {
          receiveAddress: address,
          supportEmail: "abhinav@vialchemlabs.net",
          confirmationsRequired: 1,
          rateBufferBps: 0,
          rateUrl: "https://rate.example.test",
        },
        quote: {
          btcUsdCents: 10000000,
          sats: 1000,
          btcAmount: "0.00001",
          rateSource: "https://rate.example.test",
          quotedAt: "2026-05-17T00:00:00.000Z",
        },
        signingSecret: "direct-secret",
      }),
    );

    expect(url.pathname).toBe("/checkout/bitcoin");
    expect(url.searchParams.get("mode")).toBe("direct");
    expect(
      verifyBitcoinDirectCheckoutSignature(url.searchParams, "direct-secret"),
    ).toBe(true);

    url.searchParams.set("btc_sats", "1");
    expect(
      verifyBitcoinDirectCheckoutSignature(url.searchParams, "direct-secret"),
    ).toBe(false);
  });

  it("builds a wallet-compatible bitcoin URI", () => {
    expect(
      buildBitcoinUri({
        address,
        btcAmount: "0.00001",
        orderId: "VC-TEST-BTC",
      }),
    ).toContain(`bitcoin:${address}?`);
  });
});
