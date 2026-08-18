import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

const formatAmount = (amount) => `₹${Math.abs(amount).toLocaleString("en-IN")}`;

function TaxLossHarvestingWidget({ data, onReview }) {
  const candidates = data?.candidates ?? [];

  return (
    <section
      aria-label="Tax-loss harvesting opportunity"
      className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <ShieldCheck
            size={16}
            strokeWidth={1.8}
            className="text-[var(--color-ai)]"
          />

          <span className="text-sm font-medium">
            Potential tax-loss opportunity
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {candidates.length > 0 ? (
          <>
            <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
              AURA found simulated holdings currently below their modeled cost
              basis. These may be relevant to a tax-loss harvesting workflow.
            </p>

            <div className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {candidates.map((candidate) => (
                <div
                  key={candidate.holdingId}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{candidate.holding}</p>

                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Current value {formatAmount(candidate.currentValue)} ·
                      Cost basis {formatAmount(candidate.costBasis)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-[var(--color-risk)]">
                      −{formatAmount(candidate.unrealizedLoss)}
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {Math.abs(candidate.lossPercent).toFixed(1)}% modeled loss
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onReview}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ai)]"
            >
              Review opportunity
              <ArrowRight size={15} strokeWidth={1.8} />
            </button>
          </>
        ) : (
          <div className="flex gap-3 rounded-lg bg-[var(--color-surface-subtle)] px-4 py-4">
            <AlertTriangle
              size={16}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-[var(--color-warning)]"
            />

            <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
              No modeled unrealized-loss candidates were found in the current
              portfolio.
            </p>
          </div>
        )}

        <div className="mt-7 border-t border-[var(--color-border)] pt-5">
          <p className="text-xs leading-5 text-[var(--color-text-muted)]">
            This is a simulated portfolio analysis, not tax advice. Actual
            eligibility and tax treatment depend on your jurisdiction, account,
            holding period, and applicable rules. No real trades are executed.
          </p>
        </div>

        {data?.assumptions?.length > 0 && (
          <details className="mt-5">
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
        )}
      </div>
    </section>
  );
}

export default TaxLossHarvestingWidget;
