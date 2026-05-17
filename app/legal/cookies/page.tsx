/**
 * Cookie Policy — composed per SUPER_PROMPT_v3 Appendix L.5.
 * ~700 words. Strictly necessary, functional, analytics, marketing categories.
 */
import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How vialchemlabs.net uses cookies and similar technologies, how to manage consent, and the categories of cookies we set.",
};

export default function CookiesPage() {
  const brand = siteConfig.name;

  return (
    <LegalShell
      eyebrow="Legal / Cookie Policy"
      title="Cookie Policy"
      lastUpdated="2026-05-08"
    >
      <P>
        This Cookie Policy explains how {brand} and our service providers use
        cookies and similar technologies on the {siteConfig.url} site, how to
        manage your preferences, and your rights under applicable law.
      </P>

      <H2>1. What Cookies Are</H2>
      <P>
        Cookies are small text files placed on your device when you visit a
        website. They store information that the site can read on later visits —
        for example, that you are signed in, or that you have a cart in
        progress. We also use server-side equivalents (such as session
        identifiers) and local-storage entries; for simplicity, we refer to all
        of these as &quot;cookies&quot; in this policy.
      </P>

      <H2>2. Categories of Cookies We Use</H2>

      <H3>2.1 Strictly Necessary</H3>
      <P>
        These cookies are required for the site to function. They cannot be
        disabled while still using the site. Examples include authentication
        tokens for your account session, the cart-state identifier, and CSRF
        protection tokens for checkout. The legal basis for these cookies is
        contractual necessity; consent is not required.
      </P>

      <H3>2.2 Functional</H3>
      <P>
        These cookies remember preferences you have set, such as theme choice,
        region selection, or notification dismissal state. They improve the
        experience but are not strictly required to operate the site. The legal
        basis is consent, where applicable.
      </P>

      <H3>2.3 Analytics</H3>
      <P>
        These cookies record aggregated, de-identified usage patterns so we can
        improve the site. We use Sentry for error monitoring and a
        privacy-respecting analytics provider (Plausible or Vercel Analytics)
        for traffic analysis. We do not use Google Analytics. The legal basis is
        consent, where applicable.
      </P>

      <H3>2.4 Marketing</H3>
      <P>
        We do not currently set marketing or advertising cookies. We do not
        share data with third-party advertising networks. The only marketing
        identifier {brand} uses is the affiliate-program promo-code linkage,
        which records the referring affiliate ID against the order at checkout
        and only when the buyer arrives via an affiliate link.
      </P>

      <H2>3. Consent</H2>
      <P>
        Where required by your jurisdiction (for example, the European Economic
        Area, the United Kingdom, or California), we present a cookie-consent
        interface on first visit. You can:
      </P>
      <UL>
        <LI>Accept all categories.</LI>
        <LI>Customize selections by category.</LI>
        <LI>Reject non-essential categories.</LI>
      </UL>
      <P>
        Strictly necessary cookies are set regardless of your selection because
        the site cannot function without them. All other categories are off by
        default until you opt in.
      </P>

      <H2>4. Withdrawing or Changing Consent</H2>
      <P>
        You may change your cookie preferences at any time by visiting the
        cookie management page at <A href="/legal/cookies">/legal/cookies</A> or
        by clearing the cookies stored by your browser for {siteConfig.domain}{" "}
        and revisiting the site. Browser-level controls also let you delete or
        block cookies, though doing so may break sign-in, cart, and checkout
        functionality.
      </P>

      <H2>5. Retention</H2>
      <P>
        Cookies have varying durations. Session cookies are deleted when you
        close the browser. Persistent cookies have an expiration date set when
        they are placed; we use durations of up to 12 months for functional and
        analytics cookies, and shorter durations for authentication and CSRF
        tokens.
      </P>

      <H2>6. Do Not Track and Global Privacy Control</H2>
      <P>
        We honor the Global Privacy Control (GPC) signal where it indicates an
        opt-out of non-essential tracking, treating it as a withdrawal of
        consent for analytics and functional cookies. Browser-level &quot;Do Not
        Track&quot; (DNT) signals are not standardized; we do not currently
        treat DNT alone as an opt-out, but we do respect GPC.
      </P>

      <H2>7. Third-Party Service Cookies</H2>
      <P>
        Some of our service providers may set their own cookies as part of their
        services (for example, hosting and error monitoring). Their cookies are
        governed by their own privacy and cookie policies. We list the providers
        in our <A href="/legal/privacy">Privacy Policy</A>.
      </P>

      <H2>8. Contact</H2>
      <P>
        Questions about cookies or to request a list of cookies set by our site:{" "}
        <A href="mailto:research@vialchemlabs.net">research@vialchemlabs.net</A>
        .
      </P>
    </LegalShell>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[22px] md:text-[26px] font-medium leading-tight text-[var(--text)] mt-12 mb-4">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[18px] font-medium leading-tight text-[var(--text)] mt-7 mb-2">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc pl-6 space-y-2 mb-5 marker:text-[var(--text-subtle)]">
      {children}
    </ul>
  );
}

function LI({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-[var(--accent)] underline-offset-2 hover:text-[var(--accent-soft)] hover:underline transition-colors"
    >
      {children}
    </a>
  );
}
