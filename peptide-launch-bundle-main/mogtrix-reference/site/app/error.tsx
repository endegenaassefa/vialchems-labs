"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="shell grid min-h-[calc(100vh-200px)] place-items-center py-16">
      <section className="metal w-full max-w-xl rounded-[22px] p-8 text-center">
        <p className="mb-3 text-xs font-semibold uppercase text-[var(--accent)]">System fault</p>
        <h1 className="text-4xl font-black text-white">A request handler failed.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--text-muted)]">
          The error has been logged for review. You can retry the action or return to the catalog.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-[var(--text-muted)]">ref: {error.digest}</p>
        ) : null}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-soft)]"
          >
            Retry
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)]"
          >
            Return home
          </a>
        </div>
      </section>
    </main>
  );
}
