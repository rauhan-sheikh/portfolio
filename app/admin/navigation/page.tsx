"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, Trash2, Save, X, Navigation, Eye, EyeOff } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
  isEnabled: boolean;
  isExternal: boolean;
}

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<NavItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/navigation");
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
      label: "",
      href: "/",
      order: items.length + 1,
      isEnabled: true,
      isExternal: false,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.label || !editingItem?.href) return;
    setSaving(true);

    try {
      const isNew = !editingItem.id;
      const res = await fetch("/api/admin/navigation", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        setEditingItem(null);
        await fetchItems();
      } else {
        alert("Failed to save navigation link");
      }
    } catch {
      alert("Error saving navigation");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this navigation item?")) return;

    try {
      const res = await fetch(`/api/admin/navigation?id=${id}`, { method: "DELETE" });
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
            Navigation Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure header menu items, ordering, and external resource links without code changes.
          </p>
        </div>

        <button
          onClick={openNew}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {editingItem && (
        <div className="p-6 rounded-xl border border-blue-500/40 bg-slate-950 font-mono text-xs space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white">
              {editingItem.id ? "Edit Navigation Link" : "New Navigation Link"}
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
                <label className="block text-slate-300 mb-1 font-semibold">Display Label</label>
                <input
                  type="text"
                  required
                  value={editingItem.label || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                  placeholder="e.g. Case Studies"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Target URL / Path</label>
                <input
                  type="text"
                  required
                  value={editingItem.href || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, href: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm"
                  placeholder="/work"
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

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.isEnabled !== false}
                  onChange={(e) => setEditingItem({ ...editingItem, isEnabled: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600"
                />
                <span>Enabled (Visible in navigation)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editingItem.isExternal)}
                  onChange={(e) => setEditingItem({ ...editingItem, isExternal: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600"
                />
                <span>Opens in new tab (External link)</span>
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
                {saving ? "Saving..." : "Save Link"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading navigation items...
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Label</th>
                <th className="py-3 px-4">Path / URL</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-bold">#{item.order}</td>
                  <td className="py-3 px-4 font-bold text-white">{item.label}</td>
                  <td className="py-3 px-4 text-slate-400">{item.href}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.isEnabled
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {item.isEnabled ? "ENABLED" : "DISABLED"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 rounded hover:bg-slate-800 text-blue-400 hover:text-blue-300"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300"
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
      )}
    </div>
  );
}
