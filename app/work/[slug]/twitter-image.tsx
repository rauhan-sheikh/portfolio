import { db } from "@/lib/db";
import { renderOg, OG_PAGES } from "@/lib/og";

export const alt = "Case study — Rauhan Sheikh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { slug } }).catch(() => null);
  if (!project || project.status === "PRIVATE") return renderOg(OG_PAGES.work);

  let stack: string[] = [];
  try {
    stack = JSON.parse(project.stack);
  } catch {}

  return renderOg({
    kicker: `Case study${project.year ? ` · ${project.year}` : ""}`,
    title: project.title,
    description: project.shortDesc.length > 115 ? project.shortDesc.slice(0, 112).replace(/\s+\S*$/, "") + "…" : project.shortDesc,
    tags: stack.slice(0, 4),
  });
}
