'use client';

/**
 * CheckoutGuard — wraps checkout step content (address, method, review). After
 * the cart store hydrates, redirects to /cart when there are no line items.
 * Renders an empty-state placeholder until hydration completes (avoids the
 * flash where children render against an empty cart pre-hydrate).
 *
 * The /checkout/confirm step is intentionally NOT wrapped — after a successful
 * place-order the cart is cleared and the confirmation page MUST still render.
 *
 * ISSUE-004 fix: previously /checkout/address, /method, /review were reachable
 * with an empty cart. The order-summary side panel showed "Your cart is
 * empty" but the form/submit flow stayed enabled.
 */
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useCartHydrated, useCartStore } from '@/lib/cart-store';

interface CheckoutGuardProps {
  children: ReactNode;
}

export function CheckoutGuard({ children }: CheckoutGuardProps) {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const lineCount = useCartStore((s) => s.lines.length);

  useEffect(() => {
    if (hydrated && lineCount === 0) {
      router.replace('/cart');
    }
  }, [hydrated, lineCount, router]);

  if (!hydrated) {
    return (
      <p
        className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-muted)]"
        aria-live="polite"
      >
        Loading checkout…
      </p>
    );
  }

  if (lineCount === 0) {
    return (
      <div className="border border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius-lg)] p-8 text-center">
        <p className="text-[18px] text-[var(--text)] mb-2">Your cart is empty.</p>
        <p className="text-[14px] text-[var(--text-muted)] mb-4">
          Add a research peptide to start checkout.
        </p>
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
          Redirecting to cart…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
