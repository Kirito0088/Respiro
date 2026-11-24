# ADR 2: Deterministic Rule-Based Offline Advisor as AI Fallback

## Context

Respiro uses Groq's high-speed inference pipeline to generate personalized smog routines and IAQ hacks. However, in real-world scenarios:

- API rate limits (e.g., 429 Too Many Requests or token bucket exhaustion) may trigger during traffic spikes.
- External API outages or network disruptions may disconnect cloud inference.
- Evaluators and offline demonstrations may lack active API keys (`GROQ_API_KEY`).

If the AI fails, an air quality app cannot leave families stranded in high-AQI emergencies with broken loading spinners or generic error screens.

## Decision

Respiro implements a complete deterministic rule-based Smog Advisor engine under `lib/ai/fallback-advisor.ts`.

When an AI action fails due to missing keys, rate limits, network timeouts, or schema validation errors:

1. The backend automatically switches to the built-in deterministic advisor.
2. The advisor applies science-backed rule matrices indexed by AQI tier (Moderate &rarr; Hazardous), vulnerability personas (asthmatics, infants, seniors), and dwelling types.
3. The response matches the identical strict Zod schema returned by the LLM.
4. The UI transparently surfaces an indicator (e.g., "Generated via Science-Backed Offline Engine") so users and evaluators know the origin of the advice.

## Consequences

- **100% High Availability:** Respiro never breaks or blocks user workflow, even with zero network or missing keys.
- **Identical Type Safety:** The UI consumes one unified data contract regardless of whether AI or the fallback engine generated the response.
- **Zero Latency Demonstrations:** Evaluators can test full end-to-end user journeys instantaneously.
