import { Resend } from "resend";

/**
 * Thin wrapper over Resend with one hard rule: **these functions never throw.**
 *
 * Every caller sits on a path where the database write is the authoritative
 * record and the email is a notification. A provider outage must never surface
 * as a 500 to a visitor, so callers branch on `ok` instead of nesting try/catch.
 */

export type SendResult =
  | { ok: true; id: string | null }
  | { ok: false; skipped: boolean; error: string };

export type BatchResult =
  | { ok: true; ids: (string | null)[] }
  | { ok: false; skipped: boolean; error: string };

export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

let client: Resend | null = null;

/** Lazily constructed so importing this module never throws when the key is absent. */
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export function isEmailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Absolute origin for links inside emails. No trailing slash. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? "https://rauhansheikh.com" : "http://localhost:3000");
  return raw.replace(/\/+$/, "");
}

/** Every interpolated value in an email template must pass through this. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function defaultFrom(): string {
  return process.env.EMAIL_FROM || "onboarding@resend.dev";
}

function toMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return typeof err === "string" ? err : "Unknown email error";
}

/** Send one email. Never throws. */
export async function sendEmail(msg: OutgoingEmail): Promise<SendResult> {
  const resend = getClient();
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY unset — skipped "${msg.subject}" -> ${msg.to}`);
    return { ok: false, skipped: true, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: msg.from || defaultFrom(),
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      replyTo: msg.replyTo,
      headers: msg.headers,
    });

    if (error) return { ok: false, skipped: false, error: error.message };
    return { ok: true, id: data?.id ?? null };
  } catch (err) {
    return { ok: false, skipped: false, error: toMessage(err) };
  }
}

/**
 * Send up to 100 distinct messages in one call (Resend's hard cap).
 *
 * Each entry is a separate message with its own `to`, so per-recipient
 * unsubscribe tokens and List-Unsubscribe headers survive. Never pass one
 * message with many recipients — that leaks the whole list to everyone on it.
 */
export async function sendEmailBatch(messages: OutgoingEmail[]): Promise<BatchResult> {
  if (messages.length === 0) return { ok: true, ids: [] };

  const resend = getClient();
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY unset — skipped batch of ${messages.length}`);
    return { ok: false, skipped: true, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { data, error } = await resend.batch.send(
      messages.map((msg) => ({
        from: msg.from || defaultFrom(),
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        replyTo: msg.replyTo,
        headers: msg.headers,
      }))
    );

    if (error) return { ok: false, skipped: false, error: error.message };

    // batch.send nests one level deeper than emails.send: data.data[n].id
    const ids = (data?.data ?? []).map((entry) => entry?.id ?? null);
    return { ok: true, ids };
  } catch (err) {
    return { ok: false, skipped: false, error: toMessage(err) };
  }
}
