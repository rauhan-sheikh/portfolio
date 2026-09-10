import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Subscription confirmed — Rauhan Sheikh",
  description: "You are on the list for new technical essays.",
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmedPage() {
  return (
    <div className="pt-28 pb-20 max-w-2xl mx-auto px-4 sm:px-6 font-body">
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-border bg-surface">
          <CheckCircle2 className="w-7 h-7 text-accent" strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-primary tracking-tight">
            You&apos;re on the list.
          </h1>
          <p className="text-base text-secondary leading-relaxed">
            Your subscription is confirmed. You&apos;ll get an email when I publish something
            new — essays on backend reliability, ledgers, and distributed systems. No
            cadence promises, no filler. Every email has a one-click unsubscribe.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
          >
            Read the archive
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-surface hover:border-accent/50 text-secondary text-sm font-medium transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
