# Checkpoint Sub-Artifact — v4 Phase 0 Operator Gate #1: huashu-design license

Date: 2026-05-09
Tool: alchaincyf/huashu-design (Appendix X.1.4)
Stated commercial license cost: $1,800/year recurring OR $3,500 one-time (per `RESEARCH_PLAN.md` §7).

## Operator response (verbatim, in Phase 0 chat)

> "Personal use is free and unrestricted — studying, research, creating things for yourself, writing articles, side projects, personal social media. Use it freely, no need to ask. I am building this website to test if this idea works."

## License posture

Operator confirmed the current vialchemlabs Phase 0 build qualifies as personal/research/side-project use under huashu-design's license terms. **No commercial license payment required for the present scope.** If/when vialchemlabs transitions from "testing if this idea works" to commercial revenue ≥ huashu-design's commercial threshold, operator agrees to revisit licensing per the upstream README at https://github.com/alchaincyf/huashu-design.

## Install attempt outcome

`npx -y skills@latest add alchaincyf/huashu-design --yes` was attempted in this Phase 0 session but **denied by the Claude Code auto-mode classifier** (third-party fetch policy) despite operator authorization. Logged for record.

## Decision: DEFERRED-to-Phase-1

Per the v4 super-prompt §X.1.4 fallback clause, when huashu-design is not available, "Phase 2 + Phase 4 fall back to `pbakaus/impeccable` + `nextlevelbuilder/ui-ux-pro-max-skill` for the design-fidelity protocol." Both fallback tools are installed and working.

If Phase 1 token elevation surfaces a critique gap that only huashu's 20-design-philosophies vocabulary fills, retry the install at Phase 1 entry; operator may run the install directly via `! npx -y skills@latest add alchaincyf/huashu-design --yes` in chat, which executes outside the auto-mode classifier's third-party-fetch policy.

## Iron Law compliance

- Iron Law 2.22 (no real credentials in source): operator's license posture is documented in this checkpoint, not in committed source — preserves the spirit of the law (license is a financial fact, not a credential).
- Iron Law 2.16 (supply-chain scanner mandatory): the scanner did not get to fire because the install was denied; nothing was added to the codebase. No supply-chain risk introduced.
- Iron Law 2.26 (brand expression locked): no huashu-design output applied to the codebase yet; brand stays inviolate.
