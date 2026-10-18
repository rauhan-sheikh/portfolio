import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const project = await db.project.findUnique({
      where: { id },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const data = await req.json();

    // Only fields present in the request are written, so a partial save can never
    // silently reset something it didn't send (this once hid projects from /work).
    const stringFields = [
      "title", "slug", "category", "year", "shortDesc", "longDesc", "status", "coverImage",
      "thumbnail", "accentColor", "projectMark", "liveUrl", "githubUrl", "demoUrl", "theProblem",
      "theMessyPart", "architecture", "technicalDecisions", "whatIdChange", "fullContent",
    ] as const;
    const jsonFields = ["stack", "metrics", "links"] as const;
    const boolFields = ["isFeatured", "showOnHome", "showInWork"] as const;

    const update: Record<string, unknown> = {};
    for (const key of stringFields) if (data[key] !== undefined) update[key] = data[key];
    for (const key of jsonFields) {
      if (data[key] !== undefined) update[key] = typeof data[key] === "string" ? data[key] : JSON.stringify(data[key] || []);
    }
    for (const key of boolFields) if (data[key] !== undefined) update[key] = Boolean(data[key]);
    if (data.order !== undefined) update.order = Number(data.order) || 0;

    const updated = await db.project.update({
      where: { id },
      data: update,
    });

    await db.auditLog.create({
      data: {
        action: "PROJECT_UPDATED",
        entityType: "PROJECT",
        entityId: updated.id,
        details: `Updated project: ${updated.title} by ${admin.name}`,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const deleted = await db.project.delete({
      where: { id },
    });

    await db.auditLog.create({
      data: {
        action: "PROJECT_DELETED",
        entityType: "PROJECT",
        entityId: deleted.id,
        details: `Deleted project: ${deleted.title} (${deleted.slug}) by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}
