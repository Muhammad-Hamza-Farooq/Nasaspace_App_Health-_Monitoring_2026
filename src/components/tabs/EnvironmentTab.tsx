"use client";

import { usePulse } from "@/lib/pulse/store";

export function EnvironmentTab() {
  const { snapshots, selectedCrewId, thresholds } = usePulse();
  const snap = snapshots.find((s) => s.crewId === selectedCrewId) ?? snapshots[0];

  return (
    <div className="panel-stack" data-testid="tab-environment">
      <header className="panel-head">
        <h2>Environment</h2>
        <p>Hostile/closed environment channel — cabin CO₂ and related cabin cues.</p>
      </header>
      {snap && (
        <div className="metric-grid">
          <div className="metric">
            <span>Cabin CO₂</span>
            <strong data-testid="co2-value">{snap.co2MmHg} mmHg</strong>
          </div>
          <div className="metric">
            <span>Demo default limit</span>
            <strong>{thresholds.co2MmHg} mmHg</strong>
          </div>
        </div>
      )}
      <p className="muted">
        CO₂ default labeled as commonly cited ISS guideline — verify against current flight rules
        in a real program.
      </p>
    </div>
  );
}
