import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, BookOpen, Tag } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Writing & Technical Essays — Rauhan Sheikh",
  description:
    "Technical essays and engineering post-mortems on BullMQ queues, database indexing, financial ledgers, and API architecture.",
  path: "/writing",
});

export const revalidate = 0;

export default async function WritingPage() {
  const articles = await db.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 font-body">
      {/* Header */}
      <div className="space-y-4 max-w-2xl border-b border-border/60 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/80 text-secondary text-xs font-mono">
          <span>Writing · Lessons · Systems Thinking</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary tracking-tight">
          Technical Writing & Post-Mortems
        </h1>
        <p className="text-base sm:text-lg text-secondary leading-relaxed">
          Essays rooted in actual systems built, bugs debugged, and production decisions made. No generic tutorials.
        </p>
      </div>

      {/* Articles Listing */}
      <div className="space-y-6">
        {articles.map((art) => {
          let tags: string[] = [];
          try {
            tags = JSON.parse(art.tags);
          } catch {}

          return (
            <article
              key={art.id}
              className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/60 hover:border-accent/60 transition-all space-y-4 group shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-secondary">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{art.readingTime}</span>
                  </span>
                </div>
                {art.isFeatured && (
                  <span className="text-amber-500 font-bold text-[11px] uppercase tracking-wider">
                    ★ Featured Essay
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary group-hover:text-accent transition-colors leading-snug">
                  <Link href={`/writing/${art.slug}`}>{art.title}</Link>
                </h2>
                <p className="text-sm text-secondary leading-relaxed mt-2.5">
                  {art.excerpt}
                </p>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-xs">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-md border border-border bg-background text-secondary text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-accent">
                <Link
                  href={`/writing/${art.slug}`}
                  className="flex items-center gap-1.5 font-semibold group-hover:underline"
                >
                  <span>Read Full Essay</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
