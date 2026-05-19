"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FlaskConical } from "lucide-react";
import {
  AGE_GATE_GOODBYE_URL,
  normalizeAgeGateNext,
} from "@/lib/age-verification";
import { DnaHelixScene } from "@/components/age-gate/DnaHelixScene";
import { ParticleFormulaField } from "@/components/age-gate/ParticleFormulaField";
import {
  clearAgeVerification,
  hasCurrentAgeVerification,
  persistAgeVerification,
} from "@/components/age-gate/useAgeVerification";

const HEADLINE = "RESEARCH-GRADE PEPTIDES";
const HEADLINE_WORDS = (() => {
  let start = 0;
  return HEADLINE.split(" ").map((word) => {
    const value = { word, start };
    start += word.length + 1;
    return value;
  });
})();

const REQUIREMENTS = [
  "You are 21 years of age or older",
  "For research purposes only",
  "Not for human consumption",
  "You agree to Terms and Privacy Policy",
];

const RESEARCH_DETAILS = [
  {
    title: "Research use only",
    body: "Products are supplied only for laboratory, analytical, and non-clinical research settings. They are not for human consumption, human dosing, injection, ingestion, or veterinary use.",
  },
  {
    title: "Qualified access",
    body: "Buyer qualification requires age confirmation, institutional or research-role identification, a research-purpose statement, jurisdictional acknowledgment, and research-use-only acknowledgment.",
  },
  {
    title: "Testing posture",
    body: "Product pages are expected to show batch or lot number, test date, lab name, COA access, and applicable test types including HPLC, Mass Spec, endotoxin, and sterility screens.",
  },
  {
    title: "Shipping boundaries",
    body: "VialChem Labs ships within the United States only at this time. Customers assume jurisdiction-specific compliance responsibility for their organization and destination.",
  },
];

export function AgeGateClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [exiting, setExiting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const nextPath = useMemo(
    () => normalizeAgeGateNext(searchParams.get("next")),
    [searchParams],
  );

  useEffect(() => {
    if (!hasCurrentAgeVerification()) return;
    void persistAgeVerification().then(() => router.replace(nextPath));
  }, [nextPath, router]);

  async function enterSite() {
    if (!termsAccepted) return;
    try {
      await persistAgeVerification();
      setExiting(true);
      window.setTimeout(() => {
        router.replace(nextPath);
      }, 600);
    } catch {
      setExiting(false);
    }
  }

  async function exitSite() {
    const confirmed = window.confirm(
      "You will be redirected away from this site.",
    );
    if (!confirmed) return;

    await clearAgeVerification();
    window.location.replace(AGE_GATE_GOODBYE_URL);
  }

  return (
    <main
      id="main"
      className={`age-gate-root ${exiting ? "age-gate-exiting" : ""}`}
    >
      <DnaHelixScene />
      <ParticleFormulaField />

      <div className="age-gate-content">
        <section
          aria-labelledby="age-gate-title"
          className="mx-auto flex w-full max-w-[720px] flex-col items-center text-center"
        >
          <div className="age-gate-logo mb-7 inline-flex flex-col items-center gap-3 max-sm:mb-4 max-sm:gap-2">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 place-items-center rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.045)] text-[var(--accent-hover)] shadow-[0_0_34px_rgba(77,171,247,0.24)] backdrop-blur-md max-sm:h-10 max-sm:w-10"
            >
              <FlaskConical size={22} strokeWidth={1.6} />
            </span>
            <span className="font-display text-[19px] font-semibold tracking-[0.22em] text-[var(--text-primary)] max-sm:text-[16px]">
              VialChem Labs
            </span>
          </div>

          <h1
            id="age-gate-title"
            className="font-display max-w-[980px] text-[clamp(28px,6vw,62px)] font-semibold leading-[0.98] tracking-[0.08em] text-[var(--text-primary)] max-sm:text-[clamp(23px,6.1vw,40px)] max-sm:tracking-[0.04em]"
          >
            {HEADLINE_WORDS.map(({ word, start }, wordIndex) => (
              <span key={word} className="inline-block whitespace-nowrap">
                {word.split("").map((letter, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="age-gate-letter"
                    style={{
                      animationDelay: `${700 + (start + index) * 30}ms`,
                    }}
                  >
                    {letter}
                  </span>
                ))}
                {wordIndex < HEADLINE_WORDS.length - 1 ? "\u00A0" : null}
              </span>
            ))}
          </h1>

          <p className="age-gate-subtitle mt-4 text-[16px] font-medium tracking-[0.04em] text-[var(--text-secondary)] max-sm:mt-3 max-sm:text-[14px]">
            For laboratory use only
          </p>

          <div className="age-gate-card mt-8 w-full max-w-[560px] px-6 py-6 text-left max-sm:mt-5 max-sm:px-4 max-sm:py-4 sm:px-7">
            <p className="text-[15px] leading-[1.65] text-[var(--text-secondary)] max-sm:text-[13px] max-sm:leading-[1.5]">
              This site contains products intended exclusively for qualified
              laboratory research use. Entry requires confirmation of the
              following conditions.
            </p>
            <ul className="mt-5 space-y-3 text-[14px] leading-[1.5] text-[var(--text-secondary)] max-sm:mt-3 max-sm:space-y-2 max-sm:text-[12px]">
              {REQUIREMENTS.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.58em] h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent)] shadow-[0_0_12px_rgba(77,171,247,0.65)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <details className="age-gate-info mt-5 rounded-[14px] border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.14)] p-4">
              <summary className="cursor-pointer rounded-[6px] font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-hover)] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
                Research access details
              </summary>
              <div className="age-gate-info-body mt-4 grid gap-3 sm:grid-cols-2">
                {RESEARCH_DETAILS.map((detail) => (
                  <section key={detail.title}>
                    <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-primary)]">
                      {detail.title}
                    </h2>
                    <p className="mt-1 text-[12px] leading-[1.55] text-[var(--text-secondary)]">
                      {detail.body}
                    </p>
                  </section>
                ))}
              </div>
            </details>
          </div>

          <div className="age-gate-agreement mt-5 w-full max-w-[560px] text-left">
            <label
              htmlFor="age-gate-terms"
              className="group flex min-h-11 cursor-pointer items-start gap-3 rounded-[14px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.035)] px-4 py-3 text-[13px] leading-[1.55] text-[var(--text-secondary)] transition-colors hover:border-[rgba(77,171,247,0.34)] max-sm:text-[12px]"
            >
              <input
                id="age-gate-terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) =>
                  setTermsAccepted(event.currentTarget.checked)
                }
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="mt-[1px] grid h-[22px] w-[22px] flex-none place-items-center rounded-[6px] border border-[rgba(255,255,255,0.22)] bg-[rgba(4,6,13,0.62)] transition-[border-color,background-color,box-shadow] duration-200 peer-checked:border-[var(--accent)] peer-checked:bg-[rgba(77,171,247,0.14)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)]"
              >
                <svg
                  className={`text-[var(--accent-hover)] transition-transform duration-[120ms] ease-out ${
                    termsAccepted ? "scale-100" : "scale-0"
                  }`}
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M3.1 7.8L6.1 10.8L12 4.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span id="age-gate-terms-label">
                I have read and agree to the{" "}
                <Link
                  href="/legal/terms"
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="text-[var(--accent-hover)] underline-offset-2 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/legal/privacy"
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="text-[var(--accent-hover)] underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </Link>
                . I confirm that I am 21+ years of age and will use these
                products solely for laboratory research in non-clinical
                settings. Products are not for human consumption.
              </span>
            </label>
          </div>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 max-sm:mt-5 sm:w-auto sm:flex-row">
            <button
              type="button"
              aria-label="Confirm you are 21 or older and enter the site"
              onClick={enterSite}
              disabled={!termsAccepted}
              className="age-gate-primary min-h-11 w-full rounded-full bg-[linear-gradient(135deg,#1971c2,#4dabf7)] px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--text-on-accent)] transition-[opacity,transform,box-shadow,filter] duration-300 disabled:cursor-not-allowed disabled:opacity-45 disabled:grayscale max-sm:py-3 max-sm:text-[12px] sm:w-auto"
            >
              I am 21+ Enter
            </button>
            <button
              type="button"
              aria-label="You are under 21, exit the site"
              onClick={exitSite}
              className="age-gate-secondary min-h-11 w-full rounded-full border border-[rgba(255,255,255,0.20)] bg-transparent px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)] transition-colors duration-200 hover:border-[rgba(224,49,49,0.60)] hover:text-[var(--text-primary)] max-sm:py-3 max-sm:text-[12px] sm:w-auto"
            >
              I am under 21 Exit
            </button>
          </div>

          <footer className="age-gate-footer mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] text-[var(--text-muted)] max-sm:mt-4 max-sm:text-[11px]">
            <span>© {new Date().getFullYear()} VialChem Labs</span>
            <span aria-hidden="true">·</span>
            <Link
              href="/legal/terms"
              className="hover:text-[var(--accent-hover)]"
            >
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/legal/privacy"
              className="hover:text-[var(--accent-hover)]"
            >
              Privacy
            </Link>
          </footer>
        </section>
      </div>
    </main>
  );
}
