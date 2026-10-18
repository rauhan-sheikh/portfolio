import { PrismaClient } from "@prisma/client";
import {
  PROSYNC_COMPANY,
  prosyncExperience,
  prosyncProjects,
  projectOrder,
  prosyncNowItem,
} from "../prisma/content/prosync";

const prisma = new PrismaClient();

/**
 * Idempotent: upserts the ProSync role and projects, applies display order,
 * and refreshes the matching "Now" item. Safe to re-run. Usage: pnpm db:sync-prosync
 */
async function main() {
  console.log("🔄 Syncing ProSync experience & projects...");

  for (const project of prosyncProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
    console.log(`✅ Upserted project: ${project.title} (${project.slug})`);
  }

  for (const [slug, order] of Object.entries(projectOrder)) {
    await prisma.project.updateMany({ where: { slug }, data: { order } });
  }
  console.log("✅ Applied project display order");

  const existing = await prisma.experience.findFirst({
    where: { company: { contains: "ProSync", mode: "insensitive" } },
  });
  if (existing) {
    await prisma.experience.update({ where: { id: existing.id }, data: prosyncExperience });
  } else {
    await prisma.experience.create({ data: prosyncExperience });
  }
  console.log(`✅ Synced experience: ${PROSYNC_COMPANY}`);

  const now = await prisma.nowItem.findFirst({
    where: { title: { in: [prosyncNowItem.oldTitle, prosyncNowItem.title] } },
  });
  if (now) {
    await prisma.nowItem.update({
      where: { id: now.id },
      data: { title: prosyncNowItem.title, text: prosyncNowItem.text },
    });
    console.log("✅ Updated Now item");
  }

  console.log("✨ ProSync content synchronized.");
}

main()
  .catch((e) => {
    console.error("❌ Sync error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
