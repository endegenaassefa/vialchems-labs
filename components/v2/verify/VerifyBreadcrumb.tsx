/**
 * VerifyBreadcrumb — Home / Verify / [Product] navigation crumbs.
 * Per super-prompt §5.1.
 */
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface VerifyBreadcrumbProps {
  productName?: string;
}

export function VerifyBreadcrumb({ productName }: VerifyBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-[13px] text-[var(--text-muted)]"
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            href="/"
            className="hover:text-[var(--accent)] transition-colors"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight size={14} strokeWidth={1.5} />
        </li>
        <li>
          {productName ? (
            <Link
              href="/verify"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Verify
            </Link>
          ) : (
            <span className="text-[var(--text)]">Verify</span>
          )}
        </li>
        {productName && (
          <>
            <li aria-hidden="true">
              <ChevronRight size={14} strokeWidth={1.5} />
            </li>
            <li>
              <span className="text-[var(--text)] font-medium">
                {productName}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
