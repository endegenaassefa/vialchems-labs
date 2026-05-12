# Setup + Run Instructions

Step-by-step. ~30 minutes from clone to first prompt-paste.

---

## 1. Clone or extract the bundle

```bash
git clone <bundle-repo-url> peptide-launch-bundle
cd peptide-launch-bundle
```

Or if you received a tarball:
```bash
tar -xzf peptide-launch-bundle.tar.gz
cd peptide-launch-bundle
```

Verify the structure:
```bash
ls -la
# Should show: corpus/ mogtrix-reference/ README.md SETUP.md .env.example .gitignore
```

---

## 2. Install required tooling

You need:
- **Git** (required)
- **Node.js 20+** + **npm** (required for Next.js build)
- **Claude Code CLI** (`claude`) OR **Codex CLI** (`codex`) — pick one
- **Vercel CLI** (`npm i -g vercel`)
- **Supabase CLI** (`npm i -g supabase`)
- **Curl** + **jq** (typically pre-installed)
- **Docker** (only if you'll self-host BTCPay Server in Phase 9)

Verify:
```bash
node --version  # 20+
npm --version
git --version
claude --version  # OR: codex --version
vercel --version
supabase --version
```

---

## 3. Set up credentials (.env)

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```bash
# Site config
SITE_URL=https://numeruspeptides.com  # or your chosen domain
BRAND_NAME=Numerus Labs               # or your chosen brand

# Supabase (create new project at supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from supabase dashboard>

# Payment (Phase 9; can be stub for dev)
PAYMENT_PROVIDER=stub                  # stub for dev; btcpay or plaid for prod

# BTCPay (Phase 9)
BTCPAY_URL=https://your-btcpay-server.example.com
BTCPAY_API_KEY=<from BTCPay store settings>
BTCPAY_STORE_ID=<from BTCPay store settings>
BTCPAY_WEBHOOK_SECRET=<random string>

# Plaid (Phase 9)
PLAID_CLIENT_ID=<from plaid dashboard>
PLAID_SECRET=<from plaid dashboard>
PLAID_ENV=sandbox                      # or production
PLAID_PRODUCTS=auth,transactions
PLAID_COUNTRY_CODES=US

# Email (Phase 6, 10)
RESEND_API_KEY=<from resend.com>
ORDER_EMAIL_FROM=research@numeruspeptides.com
ORDER_STAFF_EMAILS=ops@numeruspeptides.com

# Sentry (Phase 3, 15)
NEXT_PUBLIC_SENTRY_DSN=<from sentry.io project settings>
SENTRY_AUTH_TOKEN=<from sentry account settings>
SENTRY_ORG=<your sentry org slug>
SENTRY_PROJECT=<your sentry project slug>

# Lab partner (Phase 7) — Janoshik recommended
LAB_PARTNER_NAME=Janoshik Analytical
LAB_PARTNER_PORTAL_URL=https://janoshik.com
```

Operator-side accounts to create before running:
- [ ] Supabase project: https://supabase.com
- [ ] Vercel account: https://vercel.com
- [ ] Resend account: https://resend.com
- [ ] Sentry project: https://sentry.io
- [ ] Plaid account: https://plaid.com (sandbox first)
- [ ] BTCPay Server: self-hosted (see `corpus/SUPER_PROMPT_v3_2026-05-08.md` Phase 9, scripts/btcpay-setup.sh)
- [ ] LLC formed (Wyoming/Delaware/Nevada recommended)
- [ ] Domain registered (numeruspeptides.com or your chosen)

---

## 4. Read the research corpus orientation

Critical: do this BEFORE running the prompt. ~30 minutes.

1. **`corpus/NAVIGATION_GUIDE.md`** — find any answer in <30 seconds via question→file index
2. **`corpus/AUDIT_2026-05-08.md`** — understand pipeline state (Pillar A 95% / Pillar C 65% / Pillar B 40% / Compliance 95% / Brand 100%) + gap inventory
3. **`corpus/STAGE6_README.md`** — corpus layout guide
4. **`corpus/01_strategic_frame/bible_final.md`** — strategic foundation (the "why")

---

## 5. Lock or accept defaults on the 5 operator decisions

Open each file in `corpus/DECISIONS/` and decide:

### `corpus/DECISIONS/brand_pick.md` (PENDING)

Pick a brand from the 34 candidates in `corpus/03_final/brand_name_candidates.md`. Recommended defaults:
- **Posture A clean clinical**: Numerus Labs (default if you don't pick)
- **Posture B meme-coded community**: Skullcap Labs
- **Cross-Posture flexible**: Bezel Bio

To lock, replace the file body with:
```
LOCKED: Numerus Labs
Posture: A
Locked-on: 2026-05-08
Domain registered: yes, numeruspeptides.com via <registrar>
Trademark searched: yes, USPTO TESS clear
Rationale: <2-3 sentences>
```

### `corpus/DECISIONS/source_terms.md` (PENDING)

Direct conversation with your supplier. Capture:
- MOQ per peptide
- Restocking lead time
- Lab-test passthrough format
- Contingency posture
- Per-mg cost at trial volume
- Vialing supply chain
- Shipping origin (drop-ship vs repackaged)
- Payment terms

If pending: agent uses functional placeholder values; you confirm post-build.

### `corpus/DECISIONS/opening_sku_set.md` (LOCKED_DEFAULT)

7 SKUs locked at researched prices. Operator may override with `LOCKED_OVERRIDE:` and rationale, or accept as-is.

### `corpus/DECISIONS/compliance_posture.md` (LOCKED_DEFAULT)

Verbatim disclaimers, age gate, jurisdictional restrictions, 503A/503B footer. Operator may strengthen, never weaken.

### `corpus/DECISIONS/payment_stack.md` (LOCKED_DEFAULT)

BTCPay + Plaid for Day-1; cards Phase 2. Operator may extend with cards after first revenue signal.

---

## 6. Optional: fire B1 (community channels) before build

If you have ChatGPT Pro Deep Research access (~$200/month), fire the prompt at `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md` (in your operator's setup) and save output to `corpus/02_claude_code_outputs/slice_B1_reddit_and_forum_ecosystem.md`. This fills the dominant Pillar B gap (Reddit + forums + Telegram + Discord acquisition strategy).

If you skip: the build proceeds with Slice 3 sections marked `PLACEHOLDER AWAITING SLICE 3 FIRE` in the operator runbook.

---

## 7. Pick a NEW project directory

The build creates a NEW Next.js project. NOT inside this bundle, NOT inside `mogtrix-reference/`, NOT inside `corpus/`.

Recommended:
```bash
mkdir -p ~/peptide-site
cd ~/peptide-site
```

Or your preferred path. The directory must NOT exist yet, OR must be empty. Phase 0 of the build verifies this.

---

## 8. Run the prompt

### 8.1 If using Claude Code CLI

```bash
cd ~/peptide-site
claude
```

In the Claude Code prompt, paste this opening message:

```
Run the following super-prompt end-to-end. Begin at Phase 0.

[paste full content of /path/to/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md]
```

To get the full content quickly:
```bash
cat /path/to/peptide-launch-bundle/corpus/SUPER_PROMPT_v3_2026-05-08.md | xclip -selection clipboard
# (Linux with xclip; or use pbcopy on macOS, or open the file and copy-all)
```

The prompt is self-contained. Phase 0 will:
- Read the manifest at `corpus/STAGE6_MANIFEST.yaml`
- Verify tooling
- Surface brand-pick auto-default (Numerus Labs unless you locked something else)
- Confirm new project directory
- Proceed through Phases 1-15

Total wall-clock: ~12-18 hours. Resumable at phase boundaries via `/context-save` checkpoints.

### 8.2 If using Codex CLI

The super-prompt was written for Claude Code. Codex doesn't have Superpowers or gstack. Friend has two options:

**Option A: Run as-is, manually translate tooling references**

Open Codex in your new project directory:
```bash
cd ~/peptide-site
codex
```

Paste this opening message:
```
You are running a peptide e-commerce site build via Codex CLI.

Tooling adaptations: where the prompt references Superpowers skills (superpowers:*) or gstack slash commands (/qa, /review, /cso, etc.), perform the equivalent manually:

- superpowers:test-driven-development → manual TDD: failing test, verify fails, minimum code, verify passes
- superpowers:writing-plans → write plan to docs/plans/<date>-phase-<N>.md
- superpowers:subagent-driven-development → use Codex's native subagent dispatch
- superpowers:verification-before-completion → before claiming done, run the verifying command in this session and read full output
- superpowers:systematic-debugging → 4-phase root-cause investigation before any fix attempt
- superpowers:requesting-code-review / receiving-code-review → manual peer review
- superpowers:using-git-worktrees → manual git worktree add
- superpowers:finishing-a-development-branch → manual: tests pass + git status clean + commit + branch
- gstack /qa → manual end-to-end test of the live site
- gstack /qa-only → same, report-only
- gstack /review → manual diff review with care; optionally invoke a fresh OpenAI session for second-opinion code-review
- gstack /cso → manual security review of payment + compliance code; check npm audit; cross-check with another model
- gstack /design-review → compare against design tokens (corpus/SUPER_PROMPT_v3 §7) + pre-delivery checklist (Appendix W)
- gstack /benchmark → run Lighthouse manually on each page
- gstack /codex review → already on Codex; this is recursive; skip
- gstack /ship → manual VERSION bump + CHANGELOG + git push + create PR
- gstack /land-and-deploy → manual merge PR + Vercel deploy + canary verify
- gstack /canary → manual post-deploy monitoring (browser console + Sentry dashboard for 2 hours)
- gstack /document-release → manual README/ARCHITECTURE/CHANGELOG updates
- gstack /careful → exercise judgment on destructive operations (rm -rf, DROP TABLE, force-push)
- gstack /freeze → restrict edits to the specified directory by self-discipline
- gstack /context-save → save state to docs/checkpoints/state-<timestamp>.md manually
- gstack /context-restore → read most recent docs/checkpoints/ at session start
- TodoWrite → track tasks in docs/TODO.md (one TodoWrite call = one update to TODO.md)

The Iron Laws, Subagent Constitution, decision contract, 15-phase workflow, and all 23 appendices remain authoritative. Compliance + payment + brand quality is non-negotiable; do not skip the verification gates just because the tooling reference is unfamiliar.

Begin at Phase 0.

[paste full content of corpus/SUPER_PROMPT_v3_2026-05-08.md]
```

**Option B: Strip-and-adapt the prompt to Codex-native first** (~1-2 hours)

Edit `corpus/SUPER_PROMPT_v3_2026-05-08.md` and replace every `superpowers:*` and `gstack /*` reference with inline procedural descriptions matching the adaptations in Option A. Save as `corpus/SUPER_PROMPT_v3_codex.md`. Paste that instead.

Quality drop on Codex: ~20-30% vs Claude Code (loses automated `/cso`, `/design-review`, `/benchmark` discipline). Still functional for v0 trial.

---

## 9. Operator interventions during the run

The agent is largely autonomous but will surface decisions:

| Phase | Operator action |
|---|---|
| Phase 0 | Confirm new project directory + brand pick |
| Phase 3 | Provide Supabase + Resend + Sentry credentials when agent prompts (or it reads from .env if you've set them) |
| Phase 7 | Lab partner name (Janoshik default if PENDING) |
| Phase 9 | BTCPay Server provisioning (operator runs scripts/btcpay-setup.sh separately) + Plaid credentials |
| Phase 14 | Domain confirmation, Vercel project linkage, GitHub repo for PR review |

Otherwise the agent surfaces a one-screen status update at end of each phase. Check in at phase boundaries; don't babysit between.

---

## 10. If something goes wrong

- **Iron Law 2.17**: if any task fails 3+ times, agent stops and writes `docs/checkpoints/introspection_<phase>_<timestamp>.md`. Read it; tell the agent how to recover.
- **Verification gate fails**: agent halts the phase. Don't bypass; let it fix per the retry protocol.
- **Session truly drifts**: run `/context-save` (or manual state save on Codex), start fresh session, paste a "resume from <checkpoint>" message.
- **Compliance grep fails**: agent caught a forbidden marketing word. Fix the copy; re-run the grep until 0 hits. Iron Law 2.4 is non-negotiable.
- **Payment integration fails**: invoke `/codex review` (or Codex equivalent) for second-opinion. Iron Law 2.5 means no payment changes without `/review` + `/cso` gates.

---

## 11. After the build completes (Phase 15 done)

- The site is deployed to Vercel production
- Sentry monitoring is live
- Operator runbook at `docs/operator-runbook.md` covers Day-1 / Weeks-2-4 / Months-2-3 acquisition strategy
- COA library has placeholder PDFs marked `EXAMPLE_COA — REPLACE BEFORE LAUNCH` (operator replaces with real lab COAs as orders flow)
- `.env.production` reflects the locked credentials
- Newsletter welcome sequence is wired
- Stripe Phase 2 stub exists for future activation

Operator post-build:
- Replace placeholder COAs with real ones from Janoshik (or chosen lab)
- File the LLC paperwork if not already done
- Verify payment flow with first order from a friendly buyer
- Begin Day-1 acquisition runbook execution
- Schedule weekly `/retro` (or manual retrospective) for first 4 weeks

---

## 12. Helpful corpus paths

For everyday reference:
- Brand candidates: `corpus/03_final/brand_name_candidates.md`
- Compliance findings: `corpus/02_claude_code_outputs/compliance_disclaimers/COMPLIANCE_DISCLAIMER_FINDINGS.md`
- FDA enforcement events: `corpus/02_claude_code_outputs/compliance_disclaimers/enforcement_events.md`
- Pricing matrix: `corpus/02_claude_code_outputs/pricing_matrix.csv`
- Per-peptide distributions: `corpus/02_claude_code_outputs/sku_distributions.md`
- Acquisition channels (13 files): `corpus/02_claude_code_outputs/acquisition_channels/`
- Influencer tier map: `corpus/02_claude_code_outputs/slice_B2_influencer_tier_map.md`
- Per-vendor profiles (208): `corpus/02_claude_code_outputs/vendors/<slug>.json`
- Per-vendor verbatim quotes (206): `corpus/02_claude_code_outputs/evidence/<slug>.txt`

Or just use `corpus/NAVIGATION_GUIDE.md` for question-driven lookup.

---

## 13. Compliance + safety reminder

This build operates in the US gray-legal research-peptide market. The compliance contract (`corpus/DECISIONS/compliance_posture.md`) is non-bypassable:
- 19 documented FDA warning letters in the corpus inform what NOT to say
- 21 CFR 201.128 "intended use" framework governs every product description
- ITC GEO 337-TA-1377 makes tirzepatide a perpetual exclusion
- BAC water + peptide bundling = drug intent (March 2026 wave)
- Personal pronouns describing compound effects are forbidden
- All marketing copy passes `assertMarketingCopySafe` filtering

If you (operator) decide to weaken any of these, do so deliberately and with legal counsel. The build will not weaken on its own; the agent rejects weakening edits.

---

## Questions

Read `corpus/NAVIGATION_GUIDE.md` first. Almost every common question is mapped there.
