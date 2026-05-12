export default function Loading() {
  return (
    <main className="shell grid min-h-[calc(100vh-200px)] place-items-center py-16">
      <div className="metal w-full max-w-xl rounded-[22px] p-8" aria-busy="true" aria-live="polite">
        <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--border)]" />
        <div className="mt-4 h-10 w-3/4 animate-pulse rounded-2xl bg-[var(--border)]" />
        <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-[var(--border)]" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded-full bg-[var(--border)]" />
        <span className="sr-only">Loading Mogtrix catalog...</span>
      </div>
    </main>
  );
}
