import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Not found | Mogtrix",
  description: "The Mogtrix page you requested could not be located."
};

export default function NotFound() {
  return (
    <main className="shell grid min-h-[calc(100vh-200px)] place-items-center py-16">
      <section className="metal w-full max-w-xl rounded-[22px] p-8 text-center">
        <p className="mb-3 text-xs font-semibold uppercase text-[var(--accent)]">404 - Off catalog</p>
        <h1 className="text-4xl font-black text-white">This page is not in the manifest.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--text-muted)]">
          The path you followed does not exist on the Mogtrix request portal. Return to the catalog or the home page to continue.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-soft)]"
          >
            Return home
          </Link>
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)]"
          >
            Open catalog <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
