"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Edit3, Trash2, ExternalLink, Star, Eye } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  readingTime: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string;
  tags: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      alert("Failed to delete article");
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            Technical Writing & Essays
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish engineering post-mortems, architectural reflections, and technical notes.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors self-start sm:self-auto shadow-xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Article</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading articles...
        </div>
      ) : articles.length === 0 ? (
        <div className="p-12 text-center text-slate-500 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
          No articles created yet. Write your first piece!
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Read Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white font-heading text-sm">
                      {art.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      /writing/{art.slug}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(art.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {art.readingTime}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        art.isPublished
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {art.isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {art.isFeatured ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 text-[11px]">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/writing/${art.slug}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        title="View on site"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/articles/${art.id}`}
                        className="p-1.5 rounded hover:bg-slate-800 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit article"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(art.id, art.title)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Delete article"
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
