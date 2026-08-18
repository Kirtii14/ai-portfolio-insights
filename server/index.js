import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

async function generateWithRetry(request, retries = 2) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await gemini.models.generateContent(request);
    } catch (error) {
      lastError = error;

      const message = error?.message || "";

      const isTemporaryError =
        message.includes("503") ||
        message.includes("UNAVAILABLE") ||
        message.includes("high demand");

      if (!isTemporaryError || attempt === retries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw lastError;
}

app.post("/api/aura", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Question is required.",
      });
    }

    const response = await generateWithRetry({
      model: "gemini-3.6-flash",

      contents: question,

      config: {
        systemInstruction: `
You are AURA, a portfolio intelligence assistant.

Your job is to understand the user's portfolio question and classify what
analysis the application needs to perform.

You do NOT calculate portfolio values, exposure, risk scores, scenario
outcomes, or strategy results yourself.

Those values must always come from the application's portfolio engine.

You must not:
- predict future asset prices
- invent portfolio data
- invent holdings
- invent market data
- claim a scenario is a prediction
- execute real trades
- provide certainty about future investment outcomes

Return ONLY valid JSON.

Use exactly one of these intents:

technology_exposure
portfolio_risk
technology_risk
technology_scenario
asset_scenario
strategy
prediction_boundary
tax_loss_harvesting
general

tax_loss_harvesting
Use when the user asks about tax-loss harvesting, identifying unrealized
losses, or realizing portfolio losses for potential tax purposes.

For scenario questions:
- Extract the asset name when possible.
- Extract the percentage change when explicitly provided.
- A negative percentage means a decline.
- Do not invent a percentage if the user did not provide one.

Return this structure:

{
 "intent": "technology_exposure | portfolio_risk | technology_risk | technology_scenario | asset_scenario | strategy | prediction_boundary | tax_loss_harvesting | general",
  "asset": "optional asset name",
  "changePercent": "optional number"
}
        `,

        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            intent: {
              type: "string",
              enum: [
                "technology_exposure",
                "portfolio_risk",
                "technology_risk",
                "technology_scenario",
                "asset_scenario",
                "strategy",
                "prediction_boundary",
                "tax_loss_harvesting",
                "general",
              ],
            },

            asset: {
              type: "string",
            },

            changePercent: {
              type: "number",
            },
          },

          required: ["intent"],
        },
      },
    });

    const text = response.text;

    const intent = JSON.parse(text);

  const allowedIntents = new Set([
    "technology_exposure",
    "portfolio_risk",
    "technology_risk",
    "technology_scenario",
    "asset_scenario",
    "strategy",
    "prediction_boundary",
    "tax_loss_harvesting",
    "general",
  ]);

    if (
      !intent ||
      typeof intent !== "object" ||
      !allowedIntents.has(intent.intent)
    ) {
      return res.status(502).json({
        success: false,
        error: "AURA returned an unsupported intent.",
      });
    }

    if (
      intent.changePercent !== undefined &&
      (typeof intent.changePercent !== "number" ||
        !Number.isFinite(intent.changePercent))
    ) {
      return res.status(502).json({
        success: false,
        error: "AURA returned an invalid scenario value.",
      });
    }

    res.json({
      success: true,
      intent,
    });
  } catch (error) {
    console.error("AURA request failed:", error);

    const message = error?.message || "";

    const isQuotaError =
      message.includes("429") ||
      message.includes("RESOURCE_EXHAUSTED") ||
      message.includes("quota");

    const isTemporaryError =
      message.includes("503") ||
      message.includes("UNAVAILABLE") ||
      message.includes("high demand");

    if (isQuotaError) {
      return res.status(429).json({
        success: false,
        error:
          "AURA is temporarily unavailable because the AI service has reached its usage limit.",
        code: "AI_QUOTA_EXCEEDED",
      });
    }

    if (isTemporaryError) {
      return res.status(503).json({
        success: false,
        error: "AURA is temporarily unavailable. Please try again shortly.",
        code: "AI_TEMPORARILY_UNAVAILABLE",
      });
    }

    res.status(500).json({
      success: false,
      error: "AURA could not process the request.",
      code: "AURA_REQUEST_FAILED",
    });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`AURA API running on http://localhost:${PORT}`);
});
