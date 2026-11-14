"use client";

import { usePulse } from "@/lib/pulse/store";

export function CountermeasuresTab() {
  const { snapshots, selectedCrewId, thresholds } = usePulse();
  const snap = snapshots.find((s) => s.crewId === selectedCrewId) ?? snapshots[0];

  return (
    <div className="panel-stack" data-testid="tab-countermeasures">
      <header className="panel-head">
        <h2>Countermeasures</h2>
        <p>Exercise and sleep — gravity-field hazard countermeasures.</p>
      </header>
      {snap && (
        <div className="metric-grid">
          <div className="metric">
            <span>Exercise</span>
            <strong>{snap.exerciseMin} min</strong>
          </div>
          <div className="metric">
            <span>Sleep</span>
            <strong data-testid="sleep-hours">{snap.sleepHours} h</strong>
          </div>
          <div className="metric">
            <span>Sleep target</span>
            <strong>
              {thresholds.sleepMin}–{thresholds.sleepMax} h
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}
