import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { spawn } from "node:child_process";

const prisma = new PrismaClient();

/**
 * Seeds a fresh database: the admin user, then all public content from content/site/
 * (settings, projects, experience, articles, Now, navigation) via scripts/content-push.ts.
 * Content is edited in content/site/*, not here.
 */
async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Admin User
  // No hardcoded fallback: a seeded-but-unconfigured production deploy would
  // otherwise ship with credentials published in this repo.
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!defaultPassword) {
    throw new Error(
      "ADMIN_DEFAULT_PASSWORD is required to seed the admin user. Set it in .env before running the seed."
    );
  }
  if (defaultPassword.length < 8) {
    throw new Error("ADMIN_DEFAULT_PASSWORD must be at least 8 characters.");
  }
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@rauhansheikh.com" },
    update: {
      name: "Rauhan Sheikh",
    },
    create: {
      email: "admin@rauhansheikh.com",
      name: "Rauhan Sheikh",
      password: hashedPassword,
      role: Role.OWNER,
    },
  });
  console.log(`✓ Admin user configured: ${admin.email}`);

  // 2. Public content from content/site/*
  // Release our connection first (the preview DB accepts one at a time), and spawn asynchronously
  // so this process's event loop stays responsive. Prisma reconnects lazily afterwards.
  await prisma.$disconnect();
  await new Promise<void>((resolve, reject) => {
    const push = spawn("npx", ["tsx", "scripts/content-push.ts", "--yes"], { stdio: "inherit", shell: true, env: process.env });
    push.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("content-push failed"))));
  });

  // 3. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      action: "DATABASE_INITIALIZED",
      entityType: "SYSTEM",
      entityId: "SYSTEM_SEED",
      details: "Initial database seed completed from content/site.",
    },
  });
  console.log("✓ Audit log initialized");

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
