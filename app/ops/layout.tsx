import type { ReactNode } from "react";
import { OpsAuthGate } from "@/components/ops/OpsAuthGate";

// All /ops/* pages run through the auth gate. Static metadata says
// "noindex" so the admin never gets crawled.
export const metadata = {
  title: "Ops — Vialchems Labs",
  robots: { index: false, follow: false },
};

export default function OpsLayout({ children }: { children: ReactNode }) {
  return (
    <OpsAuthGate>
      <div className="min-h-screen bg-[var(--surface)]">
        <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
          <div className="text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
            Vialchems Labs — Ops
          </div>
          <a
            href="/ops/orders"
            className="text-[11px] tracking-[0.24em] uppercase hover:text-[var(--accent)] transition-colors"
          >
            Orders
          </a>
        </header>
        <main className="px-6 py-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </OpsAuthGate>
  );
}
