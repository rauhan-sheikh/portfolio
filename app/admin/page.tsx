import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Award,
  Mail,
  PlusCircle,
  Clock,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  // Fetch live stats
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    totalArticles,
    publishedArticles,
    totalExperience,
    unreadMessages,
    totalMessages,
    recentAudits,
  ] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { status: "PUBLISHED" } }),
    db.project.count({ where: { status: "DRAFT" } }),
    db.article.count(),
    db.article.count({ where: { isPublished: true } }),
    db.experience.count(),
    db.contactMessage.count({ where: { isRead: false, isArchived: false } }),
    db.contactMessage.count(),
    db.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Authenticated as {admin.name} ({admin.role})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Platform Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage public portfolio content, case studies, writing, and platform configuration.
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PROJECTS</span>
            <Briefcase className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold font-heading text-white">
            {totalProjects}
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span className="text-emerald-400">{publishedProjects} published</span>
            <span>{draftProjects} drafts</span>
          </div>
        </div>

        {/* Articles */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>WRITING</span>
            <FileText className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold font-heading text-white">
            {totalArticles}
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span className="text-emerald-400">{publishedArticles} published</span>
            <span>{totalArticles - publishedArticles} drafts</span>
          </div>
        </div>

        {/* Experience */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>EXPERIENCE</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-heading text-white">
            {totalExperience}
          </div>
          <div className="text-xs font-mono text-slate-400 pt-1">
            Roles & tenures tracked
          </div>
        </div>

        {/* Messages */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>MESSAGES</span>
            <Mail className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold font-heading text-white">
            {totalMessages}
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span className={unreadMessages > 0 ? "text-rose-400 font-bold" : "text-slate-400"}>
              {unreadMessages} unread
            </span>
            <Link href="/admin/messages" className="text-blue-400 hover:underline">
              Inbox →
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Section: Quick Actions & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Access Tiles */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-400">
              Content Areas
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2.5 font-mono text-xs">
            <Link
              href="/admin/projects"
              className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                    Manage Work & Projects
                  </p>
                  <p className="text-[11px] text-slate-500">Edit metrics, tech stacks & case studies</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/homepage"
              className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                    Homepage Composition
                  </p>
                  <p className="text-[11px] text-slate-500">Toggle sections on/off & reorder layout</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/now"
              className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                    Now / Living Status
                  </p>
                  <p className="text-[11px] text-slate-500">Update current building, learning & reading</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-purple-400 transition-colors">
                    Site Settings & Identity
                  </p>
                  <p className="text-[11px] text-slate-500">Availability status, bio, email & socials</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>

        {/* Recent Activity Audit Log */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-500" />
              <span>Recent Activity / Audit Log</span>
            </h2>
            <Link href="/admin/audit" className="text-xs font-mono text-blue-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 divide-y divide-slate-800/80 overflow-hidden font-mono text-xs">
            {recentAudits.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No activity recorded yet.</div>
            ) : (
              recentAudits.map((item) => (
                <div key={item.id} className="p-3.5 flex items-start justify-between gap-4 hover:bg-slate-900/50 transition-colors">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-blue-600/15 border border-blue-500/20 text-blue-400 text-[10px] font-bold">
                        {item.action}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        [{item.entityType}]
                      </span>
                    </div>
                    {item.details && (
                      <p className="text-slate-300 text-xs truncate">
                        {item.details}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
