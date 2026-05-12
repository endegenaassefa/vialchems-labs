import Image from "next/image";
import Link from "next/link";
import { FlaskConical, Menu, ShoppingBag } from "lucide-react";
import { signOutCustomer } from "@/app/auth/actions";
import { customerCanViewPrivatePricing, getCustomerAccessState } from "@/lib/customer";
import { getCustomerAuthMode } from "@/lib/customer-auth";
import { sharedResearchLinks } from "@/lib/content/site";

export async function SiteHeader() {
  const auth = getCustomerAuthMode();
  const state = await getCustomerAccessState();
  const signedIn = state.kind === "ready" || state.kind === "unqualified" || state.kind === "unverified";
  const showPrivateLinks = customerCanViewPrivatePricing(state);
  const onboardingLink = state.kind === "unverified" ? "/verify" : "/qualify";
  const onboardingLabel = state.kind === "unverified" ? "Verify email" : "Finish setup";
  const reducedOnboardingNav = state.kind === "unqualified" || state.kind === "unverified";
  const statusLabel = auth.configured
    ? reducedOnboardingNav
      ? "Account setup in progress"
      : "Approved research account"
    : "Catalog preview";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-black/76 backdrop-blur-xl">
      <div className="shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Mogtrix Labs home">
          <Image src="/brand/mogtrix_wordmark.png" alt="Mogtrix" width={132} height={32} priority className="h-auto w-auto" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-subtle)] border border-[var(--border-strong)] rounded-full px-2 py-0.5 leading-none translate-y-[1px]">
            Labs
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[var(--text-muted)] md:flex">
          {auth.configured ? (
            signedIn ? (
              reducedOnboardingNav ? (
                <>
                  <Link href={onboardingLink} className="hover:text-white">{onboardingLabel}</Link>
                  <Link href="/legal/qualification" className="hover:text-white">Access requirements</Link>
                  <form action={signOutCustomer}>
                    <button className="hover:text-white" type="submit">Log out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/shop" className="hover:text-white">Shop</Link>
                  <Link href="/account/orders" className="hover:text-white">Orders</Link>
                  {showPrivateLinks ? (
                    <Link href="/cart" className="inline-flex items-center gap-2 hover:text-white">
                      <ShoppingBag size={16} /> Cart
                    </Link>
                  ) : null}
                  <Link href="/coa" className="hover:text-white">COA Library</Link>
                  <Link href="/testing" className="hover:text-white">Testing</Link>
                  <Link href="/faq" className="hover:text-white">FAQ</Link>
                  <form action={signOutCustomer}>
                    <button className="hover:text-white" type="submit">Log out</button>
                  </form>
                </>
              )
            ) : (
              <>
                <Link href="/legal/qualification" className="hover:text-white">Access requirements</Link>
                <Link href="/faq" className="hover:text-white">FAQ</Link>
                <Link href="/login" className="hover:text-white">Sign in</Link>
              </>
            )
          ) : (
            <>
              <Link href="/shop" className="hover:text-white">Shop</Link>
              {sharedResearchLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
              <Link href="/cart" className="inline-flex items-center gap-2 hover:text-white">
                <ShoppingBag size={16} /> Cart
              </Link>
              <Link href="/legal" className="hover:text-white">Policies</Link>
            </>
          )}
        </nav>
        <button className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-[var(--border)] md:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="hidden items-center gap-2 rounded-2xl border border-[var(--border)] px-4 py-2 text-xs text-[var(--text-muted)] md:inline-flex">
          <FlaskConical size={16} />
          {statusLabel}
        </div>
      </div>
    </header>
  );
}
