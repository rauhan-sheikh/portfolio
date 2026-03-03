const stack = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "Bash"],
  },
  {
    label: "Frontend",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "MDX",
      "HTML5",
      "CSS3",
    ],
  },
  {
    label: "Backend",
    items: [
      "Node.js",
      "Express",
      "tRPC",
      "REST",
      "GraphQL",
      "JWT",
      "WebSockets",
    ],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MongoDB", "Prisma", "Redis"],
  },
  {
    label: "DevOps & Tools",
    items: ["Git", "Docker", "CI/CD", "Vercel", "Linux", "Postman", "Figma"],
  },
];

export default function TechStack() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {stack.map((group) => (
        <div
          key={group.label}
          className="relative rounded-xl border bg-surface border-border text-primary shadow-lg p-6 group overflow-hidden transition-colors"
        >
          <div className="absolute -inset-px rounded-xl pointer-events-none border-2 border-transparent group-hover:border-accent/70 transition-colors duration-300" />
          <div className="flex items-center gap-2 mb-3">
            <span className="font-heading text-xl text-accent tracking-tight">
              {group.label}
            </span>
            <span className="h-1 w-6 bg-accent rounded-full group-hover:w-10 transition-all duration-300" />
          </div>
          <ul className="flex flex-wrap gap-2 mt-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="px-3 py-1 rounded-lg bg-background text-primary border border-border shadow-sm text-sm font-mono group-hover:border-accent transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
