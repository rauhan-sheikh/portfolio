import { notFound } from "next/navigation";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content/projects");
  const files = fs.readdirSync(dir);
  return files.map((file) => ({ slug: file.replace(/\.mdx$/, "") }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const filePath = path.join(
    process.cwd(),
    "content/projects",
    `${params.slug}.mdx`,
  );
  if (!fs.existsSync(filePath)) return {};
  const source = fs.readFileSync(filePath, "utf8");
  const { data } = matter(source);

  const title = data.title || "Project";
  const description =
    data.description ||
    "Project case study from full stack engineer Rauhan Sheikh.";

  return {
    title: `${title} | Rauhan Sheikh`,
    description,
    openGraph: {
      title: `${title} | Rauhan Sheikh`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Rauhan Sheikh`,
      description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = path.join(
    process.cwd(),
    "content/projects",
    `${params.slug}.mdx`,
  );
  if (!fs.existsSync(filePath)) return notFound();
  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);
  return (
    <main className="min-h-screen bg-background">
      <article className="max-w-4xl mx-auto py-24 px-6">
        <header className="mb-10">
          <p className="text-sm font-mono text-accent mb-1">// Case Study</p>
          <h1 className="text-3xl md:text-4xl font-heading tracking-tight text-primary mb-2">
            {data.title}
          </h1>
          <p className="text-secondary mb-4">{data.description}</p>
          {Array.isArray(data.stack) && data.stack.length > 0 && (
            <p className="text-sm font-mono text-secondary mb-3">
              Stack: {data.stack.join(", ")}
            </p>
          )}
          <div className="flex flex-wrap gap-3 text-sm font-mono">
            {data.github && (
              <a
                href={data.github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-lg border border-accent text-accent bg-accent/10 hover:bg-accent/20 transition"
              >
                GitHub
              </a>
            )}
            {data.demo && (
              <a
                href={data.demo}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-lg border border-border text-secondary hover:border-accent hover:text-accent transition"
              >
                Live Demo
              </a>
            )}
          </div>
        </header>
        <div className="prose dark:prose-invert">
          <MDXRemote source={content} />
        </div>
      </article>
    </main>
  );
}
