/**
 * Checkout entry — redirects to the first step (/checkout/address).
 *
 * The 4 step pages live in nested routes:
 *   /checkout/address
 *   /checkout/method
 *   /checkout/review
 *   /checkout/confirm
 */
import { redirect } from 'next/navigation';

export default function CheckoutIndexPage() {
  redirect('/checkout/address');
}
