import Link from "next/link";
import {
  footerExploreLinks,
  footerPolicyLinks
} from "@/lib/content/site";

export function ComplianceFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-black/72 py-8">
      <div className="shell grid gap-6 text-xs text-[var(--text-muted)] lg:grid-cols-[1.2fr_0.8fr_1fr]">
        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            MOGTRIX
          </p>
          <p className="mt-3 leading-6">
            Research-use-only storefront. Batch records, pricing, and checkout
            are controlled surfaces, with qualified access, protected payment,
            and order-status tracking kept inside the customer account area.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {footerExploreLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Policies</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {footerPolicyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link href="/ops" className="hover:text-white">Staff</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
