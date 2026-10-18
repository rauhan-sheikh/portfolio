import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getResumeData } from "@/lib/resume";
import { renderResumePdf } from "@/lib/resume-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin-only résumé download that always includes the phone number (never cached). */
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await getResumeData({ includePhone: true });
  const pdf = await renderResumePdf(data);
  return new Response(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${data.name} - Resume (with phone).pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
