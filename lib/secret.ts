/**
 * Single source of truth for the admin session signing secret.
 *
 * Previously this literal was duplicated in lib/auth.ts and middleware.ts, which
 * meant (a) rotating it required editing two files, and (b) a production deploy
 * with ADMIN_SESSION_SECRET unset would silently fall back to a value committed
 * to a public repo — letting anyone forge an admin session.
 *
 * Now: production refuses to boot without it, development gets a loud fallback.
 */

const DEV_FALLBACK_SECRET = "dev-only-insecure-secret-do-not-use-in-production";

function resolveSecret(): string {
  const fromEnv = process.env.ADMIN_SESSION_SECRET;

  if (fromEnv && fromEnv.length >= 32) return fromEnv;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      fromEnv
        ? "ADMIN_SESSION_SECRET must be at least 32 characters."
        : "ADMIN_SESSION_SECRET is required in production. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }

  if (fromEnv) {
    console.warn("[auth] ADMIN_SESSION_SECRET is shorter than 32 characters — using it anyway in development.");
    return fromEnv;
  }

  console.warn("[auth] ADMIN_SESSION_SECRET is not set — using an insecure development fallback.");
  return DEV_FALLBACK_SECRET;
}

/** Encoded HS256 signing key. Safe to import from both Edge middleware and Node routes. */
export const JWT_SECRET = new TextEncoder().encode(resolveSecret());

export const COOKIE_NAME = "admin_session";
