import React from "react";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { getResumeData } from "@/lib/resume";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resume — Rauhan Sheikh",
  description:
    "Curriculum Vitae and technical competencies of Rauhan Sheikh, Software Developer.",
  path: "/resume",
});

export const revalidate = 0;

export default async function ResumePage() {
  // Same data (and same function) as the downloadable PDF, so the two can never disagree.
  const data = await getResumeData();
  const { contact } = data;

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-12 font-body">
      {/* Header & Download Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary tracking-tight">
            {data.name}
          </h1>
          <p className="text-base font-mono text-accent mt-1">
            Software Developer · Backend & Distributed Systems
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-secondary mt-3">
            <span>{contact.location}</span>
            <span>·</span>
            <a href={`mailto:${contact.email}`} className="hover:text-primary underline">
              {contact.email}
            </a>
            <span>·</span>
            <a href={contact.github} target="_blank" rel="noreferrer" className="hover:text-primary underline">
              github.com/rauhan-sheikh
            </a>
            <span>·</span>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary underline">
              linkedin.com/in/rauhan-sheikh
            </a>
          </div>
        </div>

        <a
          href="/resume.pdf"
          download
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs font-mono hover:bg-accent-hover transition shadow-sm self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </a>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
            // Professional Summary
          </h2>
          <p className="text-sm sm:text-base text-secondary leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      <section className="space-y-8">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
          // Professional Experience
        </h2>

        <div className="space-y-8">
          {data.experience.map((exp, i) => (
            <div key={i} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h3 className="text-lg font-bold font-heading text-primary">
                  {exp.role} · <span className="text-accent">{exp.company}</span>
                </h3>
                <span className="text-xs font-mono text-secondary">
                  {exp.start}
                  {exp.end ? ` – ${exp.end}` : ""} {exp.location && `| ${exp.location}`}
                </span>
              </div>

              {exp.bullets.length > 0 && (
                <ul className="space-y-1.5 text-xs sm:text-sm text-secondary list-disc pl-5 leading-relaxed font-body">
                  {exp.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
              {exp.technologies.length > 0 && (
                <p className="text-[11px] font-mono text-secondary/80">
                  Tech: {exp.technologies.join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Selected Projects */}
      {data.projects.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
            // Selected Projects
          </h2>

          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.slug} className="p-5 rounded-xl border border-border bg-surface/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-heading text-primary">{proj.title}</h3>
                  <Link
                    href={`/work/${proj.slug}`}
                    className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                  >
                    <span>Case study</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <p className="text-xs text-secondary leading-relaxed">{proj.blurb}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {data.skills.length > 0 && (
        <section className="space-y-3 font-mono text-xs">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
            // Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-border bg-surface/50">
            {data.skills.map((g) => (
              <div key={g.label}>
                <span className="font-bold text-primary block mb-1">{g.label}</span>
                <p className="text-secondary leading-relaxed">{g.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education (kept compact: the work speaks) */}
      {data.education.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
            // Education
          </h2>
          <ul className="space-y-1 text-xs sm:text-sm text-secondary">
            {data.education.map((e) => (
              <li key={e.degree} className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                <span>
                  <span className="text-primary font-semibold">{e.degree}</span> · {e.institution}
                </span>
                <span className="font-mono text-xs">{[e.period, e.detail].filter(Boolean).join(" | ")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
