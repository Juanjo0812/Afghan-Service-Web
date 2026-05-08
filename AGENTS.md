# AGENTS.md — Afghan Support Phoenix

These instructions apply to everything under this repository.

## Non-negotiables

- Use conventional commits only. Never add `Co-Authored-By` or AI attribution.
- Do not run `npm run build` after changes unless the maintainer explicitly overrides this rule.
- Keep answers, docs, PR notes, and handoffs short first. Expand only when the task genuinely needs detail.
- Verify claims against code before stating them. If a claim is wrong, explain why with file-level evidence.
- Treat AI as an execution tool, not the architect. Human intent leads; agents execute bounded work.

## Product constraints

- The public site is for Afghan families in Phoenix, Arizona.
- Legal and immigration content must be static, curated, and reviewed. Do not generate legal advice dynamically.
- The chatbot must be deterministic: local JSON knowledge base + keyword/scoring match only. No LLMs, embeddings, or external chatbot APIs.
- Do not store PII. Contact submissions may be emailed through an approved provider, but the app must not persist form data.
- Multilingual support target: English, Dari, Pashto, Uzbek. Dari/Pashto need RTL support.

## Project shape

- App root: `app/`
- Main app entry: `app/src/App.tsx`
- Page sections: `app/src/sections/`
- Static assets: `app/public/images/` and `app/public/videos/`
- Product docs: `app/docs/PRD_Afghan_Support_Part1.md` and `app/docs/PRD_Afghan_Support_Part2.md`

## Implementation guidance for sub-agents

- Start from the PRD and implement in small, reviewable slices.
- Prefer one sub-agent per bounded work packet: data extraction, contact flow, chatbot engine, accessibility, SEO, i18n/RTL, dependency cleanup.
- Preserve the current visual direction: institutional, warm, simple, accessible. No SaaS/glassmorphism/dark-mode gimmicks.
- Update the relevant Markdown when implementation changes product behavior, current status, or handoff instructions.
