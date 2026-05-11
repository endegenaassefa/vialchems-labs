#!/usr/bin/env bash
# Phase 12.2 (v4) — branch-protection bootstrap (D24 closure).
#
# Wires `main` so:
#   - PR required (no direct pushes)
#   - Required CI checks: e2e + lighthouse jobs both pass
#   - Required review: 1 approval
#   - Stale review dismissal on new pushes
#   - Conversation resolution required
#   - Linear history enforced (squash-merge friendly)
#   - Force-push blocked
#
# Iron Law 2.25 also requires the operator's GitHub `approved` review
# state on any PR with non-zero visual-regression diffs. The CI workflow
# at .github/workflows/e2e.yml posts a PR comment when that happens; a
# CODEOWNERS or review-required rule enforces that the operator must
# review. Since CODEOWNERS scales better than per-PR rules, we set up
# CODEOWNERS to require operator review on visual-regression files.
#
# Prereqs:
#   - gh CLI authenticated (`gh auth login`) with repo admin scope
#   - GitHub repo lives at endegenaassefa/vialchemlabs (overridable
#     via REPO env var)
#
# Usage: bash scripts/setup-branch-protection.sh
#        REPO=user/repo bash scripts/setup-branch-protection.sh

set -euo pipefail

REPO=${REPO:-endegenaassefa/vialchemlabs}
BRANCH=${BRANCH:-main}

echo "Setting up branch protection on ${REPO}@${BRANCH}..."

# Required CI status checks. Names must match the job names in the
# .github/workflows/*.yml files exactly. Update if you rename jobs.
REQUIRED_CHECKS_JSON='{
  "strict": true,
  "contexts": [
    "e2e / unit-and-preflight",
    "e2e / e2e",
    "lighthouse / lighthouse (desktop)",
    "lighthouse / lighthouse (mobile)"
  ]
}'

REVIEW_JSON='{
  "dismiss_stale_reviews": true,
  "require_code_owner_reviews": true,
  "required_approving_review_count": 1,
  "require_last_push_approval": true
}'

gh api -X PUT \
  -H "Accept: application/vnd.github+json" \
  "repos/${REPO}/branches/${BRANCH}/protection" \
  -f "required_status_checks=${REQUIRED_CHECKS_JSON}" \
  -F "enforce_admins=false" \
  -f "required_pull_request_reviews=${REVIEW_JSON}" \
  -F "restrictions=null" \
  -F "required_linear_history=true" \
  -F "allow_force_pushes=false" \
  -F "allow_deletions=false" \
  -F "block_creations=false" \
  -F "required_conversation_resolution=true" \
  -F "lock_branch=false" \
  -F "allow_fork_syncing=true"

echo "Branch protection applied to ${REPO}@${BRANCH}."

# CODEOWNERS to require operator review on visual-regression files +
# protected-paths (Iron Law 2.5 / 2.19). The operator's GitHub username
# defaults to endegenaassefa and is overridable via OPERATOR_LOGIN env.
OPERATOR_LOGIN=${OPERATOR_LOGIN:-endegenaassefa}

if [ ! -f .github/CODEOWNERS ]; then
  cat > .github/CODEOWNERS <<EOF
# Iron Law 2.25 — visual-regression baseline diffs require operator review
tests/e2e/visual-regression.spec.ts                     @${OPERATOR_LOGIN}
tests/e2e/visual-regression.spec.ts-snapshots/**        @${OPERATOR_LOGIN}

# Iron Law 2.5 / 2.19 — protected payment + compliance + qualification paths
lib/payments/**                                          @${OPERATOR_LOGIN}
lib/compliance.ts                                        @${OPERATOR_LOGIN}
lib/compliance/jurisdictions.ts                          @${OPERATOR_LOGIN}
lib/customer-qualification.ts                            @${OPERATOR_LOGIN}
lib/attestations.ts                                      @${OPERATOR_LOGIN}
lib/content/products.ts                                  @${OPERATOR_LOGIN}
lib/content/product-descriptions.ts                      @${OPERATOR_LOGIN}
app/api/payments/**                                      @${OPERATOR_LOGIN}
app/api/access/**                                        @${OPERATOR_LOGIN}
supabase/migrations/**                                   @${OPERATOR_LOGIN}
components/CookieConsent.tsx                             @${OPERATOR_LOGIN}
lib/consent-store.ts                                     @${OPERATOR_LOGIN}
lib/sentry.ts                                            @${OPERATOR_LOGIN}
EOF
  echo "Wrote .github/CODEOWNERS — review + commit + push to activate."
fi

echo
echo "Done. Verify in repo Settings → Branches → main."
echo "If the required-checks list shows 'Pending' or 'Not found', the"
echo "first PR run will register the checks; re-run this script after"
echo "the first CI run completes."
