import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Shared file <-> database mapping for the versioned site content in content/site/.
 * Both content-pull (DB -> files) and content-push (files -> DB) go through this module so the
 * two directions can never disagree about shape.
 */

export const CONTENT_DIR = path.join(process.cwd(), "content", "site");

export const SETTINGS_FILE = path.join(CONTENT_DIR, "settings.json");
export const EXPERIENCE_FILE = path.join(CONTENT_DIR, "experience.json");
export const NOW_FILE = path.join(CONTENT_DIR, "now.json");
export const EDUCATION_FILE = path.join(CONTENT_DIR, "education.json");
export const SKILLS_FILE = path.join(CONTENT_DIR, "skills.json");
export const PERSONALITY_FILE = path.join(CONTENT_DIR, "personality.json");
export const NAVIGATION_FILE = path.join(CONTENT_DIR, "navigation.json");
export const META_FILE = path.join(CONTENT_DIR, "meta.json");
export const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
export const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");

// ---------------------------------------------------------------- field lists

/** Plain (non-JSON) columns on Project that are written to and read from files. */
export const PROJECT_SCALARS = [
  "title", "slug", "category", "year", "shortDesc", "longDesc", "status", "isFeatured", "order",
  "coverImage", "thumbnail", "accentColor", "projectMark", "liveUrl", "githubUrl", "demoUrl",
  "caseStudySlug", "theProblem", "theMessyPart", "architecture", "technicalDecisions",
  "whatIdChange", "fullContent", "showOnHome", "showInWork", "resumeBlurb", "showOnResume",
] as const;
export const PROJECT_JSON = ["stack", "metrics", "links"] as const;

export const EXPERIENCE_SCALARS = [
  "company", "role", "location", "startDate", "endDate", "isCurrent", "description", "order", "showOnResume",
] as const;
export const EXPERIENCE_JSON = ["bullets", "technologies", "metrics", "linkedProjects", "resumeBullets"] as const;

export const EDUCATION_FIELDS = ["institution", "degree", "period", "detail", "order"] as const;

/** Settings that live only in the database (never written to files / git). */
export const DB_ONLY_SETTINGS = new Set(["resume_phone"]);

export const NOW_FIELDS = ["category", "title", "text", "url", "order", "isActive"] as const;
export const PERSONALITY_FIELDS = ["category", "title", "body", "order"] as const;
export const NAVIGATION_FIELDS = ["label", "href", "order", "isEnabled", "isExternal"] as const;

// ---------------------------------------------------------------- helpers

export type Json = Record<string, unknown>;

export function ensureDirs() {
  for (const d of [CONTENT_DIR, PROJECTS_DIR, ARTICLES_DIR]) fs.mkdirSync(d, { recursive: true });
}

export function writeJson(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

export function readJson<T>(file: string, fallback: T): T {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export function listFiles(dir: string, ext: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => path.join(dir, f));
}

/** A JSON-in-a-string column -> real value (falls back to an empty array). */
export function parseJsonColumn(raw: string | null | undefined): unknown {
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Real value -> the JSON string stored in the column. */
export function stringifyJsonColumn(value: unknown): string {
  return JSON.stringify(value ?? []);
}

export function pick<T extends Json>(row: T, keys: readonly string[]): Json {
  const out: Json = {};
  for (const k of keys) out[k] = row[k] ?? null;
  return out;
}

// ---------------------------------------------------------------- article files

export type ArticleFile = {
  data: {
    title: string;
    slug: string;
    excerpt: string;
    author: string;
    publishedAt: string;
    readingTime: string;
    tags: string[];
    isFeatured: boolean;
    isPublished: boolean;
    coverImage?: string | null;
    seoTitle?: string | null;
    seoDesc?: string | null;
  };
  content: string;
};

export function articleToMarkdown(a: ArticleFile): string {
  const data: Json = { ...a.data };
  for (const k of Object.keys(data)) if (data[k] === null || data[k] === undefined) delete data[k];
  return matter.stringify(a.content.trim() + "\n", data);
}

export function parseArticle(file: string): ArticleFile {
  const parsed = matter(fs.readFileSync(file, "utf8"));
  const d = parsed.data as unknown as Omit<ArticleFile["data"], "publishedAt"> & { publishedAt: string | Date };
  return {
    data: {
      ...d,
      publishedAt: d.publishedAt instanceof Date ? d.publishedAt.toISOString() : String(d.publishedAt),
      tags: d.tags ?? [],
    },
    content: parsed.content.trim(),
  };
}

/** Reading time from word count (about 220 words/minute), e.g. "6 min read". */
export function readingTime(markdown: string): string {
  const words = markdown.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}
