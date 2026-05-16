"use client";

import { useState } from "react";

interface ZelleCopyButtonProps {
  value: string;
  label: string;
}

export function ZelleCopyButton({ value, label }: ZelleCopyButtonProps) {
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
      {copied ? "Copied" : label}
    </button>
  );
}
