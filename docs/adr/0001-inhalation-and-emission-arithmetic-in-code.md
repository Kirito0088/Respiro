# ADR 1: Compute Environmental and Inhalation Metrics in Code, Never in the LLM

## Context

Respiro calculates quantified health and environmental impact metrics for household routines and indoor air quality hacks:

- Inhaled particulate mass reduction ($\mu g$ of $PM_{2.5}$ and $PM_{10}$ prevented from lung deposition).
- Indoor $PM_{2.5}$ concentrations based on outdoor AQI, mechanical ventilation, and filtration CADR ($m^3/h$).
- $CO_2$ emission savings ($kg/day$) from sustainable commute and heating choices.
- Diurnal smog inversion curve hours (predicting morning inversion traps vs. midday boundary layer clearing).

Large Language Models (LLMs) are notorious for floating-point drift, arithmetic hallucinations, and non-deterministic numerical outputs across repeated queries. Presenting inaccurate health exposure or emission reductions destroys user trust and compromises the educational value of the application.

## Decision

All mathematical, physical, and environmental calculations are implemented in pure, deterministic, unit-tested TypeScript functions under `lib/air-quality.ts` and `lib/impact.ts`.

The LLM is responsible solely for:

1. Synthesizing qualitative recommendations based on household lifestyle and housing constraints.
2. Generating contextual explanations of _why_ specific hacks are effective.
3. Classifying behavioral switches into structured category tokens.

The LLM never calculates percentages, concentration deltas, inhaled mass, or cumulative carbon savings. The frontend and backend feed the LLM's structured tokens into our deterministic domain arithmetic engine.

## Consequences

- **100% Deterministic & Verifiable:** Every metric is backed by reproducible formulas and unit tests.
- **Sub-Millisecond Execution:** State recalculates instantly without waiting for an AI roundtrip.
- **Zero Arithmetic Hallucinations:** Numbers always add up across dashboards, reports, and community totals.
