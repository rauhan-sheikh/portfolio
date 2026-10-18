# AGENTS.md — rauhansheikh.com

Instructions for any AI agent (and human) working in this repo. Read this first, then
[docs/PROJECT_MAP.md](docs/PROJECT_MAP.md) for where everything lives.

This is Rauhan Sheikh's personal portfolio: a Next.js App Router site backed by PostgreSQL (Prisma),
deployed on Vercel at `https://rauhansheikh.com` (the apex is the canonical host; `www` redirects to it).

## Stack and commands

Next.js 16 (App Router, React 19, TypeScript, Tailwind 4), Prisma 6 + PostgreSQL, `jose` admin sessions,
Resend email. Package manager is **pnpm**.

| Task | Command |
|---|---|
| Install | `pnpm install --frozen-lockfile` |
| Dev server | `pnpm dev` (needs `DATABASE_URL`) |
| Typecheck | `npx tsc --noEmit` |
| Lint | `pnpm lint` (the repo has pre-existing lint errors; only fix what you touch) |
| Build (Vercel runs this) | `pnpm build` = `prisma migrate deploy && prisma generate && next build` |
| Seed a fresh DB | `ADMIN_DEFAULT_PASSWORD=... pnpm db:seed` (admin user + `content/site/*`) |
| Preview with no database | `pnpm preview` (in-memory Postgres, seeded from `content/site`, `next dev` on :3111) |
| Check the generated résumé is one page | `pnpm resume:check` (with `pnpm preview` running) |
| Capture live content into files | `pnpm content:pull` (needs the live `DATABASE_URL`) |
| Apply files to a DB | `pnpm content:push` (dry run) / `pnpm content:push --yes` |

**Windows quirks.** If `node_modules` links point at a missing folder, repair with
`CI=true pnpm install --frozen-lockfile --config.confirmModulesPurge=false`. There is no local Postgres and the
Docker daemon is usually off, so use `pnpm preview` for anything that needs a database.

## Git workflow (mandatory)

**Never commit directly to `main`.** Every change starts by branching:

```bash
git switch main && git pull
git switch -c <type>/<kebab-case-name>
```

| Prefix | Use for |
|---|---|
| `feature/` | New capability (e.g. `feature/resume-generated-pdf`) |
| `fix/` | Bug fix (e.g. `fix/admin-visibility-and-draft-leaks`) |
| `chore/` | Tooling, refactors, dead-code removal, dependencies |
| `content/` | Copy and data refreshes (projects, experience, writing, Now) |
| `docs/` | Documentation only |
| `seo/` | Metadata, structured data, sitemap, share images |

One concern per branch, one pull request per branch, squash-merge. Write commit messages that explain *why*.
Do not push, merge, or run anything against the production database unless the owner explicitly says to.

## Content rules (this is a public site in a real person's name)

Rauhan works at ProSync Infotech Private Limited and must not expose the employer's secrets. Follow these
every time you write or edit copy, case studies, résumé text, essays or Now items:

1. **Write for a stranger with no context.** Avoid jargon and internal names. Numbers must mean something to
   an outsider.
2. **No version numbers** (e.g. "v2.19"), no exact data volumes, no revenue/user counts, no model or vendor
   names that reveal how a proprietary system works, no internal URLs, no credentials, no names of colleagues
   or leadership from chats.
3. **Public vs internal.** Only **MarketBaaz** is a public product and may link to `marketbaaz.com`. The
   **Workforce HRMS** and **CRM** are internal: describe the engineering approach and outcomes at a high level,
   no links, and say they are internal.
4. **Roles, stated accurately.** MarketBaaz: sole engineer. Workforce HRMS and CRM: senior developer on a
   two-person team.
5. **Personal projects stay low-key.** BusinessOS is Rauhan's personal project, not ProSync work; do not
   mention it next to employer work or in "Now".
6. **Plain claims only.** Never invent metrics. If a fact is not in a source the owner provided (Teams export,
   résumé, message), ask instead of guessing. Prefer qualitative outcomes ("every release is reversible") over
   shaky numbers.
7. **Essays are general lessons**, never a description of a specific internal system's secrets.

## Content: where it lives

The live site reads the **database**, which the owner can also edit in `/admin`. The **versioned copy of all
public content is `content/site/`** and the two are kept in step with scripts:

```
content/site/
  settings.json  experience.json  now.json  personality.json  navigation.json  meta.json
  projects/<slug>.json      (stack/metrics/links are real arrays)
  articles/<slug>.md        (front matter + Markdown body)
```

- `pnpm content:pull` writes the live DB into those files. **Always run it first** so edits made in `/admin` are
  captured in git before you change anything; review with `git diff content/site`.
- Edit the files (or ask the agent to), preview with `pnpm preview`, open a PR.
- `pnpm content:push` is a dry run that lists what would change; `--yes` writes. It upserts by natural key, never
  deletes rows, and never touches `newsletterSentAt`. **Only the owner runs it against production, after the PR is
  merged.**
- `prisma/seed.ts` creates the admin user and then runs `content:push --yes`, so a fresh database equals the repo.

## Before you open a PR

- `npx tsc --noEmit` passes; no new lint errors in files you touched.
- UI changes: screenshot the page at desktop and 375px, and check light/dark.
- Metadata changes: use `pageMetadata()` from `lib/seo.ts` so every page has its own canonical, OG and Twitter tags.
- Never include `.env*`, credentials, or Teams export files in a commit.
- Update `docs/PROJECT_MAP.md` if you add a route, model, setting or script.
