import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmailBatch } from "@/lib/email";
import { buildNewsletterEmail } from "@/lib/email-templates";

/** Vercel Hobby defaults to 10s; a multi-batch send needs more headroom. */
export const maxDuration = 60;

/** Resend's hard cap for batch.send. */
const BATCH_SIZE = 100;

/**
 * Recipients per invocation. Bounds the work so a large list cannot exceed the
 * function timeout — the client re-POSTs with { resume: true } until done.
 */
const MAX_PER_RUN = 200;

/** Resend allows roughly 2 requests/second. */
const INTER_BATCH_DELAY_MS = 600;

/** GET returns what the editor needs to render the send panel. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const article = await db.article.findUnique({
      where: { id },
      select: { id: true, isPublished: true, newsletterSentAt: true },
    });
    if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });

    const [confirmedCount, sentCount] = await Promise.all([
      db.subscriber.count({ where: { status: "CONFIRMED" } }),
      db.newsletterSend.count({ where: { articleId: id, status: "SENT" } }),
    ]);

    return NextResponse.json({
      isPublished: article.isPublished,
      newsletterSentAt: article.newsletterSentAt,
      confirmedCount,
      sentCount,
      remaining: Math.max(0, confirmedCount - sentCount),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const resume = body?.resume === true;

    const article = await db.article.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });

    if (!article.isPublished) {
      return NextResponse.json(
        { error: "Publish the article before sending it to subscribers." },
        { status: 400 }
      );
    }

    // Atomic compare-and-set. Postgres executes this as a single
    // UPDATE ... WHERE "newsletterSentAt" IS NULL, so exactly one concurrent
    // caller can ever get count === 1. No transaction or advisory lock needed.
    if (!resume) {
      const claim = await db.article.updateMany({
        where: { id, isPublished: true, newsletterSentAt: null },
        data: { newsletterSentAt: new Date() },
      });

      if (claim.count === 0) {
        return NextResponse.json(
          {
            error:
              "Newsletter already dispatched for this article. Use resume to finish a partial send.",
          },
          { status: 409 }
        );
      }
    }

    // Recipients still owed a copy: confirmed, minus anyone with a send row.
    const already = await db.newsletterSend.findMany({
      where: { articleId: id },
      select: { subscriberId: true },
    });
    const sentIds = already.map((row) => row.subscriberId);

    const recipients = await db.subscriber.findMany({
      where: { status: "CONFIRMED", id: { notIn: sentIds } },
      orderBy: { createdAt: "asc" },
      take: MAX_PER_RUN,
    });

    let sent = 0;
    let failed = 0;
    let lastError: string | null = null;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const chunk = recipients.slice(i, i + BATCH_SIZE);

      // One message object per recipient — never one message with a `to` array.
      // Each needs its own unsubscribe token and List-Unsubscribe header, and a
      // shared `to` would leak the entire subscriber list to every recipient.
      const result = await sendEmailBatch(chunk.map((sub) => buildNewsletterEmail(article, sub)));

      if (!result.ok) {
        failed += chunk.length;
        lastError = result.error;
        console.error("Newsletter batch error:", result.error);
        // Stop here. Unsent recipients have no NewsletterSend row, so the next
        // resume picks them up exactly where this left off.
        break;
      }

      await db.newsletterSend.createMany({
        data: chunk.map((sub, n) => ({
          articleId: article.id,
          subscriberId: sub.id,
          email: sub.email,
          status: "SENT",
          providerId: result.ids[n] ?? null,
        })),
        skipDuplicates: true,
      });

      sent += chunk.length;

      if (i + BATCH_SIZE < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, INTER_BATCH_DELAY_MS));
      }
    }

    const totalConfirmed = await db.subscriber.count({ where: { status: "CONFIRMED" } });
    const remaining = Math.max(0, totalConfirmed - (sentIds.length + sent));

    await db.auditLog.create({
      data: {
        action: "NEWSLETTER_SENT",
        entityType: "ARTICLE",
        entityId: article.id,
        details: `Newsletter batch for "${article.title}" by ${admin.name}: ${sent} sent, ${failed} failed, ${remaining} remaining`,
      },
    });

    return NextResponse.json({
      sent,
      failed,
      remaining,
      done: remaining <= 0,
      error: lastError,
    });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}
