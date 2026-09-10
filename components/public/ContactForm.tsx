"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot trap
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Second bot signal: scripted submits are instant, humans take seconds.
  // Stamped in an effect rather than during render, which must stay pure.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, honeypot, startedAt: startedAt.current }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Failed to submit message");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg("A network error occurred. Please try again or email directly.");
    }
  };

  if (status === "success") {
    return (
      <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-3 font-mono text-xs text-emerald-400">
        <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500" />
        <h3 className="text-base font-bold font-heading text-primary">
          Message Received!
        </h3>
        <p className="text-secondary font-body text-sm max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. Your message is saved and on its way to my inbox — check yours for a confirmation. I typically reply within 24–48 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body">
      {status === "error" && (
        <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Honeypot hidden input to trap spam bots */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono font-semibold text-secondary mb-1">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-primary focus:outline-hidden focus:border-accent text-sm"
            placeholder="Ada Lovelace"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-secondary mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-primary focus:outline-hidden focus:border-accent text-sm"
            placeholder="ada@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono font-semibold text-secondary mb-1">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-primary focus:outline-hidden focus:border-accent text-sm"
          placeholder="Engineering opportunity / Project inquiry"
        />
      </div>

      <div>
        <label className="block text-xs font-mono font-semibold text-secondary mb-1">
          Message *
        </label>
        <textarea
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-primary focus:outline-hidden focus:border-accent text-sm leading-relaxed"
          placeholder="Tell me about what you are building, the problem space, or the team..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-xs font-mono flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
      >
        <span>{status === "submitting" ? "Transmitting..." : "Send Message"}</span>
        <Send className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
