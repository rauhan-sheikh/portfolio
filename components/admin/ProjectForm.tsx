"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Metric {
  label: string;
  value: string;
  description?: string;
}

interface CustomLink {
  label: string;
  url: string;
}

interface ProjectFormProps {
  initialData?: any;
  isNew?: boolean;
}

export default function ProjectForm({ initialData, isNew = false }: ProjectFormProps) {
  const router = useRouter();

  // Basic Info
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "PERSONAL");
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear().toString());
  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc || "");
  const [longDesc, setLongDesc] = useState(initialData?.longDesc || "");
  const [status, setStatus] = useState(initialData?.status || "PUBLISHED");
  const [isFeatured, setIsFeatured] = useState(Boolean(initialData?.isFeatured));
  const [showOnHome, setShowOnHome] = useState(initialData?.showOnHome ?? true);
  const [showInWork, setShowInWork] = useState(initialData?.showInWork ?? true);
  const [order, setOrder] = useState(initialData?.order || 0);

  // Identity & Styling
  const [accentColor, setAccentColor] = useState(initialData?.accentColor || "#3b82f6");
  const [projectMark, setProjectMark] = useState(initialData?.projectMark || "");

  // URLs
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "");
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "");
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl || "");

  // Narrative Blocks
  const [theProblem, setTheProblem] = useState(initialData?.theProblem || "");
  const [theMessyPart, setTheMessyPart] = useState(initialData?.theMessyPart || "");
  const [architecture, setArchitecture] = useState(initialData?.architecture || "");
  const [technicalDecisions, setTechnicalDecisions] = useState(initialData?.technicalDecisions || "");
  const [whatIdChange, setWhatIdChange] = useState(initialData?.whatIdChange || "");
  const [fullContent, setFullContent] = useState(initialData?.fullContent || "");

  // Structured Arrays
  const [stackTags, setStackTags] = useState<string[]>(() => {
    try {
      return initialData?.stack ? JSON.parse(initialData.stack) : [];
    } catch {
      return [];
    }
  });
  const [newTag, setNewTag] = useState("");

  const [metrics, setMetrics] = useState<Metric[]>(() => {
    try {
      return initialData?.metrics ? JSON.parse(initialData.metrics) : [];
    } catch {
      return [];
    }
  });

  const [links, setLinks] = useState<CustomLink[]>(() => {
    try {
      return initialData?.links ? JSON.parse(initialData.links) : [];
    } catch {
      return [];
    }
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto slug generation on title change when new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const addTag = () => {
    if (newTag.trim() && !stackTags.includes(newTag.trim())) {
      setStackTags([...stackTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setStackTags(stackTags.filter((t) => t !== tagToRemove));
  };

  const addMetric = () => {
    setMetrics([...metrics, { label: "New Metric", value: "0", description: "" }]);
  };

  const updateMetric = (index: number, field: keyof Metric, val: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: val };
    setMetrics(updated);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const addLink = () => {
    setLinks([...links, { label: "Documentation", url: "https://" }]);
  };

  const updateLink = (index: number, field: keyof CustomLink, val: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: val };
    setLinks(updated);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      title,
      slug,
      category,
      year,
      shortDesc,
      longDesc,
      status,
      isFeatured,
      showOnHome,
      showInWork,
      order: Number(order),
      accentColor,
      projectMark,
      liveUrl,
      githubUrl,
      demoUrl,
      theProblem,
      theMessyPart,
      architecture,
      technicalDecisions,
      whatIdChange,
      fullContent,
      stack: JSON.stringify(stackTags),
      metrics: JSON.stringify(metrics),
      links: JSON.stringify(links),
    };

    try {
      const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${initialData.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to save project" });
        setSaving(false);
        return;
      }

      setMessage({ type: "success", text: "Project saved successfully!" });
      setSaving(false);

      if (isNew) {
        setTimeout(() => {
          router.push(`/admin/projects/${data.id}`);
        }, 800);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "An unexpected error occurred" });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-body max-w-5xl">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {isNew ? "Create New Project" : `Edit: ${initialData.title}`}
            </h1>
            <p className="text-xs font-mono text-slate-400">
              {isNew ? "Add a new system to your portfolio wall" : `ID: ${initialData.id}`}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Project"}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 font-mono text-xs ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 1. Core Metadata */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
          1. Core Identification
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500 font-body text-sm"
              placeholder="e.g. BusinessOS"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">URL Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500 font-body text-sm"
              placeholder="business-os"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Classification</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500"
            >
              <option value="PERSONAL">Personal</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="CLIENT">Client</option>
              <option value="INTERNAL">Internal</option>
              <option value="OPEN_SOURCE">Open Source</option>
              <option value="EXPERIMENT">Experiment</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Visibility Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500"
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="PRIVATE">Private</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Year / Period</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500"
              placeholder="2024–2026"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Display Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500"
              placeholder="1"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showInWork"
              checked={showInWork}
              onChange={(e) => setShowInWork(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
            />
            <label htmlFor="showInWork" className="text-slate-300 cursor-pointer font-semibold">
              List in the Work directory
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showOnHome"
              checked={showOnHome}
              onChange={(e) => setShowOnHome(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
            />
            <label htmlFor="showOnHome" className="text-slate-300 cursor-pointer font-semibold">
              Show on the homepage
            </label>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
          />
          <label htmlFor="featured" className="text-slate-300 cursor-pointer font-semibold">
            Feature prominently on homepage Proof-of-Work wall
          </label>
        </div>
      </div>

      {/* 2. Short and Long Descriptions */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
          2. Overview & Elevator Pitch
        </h2>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">
            Short Description (Card preview, 1–2 sentences)
          </label>
          <textarea
            rows={2}
            required
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500 font-body text-sm leading-relaxed"
            placeholder="Commercial-grade financial operating system for SMEs with ledger-first accounting..."
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">
            Detailed Summary (Case study introduction)
          </label>
          <textarea
            rows={3}
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500 font-body text-sm leading-relaxed"
            placeholder="BusinessOS was built from the ground up to solve the core integrity problems..."
          />
        </div>
      </div>

      {/* 3. Tech Stack Tags & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technologies */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
            3. Technologies Used
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
              placeholder="e.g. BullMQ, Redis, PostgreSQL"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
            >
              Add Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {stackTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-700 bg-slate-900 text-slate-200 text-xs"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-slate-500 hover:text-red-400 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Measurable Metrics */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              4. Measurable Outcomes
            </h2>
            <button
              type="button"
              onClick={addMetric}
              className="flex items-center gap-1 text-blue-400 hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Metric</span>
            </button>
          </div>

          <div className="space-y-3">
            {metrics.map((m, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={m.value}
                    onChange={(e) => updateMetric(idx, "value", e.target.value)}
                    className="w-1/3 px-2 py-1 rounded border border-slate-700 bg-slate-950 text-slate-100 font-bold"
                    placeholder="9× Faster"
                  />
                  <input
                    type="text"
                    value={m.label}
                    onChange={(e) => updateMetric(idx, "label", e.target.value)}
                    className="flex-1 px-2 py-1 rounded border border-slate-700 bg-slate-950 text-slate-100"
                    placeholder="Metric Label"
                  />
                  <button
                    type="button"
                    onClick={() => removeMetric(idx)}
                    className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={m.description || ""}
                  onChange={(e) => updateMetric(idx, "description", e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-800 bg-slate-950 text-slate-400 text-[11px]"
                  placeholder="Optional brief explanation of how this was measured"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Deep Case Study Narrative Blocks */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
          5. Deep Narrative Blocks (Case Study Content)
        </h2>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">The Problem & Context</label>
          <textarea
            rows={3}
            value={theProblem}
            onChange={(e) => setTheProblem(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm leading-relaxed"
            placeholder="Describe the initial bottleneck, failure mode, or manual process..."
          />
        </div>

        <div>
          <label className="block text-amber-400 mb-1 font-semibold">
            The Messy Part / Behind the Build (Bugs, weird API behavior, edge cases)
          </label>
          <textarea
            rows={3}
            value={theMessyPart}
            onChange={(e) => setTheMessyPart(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm leading-relaxed"
            placeholder="Real engineering is messy. What broke? What edge cases showed up?"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">Architecture & System Flow</label>
          <textarea
            rows={3}
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm leading-relaxed"
            placeholder="Explain how components connect, queues, database indexes..."
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">
            What I&apos;d Do Differently Today (Demonstrates self-awareness & maturity)
          </label>
          <textarea
            rows={2}
            value={whatIdChange}
            onChange={(e) => setWhatIdChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm leading-relaxed"
            placeholder="If building this system again from scratch, what would you change?"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">
            Full Markdown / Technical Writeup
          </label>
          <textarea
            rows={8}
            value={fullContent}
            onChange={(e) => setFullContent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-mono text-xs leading-relaxed"
            placeholder="## Detailed breakdown&#10;&#10;Supports full Markdown, code snippets, lists, and headers..."
          />
        </div>
      </div>

      {/* 5. Links */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
          6. External Links & Repositories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Live System URL</label>
            <input
              type="text"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
              placeholder="https://businessos.rauhansheikh.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">GitHub Repository URL</label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
              placeholder="https://github.com/rauhan-sheikh/..."
            />
          </div>
        </div>
      </div>

      {/* Submit button bottom */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Link
          href="/admin/projects"
          className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-xs"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold font-mono text-xs cursor-pointer shadow-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Project"}
        </button>
      </div>
    </form>
  );
}
