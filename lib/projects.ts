// Project metadata and utilities for project listing
export type Project = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  github: string;
  demo: string;
};

export const projects: Project[] = [
  {
    slug: "college-vidya-lms",
    title: "College Vidya – Learning Management System",
    description:
      "End-to-end LMS for managing academic content, assessments, and live classes used by 15,000+ students.",
    stack: ["React", "Next.js", "Node.js", "Express", "MySQL"],
    github: "",
    demo: "",
  },
  {
    slug: "college-vidya-erp-crm",
    title: "College Vidya – ERP & CRM System",
    description:
      "ERP & CRM platform powering university partnerships and managing the complete student lifecycle.",
    stack: ["React", "Next.js", "Node.js", "Express", "MySQL"],
    github: "",
    demo: "",
  },
  {
    slug: "second-brain",
    title: "Second Brain (In Progress)",
    description:
      "Personal knowledge management app for saving, organizing, and sharing links, notes, and resources.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    github: "",
    demo: "",
  },
];
