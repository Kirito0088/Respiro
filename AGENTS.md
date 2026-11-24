<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

---

# Google Antigravity Agent Configuration & Guidelines

PromptWars Challenge 6 is built, maintained, and verified with **Google Antigravity 2.0**. Autonomous agent workflows in this repository follow strict auto-routing, domain modeling, and quality verification protocols.

## 1. Automatic Agent Dispatch Protocol

When handling complex tasks across domains, Antigravity automatically delegates to specialized custom roles:

| Domain / Stack                                      | Role / Agent               | Responsibilities & Toolsets                                                    |
| :-------------------------------------------------- | :------------------------- | :----------------------------------------------------------------------------- |
| **Next.js 16**, **React 19**, **Tailwind CSS 4**    | `fullstack-web-architect`  | Server Components, Partial Prerendering, Radix primitives, responsive UX       |
| **Convex Backend**, **Schema**, **Auth**            | `database-orm-specialist`  | Queries, mutations, actions, session auth, ownership checks, rate limiting     |
| **Groq / Gemini LLMs**, **Prompts**, **Validation** | `ai-ml-pipeline-engineer`  | Prompt tuning, JSON schemas, Zod validation, token budgeting, offline fallback |
| **Playwright**, **Vitest**, **axe-core**            | `qa-e2e-browser-automator` | E2E browser flows, >95% unit/integration coverage, WCAG 2.1 AA audits          |
| **Code Review**, **Quality Standards**              | `code-reviewer-auditor`    | Zero `any` policy, SOLID principles, security sanitization, git diff audit     |

## 2. Strict Coding Invariants

1. **Zero `any`:** `any` is strictly banned in all application and backend code. Use precise types, generics, or unknown with type narrowing.
2. **Defensive Domain Arithmetic:** Financial and numeric calculations are deterministic in code, never calculated by LLMs.
3. **Server-Side Authorization & Multi-Tenancy:** Backend functions derive the user from the session (`requireUserId`) and enforce ownership checks (`requireOwned`).
4. **Defensive Validation:** All inputs across network boundaries are validated client-side with Zod/React Hook Form and server-side with Convex validators and clean helpers in `convex/lib/input.ts`.
5. **No Stderr Pollution:** Clean test execution with zero unhandled warnings or errors.

## 3. Verification Gates

Before completing any task, execute and verify:

```bash
npm run check    # Runs: typecheck + lint + format:check + test
npm run build    # Confirms static generation and build integrity
```

## 4. Agent skills

### Issue tracker

Issues and specs live in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context (`CONTEXT.md` + `docs/adr/`). See `docs/agents/domain.md`.
