import { describe, expect, it } from "vitest";
import {
  buildBitcoinCheckoutUrl,
  buildZelleCheckoutUrl,
  getBtcpayAdapterEnv,
  getMissingBtcpayCredentials,
  getMissingZelleCredentials,
  getZelleDetails,
} from "@/lib/checkout/direct-payment";
import { generateMainSiteOrderReference } from "@/lib/checkout/cart";

describe("direct payment credential helpers", () => {
  it("accepts BTCPAY_URL as a legacy alias for BTCPAY_SERVER_URL", () => {
    const env = {
      BTCPAY_URL: "https://btcpay.example.com",
      BTCPAY_API_KEY: "token",
      BTCPAY_STORE_ID: "store",
      BTCPAY_WEBHOOK_SECRET: "secret",
    };

    expect(getMissingBtcpayCredentials(env)).toEqual([]);
    expect(getBtcpayAdapterEnv(env).BTCPAY_URL).toBe(
      "https://btcpay.example.com",
    );
  });

  it("reports the exact missing BTCPay credential names", () => {
    expect(getMissingBtcpayCredentials({})).toEqual([
      "BTCPAY_SERVER_URL",
      "BTCPAY_API_KEY",
      "BTCPAY_STORE_ID",
      "BTCPAY_WEBHOOK_SECRET",
    ]);
  });

  it("treats visible placeholder values as missing credentials", () => {
    expect(
      getMissingBtcpayCredentials({
        BTCPAY_SERVER_URL: "PLACEHOLDER_BTCPAY_SERVER_URL",
        BTCPAY_API_KEY: "PLACEHOLDER_BTCPAY_API_KEY",
        BTCPAY_STORE_ID: "PLACEHOLDER_BTCPAY_STORE_ID",
        BTCPAY_WEBHOOK_SECRET: "PLACEHOLDER_BTCPAY_WEBHOOK_SECRET",
      }),
    ).toEqual([
      "BTCPAY_SERVER_URL",
      "BTCPAY_API_KEY",
      "BTCPAY_STORE_ID",
      "BTCPAY_WEBHOOK_SECRET",
    ]);
  });

  it("reports the exact missing Zelle placeholder names", () => {
    expect(getMissingZelleCredentials({})).toEqual([
      "ZELLE_RECIPIENT_NAME",
      "ZELLE_EMAIL",
      "ZELLE_PAYMENT_NOTE_PREFIX",
    ]);
  });
});

describe("direct payment URLs", () => {
  it("builds the main-site Bitcoin checkout URL", () => {
    const url = new URL(
      buildBitcoinCheckoutUrl({
        siteUrl: "https://vialchemlabs.net",
        orderId: "VC-260515-ABCDEF12",
        amountCents: 6900,
        invoiceId: "INV-123",
        invoiceUrl: "https://btcpay.example.com/i/INV-123",
      }),
    );

    expect(url.origin).toBe("https://vialchemlabs.net");
    expect(url.pathname).toBe("/checkout/bitcoin");
    expect(url.searchParams.get("order")).toBe("VC-260515-ABCDEF12");
    expect(url.searchParams.get("invoice")).toBe("INV-123");
    expect(url.searchParams.get("invoice_url")).toBe(
      "https://btcpay.example.com/i/INV-123",
    );
  });

  it("builds the main-site Zelle instruction URL", () => {
    const details = getZelleDetails(
      {
        ZELLE_RECIPIENT_NAME: "VialChem Labs LLC",
        ZELLE_EMAIL: "payments@example.com",
        ZELLE_PAYMENT_NOTE_PREFIX: "VCL",
      },
      { allowPlaceholders: false },
    );
    const url = new URL(
      buildZelleCheckoutUrl({
        siteUrl: "https://vialchemlabs.net",
        orderId: "VC-260515-ABCDEF12",
        amountCents: 6900,
        details,
      }),
    );

    expect(url.origin).toBe("https://vialchemlabs.net");
    expect(url.pathname).toBe("/checkout/zelle");
    expect(url.searchParams.get("recipient_handle")).toBe(
      "payments@example.com",
    );
    expect(url.searchParams.get("memo")).toBe("VCL-VC-260515-ABCDEF12");
  });

  it("generates stable VialChem order references when inputs are pinned", () => {
    expect(
      generateMainSiteOrderReference(
        new Date("2026-05-15T12:00:00.000Z"),
        "abcdef12-3456-7890-abcd-ef1234567890",
      ),
    ).toBe("VC-260515-ABCDEF12");
  });
});
