import { db } from "./db";

/**
 * Database-backed rate limiting.
 *
 * Deliberately no Upstash / Redis: that is a dependency plus a hosted service
 * for a single-author site, and the AuditLog table already records exactly the
 * events worth counting. The @@index([action, createdAt]) added in the
 * add_newsletter migration is what keeps these counts cheap.
 *
 * Serverless-safe by construction — an in-memory counter would reset on every
 * cold start and diverge across concurrent instances.
 */

export const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_MAX_ATTEMPTS = 5;

const CONTACT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_MAX_PER_WINDOW = 3;

/**
 * Global signup burst cap, not per-address — a bot run uses a different address
 * every time, so a per-address limit would never fire. Sized well above organic
 * traffic for a personal site while still capping a scripted flood.
 */
const SUBSCRIBE_WINDOW_MS = 60 * 60 * 1000;
const SUBSCRIBE_MAX_NEW_PER_HOUR = 50;

/** Emails from a daily quota-drain circuit breaker. */
const DAILY_EMAIL_CAP = 80;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

const ALLOWED: RateLimitResult = { allowed: true, retryAfterSeconds: 0 };

/**
 * Throttles credential stuffing against the single known admin address.
 * Counts recent ADMIN_LOGIN_FAILED rows, which the login route now writes.
 */
export async function checkLoginRateLimit(email: string): Promise<RateLimitResult> {
  const since = new Date(Date.now() - LOGIN_ATTEMPT_WINDOW_MS);

  const failures = await db.auditLog.count({
    where: {
      action: "ADMIN_LOGIN_FAILED",
      createdAt: { gte: since },
      details: { contains: email.toLowerCase() },
    },
  });

  if (failures >= LOGIN_MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil(LOGIN_ATTEMPT_WINDOW_MS / 1000) };
  }
  return ALLOWED;
}

/** Caps repeat submissions from one address into an unbounded @db.Text column. */
export async function checkContactRateLimit(email: string): Promise<RateLimitResult> {
  const since = new Date(Date.now() - CONTACT_WINDOW_MS);

  const recent = await db.contactMessage.count({
    where: { email: email.toLowerCase(), createdAt: { gte: since } },
  });

  if (recent >= CONTACT_MAX_PER_WINDOW) {
    return { allowed: false, retryAfterSeconds: Math.ceil(CONTACT_WINDOW_MS / 1000) };
  }
  return ALLOWED;
}

/** Caps signup churn, which costs a confirmation email every time. */
export async function checkSubscribeRateLimit(): Promise<RateLimitResult> {
  const since = new Date(Date.now() - SUBSCRIBE_WINDOW_MS);

  const recent = await db.subscriber.count({ where: { createdAt: { gte: since } } });

  if (recent >= SUBSCRIBE_MAX_NEW_PER_HOUR) {
    return { allowed: false, retryAfterSeconds: Math.ceil(SUBSCRIBE_WINDOW_MS / 1000) };
  }
  return ALLOWED;
}

/**
 * Circuit breaker on the provider quota.
 *
 * Spam that defeats the honeypot now costs money, not just database rows. If
 * more than DAILY_EMAIL_CAP notifications went out in the last 24h, stop
 * sending — the messages are still persisted and readable in /admin/messages.
 */
export async function isUnderDailyEmailCap(): Promise<boolean> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const sentToday = await db.auditLog.count({
    where: { action: "CONTACT_EMAIL_SENT", createdAt: { gte: since } },
  });

  return sentToday < DAILY_EMAIL_CAP;
}

/** Bots submit instantly; humans take seconds to fill a form. */
export function isTooFast(startedAt: unknown, minMs = 2000): boolean {
  if (typeof startedAt !== "number" || !Number.isFinite(startedAt)) return false;
  const elapsed = Date.now() - startedAt;
  return elapsed >= 0 && elapsed < minMs;
}
