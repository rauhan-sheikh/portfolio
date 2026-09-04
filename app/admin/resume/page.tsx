"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, FileText, Download, ExternalLink } from "lucide-react";

export default function AdminResumePage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save resume configuration");
      }
    } catch {
      alert("Error saving resume settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 font-body max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            Resume & Competencies Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure downloadable resume PDF location, summary bio, and competency highlights.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Resume Config"}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Resume settings updated successfully!</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading resume settings...
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs space-y-4">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Downloadable Resume PDF URL or Local Path
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.resume_pdf_url || "/resume.pdf"}
                onChange={(e) => handleChange("resume_pdf_url", e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                placeholder="/resume.pdf or https://..."
              />
              <a
                href={settings.resume_pdf_url || "/resume.pdf"}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Test Link</span>
              </a>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Place your latest resume PDF in the <code className="text-slate-300">public/resume.pdf</code> folder or enter an external URL.
            </p>
          </div>

          <div className="pt-2">
            <label className="block text-slate-300 mb-1 font-semibold">
              Executive Technical Summary
            </label>
            <textarea
              rows={4}
              value={settings.resume_summary || "Full Stack Engineer with 2+ years of production experience designing APIs, architecting background job queues with BullMQ and Redis, and scaling EdTech and financial platforms serving 20,000+ active users."}
              onChange={(e) => handleChange("resume_summary", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-xs leading-relaxed"
            />
          </div>
        </div>
      )}
    </form>
  );
}
