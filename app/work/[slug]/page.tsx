import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
  Layers,
  AlertTriangle,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Github } from "@/components/public/Icons";
import TeamsArchitectureStory from "@/components/public/TeamsArchitectureStory";
import BulkEmailArchitectureStory from "@/components/public/BulkEmailArchitectureStory";
import Markdown from "@/components/public/Markdown";
import { SITE_URL, pageMetadata, fitTitle, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await db.project.findUnique({
    where: { slug },
  });

  if (!project || project.status === "PRIVATE") {
    return { title: "Project Not Found", robots: { index: false, follow: false } };
  }

  return pageMetadata({
    title: {
      absolute: fitTitle(
        `${project.title} — Case Study | Rauhan Sheikh`,
        `${project.title} — Rauhan Sheikh`,
        project.title
      ),
    },
    description: project.shortDesc,
    path: `/work/${project.slug}`,
    type: "article",
    ogTitle: `${project.title} — Rauhan Sheikh`,
  });
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await db.project.findUnique({
    where: { slug },
  });

  if (!project || project.status === "PRIVATE") {
    notFound();
  }

  let stackList: string[] = [];
  let metricsList: any[] = [];
  try {
    stackList = JSON.parse(project.stack);
  } catch {}
  try {
    metricsList = JSON.parse(project.metrics);
  } catch {}

  // Fetch 2 other related projects
  const relatedProjects = await db.project.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: project.slug },
    },
    take: 2,
  });

  return (
    <article className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 font-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: project.title,
              description: project.shortDesc,
              url: `${SITE_URL}/work/${project.slug}`,
              mainEntityOfPage: `${SITE_URL}/work/${project.slug}`,
              image: `${SITE_URL}/work/${project.slug}/opengraph-image`,
              ...(project.year ? { dateCreated: project.year } : {}),
              keywords: stackList.join(", "),
              genre: project.category,
              author: { "@id": `${SITE_URL}/#person` },
              creator: { "@id": `${SITE_URL}/#person` },
            },
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Work", path: "/work" },
              { name: project.title, path: `/work/${project.slug}` },
            ]),
          ]),
        }}
      />
      {/* Back button */}
      <div>
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>← Back to Work Directory</span>
        </Link>
      </div>

      {/* Hero Header */}
      <header className="space-y-6 border-b border-border/60 pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-secondary">
          <span className="px-2.5 py-0.5 rounded border border-border bg-surface text-primary font-bold">
            {project.category}
          </span>
          {project.projectMark && (
            <span className="text-accent font-bold">[{project.projectMark}]</span>
          )}
          {project.year && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{project.year}</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-primary tracking-tight leading-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-3xl">
          {project.shortDesc}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition flex items-center gap-1.5 shadow-xs"
            >
              <span>Visit Live System</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl border border-border bg-surface hover:border-accent hover:text-accent transition flex items-center gap-1.5"
            >
              <Github className="h-3.5 w-3.5" />
              <span>Source Code</span>
            </a>
          )}
        </div>
      </header>

      {/* Metrics Banner */}
      {metricsList.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metricsList.map((m, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-border bg-surface/60 space-y-1 shadow-2xs"
            >
              <div className="text-2xl font-bold font-heading text-primary">
                {m.value}
              </div>
              <div className="text-xs font-mono font-semibold text-accent">
                {m.label}
              </div>
              {m.description && (
                <div className="text-[11px] font-mono text-secondary pt-1 leading-relaxed">
                  {m.description}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Tech Stack Bar */}
      {stackList.length > 0 && (
        <section className="space-y-3 font-mono text-xs">
          <p className="text-secondary text-[11px] font-semibold uppercase tracking-wider">
            Engineered With
          </p>
          <div className="flex flex-wrap gap-2">
            {stackList.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Embedded Interactive Story if relevant */}
      {project.slug === "microsoft-teams-engine" && (
        <section className="space-y-4">
          <TeamsArchitectureStory />
        </section>
      )}

      {project.slug === "bulk-email-engine" && (
        <section className="space-y-4">
          <BulkEmailArchitectureStory />
        </section>
      )}

      {/* Narrative Block 1: Problem */}
      {project.theProblem && (
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary tracking-tight">
            The Problem & Context
          </h2>
          <div className="p-6 rounded-xl border border-border bg-surface/40 text-secondary text-sm leading-relaxed whitespace-pre-wrap font-body">
            {project.theProblem}
          </div>
        </section>
      )}

      {/* Narrative Block 2: The Messy Part (Behind the Build) */}
      {project.theMessyPart && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary tracking-tight">
              The Messy Part (Behind the Build)
            </h2>
          </div>
          <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 text-secondary text-sm leading-relaxed whitespace-pre-wrap font-body">
            {project.theMessyPart}
          </div>
        </section>
      )}

      {/* Narrative Block 3: Architecture & System Flow */}
      {project.architecture && (
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary tracking-tight">
            Architecture & Design Decisions
          </h2>
          <div className="p-6 rounded-xl border border-border bg-surface/40 text-secondary text-sm leading-relaxed whitespace-pre-wrap font-body">
            {project.architecture}
          </div>
        </section>
      )}

      {/* Narrative Block 4: Full Content (Markdown body) */}
      {project.fullContent && (
        <section>
          <Markdown>{project.fullContent}</Markdown>
        </section>
      )}

      {/* Narrative Block 5: What I'd Do Differently */}
      {project.whatIdChange && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary tracking-tight">
              What I&apos;d Do Differently Today
            </h2>
          </div>
          <div className="p-6 rounded-xl border border-accent/20 bg-accent/5 text-secondary text-sm leading-relaxed whitespace-pre-wrap font-body">
            {project.whatIdChange}
          </div>
        </section>
      )}

      {/* Related Systems Bottom */}
      {relatedProjects.length > 0 && (
        <div className="pt-12 border-t border-border/60 space-y-6">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
            Related Work & Systems
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedProjects.map((rp) => (
              <Link
                key={rp.id}
                href={`/work/${rp.slug}`}
                className="p-5 rounded-xl border border-border bg-surface/50 hover:border-accent/60 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-secondary">
                  <span>{rp.category}</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <h4 className="font-heading font-bold text-sm text-primary group-hover:text-accent transition-colors">
                  {rp.title}
                </h4>
                <p className="text-xs text-secondary line-clamp-2">
                  {rp.shortDesc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
