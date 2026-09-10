import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Link not valid — Rauhan Sheikh",
  robots: { index: false, follow: false },
};

export default function NewsletterInvalidPage() {
  return (
    <div className="pt-28 pb-20 max-w-2xl mx-auto px-4 sm:px-6 font-body">
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-border bg-surface">
          <AlertCircle className="w-7 h-7 text-secondary" strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-primary tracking-tight">
            That link didn&apos;t work.
          </h1>
          <p className="text-base text-secondary leading-relaxed">
            The confirmation link was incomplete or has been replaced by a newer one. If
            you signed up more than once, only the most recent email will work — check
            your inbox for the latest, or just subscribe again from the footer.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
          >
            Back home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-surface hover:border-accent/50 text-secondary text-sm font-medium transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
