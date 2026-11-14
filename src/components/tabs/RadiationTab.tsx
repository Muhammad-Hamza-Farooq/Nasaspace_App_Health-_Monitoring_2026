"use client";

import { SparkLine } from "@/components/charts/SparkLine";
import { GaugeBar } from "@/components/charts/GaugeBar";
import { usePulse } from "@/lib/pulse/store";

export function RadiationTab() {
  const { selectedSnap, selectedHistory, stormActive, toggleStorm, thresholds } =
    usePulse();

  return (
    <div className="panel-stack dash" data-testid="tab-radiation">
      <header className="panel-head row">
        <div>
          <h2>Radiation</h2>
          <p>
            CSA-aligned personal dose UX. Daily limit is a{" "}
            <strong>demo placeholder</strong>.
          </p>
        </div>
        <button type="button" className="btn" data-testid="storm-toggle-rad" onClick={toggleStorm}>
          {stormActive ? "End storm replay" : "Replay solar storm"}
        </button>
      </header>

      {selectedSnap && (
        <>
          <div className="gauge-row">
            <div data-testid="rad-dose" className="sr-metric">
              <GaugeBar
                label="Personal dose"
                value={selectedSnap.radiationMsvDay}
                max={2.5}
                unit=" mSv/day"
                warnAt={thresholds.radiationMsvDay * 0.7}
                alertAt={thresholds.radiationMsvDay}
              />
            </div>
            <GaugeBar
              label="Demo limit"
              value={thresholds.radiationMsvDay}
              max={2.5}
              unit=" mSv/day"
            />
          </div>
          <section className="figure">
            <h3>Dose timeline {stormActive ? "· SPE ACTIVE" : ""}</h3>
            <SparkLine
              data={selectedHistory.map((p) => ({ t: p.t, v: p.radiationMsvDay }))}
              color="#f0a202"
              unit=" mSv/d"
              height={220}
              domain={[0, 2.5]}
            />
          </section>
        </>
      )}
    </div>
  );
}
