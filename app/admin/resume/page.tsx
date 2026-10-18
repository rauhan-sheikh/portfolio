"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, FileText, Download, ExternalLink } from "lucide-react";

const KEYS = ["resume_summary", "resume_location", "resume_show_phone", "resume_phone"] as const;

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

    // Only the résumé keys are sent, so saving here can never overwrite unrelated settings.
    const payload: Record<string, string> = {};
    for (const k of KEYS) if (settings[k] !== undefined) payload[k] = settings[k];

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const showPhone = settings.resume_show_phone === "true";

  return (
    <form onSubmit={handleSave} className="space-y-6 font-body max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Resume
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            The PDF is generated from the same data as the public Resume page: experience, projects, skills and
            education come from the site content, so there is nothing to upload.
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
        <div className="p-12 text-center text-slate-500 font-mono text-xs">Loading resume settings...</div>
      ) : (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs space-y-5">
          <div className="flex flex-wrap gap-2">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview public PDF</span>
            </a>
            <a
              href="/api/admin/resume.pdf"
              className="px-4 py-2 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF with phone number</span>
            </a>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Professional summary</label>
            <textarea
              rows={5}
              value={settings.resume_summary || ""}
              onChange={(e) => handleChange("resume_summary", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Location line</label>
              <input
                type="text"
                value={settings.resume_location || ""}
                onChange={(e) => handleChange("resume_location", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                placeholder="Delhi, India"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Phone number</label>
              <input
                type="text"
                value={settings.resume_phone || ""}
                onChange={(e) => handleChange("resume_phone", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                placeholder="+91 ..."
              />
              <p className="text-[11px] text-slate-500 mt-1">Stored only in the database, never in the repository.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="showPhone"
              checked={showPhone}
              onChange={(e) => handleChange("resume_show_phone", e.target.checked ? "true" : "false")}
              className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
            />
            <label htmlFor="showPhone" className="text-slate-300 cursor-pointer">
              <span className="font-semibold">Show the phone number on the public PDF</span>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                Leave this off normally. When someone asks for your number, use “Download PDF with phone number”
                above (admin only), or switch this on briefly, download, and switch it back off. The public site
                never shows the number.
              </span>
            </label>
          </div>

          <p className="text-[11px] text-slate-500 border-t border-slate-800 pt-3">
            Skills and education are managed in <code className="text-slate-300">content/site/skills.json</code> and{" "}
            <code className="text-slate-300">education.json</code>, then applied with{" "}
            <code className="text-slate-300">pnpm content:push</code>. Per-role résumé bullets live next to each
            experience as <code className="text-slate-300">resumeBullets</code>.
          </p>
        </div>
      )}
    </form>
  );
}
