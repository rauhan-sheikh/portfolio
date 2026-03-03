type ExperienceItem = {
  company: string;
  role: string;
  duration: string;
  bullets: string[];
};

const experience: ExperienceItem[] = [
  {
    company: "Blackboard E-Learning Pvt Ltd (College Vidya)",
    role: "Software Developer",
    duration: "May 2024 – Present",
    bullets: [
      "Contributing to large-scale EdTech platforms serving 15,000+ active students across LMS and ERP modules.",
      "Designing and implementing backend APIs, authentication flows, and role-based access control using Node.js and Express.",
      "Building and maintaining React/Next.js interfaces for academic content, enrollment, payments, and internal workflows.",
      "Collaborating with product, academic, and operations teams to deliver reliable, scalable features into production.",
    ],
  },
  {
    company: "Freelance Web Developer",
    role: "Full Stack Web Developer (Part-time)",
    duration: "2023 – Present",
    bullets: [
      "Building marketing sites and web applications for clients based on concrete business requirements.",
      "Managing end-to-end delivery: discovery, implementation, deployment, and iteration on client feedback.",
      "Shipping responsive, SEO-friendly experiences with clean, maintainable React, Next.js, and Node.js code.",
    ],
  },
];

export default function Experience() {
  return (
    <div className="space-y-10 relative">
      <div className="absolute left-2 top-1 bottom-1 hidden md:block border-l border-border" />
      {experience.map((item) => (
        <div
          key={item.company}
          className="relative rounded-xl border bg-surface border-border text-primary shadow-lg p-6 pl-8 md:pl-10 group overflow-hidden transition-colors"
        >
          <div className="absolute -inset-px rounded-xl pointer-events-none border-2 border-transparent group-hover:border-accent/70 transition-colors duration-300" />
          <div className="absolute left-2 top-6 h-3 w-3 rounded-full bg-accent border-2 border-background md:left-0" />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
            <span className="font-heading text-lg flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-accent" />
              {item.company}
            </span>
            <span className="text-secondary text-sm font-mono mt-1 sm:mt-0">
              {item.role} &bull; {item.duration}
            </span>
          </div>
          <ul className="list-disc pl-5 text-base space-y-1 text-secondary mt-1">
            {item.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
