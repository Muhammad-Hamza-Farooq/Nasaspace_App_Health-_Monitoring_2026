"use client";

import { usePulse } from "@/lib/pulse/store";

export function AiAdvisorPanel() {
  const {
    anomaly,
    opsMode,
    applyIntervention,
    applyAllInterventions,
    missionLog,
  } = usePulse();

  return (
    <div className="side-panel ai-panel" data-testid="ai-advisor">
      <header>
        <p className="panel-sub">
          {opsMode === "OFFLINE_LOCAL"
            ? "Acting without Earth surgeons"
            : "Supervised by Earth medical channel"}
        </p>
      </header>

      {!anomaly && (
        <p className="muted">No active vital anomaly. Streams in mission-normal band.</p>
      )}

      {anomaly && (
        <div className="anomaly-card">
          <strong>{anomaly.title}</strong>
          <p>{anomaly.summary}</p>
          <p className="muted">Crew: {anomaly.crewId}</p>
          <ul className="action-list">
            {anomaly.interventions.map((i) => {
              const done = anomaly.applied.includes(i.id);
              return (
                <li key={i.id} className={done ? "done" : ""}>
                  <div>
                    <b>{i.label}</b>
                    <span>{i.detail}</span>
                  </div>
                  <button
                    type="button"
                    className="btn"
                    disabled={done || anomaly.recovering}
                    onClick={() => applyIntervention(i.id)}
                  >
                    {done ? "Done" : "Apply"}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="btn accent"
            data-testid="apply-all-actions"
            disabled={anomaly.recovering}
            onClick={applyAllInterventions}
          >
            {anomaly.recovering ? "Recovering vitals…" : "Apply all AI actions"}
          </button>
          {anomaly.recovering && (
            <p className="ok-line">Vitals trending back to normal numbers…</p>
          )}
        </div>
      )}

      <h3>Mission log</h3>
      <ul className="mission-log">
        {missionLog.slice(0, 8).map((line) => (
          <li key={line.id}>{line.text}</li>
        ))}
      </ul>
    </div>
  );
}
