# Changelog

All notable changes to mogtrix-website will be documented in this file.
Format follows Keep a Changelog (https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Design System v2 foundation (sub-project A of production-launch master plan):
  - IBM Plex Sans + IBM Plex Mono + Instrument Serif loaded via Bunny Fonts CDN
  - Refined color tokens in `app/globals.css`: added `--surface-data` (#0a1f24), `--electric` (#22d3ee), `--electric-soft` (#67e8f9), `--error` (#ff4d6d), `--text-subtle` (rgba 0.36), `--border-strong` (#2a2a2a)
  - Atmospheric body background (4 layered radial gradients: acid-green + electrolyte cyan + dark cyan-data)
  - Motion vocabulary: 6 keyframes (vial-float, vial-tilt, vial-sheen, vial-rotate, pulse, fill-ripple), 5 utility classes
  - Hard fallback for `prefers-reduced-motion: reduce` across all `*` and pseudo-elements
  - TypeScript design tokens module at `lib/design/` (tokens, motion, types, barrel)
  - Seven component primitives at `components/ui/`: Button (4 variants), Pill (5 status variants), Input + FieldLabel, Card (3 backgrounds), Specs, CoaRow, Vial (3D-rotating CSS composition)
  - 45 vitest tests for the design system at `tests/design/`
- See `DESIGN.md` for the full system. See `docs/superpowers/plans/2026-05-05-design-system-foundation.md` for the implementation plan.
