import type { ReactNode } from "react";

type CustomerAccessShellProps = {
  title: string;
  description: string;
  mode: {
    configured: boolean;
    label: string;
    reason: string;
  };
  children: ReactNode;
  footer: ReactNode;
};

export function CustomerAccessShell({
  title,
  description,
  mode,
  children,
  footer
}: CustomerAccessShellProps) {
  return (
    <main className="shell py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <section className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Verified buyers only
          </p>
          <h1 className="mt-3 text-5xl font-black text-white sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-[var(--text-muted)]">
            {description}
          </p>
          <div className="mt-8 grid gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[20px] border border-[var(--border)] bg-black/20 px-4 py-4">
              Email verification is required before catalog access.
            </div>
            <div className="rounded-[20px] border border-[var(--border)] bg-black/20 px-4 py-4">
              RUO restrictions stay in force after sign-in.
            </div>
            <div className="rounded-[20px] border border-[var(--border)] bg-black/20 px-4 py-4">
              Orders and status stay tied to one account.
            </div>
          </div>
        </section>

        <section className="metal rounded-[30px] p-6 sm:p-8">
          {!mode.configured ? (
            <div className="mb-5 rounded-[20px] border border-[#7a2a22] bg-[#210b08] px-4 py-3 text-sm text-[#ffb1a3]">
              {mode.reason}
            </div>
          ) : null}
          {children}
          <div className="mt-5 border-t border-[var(--border)] pt-5 text-sm text-[var(--text-muted)]">
            {footer}
          </div>
        </section>
      </div>
    </main>
  );
}
