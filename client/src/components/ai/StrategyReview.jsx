import { useState } from "react";
import { Check, X, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

function StrategyReview({ strategy, onCancel, onApprove }) {
    const [selectedTradeoff, setSelectedTradeoff] = useState("balanced");
    const selectedStrategy = strategy.tradeoffs[selectedTradeoff];
    const selectedActions =
      strategy.actionPlans?.[selectedTradeoff] ?? strategy.actions;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="strategy-review-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] sm:max-w-2xl sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--color-border)] px-5 py-5 sm:px-7">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[var(--color-ai)]">
              <ShieldCheck size={16} strokeWidth={1.8} />

              <span className="text-xs font-medium uppercase tracking-wide">
                Review before approval
              </span>
            </div>

            <h2
              id="strategy-review-title"
              className="text-xl font-semibold tracking-[-0.025em]"
            >
              {strategy.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close review"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          {/* Before / After */}
          <section>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Expected portfolio impact
            </p>

            <div className="grid gap-px overflow-hidden rounded-lg bg-[var(--color-border)] sm:grid-cols-2">
              <ReviewColumn
                title="Before"
                technology={`${strategy.before.technologyExposure}%`}
                risk={`${strategy.before.riskScore} / 10`}
                diversification={strategy.before.diversificationScore}
              />

              <ReviewColumn
                title="After"
                technology={`${selectedStrategy.technologyExposure}%`}
                risk={`${selectedStrategy.riskScore} / 10`}
                diversification={selectedStrategy.diversificationScore}
                positive
              />
            </div>
          </section>

          {/* Actions */}
          <section className="mt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Simulated actions
            </p>

            <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {selectedActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-medium">{action.holding}</p>

                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {action.type === "reduce"
                        ? "Reduce position"
                        : "Increase allocation"}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      action.type === "reduce"
                        ? "text-[var(--color-risk)]"
                        : "text-[var(--color-positive)]"
                    }`}
                  >
                    {action.type === "reduce" ? "−" : "+"}₹
                    {(action.amount / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Trade-offs */}
          <section className="mt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Why this option
            </p>

            <div className="rounded-lg bg-[var(--color-surface-subtle)] p-5">
              <p className="text-sm leading-6 text-[var(--color-text-primary)]">
                {selectedStrategy.description}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {Object.entries(strategy.tradeoffs).map(([key, tradeoff]) => (
                  <Tradeoff
                    key={key}
                    label={tradeoff.label}
                    value={`${tradeoff.riskScore} / 10`}
                    description={tradeoff.description}
                    active={selectedTradeoff === key}
                    recommended={tradeoff.recommended}
                    onSelect={() => setSelectedTradeoff(key)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Assumptions */}
          <section className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Assumptions
            </p>

            <ul className="space-y-2">
              {strategy.assumptions.map((assumption) => (
                <li
                  key={assumption}
                  className="flex gap-2 text-xs leading-5 text-[var(--color-text-secondary)]"
                >
                  <span aria-hidden="true">•</span>
                  <span>{assumption}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Simulation notice */}
          <div className="mt-8 rounded-lg border border-[var(--color-ai)]/20 bg-[var(--color-ai)]/5 p-4">
            <p className="text-xs font-medium text-[var(--color-text-primary)]">
              Prototype simulation
            </p>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
              Approving this strategy will only update the simulated portfolio
              in this prototype. No real trades or money movement will occur.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--color-surface-hover)]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() =>
                onApprove({
                  ...strategy,
                  selectedTradeoff,
                  selectedStrategy,
                  actions: selectedActions,
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ai)]"
            >
              <Check size={15} strokeWidth={2} />
              Approve simulated strategy
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReviewColumn({
  title,
  technology,
  risk,
  diversification,
  positive = false,
}) {
  return (
    <div className="bg-[var(--color-surface)] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
        {title}
      </p>

      <div className="mt-5 space-y-4">
        <Metric label="Technology" value={technology} positive={positive} />

        <Metric label="Risk" value={risk} positive={positive} />

        <Metric
          label="Diversification"
          value={diversification}
          positive={positive}
        />
      </div>
    </div>
  );
}

function Metric({ label, value, positive }) {
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

function Tradeoff({
  label,
  value,
  description,
  active = false,
  recommended = false,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-md border p-3 text-left transition-colors ${
        active
          ? "border-[var(--color-ai)] bg-[var(--color-ai)]/5"
          : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium">{label}</p>

        {recommended && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-ai)]">
            Recommended
          </span>
        )}
      </div>

      <p className="mt-2 text-sm font-semibold">{value}</p>

      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
        {description}
      </p>
    </button>
  );
}

export default StrategyReview;
