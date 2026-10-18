# Writing plan

Principles: fewer, longer essays (about one a month); general lessons from real work; never a description of an
internal system's secrets (see the content rules in [AGENTS.md](../AGENTS.md)). Every essay is drafted as an
**unpublished** file in `content/site/articles/` (`isPublished: false`), reviewed by Rauhan, then flipped to
`true` and pushed with `pnpm content:push`.

| Month | Essay | Angle | Status |
|---|---|---|---|
| Oct 2026 | Teaching a System to Say "Not Enough Data" | Honest estimates; evidence gating; never show an average as a measurement | Draft in repo |
| Nov 2026 | Moving a Live Product to a New Server and Domain Without Breaking Anyone | Rollback, three messages, keep the old address, inventory dependencies | Draft in repo |
| Dec 2026 | Why Our Builds Kept Crashing the Server | Builds off the serving host; CI deploys; rollback-safe releases | Outline below |
| Jan 2027 | Signed, Idempotent Webhooks Between Two Products | Duplicates, ordering, stable external IDs, dry-run scripts | Outline below |
| Feb 2027 | Building a Desktop App That Works Offline | Local encrypted buffer, safe sync, silent updates | Outline below |
| Mar 2027 | Joining a Company and Shipping Three Products in Two Months | Career / how I work: scope, senior on a two-person team, what I'd do differently | Outline below |

## Outlines

**Why Our Builds Kept Crashing the Server.** Symptom (databases are the first to fall over), the cause (a build using
far more memory than expected on the same host as the databases), the options weighed (build on the server vs a
pipeline), why the pipeline won, how to keep CI cost sane (path filters, branch rules), and rollback as swapping an
artifact.

**Signed, Idempotent Webhooks Between Two Products.** Why "send an event" is the easy half; signatures and replay;
de-duplicating by event ID with a database constraint; keying people on a stable ID instead of email; making a dry run
the default for scripts that touch live data.

**Building a Desktop App That Works Offline.** What "offline" must mean for a work tool; storing records locally,
encrypted, until the server confirms receipt; idempotent sync; staying signed in through flaky networks; updates that
install quietly at a quiet moment.

**Joining a Company and Shipping Three Products in Two Months.** Honest account of ownership: the product I owned
alone, the two I shared as the senior developer, how I decided what to build first, what I automated, what I left
messy on purpose, and what I'd change.

## Checklist before publishing an essay

1. Read it as a stranger: is every term explained? Are there version numbers, exact volumes or vendor names that
   reveal how a proprietary system works? Remove them.
2. Would the employer be comfortable seeing this under a colleague's byline? If not, generalise further.
3. Set `publishedAt`, `isPublished: true`, push, then confirm it in `/feed.xml` and `/sitemap.xml`.
