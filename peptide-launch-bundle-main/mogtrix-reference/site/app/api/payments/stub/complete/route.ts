import { NextResponse } from "next/server";
import { z } from "zod/v4";

import { isLocalPaymentDevelopment } from "@/lib/payments/config";
import { processPaymentWebhookEvent } from "@/lib/payments/server";

const schema = z.object({
  orderId: z.string().min(1),
  reference: z.string().min(1),
  eventType: z.enum(["payment.pending", "payment.paid", "payment.failed"]).default("payment.paid")
});

export async function POST(request: Request) {
  if (!isLocalPaymentDevelopment()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid stub payment payload." }, { status: 400 });
  }

  const providerStatus = parsed.data.eventType === "payment.paid"
    ? "succeeded"
    : parsed.data.eventType === "payment.failed"
      ? "failed"
      : "pending";
  const verification = {
    valid: true,
    eventId: `evt_stub_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
    eventType: parsed.data.eventType,
    reference: parsed.data.reference,
    orderId: parsed.data.orderId,
    providerStatus
  } as const;
  const payload = JSON.stringify(verification);

  const result = await processPaymentWebhookEvent(verification, payload);
  return NextResponse.json(result.body, { status: result.status });
}
