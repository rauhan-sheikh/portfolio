import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found — Rauhan Sheikh",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="pt-36 pb-24 max-w-2xl mx-auto px-4 sm:px-6 space-y-6 font-body text-center">
      <p className="text-xs font-mono font-bold uppercase tracking-wider text-accent">// 404</p>
      <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary tracking-tight">
        That page doesn&apos;t exist.
      </h1>
      <p className="text-base text-secondary leading-relaxed">
        It may have moved, or the link may be mistyped. Here are some good places to start.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs pt-2">
        <Link href="/" className="px-5 py-2.5 rounded-xl bg-primary text-background font-semibold hover:bg-primary/90 transition">
          Home
        </Link>
        <Link href="/work" className="px-5 py-2.5 rounded-xl border border-border bg-surface hover:border-accent hover:text-accent transition">
          See my work
        </Link>
        <Link href="/writing" className="px-5 py-2.5 rounded-xl border border-border bg-surface hover:border-accent hover:text-accent transition">
          Read my writing
        </Link>
      </div>
    </div>
  );
}
