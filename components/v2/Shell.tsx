"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartHydrated, useCartStore } from "@/lib/cart-store";
import { Icon } from "./icons";

const navItems = [
  { href: "/shop", label: "Shop Peptides", key: "catalog" },
  { href: "/coa", label: "Verify a Vial", key: "coa" },
  { href: "/affiliate", label: "Affiliate Program", key: "affiliate" },
  { href: "/account", label: "My Lab", key: "account" },
];

function BrandWordmark() {
  return (
    <span>
      vialchemlabs<span style={{ color: "var(--fg-muted)" }}>.net</span>
    </span>
  );
}

export function V2Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hydrated = useCartHydrated();
  const count = useCartStore((s) =>
    s.lines.reduce((sum, line) => sum + line.qty, 0),
  );
  const displayCount = hydrated ? count : 0;

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="vialchemlabs.net home">
          <span className="brand-mark" />
          <BrandWordmark />
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "active"
                  : ""
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="nav-spacer" />
        <div className="nav-actions">
          <ThemeSwitch />
          <button
            type="button"
            className="icon-btn v2-nav-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="v2-mobile-menu"
            title={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <Icon.x size={15} strokeWidth={1.6} />
            ) : (
              <Icon.menu size={15} strokeWidth={1.6} />
            )}
          </button>
          <Link
            className="icon-btn v2-nav-search"
            href="/shop?focus=search"
            aria-label="Search catalog"
            title="Search catalog"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon.search size={14} strokeWidth={1.5} />
          </Link>
          <Link
            className="icon-btn v2-nav-account"
            href="/account"
            aria-label="Account"
            title="Account"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon.user size={14} strokeWidth={1.5} />
          </Link>
          <Link
            className="icon-btn v2-nav-cart"
            href="/cart"
            aria-label="Cart"
            title="Cart"
            style={{ position: "relative" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon.cart size={14} strokeWidth={1.5} />
            {displayCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  minWidth: 16,
                  height: 16,
                  padding: "0 4px",
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: 8,
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 500,
                }}
              >
                {displayCount}
              </span>
            )}
          </Link>
          <Link className="btn btn-primary btn-sm v2-nav-cta" href="/affiliate">
            Affiliate <Icon.arrow size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
      {mobileMenuOpen && (
        <div
          id="v2-mobile-menu"
          className="v2-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
        >
          <div className="v2-mobile-panel">
            <div className="v2-mobile-panel-head">
              <span className="eyebrow">Menu</span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon.x size={15} strokeWidth={1.6} />
              </button>
            </div>
            <div className="v2-mobile-primary">
              <Link
                href="/shop"
                className="btn btn-accent btn-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Catalog <Icon.arrow size={14} strokeWidth={1.5} />
              </Link>
              <Link
                href="/coa"
                className="btn btn-ghost btn-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Verify a Vial
              </Link>
            </div>
            <div className="v2-mobile-links">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                      ? "active"
                      : ""
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <Icon.arrow size={14} strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export function V2Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div className="foot-col">
            <div className="brand" style={{ marginBottom: 16 }}>
              <span className="brand-mark" />
              <BrandWordmark />
            </div>
            <p
              style={{
                color: "var(--fg-muted)",
                fontSize: 13,
                maxWidth: 320,
                marginBottom: 16,
              }}
            >
              Research-grade peptides sold only to verified laboratories and
              qualified research organizations.
            </p>
            <div className="badge badge-ruo">
              <span className="badge-dot" />
              RESEARCH USE ONLY
            </div>
          </div>
          <FooterColumn
            title="Shop"
            links={[
              ["/shop", "Peptide Catalog"],
              ["/coa", "Verify a Vial"],
              ["/account", "My Lab"],
            ]}
          />
          <FooterColumn
            title="Compliance"
            links={[
              ["/legal/terms", "Research Use Policy"],
              ["/faq", "Quality Standards"],
              ["/coa", "Documentation"],
              ["/legal/shipping", "Shipping"],
            ]}
          />
          <FooterColumn
            title="Organization"
            links={[
              ["/about", "About"],
              ["/contact", "Contact"],
              ["/affiliate", "Affiliate"],
              ["/blog", "Research Notes"],
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              ["/legal/terms", "Terms"],
              ["/legal/privacy", "Privacy"],
              ["/legal/refunds", "Refunds"],
              ["/legal/cookies", "Cookies"],
            ]}
          />
        </div>
        <div className="foot-base">
          <span>
            © 2026 VIALCHEM LABS — RESEARCH USE ONLY · NOT FOR HUMAN OR ANIMAL
            USE
          </span>
          <span>BUILD 26.04 · STATUS: OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [href: string, label: string][];
}) {
  return (
    <div className="foot-col">
      <h5>{title}</h5>
      <ul>
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThemeSwitch() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setTheme(localStorage.getItem("vc.theme") || "dark");
      } catch {
        setTheme("dark");
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const toggleTheme = () => {
    try {
      const accent = localStorage.getItem("vc.accent") || "cyan-navy";
      localStorage.setItem("vc.theme", nextTheme);
      localStorage.setItem("vc.accent", accent);
      document.documentElement.setAttribute("data-theme", nextTheme);
      document.documentElement.setAttribute("data-accent", accent);
    } catch {
      document.documentElement.setAttribute("data-theme", nextTheme);
    }
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className="v2-theme-switch"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${nextTheme} theme`}
      style={{
        height: 34,
        minWidth: 118,
        padding: "0 10px",
        border:
          "1px solid color-mix(in oklab, var(--accent-hi) 46%, var(--line))",
        borderRadius: "var(--r-pill)",
        background: "var(--accent-soft)",
        color: "var(--accent-hi)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        transition: "all var(--dur-fast) var(--ease)",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {theme === "dark" ? (
        <Icon.moon size={14} strokeWidth={1.5} />
      ) : (
        <Icon.sun size={14} strokeWidth={1.5} />
      )}
      <span>Theme · {theme}</span>
      <span
        style={{
          width: 24,
          height: 14,
          borderRadius: "var(--r-pill)",
          border: "1px solid var(--line-strong)",
          background: "var(--bg-sunken)",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: theme === "dark" ? 12 : 2,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--accent-hi)",
            transition: "left var(--dur-fast) var(--ease)",
          }}
        />
      </span>
    </button>
  );
}
