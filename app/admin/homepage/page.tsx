"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, Home, Layers, Eye, EyeOff } from "lucide-react";

export default function AdminHomepageEditorPage() {
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

  const sections = [
    { key: "section_hero_enabled", label: "Hero Header", desc: "Bold statement, technical role pill, and personal manifesto" },
    { key: "section_now_enabled", label: "Currently / Now Preview", desc: "Living preview of what Rauhan is currently building and exploring" },
    { key: "section_featured_work_enabled", label: "Proof-of-Work Wall", desc: "Featured case study cards with metrics and technical tags" },
    { key: "section_signature_stories_enabled", label: "Signature Engineering Stories", desc: "Interactive architecture diagrams for MS Teams and Bulk Email BullMQ" },
    { key: "section_experience_enabled", label: "Career Experience Timeline", desc: "Overview of tenures and growth of responsibility" },
    { key: "section_writing_enabled", label: "Technical Writing Preview", desc: "Selected engineering essays and post-mortems" },
    { key: "section_personality_enabled", label: "Personality & Engineering Opinions", desc: "Candid quotes, obsessiveness, and software annoyances" },
    { key: "section_contact_enabled", label: "Fast Action Contact Strip", desc: "Direct opportunity inquiry prompt and email trigger" },
  ];

  const toggleSection = (key: string) => {
    const current = settings[key] !== "false";
    setSettings({ ...settings, [key]: current ? "false" : "true" });
  };

  const handleSave = async () => {
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
        alert("Failed to save section preferences");
      }
    } catch {
      alert("Error saving preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            Homepage Section Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Toggle homepage sections on/off dynamically without modifying a single line of source code.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Configuration"}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Homepage layout configuration updated successfully!</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading layout configuration...
        </div>
      ) : (
        <div className="space-y-3 font-mono text-xs">
          {sections.map((sec) => {
            const isEnabled = settings[sec.key] !== "false";
            return (
              <div
                key={sec.key}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  isEnabled
                    ? "border-slate-800 bg-slate-950"
                    : "border-slate-900 bg-slate-950/40 opacity-60"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isEnabled ? "bg-emerald-500" : "bg-slate-600"
                      }`}
                    />
                    <h3 className="font-bold font-heading text-sm text-white">
                      {sec.label}
                    </h3>
                  </div>
                  <p className="text-slate-400 font-body text-xs">
                    {sec.desc}
                  </p>
                </div>

                <button
                  onClick={() => toggleSection(sec.key)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isEnabled
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      : "border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {isEnabled ? (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      <span>ENABLED</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>DISABLED</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
