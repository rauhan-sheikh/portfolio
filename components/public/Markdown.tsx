import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders Markdown from the database.
 *
 * Article and project bodies are authored as Markdown in the admin editor, but
 * were previously interpolated straight into JSX — so React escaped them and
 * readers saw literal `## Heading` and `**bold**`. This turns them into real
 * elements, which is also what makes the .prose rules in globals.css apply:
 * every one of those selectors targets an h2/p/li that never existed before.
 *
 * Deliberately not dangerouslySetInnerHTML. The content is admin-authored, but
 * a stored-XSS path into your own admin session is not worth saving a dependency.
 * react-markdown does not render raw HTML unless rehype-raw is added — do not add it.
 *
 * remark-gfm adds tables, strikethrough, task lists, and autolinks.
 */
export default function Markdown({ children, className = "prose" }: { children: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Anything linking off-site opens safely.
          a: ({ href, children: linkChildren, ...props }) => {
            const isExternal = Boolean(href && /^https?:\/\//.test(href));
            return (
              <a
                href={href}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...props}
              >
                {linkChildren}
              </a>
            );
          },
          // Wide tables must scroll inside their own box, not the page.
          table: ({ children: tableChildren, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table {...props}>{tableChildren}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
