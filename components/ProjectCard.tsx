import Link from "next/link";
import { Project } from "../lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="relative rounded-xl border bg-surface border-border text-primary shadow-lg p-6 group overflow-hidden transition-colors">
      <div className="absolute -inset-px rounded-xl pointer-events-none border-2 border-transparent group-hover:border-accent/70 transition-colors duration-300" />
      <h3 className="text-xl font-heading mb-1 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
        {project.title}
      </h3>
      <p className="mb-3 text-secondary">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4 text-xs font-mono text-secondary">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 rounded-full border border-border/70 bg-background/60"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {project.github.map((repo) => (
          <Link
            key={repo.url}
            href={repo.url}
            className="px-4 py-1.5 rounded-lg border border-accent text-accent font-mono bg-accent/10 hover:bg-accent/20 hover:text-accent hover:-translate-y-[1px] hover:shadow-md transition-all"
            target="_blank"
          >
            {repo.lable}
          </Link>
        ))}
        {project.demo && (
          <Link
            href={project.demo}
            className="px-4 py-1.5 rounded-lg border border-accent text-accent font-mono bg-accent/10 hover:bg-accent/20 hover:text-accent hover:-translate-y-[1px] hover:shadow-md transition-all"
            target="_blank"
          >
            Live
          </Link>
        )}
      </div>
    </div>
  );
}
