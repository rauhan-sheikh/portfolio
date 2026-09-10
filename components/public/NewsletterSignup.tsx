"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, CheckCircle2 } from "lucide-react";

/**
 * Double opt-in signup. Mirrors ContactForm's state machine and honeypot so the
 * two public write paths behave identically.
 *
 * `source` is stored on the Subscriber row so footer signups can be told apart
 * from any future in-article placement.
 */
export default function NewsletterSignup({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Second bot signal: scripted submits are instant, humans take seconds.
  // Stamped in an effect rather than during render, which must stay pure.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, honeypot, startedAt: startedAt.current }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Could not subscribe. Please try again.");
        return;
      }

      setStatus("success");
      setEmail("");
      setHoneypot("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface/60">
        <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-mono font-semibold text-primary">Check your inbox</p>
          <p className="text-xs text-secondary leading-relaxed">
            I sent a confirmation link. Click it and you&apos;re on the list — nothing gets
            sent until you do.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot: bots fill hidden fields, humans do not */}
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this empty
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-primary focus:outline-hidden focus:border-accent text-sm"
          placeholder="ada@example.com"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-xs font-mono flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm cursor-pointer whitespace-nowrap"
        >
          <span>{status === "submitting" ? "Subscribing..." : "Subscribe"}</span>
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400 font-mono">{errorMsg}</p>
      )}

      <p className="text-[11px] text-secondary/70 leading-relaxed">
        A confirmation email first — no sending until you click it. One-click unsubscribe
        in every email. No sharing, ever.
      </p>
    </form>
  );
}
