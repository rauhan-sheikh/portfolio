import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const projects = await db.project.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();

    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const project = await db.project.create({
      data: {
        title: data.title,
        slug,
        category: data.category || "PERSONAL",
        year: data.year,
        shortDesc: data.shortDesc || "",
        longDesc: data.longDesc || "",
        status: data.status || "PUBLISHED",
        isFeatured: Boolean(data.isFeatured),
        order: Number(data.order) || 0,
        coverImage: data.coverImage,
        thumbnail: data.thumbnail,
        accentColor: data.accentColor || "#3b82f6",
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
        showOnHome: data.showOnHome !== false,
        showInWork: data.showInWork !== false,
      },
    });

    await db.auditLog.create({
      data: {
        action: "PROJECT_CREATED",
        entityType: "PROJECT",
        entityId: project.id,
        details: `Created project: ${project.title} (${project.slug}) by ${admin.name}`,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
