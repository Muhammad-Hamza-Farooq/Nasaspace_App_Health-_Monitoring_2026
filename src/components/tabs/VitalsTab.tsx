"use client";

import { useMemo, useState } from "react";
import { MultiLine } from "@/components/charts/MultiLine";
import { SparkLine } from "@/components/charts/SparkLine";
import { usePulse } from "@/lib/pulse/store";

export function VitalsTab() {
  const {
    selectedSnap,
    selectedHistory,
    injectBadSample,
    lastBlindMessage,
    runManualVitals,
    tick,
  } = usePulse();
  const [hr, setHr] = useState("72");
  const [spo2, setSpo2] = useState("98");

  const combined = useMemo(
    () =>
      selectedHistory.map((p) => ({
        t: p.t,
        hr: p.hr,
        spo2: p.spo2,
        temp: p.tempC,
      })),
    [selectedHistory],
  );

  return (
    <div className="panel-stack dash" data-testid="tab-vitals">
      <header className="panel-head">
        <h2>Vitals console</h2>
        <p>Live figures + manual entry. BLIND gate refuses bad samples.</p>
      </header>

      {selectedSnap && (
        <div className="metric-grid" data-testid="vitals-live">
          <div className="metric">
            <span>HR</span>
            <strong data-testid="vitals-hr">{selectedSnap.vitals.hr}</strong>
          </div>
          <div className="metric">
            <span>SpO₂</span>
            <strong>{selectedSnap.vitals.spo2}%</strong>
          </div>
          <div className="metric">
            <span>Temp</span>
            <strong>{selectedSnap.vitals.tempC}°C</strong>
          </div>
          <div className="metric">
            <span>BP</span>
            <strong>
              {selectedSnap.vitals.sbp}/{selectedSnap.vitals.dbp}
            </strong>
          </div>
          <div className="metric">
            <span>Tick</span>
            <strong data-testid="vitals-tick">{tick}</strong>
          </div>
        </div>
      )}

      <div className="figure-grid">
        <section className="figure">
          <h3>HR · SpO₂ · Temp</h3>
          <MultiLine
            data={combined}
            series={[
              { key: "hr", name: "HR", color: "#e4572e" },
              { key: "spo2", name: "SpO₂", color: "#2ec4b6" },
              { key: "temp", name: "Temp", color: "#f0a202" },
            ]}
          />
        </section>
        <section className="figure">
          <h3>Heart rate detail</h3>
          <SparkLine
            data={selectedHistory.map((p) => ({ t: p.t, v: p.hr }))}
            color="#e4572e"
            unit=" bpm"
            height={180}
            domain={[40, 120]}
          />
        </section>
      </div>

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
        <button
          type="button"
          className="btn warn"
          data-testid="inject-blind"
          onClick={injectBadSample}
        >
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
