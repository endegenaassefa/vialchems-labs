import { NextResponse } from "next/server";

import { getPaymentAdapter } from "@/lib/payments";
import { processPaymentWebhookEvent } from "@/lib/payments/server";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature")
    ?? request.headers.get("x-payment-signature")
    ?? "";
  const adapter = getPaymentAdapter();
  const verification = await adapter.verifyWebhook(payload, signature);

  if (!verification.valid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const result = await processPaymentWebhookEvent(verification, payload);
  return NextResponse.json(result.body, { status: result.status });
}
