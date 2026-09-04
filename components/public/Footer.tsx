"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, ArrowUpRight, Shield } from "lucide-react";
import { Github, Linkedin, Twitter } from "./Icons";
import Logo from "./Logo";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-surface/30 mt-24 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Manifesto */}
          <div className="md:col-span-6 space-y-4">
            <Logo size="sm" showText={true} />
            <p className="text-sm leading-relaxed text-secondary max-w-md">
              Software developer. I build things, break things, figure things out, and ship them. Focused on backend reliability, database architecture, and resilient web software.
            </p>
            <div className="pt-2 text-xs font-mono text-secondary/80 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for engineering challenges & product systems</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              Platform Index
            </p>
            <ul className="space-y-2 text-sm text-secondary">
              <li>
                <Link href="/work" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Work & Systems <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Career Growth <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/writing" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Technical Essays <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/now" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Now / Living Status <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Human Story & Opinions <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Developer Resume <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Admin */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              Connect
            </p>
            <div className="flex flex-col space-y-2 text-sm text-secondary">
              <a
                href="mailto:hello@rauhansheikh.com"
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                <span>hello@rauhansheikh.com</span>
              </a>
              <a
                href="https://github.com/rauhan-sheikh"
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span>github.com/rauhan-sheikh</span>
              </a>
              <a
                href="https://linkedin.com/in/rauhan-sheikh"
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                <span>linkedin.com/in/rauhan-sheikh</span>
              </a>
              <a
                href="https://x.com/rauhansheikh"
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                <span>x.com/rauhansheikh</span>
              </a>
            </div>

            <div className="pt-4">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-secondary/60 hover:text-secondary border border-border/40 hover:border-border px-2.5 py-1 rounded bg-surface/30 transition-all"
              >
                <Shield className="h-3 w-3" />
                <span>Admin Console</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-secondary">
          <p>© {new Date().getFullYear()} Rauhan Sheikh. Built with craft & purpose.</p>
          <p className="text-secondary/70">Next.js · PostgreSQL · Prisma · TypeScript</p>
        </div>
      </div>
    </footer>
  );
}
