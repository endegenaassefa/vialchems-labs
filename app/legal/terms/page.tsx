/**
 * Terms of Service — composed per SUPER_PROMPT_v3 Appendix L.1.
 *
 * Verbatim clauses pulled from Appendices A.1 (503A/503B), A.3 (age gate),
 * A.4 (jurisdictional), A.6 (CS vocabulary). Brand placeholders substituted.
 * In SKIP_PATHS for grep-forbidden-words.sh.
 */
import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for vialchem.labs research-peptide supply, including age gate, jurisdictional restrictions, and dispute resolution.",
};

export default function TermsPage() {
  const brand = siteConfig.name;
  const llc = siteConfig.llcName;
  const jur = siteConfig.llcJurisdiction;

  return (
    <LegalShell
      eyebrow="Legal / Terms of Service"
      title="Terms of Service"
      lastUpdated="2026-05-08"
    >
      <H2>1. Parties and Acceptance</H2>
      <P>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use
        of the website operated by {llc} (&quot;{brand},&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) at {siteConfig.url}, and the
        purchase of any product offered through that website. By accessing the
        site, creating an account, or placing an order, you agree to be bound by
        these Terms. If you do not agree, do not access the site and do not
        place an order.
      </P>

      <H2>2. Eligibility</H2>
      <P>
        You must be 21 years of age or older and a qualified researcher to
        access {brand}. By placing an order, you confirm that you are 21+ years
        of age and will use these products solely for laboratory research in
        non-clinical settings. Products are not for human consumption.
      </P>
      <P>
        &quot;Qualified researcher&quot; includes academic researchers, clinical
        research professionals, biotech researchers, laboratory technicians,
        compounding pharmacists, and analytical professionals operating under
        appropriate research, laboratory, or compliance frameworks. {brand}
        reserves the right to verify qualification and decline orders at its
        sole discretion.
      </P>

      <H2>3. Acceptable Use</H2>
      <P>
        You agree to use {brand} only for lawful purposes consistent with these
        Terms. You agree to comply with all applicable laws and regulations,
        including the Federal Food, Drug, and Cosmetic Act, the Controlled
        Substances Act where applicable, and any state, municipal, or
        institutional rules governing the receipt, storage, and use of research
        compounds.
      </P>

      <H2>4. Prohibited Conduct</H2>
      <P>
        You agree that you will not, and will not assist or permit any third
        party to:
      </P>
      <UL>
        <LI>
          Introduce, administer, or otherwise apply any product purchased from{" "}
          {brand} into a human or animal subject by any route — oral,
          parenteral, topical, or otherwise.
        </LI>
        <LI>
          Use any product purchased from {brand} for any clinical, medical,
          veterinary, cosmetic, or therapeutic purpose, on-label or off-label.
        </LI>
        <LI>
          Resell, distribute, or transfer any product purchased from {brand} to
          consumers or to any third party who is not a qualified researcher.
        </LI>
        <LI>
          Misrepresent your identity, role, institution, or research purpose
          during qualification.
        </LI>
        <LI>
          Use the site to violate any applicable law, regulation, or contract,
          or to infringe any third-party right.
        </LI>
        <LI>
          Reverse-engineer, scrape, or systematically copy the site contents,
          except as expressly permitted by these Terms.
        </LI>
      </UL>

      <H2>5. Intellectual Property</H2>
      <P>
        The site contents — text, graphics, images, logos, layout, code, and the{" "}
        {brand} name — are owned by {llc} or its licensors and are protected by
        copyright, trademark, and other applicable laws. You receive no license
        to use any of the foregoing except for your personal, non-commercial use
        of the site to evaluate and place orders consistent with these Terms.
      </P>

      <H2>6. Payment Terms</H2>
      <P>
        {brand} accepts cryptocurrency (Bitcoin, Litecoin, optionally Ethereum)
        via self-hosted payment infrastructure and US bank transfers via Plaid
        ACH. Credit and debit cards are not currently supported. All prices are
        listed in US dollars. {brand} may modify prices, payment options, and
        promotional terms at any time without notice; modifications do not
        affect orders already accepted.
      </P>
      <P>
        Orders are accepted only after qualification verification, payment
        confirmation, and {brand} order acknowledgment. Quoted shipping
        timeframes are estimates and not guarantees.
      </P>

      <H2>7. Refund Policy Reference</H2>
      <P>
        Refunds and replacements are governed by the{" "}
        <A href="/legal/refunds">Refund Policy</A>. By placing an order, you
        acknowledge and agree to that policy.
      </P>

      <H2>8. Shipping Policy Reference</H2>
      <P>
        Shipping methods, carriers, lead times, and jurisdictional restrictions
        are governed by the <A href="/legal/shipping">Shipping Policy</A>. By
        placing an order, you acknowledge and agree to that policy.
      </P>

      <H2>9. Age Gate</H2>
      <P>
        At first cart action, you will be asked to confirm the following text
        verbatim by checking the corresponding box:
      </P>
      <Quote>
        I confirm that I am 21+ years of age and will use these products solely
        for laboratory research in non-clinical settings. Products are not for
        human consumption.
      </Quote>
      <P>
        Submission of the order constitutes ratification of that statement.
        Falsifying age or qualification information is a material breach of
        these Terms.
      </P>

      <H2>10. Jurisdictional Restrictions</H2>
      <Quote>
        {brand} ships to addresses within the United States only at this time.{" "}
        The customer assumes all regulatory compliance responsibility for their
        destination, municipality, state, and organization.
      </Quote>

      <H2>11. 503A and 503B Status</H2>
      <Quote>
        {brand} is a chemical supplier. {brand} is not a compounding pharmacy or
        chemical compounding facility as defined under 503A of the Federal Food,
        Drug, and Cosmetic Act. {brand} is not an outsourcing facility as
        defined under 503B of the Federal Food, Drug, and Cosmetic Act.
      </Quote>

      <H2>12. Customer Service Vocabulary Clause</H2>
      <Quote>
        Replies regarding animals using personal pronouns refer to tissue
        samples and test subjects, and that such replies do not imply human use.
      </Quote>

      <H2>13. Governing Law</H2>
      <P>
        These Terms and any dispute arising out of or relating to them, the
        site, or the products purchased through the site are governed by the
        laws of the State of {jur}, without regard to its conflict-of-laws
        principles. The exclusive forum and venue for any judicial proceeding
        permitted under Section 14 below is the state and federal courts located
        in {jur}.
      </P>

      <H2>14. Binding Arbitration and Class-Action Waiver</H2>
      <P>
        Any dispute, claim, or controversy arising out of or relating to these
        Terms or any product purchased from {brand} shall be resolved by binding
        individual arbitration administered by the American Arbitration
        Association under its Consumer Arbitration Rules. The arbitrator shall
        have exclusive authority to resolve all threshold questions of
        arbitrability. You and {brand} agree to bring claims only in your or its
        individual capacity, and not as a plaintiff or class member in any
        purported class, collective, or representative proceeding. The
        arbitrator may not consolidate more than one person&apos;s claims and
        may not preside over any form of class proceeding. If this Section 14 is
        found unenforceable, then the entirety of this Section 14 (but no other
        section of these Terms) shall be void.
      </P>

      <H2>15. Indemnification</H2>
      <P>
        You agree to indemnify, defend, and hold harmless {llc}, its officers,
        directors, employees, and agents from and against any and all claims,
        damages, losses, liabilities, costs, and expenses (including reasonable
        attorneys&apos; fees) arising out of or relating to: (a) your breach of
        these Terms; (b) your misuse of any product purchased from {brand},
        including any introduction into a human or animal subject; (c) your
        violation of any applicable law or regulation; or (d) your violation of
        any third-party right.
      </P>

      <H2>16. Limitation of Liability</H2>
      <P>
        To the maximum extent permitted by applicable law, {llc} and its
        officers, directors, employees, and agents shall not be liable for any
        indirect, incidental, special, consequential, exemplary, or punitive
        damages, or for any loss of profits, revenue, data, or use, arising out
        of or in connection with these Terms, the site, or any product purchased
        from {brand}. The aggregate liability of {llc} arising from or related
        to these Terms or any product shall not exceed the amount paid by you
        for the product giving rise to the claim. The limitations in this
        section apply regardless of the legal theory and even if {brand} has
        been advised of the possibility of such damages.
      </P>

      <H2>17. Warranty Disclaimer</H2>
      <P>
        The site and the products are provided &quot;as is&quot; and &quot;as
        available,&quot; without warranty of any kind, whether express, implied,
        statutory, or otherwise, to the maximum extent permitted by law. {brand}{" "}
        disclaims all warranties, including warranties of merchantability,
        fitness for a particular purpose, title, and non-infringement. {brand}{" "}
        does not warrant that the site or any product will meet your
        requirements, be error-free, or be available without interruption.
        Without limiting the foregoing, {brand} makes no representations
        regarding any therapeutic, medical, veterinary, or clinical application
        of any product, and the products are not approved by any regulatory
        authority for any indication.
      </P>

      <H2>18. Modification of Terms</H2>
      <P>
        {brand} may modify these Terms at any time by posting the modified Terms
        on the site. Modifications take effect upon posting. Your continued use
        of the site after posting constitutes acceptance of the modified Terms.
        If you do not agree to the modified Terms, you must stop using the site
        and may not place further orders.
      </P>

      <H2>19. Severability</H2>
      <P>
        If any provision of these Terms is held invalid or unenforceable by a
        court of competent jurisdiction, that provision shall be enforced to the
        maximum extent permissible, and the remaining provisions shall continue
        in full force and effect.
      </P>

      <H2>20. Entire Agreement</H2>
      <P>
        These Terms, together with the Privacy Policy, Refund Policy, Shipping
        Policy, and Cookie Policy, constitute the entire agreement between you
        and {brand} regarding the site and supersede any prior or
        contemporaneous understandings.
      </P>

      <H2>21. Contact</H2>
      <P>
        Questions regarding these Terms may be sent to{" "}
        <A href="mailto:research@vialchemlabs.net">research@vialchemlabs.net</A>{" "}
        or via the <A href="/contact">contact form</A>.
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
