import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Layers, Briefcase, Award } from "lucide-react";

export const metadata = {
  title: "Experience & Track Record — Rauhan Sheikh",
  description: "Career timeline, growth of responsibility, and technical systems shipped by Rauhan Sheikh.",
};

export const revalidate = 0;

export default async function ExperiencePage() {
  const experiences = await db.experience.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 font-body">
      {/* Header */}
      <div className="space-y-4 max-w-2xl border-b border-border/60 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/80 text-secondary text-xs font-mono">
          <span>Career Journey · Ownership · Impact</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary tracking-tight">
          Track Record & Experience
        </h1>
        <p className="text-base sm:text-lg text-secondary leading-relaxed">
          Growth of technical responsibility: earning ownership through deep investigation, architecting background job pipelines, and scaling systems for 20,000+ users.
        </p>
      </div>

      {/* Timeline items */}
      <div className="space-y-12 relative">
        {/* Vertical visual guide line */}
        <div className="hidden sm:block absolute left-4 top-4 bottom-4 w-px bg-border/80" />

        {experiences.map((exp, idx) => {
          let bullets: string[] = [];
          let tech: string[] = [];
          let linkedProjects: string[] = [];
          try {
            bullets = JSON.parse(exp.bullets);
          } catch {}
          try {
            tech = JSON.parse(exp.technologies);
          } catch {}
          try {
            linkedProjects = JSON.parse(exp.linkedProjects);
          } catch {}

          return (
            <div key={exp.id} className="relative sm:pl-12 space-y-4">
              {/* Timeline Indicator Dot */}
              <div className="hidden sm:flex absolute left-2.5 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-background bg-accent shadow-xs" />

              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface/60 hover:border-accent/60 transition-all space-y-4 shadow-2xs">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary">
                      {exp.company}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-accent mt-1">
                      <span className="font-semibold">{exp.role}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-secondary">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{exp.startDate} – {exp.endDate || "Present"}</span>
                      </span>
                      {exp.location && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-secondary">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{exp.location}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {exp.isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-xs font-mono self-start sm:self-auto font-semibold">
                      Active Role
                    </span>
                  )}
                </div>

                {/* Description */}
                {exp.description && (
                  <p className="text-sm sm:text-base text-secondary leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {/* Bullets */}
                {bullets.length > 0 && (
                  <ul className="space-y-2 text-xs sm:text-sm text-secondary list-disc pl-5 leading-relaxed font-body">
                    {bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}

                {/* Technologies */}
                {tech.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 font-mono text-xs">
                    {tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md border border-border bg-background text-secondary text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Associated Projects Links */}
                {linkedProjects.length > 0 && (
                  <div className="pt-4 border-t border-border/60 space-y-2 font-mono text-xs">
                    <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                      Shipped Architecture & Projects
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {linkedProjects.map((pSlug) => (
                        <Link
                          key={pSlug}
                          href={`/work/${pSlug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 text-accent font-semibold transition-colors"
                        >
                          <Layers className="h-3.5 w-3.5" />
                          <span>View {pSlug} Case Study</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
