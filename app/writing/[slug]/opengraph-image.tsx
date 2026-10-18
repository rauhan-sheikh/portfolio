import { db } from "@/lib/db";
import { renderOg, OG_PAGES } from "@/lib/og";

export const alt = "Article — Rauhan Sheikh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await db.article.findUnique({ where: { slug } }).catch(() => null);
  if (!article || !article.isPublished) return renderOg(OG_PAGES.writing);

  let tags: string[] = [];
  try {
    tags = JSON.parse(article.tags);
  } catch {}

  return renderOg({
    kicker: `Writing · ${article.readingTime}`,
    title: article.title,
    description: article.excerpt.length > 115 ? article.excerpt.slice(0, 112).replace(/\s+\S*$/, "") + "…" : article.excerpt,
    tags: tags.slice(0, 4),
  });
}
