# Project map

A guide to where everything on rauhansheikh.com comes from. Rules for changing it are in
[AGENTS.md](../AGENTS.md).

## Public pages

| URL | File | Data source | Notes |
|---|---|---|---|
| `/` | `app/page.tsx` | DB: projects (`showOnHome`), articles, now items, experience, personality, settings | Sections are toggled by `section_*_enabled` settings. The **Snapshot** card and the "Featured Systems" subtitle are hard-coded in this file. |
| `/work` | `app/work/page.tsx` + `components/public/WorkDirectory.tsx` | DB: projects (`PUBLISHED` and `showInWork`) | Filter chips are client-side. |
| `/work/[slug]` | `app/work/[slug]/page.tsx` | DB: one project | Only `PUBLISHED` projects render. Two slugs have bespoke diagrams (`TeamsArchitectureStory`, `BulkEmailArchitectureStory`). |
| `/writing` | `app/writing/page.tsx` | DB: published articles | |
| `/writing/[slug]` | `app/writing/[slug]/page.tsx` | DB: one article (Markdown body) | Emits `BlogPosting` + `BreadcrumbList` JSON-LD. |
| `/now` | `app/now/page.tsx` | DB: active now items | Categories: Building, Learning, Reading, Thinking, Experimenting. |
| `/experience` | `app/experience/page.tsx` | DB: experiences + project titles for links | |
| `/about` | `app/about/page.tsx` | DB: personality items; story text is hard-coded | |
| `/resume` | `app/resume/page.tsx` | DB: experiences, featured projects, `resume_summary` setting | Competencies are hard-coded. The download is the static `public/resume.pdf`. |
| `/contact` | `app/contact/page.tsx` + `ContactForm` | DB: settings; posts to `/api/contact` | Messages are stored and emailed via Resend. |
| `/newsletter/*` | `app/newsletter/*` | Subscribers | `noindex`. Confirm and unsubscribe flows. |
| `/github`, `/linkedin`, `/x`… | `app/[slug]/page.tsx` | Hard-coded map | Short links that redirect to social profiles. |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | – | Permanent redirect to `/work/[slug]`. |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | `app/sitemap.ts`, `robots.ts`, `manifest.ts` | DB (sitemap) | Sitemap revalidates hourly. |
| `/opengraph-image`, `/twitter-image` (+ per page) | `opengraph-image.tsx` / `twitter-image.tsx` next to each page | `lib/og.tsx` | See below. |

Shared chrome: `app/layout.tsx` (header, footer, command palette, site-wide JSON-LD for Person + WebSite),
`components/public/Header.tsx` (navigation comes from the `NavigationItem` table), `Footer.tsx`.

## Admin (`/admin`, `noindex`, session-protected by `middleware.ts`)

`app/admin/*` pages call `app/api/admin/*` routes (all require an admin session): projects, articles
(+ newsletter send), experience, now, personality, navigation, settings, subscribers, messages, audit log,
resume, homepage, about. Admin saves write straight to the database.

## Data model (`prisma/schema.prisma`)

`Project`, `Experience`, `Article`, `NowItem`, `PersonalityItem`, `SiteSetting` (key/value), `NavigationItem`,
`ContactMessage`, `Subscriber`, `NewsletterSend`, `AdminUser`, `AuditLog`. List-like fields (`stack`, `metrics`,
`links`, `bullets`, `technologies`, `tags`) are JSON strings.

## SEO and share images

- `lib/seo.ts`: `SITE_URL`, `pageMetadata()` (per-page title/description/canonical/OG/Twitter),
  `fitTitle()` (keeps titles ≤ 60 chars), `clamp()` (descriptions ≤ 160), `breadcrumbJsonLd()`.
- `lib/og.tsx` renders every 1200×630 share image (dark grid, glow, tilted pixel-art avatar from
  `lib/og-avatar.ts`). `OG_PAGES` holds the per-page text. Detail pages build their image from the database in
  `app/work/[slug]/opengraph-image.tsx` and `app/writing/[slug]/opengraph-image.tsx`.
- Structured data: Person + WebSite in `app/layout.tsx`; `CreativeWork` and `BlogPosting` plus breadcrumbs on detail pages.

## Scripts

| Script | Purpose |
|---|---|
| `prisma/seed.ts` | Build a fresh database (`pnpm db:seed`). |
| `prisma/content/prosync.ts` | ProSync experience, projects, order and Now item (shared by seed and sync). |
| `scripts/sync-prosync.ts` | Upsert the ProSync content into a live DB (`pnpm db:sync-prosync`). |
| `scripts/sync-data.ts` | Older one-off sync (Akshta project, availability badge). |
| `scripts/repair-visibility.ts` | Re-list projects hidden by the old admin bug; dry run unless `--yes`. |
| `scripts/change-password.ts` | Change the admin password. |

## Environment variables (`.env.example`)

`DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_DEFAULT_PASSWORD`, `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `CONTACT_NOTIFY_TO`,
`NEWSLETTER_FROM`, `CONTACT_AUTO_ACK`.

## Known legacy files

`components/{Hero,Experience,Projects,Navbar,TechStack,HowIBuild,ResumeSection,Section,ProjectCard,AnimatedHero,ThemeToggle,FadeInSection}.tsx`,
`lib/projects.ts`, `lib/resumePath.ts` and `content/projects/*.mdx` belong to the original scaffold and are not
used by the live pages. They are scheduled for removal.

## Content update flow (today)

1. Edit copy in `/admin` (single items) or in `prisma/content/prosync.ts` (the ProSync block).
2. For a code change, branch per [AGENTS.md](../AGENTS.md), open a PR, merge.
3. Apply content to the live DB only when the owner says so (`pnpm db:sync-prosync`).
