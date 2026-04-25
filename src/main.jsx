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
    modeLabel: "Road freight + air connector + road final-mile",
    cost: "BHD 8,000",
    costValue: 8000,
    totalLeadTime: "5-8 days",
    minLeadDays: 5,
    maxLeadDays: 8,
    costTone: "Lower cost",
    timeTone: "Risky lead time buffer",
    requirementStatus: "Risky / may not meet requirement",
    selectionStatus: "Delivery status: Risky - 5-8 days against a 7-day requirement",
    statusExplanation:
      "This route is cost-efficient but has a higher risk of missing the 7-day delivery requirement if delays occur.",
    focusPoints:
      "Border clearance, Dammam airport connectivity, road-air handover, cold chain capability, and visibility across a tight 5-8 day route.",
    legs: [
      {
        title: "Road leg 1",
        context: "Local and regional road freight",
        from: "Local Bahraini logistics provider",
        to: "Dammam gateway / airport",
        mode: "Road freight",
        type: "road",
        note: "Road movement must protect timing, temperature control, and border coordination.",
      },
      {
        title: "Air leg",
        context: "International connector",
        from: "Dammam",
        to: "Rotterdam Airport",
        mode: "Air freight",
        type: "air",
        note: "Connector reliability depends on air cargo availability and pharma handling capability.",
      },
      {
        title: "Road leg 2",
        context: "Global last-mile road freight",
        from: "Rotterdam Airport",
        to: "Cobeco Pharma Wholesale BV",
        mode: "Road freight",
        type: "road",
        note: "Final-mile delivery must be coordinated quickly to stay within the 7-day requirement.",
      },
    ],
  },
  optionB: {
    id: "optionB",
    option: "Option B",
    name: "Riyadh Gateway Road + Air Plan",
    resultLabel: "Option B: Riyadh Gateway Road + Air Plan",
    modeLabel: "Road freight + air connector + road final-mile",
    cost: "BHD 10,000",
    costValue: 10000,
    totalLeadTime: "3-5 days",
    minLeadDays: 3,
    maxLeadDays: 5,
    costTone: "Higher cost",
    timeTone: "Shorter lead time",
    requirementStatus: "Meets requirement",
    selectionStatus: "Delivery status: Strong fit - 3-5 days against a 7-day requirement",
    statusExplanation:
      "This route better supports the 7-day delivery requirement, but it requires higher cost and strong coordination.",
    focusPoints:
      "Longer regional road movement, fast handover, delivery reliability, airport handling, and higher transport cost.",
    legs: [
      {
        title: "Road leg 1",
        context: "Local and regional road freight",
        from: "Local Bahraini logistics provider",
        to: "Riyadh logistics hub / airport",
        mode: "Road freight",
        type: "road",
        note: "Longer road movement must manage driver-hour planning, timing pressure, and temperature control.",
      },
      {
        title: "Air leg",
        context: "International connector",
        from: "Riyadh",
        to: "Rotterdam Airport or Amsterdam Schiphol",
        mode: "Air freight",
        type: "air",
        note: "Connector mode supports the time-critical deadline when airport handling is coordinated.",
      },
      {
        title: "Road leg 2",
        context: "Global last-mile road freight",
        from: "Rotterdam Airport / Amsterdam Schiphol",
        to: "Cobeco Pharma Wholesale BV",
        mode: "Road freight",
        type: "road",
        note: "Final-mile road delivery must connect tightly with airport release and handover timing.",
      },
    ],
  },
};

const comparisonFacts = [
  "Option A is cheaper by BHD 2,000.",
  "Option A is 20% cheaper than Option B.",
  "Option B is faster by approximately 2-3 days.",
  "Option A may fail the 7-day requirement if delays occur.",
  "Option B is the stronger time-critical option.",
];

const roadMovementStages = [
  {
    label: "Local road freight",
    detail: "Local Bahraini logistics provider to gateway",
    roadFocus: true,
  },
  {
    label: "Regional road freight",
    detail: "Bahrain to Dammam gateway or Bahrain to Riyadh airport/logistics hub",
    roadFocus: true,
  },
  {
    label: "International connector",
    detail: "Air movement between regional gateway and Dutch airport",
    roadFocus: false,
  },
  {
    label: "Global last-mile road freight",
    detail: "Rotterdam gateway/airport to Cobeco Pharma Wholesale BV",
    roadFocus: true,
  },
];

const riskFocusByRoute = {
  optionA: [
    {
      id: "leadTimeBuffer",
      label: "Lead Time Buffer Risk",
      description:
        "The route has a 5-8 day lead time against a 7-day maximum, so border, loading/unloading, air uplift, or last-mile delays can cause the shipment to miss the requirement.",
    },
    {
      id: "airportConnectivity",
      label: "Airport Connectivity Risk",
      description:
        "Dammam to Rotterdam Airport may have weaker or less frequent cargo connectivity, which can affect the ability to stay within the 7-day requirement.",
    },
    {
      id: "coldChainCapability",
      label: "Cold Chain Capability Risk",
      description:
        "Students must assess whether the Dammam and Rotterdam Airport combination provides strong enough pharma handling, temperature control, and cold chain facilities.",
    },
    {
      id: "complianceHandover",
      label: "Compliance and Handover Risk",
      description:
        "Customs, pharmaceutical documentation, road-air handover, and controlled transfer must be managed carefully.",
    },
    {
      id: "techVisibility",
      label: "Technology / Visibility Risk",
      description:
        "Tracking, temperature monitoring, and digital documentation are needed to keep the shipment visible and controlled across the route.",
    },
  ],
  optionB: [
    {
      id: "costRisk",
      label: "Cost Risk",
      description:
        "This route costs more because of longer regional road movement and potentially stronger air cargo connectivity.",
    },
    {
      id: "regionalRoadExposure",
      label: "Regional Road Exposure Risk",
      description:
        "Bahrain to Riyadh is a longer road movement, increasing exposure to delays, fuel cost, driver-hour planning, and timing pressure.",
    },
    {
      id: "fastHandover",
      label: "Fast Handover Risk",
      description:
        "Time-critical movement requires accurate coordination between road transport, airport handling, air freight, and final-mile delivery.",
    },
    {
      id: "complianceRisk",
      label: "Compliance Risk",
      description:
        "Customs checks, pharmaceutical documentation, airport handling, and cold chain requirements must be controlled across a faster route.",
    },
    {
      id: "technologyTracking",
      label: "Technology / Tracking Risk",
      description:
        "Real-time tracking and temperature monitoring are needed to maintain visibility during the longer road leg and fast air-linked movement.",
    },
  ],
};

const disclaimer =
  "Figures are simplified estimates for classroom decision-making and are used to compare trade-offs, not to represent live freight quotations.";

const defaultState = {
  started: true,
  step: 1,
  routeId: "",
  selectedRisks: [],
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
      ? "Meets requirement"
      : risky
        ? "Risky / may not meet requirement if delays occur"
        : "Does not meet requirement",
    detail: meetsRequirement
      ? "Meets requirement"
      : risky
        ? "Risky / may not meet requirement if delays occur"
        : "Does not meet the delivery requirement. Students need to reconsider their plan.",
  };
}

function getRiskItems(route) {
  return riskFocusByRoute[route?.id] || riskFocusByRoute.optionA;
}

function getStrategy(route, rankedItems) {
  const firstChoice = rankedItems[0] || "";
  const riskItem = getRiskItems(route).find((risk) => risk.id === firstChoice);
  const title = riskItem ? `${riskItem.label} Management Strategy` : "Road Freight Strategy";

  let explanation = "Rank the top three freight risks to generate a road freight management strategy.";
  if (route?.id === "optionA" && firstChoice === "leadTimeBuffer") {
    explanation =
      "You selected a Lead Time Buffer Risk strategy. This means your Dammam gateway plan must control border clearance, loading/unloading, air uplift, and final-mile timing because the 5-8 day range can exceed the 7-day requirement.";
  } else if (route?.id === "optionA" && firstChoice === "airportConnectivity") {
    explanation =
      "You selected an Airport Connectivity Risk strategy. This means your road freight plan must verify Dammam air cargo availability and handover timing before relying on the lower-cost route.";
  } else if (route?.id === "optionA" && firstChoice === "coldChainCapability") {
    explanation =
      "You selected a Cold Chain Capability Risk strategy. This means your plan must confirm pharma handling, temperature control, and cold-chain facilities at Dammam and Rotterdam Airport.";
  } else if (route?.id === "optionB" && firstChoice === "costRisk") {
    explanation =
      "You selected a Cost Risk strategy. This means your Riyadh gateway plan must justify the higher BHD 10,000 cost by linking it to deadline reliability and stronger air cargo coordination.";
  } else if (route?.id === "optionB" && firstChoice === "regionalRoadExposure") {
    explanation =
      "You selected a Regional Road Exposure Risk strategy. This means your road freight plan must control the longer Bahrain-to-Riyadh movement, driver-hour planning, timing pressure, and temperature protection.";
  } else if (route?.id === "optionB" && firstChoice === "fastHandover") {
    explanation =
      "You selected a Fast Handover Risk strategy. This means the road, airport, air freight, and final-mile stages must be tightly coordinated to protect the 3-5 day route.";
  } else if (riskItem) {
    explanation =
      `You selected a ${riskItem.label} strategy. This means your team should manage ${riskItem.description.charAt(0).toLowerCase()}${riskItem.description.slice(1)}`;
  }

  return {
    title,
    explanation:
      explanation,
    alignment: getRouteSpecificFocus(route, firstChoice),
  };
}

function getRouteSpecificFocus(route, focusId) {
  if (!route || !focusId) return "Select a route and rank three risks to complete the strategy check.";
  if (route.id === "optionA") {
    if (focusId === "leadTimeBuffer") {
      return "This is the key risk for Option A because the route can meet the 7-day requirement only if operations are smooth.";
    }
    return "Option A is cost-efficient, but the selected risk must be managed carefully because the delivery buffer is tight.";
  }

  if (focusId === "costRisk") {
    return "Option B is stronger for the 7-day deadline, but the higher cost must be justified by time-critical delivery value.";
  }
  return "Option B better supports the 7-day delivery requirement, but it still needs strong road-air-road coordination.";
}

function getRecommendation(route, rankedItems) {
  const firstChoice = rankedItems[0] || "";
  if (route?.id === "optionA") {
    const recommendations = {
      leadTimeBuffer:
        "Build a delay buffer plan for border clearance, loading/unloading, air uplift, and final-mile delivery before choosing the Dammam gateway.",
      airportConnectivity:
        "Confirm Dammam-to-Rotterdam air cargo connectivity and uplift timing before dispatching the road leg.",
      coldChainCapability:
        "Verify pharma handling, temperature control, and cold-chain facilities at Dammam and Rotterdam Airport.",
      complianceHandover:
        "Prepare customs, pharmaceutical documentation, and controlled road-air handover checks before pickup.",
      techVisibility:
        "Use tracking, temperature monitoring, and digital documentation to keep the risky 5-8 day route visible.",
    };
    return recommendations[firstChoice] || route.statusExplanation;
  }

  const recommendations = {
    costRisk: "Justify the BHD 10,000 premium by linking it to the 7-day requirement and stronger air cargo coordination.",
    regionalRoadExposure:
      "Control the longer Bahrain-to-Riyadh road leg with driver-hour planning, border readiness, and temperature monitoring.",
    fastHandover:
      "Coordinate road pickup, Riyadh airport handling, air freight, and final-mile delivery so the 3-5 day route stays reliable.",
    complianceRisk:
      "Prepare customs, airport, pharmaceutical handling, and cold-chain documents before the shipment reaches Riyadh.",
    technologyTracking:
      "Use real-time tracking and temperature monitoring across the longer road leg and fast air-linked movement.",
  };
  return recommendations[firstChoice] || route.statusExplanation;
}

function calculateScore(route, rankedItems) {
  const topThree = rankedItems.slice(0, 3);
  let score = 60;

  if (route?.id === "optionA") {
    if (rankedItems[0] === "leadTimeBuffer") score += 20;
    if (!topThree.includes("leadTimeBuffer")) score -= 15;
    if (topThree.includes("airportConnectivity")) score += 10;
    if (topThree.includes("coldChainCapability")) score += 10;
    if (topThree.includes("complianceHandover")) score += 10;
    if (topThree.includes("techVisibility")) score += 5;
  } else {
    if (rankedItems[0] === "costRisk") score += 15;
    if (rankedItems.slice(0, 2).includes("regionalRoadExposure")) score += 15;
    if (topThree.includes("fastHandover")) score += 10;
    if (topThree.includes("complianceRisk")) score += 5;
    if (topThree.includes("technologyTracking")) score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

function App() {
  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem("roadFreightDecisionLab");
    if (!saved) return defaultState;
    try {
      const parsed = JSON.parse(saved);
      const allRiskIds = Object.values(riskFocusByRoute).flat().map((risk) => risk.id);
      const selectedRisks = (parsed.selectedRisks || []).filter((item) =>
        allRiskIds.includes(item)
      );
      const routeId = parsed.routeId === "sea"
        ? "optionA"
        : parsed.routeId === "air"
          ? "optionB"
          : parsed.routeId;
      return { ...defaultState, ...parsed, routeId, started: true, selectedRisks };
    } catch {
      return defaultState;
    }
  });
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    localStorage.setItem("roadFreightDecisionLab", JSON.stringify(activity));
  }, [activity]);

  const selectedRoute = routeOptions[activity.routeId] || null;
  const routeRisks = getRiskItems(selectedRoute);
  const strategy = useMemo(
    () => getStrategy(selectedRoute, activity.selectedRisks),
    [selectedRoute, activity.selectedRisks]
  );
  const recommendation = useMemo(
    () => getRecommendation(selectedRoute, activity.selectedRisks),
    [selectedRoute, activity.selectedRisks]
  );
  const score = useMemo(
    () => calculateScore(selectedRoute, activity.selectedRisks),
    [selectedRoute, activity.selectedRisks]
  );

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
    setActivity({ ...defaultState, routeId: "", selectedRisks: [] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const summary = [
    "Road Freight Route Management Simulator Result",
    `Selected route plan: ${selectedRoute?.resultLabel || "Not selected"}`,
    `Total estimated cost: ${selectedRoute?.cost || "Not selected"}`,
    `Total estimated lead time: ${selectedRoute?.totalLeadTime || "Not selected"}`,
    `Delivery requirement: within ${deliveryRequirementDays} days`,
    `Delivery status: ${selectedRoute ? getDeliveryStatus(selectedRoute).detail : "Not selected"}`,
    ...comparisonFacts,
    `Ranked top 3 freight risks/constraints: ${activity.selectedRisks
      .map((item) => routeRisks.find((risk) => risk.id === item)?.label)
      .filter(Boolean)
      .join("; ") || "Not selected"}`,
    `Route management score: ${score}/100`,
    `Your Road Freight Strategy: ${strategy.title}`,
    `Strategy explanation: ${strategy.explanation}`,
    `Alignment check: ${strategy.alignment}`,
    `Recommendation: ${recommendation}`,
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
          <RouteSelection
            routeId={activity.routeId}
            setRouteId={(routeId) => updateActivity({ routeId, selectedRisks: [] })}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
          />
        )}
        {activity.step === 4 && (
          <RiskRanking
            selectedRisks={activity.selectedRisks}
            riskItems={routeRisks}
            setSelectedRisks={(selectedRisks) => updateActivity({ selectedRisks })}
            onBack={() => goToStep(3)}
            onNext={() => goToStep(5)}
          />
        )}
        {activity.step === 5 && (
          <Result
            selectedRoute={selectedRoute}
            rankedRisks={activity.selectedRisks}
            riskItems={routeRisks}
            strategy={strategy}
            recommendation={recommendation}
            score={score}
            summary={summary}
            copyStatus={copyStatus}
            onCopy={copySummary}
            onBack={() => goToStep(4)}
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
        <span>Road Freight Route Management Simulator</span>
      </button>
      <span className="context-tag">Road freight operations</span>
    </header>
  );
}

function Progress({ step }) {
  const labels = ["Scenario", "Overview", "Select Route", "Rank Focus", "Results"];
  return (
    <div className="progress-wrap" aria-label={`Step ${step} of 5`}>
      <div className="progress-header">
        <span>Step {step} of 5</span>
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
      intro="Your role is to manage the road freight stages of a time-critical pharmaceutical shipment from Bahrain to the Netherlands. Delays in border clearance, loading/unloading, airport handover, road movement, temperature control, or final-mile delivery can affect route success."
      actions={<button className="primary-button" onClick={onNext}>View Route Overview</button>}
    >
      <div className="intro-grid">
        <article className="requirement-card">
          <span className="detail-label">Delivery requirement</span>
          <strong>The shipment must arrive within a maximum of 7 days.</strong>
        </article>
        <article className="requirement-card">
          <span className="detail-label">Planning role</span>
          <strong>Road freight operations planner</strong>
          <p>Plan the local, regional, and last-mile road freight operations that connect with air freight internationally.</p>
        </article>
      </div>
    </Screen>
  );
}

function RouteOverview({ onBack, onNext }) {
  return (
    <Screen
      title="Route Overview"
      intro="Road freight supports every option through first-mile, regional, and final-mile movement. Air freight is the international connector, while road operations determine whether the 7-day requirement remains realistic."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onNext}>Select Route Plan</button>
        </>
      }
    >
      <div className="timeline" aria-label="Road freight movement stages">
        {roadMovementStages.map((stage) => (
          <article className={`stage-card ${stage.roadFocus ? "road-focus" : ""}`} key={stage.label}>
            <span className="stage-pill">{stage.roadFocus ? "Road" : "Link"}</span>
            <p className="stage-title">{stage.label}</p>
            <h3>{stage.detail}</h3>
          </article>
        ))}
      </div>
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
        <h3>{route.name}</h3>
        <StatusBadge route={route} />
      </div>
      <div className="stage-map-list">
        {route.legs.map((leg, index) => (
          <StageMap leg={leg} index={index + 1} key={`${route.id}-${leg.title}`} />
        ))}
      </div>
    </article>
  );
}

function StageMap({ leg, index }) {
  return (
    <article className={`stage-map-card ${leg.type}`}>
      <div>
        <p className="stage-title">Map {index}: {leg.context}</p>
        <h4>{leg.from} → {leg.to}</h4>
        <span className="detail-label">{leg.mode}</span>
      </div>
      <div className="static-map" aria-label={`${leg.from} to ${leg.to} by ${leg.mode}`}>
        <span>{leg.from}</span>
        <span className={`route-line ${leg.type}`} />
        <span>{leg.to}</span>
      </div>
      <p>{leg.note}</p>
    </article>
  );
}

function RouteSelection({ routeId, setRouteId, onBack, onNext }) {
  return (
    <Screen
      title="Select the road freight route plan that best supports the shipment objective."
      intro="Choose one road freight support plan. Review cost, lead time, and the 7-day delivery requirement before continuing."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onNext} disabled={!routeId}>
            Rank Freight Focus
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
        <h3>{route.name}</h3>
        <StatusBadge route={route} />
      </div>
      <ul className="route-summary-list">
        {route.legs.map((leg) => (
          <li key={leg.title}>{leg.from} → {leg.to} by {leg.mode.toLowerCase()}</li>
        ))}
      </ul>
      <div className="route-metrics" aria-label={`${route.name} neutral data`}>
        <div>
          <span className="detail-label">Total cost</span>
          <strong>{route.cost}</strong>
        </div>
        <div>
          <span className="detail-label">Total lead time</span>
          <strong>{route.totalLeadTime}</strong>
        </div>
        <div>
          <span className="detail-label">Route profile</span>
          <strong>{route.costTone}</strong>
          <strong>{route.timeTone}</strong>
        </div>
      </div>
      <button className="primary-button" type="button" onClick={onSelect}>
        {selected ? "Selected Route" : "Select Route"}
      </button>
    </article>
  );
}

function StatusBadge({ route }) {
  const status = getDeliveryStatus(route);
  return <span className={`status-badge ${status.meetsRequirement ? "meets" : "warning"}`}>{route.selectionStatus}</span>;
}

function ComparisonStrip() {
  return (
    <div className="comparison-strip" aria-label="Cost and lead time comparison">
      {comparisonFacts.map((fact) => (
        <span key={fact}>{fact}</span>
      ))}
    </div>
  );
}

function RiskRanking({ selectedRisks, riskItems, setSelectedRisks, onBack, onNext }) {
  const toggleRisk = (riskId) => {
    if (selectedRisks.includes(riskId)) {
      setSelectedRisks(selectedRisks.filter((item) => item !== riskId));
      return;
    }

    if (selectedRisks.length < 3) {
      setSelectedRisks([...selectedRisks, riskId]);
    }
  };

  return (
    <Screen
      title="Freight Risk Focus Ranking"
      intro="Based on your selected route, rank the top 3 freight risks/constraints you need to focus on most."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onNext} disabled={selectedRisks.length !== 3}>
            View Results
          </button>
        </>
      }
    >
      <div className="risk-status">
        <strong>{selectedRisks.length}/3 selected</strong>
        <span>{selectedRisks.length === 3 ? "Ready to continue" : "Select exactly three focus areas"}</span>
      </div>
      <div className="risk-list">
        {riskItems.map((risk) => {
          const index = selectedRisks.indexOf(risk.id);
          const selected = index !== -1;
          return (
            <button
              className={`risk-option ${selected ? "selected" : ""}`}
              key={risk.id}
              onClick={() => toggleRisk(risk.id)}
              type="button"
            >
              <span>{selected ? index + 1 : ""}</span>
              <div>
                <strong>{risk.label}</strong>
                <p>{risk.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </Screen>
  );
}

function Result({ selectedRoute, rankedRisks, riskItems, strategy, recommendation, score, summary, copyStatus, onCopy, onBack, onRestart }) {
  const route = selectedRoute || routeOptions.optionA;
  const status = getDeliveryStatus(route);
  const rankedLabels = rankedRisks
    .map((riskId) => riskItems.find((risk) => risk.id === riskId)?.label)
    .filter(Boolean);

  return (
    <Screen
      title="Results"
      intro="Review how the selected road freight support plan, ranked focus areas, and delivery requirement connect."
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
        <section className={`score-panel ${status.meetsRequirement ? "meets-panel" : "warning-panel"}`}>
          <p>Delivery requirement</p>
          <strong>7</strong>
          <span>days maximum</span>
          <p>Selected route: {route.totalLeadTime}</p>
          <span>{status.label}</span>
          <p>Route management score: {score}/100</p>
        </section>
        <section className="result-details">
          <div>
            <span className="detail-label">Selected route plan</span>
            <strong>{route.resultLabel}</strong>
          </div>
          <div className="result-stat-grid">
            <div>
              <span className="detail-label">Total estimated cost</span>
              <strong>{route.cost}</strong>
            </div>
            <div>
              <span className="detail-label">Total estimated lead time</span>
              <strong>{route.totalLeadTime}</strong>
            </div>
            <div>
              <span className="detail-label">Delivery requirement</span>
              <strong>Within 7 days</strong>
            </div>
            <div>
              <span className="detail-label">Selected route lead time</span>
              <strong>{route.totalLeadTime}</strong>
            </div>
            <div>
              <span className="detail-label">Delivery status</span>
              <strong>{status.detail}</strong>
              <p>{route.statusExplanation}</p>
            </div>
            <div>
              <span className="detail-label">Route management score</span>
              <strong>{score}/100</strong>
            </div>
          </div>
          <ComparisonStrip />
          <div>
            <span className="detail-label">Ranked top 3 freight risks/constraints</span>
            <ol className="risk-summary">
              {rankedLabels.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ol>
          </div>
          <article className="strategy-result-card">
            <span className="detail-label">Your Road Freight Strategy</span>
            <h3>{strategy.title}</h3>
            <p>{strategy.explanation}</p>
            <p>{strategy.alignment}</p>
          </article>
          <div>
            <span className="detail-label">Road freight management recommendation</span>
            <p>{recommendation}</p>
            <p>Final framing: this is a time-critical pharmaceutical shipment with a 7-day delivery requirement. Option A is more cost-efficient but has delivery buffer risk, while Option B is faster and stronger for the deadline but more expensive.</p>
          </div>
          <div>
            <span className="detail-label">Final reflection question</span>
            <p>How can road freight be managed effectively across local, regional, and global stages to ensure the pharmaceutical shipment reaches Cobeco Pharma safely, reliably, and cost-effectively?</p>
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
