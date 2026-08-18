import { ShieldCheck } from "lucide-react";

const levelStyles = {
  high: {
    text: "text-[var(--color-risk)]",
    dot: "bg-[var(--color-risk)]",
  },

  elevated: {
    text: "text-[var(--color-risk)]",
    dot: "bg-[var(--color-risk)]",
  },

  medium: {
    text: "text-[var(--color-warning)]",
    dot: "bg-[var(--color-warning)]",
  },

  low: {
    text: "text-[var(--color-positive)]",
    dot: "bg-[var(--color-positive)]",
  },

  good: {
    text: "text-[var(--color-positive)]",
    dot: "bg-[var(--color-positive)]",
  },
};

function RiskAnalysisWidget({ data }) {
  return (
    <section
      aria-label="Portfolio risk analysis"
      className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <ShieldCheck
            size={16}
            strokeWidth={1.8}
            className="text-[var(--color-ai)]"
          />

          <span className="text-sm font-medium">Portfolio risk</span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-end gap-3">
          <span className="text-4xl font-semibold tracking-[-0.04em]">
            {data.score}
          </span>

          <span className="pb-1 text-sm text-[var(--color-text-secondary)]">
            / 10
          </span>

          <span className="pb-1 text-sm text-[var(--color-warning)]">
            Moderate
          </span>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
          Your portfolio is diversified across several asset classes, but a few
          characteristics currently contribute more to risk than others.
        </p>

        <div className="mt-7 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {data.factors.map((factor) => {
            const styles = levelStyles[factor.level] ?? levelStyles.medium;

            return (
              <div
                key={factor.key}
                className="grid gap-3 py-4 sm:grid-cols-[180px_1fr_auto] sm:items-center"
              >
                <span className="text-sm font-medium">{factor.label}</span>

                <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                  {factor.description}
                </p>

                <div
                  className={`flex items-center gap-2 text-xs font-medium capitalize ${styles.text}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                    aria-hidden="true"
                  />

                  {factor.level}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-l-2 border-[var(--color-ai)] pl-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            AURA's takeaway
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-primary)]">
            Technology concentration is currently the most actionable risk
            driver. You don't necessarily need to reduce it immediately, but
            it's worth exploring how the portfolio behaves under a technology
            drawdown.
          </p>
        </div>
      </div>
    </section>
  );
}

export default RiskAnalysisWidget;
