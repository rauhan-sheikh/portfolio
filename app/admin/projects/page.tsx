"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Edit3, Trash2, ExternalLink, Star, Filter, Eye } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year?: string;
  status: string;
  isFeatured: boolean;
  order: number;
  liveUrl?: string;
  githubUrl?: string;
  stack: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const filtered = projects.filter((p) => {
    if (categoryFilter !== "ALL" && p.category !== categoryFilter) return false;
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-body">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            Projects & Case Studies
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage portfolio projects, technical case studies, metrics, and display ordering.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors self-start sm:self-auto shadow-xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mr-2">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:outline-hidden"
        >
          <option value="ALL">All Categories</option>
          <option value="PERSONAL">Personal</option>
          <option value="PROFESSIONAL">Professional</option>
          <option value="CLIENT">Client</option>
          <option value="INTERNAL">Internal</option>
          <option value="OPEN_SOURCE">Open Source</option>
          <option value="EXPERIMENT">Experiment</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 focus:outline-hidden"
        >
          <option value="ALL">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="PRIVATE">Private</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <div className="ml-auto text-slate-500 text-[11px]">
          Showing {filtered.length} of {projects.length}
        </div>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading projects...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500 rounded-xl border border-slate-800 bg-slate-950/40 font-mono text-xs">
          No projects match your filter criteria.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-bold">
                      #{proj.order}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white font-heading text-sm">
                        {proj.title}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>/{proj.slug}</span>
                        {proj.year && <span>· {proj.year}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300 text-[10px]">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          proj.status === "PUBLISHED"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : proj.status === "DRAFT"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {proj.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 text-[11px]">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/work/${proj.slug}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                          title="View on site"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${proj.id}`}
                          className="p-1.5 rounded hover:bg-slate-800 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit project"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(proj.id, proj.title)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
