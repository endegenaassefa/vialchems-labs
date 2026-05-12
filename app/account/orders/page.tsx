/**
 * Orders list — /account/orders.
 *
 * Phase 5 stub. Currently renders empty-state copy unless a recent stub order
 * is visible in sessionStorage (handled client-side).
 */
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OrdersList } from "./OrdersList";

export const metadata: Metadata = {
  title: "Account — Orders",
};

export default function AccountOrdersPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
              Account / Orders
            </p>
            <h1 className="text-[32px] md:text-[40px] font-light tracking-tight text-[var(--text)]">
              Your orders
            </h1>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-5xl px-6 py-12">
            <OrdersList />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
