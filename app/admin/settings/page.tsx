"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, Settings, Globe, Shield, User, Lock, AlertCircle, KeyRound } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters long.");
      return;
    }

    setPwSaving(true);

    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPwError(data.error || "Failed to update password.");
        return;
      }

      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwSuccess(false), 4000);
    } catch {
      setPwError("A network error occurred while updating password.");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-12 font-body max-w-4xl pb-16">
      {/* 1. Global Site Settings Form */}
      <form onSubmit={handleSave} className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
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
            Loading site settings...
          </div>
        ) : (
          <div className="space-y-6 font-mono text-xs">
            {/* Identity */}
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-semibold border-b border-slate-800/80 pb-2">
                <Globe className="h-4 w-4" />
                <span>Identity & Meta</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Author / Site Name</label>
                  <input
                    type="text"
                    value={settings.site_name || ""}
                    onChange={(e) => handleChange("site_name", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Site Title (SEO)</label>
                  <input
                    type="text"
                    value={settings.site_title || ""}
                    onChange={(e) => handleChange("site_title", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Hero Tagline</label>
                <input
                  type="text"
                  value={settings.site_tagline || ""}
                  onChange={(e) => handleChange("site_tagline", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Bio Statement</label>
                <textarea
                  rows={3}
                  value={settings.site_bio || ""}
                  onChange={(e) => handleChange("site_bio", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Availability Pill */}
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-semibold border-b border-slate-800/80 pb-2">
                <Shield className="h-4 w-4" />
                <span>Availability Pill</span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.availability_active !== "false"}
                    onChange={(e) =>
                      handleChange("availability_active", e.target.checked ? "true" : "false")
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600"
                  />
                  <span>Show availability pill on public header and contact page</span>
                </label>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Availability Text</label>
                  <input
                    type="text"
                    value={settings.availability_badge || ""}
                    onChange={(e) => handleChange("availability_badge", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Social Channels */}
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-semibold border-b border-slate-800/80 pb-2">
                <User className="h-4 w-4" />
                <span>Channels & Profiles</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Direct Email</label>
                  <input
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Base Location</label>
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

      {/* 2. Admin Security & Password Change Section */}
      <section className="space-y-6 pt-6 border-t border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-blue-500" />
            <span>Admin Security & Password</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Update your administrator credentials. Changes take effect immediately.
          </p>
        </div>

        {pwSuccess && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Password updated successfully! Next login will require your new password.</span>
          </div>
        )}

        {pwError && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{pwError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500 font-body text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                New Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500 font-body text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500 font-body text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-500">
              Passwords are hashed with bcrypt (salt rounds: 10) before storage in PostgreSQL.
            </p>

            <button
              type="submit"
              disabled={pwSaving}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{pwSaving ? "Updating..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
