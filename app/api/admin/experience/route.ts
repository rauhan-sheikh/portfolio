import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const exp = await db.experience.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(exp);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();

    const created = await db.experience.create({
      data: {
        company: data.company,
        role: data.role,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        isCurrent: Boolean(data.isCurrent),
        description: data.description || "",
        bullets: typeof data.bullets === "string" ? data.bullets : JSON.stringify(data.bullets || []),
        technologies: typeof data.technologies === "string" ? data.technologies : JSON.stringify(data.technologies || []),
        metrics: typeof data.metrics === "string" ? data.metrics : JSON.stringify(data.metrics || []),
        linkedProjects: typeof data.linkedProjects === "string" ? data.linkedProjects : JSON.stringify(data.linkedProjects || []),
        order: Number(data.order) || 0,
      },
    });

    await db.auditLog.create({
      data: {
        action: "EXPERIENCE_CREATED",
        entityType: "EXPERIENCE",
        entityId: created.id,
        details: `Created experience: ${created.company} - ${created.role} by ${admin.name}`,
      },
    });

    return NextResponse.json(created);
  } catch (error: any) {
    console.error("Create experience error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create experience" },
      { status: 500 }
    );
  }
}
