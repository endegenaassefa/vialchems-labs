"use client";

import { useState } from "react";

import type { StorefrontPanel } from "@/lib/content/products";

export function ProductDetailPanels({ panels }: { panels: StorefrontPanel[] }) {
  const [activePanelId, setActivePanelId] = useState<StorefrontPanel["id"]>(
    panels[0]?.id ?? "description"
  );

  const activePanel =
    panels.find((panel) => panel.id === activePanelId) ?? panels[0];

  if (!activePanel) {
    return null;
  }

  return (
    <div className="rounded-[26px] border border-[var(--border)] bg-[rgba(8,12,8,0.68)] p-6">
      <div className="flex flex-wrap gap-2">
        {panels.map((panel) => {
          const active = panel.id === activePanel.id;

          return (
            <button
              key={panel.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[var(--accent)] text-black"
                  : "border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-white"
              }`}
              onClick={() => setActivePanelId(panel.id)}
              type="button"
            >
              {panel.label}
            </button>
          );
        })}
      </div>
      <div className="mt-5 grid gap-4 text-sm leading-7 text-[var(--text-muted)]">
        {activePanel.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
