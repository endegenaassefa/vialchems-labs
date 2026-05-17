import { checkBtcpayHealth } from "@/lib/payments/btcpay-health";
import {
  getMissingBitcoinDirectCredentials,
  isBitcoinDirectConfigured,
  type BitcoinDirectDetails,
  getBitcoinDirectDetails,
} from "@/lib/payments/bitcoin-direct";
import type { RuntimeEnv } from "@/lib/checkout/direct-payment";

export type BitcoinCheckoutMode = "btcpay" | "direct" | "unavailable";

export interface BitcoinCheckoutStatus {
  ok: boolean;
  mode: BitcoinCheckoutMode;
  message: string;
  btcpayReachable: boolean;
  directConfigured: boolean;
  missing?: string[];
  direct?: Pick<
    BitcoinDirectDetails,
    "supportEmail" | "confirmationsRequired" | "rateBufferBps"
  >;
}

export async function checkBitcoinCheckoutStatus({
  env = process.env,
  fetchImpl = fetch,
}: {
  env?: RuntimeEnv;
  fetchImpl?: typeof fetch;
} = {}): Promise<BitcoinCheckoutStatus> {
  const btcpay = await checkBtcpayHealth({ env, fetchImpl });
  if (btcpay.ok) {
    return {
      ok: true,
      mode: "btcpay",
      message: "BTCPay checkout is reachable.",
      btcpayReachable: true,
      directConfigured: isBitcoinDirectConfigured(env),
    };
  }

  if (isBitcoinDirectConfigured(env)) {
    const direct = getBitcoinDirectDetails(env);
    return {
      ok: true,
      mode: "direct",
      message:
        "Direct Bitcoin checkout is configured and will be used while BTCPay is unavailable.",
      btcpayReachable: false,
      directConfigured: true,
      direct: {
        supportEmail: direct.supportEmail,
        confirmationsRequired: direct.confirmationsRequired,
        rateBufferBps: direct.rateBufferBps,
      },
    };
  }

  const missing = getMissingBitcoinDirectCredentials(env);
  return {
    ok: false,
    mode: "unavailable",
    message: `Bitcoin checkout unavailable: ${btcpay.message}`,
    btcpayReachable: false,
    directConfigured: false,
    missing,
  };
}
