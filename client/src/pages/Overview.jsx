import {
  Activity,
  ArrowRight,
  CircleGauge,
  PieChart,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";


import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { getPortfolioSummary, getRiskLabel } from "../services/portfolioEngine";
import { getFormattedDate, getGreeting } from "../utils/greeting";
import { getSimulatedPortfolio } from "../state/portfolioSimulation";

function Overview() {
  const simulatedState = getSimulatedPortfolio();

  const simulatedPortfolio = simulatedState?.simulation ?? null;

  const navigate = useNavigate();
  const summary = getPortfolioSummary();

  const riskLabel = getRiskLabel();

  const allocationLabels = {
    stock: "Stocks",
    mutual_fund: "Mutual funds",
    real_estate: "Real estate",
    crypto: "Crypto",
    cash: "Cash",
  };

  const allocationColors = {
    stock: "var(--color-chart-primary)",
    mutual_fund: "var(--color-ai)",
    real_estate: "var(--color-chart-secondary)",
    crypto: "var(--color-warning)",
    cash: "var(--color-chart-tertiary)",
  };

  const previousTechnologyExposure =
    summary.previousSnapshot.technologyExposure;

  const technologyExposure = summary.technologyExposure;

  const technologyChange = technologyExposure - previousTechnologyExposure;

  const technologyDirection =
    technologyChange > 0
      ? "increased"
      : technologyChange < 0
        ? "decreased"
        : "remained unchanged";

  const technologyStatus =
    summary.technologyDifference > 0
      ? "above"
      : summary.technologyDifference < 0
        ? "below"
        : "at";

  const monthlyGain = summary.performance.monthlyGain;

  const ytdPercent = summary.performance.ytdPercent;

  const greeting = getGreeting();

  const formattedDate = getFormattedDate();

  return (
    <div className="mx-auto w-full max-w-[1680px] py-8 sm:py-10 lg:py-12">
      {/* Overview hero */}
      <section className="mb-7 sm:mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
              {formattedDate}
            </p>

            <h1 className="mt-2 text-[2.15rem] font-semibold tracking-[-0.045em] text-[var(--color-text-primary)] sm:text-[2.75rem]">
              {greeting}, Kirti.
            </h1>

            <p className="mt-2 text-[15px] leading-6 text-[var(--color-text-secondary)]">
              Here's how your wealth is doing today.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-[13px] font-medium text-[var(--color-text-secondary)] sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-positive)]" />
            Updated today
          </div>
        </div>
      </section>

      {/* Wealth summary */}
      <section className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            ease: [0.2, 0.8, 0.2, 1],
          }}
          className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
        >
          <div className="grid lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.8fr)]">
            {/* Wealth metric */}
            <div className="flex flex-col justify-between p-6 sm:p-7 lg:p-8">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-ai-subtle)] text-[var(--color-ai)]">
                    <Sparkles size={14} strokeWidth={1.8} />
                  </span>

                  <p className="text-[12px] font-semibold uppercase tracking-[0.11em] text-[var(--color-ai)]">
                    Total wealth
                  </p>
                </div>

                <div className="mt-5">
                  <span className="block text-5xl font-semibold tracking-[-0.055em] text-[var(--color-text-primary)] sm:text-6xl">
                    ₹{(summary.totalValue / 100000).toFixed(1)}L
                  </span>

                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-positive-subtle)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-positive)]">
                    <TrendingUp size={13} strokeWidth={2} />+{ytdPercent}% YTD
                  </span>
                </div>

                <p className="mt-4 max-w-xs text-[14px] leading-6 text-[var(--color-text-secondary)]">
                  Current portfolio value across your tracked assets.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-positive-subtle)] text-[var(--color-positive)]">
                  <TrendingUp size={16} strokeWidth={1.7} />
                </div>

                <div>
                  <p className="text-[13px] font-medium text-[var(--color-text-secondary)]">
                    This month
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-[var(--color-positive)]">
                    +₹{(monthlyGain / 100000).toFixed(1)}L
                  </p>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="border-t border-[var(--color-border)] lg:border-l lg:border-t-0">
              <div className="p-6 sm:p-7 lg:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.11em] text-[var(--color-ai)]">
                      Portfolio performance
                    </p>

                    <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                      Indexed performance
                    </p>
                  </div>

                  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-2.5 py-1 text-[10px] font-semibold tracking-[0.04em] text-[var(--color-text-secondary)]">
                    YTD
                  </span>
                </div>

                <div className="mt-4">
                  <PerformanceChart data={summary.performanceHistory} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {simulatedPortfolio && (
        <section className="mb-10">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-ai-border)] bg-[var(--color-ai-subtle)] px-5 py-5 shadow-[var(--shadow-sm)] sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-text-primary)]">
                  Simulated strategy active
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {simulatedState?.strategy?.title}
                </p>
              </div>

              <span className="rounded-full border border-[var(--color-ai-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ai)]">
                {simulatedState?.strategy?.selectedTradeoff ?? "Balanced"}
              </span>
            </div>

            <div className="mt-5 grid gap-px overflow-hidden rounded-lg bg-[var(--color-border)] sm:grid-cols-3">
              <div className="bg-[var(--color-surface)] p-5">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Modeled technology
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {simulatedPortfolio.technologyExposure}%
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Target: {simulatedPortfolio.technologyTarget}%
                </p>
              </div>

              <div className="bg-[var(--color-surface)] p-5">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Modeled risk
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {simulatedPortfolio.riskScore}
                  <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
                    / 10
                  </span>
                </p>
              </div>

              <div className="bg-[var(--color-surface)] p-5">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Modeled value
                </p>

                <p className="mt-2 text-lg font-semibold">
                  ₹{(simulatedPortfolio.totalValue / 100000).toFixed(1)}L
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Compared with current portfolio
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-[11px] leading-5 text-[var(--color-text-secondary)]">
              This is a simulated outcome based on the approved strategy. Your
              actual portfolio remains unchanged.
            </p>
          </div>
        </section>
      )}

      {/* Portfolio insights */}
      <section className="mb-9">
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Portfolio Health */}
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.05,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ai)]">
                  Portfolio health
                </p>

                <p className="mt-1 text-[13px] leading-5 text-[var(--color-text-secondary)]">
                  Risk and diversification at a glance
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-ai-subtle)] text-[var(--color-ai)]">
                <CircleGauge size={17} strokeWidth={1.8} />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {/* Risk score */}
              <div className="flex items-center gap-4">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg
                    viewBox="0 0 120 120"
                    className="absolute inset-0 h-full w-full -rotate-90"
                    aria-hidden="true"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="var(--color-surface-subtle)"
                      strokeWidth="9"
                    />

                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="var(--color-risk)"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.PI * 100}`}
                      initial={{ strokeDashoffset: Math.PI * 100 }}
                      animate={{
                        strokeDashoffset:
                          Math.PI * 100 -
                          (Math.min(summary.riskScore, 10) / 10) *
                            (Math.PI * 100),
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.2, 0.8, 0.2, 1],
                      }}
                    />
                  </svg>

                  <div className="relative text-center">
                    <p className="text-2xl font-semibold tracking-[-0.04em]">
                      {summary.riskScore}
                    </p>

                    <p className="text-[10px] text-[var(--color-text-muted)]">
                      risk / 10
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {riskLabel} risk
                  </p>

                  <p className="mt-1 max-w-[200px] text-[13px] leading-5 text-[var(--color-text-secondary)]">
                    Your current portfolio risk profile based on concentration,
                    volatility, and crypto exposure.
                  </p>
                </div>
              </div>

              {/* Diversification */}
              <div className="rounded-xl bg-[var(--color-surface-subtle)] px-4 py-3.5">
                <p className="text-[13px] text-[var(--color-text-secondary)]">
                  Diversification
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <p className="shrink-0 text-lg font-semibold tracking-[-0.02em]">
                    {summary.diversificationScore}
                    <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
                      / 100
                    </span>
                  </p>

                  <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(summary.diversificationScore, 100)}%`,
                      }}
                      transition={{
                        duration: 0.7,
                        delay: 0.2,
                        ease: [0.2, 0.8, 0.2, 1],
                      }}
                      className="h-full rounded-full bg-[var(--color-positive)]"
                    />
                  </div>

                  <span className="shrink-0 text-xs font-medium text-[var(--color-positive)]">
                    {summary.diversificationScore >= 75
                      ? "Strong"
                      : summary.diversificationScore >= 50
                        ? "Balanced"
                        : "Limited"}
                  </span>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Allocation */}
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ai)]">
                  Allocation
                </p>

                <p className="mt-1 text-[13px] leading-5 text-[var(--color-text-secondary)]">
                  Where your portfolio is invested
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]">
                <PieChart size={17} strokeWidth={1.8} />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-8">
              {/* Donut */}
              <div
                className="relative h-28 w-28 shrink-0 rounded-full"
                style={{
                  background: `conic-gradient(${Object.entries(
                    summary.assetAllocation,
                  )
                    .reduce((segments, [assetType, value]) => {
                      const start = segments.length
                        ? segments[segments.length - 1].end
                        : 0;

                      const end = start + value;

                      segments.push({
                        assetType,
                        start,
                        end,
                      });

                      return segments;
                    }, [])
                    .map(
                      ({ assetType, start, end }) =>
                        `${allocationColors[assetType] || "var(--color-chart-muted)"} ${start}% ${end}%`,
                    )
                    .join(", ")})`,
                }}
              >
                <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-[var(--color-surface)]">
                  <span className="text-lg font-semibold tracking-[-0.03em]">
                    100%
                  </span>

                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    allocated
                  </span>
                </div>
              </div>

              {/* Allocation legend */}
              <div className="min-w-0 flex-1 space-y-3">
                {Object.entries(summary.assetAllocation).map(
                  ([assetType, value]) => (
                    <div
                      key={assetType}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              allocationColors[assetType] ||
                              "var(--color-chart-muted)",
                          }}
                        />

                        <span className="truncate text-[13px] text-[var(--color-text-secondary)]">
                          {allocationLabels[assetType] || assetType}
                        </span>
                      </div>

                      <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                        {value}%
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </motion.article>

          {/* AURA Signal */}
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.15,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="flex h-full overflow-hidden rounded-2xl border border-[var(--color-ai-border)] bg-[var(--color-ai-subtle)] shadow-[var(--shadow-sm)]"
          >
            <div className="flex h-full flex-col p-5 sm:p-6">
              <div className="flex min-w-0 gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-ai)] shadow-[var(--shadow-sm)]">
                  <Sparkles size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ai)]">
                      AURA signal
                    </p>

                    <span className="rounded-full border border-[var(--color-warning)] bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-warning)]">
                      Attention
                    </span>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.025em] text-[var(--color-text-primary)] sm:text-[20px] sm:leading-7">
                      Technology concentration is above target
                    </h2>

                    <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[var(--color-text-secondary)]">
                      Your technology exposure is {technologyExposure}%, up from{" "}
                      {previousTechnologyExposure}%, and{" "}
                      {Math.abs(summary.technologyDifference)} percentage points{" "}
                      {technologyStatus} your {summary.technologyTarget}%
                      target.
                    </p>
                  </div>
                </div>
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
                className="group mx-auto mt-auto mb-8 inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-ai)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/15">
                  <Sparkles size={10} strokeWidth={2} />
                </span>

                <span>Explore with AURA</span>

                <ArrowRight
                  size={14}
                  strokeWidth={1.9}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Recent changes */}
      <section className="pb-8 pt-1 sm:pb-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.11em] text-[var(--color-ai)]">
              Recent changes
            </p>

            <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
              What's changed in your portfolio
            </p>
          </div>

          <Activity
            size={17}
            strokeWidth={1.7}
            className="text-[var(--color-text-muted)]"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
          {summary.activity.map((item, index) => {
            const isPositive = item.tone === "positive";
            const isRisk = item.tone === "risk";

            const Icon = isPositive
              ? TrendingUp
              : isRisk
                ? TrendingDown
                : Activity;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.05,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className={`group flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-[var(--color-surface-hover)] sm:px-6 ${
                  index !== summary.activity.length - 1
                    ? "border-b border-[var(--color-border)]"
                    : ""
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isPositive
                      ? "bg-[var(--color-positive-subtle)] text-[var(--color-positive)]"
                      : isRisk
                        ? "bg-[var(--color-risk-subtle)] text-[var(--color-risk)]"
                        : "bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]"
                  }`}
                >
                  <Icon size={15} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                    {item.title}
                  </p>

                  <p
                    className={`mt-0.5 truncate text-xs ${
                      isPositive
                        ? "text-[var(--color-positive)]"
                        : isRisk
                          ? "text-[var(--color-risk)]"
                          : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {item.detail}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {item.time}
                  </span>

                  <ArrowRight
                    size={14}
                    strokeWidth={1.7}
                    className="text-[var(--color-text-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-text-secondary)]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function PerformanceChart({ data }) {
  if (!data?.length) {
    return null;
  }

  const width = 900;
  const height = 220;
  const paddingX = 4;
  const paddingY = 12;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x =
      paddingX +
      (index / Math.max(data.length - 1, 1)) * (width - paddingX * 2);

    const y =
      height -
      paddingY -
      ((value - minValue) / range) * (height - paddingY * 2);

    return { x, y };
  });

  const linePath = points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");

  const areaPath = `${linePath} L ${width - paddingX} ${height} L ${paddingX} ${height} Z`;

  return (
  <div className="relative h-52 w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] sm:h-56">
    {/* Chart plotting area */}
    <div className="pointer-events-none absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between px-4 py-4">
      <span className="border-t border-[var(--color-border)]/60" />
      <span className="border-t border-[var(--color-border)]/40" />
      <span className="border-t border-[var(--color-border)]/60" />
    </div>

    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="relative h-[calc(100%-32px)] w-full"
      role="img"
      aria-label="Portfolio performance chart"
    >
      <defs>
        <linearGradient
          id="portfolio-chart-fill"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="var(--color-chart-primary)"
            stopOpacity="0.16"
          />

          <stop
            offset="100%"
            stopColor="var(--color-chart-primary)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      <motion.path
        d={areaPath}
        fill="url(#portfolio-chart-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      />

      <motion.path
        d={linePath}
        fill="none"
        stroke="var(--color-chart-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: {
            duration: 0.9,
            ease: [0.2, 0.8, 0.2, 1],
          },
          opacity: {
            duration: 0.25,
          },
        }}
      />

      {points.length > 0 && (
        <motion.circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="5"
          fill="var(--color-surface)"
          stroke="var(--color-chart-primary)"
          strokeWidth="3"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.85, duration: 0.25 }}
        />
      )}
    </svg>

    {/* Chart labels */}
    <div className="pointer-events-none absolute inset-x-4 bottom-2 flex justify-between text-[11px] font-medium text-[var(--color-text-muted)]">
      <span>Start</span>
      <span>Today</span>
    </div>
  </div>
);
}

export default Overview;
