import RiskAnalysisWidget from "./RiskAnalysisWidget";
import ScenarioWidget from "./ScenarioWidget";
import StrategyWidget from "./StrategyWidget";
import TechnologyExposureWidget from "./TechnologyExposureWidget";
import PredictionBoundaryWidget from "./PredictionBoundaryWidget";
import TaxLossHarvestingWidget from "./TaxLossHarvestingWidget";

function AIWidget({ response, onReviewStrategy, onScenario, onStrategy }) {
  if (!response) {
    return null;
  }

  switch (response.type) {
    case "exposure_analysis":
      return <TechnologyExposureWidget data={response.data} />;

    case "risk_analysis":
      return <RiskAnalysisWidget data={response.data} />;

    case "scenario_analysis":
      return <ScenarioWidget data={response.data} onStrategy={onStrategy} />;

    case "recommendation":
      return (
        <StrategyWidget
          data={response.data}
          onReview={() => onReviewStrategy?.(response.data)}
        />
      );

    case "prediction_boundary":
      return (
        <PredictionBoundaryWidget
          data={response.data}
          onScenario={onScenario}
        />
      );

    case "tax_loss_harvesting":
      return (
        <TaxLossHarvestingWidget
          data={response.data}
          onReview={onReviewStrategy}
        />
      );

    default:
      return null;
  }
}

export default AIWidget;
