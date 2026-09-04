import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return <ProjectForm initialData={project} isNew={false} />;
}
