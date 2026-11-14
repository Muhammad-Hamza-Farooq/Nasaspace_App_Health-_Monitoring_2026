"use client";

import { MultiLine } from "@/components/charts/MultiLine";
import { GaugeBar } from "@/components/charts/GaugeBar";
import { usePulse } from "@/lib/pulse/store";

export function CountermeasuresTab() {
  const { selectedSnap, selectedHistory, thresholds } = usePulse();

  return (
    <div className="panel-stack dash" data-testid="tab-countermeasures">
      <header className="panel-head">
        <h2>Countermeasures</h2>
        <p>Exercise and sleep — gravity-field hazard countermeasures.</p>
      </header>
      {selectedSnap && (
        <>
          <div className="gauge-row">
            <GaugeBar
              label="Exercise"
              value={selectedSnap.exerciseMin}
              max={90}
              unit=" min"
            />
            <div data-testid="sleep-hours">
              <GaugeBar
                label="Sleep"
                value={selectedSnap.sleepHours}
                max={10}
                unit=" h"
                warnAt={thresholds.sleepMin}
              />
            </div>
          </div>
          <section className="figure">
            <h3>Sleep vs exercise</h3>
            <MultiLine
              data={selectedHistory.map((p) => ({
                t: p.t,
                sleep: p.sleepHours,
                exercise: p.exerciseMin,
              }))}
              series={[
                { key: "sleep", name: "Sleep (h)", color: "#5b8def" },
                { key: "exercise", name: "Exercise (min)", color: "#2ec4b6" },
              ]}
            />
          </section>
        </>
      )}
    </div>
  );
}
