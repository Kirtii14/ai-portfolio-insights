import {
  LayoutDashboard,
  PieChart,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { motion } from "motion/react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Overview",
    path: "/overview",
    icon: LayoutDashboard,
  },
  {
    label: "Portfolio",
    path: "/portfolio",
    icon: PieChart,
  },
  {
    label: "AURA",
    path: "/aura",
    icon: Sparkles,
  },
  {
    label: "Scenarios",
    path: "/scenarios",
    icon: SlidersHorizontal,
  },
];

function Navigation({ variant = "mobile" }) {
  const isDesktop = variant === "desktop";

  if (isDesktop) {
    return (
      <nav
        aria-label="Primary navigation"
        className="flex w-[58px] flex-col items-center gap-2.5 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 shadow-[var(--shadow-sm)]"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="active-navigation-desktop"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-xl bg-[var(--color-text-primary)]"
                    />
                  )}

                  <Icon
                    size={19}
                    strokeWidth={1.8}
                    className={`relative z-10 transition-all duration-200 ${
                      isActive
                        ? "text-[var(--color-bg)]"
                        : "text-[var(--color-text-secondary)] group-hover:-translate-y-0.5 group-hover:text-[var(--color-text-primary)]"
                    }`}
                  />

                  {/* Small hover label */}
                  <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-50 -translate-y-1/2 translate-x-[-3px] whitespace-nowrap rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--color-text-primary)] opacity-0 shadow-[var(--shadow-sm)] transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Primary navigation"
      className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[var(--shadow-sm)]"
    >
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className="relative rounded-lg px-3 py-1.5 text-sm font-medium"
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="active-navigation-mobile"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                  className="absolute inset-0 rounded-md bg-[var(--color-text-primary)]"
                />
              )}

              <span
                className={`relative z-10 transition-colors duration-150 ${
                  isActive
                    ? "text-[var(--color-bg)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;
