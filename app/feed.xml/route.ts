import { db } from "@/lib/db";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** RSS 2.0 feed of published essays, newest first. */
export async function GET() {
  const articles = await db.article
    .findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" }, take: 30 })
    .catch(() => []);

  const items = articles
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${SITE_URL}/writing/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/writing/${a.slug}</guid>
      <pubDate>${a.publishedAt.toUTCString()}</pubDate>
      <description>${esc(a.excerpt)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)} — Writing</title>
    <link>${SITE_URL}/writing</link>
    <description>Essays on backend reliability, databases and shipping software that has to actually work.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
