"use client";

import { SparkLine } from "@/components/charts/SparkLine";
import { GaugeBar } from "@/components/charts/GaugeBar";
import { usePulse } from "@/lib/pulse/store";

export function EnvironmentTab() {
  const { selectedSnap, selectedHistory, thresholds } = usePulse();

  return (
    <div className="panel-stack dash" data-testid="tab-environment">
      <header className="panel-head">
        <h2>Environment</h2>
        <p>Hostile/closed environment channel — cabin CO₂ figure.</p>
      </header>
      {selectedSnap && (
        <>
          <div data-testid="co2-value">
            <GaugeBar
              label="Cabin CO₂"
              value={selectedSnap.co2MmHg}
              max={6}
              unit=" mmHg"
              warnAt={thresholds.co2MmHg * 0.85}
              alertAt={thresholds.co2MmHg}
            />
          </div>
          <section className="figure">
            <h3>CO₂ trend</h3>
            <SparkLine
              data={selectedHistory.map((p) => ({ t: p.t, v: p.co2MmHg }))}
              color="#5b8def"
              unit=" mmHg"
              height={220}
              domain={[2, 6]}
            />
          </section>
        </>
      )}
      <p className="muted">
        Demo default labeled as commonly cited ISS guideline — verify against current flight
        rules in a real program.
      </p>
    </div>
  );
}
