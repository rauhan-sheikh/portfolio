// Local preview without a real database: an in-process Postgres (PGlite) served on a socket,
// migrated and seeded from content/site, then `next dev` against it.
//
//   pnpm preview              -> db + migrate + seed + next dev on http://localhost:3111
//   pnpm preview --db-only    -> just the database (for running other scripts against it)
//   pnpm preview --no-seed    -> skip seeding (e.g. you already pulled data in)
//
// Nothing here ever touches a real database; the data lives in memory and vanishes on exit.
import { spawn } from "node:child_process";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const PORT = Number(process.env.PREVIEW_DB_PORT || 55432);
const WEB_PORT = Number(process.env.PREVIEW_WEB_PORT || 3111);
const args = new Set(process.argv.slice(2));

// pgbouncer=true disables prepared statements, which PGlite's single connection can't share.
const env = {
  ...process.env,
  DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:${PORT}/postgres?connection_limit=1&sslmode=disable&pgbouncer=true`,
  ADMIN_SESSION_SECRET: "preview-secret-preview-secret-preview-secret-1234",
  ADMIN_DEFAULT_PASSWORD: "preview-only-password",
  NEXT_PUBLIC_SITE_URL: `http://localhost:${WEB_PORT}`,
};

// Async on purpose: the in-process database lives in this event loop, so a blocking spawnSync would freeze it.
function run(cmd, cmdArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, { env, stdio: "inherit", shell: true });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${cmdArgs.join(" ")} failed (${code})`))));
  });
}

const db = await PGlite.create();
const server = new PGLiteSocketServer({ db, port: PORT, host: "127.0.0.1" });
await server.start();
console.log(`[preview] in-memory Postgres ready on :${PORT}`);

if (!args.has("--db-only")) {
  await run("npx", ["prisma", "migrate", "deploy"]);
  if (!args.has("--no-seed")) await run("npx", ["tsx", "prisma/seed.ts"]);
  const next = spawn("npx", ["next", "dev", "-p", String(WEB_PORT)], { env, stdio: "inherit", shell: true });
  next.on("exit", async () => {
    await server.stop();
    process.exit(0);
  });
} else {
  console.log("[preview] --db-only: DATABASE_URL for other scripts:\n  " + env.DATABASE_URL);
}

process.on("SIGINT", async () => {
  await server.stop();
  process.exit(0);
});
