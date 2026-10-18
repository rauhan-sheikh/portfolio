# Updating the site (monthly or quarterly)

The short version: in Claude Code, from the repo root, run

```
/update-site 2027-Q1
```

It creates a `content/site-update-…` branch, reads your new Teams updates, drafts the changes, shows them to you,
previews and checks the site, and opens a pull request. **It never touches production.** After you merge, you run
two commands yourself (below).

## One-time setup

1. `pnpm install` (`pnpm preview` then works with no database).
2. Create `private/update-site.json` (gitignored; already created on this machine):

   ```json
   {
     "myUserId": "8:live:.cid.xxxxxxxx",
     "groups": [
       { "label": "Software Development (team group)", "id": "19:...@thread.v2" },
       { "label": "Updates to leadership (private group)", "id": "19:...@thread.v2" }
     ],
     "minLength": 120
   }
   ```

   `myUserId` is the `userId` at the top of the Teams export. Group ids are each conversation's `id` in the export.
3. Save each new Teams export under `private/teams-exports/` (gitignored; exports contain private chats and
   credentials and must never be committed).

## What each step uses

| Step | Command | Notes |
|---|---|---|
| Capture admin edits | `pnpm content:pull` | You run it with the live `DATABASE_URL`. Keeps edits made in `/admin`. |
| Extract your updates | `pnpm teams:extract private/teams-exports` | Only your messages, only the listed groups, newer than the cursor in `content/site/meta.json`; anything that looks like a credential is dropped. |
| Preview | `pnpm preview` | In-memory database seeded from `content/site`; `http://localhost:3111`. |
| Checks | `pnpm resume:check`, `pnpm audit:site <url>`, `npx tsc --noEmit` | The résumé must be one page; the audit checks titles, canonicals, OG tags, JSON-LD and the sitemap. |

## After you merge the PR (you run these)

```bash
pnpm content:push          # dry run: lists what would change
pnpm content:push --yes    # applies it to the database in DATABASE_URL
pnpm audit:site            # checks https://rauhansheikh.com
```

If projects or essays were added, resubmit `https://rauhansheikh.com/sitemap.xml` in Google Search Console.

## Résumé

The PDF at `/resume.pdf` is generated from the same data as `/resume`. To give someone your phone number, use
**Admin, Resume, Download PDF with phone number** (admin only), or turn "Show the phone number" on briefly,
download, and turn it off. The number lives only in the database.

## Essays

`/new-essay "<topic>"` drafts an unpublished essay on its own branch. To publish: set `isPublished: true`, merge,
then `pnpm content:push --yes`. Cadence and ideas are in `WRITING_PLAN.md`.
