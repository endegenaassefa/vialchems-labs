# Phase 4 — Brand + Design System (CHECKPOINT)

Date: 2026-05-08
Status: COMPLETE

## Locked Brand

- Name: vialchemlabs
- Posture: A (clean clinical) per Appendix V.2
- Domain: vialchemlabs.net
- Wordmark: "vialchemlabs" (Plex Sans 600) + "LABS" chip (Plex Mono 500 uppercase 0.16em tracking, accent border)

## Tokens (LOCKED)

| Category   | Values                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Surfaces   | bg #0a0e0f, surface #141a1c, surface-strong #1a2226                                                |
| Accent     | accent #3dd4c8, accent-soft #5eebdf, accent-glow #7ff1e8, electric #67e8f9                         |
| Text       | text rgba(255,255,255,0.92), text-muted rgba(255,255,255,0.62), text-subtle rgba(255,255,255,0.42) |
| Borders    | border #1f2a2e, border-strong #2a3a40                                                              |
| Typography | IBM Plex Sans 300-700 + IBM Plex Mono 300-600 + Newsreader 400i (hero italic only)                 |
| Spacing    | 4px base unit (2xs through 6xs)                                                                    |
| Radius     | sm/md/lg/xl/2xl/full                                                                               |
| Motion     | premium-out / in / move / linear easings; micro/short/medium/long/slow durations                   |
| Z-index    | base/dropdown/sticky/overlay/modal/toast                                                           |

## Components

| Path                         | Tests                       | Status |
| ---------------------------- | --------------------------- | ------ |
| components/ui/Button.tsx     | 16                          | ✓      |
| components/ui/Pill.tsx       | 8                           | ✓      |
| components/ui/Card.tsx       | 9                           | ✓      |
| components/ui/FieldLabel.tsx | 8                           | ✓      |
| components/ui/Input.tsx      | 10                          | ✓      |
| components/ui/Specs.tsx      | 7                           | ✓      |
| components/ui/Vial.tsx       | 11                          | ✓      |
| components/SiteHeader.tsx    | (integration via home page) | ✓      |
| components/SiteFooter.tsx    | (integration via home page) | ✓      |

Total: 119/119 tests passing (50 compliance + 69 components).

## Anti-Pattern Enforcement (Appendix V.2)

| Anti-Pattern                                      | Status                |
| ------------------------------------------------- | --------------------- |
| NO Geist / Inter / Roboto / Space Grotesk primary | ✓ enforced            |
| NO purple/violet gradients                        | ✓ enforced            |
| NO 3-column SaaS feature grid                     | ✓ enforced            |
| NO bubble-radius on every element                 | ✓ varied radius scale |
| NO stock photos                                   | ✓ no images           |
| NO "Built for X" SaaS marketing copy              | ✓ no SaaS copy        |
| NO before/after photography                       | ✓ no imagery          |
| NO emoji icons                                    | ✓ Lucide + SVG only   |
| NO acid-green (Mogtrix choice)                    | ✓ teal accent locked  |

## Verification Gate

- [x] Brand assets (wordmark + LABS chip) rendered
- [x] Design tokens defined (lib/design/tokens.ts + globals.css)
- [x] Component primitives built with TDD discipline (RED → GREEN)
- [x] All 119 tests pass
- [x] grep-mogtrix: 0 non-attribution hits
- [x] grep-forbidden-words: 0 hits across 4 scan paths
- [x] supply-chain-scan: 0 violations
- [x] Accessibility: WCAG AA contrast verified via locked token pairs; focus-ring 2px solid accent + 2px offset; skip-link in body; A11y in Pill (text label always); A11y in Input (role=alert + aria-invalid + aria-describedby)
- [x] No forbidden marketing patterns in any new copy
- [x] Build succeeds (Next.js 16.2.6 Turbopack)

## Outstanding for Phase 5 entry

Phase 5 (Site IA + 29 page templates) can begin. Components/ui/ primitives + SiteHeader + SiteFooter ready for page composition.
