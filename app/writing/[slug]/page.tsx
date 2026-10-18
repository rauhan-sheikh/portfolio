import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ArrowRight, User } from "lucide-react";
import Logo from "@/components/public/Logo";
import Markdown from "@/components/public/Markdown";
import { SITE_URL, pageMetadata, fitTitle, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
  });

  if (!article || !article.isPublished) {
    return { title: "Article Not Found", robots: { index: false, follow: false } };
  }

  const title = article.seoTitle || fitTitle(`${article.title} — Rauhan Sheikh`, article.title);
  return {
    ...pageMetadata({
      title: { absolute: title },
      description: article.seoDesc || article.excerpt,
      path: `/writing/${article.slug}`,
      type: "article",
      ogTitle: article.seoTitle || article.title,
      extra: {
        publishedTime: article.publishedAt.toISOString(),
        modifiedTime: article.updatedAt.toISOString(),
        authors: [article.author],
        tags: safeTags(article.tags),
      },
    }),
    authors: [{ name: article.author }],
  };
}

function safeTags(raw: string): string[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
  });

  if (!article || !article.isPublished) {
    notFound();
  }

  let tags: string[] = [];
  try {
    tags = JSON.parse(article.tags);
  } catch {}

  const otherArticles = await db.article.findMany({
    where: {
      isPublished: true,
      slug: { not: article.slug },
    },
    take: 2,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <article className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 space-y-12 font-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: article.title,
              description: article.seoDesc || article.excerpt,
              image: `${SITE_URL}/writing/${article.slug}/opengraph-image`,
              datePublished: article.publishedAt.toISOString(),
              dateModified: article.updatedAt.toISOString(),
              url: `${SITE_URL}/writing/${article.slug}`,
              mainEntityOfPage: `${SITE_URL}/writing/${article.slug}`,
              keywords: tags.join(", "),
              author: { "@id": `${SITE_URL}/#person` },
              publisher: { "@id": `${SITE_URL}/#person` },
            },
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Writing", path: "/writing" },
              { name: article.title, path: `/writing/${article.slug}` },
            ]),
          ]),
        }}
      />
      {/* Back button */}
      <div>
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>← Back to Writing Index</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4 border-b border-border/60 pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-secondary">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{article.readingTime}</span>
          </span>
          <span>·</span>
          <span>By {article.author}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-primary tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-secondary leading-relaxed italic border-l-2 border-accent pl-4 py-1">
          {article.excerpt}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 font-mono text-xs">
            {tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded-md border border-border bg-surface text-secondary text-[11px]"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Article Markdown Content */}
      <Markdown>{article.content}</Markdown>

      {/* Author Bio Box */}
      <div className="p-6 rounded-2xl border border-border bg-surface/50 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={false} />
          <div>
            <h3 className="font-bold text-sm text-primary font-heading">
              Rauhan Sheikh
            </h3>
            <p className="text-secondary text-[11px]">
              Software developer building backend reliability, ledgers, and distributed systems.
            </p>
          </div>
        </div>
      </div>

      {/* Other Articles */}
      {otherArticles.length > 0 && (
        <div className="pt-8 border-t border-border/60 space-y-6">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
            More Technical Writing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherArticles.map((oa) => (
              <Link
                key={oa.id}
                href={`/writing/${oa.slug}`}
                className="p-5 rounded-xl border border-border bg-surface/40 hover:border-accent/60 transition-all space-y-2 group"
              >
                <div className="text-[11px] font-mono text-secondary">
                  {oa.readingTime}
                </div>
                <h4 className="font-heading font-bold text-sm text-primary group-hover:text-accent transition-colors leading-snug">
                  {oa.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
