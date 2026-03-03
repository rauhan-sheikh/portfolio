import { projects } from "../lib/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
