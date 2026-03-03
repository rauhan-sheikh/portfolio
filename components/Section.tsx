import { ReactNode } from "react";
import FadeInSection from "./FadeInSection";

export default function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-24 max-w-4xl mx-auto px-6 relative">
      <div className="flex items-center gap-3 mb-8">
        <span className="block w-6 h-1 rounded-full bg-accent" />
        <h2 className="text-2xl font-medium font-heading tracking-tight text-primary">
          <span className="text-accent mr-2">//</span>
          {title}
        </h2>
        <span className="flex-1 h-px bg-border ml-4" />
      </div>
      <FadeInSection>{children}</FadeInSection>
    </section>
  );
}
