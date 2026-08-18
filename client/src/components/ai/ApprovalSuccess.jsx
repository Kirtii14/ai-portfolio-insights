import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";

function ApprovalSuccess({ strategy, onReset }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="p-6 sm:p-8">
        {/* Success */}

        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.1,
              duration: 0.3,
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-positive-soft)] text-[var(--color-positive)]"
          >
            <Check size={19} strokeWidth={2} />
          </motion.div>

          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              Strategy approved
              <Sparkles
                size={14}
                strokeWidth={1.8}
                className="text-[var(--color-ai)]"
              />
            </p>

            {strategy.selectedTradeoff && (
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[var(--color-ai)]">
                {strategy.selectedTradeoff} strategy selected
              </p>
            )}

            <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
              The selected strategy has been approved for simulation. No real
              trades or money movement occurred.
            </p>
          </div>
        </div>

        {/* Before → After */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ResultMetric
            label="Technology"
            before={`${strategy.before.technologyExposure}%`}
            after={`${strategy.selectedStrategy?.technologyExposure ?? strategy.after.technologyExposure}%`}
          />

          <ResultMetric
            label="Portfolio risk"
            before={`${strategy.before.riskScore}`}
            after={`${strategy.selectedStrategy?.riskScore ?? strategy.after.riskScore}`}
          />

          <ResultMetric
            label="Diversification"
            before={strategy.before.diversificationScore}
            after={
              strategy.selectedStrategy?.diversificationScore ??
              strategy.after.diversificationScore
            }
          />
        </div>

        {/* Status */}
        <div className="mt-8 border-t border-[var(--color-border)] pt-5">
          <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[var(--color-text-muted)]">
              Prototype status
            </span>

            <span className="font-medium text-[var(--color-positive)]">
              Simulated execution complete
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-6 text-sm font-medium text-[var(--color-text-secondary)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:text-[var(--color-text-primary)]"
        >
          Start another analysis
        </button>
      </div>
    </motion.section>
  );
}

function ResultMetric({ label, before, after }) {
  return (
    <div className="rounded-lg bg-[var(--color-surface-subtle)] p-4">
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-sm text-[var(--color-text-muted)]">{before}</span>

        <span className="text-[var(--color-text-secondary)]" aria-hidden="true">
          →
        </span>

        <span className="text-lg font-semibold text-[var(--color-positive)]">
          {after}
        </span>
      </div>
    </div>
  );
}

export default ApprovalSuccess;
