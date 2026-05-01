export default function ResumeSection() {
  return (
    <div className="relative rounded-xl border bg-surface border-border text-primary shadow-lg p-6 flex flex-col items-center max-w-3xl mx-auto overflow-hidden transition-colors">
      <div className="absolute -inset-px rounded-xl pointer-events-none border-2 border-transparent" />
      <p className="mb-4 text-base">
        Prefer a traditional format? Here’s my resume.
      </p>
      <iframe
        src="/Rauhan Sheikh - Resume v2.1.1.pdf"
        title="Resume PDF"
        className="w-full rounded-xl border border-border mb-4 h-[500px] md:h-[700px]"
        loading="lazy"
      />
      <a
        href="/Rauhan Sheikh - Resume v2.1.1.pdf"
        download
        className="px-6 py-2 rounded-xl border border-accent text-accent font-mono hover:bg-accent/10 transition"
      >
        Download Resume
      </a>
    </div>
  );
}
