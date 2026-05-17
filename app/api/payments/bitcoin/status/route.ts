import { NextResponse } from "next/server";
import { checkBitcoinCheckoutStatus } from "@/lib/payments/bitcoin-status";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const status = await checkBitcoinCheckoutStatus();
  return NextResponse.json(status, {
    status: status.ok ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
