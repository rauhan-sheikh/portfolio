import React from "react";
import { db } from "@/lib/db";
import { Download, ExternalLink, Calendar, MapPin, Mail, Award, Briefcase } from "lucide-react";
import { Github, Linkedin } from "@/components/public/Icons";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resume — Rauhan Sheikh",
  description:
    "Curriculum Vitae and technical competencies of Rauhan Sheikh, Software Developer.",
  path: "/resume",
});

export const revalidate = 0;

export default async function ResumePage() {
  const [experiences, settingsList, projects] = await Promise.all([
    db.experience.findMany({ orderBy: { order: "asc" } }),
    db.siteSetting.findMany(),
    db.project.findMany({ where: { isFeatured: true }, orderBy: { order: "asc" } }),
  ]);

  const settings: Record<string, string> = {};
  settingsList.forEach((s) => {
    settings[s.key] = s.value;
  });

  const pdfUrl = settings.resume_pdf_url || "/resume.pdf";

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-12 font-body">
      {/* Header & Download Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary tracking-tight">
            Rauhan Sheikh
          </h1>
          <p className="text-base font-mono text-accent mt-1">
            Software Developer · Backend & Distributed Systems
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-secondary mt-3">
            <span>India</span>
            <span>·</span>
            <a href="mailto:hello@rauhansheikh.com" className="hover:text-primary underline">
              hello@rauhansheikh.com
            </a>
            <span>·</span>
            <a href="https://github.com/rauhan-sheikh" target="_blank" rel="noreferrer" className="hover:text-primary underline">
              github.com/rauhan-sheikh
            </a>
            <span>·</span>
            <a href="https://linkedin.com/in/rauhan-sheikh" target="_blank" rel="noreferrer" className="hover:text-primary underline">
              linkedin.com/in/rauhan-sheikh
            </a>
          </div>
        </div>

        <a
          href={pdfUrl}
          target="_blank"
          download
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs font-mono hover:bg-accent-hover transition shadow-sm self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </a>
      </div>

      {/* Summary */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
          // Professional Summary
        </h2>
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          {settings.resume_summary ||
            "Full Stack Engineer with 2+ years of production experience designing APIs, architecting background job queues with BullMQ and Redis, and scaling EdTech and financial platforms serving 20,000+ active users."}
        </p>
      </section>

      {/* Core Technical Competencies */}
      <section className="space-y-3 font-mono text-xs">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
          // Core Competencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-border bg-surface/50">
          <div>
            <span className="font-bold text-primary block mb-1">Backend & Distributed Systems</span>
            <p className="text-secondary leading-relaxed">
              Node.js, Express, TypeScript, RESTful API Design, Microservices, BullMQ, Redis, Background Job Queues, WebSocket Synchronization.
            </p>
          </div>
          <div>
            <span className="font-bold text-primary block mb-1">Database & Data Integrity</span>
            <p className="text-secondary leading-relaxed">
              PostgreSQL, Prisma ORM, Query Optimization (EXPLAIN ANALYZE), Composite Partial Indexing, Double-Entry Accounting Ledgers, MongoDB.
            </p>
          </div>
          <div>
            <span className="font-bold text-primary block mb-1">Frontend & Applications</span>
            <p className="text-secondary leading-relaxed">
              Next.js (App Router, Server Components), React, TypeScript, Tailwind CSS, Responsive UI Design, State Management.
            </p>
          </div>
          <div>
            <span className="font-bold text-primary block mb-1">Architecture & Infrastructure</span>
            <p className="text-secondary leading-relaxed">
              Docker, Git, CI/CD, Role-Based Access Control (RBAC), Microsoft Graph API Integration, OAuth2, Vercel.
            </p>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section className="space-y-8">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
          // Professional Experience
        </h2>

        <div className="space-y-8">
          {experiences.map((exp) => {
            let bullets: string[] = [];
            try {
              bullets = JSON.parse(exp.bullets);
            } catch {}

            return (
              <div key={exp.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-primary">
                      {exp.role} · <span className="text-accent">{exp.company}</span>
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-secondary">
                    {exp.startDate} – {exp.endDate || "Present"} {exp.location && `| ${exp.location}`}
                  </span>
                </div>

                {bullets.length > 0 && (
                  <ul className="space-y-1.5 text-xs sm:text-sm text-secondary list-disc pl-5 leading-relaxed font-body">
                    {bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Selected Featured Projects */}
      <section className="space-y-6">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
          // Key Systems & Engineering Proof
        </h2>

        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="p-5 rounded-xl border border-border bg-surface/40 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-heading text-primary">
                  {proj.title}
                </h3>
                <Link
                  href={`/work/${proj.slug}`}
                  className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                >
                  <span>Case study</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                {proj.shortDesc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
