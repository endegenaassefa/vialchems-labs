/**
 * Refund Policy — composed per SUPER_PROMPT_v3 Appendix L.3.
 * ~500 words. All sales final on opened vials. Replacement only for shipping
 * damage with photo evidence within 7 days of delivery.
 */
import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Replacement policy for vialchemlabs research-peptide orders. All sales final on opened vials. Shipping damage replacement requires photo evidence within 7 days.",
};

export default function RefundsPage() {
  const brand = siteConfig.name;

  return (
    <LegalShell
      eyebrow="Legal / Refund Policy"
      title="Refund Policy"
      lastUpdated="2026-05-08"
    >
      <P>
        This policy governs final sale terms and replacement requests for orders
        placed with {brand}. By placing an order, you acknowledge and agree to
        this policy.
      </P>

      <H2>1. All Sales Final on Opened Vials</H2>
      <P>
        Vials whose tamper-evident seal has been removed or whose stopper has
        been pierced are not eligible for refund or replacement under any
        circumstances. The integrity of a sealed lyophilized peptide vial is the
        only condition under which we can attest to the published Certificate of
        Analysis applying to the article in your possession.
      </P>

      <H2>2. Shipping Damage Replacement</H2>
      <P>
        Replacement is provided for vials that arrive with broken glass,
        shattered stoppers, dislodged seals, or other damage demonstrably
        attributable to shipping. To request a replacement:
      </P>
      <UL>
        <LI>
          Contact{" "}
          <A href="mailto:research@vialchemlabs.net">
            research@vialchemlabs.net
          </A>{" "}
          or use the <A href="/contact">contact form</A> within 7 days of
          delivery.
        </LI>
        <LI>
          Include your order ID and clear photographs of the damaged item, the
          shipping carton, and any visible damage to packaging.
        </LI>
        <LI>
          Retain the damaged article and packaging until we confirm receipt of
          your evidence.
        </LI>
      </UL>
      <P>
        Replacement requests submitted after 7 days from delivery are not
        eligible.
      </P>

      <H2>3. Order Errors</H2>
      <P>
        If we have shipped the wrong product or quantity relative to your order,
        contact us within 7 days of delivery with your order ID and a photo of
        the received items. We will arrange a corrective shipment.
      </P>

      <H2>4. Buyer-Caused Issues</H2>
      <P>Refunds and replacements are not available for the following:</P>
      <UL>
        <LI>Shipping address errors entered by the buyer at checkout.</LI>
        <LI>
          Failed delivery related to jurisdictional ineligibility under our{" "}
          <A href="/legal/shipping">Shipping Policy</A>; the buyer is
          responsible for confirming jurisdictional eligibility before order.
        </LI>
        <LI>
          Packages refused by the recipient or returned to sender by the
          carrier.
        </LI>
        <LI>
          Storage failures after delivery (e.g., temperature excursion, damage
          by recipient).
        </LI>
      </UL>

      <H2>5. Replacement-First Remedy</H2>
      <P>
        The primary remedy for eligible shipping damage or order error is a
        corrective replacement shipment. Cash refunds are not guaranteed and are
        considered only where a replacement is not commercially practical or
        where required by applicable law. Refunds, if approved, are issued to
        the original payment instrument where feasible.
      </P>

      <H2>6. Lost Packages</H2>
      <P>
        For packages marked &quot;delivered&quot; that have not arrived, please
        first file a claim with USPS or FedEx using your tracking number. We
        will independently investigate from the sender side and will provide a
        replacement at our discretion based on available evidence (tracking
        record, delivery confirmation, photos where applicable). See{" "}
        <A href="/faq">FAQ</A> for the recommended next steps.
      </P>

      <H2>7. Contact</H2>
      <P>
        Refund and replacement requests:{" "}
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
