"use client";

import { useState } from "react";
import { usePulse } from "@/lib/pulse/store";

export function VitalsTab() {
  const {
    snapshots,
    selectedCrewId,
    injectBadSample,
    lastBlindMessage,
    runManualVitals,
    tick,
  } = usePulse();
  const snap = snapshots.find((s) => s.crewId === selectedCrewId) ?? snapshots[0];
  const [hr, setHr] = useState("72");
  const [spo2, setSpo2] = useState("98");

  return (
    <div className="panel-stack" data-testid="tab-vitals">
      <header className="panel-head">
        <h2>Vitals</h2>
        <p>Live stream + manual entry. BLIND gate refuses bad samples.</p>
      </header>

      {snap && (
        <div className="metric-grid" data-testid="vitals-live">
          <div className="metric">
            <span>HR</span>
            <strong data-testid="vitals-hr">{snap.vitals.hr}</strong>
          </div>
          <div className="metric">
            <span>SpO₂</span>
            <strong>{snap.vitals.spo2}%</strong>
          </div>
          <div className="metric">
            <span>Temp</span>
            <strong>{snap.vitals.tempC}°C</strong>
          </div>
          <div className="metric">
            <span>BP</span>
            <strong>
              {snap.vitals.sbp}/{snap.vitals.dbp}
            </strong>
          </div>
          <div className="metric">
            <span>Tick</span>
            <strong data-testid="vitals-tick">{tick}</strong>
          </div>
        </div>
      )}

      <div className="control-row">
        <label>
          HR
          <input value={hr} onChange={(e) => setHr(e.target.value)} />
        </label>
        <label>
          SpO₂
          <input value={spo2} onChange={(e) => setSpo2(e.target.value)} />
        </label>
        <button
          type="button"
          className="btn"
          onClick={() =>
            runManualVitals({
              hr: Number(hr),
              spo2: Number(spo2),
              tempC: 36.6,
              sbp: 120,
              dbp: 78,
            })
          }
        >
          Evaluate sample
        </button>
        <button type="button" className="btn warn" data-testid="inject-blind" onClick={injectBadSample}>
          Inject bad sample (BLIND)
        </button>
      </div>

      {lastBlindMessage && (
        <p className="blind-msg" data-testid="blind-message" role="alert">
          {lastBlindMessage}
        </p>
      )}
    </div>
  );
}
