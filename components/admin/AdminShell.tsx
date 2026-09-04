"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu, ExternalLink, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import Logo from "../public/Logo";

interface AdminShellProps {
  adminEmail: string;
  unreadCount: number;
  children: React.ReactNode;
}

export default function AdminShell({
  adminEmail,
  unreadCount,
  children,
}: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 antialiased font-body">
      {/* Sidebar with responsive toggle */}
      <AdminSidebar
        unreadMessagesCount={unreadCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-900">
        {/* Top Header Bar for Admin */}
        <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              type="button"
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="hidden sm:inline text-slate-500">rauhansheikh.com</span>
              <span className="hidden sm:inline text-slate-700">/</span>
              <span className="text-white font-semibold">Admin Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900 text-slate-400 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-[140px]">{adminEmail}</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors text-xs"
            >
              <span>View Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
