import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function has(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function flag(name: string): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export async function GET(): Promise<Response> {
  const paymentProvider = process.env.PAYMENT_PROVIDER;
  const zelleEnabled = flag("ENABLE_ZELLE");
  const zellePublicEnabled = flag("NEXT_PUBLIC_ENABLE_ZELLE");
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
      "BTCPAY_URL",
      "BTCPAY_API_KEY",
      "BTCPAY_STORE_ID",
      "BTCPAY_WEBHOOK_SECRET",
    ]) {
      if (!has(key)) missing.push(key);
    }
  }

  if (paymentProvider === "zelle" || zelleEnabled || zellePublicEnabled) {
    for (const key of [
      "ENABLE_ZELLE=true",
      "NEXT_PUBLIC_ENABLE_ZELLE=true",
      "ZELLE_BUSINESS_NAME",
      "ZELLE_HANDLE",
      "ZELLE_BANK_NAME",
      "ZELLE_TERMS_APPROVED_AT",
      "OPS_API_TOKEN",
    ]) {
      if (key === "ENABLE_ZELLE=true") {
        if (!zelleEnabled) missing.push(key);
      } else if (key === "NEXT_PUBLIC_ENABLE_ZELLE=true") {
        if (!zellePublicEnabled) missing.push(key);
      } else if (!has(key)) {
        missing.push(key);
      }
    }
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
