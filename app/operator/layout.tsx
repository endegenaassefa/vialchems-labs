/**
 * C1 — Operator dashboard layout shell
 * (Section 6 super-prompt 2026-05-22).
 *
 * Every `/operator/*` route renders through this layout so the
 * auth-guard runs once and either:
 *   - redirects to /login when no session exists
 *   - renders a 403 message when the session is for a non-operator
 *   - renders the children with a thin sidebar nav otherwise
 *
 * The layout intentionally keeps zero analytics, zero animations,
 * and zero customer-facing branding so the operator can scan the
 * UI quickly under time pressure.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { checkOperatorAuth } from "@/lib/operator/auth-guard";

export const metadata: Metadata = {
  title: "Operator · VialChem Labs",
  robots: { index: false, follow: false },
};

export default async function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await checkOperatorAuth();
  if (auth.state === "unauthenticated") {
    redirect("/login?next=/operator/orders");
  }
  if (auth.state === "forbidden") {
    return (
      <main style={{ padding: "48px 24px", maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>403 — Not authorized</h1>
        <p style={{ color: "var(--fg-muted)", lineHeight: 1.6 }}>
          The account <code>{auth.email}</code> is not on the operator
          allow-list. Sign in with an operator email to access this surface, or
          contact{" "}
          <a
            href="mailto:endegenaassefa2@gmail.com"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            endegenaassefa2@gmail.com
          </a>{" "}
          to be added.
        </p>
        <p style={{ marginTop: 24 }}>
          <Link
            href="/"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            ← Back to site
          </Link>
        </p>
      </main>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(180px, 220px) minmax(0, 1fr)",
        minHeight: "100vh",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid var(--line)",
          padding: "24px 16px",
          background: "var(--bg-sunken)",
        }}
      >
        <p
          className="eyebrow"
          style={{
            marginBottom: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Operator
        </p>
        <nav
          style={{
            display: "grid",
            gap: 8,
            fontSize: 14,
          }}
        >
          <Link
            href="/operator/orders"
            style={{ color: "var(--fg)", padding: "6px 0" }}
          >
            Orders
          </Link>
          <Link href="/" style={{ color: "var(--fg-muted)", padding: "6px 0" }}>
            ← Back to site
          </Link>
        </nav>
        <p
          style={{
            marginTop: 32,
            fontSize: 11,
            color: "var(--fg-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Signed in: {auth.email}
        </p>
      </aside>
      <section style={{ padding: "24px 32px" }}>{children}</section>
    </div>
  );
}
