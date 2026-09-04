import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const article = await db.article.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const data = await req.json();

    const updated = await db.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        author: data.author,
        readingTime: data.readingTime,
        tags: typeof data.tags === "string" ? data.tags : JSON.stringify(data.tags || []),
        isFeatured: Boolean(data.isFeatured),
        isPublished: Boolean(data.isPublished),
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
    });

    await db.auditLog.create({
      data: {
        action: "ARTICLE_UPDATED",
        entityType: "ARTICLE",
        entityId: updated.id,
        details: `Updated article: ${updated.title} by ${admin.name}`,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const deleted = await db.article.delete({ where: { id } });

    await db.auditLog.create({
      data: {
        action: "ARTICLE_DELETED",
        entityType: "ARTICLE",
        entityId: deleted.id,
        details: `Deleted article: ${deleted.title} by ${admin.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete article" },
      { status: 500 }
    );
  }
}
