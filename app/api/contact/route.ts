import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, honeypot } = body;

    // Anti-spam honeypot: bots fill hidden fields, humans do not
    if (honeypot && honeypot.length > 0) {
      // Return fake success to confuse bots
      return NextResponse.json({ success: true, message: "Message dispatched." });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email sanity validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const newMsg = await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
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
