import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const deliveryRequirementDays = 7;

const routeOptions = {
  optionA: {
    id: "optionA",
    option: "Option A",
    name: "Dammam Gateway Road + Air Plan",
    resultLabel: "Option A: Dammam Gateway Road + Air Plan",
    modeLabel: "Road + Air + Road",
    cost: "BHD 8,000",
    costValue: 8000,
    totalLeadTime: "5-8 days",
    minLeadDays: 5,
    maxLeadDays: 8,
    emissions: "1,850 kg CO2e",
    emissionsValue: 1850,
    deliveryStatus: "Risky / may not meet requirement if delays occur",
    selectionStatus: "Delivery status: Risky against 7-day requirement",
    statusExplanation:
      "This route is cost-efficient but risky against the 7-day requirement if border, handover, air uplift, temperature-control, or final-mile delays occur.",
    summaryStages: [
      "Road: Bahrain -> Dammam Airport",
      "Air: Dammam -> Rotterdam Airport",
      "Road: Rotterdam Airport -> Cobeco Pharma Wholesale BV",
    ],
    selectionHighlights: [
      "Lower regional road cost",
      "Shorter regional road movement",
      "Airport connectivity and cold chain suitability to be researched",
    ],
    routeLogic: [
      "Lower cost than the Riyadh option",
      "Shorter regional road distance",
      "Lower first-mile fuel use and road emissions",
      "Lower estimated CO2 emissions at 1,850 kg CO2e",
      "5-8 day lead time against a 7-day requirement",
      "Risky delivery buffer if delays occur",
      "Airport connectivity and cold chain capability need stronger validation",
    ],
    stages: [
      {
        title: "Map 1",
        context: "First-mile and regional road freight",
        from: "Local Bahraini logistics provider",
        via: "King Fahad Causeway",
        to: "Dammam Airport / Dammam air cargo gateway",
        mode: "Road freight",
        type: "road",
      },
      {
        title: "Map 2",
        context: "International air freight connector",
        from: "Dammam",
        to: "Rotterdam Airport",
        mode: "Air freight",
        type: "air",
      },
      {
        title: "Map 3",
        context: "Netherlands last-mile road freight",
        from: "Rotterdam Airport",
        to: "Cobeco Pharma Wholesale BV",
        mode: "Road freight",
        type: "road",
      },
    ],
  },
  optionB: {
    id: "optionB",
    option: "Option B",
    name: "Riyadh Gateway Road + Air Plan",
    resultLabel: "Option B: Riyadh Gateway Road + Air Plan",
    modeLabel: "Road + Air + Road",
    cost: "BHD 10,000",
    costValue: 10000,
    totalLeadTime: "3-5 days",
    minLeadDays: 3,
    maxLeadDays: 5,
    emissions: "2,450 kg CO2e",
    emissionsValue: 2450,
    deliveryStatus: "Strong fit / meets requirement",
    selectionStatus: "Delivery status: Strong fit against 7-day requirement",
    statusExplanation:
      "This route better supports the 7-day delivery requirement, but it requires higher cost, longer regional road control, and strong coordination.",
    summaryStages: [
      "Road: Bahrain -> Riyadh Airport",
      "Air: Riyadh -> Amsterdam Schiphol Airport",
      "Road: Amsterdam Schiphol Airport -> Cobeco Pharma Wholesale BV",
    ],
    selectionHighlights: [
      "Higher regional road cost",
      "Longer regional road movement",
      "Airport connectivity and cold chain suitability to be researched",
    ],
    routeLogic: [
      "Higher cost at BHD 10,000",
      "Longer regional road distance",
      "Higher first-mile fuel use and road emissions",
      "Higher estimated CO2 emissions at 2,450 kg CO2e",
      "Faster 3-5 day lead time against a 7-day requirement",
      "Stronger fit for time-critical delivery",
      "Potentially stronger pharma/cold-chain connectivity through Amsterdam Schiphol Airport, subject to student research",
    ],
    stages: [
      {
        title: "Map 1",
        context: "First-mile and regional road freight",
        from: "Local Bahraini logistics provider",
        via: "King Fahad Causeway",
        to: "Riyadh logistics hub / airport",
        mode: "Road freight",
        type: "road",
      },
      {
        title: "Map 2",
        context: "International air freight connector",
        from: "Riyadh",
        to: "Amsterdam Schiphol Airport",
        mode: "Air freight",
        type: "air",
      },
      {
        title: "Map 3",
        context: "Netherlands last-mile road freight",
        from: "Amsterdam Schiphol Airport",
        to: "Cobeco Pharma Wholesale BV",
        mode: "Road freight",
        type: "road",
      },
    ],
  },
};

const comparisonFacts = [
  "Option A is cheaper by BHD 2,000, equal to 20% lower cost than Option B.",
  "Option A has lower estimated CO2 emissions by 600 kg CO2e, equal to approximately 24.5% lower emissions.",
  "Option B is faster by approximately 2-3 days.",
  "Option A is cost-efficient but risky against the 7-day requirement.",
  "Option B is a stronger time-critical fit, but it costs more and has higher estimated emissions.",
];

const fmlmComparison = [
  {
    factor: "First-mile/regional road distance",
    optionA: "Lower",
    optionB: "Higher",
  },
  {
    factor: "Road transport cost",
    optionA: "Lower",
    optionB: "Higher",
  },
  {
    factor: "Driver-hour/fuel/toll impact",
    optionA: "Lower",
    optionB: "Higher",
  },
  {
    factor: "Border/customs timing sensitivity",
    optionA: "Moderate",
    optionB: "Higher, because longer regional road movement creates more timing pressure for air handover",
  },
  {
    factor: "Airport connectivity",
    optionA: "To be researched by students",
    optionB: "To be researched by students",
  },
  {
    factor: "Cold chain suitability",
    optionA: "To be researched by students",
    optionB: "To be researched by students",
  },
  {
    factor: "Technology and visibility need",
    optionA: "Moderate to high",
    optionB: "High due to longer regional road movement and time-critical air handover",
  },
  {
    factor: "Last-mile delivery complexity",
    optionA: "Rotterdam Airport to Cobeco",
    optionB: "Amsterdam Schiphol Airport to Cobeco",
  },
  {
    factor: "Estimated CO2 emissions",
    optionA: "1,850 kg CO2e",
    optionB: "2,450 kg CO2e",
  },
];

const constraintItems = [
  {
    id: "cost",
    label: "Cost",
    description: "Total freight cost, road movement cost, airport handling cost, and cost justification.",
  },
  {
    id: "leadTime",
    label: "Lead Time",
    description:
      "Ability to meet the 7-day delivery requirement while controlling border, loading, and handover delays.",
  },
  {
    id: "compliance",
    label: "Compliance",
    description:
      "Customs, pharmaceutical handling requirements, cold chain documentation, and transport regulations.",
  },
  {
    id: "safety",
    label: "Safety",
    description:
      "Product protection, secure handling, temperature control, loading/unloading safety, and avoiding damage or contamination.",
  },
  {
    id: "technology",
    label: "Technology",
    description:
      "Real-time tracking, temperature monitoring, digital documents, and shipment visibility.",
  },
  {
    id: "sustainability",
    label: "Sustainability",
    description:
      "Estimated CO2 emissions, fuel use, road distance, route efficiency, and environmental impact.",
  },
];

const strategyLabels = {
  cost: "Cost-Control Strategy",
  leadTime: "Time-Critical Delivery Strategy",
  compliance: "Compliance-Control Strategy",
  safety: "Safety and Cold Chain Protection Strategy",
  technology: "Technology-Enabled Visibility Strategy",
  sustainability: "Sustainable Freight Planning Strategy",
};

const routeManagementPriorities = {
  optionA: ["leadTime", "compliance", "technology", "safety", "sustainability", "cost"],
  optionB: ["cost", "sustainability", "technology", "compliance", "safety", "leadTime"],
};

const positionScoreTable = [
  [40, 30, 20, 10, 5, 5],
  [25, 20, 15, 10, 5, 5],
  [15, 12, 10, 8, 5, 5],
];

const routeManagementScoreExplanation =
  "The Route Management Score reflects how well your ranked constraints match the key management risks of your selected route. A higher score means you correctly identified the areas that need the most attention to make the route successful.";

const disclaimer =
  "Figures are simplified estimates for classroom decision-making and are used to compare trade-offs, not to represent live freight quotations.";

const defaultState = {
  step: 1,
  routeId: "",
  selectedConstraints: [],
};

function Icon({ type }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const paths = {
    road: (
      <>
        <path d="M6 20 10 4" />
        <path d="M18 20 14 4" />
        <path d="M12 8v2" />
        <path d="M12 14v2" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M4 16V6a2 2 0 0 1 2-2h10" />
      </>
    ),
    restart: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 3v6h6" />
      </>
    ),
  };

  return (
    <svg className="icon" {...common}>
      {paths[type]}
    </svg>
  );
}

function getDeliveryStatus(route) {
  const meetsRequirement = route.maxLeadDays <= deliveryRequirementDays;
  const risky = !meetsRequirement && route.minLeadDays <= deliveryRequirementDays;
  return {
    meetsRequirement,
    risky,
    label: meetsRequirement
      ? "Strong fit / meets requirement"
      : risky
        ? "Risky / may not meet requirement if delays occur"
        : "Does not meet requirement",
  };
}

function getScoreMeaning(score) {
  if (score >= 85) return "Strong route management awareness";
  if (score >= 70) return "Good route management awareness";
  if (score >= 50) return "Moderate awareness; some key risks may need more attention";
  return "Weak awareness; reconsider which risks matter most for this route";
}

function calculateScore(route, rankedItems) {
  const priorityOrder = routeManagementPriorities[route?.id] || routeManagementPriorities.optionA;
  const rawScore = rankedItems.slice(0, 3).reduce((total, constraintId, rankIndex) => {
    const priorityIndex = priorityOrder.indexOf(constraintId);
    if (priorityIndex === -1) return total;
    return total + positionScoreTable[rankIndex][priorityIndex];
  }, 0);

  return Math.max(0, Math.min(100, Math.round((rawScore / 70) * 100)));
}

function getStrategy(route, rankedItems) {
  const firstChoice = rankedItems[0] || "";
  const title = strategyLabels[firstChoice] || "Road Freight Strategy";
  let explanation = "Rank the top three freight constraints to generate a road freight management strategy.";

  if (route?.id === "optionA") {
    const explanations = {
      cost:
        "You selected a Cost-Control Strategy. Option A supports this through a lower BHD 8,000 cost and shorter regional road movement, but the delivery buffer must be protected carefully.",
      leadTime:
        "You selected a Time-Critical Delivery Strategy, but Option A has a risky 5-8 day lead time against the 7-day requirement. You need to control border timing, airport handover, and last-mile delivery very carefully.",
      compliance:
        "You selected a Compliance-Control Strategy. Option A needs careful customs, pharma documentation, cold chain checks, and road-air handover control because the delivery buffer is tight.",
      safety:
        "You selected a Safety and Cold Chain Protection Strategy. Option A requires strong temperature protection, secure handling, and delay escalation because any disruption can threaten delivery reliability.",
      technology:
        "You selected a Technology-Enabled Visibility Strategy. Option A needs tracking, temperature monitoring, and digital documentation to manage the 5-8 day route and tight handover window.",
      sustainability:
        "You selected a Sustainable Freight Planning Strategy. Option A supports this better through lower estimated CO2 emissions, shorter regional road movement, and lower first-mile fuel impact, but the delivery buffer risk must still be managed.",
    };
    explanation = explanations[firstChoice] || explanation;
  } else if (route?.id === "optionB") {
    const explanations = {
      cost:
        "You selected a Cost-Control Strategy. Option B is more expensive at BHD 10,000, so the premium must be justified through stronger deadline reliability, airport connectivity, or cold chain performance.",
      leadTime:
        "You selected a Time-Critical Delivery Strategy. Option B strongly supports this through a 3-5 day lead time and better delivery buffer against the 7-day requirement.",
      compliance:
        "You selected a Compliance-Control Strategy. Option B can support this if students justify stronger airport pharma handling and connectivity through Amsterdam Schiphol Airport.",
      safety:
        "You selected a Safety and Cold Chain Protection Strategy. Option B can reduce exposure through faster movement, but the longer regional road leg and fast handovers still need careful control.",
      technology:
        "You selected a Technology-Enabled Visibility Strategy. Option B needs real-time tracking, temperature monitoring, and coordination across the longer regional road leg and fast air movement.",
      sustainability:
        "You selected a Sustainable Freight Planning Strategy. However, Option B has higher estimated CO2 emissions and a longer regional road leg, so the sustainability impact must be justified through faster delivery, better cold chain reliability, or reduced product risk.",
    };
    explanation = explanations[firstChoice] || explanation;
  }

  return { title, explanation };
}

function getConstraintInterpretation(route, constraintId) {
  if (route.id === "optionA") {
    const interpretations = {
      cost: "Cost matters, but it is already a strength of Option A, so it is a lower management risk than lead time, compliance, technology, and safety.",
      leadTime: "High-priority risk because Option A has a 5-8 day lead time against a 7-day delivery requirement.",
      compliance: "High-priority risk because pharma documentation, customs, and airport handovers must be controlled carefully.",
      safety: "Important risk because cold chain protection and product condition must be maintained if delays occur.",
      technology: "High-priority risk because visibility and temperature monitoring help control uncertainty in the Dammam + Rotterdam Airport route.",
      sustainability:
        "Relevant, because Option A has lower estimated CO2 emissions, but sustainability should not distract from the delivery buffer risk.",
    };
    return interpretations[constraintId];
  }

  const interpretations = {
    cost: "High-priority risk because Option B costs BHD 10,000 and the premium must be justified.",
    leadTime: "Lead time matters, but it is already a strength of Option B, so it is a lower management risk than cost, sustainability, technology, and compliance.",
    compliance: "Important risk because pharma, customs, and cold chain controls must still be managed across the faster route.",
    safety: "Important risk because product handling and temperature control remain critical during fast handovers.",
    technology: "High-priority risk because tracking and coordination are needed for the longer Bahrain-to-Riyadh road movement and fast road-air-road handover.",
    sustainability:
      "High-priority risk because Option B has higher estimated CO2 emissions and a longer regional road leg.",
  };
  return interpretations[constraintId];
}

function getScoreExplanation(route, rankedItems) {
  const topThree = rankedItems.slice(0, 3);
  const firstChoice = rankedItems[0] || "";

  if (route.id === "optionA") {
    if (firstChoice === "cost") {
      return "Cost is important, but it is already a strength of Option A. Lead time, compliance, technology, and safety require more management attention for this route.";
    }
    if (topThree.includes("leadTime")) {
      return "You correctly identified the main risk: Option A has a 5-8 day lead time against a 7-day requirement. The route needs careful timing control across border clearance, airport handover, and final-mile delivery.";
    }
    if (topThree.includes("technology")) {
      return "You recognised that visibility and temperature monitoring help control uncertainty in the Dammam + Rotterdam Airport route. Lead-time risk should still remain central.";
    }
    if (topThree.includes("sustainability")) {
      return "Option A performs better on estimated CO2 emissions, but sustainability should not distract from the delivery buffer risk. Lead time and compliance need close control.";
    }
    return "This score reflects how closely your ranking matches Option A's main vulnerabilities: lead-time uncertainty, compliance control, visibility, and cold chain safety.";
  }

  if (firstChoice === "leadTime") {
    return "Lead time is important, but it is already a strength of Option B. Cost, sustainability, technology, and compliance require more management attention.";
  }
  if (topThree.includes("cost")) {
    return "You correctly identified a key risk: Option B costs BHD 10,000 and the premium must be justified by reliability, connectivity, or cold chain performance.";
  }
  if (topThree.includes("sustainability")) {
    return "You correctly identified the higher estimated CO2 emissions and longer road leg as a management concern for Option B.";
  }
  if (topThree.includes("technology")) {
    return "You recognised that tracking and coordination are important because Option B has a longer Bahrain-to-Riyadh road movement and fast road-air-road handover.";
  }
  return "This score reflects how closely your ranking matches Option B's main vulnerabilities: cost justification, sustainability impact, technology coordination, compliance, and product safety.";
}

function getRecommendation(route) {
  if (route.id === "optionA") {
    return "You selected a lower-cost, lower-emission, and shorter regional road movement through Dammam. The key issue is whether the Dammam to Rotterdam Airport route can meet the 7-day deadline and provide sufficient pharma air cargo connectivity, cold chain capability, and reliable last-mile delivery.";
  }

  return "You selected a faster and potentially stronger pharma/cold-chain gateway strategy through Riyadh and Amsterdam Schiphol Airport. This creates higher cost, higher estimated CO2 emissions, and longer regional road exposure that must be justified and controlled.";
}

function App() {
  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem("roadFreightDecisionLab");
    if (!saved) return defaultState;
    try {
      const parsed = JSON.parse(saved);
      const validConstraintIds = constraintItems.map((constraint) => constraint.id);
      const selectedConstraints = (parsed.selectedConstraints || parsed.selectedRisks || []).filter((item) =>
        validConstraintIds.includes(item)
      );
      const routeId = routeOptions[parsed.routeId] ? parsed.routeId : "";
      return { ...defaultState, ...parsed, routeId, selectedConstraints };
    } catch {
      return defaultState;
    }
  });
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    localStorage.setItem("roadFreightDecisionLab", JSON.stringify(activity));
  }, [activity]);

  const selectedRoute = routeOptions[activity.routeId] || null;
  const strategy = useMemo(
    () => getStrategy(selectedRoute, activity.selectedConstraints),
    [selectedRoute, activity.selectedConstraints]
  );
  const score = useMemo(
    () => calculateScore(selectedRoute, activity.selectedConstraints),
    [selectedRoute, activity.selectedConstraints]
  );
  const scoreMeaning = getScoreMeaning(score);
  const scoreExplanation = selectedRoute
    ? getScoreExplanation(selectedRoute, activity.selectedConstraints)
    : "";
  const recommendation = selectedRoute ? getRecommendation(selectedRoute) : "";

  const updateActivity = (updates) => {
    setActivity((current) => ({ ...current, ...updates }));
  };

  const goToStep = (step) => {
    setCopyStatus("");
    updateActivity({ step });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setCopyStatus("");
    setActivity({ ...defaultState });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rankedLabels = activity.selectedConstraints
    .map((item) => constraintItems.find((constraint) => constraint.id === item)?.label)
    .filter(Boolean);

  const summary = [
    "Road-Air-Road Freight Route Management Simulator Result",
    `Selected route plan: ${selectedRoute?.resultLabel || "Not selected"}`,
    `Route stages: ${selectedRoute?.summaryStages.join(" | ") || "Not selected"}`,
    `Total estimated cost: ${selectedRoute?.cost || "Not selected"}`,
    `Total estimated lead time: ${selectedRoute?.totalLeadTime || "Not selected"}`,
    `Estimated CO2 emissions: ${selectedRoute?.emissions || "Not selected"}`,
    `Delivery requirement: within ${deliveryRequirementDays} days`,
    `Delivery status: ${selectedRoute ? getDeliveryStatus(selectedRoute).label : "Not selected"}`,
    ...comparisonFacts,
    `Ranked top 3 freight constraints: ${rankedLabels.join("; ") || "Not selected"}`,
    `Route Management Score: ${score}/100 - ${scoreMeaning}`,
    `Score explanation: ${scoreExplanation || "Not selected"}`,
    `Your Road Freight Strategy: ${strategy.title}`,
    `Strategy explanation: ${strategy.explanation}`,
    `Recommendation: ${recommendation || "Not selected"}`,
  ].join("\n");

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus("Summary copied");
    } catch {
      setCopyStatus("Copy unavailable. Select the summary text instead.");
    }
  };

  return (
    <main className="app-shell">
      <Header onHome={() => goToStep(1)} />
      <section className="workspace" aria-live="polite">
        <Progress step={activity.step} />
        {activity.step === 1 && <ScenarioIntro onNext={() => goToStep(2)} />}
        {activity.step === 2 && (
          <RouteOverview onBack={() => goToStep(1)} onNext={() => goToStep(3)} />
        )}
        {activity.step === 3 && (
          <FmlmComparison onBack={() => goToStep(2)} onNext={() => goToStep(4)} />
        )}
        {activity.step === 4 && (
          <RouteSelection
            routeId={activity.routeId}
            setRouteId={(routeId) => updateActivity({ routeId, selectedConstraints: [] })}
            onBack={() => goToStep(3)}
            onNext={() => goToStep(5)}
          />
        )}
        {activity.step === 5 && (
          <ConstraintRanking
            selectedConstraints={activity.selectedConstraints}
            setSelectedConstraints={(selectedConstraints) => updateActivity({ selectedConstraints })}
            onBack={() => goToStep(4)}
            onNext={() => goToStep(6)}
          />
        )}
        {activity.step === 6 && (
          <Result
            selectedRoute={selectedRoute}
            rankedConstraints={activity.selectedConstraints}
            strategy={strategy}
            score={score}
            scoreMeaning={scoreMeaning}
            scoreExplanation={scoreExplanation}
            recommendation={recommendation}
            summary={summary}
            copyStatus={copyStatus}
            onCopy={copySummary}
            onBack={() => goToStep(5)}
            onRestart={restart}
          />
        )}
      </section>
    </main>
  );
}

function Header({ onHome }) {
  return (
    <header className="topbar">
      <button className="brand-button" onClick={onHome}>
        <Icon type="road" />
        <span>Road-Air-Road Freight Route Management Simulator</span>
      </button>
      <span className="context-tag">Road freight operations</span>
    </header>
  );
}

function Progress({ step }) {
  const labels = ["Scenario", "Routes", "FMLM Compare", "Select Route", "Rank Focus", "Results"];
  return (
    <div className="progress-wrap" aria-label={`Step ${step} of 6`}>
      <div className="progress-header">
        <span>Step {step} of 6</span>
        <strong>{labels[step - 1]}</strong>
      </div>
      <div className="progress-track">
        {labels.map((label, index) => (
          <span
            className={`progress-dot ${index + 1 <= step ? "active" : ""}`}
            key={label}
            aria-label={label}
          />
        ))}
      </div>
    </div>
  );
}

function ScenarioIntro({ onNext }) {
  return (
    <Screen
      title="Managing Road Freight in Local, Regional and Global Business Environments"
      intro="Your role is to manage the road freight stages of a pharmaceutical shipment from Bahrain to the Netherlands. Both options use air freight internationally, but each route uses a different regional road gateway and Netherlands airport. Your task is to decide which Road + Air route best manages cost, lead time, compliance, safety, technology, sustainability, cold chain requirements, and final delivery reliability."
      actions={<button className="primary-button" onClick={onNext}>View Route Options</button>}
    >
      <div className="intro-grid">
        <article className="requirement-card">
          <span className="detail-label">Delivery requirement</span>
          <strong>The shipment must arrive within 7 days.</strong>
        </article>
        <article className="requirement-card">
          <span className="detail-label">Research prompt</span>
          <strong>Which gateway combination offers better pharmaceutical cold chain capability and faster air cargo connectivity: Dammam + Rotterdam Airport, or Riyadh + Amsterdam Schiphol Airport?</strong>
        </article>
      </div>
    </Screen>
  );
}

function RouteOverview({ onBack, onNext }) {
  return (
    <Screen
      title="Route Overview"
      intro="Compare the two Road + Air route plans. Each card shows road freight stages, airport connector, cost, lead time, emissions, and delivery status."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onNext}>Compare First and Last Mile</button>
        </>
      }
    >
      <div className="route-map-grid">
        {Object.values(routeOptions).map((route) => (
          <RouteMapGroup route={route} key={route.id} />
        ))}
      </div>
      <ComparisonStrip />
    </Screen>
  );
}

function RouteMapGroup({ route }) {
  return (
    <article className="map-group">
      <div className="route-option-header">
        <div>
          <span className="detail-label">{route.option}</span>
          <h3>{route.name}</h3>
        </div>
        <StatusBadge route={route} />
      </div>
      <ul className="route-summary-list">
        {route.summaryStages.map((stage) => (
          <li key={stage}>{stage}</li>
        ))}
      </ul>
      <div className="route-metrics" aria-label={`${route.name} route values`}>
        <Metric label="Cost" value={route.cost} />
        <Metric label="Lead time" value={route.totalLeadTime} />
        <Metric label="CO2 emissions" value={route.emissions} />
      </div>
      <div className="stage-map-list">
        {route.stages.map((stage) => (
          <StageMap stage={stage} key={`${route.id}-${stage.title}`} />
        ))}
      </div>
    </article>
  );
}

function StageMap({ stage }) {
  const middleLabel = stage.via ? stage.via : stage.mode;
  return (
    <article className={`stage-map-card ${stage.type}`}>
      <div>
        <p className="stage-title">{stage.title}: {stage.context}</p>
        <h4>{stage.from} {"->"} {stage.to}</h4>
        <span className="detail-label">{stage.mode}</span>
      </div>
      <div className="static-map" aria-label={`${stage.from} to ${stage.to} by ${stage.mode}`}>
        <span>{stage.from}</span>
        <span className={`route-line ${stage.type}`} aria-hidden="true" />
        <span>{middleLabel}</span>
        <span className={`route-line ${stage.type}`} aria-hidden="true" />
        <span>{stage.to}</span>
      </div>
    </article>
  );
}

function FmlmComparison({ onBack, onNext }) {
  return (
    <Screen
      title="First-Mile and Last-Mile Road Freight Comparison"
      intro="Use this quick comparison to think about first-mile/regional road freight, airport handover, last-mile delivery, and sustainability before selecting a route."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onNext}>Select Route Plan</button>
        </>
      }
    >
      <div className="fmlm-grid" aria-label="First-mile and last-mile comparison">
        <div className="fmlm-header">
          <strong>Factor</strong>
          <strong>Option A</strong>
          <strong>Option B</strong>
        </div>
        {fmlmComparison.map((item) => (
          <article className="fmlm-row" key={item.factor}>
            <h3>{item.factor}</h3>
            <div>
              <span className="detail-label">Option A</span>
              <p>{item.optionA}</p>
            </div>
            <div>
              <span className="detail-label">Option B</span>
              <p>{item.optionB}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="disclaimer">{disclaimer}</p>
    </Screen>
  );
}

function RouteSelection({ routeId, setRouteId, onBack, onNext }) {
  return (
    <Screen
      title="Which Road + Air route plan best manages the shipment's cost, lead time, compliance, safety, technology, sustainability, and cold chain requirements?"
      intro="Select one route plan using only the route summary, cost, lead time, estimated CO2 emissions, and 7-day delivery status."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onNext} disabled={!routeId}>
            Rank Freight Constraints
          </button>
        </>
      }
    >
      <div className="route-comparison" aria-label="Route options">
        {Object.values(routeOptions).map((route) => (
          <RouteOptionCard
            key={route.id}
            route={route}
            selected={routeId === route.id}
            onSelect={() => setRouteId(route.id)}
          />
        ))}
      </div>
      <ComparisonStrip />
      <p className="disclaimer">{disclaimer}</p>
    </Screen>
  );
}

function RouteOptionCard({ route, selected, onSelect }) {
  return (
    <article className={`route-option ${selected ? "selected" : ""}`}>
      <div className="route-option-header">
        <div>
          <span className="detail-label">{route.option}</span>
          <h3>{route.name}</h3>
        </div>
        <StatusBadge route={route} />
      </div>
      <ul className="route-summary-list">
        {route.summaryStages.map((stage) => (
          <li key={stage}>{stage}</li>
        ))}
      </ul>
      <div className="route-metrics" aria-label={`${route.name} selection data`}>
        <Metric label="Cost" value={route.cost} />
        <Metric label="Lead time" value={route.totalLeadTime} />
        <Metric label="CO2 emissions" value={route.emissions} />
      </div>
      <ul className="route-focus-list">
        {route.selectionHighlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <button className="primary-button" type="button" onClick={onSelect}>
        {selected ? "Selected Route" : "Select Route"}
      </button>
    </article>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <span className="detail-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ route }) {
  const status = getDeliveryStatus(route);
  return <span className={`status-badge ${status.meetsRequirement ? "meets" : "warning"}`}>{route.selectionStatus}</span>;
}

function ComparisonStrip() {
  return (
    <div className="comparison-strip" aria-label="Cost lead time and emissions comparison">
      {comparisonFacts.map((fact) => (
        <span key={fact}>{fact}</span>
      ))}
    </div>
  );
}

function ConstraintRanking({ selectedConstraints, setSelectedConstraints, onBack, onNext }) {
  const toggleConstraint = (constraintId) => {
    if (selectedConstraints.includes(constraintId)) {
      setSelectedConstraints(selectedConstraints.filter((item) => item !== constraintId));
      return;
    }

    if (selectedConstraints.length < 3) {
      setSelectedConstraints([...selectedConstraints, constraintId]);
    }
  };

  return (
    <Screen
      title="Standard Freight Constraint Ranking"
      intro="Based on your selected route, rank the top 3 freight constraints you need to manage most."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onNext} disabled={selectedConstraints.length !== 3}>
            View Results
          </button>
        </>
      }
    >
      <div className="risk-status">
        <strong>{selectedConstraints.length}/3 selected</strong>
        <span>{selectedConstraints.length === 3 ? "Ready to continue" : "Tap cards in priority order"}</span>
      </div>
      <div className="risk-list">
        {constraintItems.map((constraint) => {
          const index = selectedConstraints.indexOf(constraint.id);
          const selected = index !== -1;
          return (
            <button
              className={`risk-option ${selected ? "selected" : ""}`}
              key={constraint.id}
              onClick={() => toggleConstraint(constraint.id)}
              type="button"
            >
              <span>{selected ? index + 1 : ""}</span>
              <div>
                <strong>{constraint.label}</strong>
                <p>{constraint.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </Screen>
  );
}

function Result({ selectedRoute, rankedConstraints, strategy, score, scoreMeaning, scoreExplanation, recommendation, summary, copyStatus, onCopy, onBack, onRestart }) {
  const route = selectedRoute || routeOptions.optionA;
  const status = getDeliveryStatus(route);
  const rankedItems = rankedConstraints
    .map((constraintId) => constraintItems.find((constraint) => constraint.id === constraintId))
    .filter(Boolean);

  return (
    <Screen
      title="Results"
      intro="Review how the selected Road + Air route, ranked constraints, delivery status, emissions, and route management awareness connect."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="secondary-button" onClick={onCopy}>
            <Icon type="copy" />
            Copy Summary
          </button>
          <button className="primary-button" onClick={onRestart}>
            <Icon type="restart" />
            Restart Activity
          </button>
        </>
      }
    >
      <div className="result-layout">
        <section className={`score-panel ${score >= 70 ? "meets-panel" : "warning-panel"}`}>
          <p>Route Management Score</p>
          <strong>{score}</strong>
          <span>out of 100</span>
          <p>{scoreMeaning}</p>
        </section>
        <section className="result-details">
          <div>
            <span className="detail-label">Selected route plan</span>
            <strong>{route.resultLabel}</strong>
          </div>
          <ul className="route-summary-list">
            {route.summaryStages.map((stage) => (
              <li key={stage}>{stage}</li>
            ))}
          </ul>
          <div className="result-stat-grid">
            <Metric label="Total estimated cost" value={route.cost} />
            <Metric label="Total estimated lead time" value={route.totalLeadTime} />
            <Metric label="Estimated CO2 emissions" value={route.emissions} />
            <Metric label="Delivery requirement" value="Within 7 days" />
            <div>
              <span className="detail-label">Selected route delivery status</span>
              <strong>{status.label}</strong>
              <p>{route.statusExplanation}</p>
            </div>
            <Metric label="Route Management Score" value={`${score}/100`} />
          </div>
          <article className="strategy-result-card">
            <span className="detail-label">Route Management Score explanation</span>
            <p>{routeManagementScoreExplanation}</p>
            <p>{scoreExplanation}</p>
          </article>
          <ComparisonStrip />
          <div>
            <span className="detail-label">Selected route logic</span>
            <ul className="route-focus-list">
              {route.routeLogic.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="detail-label">Ranked top 3 freight constraints</span>
            <ol className="risk-summary">
              {rankedItems.map((constraint) => (
                <li key={constraint.id}>
                  <strong>{constraint.label}</strong>
                  <p>{getConstraintInterpretation(route, constraint.id)}</p>
                </li>
              ))}
            </ol>
          </div>
          <article className="strategy-result-card">
            <span className="detail-label">Your Road Freight Strategy</span>
            <h3>{strategy.title}</h3>
            <p>{strategy.explanation}</p>
          </article>
          <article className="strategy-result-card">
            <span className="detail-label">Brief route recommendation</span>
            <p>{recommendation}</p>
          </article>
          <div>
            <span className="detail-label">Final reflection question</span>
            <p>How can road freight planners decide which regional gateway and Netherlands airport best support pharmaceutical cold chain performance, cost control, compliance, safety, technology visibility, sustainability, and final delivery reliability?</p>
          </div>
          {copyStatus && <p className="copy-status">{copyStatus}</p>}
        </section>
      </div>
      <p className="disclaimer">{disclaimer}</p>
      <textarea className="summary-box" value={summary} readOnly aria-label="Copyable result summary" />
    </Screen>
  );
}

function Screen({ title, intro, children, actions }) {
  return (
    <div className="screen-card">
      <div className="screen-heading">
        <div>
          <h2>{title}</h2>
          <p>{intro}</p>
        </div>
      </div>
      {children}
      <div className="actions">{actions}</div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
