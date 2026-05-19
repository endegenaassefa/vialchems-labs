/**
 * Privacy Policy — composed per SUPER_PROMPT_v3 Appendix L.2.
 * GDPR + CCPA compliant template, ~1500 words.
 */
import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How VialChem Labs collects, uses, shares, and protects personal information, and your rights under GDPR and CCPA.",
};

export default function PrivacyPage() {
  const brand = siteConfig.name;
  const llc = siteConfig.llcName;

  return (
    <LegalShell
      eyebrow="Legal / Privacy Policy"
      title="Privacy Policy"
      lastUpdated="2026-05-08"
    >
      <P>
        {llc} (&quot;{brand},&quot; &quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) operates the website at {siteConfig.url}. This Privacy
        Policy explains what information we collect, how we use it, with whom we
        share it, and the rights you have over it. By using the site, you agree
        to the practices described in this policy.
      </P>

      <H2>1. Information We Collect</H2>
      <H3>1.1 Account Information</H3>
      <P>
        When you create an account or place an order, we collect your name,
        email address, password (hashed), institutional or research role,
        research-purpose statement, and qualification responses required to
        verify eligibility under our Terms of Service.
      </P>
      <H3>1.2 Payment Information</H3>
      <P>
        We do not store full payment-credential data on our servers. Crypto
        payments are processed via self-hosted infrastructure that records the
        transaction reference. Bank-transfer (ACH) payments are processed via
        Plaid, which discloses to us only a limited transaction reference
        sufficient for order reconciliation.
      </P>
      <H3>1.3 Shipping Information</H3>
      <P>
        We collect the shipping address, recipient name, and contact phone
        number associated with each order, and we share the minimum necessary
        information with carriers (USPS, FedEx) to fulfill the order.
      </P>
      <H3>1.4 Behavioral and Technical Information</H3>
      <P>
        Our hosting and analytics infrastructure record server-level technical
        information: IP address, device and browser identifiers, time of access,
        pages requested, referrer URL, and similar data. We use this for site
        operation, fraud prevention, and aggregated, de-identified analytics.
      </P>
      <H3>1.5 Cookies</H3>
      <P>
        See the <A href="/legal/cookies">Cookie Policy</A> for the categories of
        cookies we set, the purposes, and how to manage consent.
      </P>

      <H2>2. How We Use Information</H2>
      <UL>
        <LI>
          Order fulfillment: process payments, qualify the buyer, ship products,
          communicate about orders.
        </LI>
        <LI>
          Account management: authenticate you, maintain order history, respond
          to support inquiries.
        </LI>
        <LI>
          Marketing: send research updates only where you have opted in. You can
          opt out at any time via the unsubscribe link in any email.
        </LI>
        <LI>
          Fraud prevention and security: detect and respond to suspicious
          activity, abuse, or violation of our Terms.
        </LI>
        <LI>
          Legal compliance: respond to lawful requests from authorities, enforce
          our agreements, exercise legal claims, and comply with regulatory
          obligations.
        </LI>
      </UL>

      <H2>3. Legal Bases (GDPR)</H2>
      <P>
        For users in the European Economic Area or the United Kingdom, we
        process personal data on the following legal bases:
      </P>
      <UL>
        <LI>
          <strong>Contract:</strong> processing necessary to fulfill an order or
          operate your account.
        </LI>
        <LI>
          <strong>Consent:</strong> processing where you have given affirmative
          opt-in (e.g., marketing emails, non-essential cookies).
        </LI>
        <LI>
          <strong>Legitimate interest:</strong> site operation, fraud
          prevention, aggregated analytics, security.
        </LI>
        <LI>
          <strong>Legal obligation:</strong> processing required to comply with
          applicable law.
        </LI>
      </UL>
      <P>
        You may withdraw consent at any time without affecting the lawfulness of
        processing carried out before withdrawal.
      </P>

      <H2>4. Sharing</H2>
      <P>
        We share personal data only with the categories of recipients listed
        below, only where necessary, and only under contractual restrictions
        appropriate to the data type:
      </P>
      <UL>
        <LI>
          <strong>Hosting and database (Supabase):</strong> stores encrypted
          account, order, and qualification data.
        </LI>
        <LI>
          <strong>Payment processors:</strong> self-hosted crypto infrastructure
          and Plaid for ACH.
        </LI>
        <LI>
          <strong>Shipping carriers:</strong> USPS and FedEx, for delivery.
        </LI>
        <LI>
          <strong>Transactional email (Resend):</strong> delivers order
          confirmations, shipping notices, and password resets.
        </LI>
        <LI>
          <strong>Error monitoring (Sentry):</strong> captures crash reports for
          engineering. PII is redacted before transmission where possible.
        </LI>
      </UL>
      <P>
        We do not share personal data with third-party advertising networks. We
        do not sell personal data within the meaning of CCPA. We may disclose
        information when required by law, in response to lawful process, or to
        protect our rights, property, or safety, or that of others.
      </P>

      <H2>5. Retention</H2>
      <P>
        We retain account, order, and qualification records for as long as the
        account is active and for a reasonable period afterward to satisfy tax,
        accounting, and legal-compliance obligations. Aggregated, de-identified
        analytics may be retained indefinitely. Marketing-list entries are
        retained until you unsubscribe.
      </P>

      <H2>6. Your Rights</H2>
      <P>Depending on your jurisdiction, you may have rights to:</P>
      <UL>
        <LI>
          <strong>Access</strong> the personal data we hold about you.
        </LI>
        <LI>
          <strong>Rectify</strong> inaccurate or incomplete data.
        </LI>
        <LI>
          <strong>Erase</strong> data, subject to legal-retention exceptions.
        </LI>
        <LI>
          <strong>Restrict</strong> processing in defined circumstances.
        </LI>
        <LI>
          <strong>Port</strong> data to another controller in a structured
          format.
        </LI>
        <LI>
          <strong>Object</strong> to processing based on legitimate interests.
        </LI>
        <LI>
          <strong>Withdraw consent</strong> previously given.
        </LI>
      </UL>
      <P>
        California residents have additional rights under the CCPA: to know what
        categories of personal information are collected, to opt out of any
        &quot;sale&quot; (we do not sell personal data), and to request
        deletion. To exercise any of these rights, email{" "}
        <A href="mailto:research@vialchemlabs.net">research@vialchemlabs.net</A>
        . We may verify your identity before responding. We will respond within
        the timeframe required by applicable law (typically 30 days).
      </P>

      <H2>7. Children</H2>
      <P>
        We do not knowingly collect personal data from anyone under 21 years of
        age. The site and the products are not directed to or available to users
        under 21. If we learn that we have collected personal data from a person
        under 21, we will delete that data.
      </P>

      <H2>8. Security</H2>
      <P>
        We use industry-standard technical and organizational measures to
        protect personal data, including encryption in transit (HTTPS),
        encryption at rest where supported by our database provider, access
        controls, audit logging, and least-privilege staff access. No system is
        perfectly secure; we cannot guarantee absolute security.
      </P>

      <H2>9. International Transfers</H2>
      <P>
        Personal data may be processed in the United States. If you access the
        site from outside the United States, you understand that your data will
        be transferred to and processed in the United States.
      </P>

      <H2>10. Contact</H2>
      <P>
        For privacy questions, data-rights requests, or to update your contact
        preferences, email{" "}
        <A href="mailto:research@vialchemlabs.net">research@vialchemlabs.net</A>
        .
      </P>

      <H2>11. Changes</H2>
      <P>
        We may update this Privacy Policy from time to time. The &quot;Last
        updated&quot; date at the top reflects the most recent revision.
        Material changes will be communicated via email or prominent notice on
        the site.
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
