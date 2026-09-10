import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Neutralize spreadsheet formula injection. These exports get opened in Excel,
 * where a cell beginning with =, +, - or @ is evaluated rather than displayed.
 */
function csvCell(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);

    const subscribers = await db.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (searchParams.get("format") === "csv") {
      const header = "email,status,source,signed_up,confirmed_at";
      const rows = subscribers.map((s) =>
        [
          csvCell(s.email),
          csvCell(s.status),
          csvCell(s.source),
          csvCell(s.createdAt.toISOString()),
          csvCell(s.confirmedAt ? s.confirmedAt.toISOString() : ""),
        ].join(",")
      );
      const csv = [header, ...rows].join("\r\n");
      const stamp = new Date().toISOString().slice(0, 10);

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="subscribers-${stamp}.csv"`,
        },
      });
    }

    // Tokens are credentials — never ship them to the browser.
    return NextResponse.json(
      subscribers.map((s) => ({
        id: s.id,
        email: s.email,
        status: s.status,
        source: s.source,
        confirmedAt: s.confirmedAt,
        unsubscribedAt: s.unsubscribedAt,
        createdAt: s.createdAt,
      }))
    );
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const deleted = await db.subscriber.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        action: "SUBSCRIBER_DELETED",
        entityType: "SUBSCRIBER",
        entityId: id,
        details: `Deleted subscriber ${deleted.email} by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
