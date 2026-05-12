# Checkpoint Sub-Artifact — v4 Phase 0 Operator Gate #3: Appendix AC UI Elevation Reference Set

Date: 2026-05-09
Source: super-prompt v4 §10 Appendix AC.

## Operator response

> "Accept defaults (Recommended)."

## Confirmed reference set (calibration target for Phases 3-6)

| #   | Site                                    | Why this site                                                                               | vialchemlabs target surface                          |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | **Stripe.com**                          | Clean clinical typography rhythm, generous whitespace, restrained color, semantic hierarchy | Hero + thesis section density                        |
| 2   | **Linear.app**                          | Atmospheric backgrounds, monospace data accents, dark surface elevation, motion vocabulary  | Vial + COA tables surface treatment                  |
| 3   | **Vercel.com**                          | Component composition, asymmetric hero patterns, subtle gradient overlays                   | Shop catalog tile lift rhythm                        |
| 4   | **Anthropic.com**                       | Editorial typography, italic accents, dark-first design language with restrained color      | Blog post + about page voice                         |
| 5   | **Cursor.so**                           | Premium-out easing, subtle hover lifts, refined Card elevations                             | Phase 2 primitive overhaul micro-interaction quality |
| 6   | **Apple.com (developer documentation)** | Dense Specs grids, monospace tabular numerals, bordered separators                          | PDP sidebar + COA detail density                     |

## Anti-references (per Appendix AC)

DO NOT calibrate against any of:

- Generic SaaS dashboards with purple/blue gradients (Iron Law 2.26 + Phase 4 v3.0 anti-pattern)
- Maximalist B2C sites with stock photography (no stock photos per Iron Law 2.26)
- Meme-coded community sites (Posture B; vialchemlabs is Posture A LOCKED per Iron Law 2.26)
- Material Design / Bootstrap defaults (anti-pattern fonts: Geist/Inter/Roboto/Space Grotesk per Iron Law 2.26)
- Webflow marketing-template aesthetic (no 3-column SaaS feature grid per Iron Law 2.26)

## Polish quality bar (per phase verification gate)

- **Typography:** every type pairing uses tokens from `lib/design/tokens.ts`; no ad-hoc font sizes.
- **Color:** every color reference uses CSS variables from `app/globals.css`; no ad-hoc hex.
- **Spacing:** every spacing value uses spacing tokens; no ad-hoc px values outside tokens.
- **Motion:** every animation uses motion tokens (durations + eases); honors `prefers-reduced-motion` per Iron Law 2.18.
- **Density:** Plex Mono tabular numerals for all numeric content (prices, batch numbers, dates).
- **Hierarchy:** clear h1 → h2 → h3 sequence; no skipped levels (a11y per §7.2).

## Calibration mechanism

- Phase 1-6: each phase produces before/after screenshots; operator reviews against this reference set; `/design-review` runs; gstack reviewer references the calibration target.
- Phase 11: visual-regression baseline captured (Iron Law 2.18 + 2.25); operator approves the baseline as "calibrated against Appendix AC"; that becomes the merge-gate baseline.
