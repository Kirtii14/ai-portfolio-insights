import {
  getPortfolio,
  getTechnologyContributors,
  getTechnologyExposure,
  calculateRiskScore,
  getRiskBreakdown,
  runTechnologyScenario,
  runAssetScenario,
  generateTechnologyReductionStrategy,
  getTaxLossHarvestingCandidates,
} from "./portfolioEngine";

import { classifyAuraQuestion } from "./llmService";

const normalizeQuestion = (question) =>
  question
    .trim()
    .toLowerCase()
    .replace(/[?!.,]/g, "");

export async function askAuraWithLLM(question) {
  const intent = await classifyAuraQuestion(question);

  return resolveAuraIntent(intent);
}

function findPortfolioAsset(assetName) {
  if (!assetName) {
    return null;
  }

  const normalizedAsset = assetName.trim().toLowerCase();

  return (
    getPortfolio().holdings.find(
      (holding) => holding.name.trim().toLowerCase() === normalizedAsset,
    ) ?? null
  );
}

function resolveAuraIntent(intent) {
  switch (intent?.intent) {
    case "technology_exposure": {
      const exposure = getTechnologyExposure();

      return {
        type: "exposure_analysis",

        message:
          "Technology represents a larger share of your portfolio than your current target.",

        data: {
          sector: "Technology",
          exposure: exposure.exposure,
          target: exposure.target,
          difference: exposure.difference,
          risk: exposure.status,
          contributors: getTechnologyContributors(),
        },
      };
    }

    case "portfolio_risk":
      return {
        type: "risk_analysis",

        message:
          "Your portfolio's overall risk is moderate, but technology concentration is currently the most important factor to watch.",

        data: {
          score: calculateRiskScore(),
          factors: getRiskBreakdown(),
        },
      };

    case "technology_risk": {
      const exposure = getTechnologyExposure();

      return {
        type: "exposure_analysis",

        message:
          "Your technology exposure is above your target allocation, mainly because several direct holdings and diversified funds have meaningful technology exposure.",

        data: {
          sector: "Technology",
          exposure: exposure.exposure,
          target: exposure.target,
          difference: exposure.difference,
          risk: exposure.status,
          portfolioRisk: calculateRiskScore(),
          contributors: getTechnologyContributors(),
        },
      };
    }

    case "technology_scenario": {
      const parsedChange = Number(intent.changePercent);

      const decline =
        Number.isFinite(parsedChange) && parsedChange > 0
          ? Math.min(Math.abs(parsedChange), 30)
          : 20;

      const scenario = runTechnologyScenario(decline);

      return {
        type: "scenario_analysis",

        message:
          "I can model how your portfolio would respond to a technology drawdown. This is a scenario, not a prediction.",

        data: scenario,
      };
    }

    case "strategy": {
      const strategy = generateTechnologyReductionStrategy();

      return {
        type: "recommendation",

        message:
          "A balanced adjustment could bring technology exposure back toward your target while preserving diversified equity exposure.",

        data: strategy,
      };
    }

    case "asset_scenario": {
      const holding = findPortfolioAsset(intent.asset);

      if (!holding) {
        return {
          type: "insight",

          message:
            "I couldn't find that asset in the current portfolio. Try asking about one of your existing holdings.",
        };
      }

      const parsedChange = Number(intent.changePercent);

      if (
        !Number.isFinite(parsedChange) ||
        parsedChange === 0 ||
        Math.abs(parsedChange) > 30
      ) {
        return {
          type: "insight",

          message: `I found ${holding.name} in your portfolio. Tell me how much you want to model it moving, such as +10% or −20%.`,
        };
      }

      const changePercent = parsedChange;

      const scenario = runAssetScenario(holding.id, changePercent);

      if (!scenario) {
        return {
          type: "insight",

          message: `I couldn't create a scenario for ${holding.name} using the current portfolio data.`,
        };
      }

      return {
        type: "scenario_analysis",

        message: `Here is how your portfolio could respond to that ${holding.name} scenario. This is a modeled outcome, not a prediction.`,

        data: scenario,
      };
    }

    case "prediction_boundary": {
      const asset = findPortfolioAsset(intent.asset);

      if (!asset) {
        return {
          type: "prediction_boundary",

          message:
            "I can’t provide a reliable short-term price prediction, and that asset is not represented in the current portfolio.",

          data: {
            asset: intent.asset || "that asset",

            limitation:
              "AURA does not predict short-term market direction or invent portfolio holdings.",

            alternatives: [],
          },
        };
      }

      const assetName = asset.name;

      return {
        type: "prediction_boundary",

        message: `I can't reliably predict ${assetName}'s short-term price movement. Instead, I can help you explore modeled outcomes for different ${assetName} scenarios.`,

        data: {
          asset: assetName,

          limitation:
            "Short-term market direction cannot be predicted reliably from the portfolio data available to AURA.",

          alternatives: [
            {
              label: `${assetName} +20%`,
              change: 20,
            },
            {
              label: `${assetName} +10%`,
              change: 10,
            },
            {
              label: `${assetName} −10%`,
              change: -10,
            },
            {
              label: `${assetName} −20%`,
              change: -20,
            },
          ],
        },
      };
    }

    case "general":
    default:
      return {
        type: "insight",

        message:
          "I can analyze your portfolio exposure, risk, and modeled scenarios. Try asking about technology exposure, portfolio risk, or a specific scenario.",
      };
  }
}

export async function askAura(question) {
  try {
    console.log("[AURA] ASK START:", question);
    const llmResult = await askAuraWithLLM(question);

    if (llmResult) {
      return llmResult;
    }
  } catch (error) {
    console.warn(
      "[AURA] LLM unavailable. Falling back to deterministic analysis.",
      error,
    );
  }

  const normalizedQuestion = normalizeQuestion(question);

  console.log("[AURA] FALLBACK START:", normalizedQuestion);

  await new Promise((resolve) => {
    setTimeout(resolve, 700);
  });

  // ─────────────────────────────────────────────
  // INTENT DETECTION
  // ─────────────────────────────────────────────

  const isTechnologyExposureQuestion =
    normalizedQuestion.includes("tech") ||
    normalizedQuestion.includes("technology");

  const isRiskQuestion = normalizedQuestion.includes("risk");

  const isTechnologyScenarioQuestion =
    isTechnologyExposureQuestion &&
    (normalizedQuestion.includes("fall") ||
      normalizedQuestion.includes("drop") ||
      normalizedQuestion.includes("decline") ||
      normalizedQuestion.includes("down"));

  const isStrategyQuestion =
    normalizedQuestion.includes("reduce") ||
    normalizedQuestion.includes("lower") ||
    normalizedQuestion.includes("manage") ||
    normalizedQuestion.includes("improve");

  const isTaxLossHarvestingQuestion =
    normalizedQuestion.includes("tax loss") ||
    normalizedQuestion.includes("tax-loss") ||
    normalizedQuestion.includes("taxloss") ||
    normalizedQuestion.includes("harvest loss") ||
    normalizedQuestion.includes("harvesting loss");

  const isPredictionQuestion =
    normalizedQuestion.includes("will") &&
    (normalizedQuestion.includes("tomorrow") ||
      normalizedQuestion.includes("next week") ||
      normalizedQuestion.includes("rise") ||
      normalizedQuestion.includes("fall") ||
      normalizedQuestion.includes("go up") ||
      normalizedQuestion.includes("go down"));

  if (isPredictionQuestion) {
    console.log("[AURA] PREDICTION FALLBACK DETECTED");

    const portfolio = getPortfolio();

    const predictionAsset = portfolio.holdings.find((holding) =>
      normalizedQuestion.includes(holding.name.trim().toLowerCase()),
    );

    if (!predictionAsset) {
      console.log("[AURA] PREDICTION FALLBACK RESULT:", predictionAsset.name);
      return {
        type: "prediction_boundary",

        message:
          "I can't reliably predict short-term market movements, and I couldn't identify a matching asset in your current portfolio.",

        data: {
          asset: "your portfolio",

          limitation:
            "AURA does not predict short-term market direction or invent portfolio holdings.",

          alternatives: [],
        },
      };
    }

    const assetName = predictionAsset.name;

    console.log("[AURA] PREDICTION FALLBACK RESULT:", predictionAsset.name);

    return {
      type: "prediction_boundary",

      message: `I can't reliably predict ${assetName}'s short-term price movement. Instead, I can help you explore modeled outcomes for different ${assetName} scenarios.`,

      data: {
        asset: assetName,

        limitation:
          "Short-term market direction cannot be predicted reliably from the portfolio data available to AURA.",

        alternatives: [
          {
            label: `${assetName} +20%`,
            change: 20,
          },
          {
            label: `${assetName} +10%`,
            change: 10,
          },
          {
            label: `${assetName} −10%`,
            change: -10,
          },
          {
            label: `${assetName} −20%`,
            change: -20,
          },
        ],
      },
    };
  }

  // ─────────────────────────────────────────────
  // STRATEGY / RECOMMENDATION
  // ─────────────────────────────────────────────

  const isContextualRiskQuestion =
    isStrategyQuestion &&
    (isRiskQuestion ||
      normalizedQuestion.includes("this risk") ||
      normalizedQuestion.includes("that risk") ||
      normalizedQuestion.includes("my risk"));

  if (
    isStrategyQuestion &&
    (isTechnologyExposureQuestion || isContextualRiskQuestion)
  ) {
    const strategy = generateTechnologyReductionStrategy();

    return {
      type: "recommendation",

      message:
        "A balanced adjustment could bring technology exposure back toward your target while preserving diversified equity exposure.",

      data: strategy,
    };
  }

  // ─────────────────────────────────────────────
  // TAX-LOSS HARVESTING
  // ─────────────────────────────────────────────

  if (isTaxLossHarvestingQuestion) {
    const candidates = getTaxLossHarvestingCandidates();

    return {
      type: "tax_loss_harvesting",
      message:
        "I found simulated unrealized losses that may be relevant to a tax-loss harvesting workflow. This is a modeled opportunity, not tax advice.",
      data: {
        candidates,
        assumptions: [
          "Cost basis and current values are simulated portfolio data.",
          "Actual tax eligibility depends on your jurisdiction, account type, holding period, and applicable tax rules.",
          "AURA does not calculate guaranteed tax savings.",
          "No real trades are executed from this workflow.",
        ],
      },
    };
  }
  
  // ─────────────────────────────────────────────
  // ASSET SCENARIO FALLBACK
  // ─────────────────────────────────────────────

  const portfolio = getPortfolio();

  const scenarioHolding = portfolio.holdings.find((holding) =>
    normalizedQuestion.includes(holding.name.trim().toLowerCase()),
  );

  const isAssetScenarioQuestion =
    scenarioHolding &&
    (normalizedQuestion.includes("drop") ||
      normalizedQuestion.includes("fall") ||
      normalizedQuestion.includes("decline") ||
      normalizedQuestion.includes("rise") ||
      normalizedQuestion.includes("increase") ||
      normalizedQuestion.includes("up") ||
      normalizedQuestion.includes("down")) &&
    normalizedQuestion.includes("%");

  if (isAssetScenarioQuestion) {
    const scenarioMatch = normalizedQuestion.match(
      /(?:\+|-)?\d+(?:\.\d+)?\s*%/,
    );

    const requestedChange = scenarioMatch
      ? Number(scenarioMatch[0].replace("%", ""))
      : null;

    if (
      requestedChange === null ||
      requestedChange === 0 ||
      !Number.isFinite(requestedChange) ||
      Math.abs(requestedChange) > 30
    ) {
      console.log("[AURA] FALLBACK GENERAL RESULT");
      return {
        type: "insight",

        message: `I found ${scenarioHolding.name} in your portfolio. Tell me how much you want to model it moving, such as +10% or −20%.`,
      };
    }

    const scenario = runAssetScenario(scenarioHolding.id, requestedChange);

    if (!scenario) {
      return {
        type: "insight",

        message: `I couldn't create a scenario for ${scenarioHolding.name} using the current portfolio data.`,
      };
    }

    return {
      type: "scenario_analysis",

      message: `Here is how your portfolio could respond to that ${scenarioHolding.name} scenario. This is a modeled outcome, not a prediction.`,

      data: scenario,
    };
  }

  // ─────────────────────────────────────────────
  // SCENARIO ANALYSIS
  // ─────────────────────────────────────────────

  if (isTechnologyScenarioQuestion) {
    const scenarioMatch = normalizedQuestion.match(
      /(?:\+|-)?\d+(?:\.\d+)?\s*%/,
    );

    const requestedChange = scenarioMatch
      ? Number(scenarioMatch[0].replace("%", ""))
      : -20;

    const decline = Math.min(Math.abs(requestedChange), 30);

    const scenario = runTechnologyScenario(decline);

    return {
      type: "scenario_analysis",

      message:
        "I can model how your portfolio would respond to a technology drawdown. This is a scenario, not a prediction.",

      data: scenario,
    };
  }

  // ─────────────────────────────────────────────
  // RISK ANALYSIS
  // ─────────────────────────────────────────────

  if (isRiskQuestion && !isTechnologyExposureQuestion) {
    return {
      type: "risk_analysis",

      message:
        "Your portfolio's overall risk is moderate, but technology concentration is currently the most important factor to watch.",

      data: {
        score: calculateRiskScore(),
        factors: getRiskBreakdown(),
      },
    };
  }

  // ─────────────────────────────────────────────
  // TECHNOLOGY EXPOSURE + RISK
  // ─────────────────────────────────────────────

  if (isTechnologyExposureQuestion && isRiskQuestion) {
    const exposure = getTechnologyExposure();
    const contributors = getTechnologyContributors();
    const riskScore = calculateRiskScore();

    return {
      type: "exposure_analysis",

      message:
        "Your technology exposure is above your target allocation, mainly because several direct holdings and diversified funds have meaningful technology exposure.",

      data: {
        sector: "Technology",
        exposure: exposure.exposure,
        target: exposure.target,
        difference: exposure.difference,
        risk: exposure.status,
        portfolioRisk: riskScore,
        contributors,
      },
    };
  }

  // ─────────────────────────────────────────────
  // TECHNOLOGY EXPOSURE
  // ─────────────────────────────────────────────

  if (isTechnologyExposureQuestion) {
    const exposure = getTechnologyExposure();

    return {
      type: "exposure_analysis",

      message:
        "Technology represents a larger share of your portfolio than your current target.",

      data: {
        sector: "Technology",
        exposure: exposure.exposure,
        target: exposure.target,
        difference: exposure.difference,
        risk: exposure.status,
        contributors: getTechnologyContributors(),
      },
    };
  }

  // ─────────────────────────────────────────────
  // FALLBACK
  // ─────────────────────────────────────────────

  return {
    type: "insight",

    message:
      "I can analyze your portfolio exposure, risk, and modeled scenarios. Try asking how exposed you are to technology volatility.",
  };
}
