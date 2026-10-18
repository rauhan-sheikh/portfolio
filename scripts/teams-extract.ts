import fs from "node:fs";
import path from "node:path";

/**
 * Pulls the site owner's own work updates out of a Microsoft Teams export, so the monthly site
 * update can start from real material instead of the whole 25 MB file.
 *
 *   pnpm teams:extract <export.json | folder-of-exports> [--since YYYY-MM-DD] [--mark-done]
 *
 * Reads private/update-site.json (gitignored):
 *   { "myUserId": "8:live:.cid...", "groups": [ { "label": "Software Development", "id": "19:...@thread.v2" } ], "minLength": 120 }
 * Writes private/teams-extract-<date>.md and prints its path. Only the owner's messages, only from the
 * listed groups, only longer messages (real updates), newest cursor in content/site/meta.json.
 * Messages that look like they contain credentials are dropped entirely.
 */

const ROOT = process.cwd();
const CONFIG = path.join(ROOT, "private", "update-site.json");
const META = path.join(ROOT, "content", "site", "meta.json");

type Msg = { originalarrivaltime: string; messagetype?: string; content?: string; from?: string | null };
type Conv = { id: string; displayName?: string | null; MessageList: Msg[] };

const SECRET = [
  /pass(word|wd)?\s*[:=]/i,
  /\b(api[_ -]?key|secret|token|bearer|private[_ -]?key)\b\s*[:=]/i,
  /\b[A-Fa-f0-9]{32,}\b/, // long hex strings (keys, hashes)
  /\b(sk|pk|rk)_(live|test)_[A-Za-z0-9]+/,
  /[A-Za-z0-9+/=_-]{40,}/, // long opaque tokens
  /\b[\w.+-]+@[\w-]+\.[\w.-]+\s*(\n|\r|\s)+\s*pass/i,
];

const strip = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|div|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{2,}/g, "\n")
    .trim();

function exportFiles(target: string): string[] {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs
    .readdirSync(target)
    .filter((f) => f.endsWith(".json") && f.toLowerCase().includes("message"))
    .map((f) => path.join(target, f));
}

function main() {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith("--"));
  if (!target) {
    console.error("Usage: pnpm teams:extract <export.json | folder> [--since YYYY-MM-DD] [--mark-done]");
    process.exit(1);
  }
  if (!fs.existsSync(CONFIG)) {
    console.error(`Missing ${CONFIG}. See docs/UPDATING.md for the format.`);
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(CONFIG, "utf8")) as {
    myUserId: string;
    groups: { label: string; id: string }[];
    minLength?: number;
  };
  const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, "utf8")) : {};
  const sinceArg = args[args.indexOf("--since") + 1];
  const since = (args.includes("--since") && sinceArg) || meta.teamsExportCursor || "1970-01-01";
  const minLength = cfg.minLength ?? 120;

  const out: string[] = [];
  let newest = since;
  let dropped = 0;

  for (const file of exportFiles(target)) {
    const data = JSON.parse(fs.readFileSync(file, "utf8")) as { conversations: Conv[] };
    for (const group of cfg.groups) {
      const conv = data.conversations.find((c) => c.id === group.id);
      if (!conv) continue;
      const mine = conv.MessageList.filter(
        (m) => m.from === cfg.myUserId && (m.messagetype || "").startsWith("RichText") && m.originalarrivaltime.slice(0, 10) > since
      ).sort((a, b) => (a.originalarrivaltime < b.originalarrivaltime ? -1 : 1));

      out.push(`\n# ${group.label}\n`);
      for (const m of mine) {
        const text = strip(m.content || "");
        if (text.length < minLength) continue;
        const probe = text.replace(/https?:\/\/\S+/g, "");
        if (SECRET.some((re) => re.test(probe))) {
          dropped++;
          continue;
        }
        out.push(`## ${m.originalarrivaltime.slice(0, 16).replace("T", " ")}\n\n${text}\n`);
        if (m.originalarrivaltime > newest) newest = m.originalarrivaltime;
      }
    }
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const dest = path.join(ROOT, "private", `teams-extract-${stamp}.md`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(
    dest,
    `<!-- Owner's own updates since ${since}. Messages that looked like credentials were dropped (${dropped}). Do not commit. -->\n${out.join("\n")}`
  );
  console.log(`Wrote ${dest} (${out.length} blocks, ${dropped} dropped as possible secrets). Newest message: ${newest}`);

  if (args.includes("--mark-done")) {
    fs.writeFileSync(META, JSON.stringify({ ...meta, teamsExportCursor: newest.slice(0, 10), lastUpdated: stamp }, null, 2) + "\n");
    console.log(`Cursor moved to ${newest.slice(0, 10)} in content/site/meta.json`);
  }
}

main();
