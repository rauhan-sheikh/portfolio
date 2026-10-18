import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Terminal, Heart, Eye, Flame, Compass, ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About & Story — Rauhan Sheikh",
  description:
    "The honest career journey from operations to software engineering, principles, and personality.",
  path: "/about",
});

export const revalidate = 0;

export default async function AboutPage() {
  const personalityItems = await db.personalityItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 font-body">
      {/* Header */}
      <div className="space-y-4 max-w-2xl border-b border-border/60 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/80 text-secondary text-xs font-mono">
          <span>The Human Behind the Code · Background & Opinions</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary tracking-tight">
          About & Career Story
        </h1>
        <p className="text-base sm:text-lg text-secondary leading-relaxed">
          The honest story of how I became an engineer, what I care about, and the convictions that shape the software I build.
        </p>
      </div>

      {/* Career Narrative */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-primary tracking-tight">
          From Operations to Software Engineering
        </h2>

        <div className="space-y-4 text-sm sm:text-base text-secondary leading-relaxed font-body">
          <p>
            I didn&apos;t start my software career through a conventional computer science pipeline or a neat whiteboard algorithm round. I started working close to real operational pain—spreadsheets, MIS systems, internal logistics, and manual data pipelines.
          </p>

          <p>
            And in hindsight, that was the most valuable foundation I could have had.
          </p>

          <p>
            When you sit next to the coordinators and support personnel who have to use internal software for eight hours every day, you develop an instinctive empathy for the user. You see firsthand that nobody cares what trendy framework was used; they care whether the report downloaded, whether the data got corrupted, or whether the system timed out during month-end.
          </p>

          <blockquote className="p-4 rounded-xl border-l-4 border-accent bg-accent/5 text-primary italic font-heading">
            &ldquo;When something broke, I didn&apos;t just restart the server or apologize. I stayed late and dug into the logs until I understood exactly why it broke.&rdquo;
          </blockquote>

          <p>
            That habit of relentless forensic curiosity is what drove the progression from basic automation scripts to writing full-stack web applications, designing database schemas, architecting background job queues with BullMQ and Redis, and eventually stepping into technical ownership as an Associate Manager at College Vidya.
          </p>

          <p>
            Today, as a Software Developer at ProSync Infotech, I focus on the parts of systems that have to actually work: data integrity, idempotent API boundaries, predictable database migrations, and clean developer abstractions.
          </p>
        </div>
      </section>

      {/* Personality Modules */}
      <section className="space-y-8 pt-6 border-t border-border/60">
        <div className="space-y-1">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            // INTELLECTUAL CHARACTER
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-primary tracking-tight">
            How I Think About Software
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          {personalityItems.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-border bg-surface/50 hover:bg-surface transition-colors space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  {item.category.replace("_", " ")}
                </span>
                <h3 className="text-base font-bold font-heading text-primary mt-1">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-secondary font-body mt-2">
                  &ldquo;{item.body}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personal Quirks & Bottom CTA */}
      <section className="p-8 rounded-2xl border border-border bg-surface/40 space-y-4 font-mono text-xs text-secondary">
        <div className="flex items-center gap-2 text-primary font-bold text-sm font-heading">
          <Terminal className="h-4 w-4 text-accent" />
          <span>Quick Facts & Details</span>
        </div>
        <ul className="space-y-2 text-xs leading-relaxed">
          <li>• Based in India, working across time zones with global teams.</li>
          <li>• Favorite database primitives: PostgreSQL composite partial indexes & strict check constraints.</li>
          <li>• Architecture stance: A modular monolith with strict boundaries beats premature microservices 95% of the time.</li>
        </ul>

        <div className="pt-4 border-t border-border/60 flex items-center justify-between">
          <Link href="/writing" className="text-accent hover:underline flex items-center gap-1 font-semibold">
            <span>Read my technical essays</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link href="/contact" className="text-primary hover:underline">
            Get in touch →
          </Link>
        </div>
      </section>
    </div>
  );
}
