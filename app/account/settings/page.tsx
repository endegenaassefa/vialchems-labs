/**
 * Account settings — Phase 5 stub.
 *
 * Renders email preferences (new-batch, research-index) + sign-out stub. Real
 * preference storage lands in Phase 8.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";

export const metadata: Metadata = {
  title: "Account — Settings",
};

const PREFERENCES = [
  {
    id: "new-batch",
    label: "New-batch alerts",
    body: "Email when a new batch of a product you have ordered before becomes available.",
    defaultChecked: true,
  },
  {
    id: "research-index",
    label: "Research index",
    body: "Plain-language explainers when new pieces are published.",
    defaultChecked: true,
  },
  {
    id: "order-status",
    label: "Order status",
    body: "Transactional only. Cannot be turned off while a pending order exists.",
    defaultChecked: true,
  },
];

export default function SettingsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
              Account / Settings
            </p>
            <h1 className="text-[32px] md:text-[40px] font-light tracking-tight text-[var(--text)] mb-3">
              Email preferences
            </h1>
            <Pill variant="info">Stub</Pill>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-6 py-12 space-y-6">
            <Card className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
                Subscriptions
              </p>
              <ul className="space-y-4">
                {PREFERENCES.map((pref) => (
                  <li key={pref.id} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`pref-${pref.id}`}
                      defaultChecked={pref.defaultChecked}
                      disabled={pref.id === "order-status"}
                      className="mt-1 h-4 w-4 accent-[var(--accent)]"
                    />
                    <label
                      htmlFor={`pref-${pref.id}`}
                      className="cursor-pointer flex-1"
                    >
                      <span className="text-[15px] text-[var(--text)] block">
                        {pref.label}
                      </span>
                      <span className="text-[13px] text-[var(--text-muted)] block mt-1 leading-[1.55]">
                        {pref.body}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <Button variant="primary" size="md" className="mt-6">
                Save preferences
              </Button>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                Preference storage activates with the public launch
              </p>
            </Card>

            <Card className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
                Session
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="md">
                  Sign out
                </Button>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 h-10 rounded-[var(--radius-md)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
                >
                  Delete account
                </Link>
              </div>
              <p className="mt-3 text-[12px] text-[var(--text-subtle)]">
                Account deletion is processed by vialchemlabs.net support within
                1 business day of the request.
              </p>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
