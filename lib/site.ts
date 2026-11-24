/** The public origin, for canonical URLs, Open Graph images and the sitemap. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Respiro";
export const SITE_TAGLINE = "Breathe cleaner. Live lighter.";
export const SITE_DESCRIPTION =
  "Respiro is an intelligent clean-air assistant helping families and communities navigate severe winter smog and urban air pollution with low-emission routines, indoor air quality hacks, sustainable lifestyle alternatives, and measurable direct impact.";

// Browsers read a backslash as a slash and drop tabs and newlines, so
// "/\evil.example" and "/<tab>/evil.example" both lead to another site.
const UNSAFE_PATH = /[\u0000-\u001f\u007f\\]/;

/**
 * Validates and sanitizes a post-sign-in redirect path to guarantee same-site navigation.
 * Refuses protocol-relative URLs (`//`), open redirects, control characters, backslashes, and loops back to `/sign-in`.
 *
 * @param value - Candidate URL or path string.
 * @param fallback - Default path to return when invalid (defaults to `/`).
 * @returns Safe internal path.
 */
export function safeNext(value: string | null, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || UNSAFE_PATH.test(value)) return fallback;
  if (/^\/sign-in(?:[/?#]|$)/.test(value)) return fallback;
  return value;
}
