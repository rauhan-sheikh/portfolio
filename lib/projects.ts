// Project metadata and utilities for project listing
export type GitHubLinks = {
  lable: string;
  url: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  github: GitHubLinks[];
  demo: string;
};

export const projects: Project[] = [
  {
    slug: "second-brain",
    title: "Second Brain",
    description:
      "Personal knowledge management app for saving, organizing, and sharing links, notes, and resources.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    github: [
      {
        lable: "Frontend Repo",
        url: "https://github.com/rauhan-sheikh/Second-Brain-Frontend",
      },
      {
        lable: "Backend Repo",
        url: "https://github.com/rauhan-sheikh/Second-Brain-Backend",
      },
    ],
    demo: "https://secondbrain.rauhansheikh.com",
  },
  {
    slug: "business-os",
    title: "BusinessOS (In Progress)",
    description:
      "Commercial-grade multi-tenant SME business operating system with ledger-first accounting, party management, receivables/payables tracking, immutable transactions, and audit-safe financial workflows.",
    stack: [
      "Next.js",
      "React",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "TypeScript",
    ],
    github: [
      {
        lable: "GitHub Repo",
        url: "https://github.com/rauhan-sheikh/BusinessOS",
      },
    ],
    demo: "",
  },
];
