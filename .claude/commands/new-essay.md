---
description: Draft a new essay as an unpublished Markdown file on its own branch, following the writing plan and content rules.
argument-hint: "<topic or title>"
---

Draft one essay about: `$ARGUMENTS`.

1. Read `AGENTS.md` (content rules), `docs/WRITING_PLAN.md` and one or two existing files in
   `content/site/articles/` to match voice (first person, plain, short paragraphs, `##` headings).
2. `git status` must be clean. `git switch main && git pull && git switch -c content/essay-<kebab-slug>`.
3. If the topic needs facts you do not have (what happened, when, what changed), ask the user first. Never invent
   incidents or numbers.
4. Create `content/site/articles/<slug>.md` with front matter: `title`, `slug`, `excerpt` (about 160 characters,
   a real hook), `author: Rauhan Sheikh`, `publishedAt` (planned date, ISO), `readingTime` (about 220 words per
   minute), `tags`, `isFeatured: false`, `isPublished: false`, and an optional `seoTitle` (keep titles under
   60 characters).
5. Aim for a long, useful essay (about 1,200 to 2,000 words): a concrete opening, three to five lessons, honest
   trade-offs, a closing test or checklist. General lessons only, no internal system secrets, no version numbers.
6. Run `pnpm preview` and check the file seeds without errors. Unpublished essays are not listed; to eyeball the
   layout, set `isPublished: true` temporarily in the preview data, then revert it.
7. Update the status column in `docs/WRITING_PLAN.md`, commit, push, and open a PR. Do not publish.
