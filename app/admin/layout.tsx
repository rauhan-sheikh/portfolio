import React from "react";
import { getCurrentAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { db } from "@/lib/db";

export const metadata = {
  title: "Admin Console — Rauhan Sheikh",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  let unreadCount = 0;
  if (admin) {
    try {
      unreadCount = await db.contactMessage.count({
        where: { isRead: false, isArchived: false },
      });
    } catch {
      unreadCount = 0;
    }
  }

  if (!admin) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 font-body">{children}</div>;
  }

  return (
    <AdminShell adminEmail={admin.email} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}
