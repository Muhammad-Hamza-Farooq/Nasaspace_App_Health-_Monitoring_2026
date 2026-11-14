"use client";

import { usePulse } from "@/lib/pulse/store";

export function CrewRail() {
  const { snapshots, selectedCrewId, setSelectedCrewId, anomaly, thresholds } =
    usePulse();

  return (
    <aside className="crew-rail" data-testid="crew-strip">
      <h2>Crew</h2>
      {snapshots.map((s) => {
        const hot =
          anomaly?.crewId === s.crewId ||
          (s.vitals.hr as number) > thresholds.hrMax ||
          (s.vitals.spo2 as number) < thresholds.spo2Watch;
        return (
          <button
            key={s.crewId}
            type="button"
            className={`crew-tile ${s.crewId === selectedCrewId ? "active" : ""} ${hot ? "hot" : ""}`}
            onClick={() => setSelectedCrewId(s.crewId)}
          >
            <div className="crew-tile-top">
              <strong>{s.name}</strong>
              <span className={`dot ${hot ? "alert" : "ok"}`} />
            </div>
            <span className="role">{s.role}</span>
            <div className="crew-nums">
              <span>
                HR <b>{s.vitals.hr}</b>
              </span>
              <span>
                SpO₂ <b>{s.vitals.spo2}</b>
              </span>
              <span>
                Dose <b>{s.radiationMsvDay}</b>
              </span>
              <span>
                CO₂ <b>{s.co2MmHg}</b>
              </span>
            </div>
          </button>
        );
      })}
    </aside>
  );
}
