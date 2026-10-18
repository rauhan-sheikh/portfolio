# Editing guide: where to change what

All paths are in `content/site/` unless noted. For how a change goes live, see the last section. The route-to-file
map is in [PROJECT_MAP.md](PROJECT_MAP.md); the periodic routine is in [UPDATING.md](UPDATING.md).

## Résumé (PDF and `/resume`)

| I want to change | Open | Field |
|---|---|---|
| Summary paragraph | `settings.json` | `resume_summary` |
| Location line | `settings.json` | `resume_location` |
| Phone number on or off | **Admin → Resume** (stored in the database only) | |
| Bullets under a job (max 4 to stay on one page) | `experience.json` | that role's `resumeBullets` |
| Bullets shown on the website for a job | `experience.json` | `bullets` |
| "Tech Stack" line under a job | `experience.json` | `technologies` (the first 10 are used) |
| Dates, title, company | `experience.json` | `startDate`, `endDate`, `role`, `company` |
| Hide a job from the résumé | `experience.json` | `showOnResume: false` |
| Order of jobs | `experience.json` | `order` (1 = top) |
| **Selected Projects** list | `projects/<slug>.json` | `showOnResume: true` includes a project |
| One-line text for that project | `projects/<slug>.json` | `resumeBlurb` |
| Skills groups | `skills.json` | |
| Education | `education.json` | |
| PDF look (fonts, spacing, section order) | `components/resume/ResumeDocument.tsx` | |

The PDF and the web page read the same data, so one edit changes both. Run `pnpm resume:check` after any résumé
edit: it fails if the PDF grows past one page.

## Website content

| Page or section | Open |
|---|---|
| Homepage hero line and bio | `settings.json` → `site_tagline`, `site_bio` |
| Homepage Snapshot card | `settings.json` → `snapshot_items`, `snapshot_stack` |
| Show or hide a homepage section | `settings.json` → `section_*_enabled` (`"true"` or `"false"`) |
| "Open to opportunities" badge | `settings.json` → `availability_badge`, `availability_active` |
| Email, GitHub, LinkedIn and X links | `settings.json` → `email`, `github_url`, `linkedin_url`, `twitter_url` |
| A project (text, tags, numbers, case study, order, visibility) | `projects/<slug>.json` |
| Experience page | `experience.json` |
| /now (building, learning, links) | `now.json` (retire an item with `isActive: false`) |
| Essays | `articles/<slug>.md` (`isPublished: false` keeps it a draft) |
| "How I think" cards on About | `personality.json` |
| Header menu | `navigation.json` |

## Things that are not in `content/site/`

| What | Where |
|---|---|
| About page story and Quick Facts | `app/about/page.tsx` |
| Contact page text | `app/contact/page.tsx` |
| Footer text and links | `components/public/Footer.tsx` |
| Hero subtitle ("Software Developer · Backend & Distributed Systems") | `app/page.tsx` and `app/resume/page.tsx` |
| Each page's browser title and search description | the `pageMetadata({...})` block at the top of each `app/<page>/page.tsx` |
| Share-image text and design | `lib/og.tsx` (text for each page is in `OG_PAGES`) |
| The two diagram stories on the homepage | `components/public/TeamsArchitectureStory.tsx`, `BulkEmailArchitectureStory.tsx` |

## Project file fields

`projects/<slug>.json`: `title`, `slug`, `category`, `year`, `shortDesc` (the card and search text),
`longDesc`, `status` (`PUBLISHED` shows publicly; `DRAFT`, `PRIVATE` and `ARCHIVED` do not), `isFeatured`, `order`,
`projectMark` (the small tag on the card), `liveUrl`, `githubUrl`, the case-study blocks (`theProblem`,
`theMessyPart`, `architecture`, `technicalDecisions`, `whatIdChange`, `fullContent` as Markdown), `stack` (tags),
`metrics` (`label`, `value`, `description`), `links`, `showOnHome`, `showInWork`, `showOnResume`, `resumeBlurb`.

## How a change goes live

1. If you edited anything in `/admin`, run `pnpm content:pull` first so those edits land in the files.
2. Edit the file, then run `pnpm preview` and open `http://localhost:3111`.
3. Work on a branch (for example `content/…`), open a PR, merge it.
4. Run `pnpm content:push`, check what it lists, then `pnpm content:push --yes` (with the production
   `DATABASE_URL`).

For a quick one-line fix you can edit in `/admin` instead. It goes live immediately; run `pnpm content:pull`
afterwards so the files don't drift.
