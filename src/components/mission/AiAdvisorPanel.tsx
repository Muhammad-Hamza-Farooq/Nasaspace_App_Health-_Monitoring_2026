"use client";

import { CREW } from "@/data/crew";
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

  const patientName =
    anomaly && CREW.find((c) => c.id === anomaly.crewId)?.name;

  const verdictClass = anomaly
    ? {
        supported: "verdict-supported",
        partial: "verdict-partial",
        unsupported: "verdict-unsupported",
      }[anomaly.assessment.citationCheck.verdict]
    : "";

  return (
    <div className="side-panel ai-panel" data-testid="ai-advisor">
      <header>
        <p className="panel-sub">
          {opsMode === "OFFLINE_LOCAL"
            ? "Acting without Earth surgeons"
            : "Supervised by Earth medical channel"}
        </p>
      </header>

      <p className="device-hint" data-testid="ai-device-hint">
        Runs on crew laptop / module workstation · 7B–8B Q4 · local vector store
      </p>

      <details className="model-posture" data-testid="local-model-posture">
        <summary>
          Offline model · 7B–8B Q4 · ~8 GB VRAM or 32 GB RAM
        </summary>
        <p className="muted">{LOCAL_MODEL_POSTURE.name}</p>
        <ul className="plain-list model-posture-list">
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
            <b>Data</b> {LOCAL_MODEL_POSTURE.datasets}
          </li>
        </ul>
      </details>

      {!anomaly && (
        <p className="muted">No active vital anomaly. Streams in mission-normal band.</p>
      )}

      {anomaly && (
        <div className="anomaly-card" data-testid="anomaly-card">
          <div className="anomaly-head">
            <p className="anomaly-phase" data-testid="anomaly-phase">
              {phaseLabel}
            </p>
            <strong>{anomaly.title}</strong>
            {patientName ? (
              <p className="patient-line" data-testid="anomaly-patient">
                Patient: {patientName}
              </p>
            ) : null}
          </div>
          <p className="problem-line">{anomaly.problemLabel}</p>

          <div className="assessment-block" data-testid="cause-assessment">
            <div className="assess-row">
              <span className="assess-label">What happened</span>
              <p data-testid="what-happened">{anomaly.assessment.whatHappened}</p>
            </div>
            <div className="assess-row">
              <span className="assess-label">AI reason</span>
              <p data-testid="ai-reason">{anomaly.assessment.aiReason}</p>
            </div>
            <div
              className={`assess-row citation-verdict ${verdictClass}`}
              data-testid="citation-verdict"
            >
              <span className="assess-label">Citation check</span>
              <p className="verdict-label">
                {anomaly.assessment.citationCheck.label}
              </p>
              <p data-testid="citation-explanation">
                {anomaly.assessment.citationCheck.explanation}
              </p>
              <div className="verdict-cites">
                {anomaly.assessment.citationCheck.citations.map((c) => (
                  <span
                    key={c.id}
                    className="cite-chip"
                    title={c.source}
                  >
                    {c.id}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="anomaly-summary">{anomaly.summary}</p>

          <ul className="action-list">
            {anomaly.interventions.map((i) => {
              const done = anomaly.applied.includes(i.id);
              return (
                <li key={i.id} className={done ? "done" : ""}>
                  <div>
                    <b>{i.label}</b>
                    <span>{i.detail}</span>
                    <span className="cite-chip" title={i.citation.source}>
                      {i.citation.id}
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
            <p className="ok-line">Monitoring heart rate and related vitals…</p>
          )}
          {anomaly.phase === "normalized" && (
            <p className="ok-line">Vitals back to normal mission band.</p>
          )}
        </div>
      )}

      <h3>Mission log</h3>
      <ul className="mission-log">
        {missionLog.slice(0, 4).map((line) => (
          <li key={line.id}>{line.text}</li>
        ))}
      </ul>
    </div>
  );
}
