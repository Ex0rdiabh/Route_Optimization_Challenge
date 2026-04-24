import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const constraintInfo = [
  {
    id: "cost",
    label: "Cost",
    icon: "cost",
    help: "Fuel, driver, border delay, insurance, handling",
  },
  {
    id: "leadTime",
    label: "Lead time",
    icon: "time",
    help: "Dispatch speed, customs waiting, onward connection",
  },
  {
    id: "compliance",
    label: "Compliance",
    icon: "check",
    help: "Customs documents, permits, GCC/Saudi requirements, international standards",
  },
  {
    id: "safety",
    label: "Safety",
    icon: "shield",
    help: "Driver fatigue, road conditions, vehicle readiness, cargo security",
  },
  {
    id: "technology",
    label: "Technology/V2X",
    icon: "signal",
    help: "Fleet visibility, alerts, connected vehicle support, monitoring",
  },
  {
    id: "coldChain",
    label: "Cold-chain integrity",
    icon: "cold",
    help: "Temperature control, delay risk, pharma product safety",
  },
];

const risks = [
  "Missing or incomplete documentation",
  "Border delay at King Fahd Causeway",
  "Temperature excursion",
  "Driver fatigue / road safety risk",
  "High cost due to delays or rerouting",
  "Poor shipment visibility",
  "Missed onward global connection to Rotterdam",
];

const strategies = {
  fastest: {
    label: "Fastest Route",
    explanation:
      "Prioritises dispatch speed and quick handover to onward transport, but can expose the shipment to documentation, fatigue, and temperature risks if controls are weak.",
  },
  lowestCost: {
    label: "Lowest Cost",
    explanation:
      "Minimises direct transport spend, but may under-resource monitoring, contingency buffers, or premium handling for a pharmaceutical cold chain.",
  },
  highestCompliance: {
    label: "Highest Compliance",
    explanation:
      "Prioritises documents, permits, Saudi/GCC requirements, and international standards, accepting extra preparation time to reduce clearance and audit risk.",
  },
  safest: {
    label: "Safest Route",
    explanation:
      "Prioritises driver readiness, vehicle condition, cargo security, and temperature protection, with possible cost and lead-time trade-offs.",
  },
  balanced: {
    label: "Balanced Strategy",
    explanation:
      "Prioritises compliance, cold-chain integrity, and reliable lead time rather than focusing only on speed or cost.",
  },
};

const routeStages = [
  {
    marker: "A",
    title: "Local",
    heading: "Manama dispatch and Bahrain documentation",
    detail: "Validate pharma paperwork, vehicle readiness, temperature set point, and handover records before departure.",
  },
  {
    marker: "B",
    title: "Regional",
    heading: "King Fahd Causeway and Riyadh road freight movement",
    detail: "Manage border crossing risk, Saudi compliance, driver hours, road safety, and live shipment visibility.",
  },
  {
    marker: "C",
    title: "Global",
    heading: "Onward distribution planning to Rotterdam",
    detail: "Prepare reliable connection planning, export readiness, cold-chain continuity, and international service evidence.",
  },
];

const defaultRatings = constraintInfo.reduce((acc, item) => {
  acc[item.id] = 3;
  return acc;
}, {});

const defaultState = {
  started: false,
  step: 1,
  ratings: defaultRatings,
  selectedRisks: [],
  strategy: "",
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
    cost: (
      <>
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
    time: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: (
      <>
        <path d="M9 12l2 2 4-5" />
        <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22c4-1.2 8-4.5 8-10V5l-8-3-8 3v7c0 5.5 4 8.8 8 10Z" />
        <path d="M9 12l2 2 4-5" />
      </>
    ),
    signal: (
      <>
        <path d="M4 18.5a11 11 0 0 1 16 0" />
        <path d="M7.5 15a6.5 6.5 0 0 1 9 0" />
        <path d="M11 11.5a2 2 0 0 1 2 0" />
        <path d="M12 20h.01" />
      </>
    ),
    cold: (
      <>
        <path d="M12 2v20" />
        <path d="M5 5l14 14" />
        <path d="M19 5 5 19" />
        <path d="M4 12h16" />
      </>
    ),
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

function calculateResult(ratings, selectedRisks, strategy) {
  const r = ratings;
  let score = 52;

  score += (r.compliance - 3) * 5;
  score += (r.coldChain - 3) * 5;
  score += (r.safety - 3) * 4;
  score += (r.leadTime - 3) * 3;
  score += (r.technology - 3) * 2;
  score += r.cost >= 3 ? 2 : -2;

  const selectedSet = new Set(selectedRisks);
  const highPriorityRisks = [
    "Missing or incomplete documentation",
    "Border delay at King Fahd Causeway",
    "Temperature excursion",
    "Driver fatigue / road safety risk",
    "Missed onward global connection to Rotterdam",
  ];

  selectedRisks.forEach((risk, index) => {
    if (highPriorityRisks.includes(risk)) score += 5 - index;
    if (risk === "Poor shipment visibility" && r.technology >= 4) score += 2;
    if (risk === "High cost due to delays or rerouting" && r.cost >= 4) score += 1;
  });

  if (strategy === "balanced") {
    score += 12;
    if (r.compliance >= 4 && r.coldChain >= 4 && r.safety >= 4) score += 8;
    if (r.leadTime >= 4) score += 3;
  }

  if (strategy === "highestCompliance") {
    score += 8;
    if (selectedSet.has("Missing or incomplete documentation")) score += 5;
    if (selectedSet.has("Border delay at King Fahd Causeway")) score += 4;
    if (selectedSet.has("Temperature excursion")) score += 3;
    if (r.compliance < 4) score -= 7;
  }

  if (strategy === "fastest") {
    score += r.leadTime >= 4 ? 6 : 1;
    if (r.safety <= 3) score -= 8;
    if (r.compliance <= 3) score -= 8;
    if (r.coldChain <= 3) score -= 9;
  }

  if (strategy === "lowestCost") {
    score += r.cost >= 4 ? 6 : 1;
    if (r.coldChain < 4) score -= 10;
    if (r.compliance < 4) score -= 10;
    if (!selectedSet.has("High cost due to delays or rerouting")) score -= 2;
  }

  if (strategy === "safest") {
    score += 7;
    if (r.safety >= 4) score += 5;
    if (r.coldChain >= 4) score += 4;
    if (r.cost <= 2 || r.leadTime <= 2) score -= 2;
  }

  score -= Math.max(0, 3 - selectedRisks.length) * 8;
  score = Math.max(0, Math.min(100, Math.round(score)));

  let feedback =
    "Your decision recognises that pharmaceutical road freight depends on more than movement speed. The strongest strategies protect clearance readiness, temperature control, road safety, and reliable onward connection planning.";

  let improvement =
    "Add a contingency plan for border waiting time, including active temperature monitoring and a documented escalation contact.";

  if (strategy === "fastest") {
    feedback =
      "A speed-led plan can help protect the onward Rotterdam connection, but it must not weaken documentation checks, driver safety, or cold-chain controls.";
    improvement =
      "Build a pre-clearance checklist and driver rest plan before choosing the fastest movement window.";
  } else if (strategy === "lowestCost") {
    feedback =
      "A cost-led plan can be commercially attractive, but pharmaceuticals need evidence that savings do not compromise compliance or temperature integrity.";
    improvement =
      "Identify which cost reductions are acceptable and ring-fence budget for monitoring, insurance, and compliant handling.";
  } else if (strategy === "highestCompliance") {
    feedback =
      "A compliance-led plan fits the cross-border and global distribution context well, especially when documentation and border risk are treated as primary constraints.";
    improvement =
      "Pair compliance preparation with a lead-time buffer so the shipment still protects the onward Rotterdam connection.";
  } else if (strategy === "safest") {
    feedback =
      "A safety-led plan is strong for pharma cargo because vehicle readiness, driver risk, security, and temperature protection all affect service quality.";
    improvement =
      "Make the cost and time impact explicit so managers can defend the safer route as a professional trade-off.";
  } else if (strategy === "balanced") {
    feedback =
      "A balanced plan is well suited to this scenario because it weighs compliance, cold-chain integrity, safety, and lead-time reliability together.";
    improvement =
      "State the trigger points for escalation, such as border delay duration, temperature alert threshold, and missed connection risk.";
  }

  if (score < 60) {
    improvement =
      "Revisit the ratings and make sure compliance, cold-chain integrity, safety, and lead-time reliability are treated as core controls, not optional extras.";
  }

  return { score, feedback, improvement };
}

function App() {
  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem("roadFreightDecisionLab");
    if (!saved) return defaultState;
    try {
      return { ...defaultState, ...JSON.parse(saved) };
    } catch {
      return defaultState;
    }
  });
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    localStorage.setItem("roadFreightDecisionLab", JSON.stringify(activity));
  }, [activity]);

  const result = useMemo(
    () => calculateResult(activity.ratings, activity.selectedRisks, activity.strategy),
    [activity.ratings, activity.selectedRisks, activity.strategy]
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
    setActivity({ ...defaultState, ratings: { ...defaultRatings }, selectedRisks: [] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const summary = [
    "Road Freight Decision Lab Result",
    `Score: ${result.score}/100`,
    `Strategy: ${strategies[activity.strategy]?.label || "Not selected"}`,
    `Top risks: ${activity.selectedRisks.join("; ") || "Not selected"}`,
    `Feedback: ${result.feedback}`,
    `Suggested improvement: ${result.improvement}`,
  ].join("\n");

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus("Summary copied");
    } catch {
      setCopyStatus("Copy unavailable. Select the summary text instead.");
    }
  };

  if (!activity.started) {
    return <Landing onStart={() => updateActivity({ started: true, step: 1 })} />;
  }

  return (
    <main className="app-shell">
      <Header onHome={() => updateActivity({ started: false })} />
      <section className="workspace" aria-live="polite">
        <Progress step={activity.step} />
        {activity.step === 1 && <RouteOverview onNext={() => goToStep(2)} />}
        {activity.step === 2 && (
          <Constraints
            ratings={activity.ratings}
            setRatings={(ratings) => updateActivity({ ratings })}
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3)}
          />
        )}
        {activity.step === 3 && (
          <RiskRanking
            selectedRisks={activity.selectedRisks}
            setSelectedRisks={(selectedRisks) => updateActivity({ selectedRisks })}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
          />
        )}
        {activity.step === 4 && (
          <Strategy
            strategy={activity.strategy}
            setStrategy={(strategy) => updateActivity({ strategy })}
            onBack={() => goToStep(3)}
            onNext={() => goToStep(5)}
          />
        )}
        {activity.step === 5 && (
          <Result
            activity={activity}
            result={result}
            copyStatus={copyStatus}
            summary={summary}
            onCopy={copySummary}
            onBack={() => goToStep(4)}
            onRestart={restart}
          />
        )}
      </section>
    </main>
  );
}

function Landing({ onStart }) {
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Senior Bachelor Logistics Management</p>
          <h1>Road Freight Decision Lab</h1>
          <p className="subtitle">Manama &rarr; Riyadh &rarr; Rotterdam Cold-Chain Challenge</p>
          <p className="scenario">
            A Bahrain-based logistics provider must move a refrigerated pharmaceutical shipment from
            Manama to Riyadh by road, then prepare it for onward global distribution to Rotterdam,
            Netherlands. Your team will manage cost, lead time, compliance, safety, technology/V2X,
            and cold-chain risk across local, regional, and global contexts.
          </p>
          <button className="primary-button" onClick={onStart}>
            Start Activity
          </button>
        </div>
        <div className="hero-panel" aria-label="Cold-chain route summary">
          <div className="route-card compact">
            <span className="stage-pill">A</span>
            <strong>Manama</strong>
            <span>Bahrain documentation</span>
          </div>
          <div className="connector-line" />
          <div className="route-card compact">
            <span className="stage-pill">B</span>
            <strong>King Fahd Causeway</strong>
            <span>Cross-border control point</span>
          </div>
          <div className="connector-line" />
          <div className="route-card compact">
            <span className="stage-pill">C</span>
            <strong>Rotterdam</strong>
            <span>Global distribution planning</span>
          </div>
        </div>
      </section>
      <details className="lecturer-notes">
        <summary>Lecturer Notes</summary>
        <div>
          <p>
            This is a Problem-Based Learning activity. Students act as logistics managers making
            evidence-based freight decisions under realistic cold-chain constraints.
          </p>
          <p>
            The task supports Bloom's analysis, evaluation, and justification through constraint
            rating, risk ranking, strategy selection, and professional reasoning.
          </p>
          <p>
            The activity aligns with NQF Level 8 through applied judgement, decision-making, and
            scenario-based evaluation in a cross-border logistics context.
          </p>
        </div>
      </details>
    </main>
  );
}

function Header({ onHome }) {
  return (
    <header className="topbar">
      <button className="brand-button" onClick={onHome}>
        <Icon type="road" />
        <span>Road Freight Decision Lab</span>
      </button>
      <span className="context-tag">Cold-chain PBL</span>
    </header>
  );
}

function Progress({ step }) {
  const labels = ["Route", "Constraints", "Risks", "Strategy", "Result"];
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

function RouteOverview({ onNext }) {
  return (
    <Screen
      title="Route Overview"
      intro="Read the movement as one connected decision: local dispatch quality affects regional clearance, and regional reliability affects global onward planning."
      actions={<button className="primary-button" onClick={onNext}>Rate Constraints</button>}
    >
      <div className="timeline" aria-label="Route stages">
        {routeStages.map((stage) => (
          <article className="stage-card" key={stage.marker}>
            <span className="stage-pill">{stage.marker}</span>
            <p className="stage-title">{stage.title}</p>
            <h3>{stage.heading}</h3>
            <p>{stage.detail}</p>
          </article>
        ))}
      </div>
    </Screen>
  );
}

function Constraints({ ratings, setRatings, onBack, onNext }) {
  const setRating = (id, value) => {
    setRatings({ ...ratings, [id]: Number(value) });
  };

  return (
    <Screen
      title="Constraint Rating"
      intro="Rate how strongly each constraint should influence the shipment plan. A higher rating means the constraint deserves more managerial attention."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onNext}>Rank Risks</button>
        </>
      }
    >
      <div className="constraints-grid">
        {constraintInfo.map((item) => (
          <article className="constraint-card" key={item.id}>
            <div className="constraint-heading">
              <span className="icon-badge">
                <Icon type={item.icon} />
              </span>
              <div>
                <h3>{item.label}</h3>
                <p>{item.help}</p>
              </div>
            </div>
            <div className="rating-row">
              <span>1</span>
              <input
                aria-label={`${item.label} rating`}
                type="range"
                min="1"
                max="5"
                value={ratings[item.id]}
                onChange={(event) => setRating(item.id, event.target.value)}
              />
              <span>5</span>
              <strong>{ratings[item.id]}</strong>
            </div>
          </article>
        ))}
      </div>
    </Screen>
  );
}

function RiskRanking({ selectedRisks, setSelectedRisks, onBack, onNext }) {
  const toggleRisk = (risk) => {
    if (selectedRisks.includes(risk)) {
      setSelectedRisks(selectedRisks.filter((item) => item !== risk));
      return;
    }

    if (selectedRisks.length < 3) {
      setSelectedRisks([...selectedRisks, risk]);
    }
  };

  return (
    <Screen
      title="Risk Ranking"
      intro="Select the top three risks your group would escalate before dispatch. The order reflects your priority ranking."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onNext} disabled={selectedRisks.length !== 3}>
            Choose Strategy
          </button>
        </>
      }
    >
      <div className="risk-status">
        <strong>{selectedRisks.length}/3 selected</strong>
        <span>{selectedRisks.length === 3 ? "Ready to continue" : "Select exactly three risks"}</span>
      </div>
      <div className="risk-list">
        {risks.map((risk) => {
          const index = selectedRisks.indexOf(risk);
          const selected = index !== -1;
          return (
            <button
              className={`risk-option ${selected ? "selected" : ""}`}
              key={risk}
              onClick={() => toggleRisk(risk)}
              type="button"
            >
              <span>{selected ? index + 1 : ""}</span>
              {risk}
            </button>
          );
        })}
      </div>
    </Screen>
  );
}

function Strategy({ strategy, setStrategy, onBack, onNext }) {
  return (
    <Screen
      title="Strategy Selection"
      intro="Choose the strategy your team can defend using the evidence from your constraint ratings and top risk ranking."
      actions={
        <>
          <button className="secondary-button" onClick={onBack}>Back</button>
          <button className="primary-button" onClick={onNext} disabled={!strategy}>
            View Result
          </button>
        </>
      }
    >
      <div className="strategy-grid">
        {Object.entries(strategies).map(([id, item]) => (
          <button
            type="button"
            className={`strategy-card ${strategy === id ? "selected" : ""}`}
            key={id}
            onClick={() => setStrategy(id)}
          >
            <span className="radio-dot" />
            <strong>{item.label}</strong>
            <span>{item.explanation}</span>
          </button>
        ))}
      </div>
    </Screen>
  );
}

function Result({ activity, result, summary, copyStatus, onCopy, onBack, onRestart }) {
  const strategyLabel = strategies[activity.strategy]?.label || "Not selected";

  return (
    <Screen
      title="Decision Result"
      intro="Use this summary as an exit-ticket prompt or as evidence for a short class discussion."
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
        <section className="score-panel">
          <p>Logistics Decision Score</p>
          <strong>{result.score}</strong>
          <span>out of 100</span>
        </section>
        <section className="result-details">
          <div>
            <span className="detail-label">Selected strategy</span>
            <strong>{strategyLabel}</strong>
          </div>
          <div>
            <span className="detail-label">Top three risks</span>
            <ol className="risk-summary">
              {activity.selectedRisks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ol>
          </div>
          <div>
            <span className="detail-label">Feedback</span>
            <p>{result.feedback}</p>
          </div>
          <div>
            <span className="detail-label">Suggested improvement</span>
            <p>{result.improvement}</p>
          </div>
          {copyStatus && <p className="copy-status">{copyStatus}</p>}
        </section>
      </div>
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
