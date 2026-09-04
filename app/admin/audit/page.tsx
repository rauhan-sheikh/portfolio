import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { Shield, Clock, FileText } from "lucide-react";

export default async function AdminAuditPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
            Security & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chronological log of administrative actions, content mutations, and system access.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 font-mono text-xs text-slate-400">
          <Shield className="h-4 w-4 text-emerald-400" />
          <span>{logs.length} Events Tracked</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {log.entityType} {log.entityId && `(${log.entityId})`}
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
