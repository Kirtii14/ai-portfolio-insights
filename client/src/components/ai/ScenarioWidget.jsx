import { useMemo, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowRight } from "lucide-react";
import { runTechnologyScenario } from "../../services/portfolioEngine";

const formatLakhs = (value) => `₹${(value / 100000).toFixed(2)}L`;

const formatImpact = (value) => `₹${(value / 100000).toFixed(2)}L`;

function ScenarioWidget({ data, onStrategy }) {
  const initialDecline = Math.abs(
    data.scenario.declinePercent ?? data.scenario.changePercent ?? 20,
  );

  const isTechnologyScenario = data.scenario.asset === "Technology";

  const [decline, setDecline] = useState(initialDecline);

  const scenario = useMemo(() => {
    if (isTechnologyScenario) {
      return runTechnologyScenario(decline);
    }

    return {
      ...data,
      scenario: {
        ...data.scenario,
        changePercent: data.scenario.changePercent ?? -decline,
      },
    };
  }, [decline, data, isTechnologyScenario]);

  const isLoss = scenario.scenarioValue < scenario.currentValue;

  return (
    <section
      aria-label={`${scenario.scenario.asset} scenario analysis`}
      className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      {/* Header */}
      <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={16}
              strokeWidth={1.8}
              className="text-[var(--color-warning)]"
            />

            <span className="text-sm font-medium">Scenario Lab</span>
          </div>

          <span className="text-xs text-[var(--color-text-muted)]">
            Modeled outcome
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Scenario control */}
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium">
                {scenario.scenario.asset} decline
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                Explore how the portfolio responds to different levels of
                stress.
              </p>
            </div>

            <span className="shrink-0 text-2xl font-semibold tracking-[-0.04em]">
              −{decline}%
            </span>
          </div>

          <div className="mt-6">
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={decline}
              onChange={(event) => setDecline(Number(event.target.value))}
              aria-label={`${scenario.scenario.asset} decline percentage`}
              className="w-full accent-[var(--color-ai)]"
            />

            <div className="mt-2 flex justify-between text-xs text-[var(--color-text-muted)]">
              <span>0%</span>
              <span>−15%</span>
              <span>−30%</span>
            </div>
          </div>
        </div>

        {/* Cause → effect */}
        <div className="mt-8 border-y border-[var(--color-border)] py-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Portfolio impact
          </p>

          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <ImpactStep
              label="Current"
              value={formatLakhs(scenario.currentValue)}
            />

            <ArrowRight
              size={16}
              className="hidden text-[var(--color-text-muted)] sm:block"
              aria-hidden="true"
            />

            <ImpactStep
              label="Estimated impact"
              value={`−${formatImpact(scenario.valueImpact)}`}
              emphasized
            />

            <ArrowRight
              size={16}
              className="hidden text-[var(--color-text-muted)] sm:block"
              aria-hidden="true"
            />

            <ImpactStep
              label="Modeled value"
              value={formatLakhs(scenario.scenarioValue)}
              emphasized
            />
          </div>
        </div>

        {/* Visual value change */}
        <div className="mt-7">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-muted)]">
              Portfolio value
            </span>

            <span className="font-medium">
              {scenario.portfolioImpactPercent}% impact
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]">
            <div
              className="h-full rounded-full bg-[var(--color-text-primary)] transition-all duration-300"
              style={{
                width: `${Math.max(
                  5,
                  100 - scenario.portfolioImpactPercent * 3,
                )}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-[var(--color-text-muted)]">
            <span>{formatLakhs(scenario.scenarioValue)}</span>

            <span>{formatLakhs(scenario.currentValue)}</span>
          </div>
        </div>

        {/* Risk */}
        <div className="mt-7 grid gap-px overflow-hidden rounded-lg bg-[var(--color-border)] sm:grid-cols-2">
          <div className="bg-[var(--color-surface)] p-4">
            <p className="text-xs text-[var(--color-text-muted)]">
              Current risk
            </p>

            <p className="mt-2 text-xl font-semibold">
              {scenario.currentRisk}
              <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
                / 10
              </span>
            </p>
          </div>

          <div className="bg-[var(--color-surface)] p-4">
            <p className="text-xs text-[var(--color-text-muted)]">
              Modeled risk
            </p>

            <p className="mt-2 text-xl font-semibold text-[var(--color-warning)]">
              {scenario.scenarioRisk}
              <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
                / 10
              </span>
            </p>
          </div>
        </div>

        {/* Affected holdings */}
        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Affected holdings
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Positions contributing to this scenario.
              </p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {scenario.affectedHoldings.slice(0, 6).map((holding) => (
              <div
                key={holding.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{holding.name}</p>

                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {holding.exposure ?? holding.allocation}% exposure
                  </p>
                </div>

                <ArrowDown
                  size={14}
                  className="shrink-0 text-[var(--color-risk)]"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Trust layer */}
        <div className="mt-8 border-l-2 border-[var(--color-ai)] pl-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            How to read this
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            This scenario assumes the selected exposure moves by the amount
            shown while other holdings remain unchanged.
          </p>

          <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
            This is a modeled scenario, not a prediction.
          </p>
        </div>

        {/* Next action */}
        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Want to reduce this risk?</p>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
              AURA can model a portfolio adjustment toward your target.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onStrategy?.()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ai)]"
          >
            Explore strategy
            <ArrowRight size={15} strokeWidth={1.8} />
          </button>
        </div>

        {/* Assumptions */}
        {scenario.assumptions?.length > 0 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-xs font-medium text-[var(--color-text-secondary)]">
              View calculation assumptions
            </summary>

            <ul className="mt-3 space-y-2 text-xs leading-5 text-[var(--color-text-muted)]">
              {scenario.assumptions.map((assumption) => (
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

function ImpactStep({ label, value, emphasized = false }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>

      <p
        className={`mt-2 tracking-[-0.025em] ${
          emphasized ? "text-xl font-semibold" : "text-lg font-medium"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default ScenarioWidget;
