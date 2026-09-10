/** Shared input validation. Kept dependency-free and used by every public write route. */

/** Longest legal email address per RFC 5321. */
const MAX_EMAIL_LENGTH = 254;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trim and lowercase, so the same address is never stored twice. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(trimmed);
}

/** Guard against unbounded @db.Text writes from an unauthenticated endpoint. */
export function isWithinLength(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

export const LIMITS = {
  name: 120,
  email: MAX_EMAIL_LENGTH,
  subject: 200,
  message: 5000,
} as const;
