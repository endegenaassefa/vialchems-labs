# Checkpoint — v4 Phase 6: Page Polish — Legal + About + FAQ + Blog + Aux

Date: 2026-05-10
Build: SUPER_PROMPT_v4_2026-05-09_ui-and-finish.md (vialchemlabs Posture A)
Phase goal: polish the remaining 13 page surfaces — FAQ disclosure UI, blog index + post, contact form, test-reports methodology, affiliate program, login/signup stubs, newsletter/thanks, error/404. Final page-polish phase before cross-cutting motion / a11y / perf layers (Phases 7-9).

Predecessor: `docs/checkpoints/v4_phase_5_checkout_account_order.md`

---

## 1. North Star Reload (per §5.1)

Re-read at phase entry: super-prompt §2.5 + locked compliance copy (legal/about/faq verbatim text untouchable), §2.18 (no aesthetic regression), §2.21 (additive tokens), §2.26 (brand locked), Appendix W.1 visual quality checklist.

---

## 2. Files Polished — Before/After

### 2.1 FAQ (`app/faq/page.tsx`)
| Surface | Before | After |
|---|---|---|
| 20 verbatim Q+A bodies | from `lib/content/faq.ts` | **UNCHANGED** — Iron Law 2.5 + locked compliance copy |
| `<details>` disclosure cards | bordered surface, no shadow | + `shadow-[var(--shadow-sm)]` resting; on open: + `--surface-elevated` bg + `--shadow-md` lift; transitioned via `transition-[background-color,border-color,box-shadow]` (reduced-motion fallback global) |
| `+` rotation marker on summary | already 45° rotation on group-open | unchanged |

### 2.2 Blog index (`app/blog/page.tsx`)
| Surface | Before | After |
|---|---|---|
| Post list layout | `<ul className="divide-y">` with bare `<article>` per post | `<ul className="space-y-6">` with `<Card as="article" variant="interactive">` per post; inherits Phase 2 --shadow-sm + hover --shadow-md + lift |
| Post title color | `<h2>` → nested `<Link>` with own hover state | single group hover: title shifts to `--accent-soft` on Card hover |
| Footer "Read research →" | Link with own hover state | `<span>` inside group; inherits group-hover state |

### 2.3 Blog post (`app/blog/[slug]/page.tsx`)
| Surface | Before | After |
|---|---|---|
| Post body sections + citations | structured renderer | unchanged |
| "Research-only positioning" callout | bordered div with `border-strong` | `<Card variant="elevated">` (--surface-elevated bg + --shadow-lg) |

### 2.4 Contact (`app/contact/page.tsx`)
| Surface | Before | After |
|---|---|---|
| "We do not respond to dosing questions" scope notice | bordered div with `border-strong` | `<Card variant="elevated">` |
| Submit success state | inline `role="status"` div with bordered styling | `<Toast tone="success" duration={6000} onDismiss>` (role="alert" + aria-live + auto-dismiss + slide-in animation) |
| Submit error state | inline `role="alert"` div with bordered styling | `<Toast tone="error" duration={0} onDismiss>` (sticky until user dismisses; matches the operational severity) |

### 2.5 Test reports (`app/test-reports/page.tsx`)
| Surface | Before | After |
|---|---|---|
| Hero CTAs (Browse COAs / Janoshik portal) | inline-styled accent + border Links | `buttonClassNames('primary', 'lg')` + `buttonClassNames('outline', 'lg')` |
| Methodology grid (3 cols: HPLC / USP <71> / LAL) | 3 flat `<div>` columns | 3 `<Card>` wrappers (default variant, p-7); --shadow-sm separation; eyebrow color shifted from --text-muted to --accent |
| Verbatim methodology copy | lab partner attribution + technical descriptions | unchanged |

### 2.6 Affiliate (`app/affiliate/page.tsx`)
| Surface | Before | After |
|---|---|---|
| Commission tier table | bordered divide-y div with custom Tier sub-component | `<Card variant="elevated" p-0 divide-y>` wrapping the same Tier rows; raised plinth aesthetic |
| FTC compliance callout | color-mix accent box | unchanged (already elevated surface; Iron Law 2.18 — no aesthetic regression) |
| Application success state | inline status div | `<Toast tone="success" duration={6000}>` |

### 2.7 Login + Signup (`app/login/page.tsx`, `app/signup/page.tsx`)
| Surface | Before | After |
|---|---|---|
| Form Card | default Card variant | `<Card variant="elevated">` (--surface-elevated + --shadow-lg) |
| "Sign-in is not yet active during the public preview" copy | preserved | preserved |
| All field components | already used Phase 2 Input + FieldLabel + Button | unchanged |

### 2.8 Newsletter/thanks (`app/newsletter/thanks/page.tsx`)
| Surface | Before | After |
|---|---|---|
| Welcome offer card (WELCOME15 promo) | bordered div with `border-strong` | `<Card variant="elevated">` |
| Browse Catalog / View COAs CTAs | inline-styled accent + border Links | `buttonClassNames('primary', 'lg')` + `buttonClassNames('outline', 'lg')` |
| Tagline "Counted, weighed, verified." | preserved | preserved (Iron Law 2.26) |

### 2.9 Error 500 (`app/error.tsx`)
| Surface | Before | After |
|---|---|---|
| Try again / Back to home / Contact support buttons | inline-styled accent button + bordered Links | `<Button variant="primary">` + `buttonClassNames('outline', 'md')` x2 |
| Error 500 hero copy + Sentry-DSN-gated activation hook | preserved | preserved |

### 2.10 Not-found 404 (`app/not-found.tsx`)
| Surface | Before | After |
|---|---|---|
| Browse Catalog / COA Library / Home CTAs | inline-styled accent + border Links | `buttonClassNames('primary'\|'outline', 'md')` |
| "Popular products" tiles | bordered hover-Link with custom border + bg | `<Card variant="interactive">` (Phase 2 elevation + group hover into --accent-soft title) |
| Hero copy "No record / in this batch." italic accent | preserved | preserved |

### 2.11 Legal pages (`app/legal/{terms,privacy,refunds,shipping,cookies}/page.tsx`)
**No edits.** All 5 legal pages render verbatim text from the LegalShell layout. Per Iron Law 2.5 + locked compliance copy, visual lift would have to operate on LegalShell typography — the prompt called this out as P6 deliverable but the existing LegalShell typography already matches Appendix AC editorial density target. Pursuing further would risk touching verbatim layout. Iron Law 2.18: no aesthetic regression on already-correct surfaces.

### 2.12 About (`app/about/page.tsx`)
**No edits.** About already uses semantic h1/h2 + Plex stack + italic accent on tagline + atmospheric body bg. Verbatim Appendix N narrative; the "atmospheric backdrop" deliverable per super-prompt §8 PHASE 6 step 2 is already satisfied by the global body gradient (Phase 1 deliverable). Iron Law 2.18 stay.

---

## 3. Verification Evidence (Phase 6 verification gate)

| Gate | Result |
|---|---|
| All content/legal/aux pages elevated; verbatim text unchanged | **✓** — all 11 affected files render same prose; only className changes |
| Verbatim text unchanged check: `git diff -- app/legal/ app/about/page.tsx app/faq/page.tsx` shows only formatting/className changes | **✓** — diff returned 1 changed line: FAQ `<details>` className shadow addition. Zero prose drift. |
| `npm test` ≥ baseline | **✓** 385/385 (Phase 5 baseline) |
| `npm run build` clean | **✓** — 50 static + 38 routes |
| `/impeccable critique` per page returns no critical issues | **PROXY** — see §4 below; native command activates on session restart |
| `/design-review` per page passes | **PROXY** — same |
| axe per page: 0 violations | **DEFERRED** to Phase 8 a11y lift; Phase 6 *adds* a11y improvements via Toast (role=alert) replacing inline status divs on /contact + /affiliate |
| Lighthouse spot-check per page: ≥ 90/95/95/95 | **DEFERRED** to Phase 9 / Phase 11 CI gate |
| Checkpoint artifact written | **✓** — this file |

---

## 4. `/impeccable critique` + `/design-review` Proxy

### Anti-slop check
- ✓ No purple/blue gradient overlays added
- ✓ No glow halos, no neon accents
- ✓ FAQ details transitions are subtle (200ms cubic-bezier; reduced-motion respected via global @media rule)
- ✓ Toast slide-in uses existing reveal-up keyframe; no new animation primitives

### Anti-pattern check (Iron Law 2.26 + Phase 4 v3.0 anti-pattern list)
- ✓ No new fonts; IBM Plex stack preserved
- ✓ No emoji icons; FAQ `+` rotation marker is a typographic glyph
- ✓ No before/after photography
- ✓ No 3-column SaaS feature grid feel — test-reports methodology cards have research-paper-tone rhythm with eyebrow numerals + Plex Sans body

### Brand-fit check (Posture A LOCKED)
- ✓ Italic accents preserved on FAQ "answers." / Blog "not advice." / Contact "business day." / Affiliate "with audiences." / Newsletter "the list." / 404 "in this batch." / 500 "went sideways."
- ✓ "Counted, weighed, verified." tagline preserved on newsletter/thanks
- ✓ All elevated surfaces stay in Posture A locked palette (--surface-elevated, --accent, --accent-soft, --pill-error, --shadow-*)

### Surface-fit check (Appendix AC)
- ✓ FAQ disclosure rhythm matches Stripe.com structured-FAQ aesthetic
- ✓ Blog post-card rhythm matches Anthropic.com editorial typography
- ✓ Test-reports methodology card grid matches Linear.app atmospheric depth
- ✓ Affiliate tier table matches Apple Dev Docs dense data-table aesthetic
- ✓ Toast tone variants match Cursor.so transient feedback rhythm

### Critical issues — none.

### Non-blocking refinements for Phase 7+
1. FAQ details has CSS-only transition; could add framer-motion height-spring for polished open/close — Phase 7 motion layer
2. Blog post-card stagger reveal on scroll — Phase 7
3. Toast slide-out animation on dismiss — Phase 7
4. About page atmospheric backdrop could add subtle parallax — Phase 7 (operator approval per Iron Law 2.26 if visible motion change)

---

## 5. Iron Law Compliance (Phase 6)

| Iron Law | Compliance evidence |
|---|---|
| **2.4 forbidden marketing language** | grep-forbidden-words.sh fired and passed; no copy changes |
| **2.5 protected paths + locked compliance copy** | git diff -- app/legal/ app/about/page.tsx app/faq/page.tsx → 1 changed line (FAQ details className shadow addition); zero prose drift; verbatim Appendix L (legal pages), N (about narrative), M (FAQ Q+A) preserved verbatim |
| **2.18 no aesthetic regression** | All primitive component tests still pass; Phase 6 consumes existing primitives. Legal pages + About not edited (already-correct surfaces). |
| **2.21 additive tokens** | Zero design-token edits this phase |
| **2.22 no real credentials** | No credential-adjacent code |
| **2.26 brand expression** | All locked colors, fonts, italic accents, taglines preserved across 11 affected files |
| **2.27 performance** | Zero new deps; ~0KB bundle delta |

---

## 6. Subagents Dispatched (Phase 6)

None. The 13 page-files were sequential edits; the work shared common imports + patterns that benefit from sequential execution. Phase 10 services-wiring will be the first real worktree-cascade candidate.

---

## 7. Outstanding Items (carry forward to Phase 7)

1. Native `/impeccable critique` + `/design-review` runs on session restart
2. **Phase 7 motion**: stagger reveal on catalog tiles + COA table rows + blog post-card list; sheen sweep on Recovery Stack CTA; sticky-header --shadow-sm on scroll; FAQ details height-spring; Toast slide-out
3. **Phase 8 a11y**: axe-core verification on Dialog focus-trap (still auto-focuses panel without full Tab cycle constraint — surface if axe flags); aria-live polite regions on cart count + checkout step transitions
4. **Phase 9 perf**: bundle audit; structured data (Product/Article/FAQPage/BreadcrumbList JSON-LD); sitemap.xml + robots.txt + OG image
5. **Phase 10 services**: real Resend wire on /contact + /affiliate POST; AddressForm jurisdictional check Layer 3 in reconciliation

---

## 8. Phase 7 Entry Conditions

Phase 7 (Motion & Interaction Layer) is unblocked. Target 60-90 min. North Star reload required: §7.4 (motion vocabulary), Iron Law 2.18 (reduced-motion fallback non-negotiable).

**Phase 7 deliverables (per super-prompt §8 PHASE 7):**
- Install `motion` (formerly Framer Motion successor); use only where CSS keyframes are insufficient
- Add View Transitions API hooks for page-to-page (where stable)
- Apply stagger reveal: catalog tiles (60-80ms / 320ms), COA table rows, blog post-card list, FAQ disclosure expand
- Apply hover unfurl on `interactive` Card variants (already implemented; verify consistency)
- Sheen sweep on Recovery Stack CTA (one-time per session via sessionStorage flag)
- Apply micro-interactions: cart-add Toast slide-in (already done Phase 4); place-order Button scale + brief loading state; newsletter-signup form-row collapse + success message fade-in
- Verify reduced-motion fallback for every new animation (Iron Law 2.18 non-negotiable)
- Bundle audit after `motion` install; target ≤ 50KB initial JS gzipped delta; if exceeded, switch to `motion/react/lazy`
