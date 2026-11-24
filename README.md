# PromptWars Virtual — Challenge 6

[![CI](https://github.com/Kirito0088/Challenge-6/actions/workflows/ci.yml/badge.svg)](https://github.com/Kirito0088/Challenge-6/actions/workflows/ci.yml)

Built for **PromptWars Virtual, Challenge 6**.

Architected, developed, and verified using **Google Antigravity 2.0** with specialized custom agent auto-routing ([AGENTS.md](AGENTS.md)).

---

## Foundation & Tech Stack

This project inherits the production-grade architectural baseline established in Festa (Challenge 5):

- **Framework:** Next.js 16 (App Router, Turbopack, Partial Prerendering, Cache Components) with React 19 and strict TypeScript (`noImplicitAny`, zero `any` policy).
- **Styling & Design System:** Tailwind CSS 4, Radix UI accessible primitives, Motion spring animations, Sonner toasts.
- **Backend & Database:** Convex reactive database, queries, mutations, scheduled actions, Convex Auth (Password & Anonymous demo auth), rate limiter.
- **AI Integration:** Groq / Gemini integration with strict JSON schema outputs, Zod validation, defensive fallback pipelines, and anti-hallucination barriers.
- **Automated Verification:** Vitest for unit & integration testing, Playwright for end-to-end browser workflows, ESLint 9, Prettier, and axe-core for WCAG 2.1 AA accessibility audits.

---

## Quickstart

### 1. Install Dependencies

```bash
npm install
```

### 2. Local Development

```bash
# Terminal 1: Convex backend
npm run dev:backend

# Terminal 2: Next.js dev server
npm run dev
```

### 3. Verification Pipeline

```bash
npm run check    # Runs: typecheck + lint + format:check + test
npm run build    # Production build test
```
