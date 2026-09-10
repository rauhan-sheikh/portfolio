"use client";

import React, { useState, useEffect } from "react";
import { Users, Trash2, RefreshCw, Download } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  status: "PENDING" | "CONFIRMED" | "UNSUBSCRIBED";
  source: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
  createdAt: string;
}

const STATUS_STYLES: Record<Subscriber["status"], string> = {
  CONFIRMED: "bg-emerald-950/60 text-emerald-400 border-emerald-900",
  PENDING: "bg-amber-950/60 text-amber-400 border-amber-900",
  UNSUBSCRIBED: "bg-slate-900 text-slate-500 border-slate-800",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // setState lives in the promise callback, and `cancelled` stops a late
    // response from writing into an unmounted component.
    let cancelled = false;

    fetch("/api/admin/subscribers")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data) setSubscribers(data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (sub: Subscriber) => {
    if (!confirm(`Permanently delete ${sub.email}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${sub.id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== sub.id));
      } else {
        alert("Failed to delete subscriber.");
      }
    } catch {
      alert("Failed to delete subscriber.");
    }
  };

  const counts = {
    total: subscribers.length,
    confirmed: subscribers.filter((s) => s.status === "CONFIRMED").length,
    pending: subscribers.filter((s) => s.status === "PENDING").length,
    unsubscribed: subscribers.filter((s) => s.status === "UNSUBSCRIBED").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Subscribers</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            The writing list. Only CONFIRMED addresses receive newsletters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Must stay a plain <a>: this is a file download from an API route,
              and next/link would client-navigate instead of downloading. */}
          <a
            href="/api/admin/subscribers?format=csv"
            download
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:border-slate-600 text-slate-300 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </a>
          <button
            onClick={fetchSubscribers}
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:border-slate-600 text-slate-300 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {[
          { label: "Total", value: counts.total },
          { label: "Confirmed", value: counts.confirmed },
          { label: "Pending", value: counts.pending },
          { label: "Unsubscribed", value: counts.unsubscribed },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <p className="text-slate-500 uppercase tracking-wider text-[11px]">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1 font-heading">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-xs text-slate-500 font-mono">Loading subscribers...</p>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="h-6 w-6 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500 font-mono">
              No subscribers yet. The signup form lives in the site footer.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead className="bg-slate-900/60 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-semibold">Source</th>
                  <th className="text-left px-4 py-3 font-semibold">Signed up</th>
                  <th className="text-left px-4 py-3 font-semibold">Confirmed</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 text-slate-200">{sub.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md border text-[11px] ${STATUS_STYLES[sub.status]}`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{sub.source}</td>
                    <td className="px-4 py-3 text-slate-400">{formatDate(sub.createdAt)}</td>
                    <td className="px-4 py-3 text-slate-400">{formatDate(sub.confirmedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(sub)}
                        aria-label={`Delete ${sub.email}`}
                        className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
