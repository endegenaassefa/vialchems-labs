# Mogtrix Production-Launch Master Plan

**Date:** 2026-05-05
**Author:** Brainstormed via `superpowers:brainstorming` against commit `776a854`
**Repo brain:** `/root/mogtrix-website/REPO_BRAIN.md` (full repo context, 314 source files / ~44k lines)
**Status:** Master plan — sub-projects each get their own spec under `docs/superpowers/specs/`

---

## 1. Vision

Mogtrix is the legitimate, scientific peptide research catalog. The category is full of gray-market sites with sketchy compliance theater (see `Context.md` and the journalism workspace modules). Mogtrix wins by being unmistakably real — clinical, technical, premium.

**Visual identity (kept and elevated):**
- Dark backgrounds (#020202) + acid-green accents
- Every product feels like a precision instrument
- Every page reads like a specs sheet from a top-tier lab equipment company
- Reference quality bar: Thermo Fisher × Apple product pages × Bloomberg terminal density

**Motion is the personality:** vials rotate continuously in 3D, hover unfurls technical detail, scroll choreographs the home page, page transitions are crisp. The site is never static.

**Trust signals are features, not friction:** qualification, COA library, MTA gates, RUO attestations are surfaced as confidence builders, not obstacles. The site says "you're in a serious place" — dense, technical, slightly intimidating, deeply trustworthy.

**Audience:** RUO-qualified researchers and scientific buyers. Not consumers. Copy and visual choices should occasionally repel the wrong audience (peptides-for-bodybuilding crowd) — that's a feature, not a bug.

## 2. Approach

**Approach C — design system foundation + subagent-driven vertical slices, single-shot launch.**

1. **Foundation phase** locks the design system and resolves critical backend gaps that block downstream parallelism.
2. **Vertical slices** parallelize across surfaces; each slice is end-to-end (design → backend → frontend → tests → a11y/perf).
3. **Launch operations** (DNS, Stripe live, attorney review, first operator, vector-demo decision) run in their own track from day one.
4. **Convergence** runs the full audit suite, smoke-tests on real prod, then ships.

Single-shot launch — no soft-launch with the current UI. Site goes live to real customers at full polish.

## 3. Decomposition (21 sub-projects)

### Tier 1 — Core build

| # | Sub-project | What it covers |
|---|---|---|
| **A** | Design system foundation | `DESIGN.md`, color tokens, type scale, spacing scale, motion vocabulary, base components (Button, Card, Pill, Input, Tabs, etc.), accessibility floor |
| **B** | Backend completion | Replace legacy admin passcode with Supabase admin auth; reconcile `seed.sql` ↔ migration 6 drift; spec server-owned cart; RLS audit; env-var hygiene; Sentry/health-check hardening |
| **C** | Home reimagining | Scroll-driven hero, 3D vial scene upgrade, scientific specs as content, motion-rich proof points |
| **D** | Product detail (instrument page) | Rotating 3D vial, COA, sequence, structure diagram, batch lookup, sourcing chain, hover-driven detail |
| **E** | Shop / catalog | Qualified grid (rich cards) + public preview that converts to qualification |
| **F** | Qualification flow | Feels like clearance, not a form — staged motion, scientific framing |
| **G** | COA + verify (flagship trust feature) | Library + batch lookup elevated to a hero feature, not a utility page |
| **H** | Cart + checkout | Server-owned cart (no localStorage-only), polished checkout, motion polish |
| **I** | Account / orders | Tracking-style timeline, technical detail, real-time status |
| **J** | Ops dashboard polish | Operator surfaces brought to production grade |
| **K** | New scientific surfaces | NEW: `/about`, `/methods`, `/standards` — communicate legitimacy |
| **L** | Marketing landing variants | NEW: sourcing-channel landings, technical content seed |
| **M** | Legal pages polish | Visual treatment + attorney review prep for `/legal/*` |

### Tier 2 — Launch operations

| # | Track | What it covers |
|---|---|---|
| **N** | DNS + Vercel domain | Fix "Invalid Configuration" on `mogtrix.bio` and `www.mogtrix.bio` |
| **O** | Stripe live + tax | Sandbox → live keys, Stripe Tax enabled, webhook secrets in Vercel Production |
| **P** | Attorney legal review | Every page under `/legal` reviewed and signed off by qualified counsel |
| **Q** | First operator + ops runbook | First staff promotion, runbook for queue handling, escalation paths |
| **R** | Vector-demo decision | Strip / hide / document `vector-bio-supply-demo/` (currently local-only) |

### Tier 3 — Convergence

| # | Gate | What it covers |
|---|---|---|
| **S** | Full audit suite | `/qa`, `/design-review`, `/benchmark`, `/cso`, `/security-review`, `/health`, `/devex-review` |
| **T** | Smoke + first real order | First operator activation, real Stripe order end-to-end, refund test, `/canary` deploy monitoring |
| **U** | Documentation + ship | `/document-release`, README/CHANGELOG/ARCHITECTURE/CLAUDE.md updates, `/ship` + `/land-and-deploy` |

## 4. Sequencing

```
Phase 1 — Foundation (sequential, blocks all of Phase 2)
  ├─ A. Design system foundation
  └─ B. Backend completion (parallel with A)

Phase 2 — Vertical slices (parallel after Phase 1; subagent dispatch)
  ├─ C. Home reimagining
  ├─ D. Product detail
  ├─ E. Shop / catalog
  ├─ F. Qualification flow
  ├─ G. COA + verify
  ├─ H. Cart + checkout
  ├─ I. Account / orders
  ├─ J. Ops dashboard polish
  ├─ K. New scientific surfaces
  ├─ L. Marketing landing variants
  └─ M. Legal pages polish

Phase 3 — Launch operations (parallel from day 1)
  ├─ N. DNS + Vercel domain
  ├─ O. Stripe live + tax
  ├─ P. Attorney legal review (queue early — external)
  ├─ Q. First operator + ops runbook
  └─ R. Vector-demo decision

Phase 4 — Convergence (after all above)
  ├─ S. Full audit suite
  ├─ T. Smoke + first real order
  └─ U. Documentation + ship
```

**Pacing:** No artificial deadlines — "ship when it's right." Phase 3 has external blockers (P, O); start them on day 1 so they don't gate Phase 4.

## 5. Per-sub-project lifecycle (skill stack)

### Pattern A — Visual / design-heavy (A, C, D, E, F, G, H, I, J, K, L, M)

14-step loop:

1. `superpowers:brainstorming`
2. Visual exploration — visual companion mockups + `/design-shotgun` (variants) + `/design-consultation` (sub-project A only)
3. Write spec to `docs/superpowers/specs/YYYY-MM-DD-<name>-design.md`
4. `/autoplan` — runs CEO/Design/Eng/DX reviews with auto-decisions, surfaces taste decisions at a final gate
5. `superpowers:writing-plans`
6. `superpowers:using-git-worktrees`
7. `superpowers:test-driven-development`
8. `superpowers:subagent-driven-development` + `superpowers:dispatching-parallel-agents`
9. `superpowers:verification-before-completion`
10. `superpowers:requesting-code-review` → `/review` + `/codex review`
11. Specialized audits — `/design-review` + `/qa` + `/benchmark` + `/devex-review`
12. `/design-html` for finalization where applicable
13. `superpowers:finishing-a-development-branch`
14. `/ship` → `/land-and-deploy` → `/canary` → `/document-release`

### Pattern B — Backend / infra (B)

Same as A with design steps replaced:

- Steps 1, 3 same
- 4: `/autoplan` + `/cso` + `supabase-postgres-best-practices` skill
- 5–9 same
- 10–11: `/review` + `/codex challenge` (adversarial) + `/security-review` + `/cso`
- 12 N/A
- 13–14 same

### Pattern C — Operational tracks (N, O, Q, R)

- Brief inline plan, no spec
- Execute with `superpowers:verification-before-completion`
- Document in CHANGELOG / ops runbook
- `/careful` mode for prod-touching steps

### Pattern D — External dependency (P)

- Prepare review packet (every `/legal/*` page diffed and annotated)
- Send + queue
- Track status; integrate sign-off when received; bump `legalVersion` in `lib/content/site.ts`

### Pattern E — Convergence gates (S, T, U)

After all Tier 1 + Tier 2 done:

- **S:** parallel-dispatch every audit skill, fix any blocker
- **T:** smoke test on real prod
- **U:** `/document-release` + final `/ship` + `/land-and-deploy`

### Ambient practices

- `/careful` mode during prod-touching steps
- `/freeze` to scope edits when subagents are running
- `superpowers:investigate` for any bug — root cause first, no shortcuts
- `superpowers:receiving-code-review` when integrating feedback
- `/context-save` between sessions; `/context-restore` to resume
- `superpowers:learn` automatic project memory across sessions

## 6. Launch readiness checklist (Phase 4 gate)

A launch is GO only when ALL of these are green:

### Technical
- [ ] `/health` ≥ 9/10 composite score
- [ ] `npm run verify` green (test + build + e2e)
- [ ] `/qa` green or only cosmetic items remaining
- [ ] `/design-review` green
- [ ] `/benchmark` within budget — LCP < 2.5s, CLS < 0.1, INP < 200ms; page size budgets met
- [ ] `/cso` daily-mode + comprehensive run both green
- [ ] `/security-review` green
- [ ] `/canary` baseline established
- [ ] All Sentry beacons clean for 24h on staging

### Business
- [ ] Attorney sign-off received for every `/legal/*` page (P)
- [ ] DNS green for `mogtrix.bio` and `www.mogtrix.bio` (N)
- [ ] Stripe live keys + tax enabled in Vercel Production (O)
- [ ] First operator activated, ops runbook signed off (Q)
- [ ] Vector-demo decision executed (R)
- [ ] One real Stripe sandbox purchase end-to-end visible in `/account/orders/[id]` AND `/ops` (T)
- [ ] One failed/expired Stripe sandbox payment processed correctly (T)
- [ ] Real test order processed end-to-end with first operator handling it (T)

### Compliance
- [ ] `lib/compliance.ts` `assertMarketingCopySafe` guard fires on every public surface
- [ ] No marketing copy violates the guardrail
- [ ] No prices / medical claims / dosing on public preview pages
- [ ] Hosted checkout limited to qualified buyers, US-only, `checkout_enabled` SKUs only

### Documentation
- [ ] `DESIGN.md` exists and matches shipped UI
- [ ] `ARCHITECTURE.md` exists and matches shipped backend
- [ ] CHANGELOG bumped
- [ ] CLAUDE.md updated with deploy config and ops runbook references

## 7. Definition of Done

Mogtrix is "100% production-grade, ready for the people" when:

1. All 21 sub-projects shipped
2. Every checkbox in §6 green
3. The home page loads at `https://mogtrix.bio`, 3D vials rotate, a qualified user can complete a full purchase, a staff operator can ship that order, and the customer sees their order in `/account/orders` end-to-end

## 8. Open per-sub-project decisions

Surfacing now so they're flagged when each sub-project is brainstormed:

- **A (Design system):** Final color palette refinement (current: #020202 + acid-green) — keep exact or refine? Type pairing — keep current or pick a scientific-grade pairing (e.g., Berkeley Mono / IBM Plex / GT America)?
- **B (Backend):** Server-owned cart shape — extend `orders` table with a `cart` status, or new `carts` table? Migration timing for legacy localStorage cart users?
- **C (Home):** Hero copy — keep current "Reference-grade peptides for research" or rewrite? Order of proof points?
- **D (Product detail):** Structure diagram — render server-side from sequence, or use static SVG per product?
- **E (Shop):** Public preview — show all 15 products or only the 5 pilot SKUs?
- **G (COA):** Make verify a public route or qualified-only?
- **H (Cart):** Same-device cart limitation — keep + document, or full server-owned cart?
- **K (New surfaces):** `/about` content — founder story, lab tour, methodology? `/methods` — analytical methods detail? `/standards` — compliance + RUO posture?
- **L (Marketing):** Which sourcing channels need their own landing? Technical blog — start with what content?
- **R (Vector-demo):** Strip from repo, hide behind feature flag, or move to private investigations repo?

## 9. Skill stack reference

### Superpowers
- `using-superpowers` (bootstrap, always loaded)
- `brainstorming` ← active for master plan + every sub-project
- `writing-plans` ← after each sub-project spec
- `writing-skills` (only if creating new skills)
- `using-git-worktrees`
- `test-driven-development`
- `subagent-driven-development`
- `dispatching-parallel-agents`
- `verification-before-completion`
- `requesting-code-review`
- `receiving-code-review`
- `executing-plans`
- `finishing-a-development-branch`
- `systematic-debugging` (for bugs)
- `investigate` (for root-cause work)

### gstack
- **Planning:** `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/plan-devex-review`, `/autoplan`, `/office-hours`
- **Design:** `/design-consultation`, `/design-shotgun`, `/design-html`, `/design-review`
- **QA / Audit:** `/qa`, `/qa-only`, `/design-review`, `/benchmark`, `/cso`, `/security-review`, `/health`, `/devex-review`, `/landing-report`
- **Code review:** `/review`, `/codex` (review/challenge/consult)
- **Browser:** `/browse`, `/connect-chrome`, `/setup-browser-cookies`
- **Shipping:** `/ship`, `/land-and-deploy`, `/canary`
- **Ops:** `/document-release`, `/retro`, `/learn`
- **Posture:** `/careful`, `/freeze`, `/unfreeze`, `/guard`
- **Session:** `/context-save`, `/context-restore`
- **Domain:** `supabase`, `supabase-postgres-best-practices`

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Visual drift across surfaces if subagents work in parallel without locked design system | Phase 1 (A) MUST complete before Phase 2 starts. Design system tokens + base components are non-negotiable upfront work. |
| Backend gaps surface during Phase 2 work | Phase 1 (B) addresses critical gaps before parallel slices begin |
| Attorney review delays Phase 4 | Queue P on day 1; legal-page polish (M) prepares the packet early |
| DNS misconfiguration at launch | Test on `site-omega-three-59.vercel.app` until DNS green; canary pattern at switchover |
| Stripe live transition errors | Run full sandbox end-to-end smoke test before flipping; Stripe Tax must be enabled BEFORE first live charge |
| Vector-demo accidentally deployed | Vercel only builds `site/`; reinforce with `vercel.json` + repo-level guardrail |
| seed.sql vs migration 6 drift in production | Sub-project B reconciles before launch; verify by querying `public.products` against canonical |
| Subagent context divergence | Each sub-project gets its own spec + worktree; subagents read the spec, not raw conversation |
| Performance regression from heavy motion | `/benchmark` budget enforced per-surface; motion uses CSS / transform / will-change, not layout-thrashing JS |
| Accessibility regression from rich visual surfaces | `/design-review` per surface; reduced-motion media query honored throughout |

## 11. Sub-project index

Sub-project specs will be added to `docs/superpowers/specs/` as they're brainstormed. Index updated here as we go.

| # | Sub-project | Spec path | Status |
|---|---|---|---|
| A | Design system foundation | (TBD) | Not started |
| B | Backend completion | (TBD) | Not started |
| C | Home reimagining | (TBD) | Not started |
| D | Product detail | (TBD) | Not started |
| E | Shop / catalog | (TBD) | Not started |
| F | Qualification flow | (TBD) | Not started |
| G | COA + verify | (TBD) | Not started |
| H | Cart + checkout | (TBD) | Not started |
| I | Account / orders | (TBD) | Not started |
| J | Ops dashboard polish | (TBD) | Not started |
| K | New scientific surfaces | (TBD) | Not started |
| L | Marketing landing variants | (TBD) | Not started |
| M | Legal pages polish | (TBD) | Not started |
| N | DNS + Vercel domain | (inline, no spec) | Not started |
| O | Stripe live + tax | (inline, no spec) | Not started |
| P | Attorney legal review | (inline, no spec) | Not started |
| Q | First operator + runbook | (inline, no spec) | Not started |
| R | Vector-demo decision | (inline, no spec) | Not started |
| S | Full audit suite | (convergence — no spec) | Not started |
| T | Smoke + first real order | (convergence — no spec) | Not started |
| U | Documentation + ship | (convergence — no spec) | Not started |

## 12. Next action

Begin sub-project A (design system foundation) via `superpowers:brainstorming` → spec → `/autoplan` → `superpowers:writing-plans` → execute. Visual companion comes online for design-system mockups. Sub-project B (backend completion) brainstormed in parallel since it's text-heavy and unblocks H (cart + checkout).
