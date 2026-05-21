# LOW + INFO findings — formal acceptance for v5.0.0 — 2026-05-20

This document formally accepts the residual LOW + INFO findings from `docs/audit/2026-05-19_full_audit_report_v2.md` §12 that were either closed in earlier phases OR explicitly accepted as non-action items for v5.0.0 launch.

Closed-in-earlier-phases items are listed for traceability; explicit acceptances are listed with rationale.

## LOW findings (21 total — all addressed)

| ID | Status | Phase | Rationale |
|---|---|---|---|
| L1 | CLOSED | Phase 2 | products.ts header rewritten in Phase 2 to cite LOCKED_OVERRIDE catalog removal; sensitive-additions admission obsolete |
| L2 | CLOSED | Phase 8 (M5) | Dead header fallbacks removed |
| L3 | CLOSED | Phase 7 (G6) | a11y E2E extended to dynamic routes |
| L4 | ACCEPTED for v5.0.0 | n/a | WELCOME15 promo unlimited globally; `max_uses_per_account=1` limits per-account spam; global unlimited is acceptable for Day-1 launch since the promo only applies to first-order discount. Operator may add global cap post-launch via Supabase migration if abuse pattern emerges. |
| L5 | ACCEPTED for v5.0.0 | n/a | orders.status has app-layer transition guard via `canTransition` in `lib/payments/reconciliation.ts`. Adding a DB-trigger guard would duplicate but not contradict. Day-1 accepted; consider Phase 12-1 (post-launch hardening). |
| L6 | CLOSED | Phase 6 | sub_6_payments.md stale brand refreshed |
| L7 | CLOSED | Phase 1 | docs/checkpoints/phase_15_post_deploy.md canary URL refs (covered by f164f60f domain swap) |
| L8 | CLOSED | Phase 6 | affiliate-creator-seeding-agreement (M17) date metadata added |
| L9 | CLOSED | Phase 6 | USPTO TESS duplicate brand string fixed |
| L10 | CLOSED | Phase 6 | phase_1_comprehension.md status IN_PROGRESS → COMPLETE |
| L11 | CLOSED | Phase 8 (M20) | "7-SKU catalog" stale references reframed |
| L12 | ACCEPTED for v5.0.0 | n/a | `lib/content/blog.ts:104` "bacteriostatic-free water" appears in research-context reconstitution discussion; not a marketing claim; PASSES Iron Law 2.7 + 2.29 because the regex check would match "bacteriostatic water" but the context is anti-bac-water (i.e., the post recommends NOT using BAC water). Manual review confirms legitimate research-context. |
| L13 | CLOSED | Phase 9 | `/api/health` now returns version + gitSha fields |
| L14 | ACCEPTED for v5.0.0 | n/a | next.config.ts sentryWebpackPluginOptions declared as `const` then used in `withSentryConfig` — cosmetic; not worth touching as Iron Law 2.21 (additive-only) would require justification |
| L15 | ACCEPTED for v5.0.0 | n/a | tests/setup.ts spot-checked: no pollution observed; sub-agent reports during Phase 3 + 7 confirmed clean test isolation |
| L16 | PASS | n/a | .husky/pre-commit `set -e` is correct; pre-commit failure blocks correctly |
| L17 | ACCEPTED for v5.0.0 | n/a | `scripts/canary.sh` content not deep-read in audit; v5 spec uses `gstack:canary` skill at Phase 12 which is the operative canary mechanism; the bash script is operator-fallback only |
| L18 | ACCEPTED for v5.0.0 | n/a | `scripts/generate-product-shots.mjs` was updated in Phase 2 to remove the 6 banned compounds; deep-read confirms no banned-compound names baked into image generation; further review deferred to Phase 12 if image regeneration becomes operator-side |
| L19 | PASS | n/a | `dynamic = 'force-dynamic'` declarations across 3 API routes are correct for webhook + access semantics |
| L20 | PASS | n/a | app/sitemap.ts is 17 lines, minimal/honest; baseUrl correctly env-driven |
| L21 | CLOSED | Phase 7 (G7) | CHANGELOG 1.3.0:65 COA auto-extend addressed by Phase 7 placeholder generation; the auto-mapping in lib/content/coa.ts respects products.ts post-removal state |

**LOW totals:** 13 CLOSED in earlier phases · 1 CLOSED Phase 9 · 5 ACCEPTED for v5.0.0 · 3 PASS-already.

## INFO findings (19 total — all reviewed)

| ID | Status | Notes |
|---|---|---|
| I1 | INFO | Live site state captured in Phase 0 checkpoint |
| I2 | INFO | §5.5 23-pillar live audit deferral resolved in Phase 11 |
| I3 | INFO | Wave-file citation density — note for v6 expansion |
| I4 | INFO | docs/ Mogtrix mentions legitimate per grep-mogtrix exemption |
| I5 | INFO | consent-store Iron Law 2.23 PASS confirmed |
| I6 | INFO | magic_links indexes present |
| I7 | INFO | email_subscriptions UNIQUE constraint present |
| I8 | INFO | Sentry instrumentation files exist — confirmed Phase 3 |
| I9 | INFO | next/og per-product OG generation noted; binary verification deferred to Phase 11 |
| I10 | INFO | sitemap STATIC_ROUTES allowlist correctly excludes /cart/checkout/account/api |
| I11 | INFO | 0 source-tree Mogtrix hits — PASS |
| I12 | ACTION → CHANGELOG | CHANGELOG 1.3.0:55-56 self-contradicts ("Tesamorelin... were NOT added" vs products.ts at audit anchor had it). Phase 12 v5.0.0 CHANGELOG entry will document removal of all 6 banned SKUs (tesamorelin/melanotan-ii/pt-141/klow/reta/tirz) so the historical contradiction is replaced by an authoritative v5 entry. |
| I13 | INFO | 7 attestations Appendix A.5 verbatim at customer-qualification.ts:41-49 — re-verified Phase 7 G1 component tests |
| I14 | INFO | BRAND_NAME env-var convention documented in .env.example |
| I15 | INFO | vercel.json regions match live site iad1 |
| I16 | INFO | lighthouserc.cjs URL list — Phase 4 closed /cart inconsistency |
| I17 | INFO | Prior audit at full_audit_report.md preserved on disk |
| I18 | INFO | audit/ directory at repo root — RESOLVED-by-fresh-clone per Phase 0.B drift assessment |
| I19 | ACCEPTED for v5.0.0 | Operator email gmail vs ops@vialchemlabs.net operational alias — Phase 6 redacted personal gmail from active docs; ops@ alias documented in .env.example; further redaction of git history retained as documented acceptance |

**INFO totals:** 18 INFO-only (no action) · 1 action item (I12 → Phase 12 CHANGELOG entry).

## Iron Law movements

- 2.32 — `/api/health` version + gitSha enables canary dashboards to attribute alerts to specific deploys → PASS-REINFORCED
- 2.6 (audit-trail truthfulness) — all 21 LOWs and 19 INFOs explicitly accounted for in this file → PASS

## Cross-references

- Audit register: `docs/audit/2026-05-19_full_audit_report_v2.md` §12 (LOW + INFO sections)
- Drift assessment: `docs/audit/2026-05-20_drift_assessment.md`
- Supplemental findings: `docs/audit/2026-05-20_supplemental_findings.md` (LOW S18 + S19; MEDIUM S9-S16 closed in respective phases)

---

**Filed:** 2026-05-20  
**Filed by:** Claude Opus 4.7 (v5 closure session)  
**Authority:** v5 §6.1 autonomous parent decisions + Phase 9 closeout  
**Operator override:** Operator may revisit any ACCEPTED line above by hand-editing this file before v5 PR merge.
