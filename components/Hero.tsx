import AnimatedHero from "./AnimatedHero";

export default function Hero() {
  return (
    <section className="pt-32 pb-16 max-w-4xl mx-auto px-6" id="hero">
      <AnimatedHero>
        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-mono text-secondary mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Full Stack Engineer · 2 YOE · India
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-primary font-heading mb-2">
              Rauhan Sheikh
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl md:text-2xl font-heading text-accent">
                Full Stack Engineer
              </h2>
              <span className="animate-pulse text-accent text-2xl">▍</span>
            </div>
            <p className="mt-4 text-base leading-relaxed text-secondary max-w-xl">
              2 years of experience building scalable web applications,
              designing APIs, and shipping production-ready systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#experience"
                className="px-5 py-2 rounded-xl border border-accent bg-accent text-background font-mono text-sm hover:bg-accent-hover hover:border-accent-hover transition shadow-sm"
              >
                View Experience
              </a>
              <a
                href="#projects"
                className="px-5 py-2 rounded-xl border border-border text-secondary font-mono text-sm hover:border-accent hover:text-accent transition shadow-sm"
              >
                View Projects
              </a>
              <a
                href="/Rauhan Sheikh - Resume v2.2.1.pdf"
                download
                className="px-5 py-2 rounded-xl border border-border text-secondary font-mono text-sm hover:bg-surface hover:text-primary transition shadow-sm"
              >
                Download Resume
              </a>
            </div>
            <div className="mt-5 flex items-center gap-4 text-sm text-secondary">
              <span className="font-mono text-xs">// Online</span>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:hello@rauhansheikh.com"
                  className="inline-flex items-center gap-1.5 text-secondary hover:text-accent transition"
                  aria-label="Email Rauhan"
                >
                  <span className="inline-block h-4 w-4">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M5 7.5L12 12L19 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="hidden sm:inline">
                    hello@rauhansheikh.com
                  </span>
                </a>
                <a
                  href="https://github.com/rauhan-sheikh"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border hover:border-accent hover:text-accent transition"
                  aria-label="GitHub profile"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path
                      d="M12 2C6.477 2 2 6.486 2 12.021c0 4.424 2.865 8.18 6.839 9.504.5.093.682-.218.682-.486 0-.24-.009-.876-.014-1.72-2.782.605-3.369-1.345-3.369-1.345-.455-1.164-1.11-1.474-1.11-1.474-.908-.622.069-.61.069-.61 1.004.071 1.532 1.037 1.532 1.037.892 1.538 2.341 1.094 2.91.836.091-.65.35-1.095.636-1.347-2.221-.254-4.555-1.115-4.555-4.958 0-1.095.39-1.99 1.029-2.69-.103-.254-.446-1.277.098-2.661 0 0 .84-.27 2.75 1.026A9.38 9.38 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.384.203 2.407.1 2.661.64.7 1.027 1.595 1.027 2.69 0 3.853-2.338 4.701-4.566 4.95.359.31.678.923.678 1.86 0 1.342-.012 2.424-.012 2.754 0 .27.18.583.688.484A10.025 10.025 0 0 0 22 12.02C22 6.486 17.523 2 12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/rauhan-sheikh"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border hover:border-accent hover:text-accent transition"
                  aria-label="LinkedIn profile"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path
                      d="M6.5 7.5C7.328 7.5 8 6.828 8 6s-.672-1.5-1.5-1.5S5 5.172 5 6s.672 1.5 1.5 1.5Z"
                      fill="currentColor"
                    />
                    <path
                      d="M5.25 9h2.5v10h-2.5V9Zm4.75 0h2.4v1.294h.034C13 9.61 13.9 9 15.211 9 17.657 9 18 10.64 18 12.824V19h-2.5v-5.23c0-1.247-.022-2.852-1.739-2.852-1.742 0-2.011 1.362-2.011 2.766V19H9.999V9Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface/80 p-4 md:p-5 shadow-lg">
            <p className="text-xs font-mono text-accent mb-2">// Snapshot</p>
            <ul className="space-y-2 text-sm text-secondary">
              <li>
                <span className="font-mono text-primary">01</span> Owns features
                end-to-end across frontend, backend, and database.
              </li>
              <li>
                <span className="font-mono text-primary">02</span> Comfortable
                designing APIs, data models, and deployment flows.
              </li>
              <li>
                <span className="font-mono text-primary">03</span> Enjoys
                working with product teams at fast-paced startups.
              </li>
            </ul>
          </div>
        </div>
      </AnimatedHero>
    </section>
  );
}
