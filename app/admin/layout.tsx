import React from "react";
import { getCurrentAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Console — Rauhan Sheikh",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  const headerList = await headers();
  const currentPath = headerList.get("x-admin-pathname") || "";

  if (!admin) {
    // If not authenticated and not explicitly on the login page, redirect to login
    if (currentPath && currentPath !== "/admin/login") {
      redirect("/admin/login");
    }
    return <div className="min-h-screen bg-slate-950 text-slate-100 font-body">{children}</div>;
  }

  let unreadCount = 0;
  try {
    unreadCount = await db.contactMessage.count({
      where: { isRead: false, isArchived: false },
    });
  } catch {
    unreadCount = 0;
  }

  return (
    <AdminShell adminEmail={admin.email} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}
