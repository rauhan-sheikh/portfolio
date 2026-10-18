---
description: Refresh rauhansheikh.com from new work updates (monthly or quarterly). Works on a content/ branch and ends in a PR; never touches production.
argument-hint: "[label, e.g. 2027-01 or 2027-Q1]"
---

You are doing the periodic content refresh of this portfolio. Label for this run: `$ARGUMENTS` (if empty, use the
current `YYYY-MM`). Follow these steps in order and stop to ask when a fact is missing; never guess.

**Read first:** `AGENTS.md` (content rules, branching), `docs/PROJECT_MAP.md`, `docs/UPDATING.md`.

## 1. Preflight
- `git status` must be clean. If not, stop and tell the user.
- `git switch main && git pull`, then `git switch -c content/site-update-<label>`. Never commit to `main`.
- Check `private/update-site.json` exists (groups to read, owner's Teams user id). If missing, explain
  `docs/UPDATING.md` and stop.

## 2. Capture edits made in /admin
- Ask the user to run `pnpm content:pull` with the **live** `DATABASE_URL` (you do not have production access),
  or confirm they already did. Review `git diff content/site` and commit it as
  `content: capture admin edits` so nothing they changed on the live site is lost.

## 3. Pull the new material
- New Teams exports live in `private/teams-exports/` (gitignored). Run
  `pnpm teams:extract private/teams-exports` (add `--since YYYY-MM-DD` to override the cursor).
- Read the generated `private/teams-extract-<date>.md`. These are the owner's own updates only; credential-looking
  messages are already dropped. Do not copy any secret, name, URL or number from it into the repo.

## 4. Draft the changes (apply the content rules strictly)
Work out what is new since the cursor in `content/site/meta.json` and update, in `content/site/`:
- `experience.json`: ProSync bullets, metrics and `resumeBullets` (keep résumé bullets to 4, one page total).
- `projects/*.json`: refresh the three ProSync case studies (MarketBaaz public; Workforce and CRM stay general);
  add a project only if the work is substantial and safe to describe.
- `now.json`: BUILDING and LEARNING from current work; keep the reading, listening and watching list fresh
  (verify every URL returns 200).
- `settings.json`: `snapshot_items`, `resume_summary`, hero text if the story changed.
- `skills.json` / `education.json` when something genuinely changed.
- Writing: append new essay ideas to `docs/WRITING_PLAN.md` (do not publish essays; see `/new-essay`).

Rules of thumb: plain language a stranger understands, no version numbers, no exact data volumes, no internal URLs,
Rauhan is sole engineer on MarketBaaz and senior developer on a two-person team for the rest, BusinessOS stays
low-key. Ask the user about any claim you cannot trace to the extract.

## 4b. Get explicit sign-off
Show a concise summary of every change (old to new for edited text). Ask the user to confirm facts and the
public/private split before continuing.

## 5. Verify
- `pnpm preview` (in-memory DB, http://localhost:3111). Screenshot every changed page at desktop and 375px.
- `npx tsc --noEmit`, `pnpm resume:check` (must be exactly 1 page), `pnpm audit:site http://localhost:3111`.
- Fix anything that fails. Stop the preview when done.

## 6. Wrap up
- `pnpm teams:extract private/teams-exports --mark-done` to move the cursor, then commit
  (`content: refresh <label>`) and push the branch; open a PR with `gh pr create` listing what changed and what
  was verified. **Do not merge. Do not run `content:push` against production.**
- Tell the user the exact follow-up, to be run by them after merging:
  1. `pnpm content:push` (dry run), review, then `pnpm content:push --yes` with the production `DATABASE_URL`.
  2. `pnpm audit:site` against `https://rauhansheikh.com`.
  3. If projects or essays were added: resubmit `https://rauhansheikh.com/sitemap.xml` in Search Console.
