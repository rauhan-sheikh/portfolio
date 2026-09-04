"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ArticleFormProps {
  initialData?: any;
  isNew?: boolean;
}

export default function ArticleForm({ initialData, isNew = false }: ArticleFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [author, setAuthor] = useState(initialData?.author || "Rauhan Sheikh");
  const [readingTime, setReadingTime] = useState(initialData?.readingTime || "5 min read");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [isPublished, setIsPublished] = useState(initialData ? Boolean(initialData.isPublished) : true);
  const [isFeatured, setIsFeatured] = useState(Boolean(initialData?.isFeatured));
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoDesc || "");

  const [tags, setTags] = useState<string[]>(() => {
    try {
      return initialData?.tags ? JSON.parse(initialData.tags) : [];
    } catch {
      return [];
    }
  });
  const [newTag, setNewTag] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      author,
      readingTime,
      coverImage,
      isPublished,
      isFeatured,
      seoTitle,
      seoDesc,
      tags: JSON.stringify(tags),
    };

    try {
      const url = isNew ? "/api/admin/articles" : `/api/admin/articles/${initialData.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to save article" });
        setSaving(false);
        return;
      }

      setMessage({ type: "success", text: "Article saved successfully!" });
      setSaving(false);

      if (isNew) {
        setTimeout(() => {
          router.push(`/admin/articles/${data.id}`);
        }, 800);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "An unexpected error occurred" });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-body max-w-5xl">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {isNew ? "Write New Article" : `Edit: ${initialData.title}`}
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Technical publishing system
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Article"}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 font-mono text-xs ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Metadata */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
          Metadata & Identification
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Article Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500 font-body text-sm"
              placeholder="Why I Moved Bulk Email Processing to BullMQ"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500 font-body text-sm"
              placeholder="bulk-email-bullmq-architecture"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Reading Time</label>
            <input
              type="text"
              value={readingTime}
              onChange={(e) => setReadingTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
              placeholder="5 min read"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Publication State</label>
            <select
              value={isPublished ? "PUBLISHED" : "DRAFT"}
              onChange={(e) => setIsPublished(e.target.value === "PUBLISHED")}
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
          />
          <label htmlFor="featured" className="text-slate-300 cursor-pointer font-semibold">
            Feature on homepage writing preview
          </label>
        </div>
      </div>

      {/* Excerpt & Tags */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
        <div>
          <label className="block text-slate-300 mb-1 font-semibold">
            Excerpt / TL;DR (Short teaser for listing cards)
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-body text-sm leading-relaxed"
            placeholder="A short teaser summary of the essay..."
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-semibold">Topic Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden"
              placeholder="e.g. Architecture, Redis, PostgreSQL"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-700 bg-slate-900 text-slate-200 text-xs"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="text-slate-500 hover:text-red-400 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
          Article Content (Markdown)
        </h2>
        <textarea
          rows={16}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden font-mono text-xs leading-relaxed"
          placeholder="## Heading&#10;&#10;Write your technical post here..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Link
          href="/admin/articles"
          className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-xs"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold font-mono text-xs cursor-pointer shadow-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Article"}
        </button>
      </div>
    </form>
  );
}
