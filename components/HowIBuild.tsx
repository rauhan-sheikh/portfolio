export default function HowIBuild() {
  return (
    <div className="max-w-3xl mx-auto text-base text-secondary">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 border-l border-border pl-4">
          <p>
            I design systems with{" "}
            <span className="text-primary">scalability</span> and{" "}
            <span className="text-primary">maintainability</span> in mind.
          </p>
          <p>
            I balance product speed with engineering discipline — shipping fast
            without accruing invisible debt.
          </p>
        </div>
        <div className="space-y-3 border-l border-border pl-4 md:border-none md:pl-0">
          <p>
            I care about readable code, clean abstractions, and clear ownership
            boundaries between services.
          </p>
          <p>
            I enjoy building full stack features end-to-end: API design, data
            modeling, UI, and rollout strategy.
          </p>
        </div>
      </div>
    </div>
  );
}
