"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Command, Menu, X, Sun, Moon, Sparkles } from "lucide-react";

import Logo from "./Logo";

interface NavItem {
  label: string;
  href: string;
}

const defaultNav: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Experience", href: "/experience" },
  { label: "Writing", href: "/writing" },
  { label: "Now", href: "/now" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

export default function Header({
  navItems = defaultNav,
  availabilityBadge = "Open to opportunities",
  availabilityActive = true,
}: {
  navItems?: NavItem[];
  availabilityBadge?: string;
  availabilityActive?: boolean;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo / Monogram */}
        <div className="flex items-center gap-3">
          <Logo size="md" showText={true} />

          {availabilityActive && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono shadow-2xs whitespace-nowrap">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-medium">
                {availabilityBadge}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "text-primary bg-surface font-semibold shadow-xs border border-border/60"
                    : "text-secondary hover:text-primary hover:bg-surface/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action controls: Command Palette, Theme, Mobile toggle */}
        <div className="flex items-center gap-2">
          {/* ⌘K Trigger Button */}
          <button
            onClick={openCommandPalette}
            type="button"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/70 bg-surface/60 hover:bg-surface text-secondary hover:text-primary text-xs font-mono transition-all shadow-2xs"
            aria-label="Open Command Palette"
          >
            <Command className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block px-1 py-0.5 rounded bg-background border border-border/50 text-[10px] text-secondary">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-border/60 bg-surface/50 hover:bg-surface text-secondary hover:text-primary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-border/60 bg-surface/50 hover:bg-surface text-secondary hover:text-primary"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          {availabilityActive && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-medium">{availabilityBadge}</span>
            </div>
          )}

          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-surface font-semibold border border-border/60"
                      : "text-secondary hover:text-primary hover:bg-surface/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-secondary font-mono">
            <span>Rauhan Sheikh · Digital Home</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openCommandPalette();
              }}
              className="flex items-center gap-1.5 text-accent hover:underline"
            >
              <Command className="h-3.5 w-3.5" />
              <span>Search ⌘K</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
