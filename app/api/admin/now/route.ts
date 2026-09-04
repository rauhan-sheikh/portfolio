import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const items = await db.nowItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();

    const created = await db.nowItem.create({
      data: {
        category: data.category || "BUILDING",
        title: data.title,
        text: data.text,
        order: Number(data.order) || 0,
        isActive: data.isActive !== false,
      },
    });

    await db.auditLog.create({
      data: {
        action: "NOW_ITEM_CREATED",
        entityType: "NOW",
        entityId: created.id,
        details: `Created now item: ${created.title} by ${admin.name}`,
      },
    });

    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();

    const updated = await db.nowItem.update({
      where: { id: data.id },
      data: {
        category: data.category,
        title: data.title,
        text: data.text,
        order: Number(data.order) || 0,
        isActive: Boolean(data.isActive),
      },
    });

    await db.auditLog.create({
      data: {
        action: "NOW_ITEM_UPDATED",
        entityType: "NOW",
        entityId: updated.id,
        details: `Updated now item: ${updated.title} by ${admin.name}`,
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

    await db.nowItem.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        action: "NOW_ITEM_DELETED",
        entityType: "NOW",
        entityId: id,
        details: `Deleted now item by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete" }, { status: 500 });
  }
}
