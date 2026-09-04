"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, ArrowUpRight, ExternalLink, Filter } from "lucide-react";
import { Github } from "./Icons";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  year?: string | null;
  shortDesc: string;
  status: string;
  metrics: string;
  stack: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  projectMark?: string | null;
}

export default function WorkDirectory({ projects }: { projects: ProjectItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { label: "All", value: "ALL" },
    { label: "Personal", value: "PERSONAL" },
    { label: "Professional", value: "PROFESSIONAL" },
    { label: "Client Work", value: "CLIENT" },
    { label: "Internal Systems", value: "INTERNAL" },
    { label: "Open Source", value: "OPEN_SOURCE" },
    { label: "Experiments", value: "EXPERIMENT" },
  ];

  const filtered = projects.filter((p) => {
    const matchesCategory = activeCategory === "ALL" || p.category === activeCategory;
    const text = `${p.title} ${p.shortDesc} ${p.stack}`.toLowerCase();
    const matchesQuery = text.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-8 font-body">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-surface/50 font-mono text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeCategory === cat.value
                  ? "border-accent bg-accent/15 text-accent font-semibold shadow-xs"
                  : "border-border/60 bg-background/50 hover:bg-surface text-secondary hover:text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stack, title..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-primary placeholder:text-secondary focus:outline-hidden focus:border-accent text-xs"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-border bg-surface/30 font-mono text-xs text-secondary">
          No projects found matching the filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {filtered.map((proj) => {
            let metricsList: any[] = [];
            let stackList: string[] = [];
            try {
              metricsList = JSON.parse(proj.metrics);
            } catch {}
            try {
              stackList = JSON.parse(proj.stack);
            } catch {}

            return (
              <div
                key={proj.id}
                className="rounded-2xl border border-border bg-surface/60 hover:border-accent/60 p-6 sm:p-8 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-4">
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

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-primary group-hover:text-accent transition-colors tracking-tight">
                      <Link href={`/work/${proj.slug}`}>{proj.title}</Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary mt-2 leading-relaxed">
                      {proj.shortDesc}
                    </p>
                  </div>

                  {/* Metrics */}
                  {metricsList.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {metricsList.slice(0, 2).map((m, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg border border-border/70 bg-background/60 space-y-0.5"
                        >
                          <div className="text-sm font-bold font-heading text-primary">
                            {m.value}
                          </div>
                          <div className="text-[10px] font-mono text-secondary truncate">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech stack tags */}
                  {stackList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stackList.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[11px] font-mono border border-border bg-background text-secondary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

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
      )}
    </div>
  );
}
