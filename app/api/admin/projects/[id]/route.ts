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

    const updated = await db.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        year: data.year,
        shortDesc: data.shortDesc,
        longDesc: data.longDesc,
        status: data.status,
        isFeatured: Boolean(data.isFeatured),
        order: Number(data.order) || 0,
        coverImage: data.coverImage,
        thumbnail: data.thumbnail,
        accentColor: data.accentColor,
        projectMark: data.projectMark,
        liveUrl: data.liveUrl,
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        theProblem: data.theProblem,
        theMessyPart: data.theMessyPart,
        architecture: data.architecture,
        technicalDecisions: data.technicalDecisions,
        whatIdChange: data.whatIdChange,
        fullContent: data.fullContent,
        stack: typeof data.stack === "string" ? data.stack : JSON.stringify(data.stack || []),
        metrics: typeof data.metrics === "string" ? data.metrics : JSON.stringify(data.metrics || []),
        links: typeof data.links === "string" ? data.links : JSON.stringify(data.links || []),
        showOnHome: Boolean(data.showOnHome),
        showInWork: Boolean(data.showInWork),
      },
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
