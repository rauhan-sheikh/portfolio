---
title: What Database Indexing Actually Changed in Our Production Query Times
slug: database-indexing-production-impact
excerpt: >-
  Moving from 2.5-second query timeouts to 280ms response times by analyzing
  query execution plans instead of adding more server RAM.
author: Rauhan Sheikh
publishedAt: '2025-11-04T00:00:00.000Z'
readingTime: 5 min read
tags:
  - PostgreSQL
  - Performance
  - Databases
  - Optimization
isFeatured: false
isPublished: true
coverImage: /articles/indexing.png
---
## The Symptom: Monday Morning Latency

Every Monday morning as 20,000+ students logged in to check semester rosters and class schedules, our API response latencies spiked. The initial reaction from operations was: "Scale the web servers. Add more RAM."

Adding more web servers when your database is sequentially scanning 4 million rows does not solve the problem. It just creates more web servers waiting in line for database locks.

### Running EXPLAIN ANALYZE
Inspecting the execution plan for the slowest endpoint revealed a sequential scan across our main enrollment logs:
```sql
Seq Scan on enrollment_records (cost=0.00..84120.35 rows=21504 width=148)
Filter: ((student_id = $1) AND (academic_term = $2) AND (status = 'ACTIVE'))
```

Because `student_id` alone had poor selectivity for active historical records, a single index on `student_id` still resulted in heavy bitmap heap scans.

### The Fix: Composite Filter Indexing
We created a targeted composite index:
```sql
CREATE INDEX CONCURRENTLY idx_enrollments_student_term_active
ON enrollment_records (student_id, academic_term)
WHERE status = 'ACTIVE';
```

The query plan shifted from a sequential scan taking ~2,480ms to an index-only scan taking **14ms**.

The lesson: You cannot out-scale bad indexing with expensive hardware.
