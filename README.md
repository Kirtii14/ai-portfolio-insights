# AI Portfolio Insights

### AI-First Portfolio Insights & Agent Experience

An AI-first personal wealth experience built for the assignment.

**Live Demo:** https://ai-portfolio-insights.vercel.app/  

---

## Overview

AI Portfolio Insights helps users understand a multi-asset portfolio, identify important risks, ask questions in natural language, explore "what-if" scenarios, and review AI-assisted strategies.

The prototype uses realistic mock data across **stocks, mutual funds, crypto, real estate, and cash**.

### Core Journey

**Portfolio Insight → AURA → Analysis → Scenario → Strategy → Approval**

---

## Key Features

- **AI-first portfolio view** — portfolio value, performance, allocation, risk, and key signals.
- **AURA** — conversational portfolio intelligence for open-ended questions such as *"How exposed am I to tech volatility?"*
- **Dynamic widgets** — AURA can render relevant experiences for risk, exposure, scenarios, strategies, and tax-loss harvesting.
- **Scenario analysis** — explore hypothetical changes and their modeled portfolio impact.
- **Human-in-the-loop strategy** — review AI-assisted recommendations before approval.

---

## Design Rationale

### User Pain Points

Traditional portfolio dashboards mainly show numbers and charts, leaving users to figure out:

- What deserves attention?
- What is driving my risk?
- What happens if something changes?
- What could I do next?

This product connects those questions into one guided experience instead of making users interpret disconnected data.

### AI Trust & Transparency

- Gemini is used to **understand user intent**, not calculate portfolio values.
- Portfolio calculations come from the application's deterministic portfolio engine.
- Scenarios are clearly presented as **hypothetical modeled outcomes**, not predictions.
- Recommendations remain behind a **user review and approval step**.

### Edge Cases & Hallucination Handling

- Structured AI responses are validated before use.
- Unsupported intents and invalid scenario values are rejected.
- Empty questions are handled safely.
- Prediction requests use a clear prediction boundary instead of fabricated forecasts.
- Supported analysis can fall back to deterministic logic if the AI service is unavailable.
- No real financial transactions are executed.

### Core Success Metrics

- **Time to insight** — how quickly users identify an important portfolio signal.
- **Insight comprehension** — whether users understand why it matters.
- **AURA usefulness** — whether questions lead to relevant analysis.
- **Insight-to-action completion** — progression from insight to strategy.
- **Trust** — whether users understand facts, scenarios, and recommendations.
- **Strategy approval rate** — whether users find recommendations useful enough to review.

---

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Recharts, Motion  
**Backend:** Node.js, Express  
**AI:** Google Gemini API  
**Deployment:** Vercel + Render

---

## Run Locally

### Frontend

```bash
cd client
npm install
npm run dev

```

### Backend

```bash
cd server
npm install
npm run dev

```
### Environment variables:

```bash
# server/.env
GEMINI_API_KEY=your_api_key
# client/.env
VITE_API_BASE_URL=http://localhost:3001

```

