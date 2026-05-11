# First-payment verification (D23 closure)

Phase 13.4 (v4). Operator-funded $1 BTCPay invoice + $1 Plaid ACH
transfer. Verifies the full webhook → reconcile → audit_log →
order-confirmation-email chain on real production traffic.

This is the last gate before the codebase is "live for real". After
both rails pass, flip `PAYMENT_PROVIDER` from `stub` to `btcpay` (or
leave at `stub` for the first weekend and promote based on traffic
shape).

## Pre-flight (must be true before starting)

- [ ] Production deploy live at `https://vialchemlabs.com/api/health` →
      200
- [ ] `REQUIRE_SUPABASE=true` + Supabase migration applied
- [ ] `REQUIRE_RESEND=true` + `vialchemlabs.com` sender domain verified
- [ ] Sentry DSN active + alerts provisioned per Phase 10.3 spec
- [ ] BTCPay Server reachable at `BTCPAY_URL` + API key + store ID +
      webhook secret all set
- [ ] BTCPay webhook endpoint pointed at
      `https://vialchemlabs.com/api/payments/btcpay/webhook` with events:
      InvoiceCreated, InvoiceProcessing, InvoiceSettled, InvoiceInvalid,
      InvoiceExpired
- [ ] Plaid sandbox client ID + secret active; `PLAID_VERIFICATION_MODE=jwks`
      (Phase 11.1 wired ES256)
- [ ] You have ~$5-10 in a real BTC or LTC wallet for the test
- [ ] You have a Plaid sandbox-test-bank account configured

## Test 1 — BTCPay $1 invoice

### Step 1: place a test order

1. Visit `https://vialchemlabs.com/products/bpc-157-10mg`
2. Add to cart
3. Proceed to checkout — fill the address with a real-looking but
   non-blocked state (e.g., Washington, Oregon, Colorado)
4. Choose **Crypto** at /checkout/method
5. Acknowledge attestations at /checkout/review
6. Click **Place order**

The PlaceOrderButton (Phase 7) shows ~300ms loading state, then redirects
to a Vercel-served `/checkout/confirm` page with a BTCPay invoice link.

### Step 2: pay the invoice

Click the BTCPay-provided checkout link. The BTCPay invoice page shows
the BTC + LTC payment-method tabs. Pay $1 USD-equivalent from your
wallet.

(The order total will be the real product price — you are not paying
$1 literally; you're paying the real price for one item. If you'd
prefer a true $1 test, temporarily set up a $1 SKU in
`lib/content/products.ts`, ship a hotfix, run this test, then revert.
The full-price path is recommended because it exercises the real
discount math.)

### Step 3: verify the chain

After BTCPay confirms ≥1 confirmation:

```bash
# Via Supabase SQL editor or psql:
select id, display_id, status, payment_provider, total_cents
  from orders
  where email = 'YOUR_EMAIL'
  order by placed_at desc
  limit 1;
# Expected: status = 'paid', payment_provider = 'btcpay'

select * from payments
  where order_id = '<order-id-from-above>'
  order by updated_at desc;
# Expected: status='paid', amount_cents matching, provider='btcpay'

select event_type, recorded_at
  from audit_log
  where order_id = '<order-id-from-above>'
  order by recorded_at;
# Expected sequence:
#   order.placed → payment.reconciled → email.order_confirmation_sent
```

Plus:

- [ ] Inbox: receive order confirmation email from `research@vialchemlabs.com`
- [ ] Sentry: zero new errors (sentry.io → Issues → filter "this hour")
- [ ] BTCPay dashboard: invoice marked Settled

If any of those fail: **rollback** (`vercel rollback`), capture the
audit_log + Sentry trace, fix root cause (Iron Law 2.3 — no
symptom-fix), re-deploy.

## Test 2 — Plaid sandbox ACH

### Step 1: place a second test order

Same flow as Test 1 but choose **Bank transfer** at /checkout/method.

### Step 2: complete Plaid Link

The /checkout/confirm page (or the Place-order client island) opens
the Plaid Link flow. Use Plaid's sandbox credentials:

- Username: `user_good`
- Password: `pass_good`
- MFA: any 4-digit code if prompted

Select any account → confirm transfer.

Plaid sandbox simulates the ACH lifecycle: pending → posted (instant in
sandbox; 3-4 days in production).

### Step 3: verify the chain

Same SQL queries as Test 1 with `payment_provider = 'plaid'`. Audit
sequence should be:
```
order.placed → payment.reconciled (status=authorized)
             → payment.reconciled (status=paid)
             → email.order_confirmation_sent
```

The `authorized` → `paid` transition should idempotently apply via
the reconciliation ledger.

### Step 4: verify the JWKS path

Check Sentry / BTCPay webhook signature failure logs:

```bash
# In Sentry, filter:
#   tags.webhook = 'plaid.transfer'
# Should see: zero verification_unsupported, zero signature_invalid,
# all events tagged 'verified'
```

If you see `signature_invalid`: the JWKS path isn't fetching the
right public key. Check `PLAID_VERIFICATION_MODE=jwks` in Vercel env;
fall back to `hmac` temporarily if sandbox doesn't issue ES256
signatures.

## Test 3 — D15 Layer 3 jurisdictional guard

This proves the post-payment-confirmation block list works. Run this
ONLY after Tests 1 + 2 pass.

### Step 1: place an order to a blocked state

Use a different test email. At /checkout/address, enter California /
Texas / New York / Florida.

### Expected: Layer 1 (AddressForm) blocks at submit time

You should NOT be able to advance past /checkout/address. If you do
advance: file a bug — Layer 1 has regressed.

### Step 2: bypass Layer 1 (manual test)

To verify Layer 3 fires when Layers 1 and 2 fail, use curl:

```bash
# Construct a synthetic webhook hitting /api/payments/btcpay/webhook
# with a payload that references an order in a CA shipping state.
# (Operator-only test — requires real BTCPAY_WEBHOOK_SECRET to sign
# the payload.)
```

Expected: webhook handler returns 4xx with reason
`jurisdictional_rejected`; `audit_log` records
`jurisdictional_rejection.layer_3` event; order does NOT credit.

If you cannot run Step 2 safely from production, log the test as
"verified via unit test
`tests/unit/payments/reconciliation-jurisdictional.test.ts`" — that
suite covers all 6 cases (CA/TX/NY/FL + non-US + happy path) with full
assertions on `JurisdictionalGuardError`.

## Test 4 — Cookie consent persistence

1. Open `https://vialchemlabs.com/` in a fresh incognito window
2. Banner appears at bottom — confirm Reject all / Customize / Accept
   all visible
3. Click **Customize** → toggle Functional ON, Analytics OFF, Marketing
   OFF → **Save preferences**
4. Reload the page — banner should NOT re-appear
5. Inspect cookies — `vc-consent` cookie should contain
   `categories.functional=true, analytics=false, marketing=false`
6. (Optional) Enable GPC in your browser, clear `vc-consent` cookie,
   reload — banner should NOT appear (GPC defaults silently applied)

## After all 4 tests pass

```bash
# 1. Update PAYMENT_PROVIDER (stub → real rail of choice)
npx vercel env rm PAYMENT_PROVIDER production
npx vercel env add PAYMENT_PROVIDER production
# Value: btcpay (recommended Day-1 since crypto rail is most reliable)
# OR: plaid (if you prefer ACH first)
# OR: stub (if you want to soak-test for another week before opening
#           real rails to walk-up traffic)

# 2. Promote the deploy (if not already on latest)
npx vercel --prod

# 3. Run the canary loop
bash scripts/canary.sh https://vialchemlabs.com

# 4. Watch Sentry for 2 hours; if clean, schedule Week +1 retro
```

## Documentation

After tests pass, write the verification log:

```bash
cat > docs/checkpoints/v4_phase_13_first_payment.md <<'EOF'
# v4 Phase 13 — First-payment verification

Date: <date>
Operator: <name>

## Test 1 — BTCPay
Order ID: <id>
Amount: $<x.yz>
Tx hash: <btc/ltc tx hash>
Settled at: <ts>
Audit chain: order.placed → payment.reconciled → email sent ✓

## Test 2 — Plaid sandbox
Order ID: <id>
Amount: $<x.yz>
Plaid transfer ID: <id>
Audit chain: order.placed → authorized → paid → email sent ✓

## Test 3 — D15 Layer 3
Verified via unit suite (or manual curl test).

## Test 4 — Cookie consent
Round-tripped Accept / Customize / Reject + GPC ✓
EOF
```

Then commit + tag:

```bash
git add docs/checkpoints/v4_phase_13_first_payment.md
git commit -m "docs(phase-13): first-payment verification log"
git push
```

This closes D23 and ends the v4 pass.
