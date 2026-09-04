import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await requireAdmin();
    const { id, isRead, isArchived } = await req.json();

    const updated = await db.contactMessage.update({
      where: { id },
      data: {
        ...(typeof isRead === "boolean" && { isRead }),
        ...(typeof isArchived === "boolean" && { isArchived }),
      },
    });

    await db.auditLog.create({
      data: {
        action: "MESSAGE_STATUS_UPDATED",
        entityType: "MESSAGE",
        entityId: id,
        details: `Message status updated by ${admin.name} (read: ${isRead}, archived: ${isArchived})`,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.contactMessage.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        action: "MESSAGE_DELETED",
        entityType: "MESSAGE",
        entityId: id,
        details: `Deleted contact message by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete" }, { status: 500 });
  }
}
