---
title: Why I Moved Bulk Email Processing From the Browser to BullMQ
slug: bulk-email-bullmq-architecture
excerpt: >-
  If an operation takes 1,500 requests and the UI tells the user 'Please do not
  close this browser tab', that is not a feature — it's an architectural
  vulnerability.
author: Rauhan Sheikh
publishedAt: '2025-03-15T00:00:00.000Z'
readingTime: 5 min read
tags:
  - Architecture
  - Redis
  - BullMQ
  - Node.js
  - Queues
isFeatured: true
isPublished: true
coverImage: /articles/bullmq.png
---
## The Anatomy of a Fragile System

A year ago, an operational tool in our stack allowed coordinators to send important course announcements to up to 1,500 students at a time.

The way it was originally built looked sensible on paper to whoever wrote it:
The client UI made an HTTP POST to send an email for row 1. Then row 2. Then row 3. In a JavaScript `for` loop in the browser.

### What actually happened in practice:
1. At email #340, the employee's laptop screen went to sleep. The browser suspended background timers.
2. At email #712, a Wi-Fi fluctuation dropped the connection. The loop crashed with an unhandled rejection.
3. The coordinator reloaded the page, hit "Send All" again, and the first 712 students received duplicate emails while the coordinator scrambled to cancel the rest.

### Moving Work Where It Belongs
The browser is an untrusted, transient client. Work that takes more than 1 second must never depend on the client remaining alive.

By introducing **Redis** and **BullMQ**:
- The browser submits the campaign request once.
- The API validates inputs and atomically enqueues 1,500 jobs in Redis.
- The HTTP response returns `202 Accepted` in under 50 milliseconds.
- Background worker processes pick up jobs, respect rate limits, and automatically handle retries with jitter.

The coordinator can literally close their laptop and walk out of the office. The job completes with 100% certainty.
