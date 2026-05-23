/**
 * E3 — Unsubscribe error page
 * (Section 6 super-prompt 2026-05-22).
 *
 * The /api/unsubscribe route lands here when the token doesn't
 * verify or the DB write failed. We never expose the raw error
 * to the customer — just a "we couldn't process that link" plus
 * a support fallback.
 */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribe error · VialChem Labs",
  robots: { index: false, follow: false },
};

const REASON_COPY: Record<string, string> = {
  invalid_token:
    "The unsubscribe link is missing or has been tampered with. Forward your original email to support and we'll process the unsubscribe by hand.",
  db_error:
    "We had trouble recording your unsubscribe. We've logged the error and will process it manually — please give us a few minutes.",
};

export default async function UnsubscribeErrorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;
  const reason = typeof search.reason === "string" ? search.reason : "unknown";
  const copy = REASON_COPY[reason] ?? REASON_COPY.invalid_token;

  return (
    <main
      style={{
        padding: "64px 24px",
        maxWidth: 560,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>
        We couldn&apos;t process that unsubscribe link.
      </h1>
      <p
        style={{
          color: "var(--fg-muted)",
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        {copy}
      </p>
      <p style={{ marginBottom: 32 }}>
        <a
          href="mailto:support@vialchemlabs.net"
          style={{ color: "var(--accent)", textDecoration: "underline" }}
        >
          support@vialchemlabs.net
        </a>
      </p>
      <p>
        <Link
          href="/"
          style={{ color: "var(--accent)", textDecoration: "underline" }}
        >
          ← Back to vialchemlabs.net
        </Link>
      </p>
    </main>
  );
}
