# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | ~/.config/opencode/skills/branch-pr/SKILL.md |
| when a PR would exceed 400 changed lines, when planning chained PRs, stacked PRs, or reviewable slices | chained-pr | ~/.config/opencode/skills/chained-pr/SKILL.md |
| when writing guides, READMEs, RFCs, onboarding docs, architecture docs, or review-facing documentation | cognitive-doc-design | ~/.config/opencode/skills/cognitive-doc-design/SKILL.md |
| when drafting or posting feedback, review comments, maintainer replies, Slack messages, or GitHub comments | comment-writer | ~/.config/opencode/skills/comment-writer/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | ~/.config/opencode/skills/go-testing/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | ~/.config/opencode/skills/issue-creation/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | ~/.config/opencode/skills/judgment-day/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | ~/.config/opencode/skills/skill-creator/SKILL.md |
| when implementing a change, preparing commits, splitting PRs, or planning chained or stacked PRs | work-unit-commits | ~/.config/opencode/skills/work-unit-commits/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Every PR MUST link an approved issue — no exceptions
- Every PR MUST have exactly one `type:*` label
- Branch naming: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)/[a-z0-9._-]+$`
- Conventional commits: `type(scope): description` or `type: description`
- PR body MUST contain: linked issue (Closes #N), PR type (checked), summary, changes table, test plan, contributor checklist
- Never add `Co-Authored-By` or AI attribution to commits

### chained-pr
- MUST split when PR exceeds 400 changed lines (additions + deletions)
- Every chained PR MUST state start/end/before/after boundaries
- Every chained PR MUST be autonomous: CI green, clear scope, reasonable rollback, verification included
- Include dependency diagram marking current PR with 📍
- Feature Branch Chain: child PRs target immediate parent, NOT main and NOT tracker after PR #1

### cognitive-doc-design
- Lead with the answer — decision/action first, context after
- Progressive disclosure: happy path first, then details, edge cases, references
- Use tables, checklists, examples over prose
- For PR docs: state what to review first, what is out of scope, link prev/next PR

### comment-writer
- Start with the actionable point — don't recap whole PR before feedback
- Be warm and direct like a thoughtful teammate, not a corporate bot
- Prefer 1-3 short paragraphs or tight bullet list
- Explain WHY when asking for a change
- Match thread language; in Spanish use Rioplatense/voseo (podés, tenés, fijate, dale)
- No em dashes — use commas, periods, parentheses instead

### go-testing
- Table-driven tests for multiple cases: `t.Run(tt.name, ...)`
- Bubbletea TUI: test model state transitions via `m.Update(tea.KeyMsg{...})`
- Integration: use `teatest.NewTestModel(t, m)` for full flows
- Golden file testing: compare output against `testdata/*.golden` files

### issue-creation
- Issues MUST use a template (bug report or feature request) — blank issues disabled
- Every issue auto-gets `status:needs-review` on creation
- Maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, NOT issues
- Search existing issues for duplicates before creating

### judgment-day
- Launch TWO independent judge sub-agents in parallel (delegate, async)
- Orchestrator NEVER reviews code itself — only coordinates
- Fix Agent is a separate delegation — never use a judge as fixer
- After 2 fix iterations, ASK user before continuing
- Must NOT declare APPROVED until: Round 1 judges return CLEAN, OR Round 2 confirms 0 CRITICALs + 0 confirmed real WARNINGs
- Classify warnings: real (normal user can trigger) vs theoretical (contrived scenario)

### skill-creator
- Skill structure: `skills/{name}/SKILL.md` with frontmatter (name, description, license, metadata)
- Description MUST include "Trigger:" for auto-loading
- Use `assets/` for templates/schemas, `references/` for local doc links
- Don't create skills for one-off tasks or trivial patterns
- Naming: `{technology}`, `{project}-{component}`, `{action}-{target}`

### work-unit-commits
- Commit by deliverable work unit, NOT by file type
- Keep tests in same commit as the behavior they verify
- Keep docs in same commit as the user-visible change
- Each commit = one clear purpose, repo still makes sense if applied alone
- Work-unit commits are the foundation for chained PRs when >400 lines

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | J:\Web-Afghan-Migrations\AGENTS.md | Project-level conventions and constraints |
| app/docs/PRD_Afghan_Support_Part1.md | J:\Web-Afghan-Migrations\app\docs\PRD_Afghan_Support_Part1.md | Product requirements doc (referenced by AGENTS.md) |
| app/docs/PRD_Afghan_Support_Part2.md | J:\Web-Afghan-Migrations\app\docs\PRD_Afghan_Support_Part2.md | Product requirements doc (referenced by AGENTS.md) |
