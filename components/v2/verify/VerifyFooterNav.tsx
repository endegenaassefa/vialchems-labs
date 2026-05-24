/**
 * VerifyFooterNav — sticky-ish footer on /verify/[slug] with "Back to
 * All Reports" + "View Product Page" cross-links. Per super-prompt §5.1.
 */
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface VerifyFooterNavProps {
  productSlug: string;
  productName: string;
}

export function VerifyFooterNav({
  productSlug,
  productName,
}: VerifyFooterNavProps) {
  return (
    <nav
      className="flex items-center justify-between gap-4 mt-12 pt-6 border-t border-[var(--border)] flex-wrap"
      aria-label="Verify page navigation"
    >
      <Link
        href="/verify"
        className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
        Back to All Reports
      </Link>
      <Link
        href={`/products/${productSlug}`}
        className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--accent)] hover:opacity-80 transition-opacity"
        aria-label={`View ${productName} product page`}
      >
        View Product Page
        <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
      </Link>
    </nav>
  );
}
