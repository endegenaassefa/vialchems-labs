import { NextResponse } from "next/server";
import { checkBtcpayHealth } from "@/lib/payments/btcpay-health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const health = await checkBtcpayHealth();
  return NextResponse.json(health, {
    status: health.ok ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
