import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { AccessForm } from "@/components/access-form";
import { AttorneyBanner } from "@/components/attorney-banner";

export const metadata: Metadata = {
  title: "Request Access"
};

export default function AccessPage() {
  return (
    <section className="section">
      <div className="container form-layout">
        <div className="stack">
          <AttorneyBanner />
          <article className="info-card">
            <ShieldCheck size={24} aria-hidden="true" />
            <h2>What this form does</h2>
            <p>
              It creates a manual MOGTRIX access or procurement review request.
              Use it when you need staff help beyond the normal sign-in,
              qualification, and pilot checkout flow. It does not create an
              order or hosted payment session by itself.
            </p>
            <ul className="tag-list">
              <li>Age attestation</li>
              <li>Role and credential review</li>
              <li>Research-use boundary</li>
              <li>Typed legal name</li>
            </ul>
          </article>
        </div>
        <AccessForm />
      </div>
    </section>
  );
}
