"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Award,
  FileText,
  Clock,
  User,
  Home,
  FileCheck,
  Mail,
  Users,
  Navigation,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
} from "lucide-react";

import Logo from "@/components/public/Logo";

interface AdminSidebarProps {
  unreadMessagesCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  unreadMessagesCount = 0,
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Projects", href: "/admin/projects", icon: Briefcase },
    { label: "Experience", href: "/admin/experience", icon: Award },
    { label: "Writing", href: "/admin/articles", icon: FileText },
    { label: "Now Page", href: "/admin/now", icon: Clock },
    { label: "About & Story", href: "/admin/about", icon: User },
    { label: "Homepage Editor", href: "/admin/homepage", icon: Home },
    { label: "Resume", href: "/admin/resume", icon: FileCheck },
    { label: "Messages", href: "/admin/messages", icon: Mail, badge: unreadMessagesCount },
    { label: "Subscribers", href: "/admin/subscribers", icon: Users },
    { label: "Navigation", href: "/admin/navigation", icon: Navigation },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
    { label: "Audit Log", href: "/admin/audit", icon: Shield },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen font-body text-slate-300 select-none transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" showText={false} />
              <div>
                <h1 className="text-sm font-semibold text-slate-100 font-heading">
                  Admin Console
                </h1>
                <p className="text-[11px] font-mono text-slate-400">Personal Brand OS</p>
              </div>
            </div>
          </div>

        {/* Links Navigation */}
        <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                </div>
                {typeof link.badge === "number" && link.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-blue-600 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer actions */}
      <div className="p-3 border-t border-slate-800/80 space-y-1 bg-slate-950/60 font-mono text-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Public Site</span>
          </div>
          <span className="text-[10px] text-slate-500">Live ↗</span>
        </Link>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}
