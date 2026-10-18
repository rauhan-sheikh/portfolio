import React from "react";
import { db } from "@/lib/db";
import WorkDirectory from "@/components/public/WorkDirectory";

export const metadata = {
  title: "Work & Systems — Rauhan Sheikh",
  description: "Explore commercial-grade software, financial ledgers, and distributed systems built by Rauhan Sheikh.",
  alternates: { canonical: "/work" },
};

export const revalidate = 0;

export default async function WorkPage() {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED", showInWork: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="pt-28 pb-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-12 font-body">
      {/* Header */}
      <div className="space-y-4 max-w-3xl border-b border-border/60 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/80 text-secondary text-xs font-mono">
          <span>Systems · Architecture · Proof of Work</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary tracking-tight">
          Selected Work & Production Systems
        </h1>
        <p className="text-base sm:text-lg text-secondary leading-relaxed">
          A collection of commercial products, client systems, and technical experiments where correctness, performance, and real-world reliability were the primary constraints.
        </p>
      </div>

      <WorkDirectory projects={projects} />
    </div>
  );
}
