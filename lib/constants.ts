/**
 * Domain constants and validation limits shared by frontend and backend.
 */

export const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "SGD", "AUD", "CAD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "INR";

/** Universal limits applied to user inputs and AI outputs alike. */
export const LIMITS = {
  nameMax: 120,
  shortTextMax: 200,
  longTextMax: 2000,
  chatMessageMax: 1500,
  guestsMax: 100_000,
  moneyMax: 10_000_000_000,
  offsetDaysMax: 730,
  listMax: 500,
} as const;
