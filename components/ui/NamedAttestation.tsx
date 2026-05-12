/**
 * NamedAttestation — Named research-buyer attestation card with placeholder mode.
 *
 * Inspired by rogo.ai (named C-suite testimonials with title + firm) and
 * titanintake.com (named clinic directors with title + organization). The
 * pattern is HIGH-credibility because it's verifiable; "Dr. J., Researcher"
 * is not.
 *
 * v4 ships with placeholder mode by default (Iron Law 2.10 — no fake
 * testimonials at launch). Once real attestations land from the qualification-
 * gated buyer base, swap content; layout stays. Honest "Pending real
 * attestations" placeholder is borrowed from klokki.com's open-letter pattern.
 */
import { cn } from "@/lib/utils";

interface NamedAttestationRealProps {
  placeholder?: false;
  quote: string;
  name: string;
  role: string;
  organization: string;
}

interface NamedAttestationPlaceholderProps {
  placeholder: true;
  /** Optional override for the placeholder copy. */
  message?: string;
}

export type NamedAttestationProps = (
  | NamedAttestationRealProps
  | NamedAttestationPlaceholderProps
) & {
  className?: string;
};

const DEFAULT_PLACEHOLDER =
  "Pending real research-buyer attestations. We launch with no testimonials and let the first ones accumulate organically through the qualification-gated buyer base.";

export function NamedAttestation(props: NamedAttestationProps) {
  if (props.placeholder) {
    return (
      <article
        className={cn(
          "rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)]",
          "bg-[color:color-mix(in_srgb,var(--surface)_60%,transparent)] p-6",
          props.className,
        )}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] mb-3">
          Attestation · pending
        </p>
        <p className="text-[15px] leading-[1.6] text-[var(--text-muted)] italic">
          {props.message ?? DEFAULT_PLACEHOLDER}
        </p>
      </article>
    );
  }
  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6",
        "flex flex-col gap-5",
        props.className,
      )}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
        Researcher attestation
      </p>
      <blockquote className="text-[16px] leading-[1.55] text-[var(--text)]">
        <span aria-hidden="true" className="text-[var(--accent)] mr-1">
          &ldquo;
        </span>
        {props.quote}
        <span aria-hidden="true" className="text-[var(--accent)] ml-1">
          &rdquo;
        </span>
      </blockquote>
      <footer className="text-[13px] leading-[1.5]">
        <p className="text-[var(--text)] font-medium">{props.name}</p>
        <p className="text-[var(--text-muted)]">
          {props.role} · {props.organization}
        </p>
      </footer>
    </article>
  );
}
