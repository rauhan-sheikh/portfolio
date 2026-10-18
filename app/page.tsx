import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Terminal,
  Layers,
  Cpu,
  Database,
  ExternalLink,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
} from "lucide-react";
import { Github } from "@/components/public/Icons";
import TeamsArchitectureStory from "@/components/public/TeamsArchitectureStory";
import BulkEmailArchitectureStory from "@/components/public/BulkEmailArchitectureStory";

export const metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 0; // Dynamic server component

export default async function HomePage() {
  // Fetch homepage data and section toggles
  const [
    featuredProjects,
    recentArticles,
    nowItems,
    experiences,
    personalityItems,
    settingsList,
  ] = await Promise.all([
    db.project.findMany({
      where: { status: "PUBLISHED", showOnHome: true },
      orderBy: { order: "asc" },
      take: 4,
    }),
    db.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    db.nowItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    db.experience.findMany({
      orderBy: { order: "asc" },
      take: 3,
    }),
    db.personalityItem.findMany({
      orderBy: { order: "asc" },
      take: 4,
    }),
    db.siteSetting.findMany(),
  ]);

  const settings: Record<string, string> = {};
  settingsList.forEach((s) => {
    settings[s.key] = s.value;
  });

  const isEnabled = (key: string) => settings[key] !== "false";

  return (
    <div className="space-y-24 sm:space-y-32 pt-28 pb-16 max-w-6xl mx-auto px-4 sm:px-6 font-body">
      {/* 1. HERO SECTION */}
      {isEnabled("section_hero_enabled") && (
        <section id="hero" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Main Manifesto */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/80 text-secondary text-xs font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span>Software Developer · Backend & Distributed Systems · India</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading text-primary tracking-tight leading-[1.08]">
                Rauhan Sheikh<span className="text-accent">.</span>
              </h1>

              <div className="flex items-center gap-3 text-lg sm:text-2xl font-heading text-accent font-semibold">
                <span>{settings.site_tagline || "I like building the parts of software that have to actually work."}</span>
              </div>

              <p className="text-base sm:text-lg leading-relaxed text-secondary max-w-2xl">
                {settings.site_bio ||
                  "I build things, break things, figure things out, and ship them. Focused on backend reliability, database architecture, immutable ledgers, and resilient web software."}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
                <Link
                  href="/work"
                  className="px-5 py-2.5 rounded-xl bg-primary text-background font-semibold hover:bg-primary/90 transition shadow-sm flex items-center gap-2"
                >
                  <span>Explore Work</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/writing"
                  className="px-5 py-2.5 rounded-xl border border-border bg-surface hover:border-accent hover:text-accent transition shadow-2xs"
                >
                  Read Technical Essays
                </Link>
                <Link
                  href={settings.resume_pdf_url || "/resume.pdf"}
                  target="_blank"
                  className="px-5 py-2.5 rounded-xl border border-border/70 hover:bg-surface text-secondary hover:text-primary transition"
                >
                  Download Résumé
                </Link>
              </div>
            </div>

            {/* Engineering Snapshot Cards */}
            <div className="lg:col-span-4 rounded-2xl border border-border bg-surface/60 p-6 space-y-4 shadow-sm font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 text-secondary">
                <div className="flex items-center gap-2 text-accent">
                  <Terminal className="h-4 w-4" />
                  <span className="font-bold">// SNAPSHOT</span>
                </div>
                <span>STATUS: ACTIVE</span>
              </div>

              <ul className="space-y-3 text-secondary text-[12px] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-accent font-bold">01</span>
                  <span>
                    <strong className="text-primary font-semibold">Production Ownership:</strong> Scaled systems serving 20K+ active students across LMS & ERP portals.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent font-bold">02</span>
                  <span>
                    <strong className="text-primary font-semibold">Architecture Discipline:</strong> Replaced fragile browser loops with BullMQ/Redis worker pipelines.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent font-bold">03</span>
                  <span>
                    <strong className="text-primary font-semibold">Data Integrity:</strong> Engineered double-entry financial accounting using integer minor units & BigInt.
                  </span>
                </li>
              </ul>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-secondary">
                <span>TypeScript · PostgreSQL · Prisma</span>
                <span className="text-emerald-500">Online</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. CURRENTLY / NOW PREVIEW */}
      {isEnabled("section_now_enabled") && nowItems.length > 0 && (
        <section id="currently" className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>Currently / Now</span>
            </div>
            <Link
              href="/now"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
            >
              <span>View Full Now Page</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nowItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-border bg-surface/50 hover:bg-surface transition-colors space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent">
                    {item.category}
                  </span>
                  <h3 className="font-heading font-semibold text-sm text-primary mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-secondary mt-1">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. PROOF OF WORK WALL */}
      {isEnabled("section_featured_work_enabled") && (
        <section id="work" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-accent mb-1">
                // PROOF OF WORK
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading text-primary tracking-tight">
                Featured Systems & Architecture
              </h2>
              <p className="text-sm text-secondary mt-1 max-w-xl">
                Not generic demo clones. Commercial-grade systems, double-entry financial engines, and production integrations.
              </p>
            </div>

            <Link
              href="/work"
              className="text-xs font-mono font-semibold text-accent hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Browse All Systems ({featuredProjects.length}+)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Cards with Varied Compositions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {featuredProjects.map((proj, idx) => {
              let metricsList: any[] = [];
              let stackList: string[] = [];
              try {
                metricsList = JSON.parse(proj.metrics);
              } catch {}
              try {
                stackList = JSON.parse(proj.stack);
              } catch {}

              const isPrimary = idx === 0;

              return (
                <div
                  key={proj.id}
                  className={`rounded-2xl border border-border bg-surface/60 hover:border-accent/60 p-6 sm:p-8 flex flex-col justify-between transition-all group ${
                    isPrimary ? "md:col-span-2 bg-surface/80" : ""
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top pill & classification */}
                    <div className="flex items-center justify-between text-xs font-mono text-secondary">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded border border-border bg-background text-[11px] font-semibold text-primary">
                          {proj.category}
                        </span>
                        {proj.projectMark && (
                          <span className="text-accent font-bold">[{proj.projectMark}]</span>
                        )}
                      </div>
                      <span>{proj.year}</span>
                    </div>

                    {/* Title and Short Description */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold font-heading text-primary group-hover:text-accent transition-colors tracking-tight">
                        <Link href={`/work/${proj.slug}`}>{proj.title}</Link>
                      </h3>
                      <p className="text-sm text-secondary mt-2 leading-relaxed max-w-2xl">
                        {proj.shortDesc}
                      </p>
                    </div>

                    {/* Measurable Outcomes Grid */}
                    {metricsList.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        {metricsList.map((m, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl border border-border/70 bg-background/60 space-y-0.5"
                          >
                            <div className="text-base sm:text-lg font-bold font-heading text-primary">
                              {m.value}
                            </div>
                            <div className="text-[11px] font-mono text-secondary truncate">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack Pills */}
                    {stackList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {stackList.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono border border-border bg-background text-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Links bottom */}
                  <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                    <Link
                      href={`/work/${proj.slug}`}
                      className="text-primary group-hover:text-accent font-semibold flex items-center gap-1.5"
                    >
                      <span>Read Deep Case Study</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex items-center gap-3 text-secondary">
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-primary flex items-center gap-1"
                        >
                          <span>Live</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-primary flex items-center gap-1"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. SIGNATURE ENGINEERING STORIES */}
      {isEnabled("section_signature_stories_enabled") && (
        <section id="stories" className="space-y-8">
          <div className="border-b border-border/60 pb-4">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-accent mb-1">
              // ARCHITECTURE DEEP-DIVES
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold font-heading text-primary tracking-tight">
              Signature Engineering Stories
            </h2>
            <p className="text-sm text-secondary mt-1 max-w-xl">
              Real engineering is messy. How system bottlenecks were debugged, refactored, and solved at scale.
            </p>
          </div>

          <div className="space-y-8">
            <TeamsArchitectureStory />
            <BulkEmailArchitectureStory />
          </div>
        </section>
      )}

      {/* 5. EXPERIENCE & GROWTH PREVIEW */}
      {isEnabled("section_experience_enabled") && experiences.length > 0 && (
        <section id="experience" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-accent mb-1">
                // TRACK RECORD
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading text-primary tracking-tight">
                Growth of Responsibility
              </h2>
              <p className="text-sm text-secondary mt-1">
                From self-directed learning to software development, team ownership, and enterprise architecture.
              </p>
            </div>

            <Link
              href="/experience"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Full Career Timeline</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {experiences.map((exp) => {
              let bullets: string[] = [];
              try {
                bullets = JSON.parse(exp.bullets);
              } catch {}

              return (
                <div
                  key={exp.id}
                  className="p-6 rounded-2xl border border-border bg-surface/50 hover:bg-surface transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold font-heading text-primary">
                        {exp.company}
                      </h3>
                      <p className="text-xs font-mono text-accent">
                        {exp.role} · {exp.startDate} – {exp.endDate || "Present"}
                      </p>
                    </div>
                    {exp.isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[11px] font-mono self-start sm:self-auto">
                        Current Role
                      </span>
                    )}
                  </div>

                  {exp.description && (
                    <p className="text-sm text-secondary leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {bullets.length > 0 && (
                    <ul className="space-y-1.5 pt-1 text-xs text-secondary list-disc pl-4 font-body">
                      {bullets.slice(0, 2).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. WRITING / ESSAYS PREVIEW */}
      {isEnabled("section_writing_enabled") && recentArticles.length > 0 && (
        <section id="writing" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-accent mb-1">
                // THINKING & NOTES
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading text-primary tracking-tight">
                Technical Writing
              </h2>
              <p className="text-sm text-secondary mt-1">
                Essays rooted in actual implementation experiences, database internals, and architectural trade-offs.
              </p>
            </div>

            <Link
              href="/writing"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Articles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((art) => (
              <div
                key={art.id}
                className="p-6 rounded-2xl border border-border bg-surface/50 hover:border-accent/60 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-secondary">
                    <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                    <span>{art.readingTime}</span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-primary group-hover:text-accent transition-colors leading-snug">
                    <Link href={`/writing/${art.slug}`}>{art.title}</Link>
                  </h3>

                  <p className="text-xs text-secondary leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 text-xs font-mono text-accent flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. PERSONALITY & OPINIONS MODULE */}
      {isEnabled("section_personality_enabled") && personalityItems.length > 0 && (
        <section id="personality" className="space-y-6">
          <div className="border-b border-border/60 pb-4">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-accent mb-1">
              // THE HUMAN LAYER
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-primary tracking-tight">
              Engineering Opinions & Quirks
            </h2>
            <p className="text-sm text-secondary mt-1">
              Because good engineering is practiced by humans with taste, obsessions, and principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personalityItems.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl border border-border bg-surface/40 hover:bg-surface transition-colors space-y-2"
              >
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider">
                  {p.category.replace("_", " ")}
                </span>
                <h3 className="text-sm font-bold font-heading text-primary">
                  {p.title}
                </h3>
                <p className="text-xs leading-relaxed text-secondary">
                  &ldquo;{p.body}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. CONTACT ACTION STRIP */}
      {isEnabled("section_contact_enabled") && (
        <section
          id="contact-strip"
          className="rounded-2xl border border-accent/30 bg-accent/5 p-8 sm:p-12 space-y-6 text-center"
        >
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-primary tracking-tight">
            Let&apos;s build software that matters.
          </h2>
          <p className="text-sm sm:text-base text-secondary max-w-xl mx-auto leading-relaxed">
            Interested in discussing backend architecture, distributed systems, or engineering roles? My inbox is always open.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs pt-2">
            <a
              href="mailto:hello@rauhansheikh.com"
              className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition shadow-sm"
            >
              hello@rauhansheikh.com
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl border border-border bg-surface hover:border-accent hover:text-accent transition shadow-2xs"
            >
              Send a Message
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
