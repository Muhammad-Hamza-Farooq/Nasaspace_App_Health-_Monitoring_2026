"use client";

import { LOCAL_MODEL_POSTURE } from "@/lib/mission/interventions";
import { usePulse } from "@/lib/pulse/store";

export function AiAdvisorPanel() {
  const {
    anomaly,
    opsMode,
    applyIntervention,
    applyAllInterventions,
    missionLog,
  } = usePulse();

  const phaseLabel = anomaly
    ? {
        detected: "Detected",
        advising: "Advising from citations",
        applying: "Applying procedures",
        monitoring: "Monitoring vitals",
        normalized: "Vitals normalized",
      }[anomaly.phase]
    : null;

  return (
    <div className="side-panel ai-panel" data-testid="ai-advisor">
      <header>
        <p className="panel-sub">
          {opsMode === "OFFLINE_LOCAL"
            ? "Acting without Earth surgeons"
            : "Supervised by Earth medical channel"}
        </p>
      </header>

      <div className="model-posture" data-testid="local-model-posture">
        <h3>Offline model posture</h3>
        <p className="muted">{LOCAL_MODEL_POSTURE.name}</p>
        <ul className="plain-list model-posture-list">
          <li>
            <b>Size</b> {LOCAL_MODEL_POSTURE.params}
          </li>
          <li>
            <b>Runs on</b> {LOCAL_MODEL_POSTURE.devices}
          </li>
          <li>
            <b>Fine-tune</b> {LOCAL_MODEL_POSTURE.fineTune}
          </li>
          <li>
            <b>RAG</b> {LOCAL_MODEL_POSTURE.ragBetter}
          </li>
          <li>
            <b>Datasets</b> {LOCAL_MODEL_POSTURE.datasets}
          </li>
        </ul>
      </div>

      {!anomaly && (
        <p className="muted">No active vital anomaly. Streams in mission-normal band.</p>
      )}

      {anomaly && (
        <div className="anomaly-card" data-testid="anomaly-card">
          <p className="anomaly-phase" data-testid="anomaly-phase">
            {phaseLabel}
          </p>
          <strong>{anomaly.title}</strong>
          <p className="problem-line">{anomaly.problemLabel}</p>
          <p>{anomaly.summary}</p>
          <p className="muted">Crew: {anomaly.crewId}</p>
          <p className="muted cite-dataset">{anomaly.datasetNote}</p>

          <ul className="action-list">
            {anomaly.interventions.map((i) => {
              const done = anomaly.applied.includes(i.id);
              return (
                <li key={i.id} className={done ? "done" : ""}>
                  <div>
                    <b>{i.label}</b>
                    <span>{i.detail}</span>
                    <span className="cite-chip" title={i.citation.source}>
                      Cite {i.citation.id}: {i.citation.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn"
                    disabled={done || anomaly.recovering || anomaly.phase === "normalized"}
                    onClick={() => applyIntervention(i.id)}
                  >
                    {done ? "Applied" : "Apply"}
                  </button>
                </li>
              );
            })}
          </ul>

          {anomaly.phase !== "normalized" && (
            <button
              type="button"
              className="btn accent"
              data-testid="apply-all-actions"
              disabled={anomaly.recovering}
              onClick={applyAllInterventions}
            >
              {anomaly.phase === "monitoring"
                ? "Monitoring vitals…"
                : "Apply all cited actions"}
            </button>
          )}

          {anomaly.phase === "monitoring" && (
            <p className="ok-line">Monitoring heart rate and related vitals after procedures…</p>
          )}
          {anomaly.phase === "normalized" && (
            <p className="ok-line">Vitals back to normal mission band.</p>
          )}
        </div>
      )}

      <h3>Mission log</h3>
      <ul className="mission-log">
        {missionLog.slice(0, 10).map((line) => (
          <li key={line.id}>{line.text}</li>
        ))}
      </ul>
    </div>
  );
}
