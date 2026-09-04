"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, Trash2, Save, X, Award, CheckCircle2, AlertCircle } from "lucide-react";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  bullets: string;
  technologies: string;
  metrics: string;
  linkedProjects: string;
  order: number;
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<ExperienceItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [bulletsText, setBulletsText] = useState("");
  const [techText, setTechText] = useState("");

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/experience");
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const openNew = () => {
    setEditingItem({
      company: "",
      role: "",
      location: "India",
      startDate: "2026",
      endDate: "Present",
      isCurrent: true,
      description: "",
      order: experiences.length + 1,
    });
    setBulletsText("");
    setTechText("");
  };

  const openEdit = (item: ExperienceItem) => {
    setEditingItem(item);
    try {
      const b = JSON.parse(item.bullets);
      setBulletsText(Array.isArray(b) ? b.join("\n") : "");
    } catch {
      setBulletsText(item.bullets || "");
    }
    try {
      const t = JSON.parse(item.technologies);
      setTechText(Array.isArray(t) ? t.join(", ") : "");
    } catch {
      setTechText(item.technologies || "");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.company || !editingItem?.role) return;
    setSaving(true);

    const bulletsArray = bulletsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const techArray = techText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...editingItem,
      bullets: JSON.stringify(bulletsArray),
      technologies: JSON.stringify(techArray),
    };

    try {
      const isNew = !editingItem.id;
      const url = isNew ? "/api/admin/experience" : `/api/admin/experience/${editingItem.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setEditingItem(null);
        await fetchExperience();
      } else {
        alert("Failed to save experience item");
      }
    } catch (err) {
      alert("Error saving experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!confirm(`Delete experience entry for "${company}"?`)) return;

    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExperiences((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      alert("Failed to delete experience");
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            Experience & Career Progression
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Highlight growth of responsibility, key achievements, and associated engineering modules.
          </p>
        </div>

        <button
          onClick={openNew}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Editor Modal / Drawer */}
      {editingItem && (
        <div className="p-6 rounded-xl border border-blue-500/40 bg-slate-950 font-mono text-xs space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white">
              {editingItem.id ? `Edit Role at ${editingItem.company}` : "New Position Entry"}
            </h2>
            <button
              onClick={() => setEditingItem(null)}
              className="p-1 rounded text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Company / Organization</label>
                <input
                  type="text"
                  required
                  value={editingItem.company || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                  placeholder="e.g. ProSync Infotech"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Role / Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.role || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                  placeholder="Software Developer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Start Date</label>
                <input
                  type="text"
                  value={editingItem.startDate || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                  placeholder="May 2024"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">End Date</label>
                <input
                  type="text"
                  value={editingItem.endDate || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                  placeholder="Present"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Location</label>
                <input
                  type="text"
                  value={editingItem.location || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                  placeholder="India / Remote"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Display Order</label>
                <input
                  type="number"
                  value={editingItem.order ?? 1}
                  onChange={(e) => setEditingItem({ ...editingItem, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Overview Description</label>
              <textarea
                rows={2}
                value={editingItem.description || ""}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-xs"
                placeholder="High-level summary of responsibilities..."
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Bullet Points (1 per line)
              </label>
              <textarea
                rows={4}
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-xs leading-relaxed"
                placeholder="Spearheaded Microsoft Teams Graph API integration...&#10;Re-architected bulk email pipeline to BullMQ..."
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Technologies Used (Comma separated)
              </label>
              <input
                type="text"
                value={techText}
                onChange={(e) => setTechText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden text-xs"
                placeholder="Node.js, Express, PostgreSQL, Prisma, Redis, Next.js"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer shadow-xs"
              >
                {saving ? "Saving..." : "Save Position"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading experience history...
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 transition-all font-mono text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-6 rounded bg-slate-900 border border-slate-700 text-slate-400 flex items-center justify-center font-bold text-[11px]">
                    #{exp.order}
                  </span>
                  <div>
                    <h3 className="text-base font-bold font-heading text-white">
                      {exp.company}
                    </h3>
                    <p className="text-xs text-blue-400 font-medium">
                      {exp.role} · {exp.startDate} – {exp.endDate || "Present"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(exp)}
                    className="p-1.5 rounded hover:bg-slate-800 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    title="Edit entry"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id, exp.company)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {exp.description && (
                <p className="text-slate-300 font-body text-xs leading-relaxed">
                  {exp.description}
                </p>
              )}

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(() => {
                  try {
                    const t = JSON.parse(exp.technologies);
                    return Array.isArray(t)
                      ? t.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-400 text-[10px]"
                          >
                            {tag}
                          </span>
                        ))
                      : null;
                  } catch {
                    return null;
                  }
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
