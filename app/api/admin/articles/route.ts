import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const articles = await db.article.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();

    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const article = await db.article.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || "",
        content: data.content || "",
        coverImage: data.coverImage,
        author: data.author || admin.name,
        readingTime: data.readingTime || "5 min read",
        tags: typeof data.tags === "string" ? data.tags : JSON.stringify(data.tags || []),
        isFeatured: Boolean(data.isFeatured),
        isPublished: Boolean(data.isPublished),
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      },
    });

    await db.auditLog.create({
      data: {
        action: "ARTICLE_CREATED",
        entityType: "ARTICLE",
        entityId: article.id,
        details: `Created article: ${article.title} by ${admin.name}`,
      },
    });

    return NextResponse.json(article);
  } catch (error: any) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create article" },
      { status: 500 }
    );
  }
}
