import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const exp = await db.experience.findUnique({ where: { id } });
    if (!exp) return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    return NextResponse.json(exp);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const data = await req.json();

    const updated = await db.experience.update({
      where: { id },
      data: {
        company: data.company,
        role: data.role,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        isCurrent: Boolean(data.isCurrent),
        description: data.description,
        bullets: typeof data.bullets === "string" ? data.bullets : JSON.stringify(data.bullets || []),
        technologies: typeof data.technologies === "string" ? data.technologies : JSON.stringify(data.technologies || []),
        metrics: typeof data.metrics === "string" ? data.metrics : JSON.stringify(data.metrics || []),
        linkedProjects: typeof data.linkedProjects === "string" ? data.linkedProjects : JSON.stringify(data.linkedProjects || []),
        order: Number(data.order) || 0,
      },
    });

    await db.auditLog.create({
      data: {
        action: "EXPERIENCE_UPDATED",
        entityType: "EXPERIENCE",
        entityId: updated.id,
        details: `Updated experience: ${updated.company} by ${admin.name}`,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update experience error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const deleted = await db.experience.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        action: "EXPERIENCE_DELETED",
        entityType: "EXPERIENCE",
        entityId: deleted.id,
        details: `Deleted experience: ${deleted.company} by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete experience error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete experience" },
      { status: 500 }
    );
  }
}
