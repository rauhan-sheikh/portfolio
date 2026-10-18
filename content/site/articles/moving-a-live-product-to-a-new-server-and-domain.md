---
title: Moving a Live Product to a New Server and Domain Without Breaking Anyone
slug: moving-a-live-product-to-a-new-server-and-domain
excerpt: >-
  A migration is mostly a communication and rollback problem, not a copying
  problem. What I would do the same way again, and the dependency on the old
  domain that I did not see coming.
author: Rauhan Sheikh
publishedAt: '2026-11-17T00:00:00.000Z'
readingTime: 4 min read
tags:
  - Migrations
  - Infrastructure
  - Releases
  - Reliability
isFeatured: false
isPublished: false
---
## Copying the data is the easy part

When people hear "we are moving the product to a new server and a new domain", they picture the copy: databases, files, environment variables. That part is a checklist. It is tedious but predictable.

The parts that actually hurt are the ones that are *not* in the checklist: the people already using the product, the browser extension installed on their machines, the email links already sitting in their inboxes, and every third-party service that quietly remembers your old address.

I recently moved a live product to new infrastructure and a new domain. Here is what I would repeat, and what surprised me.

## Principle 1: Make every step reversible, and rehearse the reversal

The question I asked at every stage was not "will this work?" but **"how do I undo this in five minutes?"**

For the web app, that meant the old environment stayed intact and untouched until the new one had proven itself. For the browser extension, it meant being ready to publish the previous version again if the new one misbehaved.

That second one is worth saying plainly. When I shipped a faster version of the extension, it did not respond properly in the real world, and I rolled back to the previous version while I investigated. Because the rollback was a known, rehearsed move, it cost minutes rather than a bad afternoon. A rollback you have never practised is a hope, not a plan.

## Principle 2: Tell people three times

Users do not read release notes. They notice when something is gone. So I planned three short messages instead of one:

1. **Before:** what is changing, roughly when, and what they need to do (usually nothing).
2. **During:** a short "we are in the maintenance window now" so nobody thinks it is an outage.
3. **After:** it is done, here is the new address, here is what to check if something looks off.

The first one matters most. A planned change announced in advance is a courtesy. The same change discovered by surprise is an incident, even if the technical result is identical.

## Principle 3: Keep the old front door open

It is tempting to switch the old domain off the moment the new one works. Don't.

People have bookmarks. Installed software points at the old address. Old emails contain old links. If the old domain disappears, all of those break at once, and you will be the one explaining why.

So the old domain kept working in parallel for a long grace period, long enough for the installed clients to update. Only after that window does it make sense to replace it with a **permanent** redirect to the new one. Permanent, not temporary: search engines and browsers treat those very differently, and you only get to do this once.

## The surprise: a dependency on the old address

Here is the part I did not plan for. The payment provider account was registered against the *old* domain. The in-app checkout I had built depended on that domain matching, so after the move it stopped working smoothly, through no fault of the payment code itself.

The fix was a deliberate step backwards: switch to the provider's hosted payment page as a temporary measure, so that customers could keep paying while the new domain was approved, and then restore the smoother in-app experience afterwards. It was less elegant, but it kept the one thing that must never break, taking payments, working.

The lesson I took from it is to **inventory every service that stores your domain** before you start, not after something fails. Payment providers, authentication providers, email senders, analytics, webhooks, OAuth redirects, allowed-origins lists. Each of them is a place where the old address is baked in, and each can fail independently.

## Principle 4: Move builds off the machine that serves traffic

A smaller lesson that came out of the same period: heavy builds and live traffic should not share a machine if you can avoid it. A single build can use more memory than you expect, and when the same box also runs your databases, the databases are the first thing to suffer.

Doing builds in a separate pipeline, and deploying only the finished result, protects the thing that must stay up. It also makes rollback simpler, because you are swapping a finished artifact rather than rebuilding under pressure.

## A checklist I would keep

- Write the **rollback** before the migration, and try it once.
- List **every external service** that knows your old domain or IP address.
- Send **three** messages: before, during, after.
- Keep the **old address alive** well past the point you think you need to.
- Use a **permanent** redirect only after clients have moved.
- Keep **builds** away from the machine that serves users.

A migration that goes well is almost invisible. That is the aim: the best compliment is that nobody noticed.
