import { NextResponse, after } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { buildContactAck, buildContactNotification } from "@/lib/email-templates";
import { isValidEmail, isWithinLength, normalizeEmail, LIMITS } from "@/lib/validate";
import { checkContactRateLimit, isTooFast, isUnderDailyEmailCap } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, honeypot, startedAt } = body;

    // Anti-spam honeypot: bots fill hidden fields, humans do not.
    // Stays above everything else so bot traffic costs no email quota.
    if (honeypot && honeypot.length > 0) {
      // Return fake success to confuse bots
      return NextResponse.json({ success: true, message: "Message dispatched." });
    }

    // Humans take seconds to fill a form; scripted submits are instant.
    if (isTooFast(startedAt)) {
      return NextResponse.json({ success: true, message: "Message dispatched." });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email sanity validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Length caps: this is an unauthenticated write into @db.Text columns.
    if (!isWithinLength(name, LIMITS.name) || !isWithinLength(message, LIMITS.message)) {
      return NextResponse.json(
        { error: "That message is too long. Please keep it under 5000 characters." },
        { status: 400 }
      );
    }
    if (subject && !isWithinLength(subject, LIMITS.subject)) {
      return NextResponse.json({ error: "That subject is too long." }, { status: 400 });
    }

    const limit = await checkContactRateLimit(normalizeEmail(email));
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "You have already sent a few messages recently. Please give me a little time to reply." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const newMsg = await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: normalizeEmail(email),
        subject: subject?.trim() || "Website Contact",
        message: message.trim(),
      },
    });

    // Record audit log
    await db.auditLog.create({
      data: {
        action: "CONTACT_MESSAGE_RECEIVED",
        entityType: "MESSAGE",
        entityId: newMsg.id,
        details: `Message received from ${newMsg.name} (${newMsg.email})`,
      },
    });

    // Best-effort notification. The ContactMessage row above is the authoritative
    // record — nothing below may affect the response the visitor sees, and a
    // Resend outage must never cost a message. Failures land in the audit log
    // (visible at /admin/audit) rather than surfacing to the sender.
    after(async () => {
      try {
        // Circuit breaker: spam that defeats the honeypot costs real quota.
        // The message is already persisted and readable in /admin/messages.
        if (!(await isUnderDailyEmailCap())) {
          console.warn("[email] Daily notification cap reached — skipping send.");
          return;
        }

        const to = process.env.CONTACT_NOTIFY_TO || "hello@rauhansheikh.com";
        const notify = await sendEmail(buildContactNotification(newMsg, to));

        await db.auditLog.create({
          data: {
            action: notify.ok ? "CONTACT_EMAIL_SENT" : "CONTACT_EMAIL_FAILED",
            entityType: "MESSAGE",
            entityId: newMsg.id,
            details: notify.ok
              ? `Notification emailed to ${to} (provider id: ${notify.id})`
              : `Notification email not sent: ${notify.error}`,
          },
        });

        if (process.env.CONTACT_AUTO_ACK !== "0") {
          await sendEmail(buildContactAck(newMsg));
        }
      } catch (err) {
        console.error("Contact email dispatch error:", err);
      }
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully. I will get back to you shortly!",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to submit message. Please try again or email directly." },
      { status: 500 }
    );
  }
}
