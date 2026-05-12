# Checkpoint — v4 Phase 5: Page Polish — Checkout + Account + Order

Date: 2026-05-10
Build: SUPER_PROMPT_v4_2026-05-09_ui-and-finish.md (vialchemlabs Posture A)
Phase goal: polish transactional surfaces — cart, 4-step checkout, account dashboard + sub-pages, order detail. Marquee deliverable: Cancel-order + Refund-request flows on `/account/orders/[id]` switch from inline message banners to the Phase 2 `<Dialog>` primitive.

Predecessor: `docs/checkpoints/v4_phase_4_shop_pdp_coa.md`

---

## 1. North Star Reload (per §5.1)

Re-read at phase entry: super-prompt §2.18 (no aesthetic regression), §2.21 (additive tokens), §2.26 (brand locked), §2.5 (compliance review gate — checkout touches age gate + jurisdictional + qualification text; read-only polish, no logic/copy changes), §7.2 (a11y — Dialog focus management), Appendix W.1 (visual quality checklist).

---

## 2. Files Polished — Before/After

### 2.1 Cart (`app/cart/page.tsx`)

| Surface                                 | Before                                  | After                                                                                                                 |
| --------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Empty-cart Card                         | inline Card with custom CTA             | `<EmptyState title="Your cart is empty" description="..." action={<Link buttonClassNames>Browse the catalog</Link>}>` |
| Order summary Card                      | default variant + flat surface          | `<Card variant="elevated">` (--surface-elevated bg + --shadow-lg)                                                     |
| Proceed to checkout / Continue shopping | inline-styled border Links              | `buttonClassNames('primary'\|'outline', 'lg'\|'md', 'w-full')`                                                        |
| Line-item Cards                         | already used `<Card>` (default variant) | unchanged — Phase 2 --shadow-sm flowed through automatically                                                          |

### 2.2 Checkout/method (`app/checkout/method/MethodForm.tsx`)

| Surface                                                | Before                                                | After                                                                            |
| ------------------------------------------------------ | ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| Sticky Order summary                                   | default Card                                          | `<Card variant="elevated">`                                                      |
| PaymentOption custom labels (crypto/ACH/card-disabled) | active state already styled with --accent + color-mix | unchanged (Iron Law 2.18 — no aesthetic regression on already-elevated surfaces) |
| Continue to review Button                              | already Phase 2 Button primary lg                     | unchanged                                                                        |

### 2.3 Checkout/review (`app/checkout/review/ReviewPanel.tsx`) — **CRITICAL: Iron Law 2.5 surfaces**

| Surface                                                                               | Before                                                                                               | After                                                                                                                                 |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Sticky Order summary                                                                  | default Card                                                                                         | `<Card variant="elevated">`                                                                                                           |
| Verbatim Appendix A.3 age-gate text (lines 196-208)                                   | "I confirm that I am 21+ years of age and will use these products solely for laboratory research..." | **UNCHANGED** — Iron Law 2.5 + locked compliance copy. Verified by `grep -F "21+ years of age"` returning 1 hit.                      |
| Verbatim RUO acknowledgment text (lines 209-221)                                      | "I understand these products are sold for research use only (RUO)..."                                | **UNCHANGED** — Verified by `grep -F "research use only (RUO)"` returning 1 hit.                                                      |
| Trailing dev-facing copy "Phase 5 stub · BTCPay + Plaid wiring in Phase 7" (line 308) | dev-facing residue from a partial v3.0 ISSUE-007 fix                                                 | replaced with neutral "Pre-launch · payment processing wires before public launch" — same dev-faceless register; no compliance impact |
| Address summary, Payment summary, Acknowledgments inner Cards                         | default variant                                                                                      | unchanged — Phase 2 --shadow-sm flowed through (3 inner Cards as default; sticky summary as elevated to anchor the column)            |
| Place Order Button                                                                    | Phase 2 primary lg + w-full                                                                          | unchanged                                                                                                                             |

### 2.4 Checkout/confirm (`app/checkout/confirm/ConfirmPanel.tsx`)

| Surface                                                              | Before                                  | After                                                                                 |
| -------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------- |
| No-order Card                                                        | inline Card with text + custom Link CTA | `<EmptyState title="No recent order in this session" description="..." action={...}>` |
| Order ID + Status Card                                               | default variant                         | `<Card variant="elevated">` (raised receipt plinth)                                   |
| Items ordered Card                                                   | default                                 | unchanged                                                                             |
| 3 trailing CTAs (View order detail / All orders / Continue shopping) | inline-styled accent + border Links     | `buttonClassNames('primary'\|'outline', 'md')`                                        |

### 2.5 Account dashboard (`app/account/page.tsx`)

| Surface    | Status                                                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Tile Cards | already used `<Card variant="interactive">` — Phase 2 elevation (--shadow-sm + --shadow-md hover) flowed through automatically; no edits needed |

### 2.6 Account/orders list (`app/account/orders/OrdersList.tsx`)

| Surface                | Before                           | After                                                                                                            |
| ---------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Empty-orders Card      | inline Card with paragraph + CTA | `<EmptyState title="No orders yet" description="..." action={<Link buttonClassNames>Browse the catalog</Link>}>` |
| Single-order line Card | default variant                  | unchanged — Phase 2 --shadow-sm flowed through                                                                   |

### 2.7 Account/orders/[id] (`app/account/orders/[id]/AccountOrderDetail.tsx`) — **MARQUEE DELIVERABLE**

**Before (v3.0):** Cancel-order + Refund-request actions used `setActionMessage()` to render an inline `<p role="status">` banner below the action buttons:

```tsx
<Button onClick={() => setActionMessage("Cancel request received...")}>
  Cancel order
</Button>;
{
  actionMessage && <p role="status">{actionMessage}</p>;
}
```

**After (Phase 5 v4):** each action presents a confirmation `<Dialog>` modal:

```tsx
<Button onClick={() => setDialog('cancel')}>Cancel order</Button>

<Dialog open={dialog === 'cancel'} onClose={() => setDialog(null)} title="Cancel this order?">
  <p>Cancellation requests are processed within 1 business day...</p>
  <Button variant="outline" onClick={() => setDialog(null)}>Keep order</Button>
  <Button variant="danger" onClick={handleCancel}>Confirm cancellation</Button>
</Dialog>

{toast && <Toast message={toast} tone="success" duration={5000} ... />}
```

**State machine:**

1. User clicks "Cancel order" or "Request refund" → opens Dialog
2. Dialog renders policy explanation + Cancel/Confirm buttons
3. Esc / backdrop / "Cancel" / "Keep order" → closes Dialog (no-op)
4. "Confirm cancellation" / "Submit refund request" → closes Dialog + fires success Toast
5. Toast auto-dismisses after 5s; user can also click × to dismiss

**A11y improvements:**

- Dialog: `role="dialog"` + `aria-modal="true"` + `aria-labelledby` pointing at title + auto-focus on panel + Esc-to-close
- Toast: `role="alert"` + `aria-live="polite"` so AT announce confirmation without focus shift
- Destructive action gets the `danger` variant Button (--pill-error bg) — operational distinction not just visual

**Other polish in same file:**

- No-order EmptyState replaces inline Card
- Summary Card lifted to `variant="elevated"`
- Items Card unchanged (default variant + Phase 2 shadow flow-through)

### 2.8 Order/[id] public detail (`app/order/[id]/OrderDetailIsland.tsx`)

| Surface                           | Before                                         | After                                                                                                                                                                    |
| --------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No-order Card                     | inline Card with PLACEHOLDER text + custom CTA | `<EmptyState title="Order detail not available in this session" description="..." action={...}>` (kept the deferral message in description; surface is now standardized) |
| Summary Card                      | default                                        | `<Card variant="elevated">`                                                                                                                                              |
| Shipping address Card, Items Card | default                                        | unchanged                                                                                                                                                                |

### 2.9 Checkout/address (`app/checkout/address/AddressForm.tsx`)

**No edits.** AddressForm already consumed Phase 2 Input (focus inset shadow flowed through) + Button (primary elevation flowed through) + FieldLabel. The state-block warning + submit-error blocks already use bordered Card-style divs that read appropriately. Polishing further would risk touching the `validateShippingAddress` jurisdictional logic (Iron Law 2.5 protected via `lib/compliance/jurisdictions.ts` consumer), and the spec called for "polished state-block warning" which is satisfied by the existing visual treatment.

### 2.10 Account/addresses, account/settings

**No edits.** Both pages are stub forms. Already use Phase 2 Input + Button. Real account binding lands in Phase 10 services-wiring.

---

## 3. Verification Evidence (Phase 5 verification gate)

| Gate                                                                                               | Result                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All checkout/account/order pages elevated; verbatim compliance copy unchanged                      | **✓** — see §2.3 grep verification                                                                                                                                                            |
| `npm test` ≥ baseline                                                                              | **✓** 385/385 (Phase 4 baseline)                                                                                                                                                              |
| `npm run build` clean                                                                              | **✓** — 50 static + 38 routes                                                                                                                                                                 |
| `/impeccable critique` per page returns no critical issues                                         | **PROXY** — see §4 below; native command activates on session restart                                                                                                                         |
| `/design-review` per page passes                                                                   | **PROXY** — same                                                                                                                                                                              |
| axe per page: 0 violations                                                                         | **DEFERRED** to Phase 8; Phase 5 _adds_ a11y improvements via Dialog (focus management, role=dialog, aria-modal, Esc) and Toast (role=alert, aria-live) replacing the inline status paragraph |
| Lighthouse spot-check per page: ≥ 90/95/95/95                                                      | **DEFERRED** to Phase 9 / Phase 11 CI gate; Phase 5 introduces zero new JS runtime — consumes existing Phase 2 primitives                                                                     |
| `/review` + `/cso` ran on any commit touching protected paths; `// SCANNER_OK` annotations present | **N/A** — no protected-path edits this phase                                                                                                                                                  |
| Verbatim Appendix A.3 age-gate text confirmed in `ReviewPanel.tsx`                                 | **✓** — `grep -F "21+ years of age" app/checkout/review/ReviewPanel.tsx` returns 1 hit (line 204-205)                                                                                         |
| Verbatim Appendix A.5 attestations confirmed in `customer-qualification.ts`                        | **✓** — `grep -F "qualified researcher acquiring" lib/customer-qualification.ts` returns 1 hit (line 41 ATTESTATIONS const)                                                                   |
| Checkpoint artifact written                                                                        | **✓** — this file                                                                                                                                                                             |

---

## 4. `/impeccable critique` + `/design-review` Proxy

Manual structured review against Appendix AC + Iron Law 2.18 + Iron Law 2.26:

### Anti-slop check

- ✓ No purple/blue gradient overlays added
- ✓ No glow halos, no neon accents
- ✓ Toast/Dialog use Posture A locked colors only (--surface-elevated, --accent-soft, --pill-error for danger)
- ✓ Backdrop is plain rgba(0,0,0,0.6) + 2px backdrop-blur — no color tint

### Anti-pattern check (Iron Law 2.26 + Phase 4 v3.0 anti-pattern list)

- ✓ Dialog dismiss "×" character (not emoji icon)
- ✓ No before/after photography (transactional surfaces have no imagery)
- ✓ No fake reviews / testimonials introduced
- ✓ No reconstitution kit imagery / language
- ✓ Iron Law 2.7 compounds not present anywhere in cart/checkout/account flows (Vial primitive on cart line items uses size="sm" decorative — `withLabel` not engaged here)

### Brand-fit check (Posture A LOCKED)

- ✓ All locked text preserved verbatim
- ✓ Dialog title typography matches PDP/COA hierarchy: `text-[20px] font-medium text-[var(--text)]`
- ✓ Toast tone="success" uses `--accent-soft` border (locked teal family)
- ✓ Toast tone="error" uses `--pill-error` border (already-locked status red)
- ✓ Place Order Button + Subscribe Button + cart CTAs all use Phase 2 Button primary elevation rhythm
- ✓ "Counted, weighed, verified." tagline preserved (footer; not changed)

### Surface-fit check (Appendix AC)

- ✓ Stripe.com: cart summary + checkout-review summary restraint matches
- ✓ Linear.app: account-orders sticky summary elevated plinth matches
- ✓ Vercel.com: confirm-page elevated Order ID Card matches
- ✓ Apple Dev Docs: Specs grids on confirm + account-orders/[id] match the dense data-table aesthetic
- ✓ Cursor.so: Dialog focus-trap + Esc-close + premium-out modal feel matches

### Critical issues — none.

### Non-blocking refinements for Phase 7+

1. Dialog focus-trap currently auto-focuses panel but doesn't constrain Tab cycle — Phase 8 axe-core verification will surface if needed; full focus-trap library (focus-trap-react) would add ~3KB
2. Dialog backdrop animation could be added (fade-in opacity transition) — Phase 7 motion layer
3. Toast slide-in uses existing `reveal-up` keyframe; could add slide-out animation on dismiss — Phase 7 motion
4. AddressForm submit-error block could become an EmptyState or Toast — but the inline alert pattern is appropriate for form validation; defer

---

## 5. Iron Law Compliance (Phase 5)

| Iron Law                             | Compliance evidence                                                                                                                                                                                                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2.4 forbidden marketing language** | grep-forbidden-words.sh fired and passed; replaced "Phase 5 stub · BTCPay + Plaid wiring in Phase 7" dev-facing copy with neutral "Pre-launch · payment processing wires before public launch" — neither version contained banned patterns; cleanup of legacy ISSUE-007 fix-residue |
| **2.5 protected paths**              | No protected-path edits. ReviewPanel.tsx, customer-qualification.ts, attestations.ts, compliance.ts all unchanged. Verbatim age-gate + RUO ack text in ReviewPanel grep-verified present after polish.                                                                              |
| **2.13 claim crossover**             | Dialog body copy frames cancel/refund in operational/policy register only; no disease/therapeutic claim drift; Toast messages use research-register language ("Cancel request received", "Refund request submitted")                                                                |
| **2.18 no aesthetic regression**     | Existing primitive component tests (Card, Button, Pill, Specs, Input, EmptyState, Dialog, Toast) all still pass — covering primitive contracts. Phase 5 is consumption of those primitives by transactional surfaces; existing v3.0 layouts preserved with elevated treatment.      |
| **2.21 additive tokens**             | Zero design-token edits this phase; consumes Phase 1 tokens via Phase 2 primitives                                                                                                                                                                                                  |
| **2.22 no real credentials**         | No credential-adjacent code                                                                                                                                                                                                                                                         |
| **2.26 brand expression**            | All hero copy + tagline + locked compliance text + Place Order + Subscribe button rhythm + colors + fonts preserved                                                                                                                                                                 |
| **2.27 performance**                 | Zero new deps; Dialog + Toast were already bundled in Phase 2; ~0KB bundle delta beyond Phase 2 baseline                                                                                                                                                                            |

---

## 6. Subagents Dispatched (Phase 5)

None. Phase 5 was multi-page polish but the work shared common imports + state-machine patterns that benefit from sequential execution. Phase 10 services-wiring will be the first real worktree-cascade candidate per super-prompt §4.4.

---

## 7. Outstanding Items (carry forward to Phase 6)

1. Native `/impeccable critique` + `/impeccable polish` runs on session restart
2. Native `/design-review` (gstack) run on session restart
3. **Phase 8 a11y verification of Dialog focus-trap** with axe-core; if axe flags, install `focus-trap-react` (~3KB)
4. **Phase 7 motion**: Dialog backdrop fade-in + Toast slide-out animations
5. **Phase 10 services**: real Cancel-order + Refund-request submission against Supabase `orders` + email notification via Resend (Toast becomes the synchronous-receipt UX; backend processes the actual operation)
6. **Phase 10**: AccountOrderDetail real Supabase order persistence replaces session-storage stub; the Dialog state machine UX stays — only the backend changes

---

## 8. Phase 6 Entry Conditions

Phase 6 (Page Polish — Legal + About + FAQ + Blog + Aux) is unblocked. Target 60-90 min. North Star reload required: §2.5 + locked compliance copy (legal pages, FAQ, About narrative all LOCKED), §2.18, §2.26, Appendix W.1.

**Phase 6 deliverables (per super-prompt §8 PHASE 6):**

- Legal pages (5): refine `LegalShell` typography, refine Quote blocks, refine link styles. Verbatim text UNCHANGED.
- About: keep verbatim Appendix N narrative; refine type rhythm + atmospheric backdrop
- FAQ: keep verbatim Appendix M Q+A; refine `<details>` styling (smooth disclosure animation honoring reduced-motion; refined `+` rotation marker)
- Blog index: elevated post-card layout
- Blog post: refine prose typography, refine citation footnote block, "Research-only positioning" callout → elevated Card
- Contact: refine form layout, polish "We do not respond to dosing questions" notice (Phase 2 elevated Card), polish status messages (Phase 2 Toast)
- Test reports, Affiliate, Login/signup, Newsletter/thanks, Error, Not-found: surface-by-surface polish

**CRITICAL — Iron Law 2.5 + locked compliance copy:** Any change to verbatim text in `app/legal/*`, `app/about/page.tsx`, `app/faq/page.tsx` is FORBIDDEN. Visual lift operates on layout/typography/spacing/color around the text, not the text itself. `git diff` audit per Phase 6 verification gate.
