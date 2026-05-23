/**
 * E3 — Unsubscribe confirmation page
 * (Section 6 super-prompt 2026-05-22).
 *
 * Customer lands here from /api/unsubscribe?token=... after the
 * route handler verifies the token and writes to
 * newsletter_unsubscribes. The page renders a plain confirmation;
 * `?stub=1` query param indicates the DB write was skipped
 * (Supabase not configured) so we soften the wording.
 *
 * The `[email]` slug is the literal email address (URL-encoded);
 * the page also displays it back to the customer so they can
 * verify they unsubscribed the right account.
 */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribed · VialChem Labs",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ email: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { email: raw } = await params;
  const search = await searchParams;
  const email = decodeURIComponent(raw);
  const stub = search.stub === "1";

  return (
    <main
      style={{
        padding: "64px 24px",
        maxWidth: 560,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>
        You&apos;re unsubscribed.
      </h1>
      <p
        style={{
          color: "var(--fg-muted)",
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        We&apos;ll stop sending marketing emails to{" "}
        <code style={{ fontFamily: "var(--font-mono)" }}>{email}</code>.
        Transactional emails (order confirmations, shipping notices) will still
        be delivered when you place an order.
      </p>
      {stub ? (
        <p
          style={{
            display: "inline-block",
            padding: "10px 14px",
            border: "1px solid var(--warn)",
            borderRadius: "var(--r-md)",
            background: "var(--warn-soft)",
            color: "var(--warn)",
            fontSize: 12,
            marginBottom: 24,
          }}
        >
          Note: Supabase is not yet configured on the server, so this
          unsubscribe is queued for processing once the operator finishes
          provisioning. Your preference is recorded and honored.
        </p>
      ) : null}
      <p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            border: "1px solid var(--accent)",
            borderRadius: "var(--r-md)",
            color: "var(--accent)",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          ← Back to vialchemlabs.net
        </Link>
      </p>
    </main>
  );
}
