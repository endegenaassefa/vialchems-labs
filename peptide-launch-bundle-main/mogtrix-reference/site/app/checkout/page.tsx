import type { Metadata } from "next";

import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { requireCustomerPageSession } from "@/lib/customer";

export const metadata: Metadata = {
  title: "Checkout"
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  await requireCustomerPageSession("/checkout");

  return (
    <main className="shell py-16">
      <CheckoutFlow />
    </main>
  );
}
