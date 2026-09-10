import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata = {
  title: "Unsubscribed — Rauhan Sheikh",
  robots: { index: false, follow: false },
};

export default function NewsletterUnsubscribedPage() {
  return (
    <div className="pt-28 pb-20 max-w-2xl mx-auto px-4 sm:px-6 font-body">
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-border bg-surface">
          <Check className="w-7 h-7 text-secondary" strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-primary tracking-tight">
            You&apos;re unsubscribed.
          </h1>
          <p className="text-base text-secondary leading-relaxed">
            No more new-post emails. The writing stays free to read on the site, and the
            footer signup is there if you ever change your mind.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-surface hover:border-accent/50 text-secondary text-sm font-medium transition-colors"
          >
            Read the archive
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
