import { notFound } from "next/navigation";

import { StubPaymentHosted } from "@/components/stub-payment-hosted";
import { isLocalPaymentDevelopment } from "@/lib/payments/config";

export const dynamic = "force-dynamic";

export default async function StubHostedPaymentPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string; reference?: string }>;
}) {
  if (!isLocalPaymentDevelopment()) {
    notFound();
  }

  const { orderId, reference } = await searchParams;

  if (!orderId || !reference) {
    notFound();
  }

  return <StubPaymentHosted orderId={orderId} reference={reference} />;
}
