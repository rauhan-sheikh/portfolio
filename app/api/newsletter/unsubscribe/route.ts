import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST only, on purpose.
 *
 * Confirm is safe to expose over GET because a link prescanner confirming a
 * subscription is benign. A prescanner *unsubscribing* someone is silent data
 * loss, so the emailed footer link points at a page
 * (app/newsletter/unsubscribe/page.tsx) which merely renders, and only an
 * explicit button press reaches this handler.
 *
 * Doubles as the RFC 8058 one-click endpoint referenced by the
 * List-Unsubscribe-Post header, which mail clients invoke with a POST.
 */
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    let token = url.searchParams.get("token");

    if (!token) {
      const body = await req.json().catch(() => ({}));
      if (typeof body?.token === "string") token = body.token;
    }

    if (!token) {
      return NextResponse.json({ error: "Missing unsubscribe token." }, { status: 400 });
    }

    const sub = await db.subscriber.findUnique({ where: { unsubscribeToken: token } });

    // updateMany rather than update: a bad token yields count 0 instead of a
    // P2025 throw, so this is idempotent and gives away nothing about whether
    // the token was real.
    const updated = await db.subscriber.updateMany({
      where: { unsubscribeToken: token, status: { not: "UNSUBSCRIBED" } },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
    });

    if (updated.count > 0 && sub) {
      await db.auditLog.create({
        data: {
          action: "SUBSCRIBER_UNSUBSCRIBED",
          entityType: "SUBSCRIBER",
          entityId: sub.id,
          details: `Subscriber unsubscribed: ${sub.email}`,
        },
      });
    }

    // Always success — repeat calls and unknown tokens look identical.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json({ error: "Could not process that request." }, { status: 500 });
  }
}
