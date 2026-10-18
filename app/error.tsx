"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="pt-36 pb-24 max-w-2xl mx-auto px-4 sm:px-6 space-y-6 font-body text-center">
      <p className="text-xs font-mono font-bold uppercase tracking-wider text-accent">// something broke</p>
      <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary tracking-tight">
        Sorry, that didn&apos;t load.
      </h1>
      <p className="text-base text-secondary leading-relaxed">
        It&apos;s on my side, not yours. Try again, or head back home.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs pt-2">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-primary text-background font-semibold hover:bg-primary/90 transition cursor-pointer"
        >
          Try again
        </button>
        <Link href="/" className="px-5 py-2.5 rounded-xl border border-border bg-surface hover:border-accent hover:text-accent transition">
          Home
        </Link>
      </div>
    </div>
  );
}
