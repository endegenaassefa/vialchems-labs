import { CartView } from "@/components/cart-view";
import { requireCustomerPageSession } from "@/lib/customer";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  await requireCustomerPageSession("/cart");
  return <CartView />;
}
