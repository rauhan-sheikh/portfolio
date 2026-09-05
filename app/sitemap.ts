import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rauhansheikh.com";
  const currentDate = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/now`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];
  let articleRoutes: MetadataRoute.Sitemap = [];

  try {
    const [projects, articles] = await Promise.all([
      db.project.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      db.article.findMany({
        where: { isPublished: true },
        select: { slug: true, publishedAt: true, updatedAt: true },
      }),
    ]);

    projectRoutes = projects.map((p) => ({
      url: `${baseUrl}/work/${p.slug}`,
      lastModified: p.updatedAt || currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    articleRoutes = articles.map((a) => ({
      url: `${baseUrl}/writing/${a.slug}`,
      lastModified: a.updatedAt || a.publishedAt || currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch (error) {
    // Graceful fallback for known projects & articles if database is offline during build
    const fallbackProjects = [
      "business-os",
      "microsoft-teams-engine",
      "bulk-email-engine",
      "second-brain",
      "college-vidya-lms",
      "akshta-enterprises",
    ];
    projectRoutes = fallbackProjects.map((slug) => ({
      url: `${baseUrl}/work/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const fallbackArticles = [
      "bulk-email-bullmq-architecture",
      "financial-ledger-integer-units",
      "microsoft-graph-api-calendar-meetings",
      "database-indexing-production-impact",
      "software-career-journey-operations-to-engineering",
    ];
    articleRoutes = fallbackArticles.map((slug) => ({
      url: `${baseUrl}/writing/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  }

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}
