/**
 * Read-only SEO and health audit of a running site (production or `pnpm preview`).
 *
 *   pnpm audit:site [baseUrl]        default: https://rauhansheikh.com
 *
 * Checks every sitemap URL: HTTP 200 without redirect, exactly one <h1>, title <= 60 chars,
 * description <= 160, self-referencing canonical, og:url matches the page, og:image present,
 * valid JSON-LD, and no accidental noindex. Exits 1 if anything fails.
 */
export {};

const base = (process.argv[2] || "https://rauhansheikh.com").replace(/\/$/, "");

type Row = { url: string; problems: string[] };

const decode = (t: string) =>
  t.replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const path = (u: string, baseUrl: string) => new URL(u, baseUrl).pathname.replace(/\/$/, "") || "/";

const meta = (html: string, attr: string, name: string) =>
  html.match(new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"))?.[1] ??
  html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, "i"))?.[1];

async function main() {
  const sm = await fetch(`${base}/sitemap.xml`);
  if (!sm.ok) throw new Error(`sitemap.xml returned ${sm.status}`);
  const xml = await sm.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(`${urls.length} URLs in sitemap\n`);

  const rows: Row[] = [];
  for (const loc of urls) {
    const url = base + (new URL(loc).pathname.replace(/\/$/, "") || "/");
    const problems: string[] = [];
    const res = await fetch(url, { redirect: "manual" });
    if (res.status !== 200) {
      problems.push(`HTTP ${res.status} (expected 200, no redirect)`);
      rows.push({ url, problems });
      continue;
    }
    const html = await res.text();
    const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
    const desc = decode(meta(html, "name", "description") ?? "");
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/)?.[1];
    const ogUrl = meta(html, "property", "og:url");
    const robots = meta(html, "name", "robots") ?? "";
    const h1s = (html.match(/<h1[\s>]/g) || []).length;

    if (!title) problems.push("missing <title>");
    else if (title.length > 60) problems.push(`title is ${title.length} chars (max 60)`);
    if (!desc) problems.push("missing meta description");
    else if (desc.length > 160) problems.push(`description is ${desc.length} chars (max 160)`);
    if (!canonical) problems.push("missing canonical");
    else if (path(canonical, base) !== path(url, base)) problems.push(`canonical is ${canonical}`);
    if (!ogUrl) problems.push("missing og:url");
    else if (path(ogUrl, base) !== path(url, base)) problems.push(`og:url is ${ogUrl}`);
    if (!meta(html, "property", "og:image")) problems.push("missing og:image");
    if (!meta(html, "name", "twitter:image")) problems.push("missing twitter:image");
    if (/noindex/i.test(robots)) problems.push("page is noindex but listed in sitemap");
    if (h1s !== 1) problems.push(`${h1s} <h1> elements (expected 1)`);
    for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(m[1]);
      } catch {
        problems.push("invalid JSON-LD");
      }
    }
    rows.push({ url, problems });
  }

  for (const f of ["/robots.txt", "/manifest.webmanifest", "/opengraph-image", "/twitter-image", "/feed.xml", "/resume.pdf"]) {
    const r = await fetch(base + f, { redirect: "manual" });
    rows.push({ url: base + f, problems: r.status === 200 ? [] : [`HTTP ${r.status}`] });
  }

  let failed = 0;
  for (const r of rows) {
    if (r.problems.length) failed++;
    console.log(`${r.problems.length ? "FAIL" : "ok  "} ${r.url}${r.problems.length ? "\n       - " + r.problems.join("\n       - ") : ""}`);
  }
  console.log(`\n${rows.length - failed}/${rows.length} passed`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
