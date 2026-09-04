"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, Settings, Globe, Shield, User } from "lucide-react";

export default function AdminSettingsPage() {
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
        alert("Failed to save settings");
      }
    } catch {
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 font-body max-w-4xl">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            Site-Wide Settings & Identity
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global metadata, public contact info, availability pill, and social profiles.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Settings saved and updated successfully!</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading settings...
        </div>
      ) : (
        <div className="space-y-6 font-mono text-xs">
          {/* Identity */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <span>Personal Identity</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  value={settings.site_name || ""}
                  onChange={(e) => handleChange("site_name", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Title / Headline</label>
                <input
                  type="text"
                  value={settings.site_title || ""}
                  onChange={(e) => handleChange("site_title", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Tagline (Hero expression)</label>
              <input
                type="text"
                value={settings.site_tagline || ""}
                onChange={(e) => handleChange("site_tagline", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Short Bio (Footer & SEO)</label>
              <textarea
                rows={3}
                value={settings.site_bio || ""}
                onChange={(e) => handleChange("site_bio", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Availability Status */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Availability Badge</span>
            </h2>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Badge Announcement Text</label>
              <input
                type="text"
                value={settings.availability_badge || ""}
                onChange={(e) => handleChange("availability_badge", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="avail"
                checked={settings.availability_active !== "false"}
                onChange={(e) => handleChange("availability_active", e.target.checked ? "true" : "false")}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600"
              />
              <label htmlFor="avail" className="text-slate-300 font-semibold cursor-pointer">
                Display pulsing availability badge in top navigation
              </label>
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-400" />
              <span>Channels & Links</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Primary Email</label>
                <input
                  type="email"
                  value={settings.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Location</label>
                <input
                  type="text"
                  value={settings.location || ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">GitHub URL</label>
                <input
                  type="text"
                  value={settings.github_url || ""}
                  onChange={(e) => handleChange("github_url", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">LinkedIn URL</label>
                <input
                  type="text"
                  value={settings.linkedin_url || ""}
                  onChange={(e) => handleChange("linkedin_url", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Twitter / X URL</label>
                <input
                  type="text"
                  value={settings.twitter_url || ""}
                  onChange={(e) => handleChange("twitter_url", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Resume PDF Path / URL</label>
                <input
                  type="text"
                  value={settings.resume_pdf_url || ""}
                  onChange={(e) => handleChange("resume_pdf_url", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
