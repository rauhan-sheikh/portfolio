import { PrismaClient } from "@prisma/client";
import {
  DB_ONLY_SETTINGS, EDUCATION_FIELDS, EDUCATION_FILE, SKILLS_FILE, EXPERIENCE_FILE, EXPERIENCE_JSON, EXPERIENCE_SCALARS, NAVIGATION_FIELDS, NAVIGATION_FILE, NOW_FIELDS,
  NOW_FILE, PERSONALITY_FIELDS, PERSONALITY_FILE, PROJECTS_DIR, PROJECT_JSON, PROJECT_SCALARS, ARTICLES_DIR,
  SETTINGS_FILE, listFiles, parseArticle, readJson, stringifyJsonColumn, type Json,
} from "./content/shared";
import fs from "node:fs";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--yes");

/**
 * content/site/* -> DB. Dry run by default: prints what would be created or changed.
 * Pass --yes to write. Never deletes rows and never touches newsletterSentAt.
 * Usage: pnpm content:push [--yes]
 * Production writes are made by the site owner only (see AGENTS.md).
 */

const report = { create: 0, update: 0, same: 0 };

function changedKeys(existing: Json, next: Json): string[] {
  return Object.keys(next).filter((k) => JSON.stringify(existing[k] ?? null) !== JSON.stringify(next[k] ?? null));
}

async function apply<T extends Json>(
  label: string,
  existing: Json | null,
  next: T,
  create: () => Promise<unknown>,
  update: () => Promise<unknown>
) {
  if (!existing) {
    report.create++;
    console.log(`  + create  ${label}`);
    if (APPLY) await create();
    return;
  }
  const keys = changedKeys(existing, next);
  if (keys.length === 0) {
    report.same++;
    return;
  }
  report.update++;
  console.log(`  ~ update  ${label}  [${keys.join(", ")}]`);
  if (APPLY) await update();
}

async function main() {
  console.log(APPLY ? "Applying content to the database..." : "Dry run (add --yes to apply)...");

  // ---- settings
  const settings = readJson<Record<string, string>>(SETTINGS_FILE, {});
  for (const [key, value] of Object.entries(settings)) {
    if (DB_ONLY_SETTINGS.has(key)) continue;
    const existing = await prisma.siteSetting.findUnique({ where: { key } });
    await apply(
      `setting ${key}`,
      existing as unknown as Json | null,
      { value },
      () => prisma.siteSetting.create({ data: { key, value } }),
      () => prisma.siteSetting.update({ where: { key }, data: { value } })
    );
  }

  // ---- projects
  for (const file of listFiles(PROJECTS_DIR, ".json")) {
    const p = readJson<Json>(file, {});
    const data: Json = {};
    for (const k of PROJECT_SCALARS) if (p[k] !== undefined) data[k] = p[k];
    for (const k of PROJECT_JSON) if (p[k] !== undefined) data[k] = stringifyJsonColumn(p[k]);
    const existing = await prisma.project.findUnique({ where: { slug: String(p.slug) } });
    await apply(
      `project ${p.slug}`,
      existing as unknown as Json | null,
      data,
      () => prisma.project.create({ data: data as never }),
      () => prisma.project.update({ where: { slug: String(p.slug) }, data: data as never })
    );
  }

  // ---- experience (natural key: company + role)
  for (const e of readJson<Json[]>(EXPERIENCE_FILE, [])) {
    const data: Json = {};
    for (const k of EXPERIENCE_SCALARS) if (e[k] !== undefined) data[k] = e[k];
    for (const k of EXPERIENCE_JSON) if (e[k] !== undefined) data[k] = stringifyJsonColumn(e[k]);
    const existing = await prisma.experience.findFirst({ where: { company: String(e.company), role: String(e.role) } });
    await apply(
      `experience ${e.role} @ ${e.company}`,
      existing as unknown as Json | null,
      data,
      () => prisma.experience.create({ data: data as never }),
      () => prisma.experience.update({ where: { id: existing!.id }, data: data as never })
    );
  }

  // ---- education (natural key: institution + degree)
  for (const ed of readJson<Json[]>(EDUCATION_FILE, [])) {
    const data: Json = {};
    for (const k of EDUCATION_FIELDS) if (ed[k] !== undefined) data[k] = ed[k];
    const existing = await prisma.education.findFirst({ where: { institution: String(ed.institution), degree: String(ed.degree) } });
    await apply(
      `education ${ed.degree}`,
      existing as unknown as Json | null,
      data,
      () => prisma.education.create({ data: data as never }),
      () => prisma.education.update({ where: { id: existing!.id }, data: data as never })
    );
  }

  // ---- skill groups (natural key: label)
  for (const g of readJson<Json[]>(SKILLS_FILE, [])) {
    const data: Json = { label: g.label, items: stringifyJsonColumn(g.items), order: Number(g.order) || 0 };
    const existing = await prisma.skillGroup.findUnique({ where: { label: String(g.label) } });
    await apply(
      `skills ${g.label}`,
      existing as unknown as Json | null,
      data,
      () => prisma.skillGroup.create({ data: data as never }),
      () => prisma.skillGroup.update({ where: { label: String(g.label) }, data: data as never })
    );
  }

  // ---- articles
  for (const file of listFiles(ARTICLES_DIR, ".md")) {
    const a = parseArticle(file);
    const data: Json = {
      title: a.data.title,
      slug: a.data.slug,
      excerpt: a.data.excerpt,
      content: a.content,
      coverImage: a.data.coverImage ?? null,
      author: a.data.author,
      publishedAt: new Date(a.data.publishedAt),
      readingTime: a.data.readingTime,
      tags: stringifyJsonColumn(a.data.tags),
      isFeatured: Boolean(a.data.isFeatured),
      isPublished: Boolean(a.data.isPublished),
      seoTitle: a.data.seoTitle ?? null,
      seoDesc: a.data.seoDesc ?? null,
    };
    const existing = await prisma.article.findUnique({ where: { slug: a.data.slug } });
    const existingCmp = existing ? ({ ...existing, publishedAt: existing.publishedAt.toISOString() } as unknown as Json) : null;
    const nextCmp = { ...data, publishedAt: new Date(a.data.publishedAt).toISOString() };
    await apply(
      `article ${a.data.slug}`,
      existingCmp,
      nextCmp,
      () => prisma.article.create({ data: data as never }),
      () => prisma.article.update({ where: { slug: a.data.slug }, data: data as never })
    );
  }

  // ---- now items (natural key: title)
  for (const n of readJson<Json[]>(NOW_FILE, [])) {
    const data: Json = {};
    for (const k of NOW_FIELDS) if (n[k] !== undefined) data[k] = n[k];
    const existing = await prisma.nowItem.findFirst({ where: { title: String(n.title) } });
    await apply(
      `now ${n.title}`,
      existing as unknown as Json | null,
      data,
      () => prisma.nowItem.create({ data: data as never }),
      () => prisma.nowItem.update({ where: { id: existing!.id }, data: data as never })
    );
  }

  // ---- personality (natural key: title)
  for (const n of readJson<Json[]>(PERSONALITY_FILE, [])) {
    const data: Json = {};
    for (const k of PERSONALITY_FIELDS) if (n[k] !== undefined) data[k] = n[k];
    const existing = await prisma.personalityItem.findFirst({ where: { title: String(n.title) } });
    await apply(
      `personality ${n.title}`,
      existing as unknown as Json | null,
      data,
      () => prisma.personalityItem.create({ data: data as never }),
      () => prisma.personalityItem.update({ where: { id: existing!.id }, data: data as never })
    );
  }

  // ---- navigation (natural key: href)
  for (const n of readJson<Json[]>(NAVIGATION_FILE, [])) {
    const data: Json = {};
    for (const k of NAVIGATION_FIELDS) if (n[k] !== undefined) data[k] = n[k];
    const existing = await prisma.navigationItem.findFirst({ where: { href: String(n.href) } });
    await apply(
      `navigation ${n.href}`,
      existing as unknown as Json | null,
      data,
      () => prisma.navigationItem.create({ data: data as never }),
      () => prisma.navigationItem.update({ where: { id: existing!.id }, data: data as never })
    );
  }

  console.log(`\n${report.create} to create, ${report.update} to update, ${report.same} unchanged.`);
  if (!APPLY && report.create + report.update > 0) console.log("Nothing written. Re-run with --yes to apply.");
  void fs;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
