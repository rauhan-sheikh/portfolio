import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const items = await db.navigationItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch navigation" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();

    const item = await db.navigationItem.create({
      data: {
        label: data.label,
        href: data.href,
        order: Number(data.order) || 0,
        isEnabled: data.isEnabled !== false,
        isExternal: Boolean(data.isExternal),
      },
    });

    await db.auditLog.create({
      data: {
        action: "NAVIGATION_ITEM_CREATED",
        entityType: "NAVIGATION",
        entityId: item.id,
        details: `Created navigation link: ${item.label} (${item.href}) by ${admin.name}`,
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();

    const updated = await db.navigationItem.update({
      where: { id: data.id },
      data: {
        label: data.label,
        href: data.href,
        order: Number(data.order) || 0,
        isEnabled: Boolean(data.isEnabled),
        isExternal: Boolean(data.isExternal),
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

    await db.navigationItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete" }, { status: 500 });
  }
}
