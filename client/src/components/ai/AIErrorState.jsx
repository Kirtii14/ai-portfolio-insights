import { AlertCircle, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

function AIErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      role="alert"
      className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-risk-soft)] text-[var(--color-risk)]">
          <AlertCircle size={17} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium">
            AURA couldn't complete that analysis.
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
            {message ||
              "Something interrupted the analysis. Please try asking again."}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] underline decoration-[var(--color-border-strong)] underline-offset-4"
            >
              <RotateCcw size={14} strokeWidth={1.8} />
              Try again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default AIErrorState;
