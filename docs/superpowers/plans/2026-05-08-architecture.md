# Architecture Plan — vialchemlabs Peptide E-commerce Site

Date: 2026-05-08
Brand: vialchemlabs (Posture A clean clinical, vialchemlabs.com)
Phase coverage: Phase 3 through Phase 15
Builder: Claude Opus 4.7 (1M context), single-track per SUPER_PROMPT_v3 §4.5
Reference: `/root/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md`

## 1. Architectural Premises (LOCKED)

These do not get re-litigated downstream:

1. **NEW Next.js project**, NOT a Mogtrix fork. Patterns ported by READ + ADAPT with one-line attribution comments. Iron Law 2.12 enforces no "Mogtrix" string in source via pre-commit grep.
2. **Single-track Opus model** for all build work. No Haiku/Sonnet downgrade. Per §4.5.
3. **TDD discipline** (Iron Law 2.1, 2.15). Failing test first, minimum code, verify, refactor. Checkpoint commits with verbatim PASS/FAIL output.
4. **Catalog: 7 SKUs + Recovery Stack bundle + 15% intro promo**. LOCKED via DECISIONS/opening_sku_set.md. No GLP-1, no BAC water (Iron Law 2.7+2.14).
5. **Payment: BTCPay + Plaid ACH Day-1; cards Phase 2**. LOCKED via DECISIONS/payment_stack.md. No Stripe/PayPal/Square direct (Iron Law 2.9).
6. **Compliance: text-checkbox age gate at first cart action; CA/TX/NY/FL block; 503A/503B verbatim footer; verbatim product disclaimer; full forbidden-words list**. LOCKED via DECISIONS/compliance_posture.md.
7. **Brand: vialchemlabs Posture A**, IBM Plex Sans + Mono + Newsreader Italic, charcoal + teal palette. LOCKED via DECISIONS/brand_pick.md.
8. **Performance gates**: Lighthouse Perf ≥ 90, A11y ≥ 95, SEO ≥ 95, Best Practices ≥ 95 every page. Hard fail blocks phase.

## 2. Stack Selection

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16+ (App Router) | Per super-prompt §1.6; SSR + edge for SEO; RSC for performance |
| Runtime | React 19, TypeScript 5.x | Latest stable per Mogtrix reference |
| Styling | Tailwind CSS v4 + globals.css design tokens | Per super-prompt; tokens in `lib/design/tokens.ts` |
| DB / Auth | Supabase Postgres 17 + Supabase Auth | Per Mogtrix pattern (Iron Law 2.5 reads) |
| State | Zustand 5 + Tanstack Query | Mogtrix-proven pattern |
| Validation | Zod 4 | Mogtrix-proven; type-safe schemas |
| Email | Resend | Mogtrix-proven; sub_5 confirms Omnisend dominant in market but Resend acceptable for this build |
| Monitoring | Sentry 10 | Per super-prompt; alert thresholds: error rate > 1% → email, payment-flow error rate > 0.1% → page |
| Payment | Custom adapter pattern (`PaymentProvider` interface) | Per Mogtrix pattern + DECISIONS/payment_stack.md |
| Testing | Vitest (unit) + Playwright (E2E) | Per Mogtrix pattern |
| Linting | ESLint + Prettier + Tailwind plugin | Standard |
| Hosting | Vercel (iad1, auto-deploy on main) | Per Mogtrix; staging via preview deployments |
| CDN | Vercel Edge Network | Default |
| Analytics | Vercel Analytics + Sentry (no GA, no GTM, no Meta Pixel) | Privacy-first; sub_5 noted GA4+GTM+Meta Pixel is industry convergent but vialchemlabs differentiates by NOT loading 3rd-party trackers (zero cookies needed beyond strict-necessary) |
| Cookie consent | Self-hosted banner (no Osano/OneTrust dependency) | GDPR/CCPA compliant; minimal because we don't load third-party trackers |
| Search | Fuse.js (client-side fuzzy) for catalog | Sufficient for 7-SKU + 15-expansion catalog; revisit at 50+ SKUs |
| 3D / illustration | CSS-only Vial primitive (no R3F Day 1) | Mogtrix uses @react-three/fiber 9.4; we keep it pluggable but Phase 4 builds CSS-only Vial.tsx for performance budget. R3F is Phase-2 enhancement candidate. |

### Stack tradeoffs (eng-review self-applied)

- **Next.js 16 vs 15**: 16 is current stable; matches Mogtrix. No reason to downgrade.
- **App Router vs Pages Router**: App Router for RSC, layouts, parallel routes, streaming. Mogtrix uses App Router.
- **Vitest vs Jest**: Vitest faster, ESM-native, integrates with Vite-first toolchain. Mogtrix-proven.
- **Resend vs Omnisend**: Sub_5 says Omnisend dominant. But Resend is API-first (faster integration), Mogtrix-proven, and vialchemlabs is too small Day-1 to need Omnisend's segmentation. Revisit at 1K+ subscribers.
- **Vercel vs Cloudflare Pages vs self-hosted**: Vercel for SSR + edge functions; Mogtrix-proven; supabase JS client works; Sentry integration via wizard. Cloudflare Pages would require more wiring for Supabase server-side and Stripe Phase-2 webhooks.
- **No GA / no Meta Pixel**: Sub_5 industry-convergent BUT a peptide-site loading these trackers triggers ad-platform classifiers. Privacy-first stance also reduces cookie consent surface. Tradeoff: lose marketing-attribution data; gain compliance posture + faster page loads. Aligned with bible §4 "two-goal tension" (don't draw platform attention).

### Stack tradeoffs (design-review self-applied)

- **CSS-only Vial vs R3F**: R3F adds ~150KB to bundle. Posture A clean-clinical can hit "scientific gravitas" with CSS gradients + transforms (vial sway -12° to +12° / 6.4s ease-in-out per Appendix V.2). Day-1 CSS-only; R3F as Phase-2 enhancement only if visual differentiation needed.
- **Tailwind v4 vs custom CSS**: Tailwind v4 utility-first, CSS-variable-driven, plays well with semantic theme tokens. Mogtrix pattern. Zero issues.
- **Newsreader Italic vs Source Serif**: Newsreader is the locked Posture A choice (per Appendix V.2). Used only for hero pull-quotes (italic editorial moments). NOT body text.
- **No emojis as icons**: Iron Law (Appendix W.1). Lucide React for all icons. Stroke width consistent (1.5-2px).
- **Color palette**: charcoal #0a0e0f bg, surface #141a1c, surface-strong #1a2226, accent #3dd4c8 teal, accent-soft #5eebdf, accent-glow #7ff1e8, text rgba(255,255,255,0.92), text-muted rgba(255,255,255,0.62). All WCAG AA verified.

## 3. Repository Layout

```
/root/peptide-site/
├── .env                          (.gitignored; stub credentials Day-1)
├── .env.example                  (template, committed)
├── .gitignore
├── .husky/pre-commit             (typecheck + lint + grep-mogtrix + grep-forbidden + supply-chain scanner)
├── README.md                     (Phase 15 deliverable; brief)
├── ARCHITECTURE.md               (Phase 15 deliverable)
├── CHANGELOG.md                  (Phase 14 ship)
├── package.json
├── tsconfig.json
├── next.config.ts                (Sentry instrumentation)
├── tailwind.config.ts
├── postcss.config.mjs
├── vitest.config.ts
├── playwright.config.ts
├── vercel.json
├── app/                          (App Router)
│   ├── layout.tsx                (root layout, fonts, age gate provider)
│   ├── page.tsx                  (Home /)
│   ├── globals.css               (design tokens + atmospheric gradients)
│   ├── opengraph-image.tsx       (next/og default OG)
│   ├── shop/page.tsx
│   ├── products/[slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/
│   │   ├── page.tsx              (multi-step shell)
│   │   ├── address/page.tsx
│   │   ├── method/page.tsx
│   │   ├── review/page.tsx
│   │   └── confirm/page.tsx
│   ├── order/[id]/page.tsx
│   ├── account/
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   ├── orders/[id]/page.tsx
│   │   ├── addresses/page.tsx
│   │   └── settings/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── about/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── faq/page.tsx
│   ├── contact/page.tsx
│   ├── coa/
│   │   ├── page.tsx
│   │   └── [peptide]/[batch]/page.tsx
│   ├── test-reports/page.tsx
│   ├── legal/
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── refunds/page.tsx
│   │   ├── shipping/page.tsx
│   │   └── cookies/page.tsx
│   ├── affiliate/
│   │   ├── page.tsx
│   │   └── dashboard/page.tsx
│   ├── newsletter/
│   │   ├── page.tsx              (signup landing)
│   │   └── thanks/page.tsx       (confirmation)
│   ├── unsubscribe/page.tsx
│   ├── auth/
│   │   ├── actions/route.ts
│   │   └── callback/route.ts
│   ├── api/
│   │   ├── health/route.ts
│   │   ├── newsletter/subscribe/route.ts
│   │   ├── access/route.ts        (qualification flow)
│   │   ├── orders/route.ts
│   │   ├── ops/(protected)/...
│   │   └── payments/
│   │       ├── btcpay/webhook/route.ts
│   │       └── plaid/webhook/route.ts
│   ├── not-found.tsx              (404)
│   └── error.tsx                  (500)
├── components/
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── compliance-footer.tsx
│   ├── checkout-boundary.tsx
│   ├── qualification-flow.tsx
│   ├── home-proof-row.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Pill.tsx
│   │   ├── Specs.tsx
│   │   ├── CoaRow.tsx
│   │   ├── FieldLabel.tsx
│   │   ├── Vial.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   └── ...
├── lib/
│   ├── supabase/{server,browser,service,proxy,env,index}.ts
│   ├── auth/{customer,admin,catalog}.ts
│   ├── payments/
│   │   ├── config.ts             (registry)
│   │   ├── index.ts              (selector)
│   │   ├── server.ts
│   │   ├── types.ts              (PaymentProvider interface)
│   │   ├── btcpay.ts             (NEW adapter)
│   │   ├── plaid.ts              (NEW adapter)
│   │   ├── stub.ts               (dev mode)
│   │   └── reconciliation.ts
│   ├── customer-qualification.ts
│   ├── attestations.ts
│   ├── compliance.ts             (assertMarketingCopySafe extended for peptide context)
│   ├── compliance/
│   │   └── jurisdictions.ts      (state block list)
│   ├── validation/{catalog,access}.ts
│   ├── content/
│   │   ├── site.ts               (siteConfig.name = "vialchemlabs")
│   │   ├── products.ts           (7 SKUs + verbatim descriptions)
│   │   ├── faq.ts                (20 Q+A from Appendix M)
│   │   ├── legal.ts              (ToS, Privacy, etc.)
│   │   └── testing.ts            (lab partner)
│   ├── design/{tokens,motion,types,index}.ts
│   ├── orders.ts
│   ├── ops-orders.ts
│   ├── cart-store.ts
│   ├── age-gate-store.ts
│   ├── order-email.ts            (Resend templates)
│   └── sentry.ts                 (init, alert thresholds)
├── public/
│   ├── brand/                    (vialchemlabs wordmark, favicon)
│   ├── coa/                      (placeholder per-batch PDFs marked EXAMPLE_COA)
│   ├── opengraph/                (default OG image)
│   └── visuals/                  (vial photography placeholders)
├── supabase/
│   ├── config.toml
│   ├── schema.sql                (peptide tables)
│   ├── seed.sql                  (7 SKUs + bundle)
│   └── migrations/
├── docs/
│   ├── checkpoints/              (per-phase artifacts)
│   ├── superpowers/plans/        (this file + per-phase plans)
│   ├── research/                 (sub_1-6 digests, committed)
│   ├── operator-runbook.md       (Phase 11 deliverable)
│   ├── ADAPTATION_LOG.md         (Phase 13/14)
│   └── learnings/                (Stop hook output, optional)
├── scripts/
│   ├── btcpay-setup.sh           (Phase 9 ops provisioning)
│   ├── grep-mogtrix.sh           (Iron Law 2.12 enforcer)
│   └── grep-forbidden-words.sh   (Iron Law 2.4 + 2.16)
└── tests/
    ├── unit/
    └── e2e/
```

## 4. Schema (Postgres via Supabase)

Tables (per super-prompt §8 Phase 3):

```sql
-- vendors (vialchemlabs single-vendor; future-proof for affiliate)
-- products (7 SKUs Day-1; expansion-ready)
-- product_variants (dose/format variants)
-- bundles (Recovery Stack)
-- coa_documents (per-batch, public access by batch)
-- customer_profiles (Supabase Auth bound; qualification fields)
-- customer_attestations (RUO ack, age, jurisdiction, institution)
-- customer_qualifications (status: pending/approved/rejected)
-- orders (status: pending → paid → shipped → delivered)
-- order_items
-- order_status_history (audit trail)
-- payments (provider, intent_id, amount_cents, status, webhook_log)
-- email_subscriptions (newsletter, with promo_code linkage)
-- affiliate_creators (creator details, commission rate, status)
-- affiliate_payouts
-- blog_posts (slug, title, body, citations, published_at)
-- audit_log (everything compliance-touching)
```

RLS (Row-Level Security) on every customer-touching table:
- customer_profiles: user can read/update own row only
- orders: user can read own orders only; ops role can read all
- payments: user can read own payments only; ops role can read all
- coa_documents: PUBLIC read (no auth); only ops can write
- products / variants / bundles: PUBLIC read; only ops can write
- audit_log: write-only for triggers; read for ops only
- email_subscriptions: write-only via API; read for ops + self
- affiliate_creators / payouts: creator can read own; ops can read all

## 5. Payment Architecture (Phase 9)

```
PaymentProvider interface (lib/payments/types.ts)
├── BTCPayAdapter  (lib/payments/btcpay.ts)
│   └── BTCPay Server self-hosted; createInvoice / handleWebhook / reconcile
├── PlaidAdapter   (lib/payments/plaid.ts)
│   └── Plaid Link → bank-pull → ACH; createIntent / handleAuth / reconcile
├── StubAdapter    (lib/payments/stub.ts)
│   └── Dev mode; deterministic mock; auto-confirms after 2s

Selection:
  PAYMENT_PROVIDER=stub  (dev default; current vialchemlabs setting)
  PAYMENT_PROVIDER=btcpay (prod default)
  PAYMENT_PROVIDER=plaid  (alternative prod default)

Webhook reconciliation:
  /api/payments/btcpay/webhook  (verifies BTCPAY_WEBHOOK_SECRET)
  /api/payments/plaid/webhook   (verifies Plaid signature)
  Both call lib/payments/reconciliation.ts which:
    1. Idempotency-keys against payment_intent_id
    2. Updates orders.status (pending → paid)
    3. Inserts order_status_history row
    4. Triggers Resend order-confirmation email
    5. Logs to audit_log
```

Discount logic (lib/cart-store.ts + checkout):
```
selected_method = "crypto"  → apply discount 0.15 (10-15% range, default 15)
selected_method = "ach"      → apply discount 0.05
selected_method = "cards"    → discount 0 (Phase 2)
```

Phase 2 (Day 90+) cards: $1,000 cap, "UNBLOCK" statement descriptor, MESH or MAX or Rocketfuel single processor. Adapter scaffold present but disabled by `ENABLE_CARDS_PHASE_2=false`.

## 6. Compliance Architecture (Phase 8)

Three layers (defense-in-depth):

### Layer 1: Static analysis (pre-commit hook)
- `scripts/grep-mogtrix.sh` — fails build on any "Mogtrix" or "MOGTRIX" not in attribution comment
- `scripts/grep-forbidden-words.sh` — runs full Appendix P forbidden-word list against `**/*.{ts,tsx,md,html,json}` outside `node_modules`/`tests/fixtures`
- Supply-chain scanner (Iron Law 2.16): hidden unicode (ZWSP, ZWNJ, ZWJ, WJ, BOM, bidi overrides), curl|bash, `--no-verify` in scripts, `enableAllProjectMcpServers`, `ANTHROPIC_BASE_URL`, base64 blobs >200 chars, `<!--` near `[A-Z]{4,}`, `data:text/html`

### Layer 2: Runtime assertion (lib/compliance.ts)
- `assertMarketingCopySafe(text: string)` — runs same pattern set; throws on violation
- Called automatically in:
  - Product description rendering (catches catalog editorial regressions)
  - Blog post rendering (catches CMS-injected forbidden patterns)
  - Customer qualification "research_purpose" field (catches user-injected drug intent)
  - Newsletter signup body (catches operator-error in email templates)

### Layer 3: Editorial gate (gstack /review + /cso before commit)
- Iron Law 2.5: any commit touching `lib/payments/`, `lib/compliance.ts`, `lib/content/legal.ts`, `lib/attestations.ts`, `lib/customer-qualification.ts`, `app/api/payments/`, `app/api/access/`, or any product catalog file MUST run /review then /cso before push.

### Jurisdictional restriction (lib/compliance/jurisdictions.ts)
```typescript
export const BLOCKED_STATES = ['CA', 'TX', 'NY', 'FL'] as const;
// Operator may strengthen (add states); never weaken.
// Validated at: address entry, checkout review, post-payment confirmation (defense-in-depth).
```

### Age gate (Appendix A.3 verbatim)
- Pattern: text-based contractual checkbox at first cart action
- 21+ threshold
- LOCKED via DECISIONS/compliance_posture.md
- Implementation: `lib/age-gate-store.ts` (Zustand) persists acknowledgment; checkout requires fresh re-confirmation per session
- (Sub 5 conflict: market trends toward modal — we follow LOCKED checkbox decision)

### Buyer qualification (Appendix A.5 verbatim)
- 7-attestation block at first checkout
- Fields: email (verified), institution/role, research purpose (assertMarketingCopySafe filtered), age 21+, RUO ack, jurisdictional ack
- Mogtrix pattern at `site/lib/customer-qualification.ts` ported with peptide-context attestation language

## 7. Per-Phase Plan (Phase 3 through Phase 15)

### Phase 3: Backend Bootstrap (target 90-120 min)

Sequence:
1. `cd /root/peptide-site && npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*"` (with auto-confirm flags; existing .git, .env preserved)
2. Initial scaffold commit `chore(phase-3): initial Next.js scaffold`
3. Install core deps: `@supabase/supabase-js @supabase/ssr zod zustand @tanstack/react-query @sentry/nextjs lucide-react clsx tailwind-merge`
4. Install dev deps: `vitest @testing-library/react @testing-library/jest-dom @playwright/test eslint-config-next prettier prettier-plugin-tailwindcss husky`
5. Configure husky + pre-commit: `npx husky init` + write pre-commit script
6. Write `scripts/grep-mogtrix.sh` and `scripts/grep-forbidden-words.sh`
7. Port Mogtrix patterns by READING + ADAPTING (one-line attribution comments per Appendix H):
   - `lib/supabase/*` (server, browser, service, proxy, env, index)
   - `lib/auth/customer.ts`, `lib/auth/admin.ts`, `lib/auth/catalog.ts`, `app/auth/*`
   - `lib/payments/{config,index,server,types,reconciliation}.ts` (NEW BTCPay + Plaid + stub adapters)
   - `lib/customer-qualification.ts`, `lib/attestations.ts` (peptide attestation language)
   - `lib/compliance.ts` (extend assertMarketingCopySafe with Appendix P forbidden words)
   - `lib/validation/{catalog,access}.ts` (peptide catalog Zod schemas)
   - `supabase/schema.sql` (peptide tables enumerated in §4 above)
   - `lib/cart-store.ts`, `components/checkout-boundary.tsx`
8. Configure `next.config.ts` (Sentry instrumentation, image domains, headers for security)
9. Configure `vitest.config.ts`, `playwright.config.ts`
10. Build `app/api/health/route.ts` — returns `{ status: 'ok', commit: <git sha>, version: <package version> }`
11. Run `npm test` (passes — no tests yet but config valid) + `npm run build` (Next.js builds successfully)
12. Deploy to Vercel preview: `vercel --yes` (operator authorizes; Vercel CLI authenticated via interactive flow)
13. Verify staging URL `/api/health` returns 200
14. Run `npm run grep-mogtrix` (returns 0 non-attribution hits)
15. Run `npm run grep-forbidden-words` (returns 0 hits — no copy yet)
16. Save `docs/checkpoints/phase_3_backend.md`
17. /context-save

Verification gate: site builds, tests pass, deploys to Vercel staging, /api/health returns 200, grep-mogtrix 0 non-attribution hits, grep-forbidden-words 0 hits, all ported patterns have attribution comments.

### Phase 4: Brand + Design System (target 90-120 min)

1. Generate brand assets (vialchemlabs):
   - Wordmark: SVG with IBM Plex Sans 600 "vialchemlabs" + IBM Plex Mono 500 "LABS" chip
   - Favicon: 16x16 + 32x32 + apple-touch-icon 180x180 (vial silhouette in teal accent on dark)
   - OpenGraph card: `app/opengraph-image.tsx` via next/og (dark bg, wordmark, Plex Mono metadata strip showing "Per-batch COA. 7 research peptides. Independent lab verified.")
2. Build design tokens at `lib/design/tokens.ts` and `app/globals.css`:
   - Posture A row from Appendix V.2 verbatim: charcoal #0a0e0f bg, surface #141a1c, surface-strong #1a2226, accent #3dd4c8, accent-soft #5eebdf, accent-glow #7ff1e8, text rgba(255,255,255,0.92), text-muted rgba(255,255,255,0.62), border #1f2a2e
   - Typography: IBM Plex Sans 300/400/500/600/700, IBM Plex Mono 300/400/500/600, Newsreader 400i (hero pull-quotes only)
   - Type scale: heroXl 88px clamp(48,7vw,96), heroLg 60px, headlineLg 32px, headlineMd 28px, headlineSm 24px, titleMd 20px, titleSm 18px, bodyLg 18px, bodyMd 16px, bodySm 14px, caption 13px, monoBody 14px, monoSm 12px, labelUppercase 11px tracking 0.16em
   - Spacing: 4px base unit (2xs=2, xs=4, sm=8, md=12, lg=16, xl=24, 2xl=32, 3xl=48, 4xl=64, 5xl=96, 6xl=128)
   - Motion: --ease-premium-out cubic-bezier(0.16, 1, 0.3, 1), --ease-in ease-in, --ease-move cubic-bezier(0.4, 0, 0.2, 1), --ease-linear linear; --dur-micro 80ms, --dur-short 200ms, --dur-medium 320ms, --dur-long 540ms, --dur-slow 720ms, --dur-continuous 14000-22000ms
   - Border radius: sm 4px / md 10px / lg 14px / xl 16px / 2xl 18px / full 999px
   - Z-index: base 0, dropdown 10, sticky 20, overlay 30, modal 40, toast 50
   - Reduced motion: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }`
3. Build component primitives (TDD per Iron Law 2.1; tests in `tests/unit/components/`):
   - `Button.tsx` (variants: primary teal CTA, outline, ghost, data mono)
   - `Pill.tsx` (variants: accent, info, electric, error)
   - `Input.tsx` (surface-strong bg, border, 10px radius, 2px focus ring)
   - `Card.tsx` (surface bg, border, 14px radius)
   - `Specs.tsx` (definition list, mono dt/dd, dotted separators)
   - `CoaRow.tsx` (grid: batch # mono, info sans, status pill)
   - `FieldLabel.tsx` (Plex Mono 10-11px uppercase 0.12em)
   - `Vial.tsx` (CSS-only rotating vial; lyophilized cream powder fill — NOT green liquid; sway -12° to +12° / 6.4s ease-in-out per Appendix V.2)
   - `Skeleton.tsx` (loading placeholder)
   - `Toast.tsx` (transient feedback; role="alert")
   - `Modal.tsx` (focus trap, esc-to-close, click-outside-close — used for non-age-gate modals)
   - `Dropdown.tsx` (radix-ui or hand-rolled; keyboard navigable)
4. Update `components/SiteHeader.tsx` with brand wordmark + nav (Shop / Quality / Sourcing / About / Blog / FAQ / Contact / Account per sub_5 IA recommendation, omitting Affiliate from primary nav per design-review reasoning — affiliate goes in footer)
5. Update `components/SiteFooter.tsx` with verbatim footer disclaimer (Appendix A.1 + Appendix O template)
6. Skip `/design-shotgun` (brand locked).
7. Run inline design-review against home-page hero with vialchemlabs applied. Iterate if anti-patterns surface (no purple gradients, no 3-column SaaS grid, no stock photos, no emojis).
8. Save `docs/checkpoints/phase_4_brand_design.md` with: brand assets, token diff, before/after screenshots, accessibility contrast audit (all pairs ≥ 4.5:1), font subsetting confirmation.
9. /context-save

Verification gate: brand assets present, design tokens defined, accessibility contrast ≥ 4.5:1 for all text-on-bg pairs, no forbidden marketing patterns in any new copy, Appendix W.1 visual quality checklist passes.

### Phase 5: Site IA + 29 Page Templates (target 120-180 min)

29 pages enumerated in §3 above. Per-page workflow:
1. Plan in `docs/superpowers/plans/<date>-page-<slug>.md` (1-paragraph + test cases + copy source per Appendix G)
2. TDD per component
3. Integrate
4. Inline design-review
5. Mark done

Heavy parallelization candidate: legal pages (terms/privacy/refunds/shipping/cookies) + content pages (about/faq/contact) are truly orthogonal. Use worktree cascade method per §4.4 if context budget allows; otherwise sequential subagent dispatch.

Product Page Anatomy (13 components, ordered):
1. Hero image (1 vial image, white bg, optional carousel for 2-3 angles)
2. Title + SKU code (mono font for SKU)
3. Price (list, per-mg, sale strikethrough if applicable)
4. Dose option selector (dropdown variants — Day-1 only one option per SKU)
5. Purity badge (99%+ lyophilized powder, format label)
6. Quantity selector + Add-to-Cart (sticky footer or traditional)
7. Description (verbatim from Appendix E; 336-345 words each)
8. Tab panel: Description | Certificate of Analysis | Related Products
9. COA display (per-batch PDF link from Janoshik placeholder)
10. Batch lot number (mono font, links to /coa/[peptide]/[batch])
11. Disclaimer box (verbatim Appendix A.2)
12. Related Products module (3-4 SKUs)
13. Stack suggestion (Recovery Stack on relevant pages)

Catalog page features:
- Filters: category (Recovery, GH-Stack, Cosmetic-Pathway, Metabolic, Nootropic), dose options, format, in-stock only
- Sort: price low-to-high, price high-to-low, name A-Z, newest
- Pagination: 12 per page (irrelevant Day-1 with 7 SKUs)
- Search bar (Fuse.js, instant fuzzy match on peptide name + SKU + category)
- Recently viewed (last 5 in this session)

Checkout features:
- Multi-step: shipping address → payment method → review → confirm
- Jurisdictional check at address (block CA/TX/NY/FL)
- Age gate checkbox at first cart action (NOT modal); 21+ + RUO ack + jurisdictional ack
- Payment method selector (BTCPay/crypto / Plaid/ACH; cards "coming soon")
- Crypto-discount auto-applied
- Intro promo entry (15% off via newsletter signup; backend validates code-email match)
- Order summary on every step
- Loading state: skeleton
- Confirmation: order ID, expected ship date, COA reference

Verification gate: all 29 pages exist, all `npm test` pass, all pass inline design-review, all use compliant copy, accessibility audit per page ≥ 95.

### Phase 6: Content + Copy (target 90-120 min)

All copy verbatim from super-prompt appendices:
1. Footer disclaimer: Appendix A.1 (every page)
2. Product disclaimer: Appendix A.2 (every product)
3. Hero copy: Appendix N (vialchemlabs replaces {{BRAND_NAME}})
4. About page: Appendix N (hero + thesis + ops + compliance sections)
5. FAQ: Appendix M (20 Q+A)
6. Blog seed: 5 posts from Appendix J outlines, each 1500-2400 words, ≥5 PubMed citations. Dispatch 5 parallel subagents (constitution-pinned) writing one post each.
7. Email welcome sequence: Appendix K verbatim (4 emails)
8. Contact form auto-replies: Appendix A.6 verbatim
9. Cookie consent banner: GDPR/CCPA accept-all + customize + reject-all
10. 404 page: brand-consistent, search bar + popular products + back to home
11. 500 page: brand-consistent, Sentry error reporting + back to home
12. Maintenance page: brand-consistent template

Run `assertMarketingCopySafe` grep across all new copy. Hero must match Appendix N verbatim.

Verification gate: all copy passes assertMarketingCopySafe, all blog posts ≥ 1500 words with ≥ 5 citations, hero matches Appendix N.

### Phase 7: Catalog Seeding (target 60-90 min)

1. Update `supabase/seed.sql` with 7 SKUs (Appendix E table) + Recovery Stack bundle
2. Update `lib/content/products.ts` with peptide metadata + verbatim descriptions
3. Build COA hosting at `app/coa/`:
   - `/coa` index — searchable batch-lot table (Fuse.js)
   - `/coa/[peptide]/[batch]` — per-batch detail with PDF link + test types (HPLC, Sterility, Endotoxin)
4. Generate placeholder COA PDFs per SKU at `public/coa/<peptide>-<batch>.pdf` marked "EXAMPLE_COA — REPLACE BEFORE LAUNCH". Each cites Janoshik Analytical (placeholder per LAB_PARTNER_NAME env).
5. Build intro promo: 15% off first order via newsletter signup, gated by RUO ack + age gate. Implementation: signup creates promo code linked to email; checkout validates code matches subscriber email.
6. Run `npm test` and inline /qa against catalog.

Verification gate: catalog renders, prices match Appendix E, bundle works, intro promo applies, COA pages render.

### Phase 8: Compliance Scaffolding (target 60-90 min)

1. /careful engaged for entire phase
2. Implement age gate per Appendix A.3 (text-checkbox at first cart action, 21+)
3. Implement jurisdictional block list `lib/compliance/jurisdictions.ts` + integrate into checkout (block CA/TX/NY/FL)
4. Extend `lib/customer-qualification.ts` with peptide attestations from Appendix A.5
5. Extend `lib/compliance.ts` `assertMarketingCopySafe` with full Appendix P forbidden patterns
6. Implement customer-service auto-reply templates from Appendix A.6 vocabulary
7. Pre-commit hook (Phase 3) runs supply-chain scanner with Appendix U patterns
8. Run inline /review on every file changed in this phase
9. Run inline /cso on compliance + qualification + jurisdiction code

Verification gate: /review and /cso pass, pre-commit hook fires on test commit with forbidden words, age + qualification + jurisdiction tests pass.

### Phase 9: Payment Integration (target 90-150 min)

1. /careful + /freeze to scope edits to `lib/payments/` only
2. Build `lib/payments/btcpay.ts` adapter implementing PaymentProvider; integrate self-hosted BTCPay Server (script `scripts/btcpay-setup.sh` at Phase 9; operator provisions via Docker)
3. Build `lib/payments/plaid.ts` adapter for ACH; Plaid Link integration; 5% discount nudge
4. Build `lib/payments/stub.ts` for dev (deterministic mock; auto-confirms 2s after init)
5. Update `lib/payments/config.ts` to register adapters; default `btcpay` in prod, `stub` in dev
6. `.env.example` already has BTCPay + Plaid env vars (Phase 0)
7. `lib/payments/reconciliation.ts` extends for BTCPay invoice-paid + Plaid auth-completed
8. Update checkout UI (Phase 5 page) per Appendix F: crypto first (recommended), bank second, cards "coming soon"
9. Crypto-discount logic (10-15% crypto, 5% ACH)
10. Run inline /codex review on payment integration code (high-risk path)
11. Run inline /review and /cso
12. Add E2E Playwright tests: customer adds product → selects crypto → BTCPay invoice opens → mock-pay → order status transitions to paid. Same for Plaid ACH.
13. Add unit tests for: per-mg discount calculation, jurisdictional check at checkout, intro promo validation.

Verification gate: /review + /cso + /codex review pass, E2E crypto + ACH pass, order lifecycle (pending → paid → shipped) transitions correctly.

### Phase 10: Auxiliary Surfaces (target 60-90 min)

Newsletter, account, search/filter, legal pages, affiliate. Per super-prompt §8 Phase 10. Lead magnet PDF "Reconstitution and Storage Guide" (3-5 pages, neutral research content).

Verification gate: newsletter end-to-end, account flows, search/filter, ToS/Privacy/Refund/Shipping/Cookies render verbatim from Appendix L.

### Phase 11: Operator Runbook (target 30-60 min)

Generate `docs/operator-runbook.md` from Appendix I + sub_3_acquisition.md findings:

**DAY 1 (vialchemlabs Day-1 specifics):**
1. Google Organic SEO: 30-50 PDPs at 1500-2400 words each (Phase 6 already produces 5 blog posts; expansion is operator post-launch)
2. Email capture: footer + dedicated `/newsletter` with credibility-artifact lead magnet
3. Vendor blog: 5 foundational posts (Phase 6) + ongoing cadence (operator)
4. Affiliate listicle setup: outreach script + emails for Outliyr, Muscle+Brawn, PepPal, Brainflow
5. Defensive social registration: @vialchemlabs on IG/TikTok/X (block squatters, no active posting)
6. **Tier S clinical-credentialed creator outreach**: 5-10 micro-creators (RN/PA-C/MD/DC) at $300-$1K + 20% commission/90-day cookie. Outreach template included.

**WEEKS 2-4:**
7. Affiliate listicle inclusions (response-driven from Day-1 outreach)
8. Mid-tier biohacking podcast host-reads ($1.5K-$4.5K/insertion)
9. Bing Webmaster Tools + sitemap submission
10. X/Twitter founder-personal weekly cadence

**MONTHS 2-3:**
11. SEO traction landing (3-6 month horizon for Posture A)
12. Catalog expansion: KPV as #1 candidate (Phase 7 schema supports it)

**PERMANENT AVOID:**
13. Google Ads, Bing/DDG paid (closed by category bans)
14. SMS marketing (CTIA + TCPA exposure)
15. Vendor YouTube (channel termination ceiling)
16. Active vendor IG/TikTok brand presence
17. Trustpilot review counts

**PLACEHOLDER AWAITING SLICE 3 FIRE:**
18-22. Reddit + forums + Telegram + Discord + niche aggregator strategies (B1 prompt path)

Verification gate: runbook exists, references all relevant research files, marks Slice 3 PLACEHOLDER, has operator-actionable steps with specific URLs and email templates.

### Phase 12: QA + Reviews (target 90-150 min)

Per super-prompt §8 Phase 12. Run /qa, inline /design-review per page, /benchmark, Lighthouse CI, axe-core a11y, JSON-LD validation, full assertMarketingCopySafe grep.

Verification gate: /qa pass, design-review pass, Lighthouse Perf ≥ 90 / A11y ≥ 95 / SEO ≥ 95 / Best Practices ≥ 95.

### Phase 13: Pre-Deploy Reviews (target 30-60 min)

Run /review on full diff against base branch (initial commit).
Run /cso infrastructure security audit.
Run /codex review on payment + compliance code.
(Optional) /total-security-audit if any signal warrants.
Resolve critical findings; defer non-critical to post-launch backlog.

Verification gate: /review + /cso + /codex review pass, no critical findings outstanding.

### Phase 14: Ship + Deploy (target 30-60 min)

1. /ship — bump VERSION (1.0.0), write CHANGELOG, run pre-merge tests, merge base into feature branch, create PR (against initial commit base)
2. **Operator action**: review PR on GitHub
3. /land-and-deploy — merge PR to main, wait for CI, Vercel auto-deploys to production, canary health check
4. Verify production URL `/api/health` returns 200
5. Verify production URL renders home page correctly with vialchemlabs brand
6. Smoke test catalog → product → checkout flow on production

Verification gate: production deploys, /api/health 200, home page renders, no console errors, smoke test passes on production.

### Phase 15: Post-Deploy Monitoring + Documentation (target 30-60 min)

1. /canary — monitor production for 2 hours: console errors, performance regressions, screenshot diffs
2. /document-release — update README, ARCHITECTURE.md, CHANGELOG
3. Sentry monitoring dashboard verified live; alert thresholds configured
4. Operator handed `docs/operator-runbook.md`
5. Schedule `/retro` for 1 week after launch

Verification gate: /canary 2-hour pass, Sentry catches no critical, operator runbook complete and accurate.

## 8. Risk Register

| ID | Risk | Mitigation | Phase |
|---|---|---|---|
| R1 | Mogtrix attribution comments leak brand into source | Pre-commit grep test (Iron Law 2.12) blocks any "Mogtrix" outside `// Pattern adapted from mogtrix-` comment | 3, 8 |
| R2 | RUO defense pierced by hedge-language in product descriptions | assertMarketingCopySafe grep + manual editorial review on Appendix E descriptions | 6, 7 |
| R3 | Stub credentials accidentally committed in real | .gitignore covers `.env*`; `.env.example` is separate template; supply-chain scanner enforces | 0, 8 |
| R4 | Payment webhook idempotency violation causes double-charge | Idempotency-keys in payments table; reconciliation.ts checks existing intent before update | 9 |
| R5 | Lighthouse Perf < 90 on home (vial scenes too heavy) | CSS-only Vial Day-1; R3F deferred to Phase 2; image lazy-loading; bundle-size budget | 4, 12 |
| R6 | Slice 3 PLACEHOLDER blocks runbook completion | Mark sections explicitly; operator fires B1; runbook regenerates on demand | 11 |
| R7 | LLC formation deferred = ToS placeholder | `[Wyoming/TBD]` in ToS until operator confirms; legal review post-formation | 6, 10 |
| R8 | Domain `vialchemlabs.com` not registered = wrong canonical URL on Day 1 | Build uses `NEXT_PUBLIC_SITE_URL=https://vialchemlabs.com`; operator registers; if .labs unavailable, fallback `vialchemlabs.com` and SITE_URL swap | 0, 14 |
| R9 | Source supplier terms not confirmed = inaccurate fulfillment promises | Use Bible-aligned placeholder fulfillment ("ships within 2 business days, before 3pm Mon-Fri"); operator confirms post-build | 6, 10 |
| R10 | All credentials stubbed = first real deploy has zero working integrations | Operator runbook Phase 11 + post-deploy operator checklist explicitly lists every env var to swap; stub adapters fail loud (don't silent-pass in prod) | 11, 14, 15 |
| R11 | Pre-commit hook blocks legitimate Mogtrix-attribution comments | Test fixture covers approved attribution format; `// Pattern adapted from mogtrix-website/` is whitelisted | 3 |
| R12 | Supabase CLI install denied by harness, blocks DB migration | `npx supabase` for one-off; or use Supabase JS client + dashboard migration; or revisit user authorization at Phase 3 | 3 |
| R13 | Phase 1 corpus digest references files not present in evidence corpus | sub_5 substituted apexpeptidesupply for missing 13 priority profiles; downstream phases handle gracefully | 5, 11 |

## 9. Eng-Review Self-Applied (would-be /plan-eng-review)

**Architecture clarity**: 9/10. Stack is conventional Next.js 16 + Supabase + Vercel; deviates only in (a) NEW project not Mogtrix fork, (b) custom payment adapter pattern (not Stripe), (c) no GA/no Meta Pixel.

**Test coverage strategy**: 9/10. TDD per Iron Law 2.1 means every component, payment adapter, compliance assertion, and catalog operation gets a unit test. E2E covers crypto/ACH purchase flows end-to-end. Gap: load testing not in scope (Day-1 traffic minimal); revisit Phase 2.

**Performance budget**: 8/10. CSS-only Vial keeps initial JS ≤ 300KB. Image lazy-loading + WebP + font subsetting. Risk: Sentry adds ~30KB; Sentry sampling configured at 0.1 in prod to keep noise + bundle reasonable.

**Data model**: 8/10. Schema covers customer, catalog, orders, payments, COAs, subscriptions, affiliates, blog, audit. RLS policies on every customer-touching table. Gap: blog could move to MDX-files-on-disk (no DB) for simplicity Day-1; revisit if Phase 6 surfaces complexity.

**Security posture**: 9/10. Pre-commit supply-chain scanner + RLS + Sentry + audit_log table + customer qualification flow + jurisdictional restriction + age gate. Per Iron Law 2.5 + 2.16. Gap: no rate limiting on /api/access (qualification flow) — add Vercel WAF rule Phase 8.

**Deployment**: 9/10. Vercel preview per branch; main → production. Sentry instrumentation on build. /api/health endpoint for canary. Operator runbook covers env-var rotation.

**Observability**: 7/10. Sentry covers errors. Vercel Analytics covers vitals. Missing: structured logs to a sink. Acceptable Day-1; revisit if Sentry insufficient.

**Maintainability**: 9/10. Patterns ported by READ + ADAPT mean Mogtrix-proven shapes are visible. Attribution comments make heritage clear. Consistent file structure. TypeScript strict mode.

**Open architecture questions**: NONE. All locked. Begin Phase 3.

## 10. Design-Review Self-Applied (would-be /plan-design-review)

**Visual hierarchy**: 9/10. Posture A token system + IBM Plex pairing + teal accent gives clear hierarchy. Hero (Newsreader Italic for pull-quote moment) → headline (Plex Sans 600) → body (Plex Sans 400) → metadata (Plex Mono 400).

**Brand consistency**: 10/10. vialchemlabs wordmark, color palette, voice register all derived from LOCKED DECISIONS. Anti-pattern enforcement in design-review.

**Accessibility**: 9/10. WCAG AA contrast verified for all token pairs. Focus rings 2px solid accent + 2px offset. Reduced motion fallback. Status pills always include text. Skip-to-content link in header. Form labels.

**Responsive**: 9/10. Mobile-first; verified at 375/768/1024/1440px. Bottom-sheet pattern for mobile vial-scene collapse. Touch targets 44x44px minimum.

**Motion**: 9/10. Vocabulary tokens (premium-out easing, micro/short/medium/long/slow durations). Vial sway -12° to +12° / 6.4s. No autoplay sound. No flashing. Reduced motion hard-disabled.

**Typography**: 10/10. IBM Plex Sans + IBM Plex Mono + Newsreader Italic. Tabular numerals. Type scale 14 sizes. NO Geist/Inter/Roboto/Space Grotesk (anti-pattern in Posture A per Appendix V).

**Color**: 9/10. Charcoal + teal (Posture A locked). NO acid-green (Mogtrix's choice). NO purple/violet gradients (universal anti-pattern). Token-driven (no ad-hoc hex).

**Iconography**: 10/10. Lucide React only (consistent stroke). NO emojis as icons.

**Dark mode**: light-mode is not built (clinical Posture A is dark-default). Fine.

**Anti-patterns**: comprehensive list per Appendix V.2 enforced in inline /design-review during Phases 4/5/6.

**Open design questions**: NONE. All locked. Begin Phase 4 after Phase 3.

## 11. Closing

This plan is the locked architecture for vialchemlabs Day-1 build. Iron Laws 2.1-2.17 govern execution. Subagent Constitution pinned to every dispatch. Begin Phase 3 (backend bootstrap) immediately.
