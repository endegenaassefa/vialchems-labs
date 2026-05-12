# DECISION: Payment Stack

Status: **LOCKED_DEFAULT** (operator may add Phase 2 rails after first revenue signal)
Source: `02_claude_code_outputs/compliance_disclaimers/payment_processor_posture.md`
Durability framework: 4-tier ladder per `payment_processor_posture.md` §5

## Day-1 payment stack (Tier 2 durability)

### Rail 1: Crypto (primary)

**Provider**: BTCPay Server (self-hosted)
**Coins accepted**: Bitcoin (BTC), Litecoin (LTC), optionally Ethereum (ETH)
**Why**: Self-hosted, no third-party termination risk. Umbrella Labs reference. Highest durability in the universe.
**Discount offered**: 10-15% off list price for crypto payments (demand shaping)
**UX**: Radio button at checkout, equal-prominence with bank rail. Show discount as "(-10%)" on the option label.
**Implementation**: BTCPay Server self-hosted Docker container; webhook to Mogtrix `lib/payments/` adapter pattern; new adapter implements `PaymentProvider` interface.

### Rail 2: Bank (ACH via Plaid)

**Provider**: Plaid (verified bank account linking)
**Discount offered**: 5% off list price for ACH payments
**Clearance**: 3-4 business days (display this on checkout)
**Why**: Tier-1 fintech provider, observed at Umbrella Labs without termination, lower processor risk than cards.
**UX**: Radio button at checkout, "Save 5% with Pay-by-Bank — 3-4 day clearance".
**Implementation**: Plaid Link integration; new adapter in `lib/payments/`.

### Rail 3 (optional, Phase 2 after first revenue signal): High-Risk Cards

**Provider candidates** (after compliance review, only one): MESH Network OR MAX Redemption OR Rocketfuel
**Statement descriptor**: camouflaged ("UNBLOCK" or similar non-brand)
**Per-transaction cap**: $1,000
**Discount offered**: none (cards are full price)
**Why deferred to Phase 2**: high termination risk, requires merchant-account onboarding (KYC, business history, financials), best activated after demonstrating revenue at Tier 2 to ease underwriting.

## Forbidden rails

Per `payment_processor_posture.md` §1.E and Stripe/PayPal/Square public terms:

- **Stripe direct** — explicitly bans "research chemicals" category.
- **PayPal direct** — explicitly bans this category. Also high chargeback risk.
- **Square direct** — explicitly bans.
- **Shopify Payments** — bans peptides; switching to alternative processor on Shopify also flagged.

## Multi-processor card routing (if Phase 2 activates)

Per `payment_processor_posture.md` §5.2 strategy 1: "Multi-processor card routing" (Behemoth Labz pattern). At least two card processors so termination of one doesn't kill card volume.

## Per-transaction limits as chargeback governor

If Phase 2 cards activate: $1,000 per transaction (Umbrella Labs pattern). Keeps transactions below most card networks' enhanced-monitoring thresholds.

## Statement descriptor camouflage

If Phase 2 cards activate: never use "[BRAND]" or "Peptides" in the statement descriptor. Use a non-brand string like "UNBLOCK". Reduces buyer-side dispute rate and reduces frequency of transaction-monitoring algorithm flags.

## What the buyer sees at checkout

```
Payment Method:
  ( ) Crypto (BTC / LTC / ETH)        Save 10-15%   [recommended]
  ( ) Bank Transfer (US ACH)          Save 5%, 3-4 day clearance
  [ Phase 2 ] ( ) Credit / Debit Card                    [coming soon]
```

Clear hierarchy. Crypto-first incentivizes low-risk demand. ACH for buyers who don't have crypto. Cards in Phase 2 only.

## Discount-tier demand shaping rationale

Per `payment_processor_posture.md` §5.2 strategy 8: discounts shift demand AWAY from cards (chargeback-risk-heavy) toward irreversible rails. Effective and observable at Limitless Life (10% crypto / 5% bank), SwissChems (20% Bitcoin pre-retraction), Behemoth Labz (11% crypto), Umbrella Labs (5% Plaid ACH).

## Implementation contract for Mogtrix adapter

The Mogtrix payment adapter pattern (`lib/payments/{config,index,server,types,stripe,stub}.ts`) is already pluggable. The super-prompt prescribes:

1. New `lib/payments/btcpay.ts` adapter implementing `PaymentProvider` interface.
2. New `lib/payments/plaid.ts` adapter implementing `PaymentProvider` interface.
3. Remove `lib/payments/stripe.ts` from `config.ts` registration; keep file for Phase 2.
4. Update `PAYMENT_PROVIDER` env to support `btcpay` or `plaid` (or `stub` for dev).
5. Webhook reconciliation in `lib/payments/reconciliation.ts` extends to BTCPay invoice-paid webhook + Plaid auth-completed callback.
6. Order status transitions stay the same; only the payment-confirmation source changes.

## How to extend

Replace this file's body when Phase 2 activates:

```
LOCKED: payment stack updated <date>
Phase 1: BTCPay (BTC/LTC/ETH) + Plaid (ACH) — confirmed live
Phase 2 added: <provider name>, <date>
Phase 2 underwriting: <result>
Statement descriptor: <string>
Per-transaction cap: $<amount>
Discount tier: <%>
Multi-processor routing: <yes/no, second processor name>
```
