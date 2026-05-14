import { afterEach, describe, expect, it } from "vitest";
import {
  getCheckoutPaymentProvider,
  resetPaymentRegistry,
} from "@/lib/payments/config";

describe("getCheckoutPaymentProvider", () => {
  afterEach(() => {
    delete process.env.PAYMENT_PROVIDER;
    resetPaymentRegistry();
  });

  it("uses the configured provider for crypto checkout", () => {
    process.env.PAYMENT_PROVIDER = "btcpay";
    expect(getCheckoutPaymentProvider("crypto").id).toBe("btcpay");
  });

  it("forces the Zelle adapter when checkout method is zelle", () => {
    process.env.PAYMENT_PROVIDER = "btcpay";
    expect(getCheckoutPaymentProvider("zelle").id).toBe("zelle");
  });
});
