"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The unsubscribe confirmation press.
 *
 * Kept behind an explicit click rather than firing on page load: mail-client
 * link prescanners fetch every URL in a message, and an auto-unsubscribe on GET
 * would silently drop people who never asked to leave.
 */
export default function UnsubscribeButton({ token }: { token: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  async function handleUnsubscribe() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      router.push("/newsletter/unsubscribed");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleUnsubscribe}
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
      >
        {status === "submitting" ? "Unsubscribing..." : "Confirm unsubscribe"}
      </button>

      {status === "error" && (
        <p className="text-xs text-red-400 font-mono">
          Something went wrong. Please try again, or reply to any email and I&apos;ll remove
          you manually.
        </p>
      )}
    </div>
  );
}
