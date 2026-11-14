"use client";

import { usePulse } from "@/lib/pulse/store";

export function RadiationTab() {
  const { snapshots, selectedCrewId, stormActive, toggleStorm, thresholds } = usePulse();
  const snap = snapshots.find((s) => s.crewId === selectedCrewId) ?? snapshots[0];

  return (
    <div className="panel-stack" data-testid="tab-radiation">
      <header className="panel-head">
        <h2>Radiation</h2>
        <p>
          CSA-aligned personal dose monitoring UX. Daily limit is a{" "}
          <strong>demo placeholder</strong>, not a public NASA PEL.
        </p>
      </header>

      {snap && (
        <div className="metric-grid">
          <div className="metric">
            <span>Personal dose</span>
            <strong data-testid="rad-dose">{snap.radiationMsvDay} mSv/day</strong>
          </div>
          <div className="metric">
            <span>Demo limit</span>
            <strong>{thresholds.radiationMsvDay} mSv/day</strong>
          </div>
          <div className="metric">
            <span>Storm boost</span>
            <strong>{stormActive ? "SPE active" : "Quiet"}</strong>
          </div>
        </div>
      )}

      <button type="button" className="btn" data-testid="storm-toggle-rad" onClick={toggleStorm}>
        {stormActive ? "End DONKI storm replay" : "Replay solar storm (DONKI pattern)"}
      </button>
    </div>
  );
}
