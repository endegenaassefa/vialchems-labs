'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry instrumentation activates when DSN provided.
      void error;
    }
  }, [error]);

  return (
    <main id="main" className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-4">
          Error 500
        </p>
        <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-tight tracking-tight text-[var(--text)] mb-6">
          <span className="block">Something</span>
          <span className="font-serif-italic block text-[var(--accent-soft)]">went sideways.</span>
        </h1>
        <p className="text-[16px] leading-[1.6] text-[var(--text-muted)] mb-8">
          A server-side issue interrupted your request. The error has been logged for review.
          You can retry the request, return to the catalog, or contact support if the issue persists.
        </p>
        {error.digest ? (
          <p className="font-mono text-[12px] text-[var(--text-subtle)] mb-8">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center px-5 h-11 rounded-[var(--radius-full)] bg-[var(--accent)] text-[var(--bg)] font-medium text-[14px] hover:bg-[var(--accent-soft)] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-5 h-11 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-5 h-11 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
