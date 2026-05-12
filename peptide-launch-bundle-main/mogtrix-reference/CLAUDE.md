# MOGTRIX Labs Workspace

## Deploy Configuration (configured by /setup-deploy)
- Platform: Vercel
- Production URL: https://mogtrix.bio
- Deploy workflow: auto-deploy on push to main
- Deploy status command: HTTP health check
- Merge method: squash
- Project type: web app
- Post-deploy health check: https://mogtrix.bio/api/health

### Custom deploy hooks
- Pre-merge: `cd site && npm run lint && npm run test && npm run build && npm run test:e2e`
- Deploy trigger: automatic on push to main
- Deploy status: poll production URL
- Health check: https://mogtrix.bio/api/health

### Vercel project settings
- Root Directory: `site`
- Framework Preset: Next.js
- Production Domain: `mogtrix.bio`
- Environment Variables: set every value shown in `site/.env.example`

## Design System

Always read `DESIGN.md` (repo root) before making any visual or UI decision. All font choices, colors, spacing, motion vocabulary, and aesthetic direction are defined there. Do not deviate without explicit user approval. In QA mode, flag any code that doesn't match `DESIGN.md`.

Stack: IBM Plex Sans + IBM Plex Mono + Instrument Serif (italic editorial). Dark-first design (light mode is secondary). Acid-green is the rarest color — sparing CTAs / verify / focus only. Vials rotate continuously in 3D; motion honors `prefers-reduced-motion`. Live preview: `~/.gstack/projects/abhicloses7838-mogtrix-website/designs/design-system-20260505/preview-v2.html`.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. The
skill has multi-step workflows, checklists, and quality gates that produce better
results than an ad-hoc answer. When in doubt, invoke the skill. A false positive is
cheaper than a false negative.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke /office-hours
- Strategy, scope, "think bigger", "what should we build" → invoke /plan-ceo-review
- Architecture, "does this design make sense" → invoke /plan-eng-review
- Design system, brand, "how should this look" → invoke /design-consultation
- Design review of a plan → invoke /plan-design-review
- Developer experience of a plan → invoke /plan-devex-review
- "Review everything", full review pipeline → invoke /autoplan
- Bugs, errors, "why is this broken", "wtf", "this doesn't work" → invoke /investigate
- Test the site, find bugs, "does this work" → invoke /qa (or /qa-only for report only)
- Code review, check the diff, "look at my changes" → invoke /review
- Visual polish, design audit, "this looks off" → invoke /design-review
- Developer experience audit, try onboarding → invoke /devex-review
- Ship, deploy, create a PR, "send it" → invoke /ship
- Merge + deploy + verify → invoke /land-and-deploy
- Configure deployment → invoke /setup-deploy
- Post-deploy monitoring → invoke /canary
- Update docs after shipping → invoke /document-release
- Weekly retro, "how'd we do" → invoke /retro
- Second opinion, codex review → invoke /codex
- Safety mode, careful mode, lock it down → invoke /careful or /guard
- Restrict edits to a directory → invoke /freeze or /unfreeze
- Upgrade gstack → invoke /gstack-upgrade
- Save progress, "save my work" → invoke /context-save
- Resume, restore, "where was I" → invoke /context-restore
- Security audit, OWASP, "is this secure" → invoke /cso
- Make a PDF, document, publication → invoke /make-pdf
- Launch real browser for QA → invoke /open-gstack-browser
- Import cookies for authenticated testing → invoke /setup-browser-cookies
- Performance regression, page speed, benchmarks → invoke /benchmark
- Review what gstack has learned → invoke /learn
- Tune question sensitivity → invoke /plan-tune
- Code quality dashboard → invoke /health
