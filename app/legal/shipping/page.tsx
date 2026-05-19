/**
 * Shipping Policy — composed per SUPER_PROMPT_v3 Appendix L.4 + Appendix A.4.
 * ~800 words. US-only launch coverage.
 */
import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "VialChem Labs ships within the United States only. Carriers, lead times, free-shipping threshold, and buyer compliance responsibilities.",
};

export default function ShippingPage() {
  const brand = siteConfig.name;
  const freeThreshold = (
    siteConfig.shipping.freeShippingThresholdCents / 100
  ).toFixed(0);

  return (
    <LegalShell
      eyebrow="Legal / Shipping Policy"
      title="Shipping Policy"
      lastUpdated="2026-05-08"
    >
      <P>
        This Shipping Policy describes how {brand} ships orders, the carriers
        and methods we use, lead times, costs, and jurisdictional restrictions.
        By placing an order, you agree to this policy.
      </P>

      <H2>1. Jurisdictional Restrictions</H2>
      <Quote>
        {brand} ships to addresses within the United States only at this time.{" "}
        The customer assumes all regulatory compliance responsibility for their
        destination, municipality, state, and organization.
      </Quote>
      <P>
        We do not currently ship internationally. We may expand carrier and
        jurisdiction coverage over time; updates will be reflected in this
        policy.
      </P>

      <H2>2. Carriers and Methods</H2>
      <UL>
        <LI>
          <strong>USPS Priority Mail</strong> — typical transit 1-3 business
          days.
        </LI>
        <LI>
          <strong>FedEx 2-Day</strong> — guaranteed transit 2 business days.
        </LI>
        <LI>
          <strong>FedEx Overnight</strong> — guaranteed transit 1 business day.
        </LI>
      </UL>
      <P>
        Carrier selection is offered at checkout. Available options may vary by
        destination ZIP code, package dimensions, and weather.
      </P>

      <H2>3. Free Shipping Threshold</H2>
      <P>
        Standard shipping is free on orders with a subtotal of ${freeThreshold}{" "}
        or more before tax and discounts. The threshold is applied automatically
        at checkout.
      </P>

      <H2>4. Same-Business-Day Cutoff</H2>
      <P>
        Orders placed before 3:00 pm Mountain Time on a business day (Monday
        through Friday, excluding US federal holidays) ship the same business
        day. Orders placed after the cutoff or on weekends or holidays ship the
        next business day. Order processing time may be extended during peak
        periods or weather delays; we will communicate any impact via order
        email.
      </P>

      <H2>5. Tracking</H2>
      <P>
        A tracking number is sent to the order email at the time of fulfillment
        and is also visible in your <A href="/account">account dashboard</A>.
        Tracking updates are provided by the carrier; {brand} does not control
        scan accuracy or carrier-side delays.
      </P>

      <H2>6. Packaging</H2>
      <P>
        Lyophilized peptide vials are packaged with foam inserts and padded
        outer cartons calibrated for ambient transit. We do not include
        bacteriostatic water, syringes, alcohol pads, or any reconstitution
        ancillaries; researchers source these separately. Shipping cartons are
        plain and do not display product names.
      </P>

      <H2>7. Lost Packages</H2>
      <P>
        For packages marked &quot;delivered&quot; that have not arrived, please
        first file a claim with USPS or FedEx using your tracking number, then
        contact{" "}
        <A href="mailto:research@vialchemlabs.net">research@vialchemlabs.net</A>{" "}
        with the order ID. {brand} will independently investigate from the
        sender side and provide a replacement at our discretion based on
        available evidence. See the <A href="/legal/refunds">Refund Policy</A>{" "}
        for replacement criteria.
      </P>

      <H2>8. Damaged Packages</H2>
      <P>
        Damage discovered on arrival should be photographed before the carton is
        unpacked further. Email the photos plus the order ID to{" "}
        <A href="mailto:research@vialchemlabs.net">research@vialchemlabs.net</A>{" "}
        within 7 days of delivery to qualify for replacement under the{" "}
        <A href="/legal/refunds">Refund Policy</A>.
      </P>

      <H2>9. Address Accuracy</H2>
      <P>
        It is the buyer&apos;s responsibility to ensure the shipping address
        provided at checkout is correct, complete, and accessible. {brand} is
        not responsible for failed delivery, return-to-sender, or rerouting fees
        caused by buyer-supplied address errors.
      </P>

      <H2>10. Jurisdictional Review</H2>
      <P>
        Orders may be reviewed for jurisdictional, carrier, or compliance
        concerns before fulfillment. If an order cannot be fulfilled after
        review, the order will be cancelled and refunded; the buyer accepts that
        jurisdictional responsibility is part of placing an order.
      </P>

      <H2>11. International Inquiries</H2>
      <P>
        We are not currently set up for international shipment. International
        researchers interested in future availability are welcome to write to{" "}
        <A href="mailto:research@vialchemlabs.net">research@vialchemlabs.net</A>
        ; we maintain a notification list as we evaluate customs and routing.
      </P>

      <H2>12. Contact</H2>
      <P>
        Shipping questions:{" "}
        <A href="mailto:research@vialchemlabs.net">research@vialchemlabs.net</A>{" "}
        or <A href="/contact">contact form</A>.
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

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-5 border-l-2 border-[var(--accent)] pl-5 italic text-[var(--text)]">
      {children}
    </blockquote>
  );
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
