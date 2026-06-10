# Skill Registry — web-afghan-migrations

Generated: 2026-06-03 | SDD init phase

## Project Conventions

| File | Role |
|---|---|
| `AGENTS.md` | Project-level agent instructions (non-negotiables, product constraints, project shape, testing, verification, implementation guidance) |
| `app/docs/PRD_Afghan_Support_Realistic.md` | Active PRD — source of truth for product scope |
| `app/package.json` | Dependencies, scripts (`pnpm` only, never `npm`) |

### Key Rules from AGENTS.md
- Conventional commits only, no AI attribution
- `pnpm` exclusively, NEVER `npm`
- No `pnpm run build` locally — Vercel builds on deploy
- Legal content static/curated/reviewed — no dynamic legal advice
- Chatbot deterministic only: local JSON + keyword/scoring match, no LLMs
- No PII storage; IP addresses HMAC-hashed for rate limiter keys
- Multilingual: Dari (default), English, Afghan Uzbek, Pashto — RTL for Dari/Afghan Uzbek/Pashto
- Prefer sub-agents per bounded work packet
- Visual direction: institutional, warm, simple, accessible — no SaaS/glassmorphism/dark-mode gimmicks

### Verification Gates
```bash
pnpm lint                                      # ESLint — exit 0
pnpm exec tsc --noEmit --incremental false       # TypeScript — exit 0
pnpm test                                      # Vitest — all pass
pnpm audit --prod --audit-level moderate         # Production deps audit
```

## User-Level Skills

| Skill | Trigger | Location |
|---|---|---|
| `work-unit-commits` | implementing a change, preparing commits, splitting PRs, chained/stacked PRs | `~/.config/opencode/skills/work-unit-commits/` |
| `comment-writer` | drafting PR/issue/review comments, maintainer replies, Slack/GitHub messages | `~/.config/opencode/skills/comment-writer/` |
| `cognitive-doc-design` | writing guides, READMEs, RFCs, onboarding/architecture/review docs | `~/.config/opencode/skills/cognitive-doc-design/` |
| `chained-pr` | PR exceeds 400 changed lines, planning chained/stacked PRs | `~/.config/opencode/skills/chained-pr/` |
| `issue-creation` | creating GitHub issues, reporting bugs, requesting features | `~/.config/opencode/skills/issue-creation/` |
| `branch-pr` | creating PRs, opening PRs, preparing changes for review | `~/.config/opencode/skills/branch-pr/` |
| `skill-creator` | creating new skills, adding agent instructions, documenting patterns | `~/.config/opencode/skills/skill-creator/` |
| `go-testing` | writing Go tests, using teatest, adding Go test coverage | `~/.config/opencode/skills/go-testing/` |
| `judgment-day` | "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | `~/.config/opencode/skills/judgment-day/` |
| `customize-opencode` | editing opencode config (opencode.json, .opencode/, skill/plugin/MCP setup) | built-in |

## Project-Level Skills

| Skill | Trigger | Location |
|---|---|---|
| `playwright-cli` | browser automation, Playwright tests, web page testing | `.opencode/skills/playwright-cli/` |

## SDD Skills (not auto-loaded — invoked by orchestrator)

| Skill | Phase |
|---|---|
| `sdd-init` | Initialize SDD context |
| `sdd-explore` | Explore/investigate before committing to change |
| `sdd-propose` | Create change proposal |
| `sdd-spec` | Write delta specs |
| `sdd-design` | Technical design document |
| `sdd-tasks` | Implementation task breakdown |
| `sdd-apply` | Implement tasks |
| `sdd-verify` | Validate implementation |
| `sdd-archive` | Archive completed change |
| `sdd-onboard` | Guided SDD walkthrough |
