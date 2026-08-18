const levelStyles = {
  high: {
    text: "text-[var(--color-risk)]",
    indicator: "bg-[var(--color-risk)]",
  },

  elevated: {
    text: "text-[var(--color-risk)]",
    indicator: "bg-[var(--color-risk)]",
  },

  medium: {
    text: "text-[var(--color-warning)]",
    indicator: "bg-[var(--color-warning)]",
  },

  low: {
    text: "text-[var(--color-positive)]",
    indicator: "bg-[var(--color-positive)]",
  },

  good: {
    text: "text-[var(--color-positive)]",
    indicator: "bg-[var(--color-positive)]",
  },
};

function RiskBreakdown({ factors }) {
  return (
    <div className="divide-y divide-[var(--color-border)]">
      {factors.map((factor) => {
        const styles = levelStyles[factor.level] ?? levelStyles.medium;

        return (
          <div
            key={factor.key}
            className="grid gap-4 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {factor.label}
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                {factor.description}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:justify-self-end">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.indicator}`}
                aria-hidden="true"
              />

              <span className={`text-xs font-medium capitalize ${styles.text}`}>
                {factor.level}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RiskBreakdown;
