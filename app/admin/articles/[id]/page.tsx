import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await db.article.findUnique({
    where: { id },
  });

  if (!article) {
    notFound();
  }

  return <ArticleForm initialData={article} isNew={false} />;
}
