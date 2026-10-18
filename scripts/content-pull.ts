import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import {
  ARTICLES_DIR, DB_ONLY_SETTINGS, EDUCATION_FIELDS, EDUCATION_FILE, SKILLS_FILE, EXPERIENCE_FILE, EXPERIENCE_JSON, EXPERIENCE_SCALARS, META_FILE, NAVIGATION_FIELDS,
  NAVIGATION_FILE, NOW_FIELDS, NOW_FILE, PERSONALITY_FIELDS, PERSONALITY_FILE, PROJECTS_DIR,
  PROJECT_JSON, PROJECT_SCALARS, SETTINGS_FILE, articleToMarkdown, ensureDirs, parseJsonColumn,
  pick, writeJson, type Json,
} from "./content/shared";

const prisma = new PrismaClient();

/**
 * DB -> content/site/*. Run this BEFORE editing content so any change made in /admin is captured
 * in git first, then review `git diff content/site`. Usage: pnpm content:pull
 * Files for rows that no longer exist in the DB are left alone (deleting is a manual decision).
 */
async function main() {
  ensureDirs();

  const settings = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  writeJson(SETTINGS_FILE, Object.fromEntries(settings.filter((s) => !DB_ONLY_SETTINGS.has(s.key)).map((s) => [s.key, s.value])));

  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  writeJson(
    EXPERIENCE_FILE,
    experiences.map((e) => {
      const row = e as unknown as Json;
      const out = pick(row, EXPERIENCE_SCALARS);
      for (const k of EXPERIENCE_JSON) out[k] = parseJsonColumn(row[k] as string);
      return out;
    })
  );

  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  for (const p of projects) {
    const row = p as unknown as Json;
    const out = pick(row, PROJECT_SCALARS);
    for (const k of PROJECT_JSON) out[k] = parseJsonColumn(row[k] as string);
    writeJson(path.join(PROJECTS_DIR, `${p.slug}.json`), out);
  }

  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });
  for (const a of articles) {
    fs.writeFileSync(
      path.join(ARTICLES_DIR, `${a.slug}.md`),
      articleToMarkdown({
        data: {
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          author: a.author,
          publishedAt: a.publishedAt.toISOString(),
          readingTime: a.readingTime,
          tags: parseJsonColumn(a.tags) as string[],
          isFeatured: a.isFeatured,
          isPublished: a.isPublished,
          coverImage: a.coverImage,
          seoTitle: a.seoTitle,
          seoDesc: a.seoDesc,
        },
        content: a.content,
      })
    );
  }

  writeJson(NOW_FILE, (await prisma.nowItem.findMany({ orderBy: { order: "asc" } })).map((r) => pick(r as unknown as Json, NOW_FIELDS)));
  writeJson(PERSONALITY_FILE, (await prisma.personalityItem.findMany({ orderBy: { order: "asc" } })).map((r) => pick(r as unknown as Json, PERSONALITY_FIELDS)));
  writeJson(NAVIGATION_FILE, (await prisma.navigationItem.findMany({ orderBy: { order: "asc" } })).map((r) => pick(r as unknown as Json, NAVIGATION_FIELDS)));

  writeJson(EDUCATION_FILE, (await prisma.education.findMany({ orderBy: { order: "asc" } })).map((r) => pick(r as unknown as Json, EDUCATION_FIELDS)));
  const skills = await prisma.skillGroup.findMany({ orderBy: { order: "asc" } });
  writeJson(SKILLS_FILE, skills.map((g) => ({ label: g.label, items: parseJsonColumn(g.items), order: g.order })));

  if (!fs.existsSync(META_FILE)) writeJson(META_FILE, { lastUpdated: null, teamsExportCursor: null });

  console.log(
    `Pulled ${settings.length} settings, ${experiences.length} experiences, ${projects.length} projects, ${articles.length} articles. Review: git diff content/site`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
