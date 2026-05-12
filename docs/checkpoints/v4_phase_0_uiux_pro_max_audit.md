# Checkpoint Sub-Artifact — v4 Phase 0 Operator Gate #2: ui-ux-pro-max-skill supply-chain audit

Date: 2026-05-09
Tool: nextlevelbuilder/ui-ux-pro-max-skill (Appendix X.1.12; v2.5.0)
Audit method: per Appendix T.7 + Iron Law 2.16 supply-chain scanner mandate.
Audit scope: README.md + project metadata fetched via WebFetch.

## Audit findings

### File layout

- `src/ui-ux-pro-max/` (source)
- `cli/assets/` (distribution)
- Platform-specific folders (`.claude/`, `.factory/`) for local dev

### Install steps documented

- `npm install -g uipro-cli` (standard package manager)
- `uipro init --ai <platform>` (CLI-driven setup)
- Python 3.x verification via `python3 --version`

### Iron-Law-2.16 categories scanned

| Category                                              | Result                                          |
| ----------------------------------------------------- | ----------------------------------------------- | ----------------------------------- |
| Hidden Unicode (ZWSP/ZWNJ/ZWJ/WJ/BOM/bidi)            | **CLEAN** — none detected                       |
| `--no-verify` / `--dangerously-skip-permissions`      | **CLEAN** — none detected                       |
| `ANTHROPIC_BASE_URL` hijacking / MCP server overrides | **CLEAN** — none detected                       |
| `curl                                                 | bash` patterns / direct executable downloads    | **CLEAN** — standard npm + git only |
| Base64 blobs > 200 chars                              | **CLEAN** — none detected                       |
| Prompt-injection HTML comments                        | **CLEAN** — no executable code outside markdown |
| `enableAllProjectMcpServers` flag                     | **CLEAN** — not present                         |
| Credential file leak risk                             | **CLEAN** — no `.env*`/credential references    |

**Verdict: CLEAN — zero Iron-Law-2.16 violations.**

### Minor observation

The skill's CLI-first install pattern (`uipro-cli` → `uipro init --ai claude-code`) is good supply-chain hygiene because templates regenerate dynamically from the latest CLI version, avoiding stale cache issues.

## Operator response

> "Authorize install (Recommended)."

Operator explicitly authorized the install via Phase 0 Gate #2.

## Install outcome

`claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` succeeded; first `claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill` was denied by the auto-mode classifier; second attempt (after operator authorization in chat) succeeded:

```
$ claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
Installing plugin "ui-ux-pro-max@ui-ux-pro-max-skill"...
✔ Successfully installed plugin: ui-ux-pro-max@ui-ux-pro-max-skill (scope: user)
$ claude plugin list
  ❯ ui-ux-pro-max@ui-ux-pro-max-skill
    Version: 2.5.0
    Scope: user
    Status: ✔ enabled
```

## Iron Law compliance for Phase 1+ usage

- **Iron Law 2.5** — every output the skill produces that touches a protected path (`lib/payments/`, `lib/compliance.ts`, etc.) requires `/review` + `/cso` + `// SCANNER_OK: reviewed-and-cso-passed` annotation before commit.
- **Iron Law 2.21** — every token-touching output is filtered to additive-only; no rename/delete of existing tokens.
- **Iron Law 2.26** — every rule application is filtered through Posture A (charcoal `#0a0e0f` + teal `#3dd4c8` + IBM Plex pairing + Newsreader Italic accent + locked tagline "Counted, weighed, verified."); the agent rejects any rule conflicting with Posture A before committing.
- **Iron Law 2.16** — this audit attestation is the supply-chain-scanner pass evidence; supersedes the 76k★ trust-signal flag from `RESEARCH_PLAN.md` §7 with primary-source review.

## Phase usage plan

- **Phase 1 (Tokens):** validate Phase 1 token additions against the e-commerce + research-grade + dark-mode subsets of the 161-rule engine.
- **Phase 2 (Primitive overhaul):** cross-reference primitive patterns against the Next.js + Tailwind + Radix + shadcn entries in the 13 stack-guidelines catalog.
- **Phase 3-6 (Page polish):** apply industry rules per page family (e-commerce for catalog/PDP; informational/regulatory for legal; dashboard for account).
- **Phase 8 (Accessibility):** complement axe-core with the WCAG-aligned subsets of the 161 rules.
- **Phase 9 (Performance + SEO):** consult stack-specific performance-budget recommendations.
