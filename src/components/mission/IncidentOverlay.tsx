"use client";

import { usePulse } from "@/lib/pulse/store";

export function IncidentOverlay() {
  const { incidentAlert } = usePulse();
  if (!incidentAlert) return null;

  return (
    <div
      className="incident-overlay"
      data-testid="incident-overlay"
      role="alert"
      aria-live="assertive"
    >
      <div className="incident-card">
        <p className="incident-kicker">SPACE WEATHER EMERGENCY</p>
        <h2>{incidentAlert.title}</h2>
        <p>{incidentAlert.detail}</p>
        <p className="incident-sub">{incidentAlert.sub}</p>
      </div>
    </div>
  );
}
