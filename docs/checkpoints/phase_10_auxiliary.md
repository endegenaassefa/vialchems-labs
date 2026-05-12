# Phase 10 — Auxiliary Surfaces (CHECKPOINT)

Date: 2026-05-08
Status: COMPLETE (delivered across Phases 5, 6, 7)

## Auxiliary deliverables

| Item                                            | Phase delivered | Status                                     |
| ----------------------------------------------- | --------------- | ------------------------------------------ |
| Newsletter signup form (footer + /newsletter)   | Phase 7         | ✓                                          |
| Newsletter API (`/api/newsletter/subscribe`)    | Phase 7         | ✓ stub; Phase 10b wires Resend             |
| 4-email welcome sequence templates              | Phase 6         | ✓ verbatim Appendix K                      |
| Lead magnet PDF (Reconstitution Guide)          | Operator action | TBD before launch                          |
| Account dashboard                               | Phase 5         | ✓ stub; Phase 8b wires Supabase Auth       |
| Account orders + addresses + settings           | Phase 5         | ✓ stubs                                    |
| Login + signup forms                            | Phase 5         | ✓ stubs                                    |
| Catalog search (Fuse.js)                        | Phase 5         | ✓                                          |
| Catalog filters (category, in-stock toggle)     | Phase 5         | ✓                                          |
| Catalog sort (price asc/desc, name a-z, newest) | Phase 5         | ✓                                          |
| Recently-viewed products                        | Deferred        | Phase 2 enhancement                        |
| Wishlist                                        | Deferred        | Phase 2 enhancement                        |
| Order tracking page                             | Phase 5         | ✓ /order/[id]                              |
| Refund request flow                             | Phase 5         | ✓ form on order detail                     |
| Affiliate program signup                        | Phase 5         | ✓                                          |
| Affiliate dashboard                             | Phase 5         | ✓ stub                                     |
| Newsletter unsubscribe                          | Stub            | TBD                                        |
| Cookie consent banner                           | Deferred        | Optional Day-1 since no 3rd-party trackers |
| ToS / Privacy / Refund / Shipping / Cookies     | Phase 5         | ✓ verbatim Appendix L                      |
| 404 + 500 brand-consistent                      | Phase 6         | ✓                                          |

## Wiring deferrals

These items are stubbed Day-1 and require operator-side action OR Phase 2 wiring:

1. **Real Resend email sending**: when `RESEND_API_KEY` is set, the newsletter API forwards subscriber to Resend. Day-1 stub: API returns success without actual send.
2. **Real Supabase Auth**: when Supabase project is provisioned, `lib/auth/*` will be ported from Mogtrix with peptide-context customizations. Day-1: stub login/signup forms with placeholder no-op submit.
3. **Real Plaid/BTCPay payment processing**: addressed in Phase 9. Stub adapters Day-1.
4. **Cart cross-reload persistence**: Day-1 in-memory only via Zustand. Phase 2 candidate to add localStorage or Supabase persistence.
5. **Cookie consent banner**: vialchemlabs intentionally does NOT load 3rd-party trackers (no GA, no Meta Pixel, no GTM). The strict-necessary cookie surface (auth, cart, checkout) is permitted by GDPR/CCPA without consent banner. Banner deferred to operator decision post-launch.

## Verification Gate

- [x] Newsletter signup wired (form → API → success)
- [x] Account flow has stubs for orders / addresses / settings / login / signup
- [x] Search + filter + sort work on /shop
- [x] ToS / Privacy / Refund / Shipping / Cookies render verbatim
- [x] All 304 tests pass
- [x] Build succeeds
- [x] grep-mogtrix / grep-forbidden-words / supply-chain-scan all 0 violations
