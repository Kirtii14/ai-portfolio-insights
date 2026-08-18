import { ArrowUpRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getPortfolioSummary,
  getTopHoldings,
  calculateSimulatedPortfolio,
  getRiskLabel,
} from "../services/portfolioEngine";

import AllocationChart from "../components/portfolio/AllocationChart";
import RiskBreakdown from "../components/portfolio/RiskBreakdown";
import { getSimulatedPortfolio } from "../state/portfolioSimulation";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatLakhs = (value) => `₹${(value / 100000).toFixed(1)}L`;

const assetLabels = {
  stock: "Stocks",
  mutual_fund: "Mutual Funds",
  real_estate: "Real Estate",
  crypto: "Crypto",
  cash: "Cash",
};

function Portfolio() {
  const summary = getPortfolioSummary();

  const riskLabel = getRiskLabel();

  const simulatedState = getSimulatedPortfolio();
  const navigate = useNavigate();

  const simulatedPortfolio = simulatedState
    ? calculateSimulatedPortfolio(simulatedState.strategy)
    : null;

  const riskFactors = summary.riskBreakdown;
  const topHoldings = getTopHoldings(6);

  const holdingCount = summary.holdingCount;

  const assetClassCount = Object.keys(summary.assetAllocation).length;

  return (
    <div className="mx-auto w-full max-w-[1680px] py-8 sm:py-10 lg:py-12">
      {/* Header */}
      <section className="mb-14 sm:mb-16">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
          Your portfolio
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-[52px] lg:leading-none">
              {formatLakhs(summary.totalValue)}
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
              {holdingCount} holdings across {assetClassCount} asset classes
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              document.getElementById("holdings")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ai)]"
          >
            View holdings
            <ArrowUpRight size={15} strokeWidth={1.8} />
          </button>
        </div>
      </section>

      {simulatedPortfolio && (
        <section className="mb-10">
          <div className="rounded-lg border border-[var(--color-ai)]/20 bg-[var(--color-ai)]/5 px-4 py-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium">Simulated strategy active</p>

              <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ai)]">
                {simulatedPortfolio.strategy.selectedTradeoff ?? "Balanced"}
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
              This view shows your original portfolio snapshot. The approved
              strategy is simulated only and does not represent real trades.
            </p>
          </div>
        </section>
      )}

      {/* Simulated outcome */}
      {simulatedPortfolio && (
        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-primary)]">
              Simulated outcome
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
              This is the modeled result of the strategy you approved. It does
              not change your actual portfolio.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="grid sm:grid-cols-3">
              {/* Portfolio value */}
              <div className="border-b border-[var(--color-border)] p-5 sm:border-b-0 sm:border-r sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Portfolio value
                </p>

                <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                  {formatCurrency(simulatedPortfolio.totalValue)}
                </p>
              </div>

              {/* Technology exposure */}
              <div className="border-b border-[var(--color-border)] p-5 sm:border-b-0 sm:border-r sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Technology exposure
                </p>

                <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                  {simulatedPortfolio.technologyExposure}%
                </p>

                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Target: {simulatedPortfolio.technologyTarget}%
                </p>
              </div>

              {/* Modeled risk */}
              <div className="p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Modeled risk
                </p>

                <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                  {simulatedPortfolio.riskScore}
                  <span className="ml-1 text-sm font-normal text-[var(--color-text-muted)]">
                    / 10
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Asset allocation */}
      <section className="mb-14">
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          {/* Section header */}
          <div className="flex flex-col gap-2 border-b border-[var(--color-border)] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ai)]">
                Asset allocation
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
                How your ₹{(summary.totalValue / 100000).toFixed(1)}L is
                distributed across the major parts of your wealth.
              </p>
            </div>

            <span className="text-xs text-[var(--color-positive)]">
              100% allocated
            </span>
          </div>

          {/* Allocation visualization + concentration insight */}
          <div className="p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
              {/* Allocation visualization */}
              <div className="min-w-0">
                <AllocationChart allocation={summary.assetAllocation} />
              </div>

              {/* Concentration insight */}
              <div className="flex h-full flex-col justify-between rounded-xl border border-[var(--color-warning)]/25 bg-[var(--color-warning)]/5 p-4 sm:p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-warning)]">
                    Concentration worth watching
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                    Technology represents{" "}
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {summary.technologyExposure}%
                    </span>{" "}
                    of your portfolio against a{" "}
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {summary.technologyTarget}%
                    </span>{" "}
                    target.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                    This is above your recommended range and may increase
                    portfolio volatility.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/aura", {
                      state: {
                        initialQuestion: "How exposed am I to tech volatility?",
                      },
                    })
                  }
                  className="group mt-5 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[var(--color-warning)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/15">
                    <Sparkles size={10} strokeWidth={2} />
                  </span>

                  <span>Explore with AURA</span>

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.8}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Portfolio intelligence */}
      <section className="mb-14">
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ai)]">
              Portfolio intelligence
            </p>
          </div>

          <div className="grid sm:grid-cols-3">
            {/* Portfolio risk */}
            <div className="border-b border-[var(--color-border)] p-5 sm:border-b-0 sm:border-r sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-risk)]">
                Portfolio risk
              </p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-[-0.04em]">
                  {summary.riskScore}
                </span>

                <span className="text-sm text-[var(--color-text-primary)]">
                  / 10
                </span>
              </div>

              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Elevated
              </p>
            </div>

            {/* Technology exposure */}
            <div className="border-b border-[var(--color-border)] p-5 sm:border-b-0 sm:border-r sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-warning)]">
                Technology exposure
              </p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-[-0.04em]">
                  {summary.technologyExposure}%
                </span>

                <span className="text-xs font-medium text-[var(--color-risk)]">
                  +{summary.technologyDifference}pp
                </span>
              </div>

              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Target: {summary.technologyTarget}%
              </p>
            </div>

            {/* Biggest risk driver */}
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-risk)]">
                Biggest risk driver
              </p>

              <p className="mt-4 text-lg font-semibold tracking-[-0.02em]">
                Technology concentration
              </p>

              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                Several holdings and diversified funds are exposed to
                technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk breakdown */}
      <section className="mb-14">
        <div className="mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ai)]">
            Risk breakdown
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
            AURA looks beyond a single score to show what is actually driving
            your portfolio's risk.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <RiskBreakdown factors={riskFactors} />
        </div>
      </section>

      {/* Top holdings */}
      <section id="holdings">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ai)]">
              Largest holdings
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              Your largest positions by portfolio value.
            </p>
          </div>

          <span className="text-right text-xs text-[var(--color-warning)] sm:w-[180px]">
            By portfolio value
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="divide-y divide-[var(--color-border)]">
            {topHoldings.map((holding) => (
              <div
                key={holding.id}
                className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8 sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{holding.name}</p>

                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {assetLabels[holding.assetType]} · {holding.region}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency(holding.value)}
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {holding.allocation}% of portfolio
                  </p>
                </div>

                <div className="text-xs font-medium text-[var(--color-positive)] sm:w-20 sm:text-right">
                  +{holding.returnYtd}% YTD
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
