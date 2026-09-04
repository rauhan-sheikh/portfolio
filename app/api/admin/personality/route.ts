import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const items = await db.personalityItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();

    const created = await db.personalityItem.create({
      data: {
        category: data.category || "OPINIONS",
        title: data.title,
        body: data.body,
        order: Number(data.order) || 0,
      },
    });

    await db.auditLog.create({
      data: {
        action: "PERSONALITY_ITEM_CREATED",
        entityType: "PERSONALITY",
        entityId: created.id,
        details: `Created personality item: ${created.title} by ${admin.name}`,
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

    const updated = await db.personalityItem.update({
      where: { id: data.id },
      data: {
        category: data.category,
        title: data.title,
        body: data.body,
        order: Number(data.order) || 0,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.personalityItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete" }, { status: 500 });
  }
}
