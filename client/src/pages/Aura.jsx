import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import AIErrorState from "../components/ai/AIErrorState";

import AIMessage from "../components/ai/AIMessage";
import {
  approveSimulatedStrategy,
  clearSimulatedPortfolio,
} from "../state/portfolioSimulation";
import AIThinkingState from "../components/ai/AIThinkingState";
import AIWidget from "../components/ai/AIWidget";
import StrategyReview from "../components/ai/StrategyReview";
import { askAura } from "../services/mockAIService";
import ApprovalSuccess from "../components/ai/ApprovalSuccess";
import { auraPrompts } from "../data/auraPrompts";
import {
  getPortfolioSummary,
  runAssetScenario,
} from "../services/portfolioEngine";

const suggestedQuestions = [
  auraPrompts.technologyExposure,
  auraPrompts.portfolioRisk,
  "Why did my portfolio change?",
  auraPrompts.technologyScenario,
];

function Aura() {
  const location = useLocation();
  const summary = getPortfolioSummary();
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [reviewStrategy, setReviewStrategy] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState(null);
  const initialQuestionHandled = useRef(false);
  const requestIdRef = useRef(0);

  const handleAssetScenario = (assetName, changePercent) => {
    const scenario = runAssetScenario(assetName, changePercent);

    if (!scenario) {
      return;
    }

    setResponse({
      type: "scenario_analysis",
      message: `Here is how your portfolio could respond to that ${assetName} scenario. This is a modeled outcome, not a prediction.`,
      data: scenario,
    });
  };

  const submitQuestion = async (value = question) => {
    const trimmedQuestion = value.trim();

    if (!trimmedQuestion || isThinking) {
      return;
    }

    const requestId = ++requestIdRef.current;

    setQuestion(trimmedQuestion);
    setResponse(null);
    setError(null);
    setIsThinking(true);

    try {
      const result = await askAura(trimmedQuestion);

      // Ignore results from an older request.
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(null);
      setResponse(result);
    } catch (requestError) {
      // Ignore errors from an older request.
      if (requestId !== requestIdRef.current) {
        return;
      }

      console.error("AURA analysis failed:", requestError);

      setResponse(null);
      console.log("[AURA UI] ERROR STATE SET:", requestError);
      setError(
        "The analysis could not be completed right now. Your portfolio data remains unchanged.",
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setIsThinking(false);
      }
    }
  };

useEffect(() => {
  const initialQuestion = location.state?.initialQuestion;

  if (!initialQuestion || initialQuestionHandled.current) {
    return;
  }

  initialQuestionHandled.current = true;

  submitQuestion(initialQuestion);

  window.history.replaceState({}, document.title);
}, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    submitQuestion();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="w-full">
          {/* Intro */}
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--color-ai)]">
              <Sparkles size={16} strokeWidth={1.8} />

              <span>AURA</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Understand your portfolio.
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[var(--color-text-secondary)]">
              I’ve already looked through your portfolio. Ask me about exposure,
              risk, scenarios, or potential strategies.
            </p>
          </section>

          {/* Proactive insights */}
          {!response && !isThinking && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-warning)]">
                Worth your attention
              </p>

              <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => submitQuestion(auraPrompts.technologyExposure)}
                  className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Technology concentration
                    </p>

                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {summary.technologyExposure}% exposure vs{" "}
                      {summary.technologyTarget}% target
                    </p>
                  </div>

                  <ArrowUp
                    size={16}
                    strokeWidth={1.8}
                    className="rotate-45 text-[var(--color-text-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => submitQuestion(auraPrompts.portfolioRisk)}
                  className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <div>
                    <p className="text-sm font-medium">Portfolio risk</p>

                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      Current modeled risk: {summary.riskScore} / 10
                    </p>
                  </div>

                  <ArrowUp
                    size={16}
                    strokeWidth={1.8}
                    className="rotate-45 text-[var(--color-text-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </motion.section>
          )}

          {/* Conversation */}
          {(response || isThinking || error) && (
            <section className="mb-12">
              <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                <Sparkles size={13} strokeWidth={1.8} />
                AURA
              </div>

              {isThinking ? (
                <AIThinkingState />
              ) : error ? (
                <AIErrorState
                  message={error}
                  onRetry={() => submitQuestion(question)}
                />
              ) : null}

              {response && (
                <>
                  <AIMessage>{response.message}</AIMessage>

                  <AIWidget
                    response={response}
                    onReviewStrategy={(strategy) => {
                      setReviewStrategy(strategy);
                      setIsApproved(false);
                    }}
                    onScenario={handleAssetScenario}
                    onStrategy={() =>
                      submitQuestion("How can I reduce this risk?")
                    }
                  />

                  {isApproved && response?.type === "recommendation" && (
                    <ApprovalSuccess
                      strategy={response.data}
                      onReset={() => {
                        clearSimulatedPortfolio();
                        setResponse(null);
                        setError(null);
                        setQuestion("");
                        setIsApproved(false);
                      }}
                    />
                  )}
                </>
              )}
            </section>
          )}

          {/* Suggested questions */}
          {!response && !isThinking && (
            <section className="mb-12">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-ai)]">
                Try asking
              </p>

              <div className="flex w-full flex-wrap gap-2">
                {suggestedQuestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => submitQuestion(suggestion)}
                    className="rounded-full border border-[var(--color-border)] px-3.5 py-2 text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Input */}
          <div className="w-full">
            <form onSubmit={handleSubmit} className="sticky bottom-4">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-md)]">
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask AURA about your portfolio…"
                  aria-label="Ask AURA"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                />

                <button
                  type="submit"
                  disabled={!question.trim() || isThinking}
                  aria-label="Ask AURA"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-text-primary)] text-[var(--color-bg)] transition-opacity duration-150 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowUp size={16} strokeWidth={2} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {reviewStrategy && !isApproved && (
          <StrategyReview
            strategy={reviewStrategy}
            onCancel={() => setReviewStrategy(null)}
            onApprove={() => {
              const approvedSimulation =
                approveSimulatedStrategy(reviewStrategy);

              if (!approvedSimulation) {
                return;
              }

              setIsApproved(true);
              setReviewStrategy(null);

              setResponse({
                type: "recommendation",
                message:
                  "The selected strategy has been approved for simulation.",
                data: approvedSimulation.strategy,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Aura;
