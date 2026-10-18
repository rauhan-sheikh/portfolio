import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { Hammer, BookOpen, Brain, Sparkles, Compass, Headphones, PlayCircle, ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Now — Rauhan Sheikh",
  description:
    "What Rauhan Sheikh is building, learning and thinking about right now, plus the blogs, podcasts and videos worth your time.",
  path: "/now",
});

export const revalidate = 0;

export default async function NowPage() {
  const items = await db.nowItem.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "BUILDING":
        return Hammer;
      case "READING":
        return BookOpen;
      case "THINKING":
        return Brain;
      case "EXPERIMENTING":
        return Sparkles;
      case "LISTENING":
        return Headphones;
      case "WATCHING":
        return PlayCircle;
      default:
        return Compass;
    }
  };

  // Narrative items are big cards; items with a link are recommendations, grouped below.
  const narrative = items.filter((i) => !i.url);
  const resources = items.filter((i) => i.url);
  const groups = [
    { category: "READING", heading: "Blogs worth reading" },
    { category: "LISTENING", heading: "Podcasts worth hearing" },
    { category: "WATCHING", heading: "Videos worth watching" },
  ] as const;

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 font-body">
      {/* Header */}
      <div className="space-y-4 max-w-2xl border-b border-border/60 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/80 text-secondary text-xs font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span>Living Page · What I&apos;m Doing Now</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary tracking-tight">
          What I&apos;m Doing Now
        </h1>
        <p className="text-base sm:text-lg text-secondary leading-relaxed">
          Inspired by Derek Sivers&apos; <a href="https://nownownow.com/about" target="_blank" rel="noreferrer" className="text-accent underline">/now movement</a>. A public declaration of current priorities, experiments, and intellectual focus.
        </p>
      </div>

      {/* Living Items */}
      <div className="space-y-8">
        {narrative.map((item) => {
          const Icon = getCategoryIcon(item.category);
          return (
            <div
              key={item.id}
              className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/50 hover:bg-surface transition-colors space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-accent">
                <Icon className="h-4 w-4" />
                <span>{item.category}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary">
                {item.title}
              </h2>

              <p className="text-sm sm:text-base text-secondary leading-relaxed font-body">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      {resources.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-1 border-b border-border/60 pb-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
              // Worth your time
            </h2>
            <p className="text-sm text-secondary">
              The blogs, podcasts and videos I actually learn from. Short, practical and free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groups.map((g) => {
              const list = resources.filter((r) => r.category === g.category);
              if (list.length === 0) return null;
              const Icon = getCategoryIcon(g.category);
              return (
                <div key={g.category} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-secondary">
                    <Icon className="h-4 w-4 text-accent" />
                    <span>{g.heading}</span>
                  </div>
                  <ul className="space-y-3">
                    {list.map((r) => (
                      <li key={r.id}>
                        <a
                          href={r.url!}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group block p-4 rounded-xl border border-border bg-surface/50 hover:bg-surface hover:border-accent/60 transition-colors"
                        >
                          <span className="flex items-center justify-between gap-2 font-heading font-semibold text-primary group-hover:text-accent">
                            {r.title}
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                          </span>
                          <span className="block text-xs text-secondary leading-relaxed mt-1">{r.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="p-6 rounded-xl border border-border/60 bg-surface/30 font-mono text-xs text-secondary flex items-center justify-between">
        <span>Location: India · UTC+05:30</span>
        <Link href="/work" className="text-accent hover:underline">
          See recent work →
        </Link>
      </div>
    </div>
  );
}
