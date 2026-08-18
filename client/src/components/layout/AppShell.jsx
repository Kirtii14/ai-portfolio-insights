import { AnimatePresence } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import PageTransition from "../ui/PageTransition";

function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Header />

      <main className="w-full px-4 sm:px-6 md:pl-[88px] md:pr-6 lg:pl-[92px] lg:pr-8">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AppShell;
