"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, Trash2, Clock, CheckCircle2, X } from "lucide-react";

interface NowItem {
  id: string;
  category: "BUILDING" | "LEARNING" | "READING" | "EXPERIMENTING" | "THINKING";
  title: string;
  text: string;
  order: number;
  isActive: boolean;
}

export default function AdminNowPage() {
  const [items, setItems] = useState<NowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<NowItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/now");
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
      category: "BUILDING",
      title: "",
      text: "",
      order: items.length + 1,
      isActive: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.text) return;
    setSaving(true);

    try {
      const isNew = !editingItem.id;
      const res = await fetch("/api/admin/now", {
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
    if (!confirm("Are you sure you want to delete this living update?")) return;

    try {
      const res = await fetch(`/api/admin/now?id=${id}`, { method: "DELETE" });
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
            Now / Living Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Keep your digital home feeling alive. Update what you are actively building, learning, reading, or exploring.
          </p>
        </div>

        <button
          onClick={openNew}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Living Item</span>
        </button>
      </div>

      {editingItem && (
        <div className="p-6 rounded-xl border border-blue-500/40 bg-slate-950 font-mono text-xs space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white">
              {editingItem.id ? "Edit Living Item" : "New Living Item"}
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
                  value={editingItem.category || "BUILDING"}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
                >
                  <option value="BUILDING">Building</option>
                  <option value="LEARNING">Learning</option>
                  <option value="READING">Reading</option>
                  <option value="THINKING">Thinking</option>
                  <option value="EXPERIMENTING">Experimenting</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Headline</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                  placeholder="e.g. Distributed Systems"
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
              <label className="block text-slate-300 mb-1 font-semibold">Detail Text</label>
              <textarea
                rows={3}
                required
                value={editingItem.text || ""}
                onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-xs leading-relaxed"
                placeholder="Currently reading Designing Data-Intensive Applications..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={editingItem.isActive !== false}
                onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600"
              />
              <label htmlFor="active" className="text-slate-300 font-semibold cursor-pointer">
                Active & visible on public /now page
              </label>
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
          Loading Now items...
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
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-blue-500/20 bg-blue-500/10 text-blue-400">
                    {item.category}
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
                  {item.text}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/40">
                <span>Order #{item.order}</span>
                <span className={item.isActive ? "text-emerald-400" : "text-slate-600"}>
                  {item.isActive ? "Active" : "Disabled"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
