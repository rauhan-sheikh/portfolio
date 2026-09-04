import { PrismaClient, Role, ProjectCategory, ProjectStatus, NowCategory, PersonalityCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Admin User
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "adminpassword123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@rauhansheikh.com" },
    update: {
      name: "Rauhan Sheikh",
    },
    create: {
      email: "admin@rauhansheikh.com",
      name: "Rauhan Sheikh",
      password: hashedPassword,
      role: Role.OWNER,
    },
  });
  console.log(`✓ Admin user configured: ${admin.email}`);

  // 2. Projects
  const projectsData = [
    {
      title: "BusinessOS",
      slug: "business-os",
      category: ProjectCategory.PERSONAL,
      year: "2024–2026",
      shortDesc: "Commercial-grade financial operating system for SMEs with ledger-first accounting, immutable transaction journals, integer minor-unit money calculations, and multi-tenant audit logs.",
      longDesc: "BusinessOS was built from the ground up to solve the core integrity problems found in traditional SME software: rounding errors from floating-point arithmetic, un-audited state mutations, and fragile balance recalculations. Built on Next.js, PostgreSQL, Prisma, and Redis.",
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
      order: 1,
      coverImage: "/projects/business-os.png",
      accentColor: "#3b82f6",
      projectMark: "BOS",
      liveUrl: "https://businessos.rauhansheikh.com",
      githubUrl: "https://github.com/rauhan-sheikh/BusinessOS",
      theProblem: "Standard invoicing and accounting tools for SMEs frequently use floating-point math for calculations or mutate transaction rows directly in the database. When a refund or correction occurs, past audit trails are overwritten. Reconciling discrepancies at month-end becomes an impossible forensic nightmare.",
      theMessyPart: "Handling multi-currency transactions and fractional cent tax distributions without floating-point drift. Every monetary value is stored as an integer representing the smallest currency unit (cents/paise) with BigInt in Prisma. Rounding remainders must be deterministically allocated to balancing line items rather than swallowed.",
      architecture: "Dual-entry ledger pattern where every transaction consists of at least two balancing entries. Balances are derived from snapshot aggregates and immutable event streams. Redis is used for idempotent request locking to prevent double-submitting invoices or chargebacks.",
      technicalDecisions: "1. Storing amounts as BigInt integers in smallest currency unit (cents/paise) to guarantee arithmetic correctness.\n2. Strict append-only journal: balance changes are never updated, only reversed or augmented by balancing entries.\n3. Row-level tenant isolation baked into query middleware.\n4. Distributed Redis locks for idempotency on payment and invoice webhooks.",
      whatIdChange: "I would incorporate event sourcing with an append-only log earlier in the design instead of relying partly on relational table triggers for audit trails.",
      fullContent: `## Why Another Business Tool?

Most accounting software for small businesses treats accounting like an editable spreadsheet. If an invoice amount was recorded incorrectly, an admin clicks "Edit" and updates the number.

In real financial systems, this is catastrophic. It breaks audit trails, obscures forensic timelines, and creates unaccountable balances.

**BusinessOS was architected with one non-negotiable rule:**
> Money does not update. Money only moves.

### Core Architectural Pillars

1. **Integer Minor-Unit Math**: Every balance and line item is stored in minor currency units (e.g. ₹100.50 is stored as \`10050\` BigInt). No JavaScript float rounding quirks.
2. **Double-Entry Journal**: Debits must always equal Credits. Every transaction is a balanced compound entry.
3. **Idempotent Webhooks**: Payment gateways emit retries. BusinessOS locks incoming transaction tokens in Redis with an atomic TTL to prevent duplicate ledger postings.
4. **Tenant Isolation**: Clean multi-tenancy enforced at the database layer with cryptographic workspace segregation.`,
      stack: JSON.stringify(["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Redis", "Tailwind CSS", "Node.js"]),
      metrics: JSON.stringify([
        { label: "Ledger", value: "Integer Minor-Units", description: "Zero floating-point rounding errors via BigInt" },
        { label: "Integrity", value: "100% Immutable", description: "Corrections require explicit reversal journal entries" },
        { label: "Tenancy", value: "Multi-Tenant", description: "Row-level tenant isolation across all ledger queries" },
      ]),
      links: JSON.stringify([
        { label: "GitHub Repo", url: "https://github.com/rauhan-sheikh/BusinessOS" },
        { label: "Live Demo", url: "https://businessos.rauhansheikh.com" },
      ]),
      showOnHome: true,
      showInWork: true,
    },
    {
      title: "Microsoft Teams & Calendar Engine",
      slug: "microsoft-teams-engine",
      category: ProjectCategory.PROFESSIONAL,
      year: "2024–2025",
      shortDesc: "Hiding deep Microsoft Graph API complexity behind an automated calendar & meeting sync engine for 20K+ EdTech users.",
      longDesc: "Microsoft Graph presented an awkward conflict between calendar visibility and required meeting configuration. By orchestrating a multi-step backend resolution flow, faculty members experienced seamless 1-click meeting schedules without needing to understand Microsoft API idiosyncrasies.",
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
      order: 2,
      coverImage: "/projects/teams-sync.png",
      accentColor: "#6366f1",
      projectMark: "MS-GRAPH",
      liveUrl: "",
      githubUrl: "",
      theProblem: "Graph API's onlineMeeting creation endpoint created meetings that did not appear on users' Outlook calendars, whereas creating a calendar event did not allow granular meeting configuration (waiting rooms, attendee permissions, recording policies). Faculty had to either manually configure meetings or paste links across different screens.",
      theMessyPart: "Microsoft Graph doesn't immediately return the online meeting ID from a calendar event creation. The backend had to create the calendar event with isOnlineMeeting: true, extract the joinWebUrl, decode the meeting coordinates, resolve the hidden meeting ID, and patch the online meeting settings asynchronously before delivering the meeting link to the LMS.",
      architecture: "Create Calendar Event -> Extract Join Web URL -> Resolve Online Meeting ID -> Patch Meeting Settings & Permissions -> Return Uniform LMS Object. Retries with exponential backoff on Graph throttling (429).",
      technicalDecisions: "1. Orchestrated asynchronous sequence that masks 4 distinct Graph API calls into a single synchronous response to the frontend.\n2. In-memory caching of delegated and application OAuth tokens in Redis with proactive refresh 5 minutes prior to expiry.\n3. Automatic exponential backoff jitter on Microsoft Graph 429 rate-limiting spikes.",
      whatIdChange: "Would implement a webhook listener for Microsoft Graph change notifications earlier to catch edge cases where meetings were modified or cancelled directly in Outlook by instructors.",
      fullContent: `## The Hidden Complexity of Microsoft Graph

When building lecture scheduling for over 20,000 active students, instructors needed scheduled meetings to appear directly on their corporate Outlook calendars while simultaneously adhering to strict academic permissions:
- Muted attendee microphones by default
- Restricted screen sharing
- Automatic cloud recording enabled
- Waiting room bypass for enrolled students only

### The API Conflict
- If you call \`/me/onlineMeetings\`, you get granular meeting controls, but **no Outlook calendar event is created**.
- If you call \`/me/events\` with \`isOnlineMeeting: true\`, an event is placed on the calendar, but the response **does not provide granular meeting policy controls**.

### The Solution: Multi-Step Resolution Pipeline
We designed an automated backend orchestrator:
1. Dispatch \`POST /me/events\` with online meeting flags.
2. Intercept the generated \`joinWebUrl\` from the response.
3. Parse the thread coordinate identifiers and resolve the underlying \`onlineMeeting\` record.
4. Issue a subsequent \`PATCH /me/onlineMeetings/{id}\` configuring attendance reports, lobby rules, and recording locks.
5. Return a clean, unified lecture entity to the LMS frontend.

The user saw a single "Schedule Class" button and a 400ms turnaround. All complexity was absorbed by the backend.`,
      stack: JSON.stringify(["Node.js", "Express", "Microsoft Graph API", "TypeScript", "PostgreSQL", "Redis"]),
      metrics: JSON.stringify([
        { label: "Active Users", value: "20K+", description: "Students and faculty seamlessly scheduled" },
        { label: "Manual Effort", value: "Zero", description: "Eliminated manual link pasting & permissions config" },
        { label: "Reliability", value: "99.9%", description: "Resilient token handling and rate-limit recovery" },
      ]),
      links: JSON.stringify([]),
      showOnHome: true,
      showInWork: true,
    },
    {
      title: "Bulk Email Engine (Redis / BullMQ)",
      slug: "bulk-email-engine",
      category: ProjectCategory.PROFESSIONAL,
      year: "2024–2025",
      shortDesc: "Asynchronous high-volume email delivery architecture replacing fragile browser-dependent API loops with resilient Redis/BullMQ worker queues.",
      longDesc: "Transformed an operational bottleneck where sending 1,500 campaign emails required an employee to keep their browser tab open, with frequent partial failures and zero retry semantics, into an autonomous, resilient background queue system.",
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
      order: 3,
      coverImage: "/projects/bullmq-email.png",
      accentColor: "#f59e0b",
      projectMark: "BULLMQ",
      liveUrl: "",
      githubUrl: "",
      theProblem: "The original implementation made HTTP requests sequentially from the browser client in a loop: Browser -> API -> Email Service. If the employee closed their laptop, had a network hiccup, or hit rate limits on email #480, the campaign died midway. Resending resulted in duplicate emails to the first 480 recipients.",
      theMessyPart: "Database state management during partial queue runs. When a worker dies or an email bounces, the recipient status in the database needed atomic locking to avoid race conditions between parallel worker threads.",
      architecture: "Browser pushes batch payload to API -> API validates and enqueues jobs to Redis via BullMQ -> Decoupled background workers consume jobs with rate limiting and exponential retry strategies -> Worker publishes completion events via WebSockets to admin dashboard.",
      technicalDecisions: "1. Transitioned campaign initiation to an immediate 202 Accepted response that pushes jobs to BullMQ.\n2. Configured exponential backoff with jitter on SMTP rate limit errors.\n3. Chunked dispatch to respect email provider concurrency boundaries (50 parallel jobs max).\n4. Atomic job deduplication using Redis keys based on campaignId:recipientId.",
      whatIdChange: "Add dead-letter queue (DLQ) automated replay UI directly into the admin dashboard from day one.",
      fullContent: `## The Problem Wasn't Sending Emails. The Problem Was Where the Work Lived.

If an operation requires processing 1,500 records and someone tells the user:
> "Please do not close this browser tab until the progress bar reaches 100%"

...that is not an operation. That is an architectural flaw.

### Before: The Client-Tied Loop
\`\`\`text
Browser (Loop) ──HTTP──> API ──SMTP──> Provider
      │
(User closes laptop at 32%)
      │
      ▼
Campaign halts. 480 sent, 1020 lost. Re-run causes duplicates.
\`\`\`

### After: Decoupled Queue Architecture
\`\`\`text
Browser ──HTTP (Single Batch)──> API ──Push Job──> Redis (BullMQ)
                                                         │
                                               ┌─────────┴─────────┐
                                               ▼                   ▼
                                           Worker 1            Worker 2
                                               │                   │
                                               ▼                   ▼
                                            Provider            Provider
\`\`\`

With workers processing asynchronously in Docker containers, the user can immediately close their laptop, take a train, or shut down their workstation. The work continues reliably, failures retry with exponential backoff, and idempotency guarantees that no student receives duplicate correspondence.`,
      stack: JSON.stringify(["Node.js", "BullMQ", "Redis", "TypeScript", "Express", "Docker"]),
      metrics: JSON.stringify([
        { label: "Failure Rate", value: "< 0.05%", description: "From ~30% browser drops down to near zero" },
        { label: "Batch Scale", value: "1,500+ / campaign", description: "Autonomous asynchronous background batches" },
        { label: "Operator Time", value: "100% Freed", description: "Fire-and-forget submission with real-time job status" },
      ]),
      links: JSON.stringify([]),
      showOnHome: true,
      showInWork: true,
    },
    {
      title: "Second Brain",
      slug: "second-brain",
      category: ProjectCategory.PERSONAL,
      year: "2023–2024",
      shortDesc: "Personal knowledge management app for saving, organizing, and sharing technical links, notes, and research papers.",
      longDesc: "A high-speed bookmarking and knowledge curation platform designed for developers. Features tag hierarchies, full-text search, reading list priorities, and instant link preview extraction.",
      status: ProjectStatus.PUBLISHED,
      isFeatured: false,
      order: 4,
      coverImage: "/projects/second-brain.png",
      accentColor: "#10b981",
      projectMark: "BRAIN",
      liveUrl: "https://secondbrain.rauhansheikh.com",
      githubUrl: "https://github.com/rauhan-sheikh/Second-Brain-Frontend",
      theProblem: "Modern developers read hundreds of articles, repositories, and docs a month. Browser bookmarks are a graveyard where links go to be forgotten without metadata, context, or searchable tag associations.",
      theMessyPart: "Scraping Open Graph tags and page titles from arbitrary URLs that employ aggressive bot detection or client-side SPA rendering.",
      architecture: "React frontend communicating with an Express / Node.js API with MongoDB document storage. Metadata scraper extracts OG tags in the background on link insertion.",
      technicalDecisions: "1. Fast indexing of tags and text fields for instant search-as-you-type.\n2. Clean responsive UI with quick keyboard navigation.\n3. Public shareable collections for curated topics.",
      whatIdChange: "Migrate MongoDB to PostgreSQL with pgvector for semantic search and vector embeddings.",
      fullContent: `## A Digital Knowledge Repository

Second Brain was built to solve personal bookmark rot. It allows developers to quickly capture URLs, auto-extract previews, associate hierarchical tags, and search notes with sub-100ms latency.`,
      stack: JSON.stringify(["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "TypeScript"]),
      metrics: JSON.stringify([
        { label: "Search Latency", value: "< 80ms", description: "Fast indexing and retrieval" },
        { label: "Categorization", value: "Tags & Collections", description: "Hierarchical topic categorization" },
      ]),
      links: JSON.stringify([
        { label: "Frontend Repo", url: "https://github.com/rauhan-sheikh/Second-Brain-Frontend" },
        { label: "Backend Repo", url: "https://github.com/rauhan-sheikh/Second-Brain-Backend" },
        { label: "Live Demo", url: "https://secondbrain.rauhansheikh.com" },
      ]),
      showOnHome: true,
      showInWork: true,
    },
    {
      title: "College Vidya EdTech Platforms",
      slug: "college-vidya-lms",
      category: ProjectCategory.PROFESSIONAL,
      year: "2024–2026",
      shortDesc: "Large-scale EdTech LMS & ERP modules serving 20K+ active students across academic delivery, student portals, and enrollment workflows.",
      longDesc: "Architected, expanded, and optimized core student-facing and administrative portals. Designed secure role-based access control, streamlined cohort reporting, and reduced peak query load by 9×.",
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
      order: 5,
      coverImage: "/projects/college-vidya.png",
      accentColor: "#0ea5e9",
      projectMark: "EDTECH",
      liveUrl: "https://collegevidya.com",
      githubUrl: "",
      theProblem: "Rapid growth in student enrollment caused significant database contention during semester start periods. Heavy analytical reporting queries timed out while student login and lecture viewing were sluggish.",
      theMessyPart: "Refactoring legacy unindexed relational queries across tables with millions of academic event records without taking down the production system.",
      architecture: "PostgreSQL with optimized composite indexes, Node.js / Express API services, React & Next.js frontend interfaces, Redis query cache for high-frequency course catalogs.",
      technicalDecisions: "1. Created targeted composite indexes on (student_id, course_id, status) reducing table scans.\n2. Streamed large CSV exports using Node.js streams to lower RAM usage by 72%.\n3. Implemented Redis caching for high-read, low-write academic metadata.",
      whatIdChange: "Introduce read-replicas for internal operational dashboards earlier to isolate analytical query load from student transactional traffic.",
      fullContent: `## Engineering at EdTech Scale

Serving 20,000+ daily active learners requires zero tolerance for sluggish endpoints or downtime during peak live lecture hours.

### Key Deliverables
- **Role-Based Access Control (RBAC)**: Secure authorization across students, faculties, academic advisors, and administrative superusers.
- **Reporting Optimization**: Re-engineered unindexed reporting joins that were locking tables; reduced peak query duration from 2.5 seconds to ~280ms.
- **Streaming Exports**: Converted in-memory array aggregation of 100K+ rows to streaming Node.js pipelines, cutting server RAM consumption by 72%.`,
      stack: JSON.stringify(["React", "Next.js", "Node.js", "PostgreSQL", "Prisma", "Redis", "TypeScript"]),
      metrics: JSON.stringify([
        { label: "Active Students", value: "20K+", description: "Daily active learners across programs" },
        { label: "Query Speed", value: "9× Faster", description: "Targeted composite indexing on heavy cohort queries" },
        { label: "RAM Savings", value: "72%", description: "Streamed CSV report generation pipelines" },
      ]),
      links: JSON.stringify([
        { label: "Company Portal", url: "https://collegevidya.com" },
      ]),
      showOnHome: true,
      showInWork: true,
    },
  ];

  for (const p of projectsData) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✓ Seeded ${projectsData.length} projects`);

  // 3. Experience
  const experienceData = [
    {
      company: "ProSync Infotech",
      role: "Software Developer",
      location: "India",
      startDate: "2026",
      endDate: "Present",
      isCurrent: true,
      description: "Architecting enterprise software solutions, focusing on backend performance, distributed systems, and robust web applications.",
      bullets: JSON.stringify([
        "Designing and developing high-throughput microservices and APIs with TypeScript and Node.js.",
        "Collaborating with clients and product leadership to translate complex domain specifications into scalable software.",
        "Championing database indexing strategies and query optimizations across PostgreSQL databases.",
      ]),
      technologies: JSON.stringify(["TypeScript", "Node.js", "PostgreSQL", "Next.js", "Docker", "Redis"]),
      metrics: JSON.stringify([
        { label: "Focus", value: "Enterprise Architecture" },
        { label: "Stack", value: "Node.js · PostgreSQL · Next.js" },
      ]),
      linkedProjects: JSON.stringify(["business-os"]),
      order: 1,
    },
    {
      company: "Blackboard E-Learning Pvt Ltd (College Vidya)",
      role: "Software Developer & Associate Manager",
      location: "India",
      startDate: "May 2024",
      endDate: "April 2026",
      isCurrent: false,
      description: "Led engineering initiatives for EdTech platforms serving 20,000+ active students across LMS, ERP, and operational portals.",
      bullets: JSON.stringify([
        "Spearheaded the Microsoft Teams Graph API integration, automating meeting generation and calendar event synchronization for 20K+ learners.",
        "Re-architected bulk communication infrastructure from browser-dependent loops to Redis/BullMQ worker queues, eliminating dropouts.",
        "Optimized heavy database queries across student records, reducing peak query times from 2.5s to under 300ms.",
        "Promoted to Associate Manager, mentoring junior developers and coordinating cross-functional sprints across engineering, academic, and operations teams.",
      ]),
      technologies: JSON.stringify(["Node.js", "Express", "React", "Next.js", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Microsoft Graph API"]),
      metrics: JSON.stringify([
        { label: "Active Scale", value: "20K+ Students" },
        { label: "Query Speed", value: "9× Improvement" },
        { label: "RAM Savings", value: "72% Reduction" },
      ]),
      linkedProjects: JSON.stringify(["microsoft-teams-engine", "bulk-email-engine", "college-vidya-lms"]),
      order: 2,
    },
    {
      company: "Freelance Web Developer",
      role: "Full Stack Engineer",
      location: "Remote",
      startDate: "2023",
      endDate: "2024",
      isCurrent: false,
      description: "Delivered custom web applications and business systems for independent clients and emerging businesses.",
      bullets: JSON.stringify([
        "Built end-to-end bespoke web applications with Next.js, Node.js, and relational databases.",
        "Handled entire lifecycle: client discovery, system architecture, database modeling, UI implementation, deployment, and ongoing support.",
        "Delivered clean, maintainable code with high Lighthouse performance and SEO scores.",
      ]),
      technologies: JSON.stringify(["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"]),
      metrics: JSON.stringify([
        { label: "Delivery", value: "End-to-End" },
        { label: "Performance", value: "95+ Lighthouse" },
      ]),
      linkedProjects: JSON.stringify(["second-brain"]),
      order: 3,
    },
  ];

  for (const exp of experienceData) {
    const existing = await prisma.experience.findFirst({
      where: { company: exp.company, role: exp.role },
    });
    if (existing) {
      await prisma.experience.update({ where: { id: existing.id }, data: exp });
    } else {
      await prisma.experience.create({ data: exp });
    }
  }
  console.log(`✓ Seeded ${experienceData.length} experience entries`);

  // 4. Articles
  const articlesData = [
    {
      title: "Why I Moved Bulk Email Processing From the Browser to BullMQ",
      slug: "bulk-email-bullmq-architecture",
      excerpt: "If an operation takes 1,500 requests and the UI tells the user 'Please do not close this browser tab', that is not a feature — it's an architectural vulnerability.",
      coverImage: "/articles/bullmq.png",
      publishedAt: new Date("2025-03-15"),
      readingTime: "5 min read",
      tags: JSON.stringify(["Architecture", "Redis", "BullMQ", "Node.js", "Queues"]),
      isFeatured: true,
      isPublished: true,
      content: `## The Anatomy of a Fragile System

A year ago, an operational tool in our stack allowed coordinators to send important course announcements to up to 1,500 students at a time.

The way it was originally built looked sensible on paper to whoever wrote it:
The client UI made an HTTP POST to send an email for row 1. Then row 2. Then row 3. In a JavaScript \`for\` loop in the browser.

### What actually happened in practice:
1. At email #340, the employee's laptop screen went to sleep. The browser suspended background timers.
2. At email #712, a Wi-Fi fluctuation dropped the connection. The loop crashed with an unhandled rejection.
3. The coordinator reloaded the page, hit "Send All" again, and the first 712 students received duplicate emails while the coordinator scrambled to cancel the rest.

### Moving Work Where It Belongs
The browser is an untrusted, transient client. Work that takes more than 1 second must never depend on the client remaining alive.

By introducing **Redis** and **BullMQ**:
- The browser submits the campaign request once.
- The API validates inputs and atomically enqueues 1,500 jobs in Redis.
- The HTTP response returns \`202 Accepted\` in under 50 milliseconds.
- Background worker processes pick up jobs, respect rate limits, and automatically handle retries with jitter.

The coordinator can literally close their laptop and walk out of the office. The job completes with 100% certainty.`,
    },
    {
      title: "Building a Financial Ledger Without Floating-Point Money",
      slug: "financial-ledger-integer-units",
      excerpt: "Why storing currency in floats will inevitably corrupt your accounting, and how we architected BusinessOS around integer minor units and BigInt.",
      coverImage: "/articles/ledger.png",
      publishedAt: new Date("2025-06-20"),
      readingTime: "7 min read",
      tags: JSON.stringify(["Fintech", "PostgreSQL", "Prisma", "Databases", "Accounting"]),
      isFeatured: true,
      isPublished: true,
      content: `## The IEEE 754 Trap

Open your browser console and type:
\`\`\`js
0.1 + 0.2 === 0.3
// false: 0.30000000000000004
\`\`\`

Everyone knows this as a funny trivia question. But when you are calculating tax splits across a multi-item purchase order, that tiny four at the end becomes a real discrepancy on a balance sheet.

### Minor Units Are Not An Option; They Are The Rule
In **BusinessOS**, no floating-point number is ever allowed to represent monetary amounts.
- \$19.99 is stored as \`1999\`
- ₹1,500.50 is stored as \`150050\`
- Quantities are stored as exact integers or fixed-precision ratios.

### Handling Division & Remainder Distribution
What happens when you divide ₹100.00 among three parties?
\`\`\`text
10000 / 3 = 3333 with 1 remainder
\`\`\`
If you truncate: each party gets 3333 paise (total 9999). You lost 1 paisa.
If you round up: total becomes 10002. You invented 2 paise out of thin air.

In double-entry bookkeeping, the ledger **must balance to zero**. We implemented deterministic remainder allocation: the leftover units are distributed sequentially to the highest-weighted balancing entries. Every single unit is accounted for.`,
    },
    {
      title: "Hiding System Complexity Behind Microsoft Graph API",
      slug: "microsoft-graph-api-calendar-meetings",
      excerpt: "How a 4-step backend orchestration masked Microsoft Graph's strange separation between calendar events and online meeting policies.",
      coverImage: "/articles/graph.png",
      publishedAt: new Date("2025-09-10"),
      readingTime: "6 min read",
      tags: JSON.stringify(["APIs", "Microsoft Graph", "Integration", "Backend"]),
      isFeatured: false,
      isPublished: true,
      content: `## A Tale of Two Endpoints

If you have ever integrated Microsoft 365 or Teams into an enterprise application, you have likely encountered the peculiar disconnect between:
- \`/me/events\` (The user's Outlook calendar)
- \`/me/onlineMeetings\` (The Teams audio/video infrastructure)

For our academic portal, lecturers needed scheduled classes to appear on their corporate calendars so they didn't miss lectures, but our safety policies required restricting attendee screen-sharing and auto-recording sessions.

Microsoft Graph did not provide a single endpoint that satisfied both needs simultaneously.

### The Orchestration
Instead of leaking this complexity to the UI or asking lecturers to configure meetings twice, we engineered an asynchronous pipeline that:
1. Created the calendar event.
2. Extracted the opaque join URL coordinates.
3. Decoded and queried the underlying online meeting entity.
4. Patched permissions, lobby controls, and recording parameters.
5. Returned a unified representation to the LMS.

Good software engineering is often about absorbing awkward third-party impedance mismatches so the human at the keyboard never has to think about them.`,
    },
    {
      title: "What Database Indexing Actually Changed in Our Production Query Times",
      slug: "database-indexing-production-impact",
      excerpt: "Moving from 2.5-second query timeouts to 280ms response times by analyzing query execution plans instead of adding more server RAM.",
      coverImage: "/articles/indexing.png",
      publishedAt: new Date("2025-11-04"),
      readingTime: "5 min read",
      tags: JSON.stringify(["PostgreSQL", "Performance", "Databases", "Optimization"]),
      isFeatured: false,
      isPublished: true,
      content: `## The Symptom: Monday Morning Latency

Every Monday morning as 20,000+ students logged in to check semester rosters and class schedules, our API response latencies spiked. The initial reaction from operations was: "Scale the web servers. Add more RAM."

Adding more web servers when your database is sequentially scanning 4 million rows does not solve the problem. It just creates more web servers waiting in line for database locks.

### Running EXPLAIN ANALYZE
Inspecting the execution plan for the slowest endpoint revealed a sequential scan across our main enrollment logs:
\`\`\`sql
Seq Scan on enrollment_records (cost=0.00..84120.35 rows=21504 width=148)
Filter: ((student_id = $1) AND (academic_term = $2) AND (status = 'ACTIVE'))
\`\`\`

Because \`student_id\` alone had poor selectivity for active historical records, a single index on \`student_id\` still resulted in heavy bitmap heap scans.

### The Fix: Composite Filter Indexing
We created a targeted composite index:
\`\`\`sql
CREATE INDEX CONCURRENTLY idx_enrollments_student_term_active
ON enrollment_records (student_id, academic_term)
WHERE status = 'ACTIVE';
\`\`\`

The query plan shifted from a sequential scan taking ~2,480ms to an index-only scan taking **14ms**.

The lesson: You cannot out-scale bad indexing with expensive hardware.`,
    },
    {
      title: "From Operations to Software Engineering: The Honest Path",
      slug: "from-mis-to-software-engineering",
      excerpt: "No romanticized overnight transitions. Just curiosity, breaking systems, learning why they broke, and earning ownership line by line.",
      coverImage: "/articles/career.png",
      publishedAt: new Date("2026-01-12"),
      readingTime: "4 min read",
      tags: JSON.stringify(["Career", "Engineering", "Reflection", "Growth"]),
      isFeatured: true,
      isPublished: true,
      content: `## Starting Close to the Real Work

I didn't start my software career with a neat computer science whiteboard interview. I started working around operations, MIS, spreadsheets, and internal data.

And that turned out to be the best possible foundation.

When you work where software meets real people:
- You see how painful bad software is for the people forced to use it daily.
- You realize that people don't care what JavaScript framework you used; they care whether the report downloaded or whether the student got their login credentials.
- You build an instinctive hatred for software that silently fails.

### Earning Technical Responsibility
Moving from writing scripts and automation into owning production APIs and services was driven by one simple habit:
**When something broke, I didn't just restart it. I investigated until I understood why it broke.**

That curiosity is what led from basic scripts to writing full-stack systems, managing database migrations, designing background job architectures, and eventually stepping into technical leadership as an Associate Manager.`,
    },
  ];

  for (const art of articlesData) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: art,
      create: art,
    });
  }
  console.log(`✓ Seeded ${articlesData.length} articles`);

  // 5. Now Items
  const nowData = [
    {
      category: NowCategory.BUILDING,
      title: "Enterprise Systems at ProSync & BusinessOS",
      text: "Architecting high-throughput backend services at ProSync Infotech and refining the double-entry immutable ledger engine for BusinessOS.",
      order: 1,
      isActive: true,
    },
    {
      category: NowCategory.LEARNING,
      title: "PostgreSQL Internals",
      text: "Diving deeper into Postgres storage engines: VACUUM behavior, write-ahead logging (WAL), and composite index selectivity.",
      order: 2,
      isActive: true,
    },
    {
      category: NowCategory.READING,
      title: "Engineering Literature",
      text: "Reading 'Designing Data-Intensive Applications' by Martin Kleppmann & 'A Philosophy of Software Design' by John Ousterhout.",
      order: 3,
      isActive: true,
    },
    {
      category: NowCategory.THINKING,
      title: "Accidental Complexity in Web Apps",
      text: "Reflecting on how much complexity in modern web apps comes from trying to coordinate distributed state in JavaScript instead of relying on solid database primitives.",
      order: 4,
      isActive: true,
    },
    {
      category: NowCategory.EXPERIMENTING,
      title: "Local-First Architecture",
      text: "Experimenting with CRDTs and offline-capable data synchronization patterns for real-time collaboration tools.",
      order: 5,
      isActive: true,
    },
  ];

  for (const now of nowData) {
    const existing = await prisma.nowItem.findFirst({ where: { title: now.title } });
    if (existing) {
      await prisma.nowItem.update({ where: { id: existing.id }, data: now });
    } else {
      await prisma.nowItem.create({ data: now });
    }
  }
  console.log(`✓ Seeded ${nowData.length} Now items`);

  // 6. Personality Items
  const personalityData = [
    {
      category: PersonalityCategory.LIKES_BUILDING,
      title: "Correctness-Critical Backend Systems",
      body: "Ledgers where every cent must balance, background queue workers that never drop messages, idempotent API contracts, and zero-downtime database migrations.",
      order: 1,
    },
    {
      category: PersonalityCategory.OBSESSIONS,
      title: "Database Schemas That Make Bad State Impossible",
      body: "I have an unreasonable amount of respect for a well-designed relational schema with proper foreign keys, check constraints, and indexed access paths.",
      order: 2,
    },
    {
      category: PersonalityCategory.ANNOYANCES,
      title: "Browser-Dependent Operations",
      body: "If the employee has to keep a browser tab open for 20 minutes for a background job to finish, something has gone architecturally wrong.",
      order: 3,
    },
    {
      category: PersonalityCategory.OPINIONS,
      title: "Boring Technology With Taste",
      body: "Most software does not need 15 microservices. It needs a well-structured monolith, strict module boundaries, an indexed PostgreSQL database, and good typography.",
      order: 4,
    },
    {
      category: PersonalityCategory.IMPROVING,
      title: "System Design Before Code",
      body: "Currently training myself to spend more time sketching architecture, failure modes, and state transitions on paper before typing the first line of code.",
      order: 5,
    },
  ];

  for (const p of personalityData) {
    const existing = await prisma.personalityItem.findFirst({ where: { title: p.title } });
    if (existing) {
      await prisma.personalityItem.update({ where: { id: existing.id }, data: p });
    } else {
      await prisma.personalityItem.create({ data: p });
    }
  }
  console.log(`✓ Seeded ${personalityData.length} personality items`);

  // 7. Navigation Items
  const navigationData = [
    { label: "Work", href: "/work", order: 1, isEnabled: true, isExternal: false },
    { label: "Experience", href: "/experience", order: 2, isEnabled: true, isExternal: false },
    { label: "Writing", href: "/writing", order: 3, isEnabled: true, isExternal: false },
    { label: "Now", href: "/now", order: 4, isEnabled: true, isExternal: false },
    { label: "About", href: "/about", order: 5, isEnabled: true, isExternal: false },
    { label: "Resume", href: "/resume", order: 6, isEnabled: true, isExternal: false },
    { label: "Contact", href: "/contact", order: 7, isEnabled: true, isExternal: false },
  ];

  for (const nav of navigationData) {
    const existing = await prisma.navigationItem.findFirst({ where: { href: nav.href } });
    if (existing) {
      await prisma.navigationItem.update({ where: { id: existing.id }, data: nav });
    } else {
      await prisma.navigationItem.create({ data: nav });
    }
  }
  console.log(`✓ Seeded ${navigationData.length} navigation items`);

  // 8. Site Settings
  const settingsData = [
    { key: "site_name", value: "Rauhan Sheikh" },
    { key: "site_title", value: "Rauhan Sheikh — Software Developer & Builder" },
    { key: "site_bio", value: "I build things, break things, figure things out, and ship them. Focused on backend reliability, database architecture, and resilient web software." },
    { key: "site_tagline", value: "I like building the parts of software that have to actually work." },
    { key: "email", value: "hello@rauhansheikh.com" },
    { key: "location", value: "India" },
    { key: "availability_badge", value: "Open to interesting backend & full-stack engineering opportunities" },
    { key: "availability_active", value: "true" },
    { key: "github_url", value: "https://github.com/rauhan-sheikh" },
    { key: "linkedin_url", value: "https://linkedin.com/in/rauhan-sheikh" },
    { key: "twitter_url", value: "https://x.com/rauhansheikh" },
    { key: "resume_pdf_url", value: "/resume.pdf" },
    { key: "accent_color", value: "#3b82f6" },
    // Homepage Section Toggles
    { key: "section_hero_enabled", value: "true" },
    { key: "section_now_enabled", value: "true" },
    { key: "section_featured_work_enabled", value: "true" },
    { key: "section_signature_stories_enabled", value: "true" },
    { key: "section_experience_enabled", value: "true" },
    { key: "section_writing_enabled", value: "true" },
    { key: "section_personality_enabled", value: "true" },
    { key: "section_contact_enabled", value: "true" },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✓ Seeded ${settingsData.length} site settings`);

  // 9. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      action: "DATABASE_INITIALIZED",
      entityType: "SYSTEM",
      entityId: "SYSTEM_SEED",
      details: "Initial database seed completed with core projects, articles, experience, and platform settings.",
    },
  });
  console.log("✓ Audit log initialized");

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
