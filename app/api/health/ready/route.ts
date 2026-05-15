import { NextResponse } from "next/server";
import {
  getBtcpayServerUrl,
  getMissingZelleCredentials,
} from "@/lib/checkout/direct-payment";

export const dynamic = "force-dynamic";

function has(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export async function GET(): Promise<Response> {
  const paymentProvider = process.env.PAYMENT_PROVIDER;
  const missing: string[] = [];

  for (const key of [
    "AGE_GATE_SECRET",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "ORDER_EMAIL_FROM",
    "ORDER_STAFF_EMAILS",
  ]) {
    if (!has(key)) missing.push(key);
  }

  if (!paymentProvider || paymentProvider === "stub") {
    missing.push("PAYMENT_PROVIDER=btcpay");
  }

  if (paymentProvider === "btcpay") {
    for (const key of [
      "BTCPAY_SERVER_URL",
      "BTCPAY_API_KEY",
      "BTCPAY_STORE_ID",
      "BTCPAY_WEBHOOK_SECRET",
    ]) {
      if (key === "BTCPAY_SERVER_URL") {
        if (!getBtcpayServerUrl()) missing.push(key);
      } else if (!has(key)) {
        missing.push(key);
      }
    }
  }

  for (const key of getMissingZelleCredentials()) {
    missing.push(key);
  }

  const ready = missing.length === 0;
  return NextResponse.json(
    {
      status: ready ? "ready" : "not_ready",
      service: "vialchemlabs",
      checks: {
        node: process.versions.node,
        paymentProvider: paymentProvider ?? null,
        missing,
      },
      time: new Date().toISOString(),
    },
    { status: ready ? 200 : 503 },
  );
}
