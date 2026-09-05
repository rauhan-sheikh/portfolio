import { PrismaClient, ProjectCategory, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Syncing project & experience data...");

  // 1. Upsert Akshta Enterprises Project
  const akshtaProject = {
    title: "Akshta Enterprises",
    slug: "akshta-enterprises",
    category: ProjectCategory.CLIENT,
    year: "2026",
    shortDesc:
      "Commercial business platform engineered end-to-end for Akshta Enterprises with custom responsive layouts, automated inquiry routing, and direct WhatsApp integrations.",
    longDesc:
      "Designed and developed a live production-ready web application for Akshta Enterprises. Handled full lifecycle delivery from client discovery and architecture through deployment, integrating EmailJS contact pipelines, WhatsApp customer communication, responsive typography, and high SEO performance.",
    status: ProjectStatus.PUBLISHED,
    isFeatured: true,
    order: 4,
    coverImage: "/projects/akshta.png",
    accentColor: "#10b981",
    projectMark: "AKSH",
    liveUrl: "https://akshtaenterprises.com/",
    githubUrl: "",
    theProblem:
      "The client needed a modern, accessible digital presence to showcase manufacturing and enterprise operations. Traditional generic templates had heavy bloat, poor mobile conversion paths, and lacked instantaneous lead capture channels for commercial inquiries.",
    theMessyPart:
      "Iterating directly on client requirements and content revisions while maintaining strict performance budgets, sub-second initial load times, and ensuring zero message drops on mobile network drops.",
    architecture:
      "Next.js application with Tailwind CSS for high-performance styling. Client-side form validation orchestrating dual dispatch: asynchronous transactional delivery via EmailJS for logging alongside instant WhatsApp deep-link generation for real-time customer messaging.",
    technicalDecisions:
      "1. Jamstack architecture with static optimization ensuring rapid TTFB and 98+ Lighthouse scores.\n2. Direct WhatsApp API integration alongside validated EmailJS form pipelines.\n3. Accessibility (WCAG compliant) and responsive UX across all screen sizes.\n4. Comprehensive on-page SEO with semantic HTML5 and OpenGraph metadata.",
    whatIdChange:
      "Integrate headless CMS earlier to allow direct client catalog updates without requiring code adjustments.",
    fullContent: `## End-to-End Client Delivery

Building client software requires a different muscle than internal tools: you are directly responsible for translating commercial objectives into responsive, maintainable production software.

### Core Deliverables
- **Custom Responsive Architecture**: Engineered from scratch using Next.js and Tailwind CSS, tailored specifically to commercial showcase needs.
- **Dual Inquiry Pipeline**: Integrated direct WhatsApp messaging triggers and EmailJS transactional notifications for immediate customer response.
- **Performance & SEO Excellence**: Structured semantic HTML, OpenGraph tags, and clean layout geometry delivering 98+ Lighthouse metrics.
- **Full Ownership**: Managed requirements gathering, iterative revisions, production deployment, and domain DNS setup.`,
    stack: JSON.stringify(["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "EmailJS"]),
    metrics: JSON.stringify([
      { label: "Performance", value: "98+ Lighthouse", description: "Near-instant mobile & desktop load times" },
      { label: "Inquiry Flow", value: "Email & WhatsApp", description: "Automated real-time lead capture pipelines" },
      { label: "Delivery", value: "End-to-End", description: "Requirements, architecture, UI, and live deployment" },
    ]),
    links: JSON.stringify([
      { label: "Live Website", url: "https://akshtaenterprises.com/" },
    ]),
    showOnHome: true,
    showInWork: true,
  };

  const project = await prisma.project.upsert({
    where: { slug: akshtaProject.slug },
    update: akshtaProject,
    create: akshtaProject,
  });
  console.log(`✅ Upserted project: ${project.title} (${project.slug})`);

  // 2. Detach BusinessOS from ProSync Infotech
  const prosync = await prisma.experience.findFirst({
    where: { company: { contains: "ProSync", mode: "insensitive" } },
  });
  if (prosync) {
    await prisma.experience.update({
      where: { id: prosync.id },
      data: { linkedProjects: JSON.stringify([]) },
    });
    console.log(`✅ Detached BusinessOS from ProSync Infotech experience`);
  }

  // 3. Attach Akshta Enterprises to Freelance Web Developer
  const freelance = await prisma.experience.findFirst({
    where: { company: { contains: "Freelance", mode: "insensitive" } },
  });
  if (freelance) {
    await prisma.experience.update({
      where: { id: freelance.id },
      data: { linkedProjects: JSON.stringify(["akshta-enterprises"]) },
    });
    console.log(`✅ Attached Akshta Enterprises to Freelance Web Developer experience`);
  }

  // 4. Update availability badge site setting
  await prisma.siteSetting.upsert({
    where: { key: "availability_badge" },
    update: { value: "Open to opportunities" },
    create: { key: "availability_badge", value: "Open to opportunities" },
  });
  console.log(`✅ Updated availability_badge setting to 'Open to opportunities'`);

  console.log("✨ All experience and project records synchronized successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Sync error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
