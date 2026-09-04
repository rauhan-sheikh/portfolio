"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  FileText,
  Briefcase,
  Layers,
  Clock,
  User,
  Mail,
  Copy,
  Check,
  Sun,
  Moon,
  ArrowRight,
  X,
} from "lucide-react";
import { Github, Linkedin } from "./Icons";

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Projects" | "Writing" | "Actions";
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen, handleClose]);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@rauhansheikh.com");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      handleClose();
    }, 1200);
  };

  const items: PaletteItem[] = [
    // Navigation
    {
      id: "nav-home",
      title: "Home",
      subtitle: "Return to the homepage",
      category: "Navigation",
      icon: Layers,
      onSelect: () => {
        router.push("/");
        handleClose();
      },
    },
    {
      id: "nav-work",
      title: "Work & Systems",
      subtitle: "Explore all projects, systems, and experiments",
      category: "Navigation",
      icon: Briefcase,
      onSelect: () => {
        router.push("/work");
        handleClose();
      },
    },
    {
      id: "nav-experience",
      title: "Experience",
      subtitle: "Career timeline, ownership, and responsibility growth",
      category: "Navigation",
      icon: Briefcase,
      onSelect: () => {
        router.push("/experience");
        handleClose();
      },
    },
    {
      id: "nav-writing",
      title: "Writing",
      subtitle: "Technical essays and engineering post-mortems",
      category: "Navigation",
      icon: FileText,
      onSelect: () => {
        router.push("/writing");
        handleClose();
      },
    },
    {
      id: "nav-now",
      title: "Now",
      subtitle: "What Rauhan is currently building, reading, and learning",
      category: "Navigation",
      icon: Clock,
      onSelect: () => {
        router.push("/now");
        handleClose();
      },
    },
    {
      id: "nav-about",
      title: "About & Story",
      subtitle: "The human journey from operations to engineering",
      category: "Navigation",
      icon: User,
      onSelect: () => {
        router.push("/about");
        handleClose();
      },
    },
    {
      id: "nav-resume",
      title: "Resume",
      subtitle: "View and download technical resume",
      category: "Navigation",
      icon: FileText,
      onSelect: () => {
        router.push("/resume");
        handleClose();
      },
    },
    {
      id: "nav-contact",
      title: "Contact",
      subtitle: "Reach out directly for opportunities or discussions",
      category: "Navigation",
      icon: Mail,
      onSelect: () => {
        router.push("/contact");
        handleClose();
      },
    },

    // Projects
    {
      id: "proj-businessos",
      title: "BusinessOS Case Study",
      subtitle: "Financial operating system with integer minor-unit ledger",
      category: "Projects",
      icon: Briefcase,
      onSelect: () => {
        router.push("/work/business-os");
        handleClose();
      },
    },
    {
      id: "proj-teams",
      title: "Microsoft Teams & Graph API Engine",
      subtitle: "Meeting resolution pipeline serving 20K+ users",
      category: "Projects",
      icon: Briefcase,
      onSelect: () => {
        router.push("/work/microsoft-teams-engine");
        handleClose();
      },
    },
    {
      id: "proj-bullmq",
      title: "Bulk Email Engine (Redis / BullMQ)",
      subtitle: "Asynchronous background queue architecture",
      category: "Projects",
      icon: Briefcase,
      onSelect: () => {
        router.push("/work/bulk-email-engine");
        handleClose();
      },
    },

    // Writing
    {
      id: "art-bullmq",
      title: "Why I Moved Bulk Email to BullMQ",
      subtitle: "Eliminating browser-dependent operational vulnerabilities",
      category: "Writing",
      icon: FileText,
      onSelect: () => {
        router.push("/writing/bulk-email-bullmq-architecture");
        handleClose();
      },
    },
    {
      id: "art-ledger",
      title: "Building a Financial Ledger Without Floating-Point Money",
      subtitle: "Integer minor-units and deterministic remainder balancing",
      category: "Writing",
      icon: FileText,
      onSelect: () => {
        router.push("/writing/financial-ledger-integer-units");
        handleClose();
      },
    },

    // Actions
    {
      id: "act-copy-email",
      title: copied ? "Copied to clipboard!" : "Copy Email Address",
      subtitle: "hello@rauhansheikh.com",
      category: "Actions",
      icon: copied ? Check : Copy,
      onSelect: copyEmail,
    },
    {
      id: "act-toggle-theme",
      title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      subtitle: "Toggle color theme",
      category: "Actions",
      icon: theme === "dark" ? Sun : Moon,
      onSelect: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        handleClose();
      },
    },
    {
      id: "act-github",
      title: "Open GitHub Profile",
      subtitle: "github.com/rauhan-sheikh",
      category: "Actions",
      icon: Github,
      onSelect: () => {
        window.open("https://github.com/rauhan-sheikh", "_blank");
        handleClose();
      },
    },
    {
      id: "act-linkedin",
      title: "Open LinkedIn Profile",
      subtitle: "linkedin.com/in/rauhan-sheikh",
      category: "Actions",
      icon: Linkedin,
      onSelect: () => {
        window.open("https://linkedin.com/in/rauhan-sheikh", "_blank");
        handleClose();
      },
    },
  ];

  const filteredItems = items.filter((item) => {
    const text = `${item.title} ${item.subtitle || ""} ${item.category}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const categories = Array.from(new Set(filteredItems.map((item) => item.category)));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-surface/80">
          <Search className="h-5 w-5 text-secondary shrink-0" />
          <input
            type="text"
            placeholder="Search projects, writing, experience, actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-primary placeholder:text-secondary text-sm focus:outline-hidden font-body"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-secondary hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono text-secondary">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-4 max-h-[60vh]">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-secondary text-sm font-mono">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat} className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-secondary/70">
                  {cat}
                </div>
                {filteredItems
                  .filter((item) => item.category === cat)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.onSelect}
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-background/80 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-1.5 rounded-md bg-background border border-border text-secondary group-hover:text-accent group-hover:border-accent/40 transition-colors shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors truncate">
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p className="text-xs text-secondary truncate">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </button>
                    );
                  })}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-border bg-surface/50 flex items-center justify-between text-[11px] font-mono text-secondary">
          <span>Navigate with mouse or keyboard</span>
          <span>Rauhan Sheikh OS</span>
        </div>
      </div>
    </div>
  );
}
