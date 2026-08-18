import { ArrowDownRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";

const formatAmount = (amount) => `₹${(amount / 1000).toFixed(0)}K`;

function StrategyWidget({ data, onReview }) {
  return (
    <section
      aria-label="Portfolio strategy recommendation"
      className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      {/* Header */}
      <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={16}
              strokeWidth={1.8}
              className="text-[var(--color-ai)]"
            />

            <span className="text-sm font-medium">Suggested strategy</span>
          </div>

          <span className="text-xs font-medium text-[var(--color-positive)]">
            {data.confidence} confidence
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-xl font-semibold tracking-[-0.025em]">
          {data.title}
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
          {data.summary}
        </p>

        {/* Before / after */}
        <div className="mt-7 grid gap-px overflow-hidden rounded-lg bg-[var(--color-border)] sm:grid-cols-2">
          <div className="bg-[var(--color-surface)] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Before
            </p>

            <div className="mt-5 space-y-3">
              <Metric
                label="Technology"
                value={`${data.before.technologyExposure}%`}
              />

              <Metric label="Risk" value={`${data.before.riskScore} / 10`} />

              <Metric
                label="Diversification"
                value={data.before.diversificationScore}
              />
            </div>
          </div>

          <div className="bg-[var(--color-surface)] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              After
            </p>

            <div className="mt-5 space-y-3">
              <Metric
                label="Technology"
                value={`${data.after.technologyExposure}%`}
                positive
              />

              <Metric
                label="Risk"
                value={`${data.after.riskScore} / 10`}
                positive
              />

              <Metric
                label="Diversification"
                value={data.after.diversificationScore}
                positive
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Simulated actions
          </p>

          <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {data.actions.map((action) => {
              const isReduction = action.type === "reduce";

              return (
                <div
                  key={action.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        isReduction
                          ? "bg-[var(--color-risk-soft)] text-[var(--color-risk)]"
                          : "bg-[var(--color-positive-soft)] text-[var(--color-positive)]"
                      }`}
                    >
                      {isReduction ? (
                        <ArrowDownRight size={14} />
                      ) : (
                        <ArrowUpRight size={14} />
                      )}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {action.holding}
                      </p>

                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        {isReduction ? "Reduce" : "Increase"}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-sm font-medium">
                    {formatAmount(action.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust layer */}
        <div className="mt-8 border-l-2 border-[var(--color-ai)] pl-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Why AURA recommends this
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Technology exposure is{" "}
            {Math.abs(
              data.before.technologyExposure - data.before.technologyTarget,
            )}{" "}
            percentage points{" "}
            {data.before.technologyExposure > data.before.technologyTarget
              ? "above"
              : "below"}{" "}
            your target. This strategy reduces concentration while maintaining
            diversified equity exposure.
          </p>
        </div>

        {/* Assumptions */}
        <details className="mt-6">
          <summary className="cursor-pointer text-xs font-medium text-[var(--color-text-secondary)]">
            View assumptions
          </summary>

          <ul className="mt-3 space-y-2 text-xs leading-5 text-[var(--color-text-muted)]">
            {data.assumptions.map((assumption) => (
              <li key={assumption} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{assumption}</span>
              </li>
            ))}
          </ul>
        </details>

        <button
          type="button"
          onClick={onReview}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ai)]"
        >
          Review strategy
          <Check size={15} strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}

function Metric({ label, value, positive = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[var(--color-text-secondary)]">
        {label}
      </span>

      <span
        className={`text-sm font-semibold ${
          positive
            ? "text-[var(--color-positive)]"
            : "text-[var(--color-text-primary)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default StrategyWidget;
