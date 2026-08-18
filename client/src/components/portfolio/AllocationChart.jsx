import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const assetLabels = {
  stock: "Stocks",
  mutual_fund: "Mutual Funds",
  real_estate: "Real Estate",
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

function AllocationChart({ allocation }) {
  const data = Object.entries(allocation).map(([assetType, value]) => ({
    assetType,
    name: assetLabels[assetType] ?? assetType,
    value,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
      {/* Donut */}
      <div className="h-52 w-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={66}
              outerRadius={88}
              paddingAngle={1}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.assetType}
                  fill={
                    allocationColors[entry.assetType] ??
                    "var(--color-chart-muted)"
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value}%`, "Allocation"]}
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-text-primary)",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Donut center */}
        <div className="-mt-[9.5rem] flex h-24 w-52 items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold tracking-[-0.03em]">{total}%</p>

            <p className="text-[10px] text-[var(--color-text-muted)]">
              allocated
            </p>
          </div>
        </div>
      </div>

      {/* Allocation legend */}
      <div className="w-full divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {data.map((item) => {
          const color =
            allocationColors[item.assetType] ?? "var(--color-chart-muted)";

          return (
            <div
              key={item.assetType}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />

                <span className="text-sm text-[var(--color-text-secondary)]">
                  {item.name}
                </span>
              </div>

              <span className="text-sm font-medium">{item.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllocationChart;
