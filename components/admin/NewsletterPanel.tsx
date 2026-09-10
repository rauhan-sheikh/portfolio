"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Send, Users, CheckCircle2, AlertCircle } from "lucide-react";

interface Status {
  isPublished: boolean;
  newsletterSentAt: string | null;
  confirmedCount: number;
  sentCount: number;
  remaining: number;
}

/**
 * Explicit "send to subscribers" control, deliberately separate from Save.
 *
 * Publishing and announcing are different acts: new articles default to
 * Published, so coupling the send to a form save would fire a newsletter on the
 * first save of a brand-new draft, with no undo.
 *
 * The send endpoint processes a bounded number of recipients per call and
 * reports what is left, so this loops with { resume: true } until done rather
 * than holding one long request open.
 */
export default function NewsletterPanel({ articleId }: { articleId: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState("");

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/articles/${articleId}/newsletter`);
      if (res.ok) setStatus(await res.json());
    } catch {
      // Panel is supplementary — a status fetch failure should not break the editor.
    }
  }, [articleId]);

  useEffect(() => {
    // setState lives in the promise callback, and `cancelled` stops a late
    // response from writing into an unmounted component.
    let cancelled = false;

    fetch(`/api/admin/articles/${articleId}/newsletter`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setStatus(data);
      })
      .catch(() => {
        // Supplementary panel — a failed status fetch should not break the editor.
      });

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  async function handleSend() {
    if (!status) return;

    const confirmed = window.confirm(
      `Send "${status.remaining} email${status.remaining === 1 ? "" : "s"}" to confirmed subscribers?\n\n` +
        `This cannot be undone or recalled.`
    );
    if (!confirmed) return;

    setSending(true);
    setError("");
    let totalSent = 0;
    let totalFailed = 0;

    try {
      // First call claims the article; subsequent calls resume it.
      let resume = false;
      for (let guard = 0; guard < 100; guard++) {
        const res = await fetch(`/api/admin/articles/${articleId}/newsletter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Send failed.");
          break;
        }

        totalSent += data.sent || 0;
        totalFailed += data.failed || 0;
        setProgress({ sent: totalSent, failed: totalFailed });

        if (data.error) setError(data.error);
        if (data.done || data.sent === 0) break;

        resume = true;
      }
    } catch {
      setError("Network error during send. Re-open this page to resume.");
    } finally {
      setSending(false);
      loadStatus();
    }
  }

  if (!status) return null;

  if (!status.isPublished) {
    return (
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <Send className="h-3.5 w-3.5" />
          <span>Publish this article to enable sending it to subscribers.</span>
        </div>
      </div>
    );
  }

  const alreadySent = Boolean(status.newsletterSentAt) && status.remaining === 0;

  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold font-heading text-white">Newsletter</h2>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Users className="h-3.5 w-3.5" />
          <span>
            {status.confirmedCount} confirmed subscriber
            {status.confirmedCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {alreadySent ? (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-emerald-900/60 bg-emerald-950/30 text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            Sent to {status.sentCount} subscriber{status.sentCount === 1 ? "" : "s"} on{" "}
            {new Date(status.newsletterSentAt as string).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            .
          </span>
        </div>
      ) : (
        <>
          <p className="text-slate-400 leading-relaxed">
            {status.newsletterSentAt
              ? `A previous send left ${status.remaining} subscriber${status.remaining === 1 ? "" : "s"} unsent. Resuming will deliver only to those.`
              : `Sends the title, excerpt, and a link to this post. Each recipient gets their own unsubscribe link.`}
          </p>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending || status.remaining === 0}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>
              {sending
                ? `Sending... ${progress?.sent ?? 0}/${status.remaining}`
                : status.remaining === 0
                  ? "No subscribers to send to"
                  : status.newsletterSentAt
                    ? `Resume send (${status.remaining} left)`
                    : `Send to ${status.remaining} subscriber${status.remaining === 1 ? "" : "s"}`}
            </span>
          </button>
        </>
      )}

      {progress && progress.failed > 0 && (
        <p className="text-amber-400">
          {progress.failed} message{progress.failed === 1 ? "" : "s"} failed. Re-open this
          page to resume — already-delivered recipients are skipped.
        </p>
      )}

      {error && (
        <div className="flex items-start gap-2 text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
