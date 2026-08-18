import { portfolio } from "../data/portfolio";
import { calculateSimulatedPortfolio } from "../services/portfolioEngine";

let simulatedPortfolio = null;

export function getSimulatedPortfolio() {
  return simulatedPortfolio;
}

export function approveSimulatedStrategy(strategy) {
  if (!strategy?.actions?.length) {
    return null;
  }

  const simulation = calculateSimulatedPortfolio(strategy);

  if (!simulation) {
    return null;
  }

  simulatedPortfolio = {
    basePortfolio: portfolio,
    strategy,
    simulation,
    approvedAt: new Date().toISOString(),
  };

  return simulatedPortfolio;
}

export function clearSimulatedPortfolio() {
  simulatedPortfolio = null;
}
