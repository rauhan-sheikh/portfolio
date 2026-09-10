import { NextResponse, after } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { buildConfirmEmail } from "@/lib/email-templates";
import { newToken } from "@/lib/tokens";
import { isValidEmail, normalizeEmail } from "@/lib/validate";
import { checkSubscribeRateLimit, isTooFast } from "@/lib/rate-limit";

/**
 * Identical for every non-error outcome — new address, already pending, already
 * confirmed, previously unsubscribed. Without this the endpoint becomes an
 * oracle for testing whether a given address is on the list.
 */
const GENERIC_RESPONSE = {
  success: true,
  message: "Almost there — check your inbox for a confirmation link.",
};

/** Do not re-send a confirmation more than once a minute for the same address. */
const RESEND_COOLDOWN_MS = 60_000;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source, honeypot, startedAt } = body;

    // Anti-spam honeypot, mirroring app/api/contact/route.ts.
    // Sits above everything so bot traffic costs zero email quota.
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    if (isTooFast(startedAt)) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Global signup-burst guard: each new subscriber costs a confirmation email.
    const limit = await checkSubscribeRateLimit();
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many signups right now. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const normalized = normalizeEmail(email);
    const existing = await db.subscriber.findUnique({ where: { email: normalized } });

    // Resolved below to whichever record should receive a confirmation email,
    // or null when no email should be sent at all.
    let sendTo: { email: string; confirmToken: string; unsubscribeToken: string } | null = null;

    if (!existing) {
      const created = await db.subscriber.create({
        data: {
          email: normalized,
          source: typeof source === "string" && source.length <= 40 ? source : "footer",
          confirmToken: newToken(),
          unsubscribeToken: newToken(),
        },
      });
      sendTo = created;

      await db.auditLog.create({
        data: {
          action: "SUBSCRIBER_PENDING",
          entityType: "SUBSCRIBER",
          entityId: created.id,
          details: `New subscription pending confirmation: ${created.email} (source: ${created.source})`,
        },
      });
    } else if (existing.status === "PENDING") {
      // Resend, but throttled — otherwise a form-masher drains the daily quota.
      const age = Date.now() - existing.updatedAt.getTime();
      if (age > RESEND_COOLDOWN_MS) {
        const touched = await db.subscriber.update({
          where: { id: existing.id },
          data: { updatedAt: new Date() },
        });
        sendTo = touched;
      }
    } else if (existing.status === "UNSUBSCRIBED") {
      // Re-opt-in. Rotate the confirm token so any link from the previous
      // subscription cycle is dead.
      const revived = await db.subscriber.update({
        where: { id: existing.id },
        data: {
          status: "PENDING",
          confirmToken: newToken(),
          confirmedAt: null,
          unsubscribedAt: null,
        },
      });
      sendTo = revived;

      await db.auditLog.create({
        data: {
          action: "SUBSCRIBER_RESUBSCRIBED",
          entityType: "SUBSCRIBER",
          entityId: revived.id,
          details: `Previously unsubscribed address re-opted in: ${revived.email}`,
        },
      });
    }
    // status === "CONFIRMED" falls through: already subscribed, send nothing.

    if (sendTo) {
      const target = sendTo;
      after(async () => {
        const result = await sendEmail(buildConfirmEmail(target));
        if (!result.ok && !result.skipped) {
          console.error(`Confirmation email failed for ${target.email}: ${result.error}`);
        }
      });
    }

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { error: "Could not process that subscription. Please try again." },
      { status: 500 }
    );
  }
}
