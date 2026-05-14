import { redirect } from "next/navigation";

// Root /ops just redirects to the orders list — the only screen we have v1.
export default function OpsRoot() {
  redirect("/ops/orders");
}
