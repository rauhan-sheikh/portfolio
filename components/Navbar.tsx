"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-lg bg-surface/90 border-b border-border text-primary shadow-lg"
          : "bg-background/60"
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between py-3 px-6">
        <span className="font-heading text-accent text-lg tracking-tight select-none">
          <Link
            href="/"
            className="hover:text-accent transition-colors"
            onClick={(e) => {
              // If we're already on "/", Next won't navigate; manually scroll home.
              if (pathname === "/") {
                e.preventDefault();
                setOpen(false);
                window.history.replaceState(null, "", "/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            Rauhan Sheikh
          </Link>
        </span>
        <div className="flex items-center gap-3">
          <ul className="hidden md:flex gap-6 items-center text-secondary text-sm font-mono">
            <li>
              <Link
                href="#experience"
                className="hover:text-accent hover:underline transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("experience");
                }}
              >
                Experience
              </Link>
            </li>
            <li>
              <Link
                href="#projects"
                className="hover:text-accent hover:underline transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("projects");
                }}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="#resume"
                className="hover:text-accent hover:underline transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("resume");
                }}
              >
                Resume
              </Link>
            </li>
          </ul>
          <ThemeToggle />
          <button
            type="button"
            className="md:hidden ml-2 p-2 rounded-xl border border-border hover:border-accent transition text-secondary"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="block w-5 h-[1px] bg-current mb-1" />
            <span className="block w-5 h-[1px] bg-current mb-1" />
            <span className="block w-5 h-[1px] bg-current" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-surface/95 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto px-6 py-3 flex flex-col gap-3 text-sm font-mono text-secondary">
            <Link
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                scrollToSection("experience");
              }}
              className="hover:text-accent"
            >
              Experience
            </Link>
            <Link
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                scrollToSection("projects");
              }}
              className="hover:text-accent"
            >
              Projects
            </Link>
            <Link
              href="#resume"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                scrollToSection("resume");
              }}
              className="hover:text-accent"
            >
              Resume
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
