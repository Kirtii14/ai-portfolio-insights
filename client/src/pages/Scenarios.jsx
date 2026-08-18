import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScenarioWidget from "../components/ai/ScenarioWidget";
import {
  getPortfolio,
  runAssetScenario,
  runTechnologyScenario,
} from "../services/portfolioEngine";

function Scenarios() {

  const navigate = useNavigate();
  const portfolio = useMemo(() => getPortfolio(), []);

  const [scenarioType, setScenarioType] = useState("technology");
  const [selectedAssetId, setSelectedAssetId] = useState(
    portfolio.holdings[0]?.id ?? "",
  );

  const [changePercent, setChangePercent] = useState(-20);

  const scenarioData = useMemo(() => {
    if (scenarioType === "technology") {
      return runTechnologyScenario(changePercent);
    }

    if (!selectedAssetId) {
      return null;
    }

    return runAssetScenario(selectedAssetId, changePercent);
  }, [scenarioType, selectedAssetId, changePercent]);

  const handleScenarioTypeChange = (type) => {
    setScenarioType(type);
  };

  return (
    <div className="py-10 sm:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <section className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Portfolio analysis
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Scenario Analysis
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
            Explore how modeled changes in your portfolio could affect value,
            risk, and the holdings contributing to that outcome.
          </p>
        </section>

        {/* Scenario controls */}
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
            <p className="text-sm font-medium">Build a scenario</p>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
              Change one assumption and see how the portfolio responds.
            </p>
          </div>

          <div className="p-5 sm:p-7">
            {/* Scenario type */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                Scenario type
              </p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleScenarioTypeChange("technology")}
                  className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                    scenarioType === "technology"
                      ? "border-[var(--color-ai)] bg-[var(--color-ai)]/5"
                      : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  <p className="text-sm font-medium">Technology exposure</p>

                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Model a technology-sector decline.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleScenarioTypeChange("asset")}
                  className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                    scenarioType === "asset"
                      ? "border-[var(--color-ai)] bg-[var(--color-ai)]/5"
                      : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  <p className="text-sm font-medium">Individual holding</p>

                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Model a move in one portfolio holding.
                  </p>
                </button>
              </div>
            </div>

            {/* Asset selector */}
            {scenarioType === "asset" && (
              <div className="mt-7">
                <label
                  htmlFor="scenario-asset"
                  className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]"
                >
                  Holding
                </label>

                <select
                  id="scenario-asset"
                  value={selectedAssetId}
                  onChange={(event) => setSelectedAssetId(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-ai)]"
                >
                  {portfolio.holdings.map((holding) => (
                    <option key={holding.id} value={holding.id}>
                      {holding.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Change control */}
            <div className="mt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                    Modeled change
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                    This assumption is used only for scenario modeling.
                  </p>
                </div>

                <span className="text-xl font-semibold tracking-[-0.03em]">
                  {changePercent}%
                </span>
              </div>

              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={changePercent}
                onChange={(event) =>
                  setChangePercent(Number(event.target.value))
                }
                aria-label="Modeled percentage change"
                className="mt-5 w-full accent-[var(--color-ai)]"
              />

              <div className="mt-2 flex justify-between text-xs text-[var(--color-text-muted)]">
                <span>−30%</span>
                <span>0%</span>
                <span>+30%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Scenario result */}
        {scenarioData && (
          <ScenarioWidget
            data={scenarioData}
            onStrategy={() =>
              navigate("/aura", {
                state: {
                  initialQuestion: "How can I reduce this risk?",
                },
              })
            }
          />
        )}

        {!scenarioData && (
          <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <p className="text-sm font-medium">Scenario unavailable</p>

            <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
              The selected holding could not be modeled from the current
              portfolio snapshot.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Scenarios;
