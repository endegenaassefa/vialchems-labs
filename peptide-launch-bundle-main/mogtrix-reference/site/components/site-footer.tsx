import Link from "next/link";

import { legalNav } from "@/lib/content/legal";
import { siteConfig } from "@/lib/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          {siteConfig.name} · {siteConfig.domain} · Research-use-only website
          preview
        </p>
        <nav className="footer-links" aria-label="Legal navigation">
          {legalNav.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
