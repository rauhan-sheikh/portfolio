import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { Clock, Hammer, BookOpen, Brain, Sparkles, Compass } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Now — Rauhan Sheikh",
  description:
    "What Rauhan Sheikh is currently building, reading, learning, and thinking about.",
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
      default:
        return Compass;
    }
  };

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
        {items.map((item) => {
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

      <div className="p-6 rounded-xl border border-border/60 bg-surface/30 font-mono text-xs text-secondary flex items-center justify-between">
        <span>Location: India · UTC+05:30</span>
        <Link href="/work" className="text-accent hover:underline">
          See recent work →
        </Link>
      </div>
    </div>
  );
}
