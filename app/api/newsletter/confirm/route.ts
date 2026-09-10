import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSiteUrl } from "@/lib/email";

/**
 * Confirms a subscription from an emailed link, then redirects to a status page.
 *
 * Deliberately **idempotent and never single-use**. Email-client link
 * prescanners (Outlook SafeLinks, Mimecast, Barracuda) issue a GET for every
 * link in a message before the human ever sees it. If confirming burned the
 * token, the prescanner would burn it and the real click would land on
 * "invalid link".
 *
 * The accepted cost is that a prescanner auto-confirms. That is tolerable:
 * double opt-in's real guarantee — that the mailbox exists and accepted our
 * mail — is already proven by delivery.
 */
export async function GET(req: Request) {
  const site = getSiteUrl();

  try {
    const token = new URL(req.url).searchParams.get("token");
    if (!token) return NextResponse.redirect(`${site}/newsletter/invalid`);

    const sub = await db.subscriber.findUnique({ where: { confirmToken: token } });
    if (!sub) return NextResponse.redirect(`${site}/newsletter/invalid`);

    if (sub.status !== "CONFIRMED") {
      await db.subscriber.update({
        where: { id: sub.id },
        data: { status: "CONFIRMED", confirmedAt: new Date() },
      });

      await db.auditLog.create({
        data: {
          action: "SUBSCRIBER_CONFIRMED",
          entityType: "SUBSCRIBER",
          entityId: sub.id,
          details: `Subscriber confirmed: ${sub.email} (source: ${sub.source})`,
        },
      });
    }

    return NextResponse.redirect(`${site}/newsletter/confirmed`);
  } catch (error) {
    console.error("Newsletter confirm error:", error);
    return NextResponse.redirect(`${site}/newsletter/invalid`);
  }
}
