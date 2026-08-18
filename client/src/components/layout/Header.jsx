import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/ThemeContext";
import Navigation from "./Navigation";

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop / tablet navigation */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[76px] md:flex md:flex-col md:items-center md:justify-between md:border-r md:border-[var(--color-border)] md:bg-[var(--color-sidebar)] md:py-6 md:backdrop-blur-sm">
        <a
          href="/overview"
          aria-label="AI Portfolio Insights"
          className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--color-border-strong)] bg-[var(--color-text-primary)] text-sm font-semibold text-[var(--color-bg)] shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
        >
          ✦
        </a>

        <Navigation variant="desktop" />

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "dark" ? "light" : "dark"
            } theme`}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-text-secondary)] transition-all duration-150 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ai)]"
          >
            {theme === "dark" ? (
              <Sun size={17} strokeWidth={1.8} />
            ) : (
              <Moon size={17} strokeWidth={1.8} />
            )}
          </button>

          <button
            type="button"
            aria-label="Maya profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-text-primary)] text-[11px] font-semibold text-[var(--color-bg)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ai)]"
          >
            K
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm md:hidden">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-6">
          <a
            href="/overview"
            className="shrink-0 text-sm font-semibold tracking-[-0.01em] text-[var(--color-text-primary)]"
          >
            AI Portfolio Insights
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } theme`}
              className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ai)]"
            >
              {theme === "dark" ? (
                <Sun size={16} strokeWidth={1.8} />
              ) : (
                <Moon size={16} strokeWidth={1.8} />
              )}
            </button>

            <button
              type="button"
              aria-label="Maya profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-text-primary)] text-[10px] font-semibold text-[var(--color-bg)]"
            >
              K
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)]">
          <div className="mx-auto max-w-7xl overflow-x-auto px-5 py-2 sm:px-6">
            <Navigation variant="mobile" />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
