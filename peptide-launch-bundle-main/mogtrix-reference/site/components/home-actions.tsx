import Link from "next/link";
import { getCustomerAuthMode } from "@/lib/customer-auth";

export function HomeActions() {
  const auth = getCustomerAuthMode();

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        href={auth.configured ? "/login" : "/shop"}
        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
      >
        {auth.configured ? "Sign in" : "Browse preview"}
      </Link>
      <Link href="/legal/qualification" className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white">
        View access rules
      </Link>
    </div>
  );
}
