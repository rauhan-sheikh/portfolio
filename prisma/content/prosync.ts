import { ProjectCategory, ProjectStatus } from "@prisma/client";

/**
 * Content for the ProSync Infotech Private Limited role (Aug 2026 – present).
 * Shared by prisma/seed.ts (fresh databases) and scripts/sync-prosync.ts (live database).
 *
 * Confidentiality rule for this file: describe WHAT was built and the engineering judgement
 * behind it, never the employer's proprietary specifics. Only MarketBaaz is public; Workforce
 * and the CRM are internal and must stay generic. No scoring signals, thresholds, data
 * sources, security findings, incident details, credentials, customer data or internal URLs.
 */

export const PROSYNC_COMPANY = "ProSync Infotech Private Limited";

export const prosyncExperience = {
  company: PROSYNC_COMPANY,
  role: "Software Developer",
  location: "India",
  startDate: "Aug 2026",
  endDate: "Present",
  isCurrent: true,
  description:
    "Building and running three connected products at an e-commerce education company: MarketBaaz (a public tool that helps Amazon sellers decide what to sell), an internal HR platform, and an internal CRM, plus the servers they all run on.",
  bullets: JSON.stringify([
    "Sole engineer on MarketBaaz: took the web app from a waitlist to a public launch and built the Chrome extension end to end, then shipped a new extension version roughly every two days for five weeks.",
    "Replaced a fixed estimation formula with a trained machine-learning pipeline that refuses to show a number when the evidence isn't there, and paired it with a configurable, confidence-scored ranking model.",
    "Grew MarketBaaz into a data engine for products, keywords, brands and sellers, gathered by the extension itself, and kept it fast as the data grew by fixing database failures, adding indexes and trimming page weight (the main logo alone went from 243 KB to about 6 KB).",
    "Migrated MarketBaaz to new infrastructure and a new domain with minimal disruption: staged user communication, rollback-ready extension releases and the old domain kept alive for backward compatibility.",
    "As senior developer on a two-person team, built the internal HR platform (Next.js, MongoDB) and its Windows and macOS desktop app (Electron): approvals, leave, payroll, incentives, shifts and reporting, all driven by admin-set policy rather than hard-coded rules.",
    "On the same two-person team, built the CRM's quotation and invoicing workflows with PDF output and Gmail integration, plus access control with audit trails.",
    "Connected all three products through our own APIs and webhooks, so a CRM contact can be issued MarketBaaz access automatically and product events flow back into the CRM.",
    "Own the self-hosted VPS infrastructure: deployments through GitHub Actions with rollback, process supervision, backups and monitoring.",
  ]),
  technologies: JSON.stringify([
    "TypeScript",
    "Next.js",
    "React",
    "Node.js",
    "MongoDB",
    "Redis",
    "BullMQ",
    "Electron",
    "Python",
    "Chrome Extensions",
    "Gmail API",
    "Razorpay",
    "Firebase Auth",
    "GitHub Actions",
    "PM2",
    "Linux VPS",
  ]),
  metrics: JSON.stringify([
    { label: "Shipping Pace", value: "A new extension version every ~2 days" },
    { label: "Products", value: "3 connected platforms" },
    { label: "Data Engine", value: "Products · Keywords · Brands · Sellers" },
    { label: "Infrastructure", value: "Self-hosted, run end to end by me" },
  ]),
  linkedProjects: JSON.stringify(["marketbaaz", "workforce-hrms", "crm-platform", "reel-script-generator"]),
  order: 1,
};

export const prosyncProjects = [
  {
    title: "MarketBaaz",
    slug: "marketbaaz",
    category: ProjectCategory.PROFESSIONAL,
    year: "2026",
    shortDesc:
      "Helps Amazon sellers decide what to sell: a Chrome extension and web app (formerly BrandForge) that turn marketplace data into clear insight, and never show a number the evidence can't support.",
    longDesc:
      "MarketBaaz helps Amazon sellers research and validate products. A Chrome extension overlays sales, revenue and opportunity insight on Amazon pages, and a web app adds product, brand and seller research, keyword tools, an AI brand-building suite and billing. I am the sole engineer: I took it from a waitlist to a public launch and built the extension, data pipeline, backend, payments and infrastructure.",
    status: ProjectStatus.PUBLISHED,
    isFeatured: true,
    order: 1,
    accentColor: "#f97316",
    projectMark: "MBZ",
    liveUrl: "https://marketbaaz.com",
    githubUrl: "",
    theProblem:
      "Sellers choose products on guesswork or pay for tools whose numbers they can't interrogate. A research tool that invents confident-looking figures is worse than none: someone acts on them and loses real money. The challenge was to be useful and honest at the same time.",
    theMessyPart:
      "Real-world data is hostile. Marketplaces differ in layout and currency, pages change under you, listings vary by size and colour, and the source site pushes back on aggressive reading. Getting one trustworthy dataset out of that, at a speed that doesn't get anyone blocked, is most of the work.",
    architecture:
      "A Chrome extension reads the pages a user already visits and talks to a backend API; nothing proprietary ships to the client. The backend (Next.js, TypeScript, Node.js) stores everything in MongoDB as a single source of truth, runs background jobs on Redis and BullMQ, and serves estimates that are computed ahead of time by a trained model rather than on every request. Payments, authentication, email and an admin console complete the platform, and the whole stack is self-hosted on our own VPS.",
    technicalDecisions:
      "1. Honesty over completeness: when the evidence is insufficient, the product says so explicitly instead of returning a plausible-looking number.\n2. Keep intelligence on the server, so competitors who inspect the extension find only API calls.\n3. Precompute expensive estimates in the database so normal reads stay fast.\n4. Prefer wrong-free to wrong-fast: if a value can't be established reliably, store nothing rather than something misleading.\n5. Ship behind switches: new capabilities start admin-only and widen by plan, audience and usage limit without a redeploy.\n6. Make every release reversible, with builds off the production host and instant rollback.",
    whatIdChange:
      "I would separate workloads onto their own hosts from day one. Running application, workers and databases together made every incident bigger than it needed to be, and the migration that fixed it was avoidable.",
    fullContent: `## What it is

MarketBaaz is an Amazon seller-intelligence platform, formerly BrandForge. It has two halves that share one backend:

- **A Chrome extension** that adds research directly onto Amazon pages while a seller browses.
- **A web app** with product, brand and seller research, keyword tools, an AI brand-building suite, a marketplace, billing and a full admin console.

It works across 24 Amazon country sites with correct local currencies, and I built and run it as its only engineer. The web app was a waitlist when I joined; I took it public, built the extension end to end, and then shipped a new extension version roughly every two days for five weeks.

## An estimator that knows what it doesn't know

The most important design decision was a refusal:

> If the evidence isn't there, the system says so.

Instead of a fixed formula, estimates come from a trained machine-learning pipeline that is retrained on a schedule, versioned, and checked against its previous output. When a product doesn't have a reliable signal, users see an explicit state such as "Not enough data", never a fabricated figure. A ranking layer on top is configurable and carries a confidence value, so a result backed by plenty of evidence is distinguishable from a thin one.

## Fast at scale

The extension gathers the data itself as people browse, and MarketBaaz has grown into a data engine covering products, keywords, brands and sellers. Keeping it quick as that data grew meant fixing real bottlenecks: a database sort that ran out of memory and crashed product listing was moved into the database itself, targeted indexes and caching were added, writes became bulk and repeat-safe, and page weight was cut (the main logo went from 243 KB to about 6 KB).

## Built to be operated

- **Rollouts:** features ship dark and are enabled per plan or audience from the admin console.
- **Billing:** subscription changes, renewals, retries, tax invoices and discount codes.
- **Support:** in-product problem reporting that creates tickets in the admin support centre.
- **Migration:** I moved the live system to new infrastructure and a new domain, with staged user emails, a rollback-ready release and the old domain kept working during the transition.`,
    stack: JSON.stringify([
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Redis",
      "BullMQ",
      "Python",
      "Chrome Extensions",
      "Razorpay",
      "Firebase Auth",
    ]),
    metrics: JSON.stringify([
      { label: "Data Engine", value: "4 data types", description: "Products, keywords, brands and sellers, gathered by the extension itself" },
      { label: "Reach", value: "24 country sites", description: "Amazon marketplaces worldwide, each with its own currency" },
      { label: "Shipping Pace", value: "Every ~2 days", description: "A new extension version roughly every two days for five weeks" },
      { label: "Ownership", value: "Sole engineer", description: "Extension, web app, backend and infrastructure" },
    ]),
    links: JSON.stringify([{ label: "MarketBaaz", url: "https://marketbaaz.com" }]),
    showOnHome: true,
    showInWork: true,
  },
  {
    title: "Workforce HRMS & Desktop App",
    slug: "workforce-hrms",
    category: ProjectCategory.INTERNAL,
    year: "2026",
    shortDesc:
      "An internal HR platform for a growing company: attendance, leave, payroll and approvals in one place, plus a desktop app for Windows and macOS. Internal tool, so described at a high level.",
    longDesc:
      "A rebuild of the company's workforce system into a full HRMS: a Next.js admin and employee portal on MongoDB, and an Electron desktop app for Windows and macOS. Built by a two-person team, with me as the senior developer. Internal to the company, so this page describes the engineering approach rather than the product specifics.",
    status: ProjectStatus.PUBLISHED,
    isFeatured: true,
    order: 2,
    accentColor: "#6366f1",
    projectMark: "HRMS",
    liveUrl: "",
    githubUrl: "",
    theProblem:
      "An older workforce system had accumulated issues and fixed rules. Numbers disagreed between views, and because payroll depends on attendance, every inconsistency turned into a money problem.",
    theMessyPart:
      "Real attendance is messy: different shifts, machines that restart or drop offline, and rules that vary by team. All of it has to resolve to one consistent number everywhere, because payroll consumes it.",
    architecture:
      "A Next.js and Node.js application on MongoDB with per-person logins and a role- and department-scoped permission model, an approval engine, and ledger-style balances. An Electron desktop app for Windows and macOS stores data locally and syncs reliably when the connection returns. Everything is self-hosted and deployed through scripted, health-checked releases with automatic rollback.",
    technicalDecisions:
      "1. Configurable policy: rules live in admin settings with defaults that preserve existing behaviour, not in code.\n2. Ledger-style balances instead of mutable counters, so history is always explainable.\n3. Approved payroll data is locked; reopening requires a recorded reason.\n4. Resumable report generation so large reports survive interruptions.\n5. Audit trails with reasons for every sensitive change, and notifications to the people affected.\n6. Offline-tolerant desktop app that keeps pending data until the server confirms receipt.\n7. Automated tests and in-app help kept in step with every release.",
    whatIdChange:
      "I would model shifts and rosters before building attendance reporting. Retrofitting varied schedules onto a single-shift assumption forced rework across reports and payroll.",
    fullContent: `## Scope

An internal HR platform in three parts: an **admin portal** for HR and management, an **employee portal**, and a **desktop app** for Windows and macOS, all backed by one Next.js, Node.js and MongoDB system that I also host and operate.

It covers attendance and shifts, leave, payroll, incentives, reimbursements, employee records and reporting, with approvals that can span multiple levels per request type.

## The engineering themes

- **Policy as configuration.** Almost nothing that HR cares about is hard-coded. New rules ship as settings whose defaults keep today's behaviour, so features can be introduced gradually.
- **Correctness first.** Balances are ledgers, approved payroll is locked, and every sensitive change is audited with a reason.
- **Resilience.** The desktop app keeps working offline and syncs safely; long-running reports resume where they stopped.
- **Maintainability.** A large automated test suite, searchable in-app help in all three apps that is updated with every release, and scripted deployments with automatic rollback.

## Note

This is an internal company system built by a two-person team, with me as the senior developer. There is no public link and I have kept the description deliberately general.`,
    stack: JSON.stringify(["Next.js", "React", "TypeScript", "Node.js", "MongoDB", "Electron", "GitHub Actions", "PM2", "Linux VPS"]),
    metrics: JSON.stringify([
      { label: "Team", value: "2 developers", description: "Senior developer on a two-person team" },
      { label: "Surfaces", value: "3 apps", description: "Admin portal, employee portal and a Windows & macOS desktop app" },
      { label: "Quality", value: "Tested before every release", description: "Automated checks, in-app help and rollback-ready deployments" },
      { label: "Hosting", value: "Self-managed", description: "Deployed and operated by me on our own servers" },
    ]),
    links: JSON.stringify([]),
    showOnHome: true,
    showInWork: true,
  },
  {
    title: "CRM Platform",
    slug: "crm-platform",
    category: ProjectCategory.INTERNAL,
    year: "2026",
    shortDesc:
      "An internal CRM that keeps sales and support organised: quotes and invoices, who can see what, and automatic links to the company's other products. Internal tool, so described at a high level.",
    longDesc:
      "Work on the company CRM covering quotation and invoicing workflows with PDF output, Gmail integration, granular access control, and the API and webhook integration that links it to MarketBaaz. Built by the same two-person team as the Workforce platform. Internal to the company, so this page stays general.",
    status: ProjectStatus.PUBLISHED,
    isFeatured: true,
    order: 3,
    accentColor: "#10b981",
    projectMark: "CRM",
    liveUrl: "",
    githubUrl: "",
    theProblem:
      "Sales and support needed quotes and invoices that could be configured instead of hand-built, access that matched how the company is organised, and a dependable feed of events from the company's products so the CRM reflects reality without manual entry.",
    theMessyPart:
      "A CRM holds live customer data, so every change has to be safe by default: previews before scripts touch production, immediate loss of access for deactivated users, and integrations that stay correct when events arrive twice or out of order.",
    architecture:
      "A Node.js and TypeScript application with the same self-hosted foundation as the other platforms. Quotations convert to invoices with validation and PDF output; access is granted at individual, team and department level with audit trails; and signed webhooks plus a small API connect it to MarketBaaz in both directions.",
    technicalDecisions:
      "1. Signed, deduplicated webhooks with database-level idempotency, so repeated events can't create duplicates.\n2. Key members on a stable external ID rather than email alone.\n3. Dry-run previews and explicit confirmation for any script that changes live data.\n4. Immediate access removal on deactivation and lockout after repeated failed sign-ins.\n5. A one-command isolated local environment on sample data.",
    whatIdChange:
      "I would write the integration contract and its tests before building either side. Several fixes came from discovering mismatches between the two systems after the fact.",
    fullContent: `## What I built

- **Quotations and invoices:** configurable line items, taxes, discounts and currencies, reusable templates, PDF download and quote-to-invoice conversion with validation.
- **Access control:** permissions across individuals, teams, sub-departments and departments, with audit trails.
- **Integrations:** Gmail integration, and a signed API and webhook layer that connects the CRM to MarketBaaz, so a contact can be issued MarketBaaz access automatically and product events flow back.
- **Safety and developer experience:** previews and confirmations for data-changing scripts, and an isolated one-command local setup.

## Note

This is an internal company system built by a two-person team, with me as the senior developer. There is no public link and the description is deliberately general.`,
    stack: JSON.stringify(["Next.js", "TypeScript", "Node.js", "MongoDB", "Gmail API", "PDF generation", "Webhooks"]),
    metrics: JSON.stringify([
      { label: "Integrations", value: "APIs + webhooks", description: "Signed, deduplicated events between products" },
      { label: "Access Control", value: "Person to department", description: "Permissions at individual, team and department level, all audited" },
      { label: "Quote → Invoice", value: "1-click", description: "With validation and PDF output" },
    ]),
    links: JSON.stringify([]),
    showOnHome: true,
    showInWork: true,
  },
  {
    title: "Reel Script Generator",
    slug: "reel-script-generator",
    category: ProjectCategory.INTERNAL,
    year: "2026",
    shortDesc:
      "A small internal MVP, built over a few days, that generates short-form reel scripts and syncs them to a shared Google Sheet for the social media team to review.",
    longDesc:
      "A quick proof of concept built early at ProSync: generate a script, save it, and review it in a shared sheet. Small by design.",
    status: ProjectStatus.PUBLISHED,
    isFeatured: false,
    order: 8,
    accentColor: "#ec4899",
    projectMark: "REEL",
    liveUrl: "",
    githubUrl: "",
    theProblem: "The social media team had no shared place to review reel scripts.",
    theMessyPart: "Keeping it small: the useful part is the review loop, so scripts had to land where the team already works.",
    architecture: "A small web app that generates scripts and automatically syncs each one to a Google Sheet.",
    technicalDecisions:
      "1. Sync every script to a Google Sheet so reviewers need no new tool.\n2. Ship a working MVP in days and demo it before adding anything else.",
    whatIdChange: "I would capture reviewer feedback in the sheet from the start so approved and rejected scripts can improve the prompts.",
    fullContent: `## A few-day MVP

A deliberately small project: a reel script generator whose output syncs automatically to a Google Sheet. I demoed it to the social media team within the week. It is still low on the priority list and is not a large system.`,
    stack: JSON.stringify(["Web app", "Google Sheets API", "LLM prompting"]),
    metrics: JSON.stringify([
      { label: "Time to MVP", value: "A few days", description: "Built and demoed to the team in the same week" },
    ]),
    links: JSON.stringify([]),
    showOnHome: false,
    showInWork: true,
  },
];

/** Explicit display order so new work leads without re-bumping older projects on every run. */
export const projectOrder: Record<string, number> = {
  marketbaaz: 1,
  "workforce-hrms": 2,
  "crm-platform": 3,
  "microsoft-teams-engine": 4,
  "bulk-email-engine": 5,
  "college-vidya-lms": 6,
  "business-os": 7,
  "reel-script-generator": 8,
  "akshta-enterprises": 9,
  "second-brain": 10,
};

export const prosyncNowItem = {
  oldTitle: "Enterprise Systems at ProSync & BusinessOS",
  title: "MarketBaaz, Workforce & CRM at ProSync",
  text: "Building MarketBaaz, an internal HR platform and a CRM at ProSync, and running the servers underneath them.",
};
