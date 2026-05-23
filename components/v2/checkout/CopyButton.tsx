"use client";

import { useState } from "react";

/**
 * Generic tap-to-copy button shared across checkout flows.
 *
 * The Zelle checkout still uses the original `ZelleCopyButton` shim
 * (added pre-v5); future cleanup can fold both into this component.
 * For M0b this lives alongside `ZelleCopyButton` so the Bitcoin page
 * does not import a Zelle-named symbol and so the M0a Zelle code is
 * untouched in this PR.
 */
export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
}: {
  value: string;
  label: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={handleCopy}
      style={{ justifyContent: "center" }}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
