import { portfolio } from "../data/portfolio";

const round = (value, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export function getPortfolio() {
  return portfolio;
}

export function getTotalValue() {
  return portfolio.holdings.reduce(
    (total, holding) => total + holding.value,
    0,
  );
}

export function getAssetAllocation() {
  const allocation = {};

  for (const holding of portfolio.holdings) {
    allocation[holding.assetType] =
      (allocation[holding.assetType] || 0) + holding.allocation;
  }

  return Object.fromEntries(
    Object.entries(allocation).map(([assetType, value]) => [
      assetType,
      round(value),
    ]),
  );
}

export function getSectorExposure() {
  const sectors = {};

  for (const holding of portfolio.holdings) {
    const sector = holding.sector;

    sectors[sector] = (sectors[sector] || 0) + holding.allocation;
  }

  return Object.fromEntries(
    Object.entries(sectors).map(([sector, value]) => [sector, round(value)]),
  );
}

export function getTopHoldings(limit = 5) {
  return [...portfolio.holdings]
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function getPortfolioSummary() {
  const totalValue = getTotalValue();
  const technology = getTechnologyExposure();

  return {
    totalValue,

    holdingCount: portfolio.holdings.length,

    performance: portfolio.performance,

    previousSnapshot: portfolio.previousSnapshot,

    activity: portfolio.activity,

    technologyExposure: technology.exposure,

    technologyTarget: technology.target,

    technologyDifference: technology.difference,

    performanceHistory: portfolio.performance.history,

    riskScore: calculateRiskScore(),

    riskBreakdown: getRiskBreakdown(),

    diversificationScore: calculateDiversificationScore(),

    assetAllocation: getAssetAllocation(),
  };
}

export function getTechnologyExposure() {
  const exposure = portfolio.holdings.reduce(
    (total, holding) => total + (holding.technologyExposure || 0),
    0,
  );

  const target = portfolio.targets.technologyExposure;

  return {
    exposure: round(exposure),
    target: round(target),
    difference: round(exposure - target),
    status:
      exposure > target
        ? "elevated"
        : exposure === target
          ? "on_target"
          : "below_target",
  };
}

export function getTechnologyContributors() {
  return portfolio.holdings
    .filter((holding) => (holding.technologyExposure || 0) > 0)
    .map((holding) => ({
      id: holding.id,
      name: holding.name,
      exposure: round(holding.technologyExposure),
      value: holding.value,
    }))
    .sort((a, b) => b.exposure - a.exposure);
}

export function calculateConcentrationRisk(portfolioData = portfolio) {
  const exposure = portfolioData.holdings.reduce(
    (total, holding) => total + (holding.technologyExposure || 0),
    0,
  );

  const target = portfolioData.targets.technologyExposure;

  if (exposure >= 35) {
    return "high";
  }

  if (exposure > target) {
    return "elevated";
  }

  return "moderate";
}

export function calculateRiskScore(portfolioData = portfolio) {
  const technologyExposure = portfolioData.holdings.reduce(
    (total, holding) => total + (holding.technologyExposure || 0),
    0,
  );

  const cryptoAllocation = portfolioData.holdings
    .filter((holding) => holding.assetType === "crypto")
    .reduce((total, holding) => total + holding.allocation, 0);

  const weightedVolatility = portfolioData.holdings.reduce(
    (total, holding) => total + holding.volatility * (holding.allocation / 100),
    0,
  );

  const concentrationComponent = Math.min(
    Math.max((technologyExposure - 20) * 0.12, 0),
    2,
  );

  const cryptoComponent = Math.min(cryptoAllocation * 0.12, 1);

  const volatilityComponent = Math.min(
    Math.max((weightedVolatility - 15) * 0.12, 0),
    2,
  );

  const score =
    4.2 + concentrationComponent + cryptoComponent + volatilityComponent;

  return round(Math.min(Math.max(score, 1), 10), 1);
}

export function getRiskLabel(portfolioData = portfolio) {
  const riskScore = calculateRiskScore(portfolioData);

  if (riskScore < 4) {
    return "Lower";
  }

  if (riskScore < 6) {
    return "Moderate";
  }

  if (riskScore < 8) {
    return "Elevated";
  }

  return "High";
}

export function getRiskBreakdown(portfolioData = portfolio) {
  const concentrationLevel = calculateConcentrationRisk(portfolioData);

  const cryptoAllocation = portfolioData.holdings
    .filter((holding) => holding.assetType === "crypto")
    .reduce((total, holding) => total + holding.allocation, 0);

  const weightedVolatility = portfolioData.holdings.reduce(
    (total, holding) => total + holding.volatility * (holding.allocation / 100),
    0,
  );

  const realEstateAllocation = portfolioData.holdings
    .filter((holding) => holding.assetType === "real_estate")
    .reduce((total, holding) => total + holding.allocation, 0);

  const diversificationTypes = new Set(
    portfolioData.holdings.map((holding) => holding.assetType),
  );

  const volatilityLevel =
    weightedVolatility >= 30
      ? "high"
      : weightedVolatility >= 20
        ? "medium"
        : "low";

  const liquidityLevel =
    realEstateAllocation >= 25
      ? "high"
      : realEstateAllocation >= 15
        ? "medium"
        : "low";

  const diversificationLevel =
    diversificationTypes.size >= 5
      ? "good"
      : diversificationTypes.size >= 3
        ? "medium"
        : "limited";

  const cryptoLevel =
    cryptoAllocation >= 10 ? "high" : cryptoAllocation >= 5 ? "medium" : "low";

  return [
    {
      key: "concentration",
      label: "Concentration",
      level: concentrationLevel,
      description: `Technology exposure is ${getTechnologyExposure(portfolioData).exposure}% versus a ${portfolioData.targets.technologyExposure}% target.`,
    },

    {
      key: "volatility",
      label: "Volatility",
      level: volatilityLevel,
      description: `Portfolio-weighted volatility is approximately ${round(weightedVolatility)}%.`,
    },

    {
      key: "liquidity",
      label: "Liquidity",
      level: liquidityLevel,
      description:
        realEstateAllocation > 0
          ? `Real estate represents ${round(realEstateAllocation)}% of the portfolio and is less liquid than listed assets.`
          : "The portfolio has no direct real estate allocation.",
    },

    {
      key: "diversification",
      label: "Diversification",
      level: diversificationLevel,
      description: `The portfolio spans ${diversificationTypes.size} asset classes.`,
    },

    {
      key: "cryptoExposure",
      label: "Crypto exposure",
      level: cryptoLevel,
      description: `Digital assets represent ${round(cryptoAllocation)}% of the portfolio.`,
    },
  ];
}

export function calculateDiversificationScore(portfolioData = portfolio) {
  const holdings = portfolioData.holdings;

  if (!holdings.length) {
    return 0;
  }

  const assetTypes = new Set(holdings.map((holding) => holding.assetType));

  const largestAllocation = Math.max(
    ...holdings.map((holding) => holding.allocation),
  );

  const technologyExposure = holdings.reduce(
    (total, holding) => total + (holding.technologyExposure || 0),
    0,
  );

  const assetClassScore = Math.min(assetTypes.size * 12, 60);

  const concentrationScore = Math.max(0, 25 - largestAllocation * 0.5);

  const technologyScore = Math.max(
    0,
    15 - Math.max(technologyExposure - 25, 0) * 0.5,
  );

  return round(
    Math.min(
      Math.max(assetClassScore + concentrationScore + technologyScore, 0),
      100,
    ),
  );
}

export function runAssetScenario(assetId, changePercent) {
  const holding = portfolio.holdings.find((item) => item.id === assetId);

  if (!holding) {
    return null;
  }

  const totalValue = getTotalValue();
  const currentRisk = calculateRiskScore();

  const normalizedChange = Number(changePercent);

  if (
    !Number.isFinite(normalizedChange) ||
    normalizedChange === 0 ||
    Math.abs(normalizedChange) > 30
  ) {
    return null;
  }

  const valueImpact = holding.value * (Math.abs(normalizedChange) / 100);

  const scenarioValue =
    normalizedChange < 0 ? totalValue - valueImpact : totalValue + valueImpact;

  const portfolioImpactPercent = (valueImpact / totalValue) * 100;

  const riskChange = Math.abs(normalizedChange) * (holding.volatility / 1000);

  const scenarioRisk =
    normalizedChange < 0
      ? Math.min(currentRisk + riskChange, 10)
      : Math.max(currentRisk - riskChange * 0.5, 1);

  return {
    scenario: {
      asset: holding.name,
      assetId: holding.id,
      changePercent: normalizedChange,
    },

    currentValue: totalValue,

    scenarioValue: round(scenarioValue),

    valueImpact: round(valueImpact),

    portfolioImpactPercent: round(portfolioImpactPercent, 1),

    currentRisk,

    scenarioRisk: round(scenarioRisk, 1),

    affectedHoldings: [
      {
        id: holding.id,
        name: holding.name,
        allocation: holding.allocation,
        value: holding.value,
        volatility: holding.volatility,
      },
    ],

    assumptions: [
      `${holding.name} moves by ${normalizedChange}%.`,
      "Other portfolio holdings remain unchanged.",
      "This is a modeled scenario, not a prediction.",
    ],
  };
}

export function runTechnologyScenario(declinePercent) {
  const technologyExposure = getTechnologyExposure().exposure;
  const totalValue = getTotalValue();

  const normalizedDecline = Math.abs(declinePercent);

  const portfolioImpactPercent = technologyExposure * (normalizedDecline / 100);

  const valueImpact = totalValue * (portfolioImpactPercent / 100);

  const scenarioValue = totalValue - valueImpact;

  const currentRisk = calculateRiskScore();

  const riskIncrease = normalizedDecline * 0.045;

  const scenarioRisk = Math.min(currentRisk + riskIncrease, 10);

  return {
    scenario: {
      asset: "Technology",
      declinePercent: -normalizedDecline,
    },

    currentValue: totalValue,

    scenarioValue: round(scenarioValue),

    valueImpact: round(valueImpact),

    portfolioImpactPercent: round(portfolioImpactPercent, 1),

    currentRisk,

    scenarioRisk: round(scenarioRisk, 1),

    affectedHoldings: getTechnologyContributors(),

    assumptions: [
      `Technology exposure declines by ${normalizedDecline}%.`,
      "Other portfolio exposures remain unchanged.",
      "This is a modeled scenario, not a prediction.",
    ],
  };
}

export function generateTechnologyReductionStrategy() {
  const totalValue = getTotalValue();

  const actionPlans = {
    minimal: [
      {
        id: "reduce-tcs",
        type: "reduce",
        holding: "TCS",
        amount: 75000,
        reason: "Makes a modest reduction to direct technology concentration.",
      },
      {
        id: "reduce-infosys",
        type: "reduce",
        holding: "Infosys",
        amount: 50000,
        reason: "Makes a modest reduction to direct technology concentration.",
      },
      {
        id: "reduce-tech-fund",
        type: "reduce",
        holding: "Global Technology Fund",
        amount: 50000,
        reason: "Slightly reduces concentrated sector exposure.",
      },
      {
        id: "increase-broad-market",
        type: "increase",
        holding: "Nifty 50 Index Fund",
        amount: 100000,
        reason: "Adds diversified equity exposure.",
      },
      {
        id: "increase-cash",
        type: "increase",
        holding: "Cash Reserve",
        amount: 75000,
        reason: "Adds a modest lower-volatility reserve.",
      },
    ],

    balanced: [
      {
        id: "reduce-tcs",
        type: "reduce",
        holding: "TCS",
        amount: 150000,
        reason: "Reduces direct technology concentration.",
      },
      {
        id: "reduce-infosys",
        type: "reduce",
        holding: "Infosys",
        amount: 100000,
        reason: "Reduces direct technology concentration.",
      },
      {
        id: "reduce-tech-fund",
        type: "reduce",
        holding: "Global Technology Fund",
        amount: 184400,
        reason: "Reduces concentrated sector exposure.",
      },
      {
        id: "increase-broad-market",
        type: "increase",
        holding: "Nifty 50 Index Fund",
        amount: 250000,
        reason: "Adds diversified equity exposure.",
      },
      {
        id: "increase-cash",
        type: "increase",
        holding: "Cash Reserve",
        amount: 184400,
        reason: "Adds a lower-volatility reserve while reducing concentration.",
      },
    ],

    defensive: [
      {
        id: "reduce-tcs",
        type: "reduce",
        holding: "TCS",
        amount: 200000,
        reason: "Significantly reduces direct technology concentration.",
      },
      {
        id: "reduce-infosys",
        type: "reduce",
        holding: "Infosys",
        amount: 150000,
        reason: "Significantly reduces direct technology concentration.",
      },
      {
        id: "reduce-tech-fund",
        type: "reduce",
        holding: "Global Technology Fund",
        amount: 250000,
        reason: "Reduces concentrated sector exposure more aggressively.",
      },
      {
        id: "increase-broad-market",
        type: "increase",
        holding: "Nifty 50 Index Fund",
        amount: 300000,
        reason: "Maintains diversified equity exposure.",
      },
      {
        id: "increase-cash",
        type: "increase",
        holding: "Cash Reserve",
        amount: 300000,
        reason: "Moves a larger portion toward a lower-volatility reserve.",
      },
    ],
  };

 const defaultTradeoff = "balanced";
 const actions = actionPlans[defaultTradeoff];

 const technologyReduction = 6;

 const tradeoffs = {
   minimal: {
     label: "Minimal adjustment",
     description: "Smallest change with modest risk reduction.",
   },

   balanced: {
     label: "Balanced",
     description:
       "Meaningful risk reduction while maintaining equity exposure.",
     recommended: true,
   },

   defensive: {
     label: "Defensive",
     description:
       "Greater risk reduction with a larger shift toward lower-volatility assets.",
   },
 };

 const calculatedTradeoffs = Object.fromEntries(
   Object.entries(tradeoffs).map(([key, tradeoff]) => {
     const simulated = calculateSimulationFromActions(actionPlans[key]);

     return [
       key,
       {
         ...tradeoff,
         riskScore: simulated.riskScore,
         technologyExposure: simulated.technologyExposure,
         diversificationScore: simulated.diversificationScore,
       },
     ];
   }),
 );

return {
  title: "Reduce technology concentration",

  summary: `Bring technology exposure closer to your ${portfolio.targets.technologyExposure}% target while preserving diversified equity exposure.`,

  actionPlans,

  before: {
    technologyExposure: getTechnologyExposure().exposure,
    technologyTarget: portfolio.targets.technologyExposure,
    riskScore: calculateRiskScore(),
    diversificationScore: calculateDiversificationScore(),
    portfolioValue: totalValue,
  },

  after: {
    technologyExposure: calculatedTradeoffs.balanced.technologyExposure,
    technologyTarget: portfolio.targets.technologyExposure,
    riskScore: calculatedTradeoffs.balanced.riskScore,
    diversificationScore: calculatedTradeoffs.balanced.diversificationScore,
    portfolioValue: totalValue,
  },

  technologyReduction,

  actions,

  confidence: "modeled",

  assumptions: [
    "Other asset prices remain unchanged.",
    "The strategy is modeled using the current portfolio snapshot.",
    "Transactions are simulated and do not represent real trades.",
  ],

  tradeoffs: calculatedTradeoffs,
};
}


export function getTaxLossHarvestingCandidates() {
  const portfolio = getPortfolio();

  return portfolio.holdings
    .filter(
      (holding) =>
        typeof holding.costBasis === "number" &&
        holding.costBasis > holding.value &&
        holding.value > 0,
    )
    .map((holding) => ({
      holdingId: holding.id,
      holding: holding.name,
      currentValue: holding.value,
      costBasis: holding.costBasis,
      unrealizedLoss: holding.value - holding.costBasis,
      lossPercent:
        ((holding.value - holding.costBasis) / holding.costBasis) * 100,
      liquidity: holding.liquidity,
    }))
    .sort((a, b) => a.unrealizedLoss - b.unrealizedLoss);
}

function calculateSimulationFromActions(actions) {
  if (!actions?.length) {
    return null;
  }

  const holdings = portfolio.holdings.map((holding) => ({
    ...holding,
  }));

  for (const action of actions) {
    const holding = holdings.find((item) => item.name === action.holding);

    if (!holding) {
      continue;
    }

    const amount = Number(action.amount) || 0;

    if (action.type === "reduce") {
      holding.value = Math.max(holding.value - amount, 0);
    }

    if (action.type === "increase") {
      holding.value += amount;
    }
  }

  const totalValue = holdings.reduce(
    (total, holding) => total + holding.value,
    0,
  );

  const simulatedHoldings = holdings.map((holding) => {
    const originalValue =
      portfolio.holdings.find((item) => item.id === holding.id)?.value ??
      holding.value;

    const valueRatio = originalValue > 0 ? holding.value / originalValue : 1;

    return {
      ...holding,
      allocation:
        totalValue > 0 ? round((holding.value / totalValue) * 100) : 0,
      technologyExposure: round((holding.technologyExposure || 0) * valueRatio),
    };
  });

  const technologyExposure = simulatedHoldings.reduce(
    (total, holding) => total + (holding.technologyExposure || 0),
    0,
  );

  const simulatedSnapshot = {
    ...portfolio,
    holdings: simulatedHoldings,
  };

  return {
    holdings: simulatedHoldings,
    totalValue: round(totalValue),
    technologyExposure: round(technologyExposure),
    technologyTarget: portfolio.targets.technologyExposure,
    riskScore: calculateRiskScore(simulatedSnapshot),
    diversificationScore: calculateDiversificationScore(simulatedSnapshot),
  };
}

export function calculateSimulatedPortfolio(strategy) {
  if (!strategy?.actions?.length) {
    return null;
  }

  const result = calculateSimulationFromActions(strategy.actions);

  if (!result) {
    return null;
  }

  return {
    ...result,

    valueChange: round(result.totalValue - getTotalValue()),

    actions: strategy.actions,

    assumptions: [
      "Only the selected simulated actions are applied.",
      "Other asset prices remain unchanged.",
      "Holding allocations are recalculated from simulated values.",
      "Technology look-through exposure is adjusted proportionally.",
      "No real trades or money movement occur.",
    ],
  };
}