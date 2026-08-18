import { ArrowUpRight, ShieldAlert } from "lucide-react";

function TechnologyExposureWidget({ data }) {
  return (
    <section
      aria-label="Technology exposure analysis"
      className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert
              size={16}
              strokeWidth={1.8}
              className="text-[var(--color-risk)]"
            />

            <span className="text-sm font-medium">Technology exposure</span>
          </div>

          <span className="text-xs font-medium text-[var(--color-risk)]">
            Elevated
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <span className="text-4xl font-semibold tracking-[-0.04em]">
            {data.exposure}%
          </span>

          <span className="pb-1 text-sm text-[var(--color-text-secondary)]">
            portfolio exposure
          </span>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-muted)]">Current</span>

            <span className="text-[var(--color-text-secondary)]">
              Target {data.target}%
            </span>
          </div>

          <div className="relative h-2 rounded-full bg-[var(--color-surface-subtle)]">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-risk)]"
              style={{
                width: `${Math.min(data.exposure, 100)}%`,
              }}
            />

            <div
              className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-[var(--color-text-primary)]"
              style={{
                left: `${data.target}%`,
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
          Your technology exposure is{" "}
          <strong className="font-medium text-[var(--color-text-primary)]">
            {data.difference} percentage points
          </strong>{" "}
          above your target. This is currently one of the largest concentration
          risks in your portfolio.
        </p>

        <div className="mt-6 border-t border-[var(--color-border)] pt-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Major contributors
          </p>

          <div className="divide-y divide-[var(--color-border)]">
            {data.contributors.slice(0, 5).map((holding) => (
              <div
                key={holding.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <span className="text-sm">{holding.name}</span>

                <span className="text-sm font-medium">{holding.exposure}%</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)]"
        >
          Explore potential impact
          <ArrowUpRight
            size={15}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </section>
  );
}

export default TechnologyExposureWidget;
