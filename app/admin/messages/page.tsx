"use client";

import React, { useState, useEffect } from "react";
import { Mail, Trash2, CheckCircle2, Archive, Clock, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (msg: Message) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, isRead: !msg.isRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: !m.isRead } : m))
        );
        if (selectedMsg?.id === msg.id) {
          setSelectedMsg({ ...selectedMsg, isRead: !msg.isRead });
        }
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this message?")) return;

    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMsg?.id === id) setSelectedMsg(null);
      }
    } catch {
      alert("Failed to delete message");
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            Contact Submissions Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Incoming inquiries from founders, recruiters, and engineering teams.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading inbox messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center text-slate-500 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
          Inbox is clear! No messages received yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
          {/* Message List */}
          <div className="lg:col-span-5 space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {messages.map((m) => {
              const isSelected = selectedMsg?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMsg(m)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? "border-blue-500 bg-slate-900 shadow-md"
                      : m.isRead
                      ? "border-slate-800 bg-slate-950/60 hover:bg-slate-900/60 opacity-80"
                      : "border-slate-700 bg-slate-950 font-semibold shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`truncate text-sm ${m.isRead ? "text-slate-300" : "text-white"}`}>
                      {m.name}
                    </span>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-blue-400 truncate">
                    {m.subject || "No Subject"}
                  </div>

                  <p className="text-slate-400 font-body text-xs line-clamp-2 leading-relaxed">
                    {m.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Message Reader Details */}
          <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-6">
            {selectedMsg ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-white">
                      {selectedMsg.subject || "No Subject"}
                    </h2>
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-slate-200 font-bold">{selectedMsg.name}</span>
                      <span>&lt;{selectedMsg.email}&gt;</span>
                      <span>· {new Date(selectedMsg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRead(selectedMsg)}
                      className="px-2.5 py-1.5 rounded border border-slate-700 hover:bg-slate-900 text-slate-300 transition-colors"
                      title="Toggle read status"
                    >
                      {selectedMsg.isRead ? "Mark Unread" : "Mark Read"}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMsg.id)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="font-body text-sm text-slate-200 leading-relaxed whitespace-pre-wrap p-4 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  {selectedMsg.message}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject || "Inquiry")}`}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-500">
                Select a message from the inbox to read its details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
