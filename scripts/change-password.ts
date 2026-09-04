import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const newPassword = process.argv[2];
  const email = process.argv[3] || "admin@rauhansheikh.com";

  if (!newPassword) {
    console.error("❌ Usage: npx tsx scripts/change-password.ts <new-password> [email]");
    console.error("Example: npx tsx scripts/change-password.ts mySuperSecretPassword123");
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error("❌ Error: Password must be at least 8 characters long.");
    process.exit(1);
  }

  console.log(`🔐 Updating password for admin user: ${email}...`);

  const user = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`❌ Error: Admin user with email "${email}" not found.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.adminUser.update({
    where: { email },
    data: { password: hashedPassword },
  });

  await prisma.auditLog.create({
    data: {
      action: "PASSWORD_CHANGED_CLI",
      entityType: "ADMIN_USER",
      entityId: user.id,
      details: `Password changed via CLI script for ${email}`,
    },
  });

  console.log(`✅ Password successfully updated for ${email}!`);
  console.log(`You can now log in at http://localhost:3000/admin/login with your new password.`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
