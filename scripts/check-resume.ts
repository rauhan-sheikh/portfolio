/**
 * Fails (exit 1) unless the generated résumé is exactly one page.
 * Usage: pnpm resume:check [url]
 *   default url: http://localhost:3111/resume.pdf  (start `pnpm preview` first)
 *   production:  pnpm resume:check https://rauhansheikh.com/resume.pdf
 */
async function main() {
  const url = process.argv[2] || "http://localhost:3111/resume.pdf";
  const res = await fetch(url);
  if (!res.ok || !(res.headers.get("content-type") || "").includes("application/pdf")) {
    console.error(`FAIL: ${url} did not return a PDF (HTTP ${res.status}).`);
    process.exit(1);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const pages = (buffer.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`${url}: ${pages} page(s), ${(buffer.length / 1024).toFixed(0)} KB`);
  if (pages !== 1) {
    console.error("FAIL: the resume must fit on exactly one page. Shorten resumeBullets or the summary.");
    process.exit(1);
  }
  console.log("OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
