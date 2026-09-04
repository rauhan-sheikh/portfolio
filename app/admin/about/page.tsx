"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, Trash2, Save, X, User, CheckCircle2 } from "lucide-react";

interface PersonalityItem {
  id: string;
  category: "LIKES_BUILDING" | "OBSESSIONS" | "ANNOYANCES" | "OPINIONS" | "IMPROVING";
  title: string;
  body: string;
  order: number;
}

export default function AdminAboutPage() {
  const [items, setItems] = useState<PersonalityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<PersonalityItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/personality");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openNew = () => {
    setEditingItem({
      category: "OPINIONS",
      title: "",
      body: "",
      order: items.length + 1,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.body) return;
    setSaving(true);

    try {
      const isNew = !editingItem.id;
      const res = await fetch("/api/admin/personality", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        setEditingItem(null);
        await fetchItems();
      } else {
        alert("Failed to save item");
      }
    } catch {
      alert("Error saving item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this personality entry?")) return;

    try {
      const res = await fetch(`/api/admin/personality?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      alert("Failed to delete item");
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            Personality & Engineering Opinions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Display your human character, obsessions, software annoyances, and principles.
          </p>
        </div>

        <button
          onClick={openNew}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Opinion / Quirk</span>
        </button>
      </div>

      {editingItem && (
        <div className="p-6 rounded-xl border border-blue-500/40 bg-slate-950 font-mono text-xs space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white">
              {editingItem.id ? "Edit Item" : "New Personality Item"}
            </h2>
            <button
              onClick={() => setEditingItem(null)}
              className="p-1 rounded text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Category</label>
                <select
                  value={editingItem.category || "OPINIONS"}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                >
                  <option value="LIKES_BUILDING">Things I Like Building</option>
                  <option value="OBSESSIONS">Things I Obsess Over</option>
                  <option value="ANNOYANCES">Things That Annoy Me</option>
                  <option value="OPINIONS">Engineering Opinions</option>
                  <option value="IMPROVING">What I am Trying to Get Better At</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1 font-semibold">Title / Principle</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                  placeholder="e.g. Correctness-Critical Systems"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Explanation / Observation</label>
              <textarea
                rows={3}
                required
                value={editingItem.body || ""}
                onChange={(e) => setEditingItem({ ...editingItem, body: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-xs leading-relaxed"
                placeholder="I have an unreasonable amount of respect for a well-designed database schema..."
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
                {saving ? "Saving..." : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading personality modules...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-purple-500/20 bg-purple-500/10 text-purple-400">
                    {item.category.replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1 rounded text-blue-400 hover:text-blue-300"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold font-heading text-sm text-white">
                  {item.title}
                </h3>
                <p className="text-slate-300 font-body text-xs leading-relaxed mt-1">
                  &ldquo;{item.body}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
