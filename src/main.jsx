import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const deliveryRequirementDays = 40;

const riskFocusItems = [
  { id: "cost", label: "Cost" },
  { id: "leadTime", label: "Lead Time" },
  { id: "compliance", label: "Compliance" },
  { id: "safety", label: "Safety" },
  { id: "technology", label: "Technology" },
];

const routeOptions = {
  sea: {
    id: "sea",
    option: "Option A",
    name: "Cost-Efficient Road + Sea Plan",
    resultLabel: "Option A: Cost-Efficient Road + Sea Plan",
    modeLabel: "Road freight + sea connector + road final-mile",
    cost: "BHD 3,500",
    costValue: 3500,
    totalLeadTime: "27-37 days",
    minLeadDays: 27,
    maxLeadDays: 37,
    costTone: "Lower cost",
    timeTone: "Longer lead time",
    requirementStatus: "Meets 40-day delivery requirement",
    focusPoints:
      "Port coordination, cold chain continuity, customs/border planning, longer transit exposure, and visibility across a longer route.",
    legs: [
      {
        title: "Road leg 1",
        context: "Local and regional road freight",
        from: "Local Bahraini logistics provider",
        to: "Dammam Port",
        mode: "Road freight",
        type: "road",
        note: "Main road freight planning stage",
      },
      {
        title: "Sea leg",
        context: "International connector",
        from: "Dammam Port",
        to: "Port of Rotterdam",
        mode: "Sea freight",
        type: "sea",
        note: "Connector mode supported by road freight",
      },
      {
        title: "Road leg 2",
        context: "Global last-mile road freight",
        from: "Port of Rotterdam",
        to: "Cobeco Pharma Wholesale BV",
        mode: "Road freight",
        type: "road",
        note: "Final delivery reliability stage",
      },
    ],
  },
  air: {
    id: "air",
    option: "Option B",
    name: "Time-Critical Road + Air Plan",
    resultLabel: "Option B: Time-Critical Road + Air Plan",
    modeLabel: "Road freight + air connector + road final-mile",
    cost: "BHD 10,000",
    costValue: 10000,
    totalLeadTime: "3-5 days",
    minLeadDays: 3,
    maxLeadDays: 5,
    costTone: "Higher cost",
    timeTone: "Shorter lead time",
    requirementStatus: "Meets 40-day delivery requirement",
    focusPoints:
      "Fast handover, delivery reliability, shorter transit exposure, airport handling, and higher transport cost.",
    legs: [
      {
        title: "Road leg 1",
        context: "Local and regional road freight",
        from: "Local Bahraini logistics provider",
        to: "Riyadh logistics hub / airport",
        mode: "Road freight",
        type: "road",
        note: "Main road freight planning stage",
      },
      {
        title: "Air leg",
        context: "International connector",
        from: "Riyadh",
        to: "Rotterdam Airport or Amsterdam Schiphol",
        mode: "Air freight",
        type: "air",
        note: "Connector mode supported by road freight",
      },
      {
        title: "Road leg 2",
        context: "Global last-mile road freight",
        from: "Rotterdam Airport / Amsterdam Schiphol",
        to: "Cobeco Pharma Wholesale BV",
        mode: "Road freight",
        type: "road",
        note: "Final delivery reliability stage",
      },
    ],
  },
};

const comparisonFacts = [
  "Option A is cheaper by BHD 6,500, equal to 65% lower cost than Option B.",
  "Option B is faster by 24-32 days.",
  "Both routes meet the 40-day delivery requirement.",
];

const roadMovementStages = [
  {
    label: "Local road freight",
    detail: "Local Bahraini logistics provider to gateway",
    roadFocus: true,
  },
  {
    label: "Regional road freight",
    detail: "Bahrain to Dammam Port or Bahrain to Riyadh airport/logistics hub",
    roadFocus: true,
  },
  {
    label: "International connector",
    detail: "Sea or air movement between regional and European gateways",
    roadFocus: false,
  },
  {
    label: "Global last-mile road freight",
    detail: "Rotterdam gateway/airport to Cobeco Pharma Wholesale BV",
    roadFocus: true,
  },
];

const strategyText = {
  cost: {
    title: "Cost-Efficiency Strategy",
    explanation:
      "You selected a Cost-Efficiency Strategy. This means your road freight plan prioritises reducing total transport cost while managing longer lead time, compliance checks, and cold chain visibility across the route.",
  },
  leadTime: {
    title: "Time-Critical Delivery Strategy",
    explanation:
      "You selected a Time-Critical Delivery Strategy. This means your road freight plan prioritises faster movement and shorter transit exposure, while managing higher cost, fast handovers, and airport-related compliance requirements.",
  },
  compliance: {
    title: "Compliance-Control Strategy",
    explanation:
      "You selected a Compliance-Control Strategy. This means your road freight plan prioritises customs requirements, pharmaceutical handling standards, cold chain documentation, and controlled handovers across local, regional, and global stages.",
  },
  safety: {
    title: "Safety-Focused Strategy",
    explanation:
      "You selected a Safety-Focused Strategy. This means your road freight plan prioritises product safety, secure handling, temperature protection, safe loading/unloading, and reducing damage or exposure risk.",
  },
  technology: {
    title: "Technology-Enabled Visibility Strategy",
    explanation:
      "You selected a Technology-Enabled Visibility Strategy. This means your road freight plan prioritises real-time tracking, temperature monitoring, digital documentation, and visibility across the first-mile, regional, and last-mile road freight stages.",
  },
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
  return {
    meetsRequirement,
    label: meetsRequirement ? "Meets requirement" : "Does not meet requirement",
    detail: meetsRequirement
      ? "Meets 40-day delivery requirement"
      : "Does not meet the 40-day delivery requirement. Students need to reconsider their plan.",
  };
}

function getStrategy(route, rankedItems) {
  const firstChoice = rankedItems[0] || "";
  const strategy = strategyText[firstChoice] || {
    title: "Road Freight Strategy",
    explanation:
      "Rank the top three freight risks or constraints to generate a road freight management strategy.",
  };

  let alignment = "Select and rank your focus areas to check route and strategy alignment.";
  if (route?.id === "sea" && firstChoice === "cost") {
    alignment = "The selected route and strategy are aligned: Option A is designed for cost-efficient road-supported movement.";
  } else if (route?.id === "air" && firstChoice === "leadTime") {
    alignment = "The selected route and strategy are aligned: Option B is designed for time-critical road-supported movement.";
  } else if (route?.id === "sea" && firstChoice === "leadTime") {
    alignment =
      "There is a mismatch: you selected a cost-efficient route but prioritised time, so you may need to reconsider the route or manage lead-time risk carefully.";
  } else if (route?.id === "air" && firstChoice === "cost") {
    alignment =
      "There is a mismatch: you selected a faster but more expensive route, so you need to justify the premium cost or reconsider the cost-efficient route.";
  } else if (firstChoice === "compliance" || firstChoice === "safety" || firstChoice === "technology") {
    alignment = getRouteSpecificFocus(route, firstChoice);
  }

  return { ...strategy, alignment };
}

function getRouteSpecificFocus(route, focusId) {
  const routeA = {
    compliance:
      "For Option A, compliance control should focus on customs, port handling, cold chain documentation, and pharmaceutical requirements.",
    safety:
      "For Option A, safety management should focus on longer exposure time, loading/unloading, and maintaining product condition.",
    technology:
      "For Option A, technology should support shipment visibility, temperature monitoring, and documentation tracking across the longer route.",
  };
  const routeB = {
    compliance:
      "For Option B, compliance control should focus on airport handling, customs checks, pharmaceutical documentation, and cold chain requirements.",
    safety:
      "For Option B, safety management should focus on fast handovers, loading/unloading, and secure movement of sensitive goods.",
    technology:
      "For Option B, technology should support real-time tracking, temperature monitoring, and coordination across road-air-road stages.",
  };

  return route?.id === "sea" ? routeA[focusId] : routeB[focusId];
}

function getRecommendation(route, rankedItems) {
  const firstChoice = rankedItems[0] || "cost";
  if (route?.id === "sea") {
    const recommendations = {
      cost: "Use the lower-cost plan with strong port coordination, clear cold-chain handover checks, and tracking across the longer movement.",
      leadTime:
        "Protect the 27-37 day lead time with early booking, port readiness checks, and escalation triggers before the 40-day limit is at risk.",
      compliance:
        "Prepare customs, port, and pharmaceutical cold-chain documents before dispatch from Bahrain.",
      safety:
        "Control loading, unloading, temperature exposure, and product security across each road and port transfer.",
      technology:
        "Use tracking, temperature logs, and digital documentation to keep visibility across the longer road-sea-road route.",
    };
    return recommendations[firstChoice];
  }

  const recommendations = {
    cost: "Justify the BHD 10,000 premium by linking it to urgency, delivery reliability, and reduced cold-chain exposure.",
    leadTime:
      "Coordinate road pickup, Riyadh handover, airport processing, and final-mile delivery so the 3-5 day route remains reliable.",
    compliance:
      "Prepare road, airport, customs, and pharmaceutical handling documents before the shipment reaches Riyadh.",
    safety:
      "Control fast handovers, secure loading, and temperature protection across the road-air-road movement.",
    technology:
      "Use real-time tracking and temperature monitoring to coordinate the road legs with the airport connector.",
  };
  return recommendations[firstChoice];
}

function App() {
  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem("roadFreightDecisionLab");
    if (!saved) return defaultState;
    try {
      const parsed = JSON.parse(saved);
      const selectedRisks = (parsed.selectedRisks || []).filter((item) =>
        riskFocusItems.some((risk) => risk.id === item)
      );
      return { ...defaultState, ...parsed, started: true, selectedRisks };
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
    () => getStrategy(selectedRoute, activity.selectedRisks),
    [selectedRoute, activity.selectedRisks]
  );
  const recommendation = useMemo(
    () => getRecommendation(selectedRoute, activity.selectedRisks),
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
    `Delivery status: ${selectedRoute ? getDeliveryStatus(selectedRoute).label : "Not selected"}`,
    ...comparisonFacts,
    `Ranked top 3 freight risks/constraints: ${activity.selectedRisks
      .map((item) => riskFocusItems.find((risk) => risk.id === item)?.label)
      .filter(Boolean)
      .join("; ") || "Not selected"}`,
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
            setRouteId={(routeId) => updateActivity({ routeId })}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
          />
        )}
        {activity.step === 4 && (
          <RiskRanking
            selectedRisks={activity.selectedRisks}
            setSelectedRisks={(selectedRisks) => updateActivity({ selectedRisks })}
            onBack={() => goToStep(3)}
            onNext={() => goToStep(5)}
          />
        )}
        {activity.step === 5 && (
          <Result
            selectedRoute={selectedRoute}
            rankedRisks={activity.selectedRisks}
            strategy={strategy}
            recommendation={recommendation}
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
      intro="Your role is to manage the road freight stages of a pharmaceutical shipment from Bahrain to the Netherlands. Although the shipment connects with sea or air internationally, your main responsibility is to plan the local, regional, and last-mile road freight operations."
      actions={<button className="primary-button" onClick={onNext}>View Route Overview</button>}
    >
      <div className="intro-grid">
        <article className="requirement-card">
          <span className="detail-label">Delivery requirement</span>
          <strong>The shipment must arrive within 40 days.</strong>
        </article>
        <article className="requirement-card">
          <span className="detail-label">Planning role</span>
          <strong>Road freight operations planner</strong>
          <p>Manage cost, lead time, compliance, safety, technology, temperature control, customs coordination, and final delivery reliability.</p>
        </article>
      </div>
    </Screen>
  );
}

function RouteOverview({ onBack, onNext }) {
  return (
    <Screen
      title="Route Overview"
      intro="Road freight supports every option through first-mile, regional, and final-mile movement. Sea and air are international connector modes."
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
      intro="Choose one road freight support plan. Review cost, lead time, and the 40-day delivery requirement before continuing."
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
  return <span className={`status-badge ${status.meetsRequirement ? "meets" : "warning"}`}>{status.detail}</span>;
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

function RiskRanking({ selectedRisks, setSelectedRisks, onBack, onNext }) {
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
        {riskFocusItems.map((risk) => {
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
              {risk.label}
            </button>
          );
        })}
      </div>
    </Screen>
  );
}

function Result({ selectedRoute, rankedRisks, strategy, recommendation, summary, copyStatus, onCopy, onBack, onRestart }) {
  const route = selectedRoute || routeOptions.sea;
  const status = getDeliveryStatus(route);
  const rankedLabels = rankedRisks
    .map((riskId) => riskFocusItems.find((risk) => risk.id === riskId)?.label)
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
          <strong>40</strong>
          <span>days maximum</span>
          <p>Selected route: {route.totalLeadTime}</p>
          <span>{status.label}</span>
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
              <span className="detail-label">Delivery status</span>
              <strong>{status.detail}</strong>
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
