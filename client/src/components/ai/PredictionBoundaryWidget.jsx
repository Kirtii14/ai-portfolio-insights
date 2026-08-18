import { ArrowRight, ShieldAlert } from "lucide-react";

function PredictionBoundaryWidget({ data, onScenario }) {
  return (
    <section
      aria-label="Prediction limitation"
      className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <ShieldAlert
            size={16}
            strokeWidth={1.8}
            className="text-[var(--color-warning)]"
          />

          <span className="text-sm font-medium">
            AURA's confidence boundary
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="border-l-2 border-[var(--color-warning)] pl-4">
          <p className="text-sm font-medium">
            I can't reliably predict short-term price movement.
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Short-term market movements are uncertain, and AURA shouldn't
            present a prediction as a fact.
          </p>
        </div>

        <div className="mt-7">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            A more useful question
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-primary)]">
            Instead of predicting {data.asset}'s next move, we can model how
            different outcomes could affect your portfolio.
          </p>
        </div>

        {data.alternatives?.length > 0 ? (
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {data.alternatives.map((alternative) => (
              <button
                key={alternative.label}
                type="button"
                onClick={() => onScenario?.(data.asset, alternative.change)}
                className="group flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ai)]"
              >
                <span className="text-sm font-medium">{alternative.label}</span>

                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="text-[var(--color-text-muted)] transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg bg-[var(--color-surface-subtle)] px-4 py-3">
            <p className="text-xs leading-5 text-[var(--color-text-secondary)]">
              Scenario modeling is available for assets represented in your
              current portfolio.
            </p>
          </div>
        )}

        <div className="mt-7 border-t border-[var(--color-border)] pt-5">
          <p className="text-xs leading-5 text-[var(--color-text-muted)]">
            AURA distinguishes modeled scenarios from predictions. Scenario
            outputs are illustrative and depend on the assumptions shown.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PredictionBoundaryWidget;
