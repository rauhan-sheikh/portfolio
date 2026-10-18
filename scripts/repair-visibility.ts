import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * One-off repair: saving a project in the old admin form reset showOnHome/showInWork to
 * false, hiding projects from /work and the homepage. Re-lists the ProSync projects.
 * Prints what it would change; pass --yes to apply. Usage: pnpm tsx scripts/repair-visibility.ts [--yes]
 */
const SLUGS = ["marketbaaz", "workforce-hrms", "crm-platform"];

async function main() {
  const apply = process.argv.includes("--yes");
  const projects = await prisma.project.findMany({ where: { slug: { in: SLUGS } } });

  for (const p of projects) {
    const needs = !p.showInWork || !p.showOnHome || p.status !== "PUBLISHED";
    console.log(
      `${needs ? "FIX " : "ok  "} ${p.slug}: status=${p.status} showInWork=${p.showInWork} showOnHome=${p.showOnHome}`
    );
    if (needs && apply) {
      await prisma.project.update({
        where: { id: p.id },
        data: { showInWork: true, showOnHome: true, status: "PUBLISHED" },
      });
    }
  }
  console.log(apply ? "Applied." : "Dry run only. Re-run with --yes to apply.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
