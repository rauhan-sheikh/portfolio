import { getResumeData } from "@/lib/resume";
import { renderResumePdf } from "@/lib/resume-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The public résumé PDF, generated from the same data as /resume. The phone number appears only
 * when the `resume_show_phone` setting is on (flip it in /admin/resume when someone asks for it).
 */
export async function GET() {
  const data = await getResumeData();
  const pdf = await renderResumePdf(data);
  return new Response(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${data.name} - Resume.pdf"`,
      // Short shared cache: fast for visitors, but a toggled setting shows up within minutes.
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
