# Respiro: Breathe cleaner. Live lighter.

[![CI](https://github.com/Kirito0088/Respiro/actions/workflows/ci.yml/badge.svg)](https://github.com/Kirito0088/Respiro/actions/workflows/ci.yml)

Built for **PromptWars Virtual, Challenge 6: Clean Air & Winter Smog Assistant**.

Respiro is a GenAI-powered clean-air copilot that helps families and communities navigate severe winter smog and urban air pollution through low-emission daily routines, indoor air quality hacks, sustainable lifestyle alternatives, and transparently quantified health and environmental impact metrics.

Architected, developed, and verified using **Google Antigravity 2.0** with specialized custom agent auto-routing ([AGENTS.md](AGENTS.md)).

---

## How Respiro Answers the Brief

| The Brief Asks For                 | How Respiro Delivers                                                                                                                                                                                        |
| :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Location & Lifestyle Tailoring** | Household assessment by micro-location, vulnerability profile (asthma, children, elderly, outdoor workers), dwelling type, and commute habits.                                                              |
| **Low-Emission Daily Routines**    | **Diurnal Smog Clock**: Dynamic scheduling aligning ventilation windows, commute departures, and outdoor activities with thermal inversion dissipation curves.                                              |
| **Indoor Air Quality (IAQ) Hacks** | **IAQ Hack Lab**: Step-by-step DIY Corsi-Rosenthal / HEPA air cleaner builds, wet-mopping protocols, kitchen air capture, and natural flora optimization.                                                   |
| **Sustainable Alternatives**       | Actionable clean-transit switches, clean heating alternatives, and green barrier setups.                                                                                                                    |
| **Direct Impact Explanations**     | Quantified $\mu g/m^3$ lung exposure reduction, particulate mass avoided from lungs, and $CO_2$ emission savings calculated in code ([ADR 1](docs/adr/0001-inhalation-and-emission-arithmetic-in-code.md)). |
| **Community Smog Shield**          | Neighborhood collective action, filter group buying, clean transit carpools, and shared smog alerts.                                                                                                        |

---

## Technical Stack & Quality Standards

- **Framework:** Next.js 16 (App Router, Turbopack, Partial Prerendering, Cache Components), React 19, strict TypeScript (`zero any` policy).
- **Styling & UI:** Tailwind CSS 4, Radix UI accessible primitives, Motion spring physics, Sonner toasts.
- **Backend & Database:** Convex reactive database, queries, mutations, scheduled actions, Convex Auth (Password & Anonymous demo modes), rate limiter.
- **AI Engine:** Groq / Gemini LLM pipeline with strict Zod JSON schemas, token budgeting, and deterministic offline rule-based fallbacks ([ADR 2](docs/adr/0002-deterministic-offline-smog-advisor-fallback.md)).
- **Verification Gates:** Vitest unit tests, `convex-test` multi-tenant integration tests, Playwright browser journeys, and automated axe-core WCAG 2.1 AA audits (**0 violations**).

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
