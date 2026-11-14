"use client";

import { useMemo } from "react";
import { HAZARDS } from "@/data/hazards";
import { MultiLine } from "@/components/charts/MultiLine";
import { GaugeBar } from "@/components/charts/GaugeBar";
import { usePulse } from "@/lib/pulse/store";

export function OverviewTab() {
  const {
    snapshots,
    selectedCrewId,
    setSelectedCrewId,
    stormActive,
    toggleStorm,
    link,
    setLink,
    escalateSelected,
    queue,
    selectedHistory,
    selectedSnap,
    thresholds,
    history,
  } = usePulse();

  const crewCompare = useMemo(() => {
    const len = Math.max(...Object.values(history).map((h) => h.length), 1);
    const rows: Array<Record<string, number>> = [];
    for (let i = 0; i < len; i++) {
      const row: Record<string, number> = { t: i };
      for (const snap of snapshots) {
        const pt = history[snap.crewId]?.[i];
        if (pt) row[snap.crewId] = pt.hr;
      }
      if (Object.keys(row).length > 1) rows.push(row);
    }
    return rows.slice(-30);
  }, [history, snapshots]);

  const radiationSeries = selectedHistory.map((p) => ({ t: p.t, v: p.radiationMsvDay }));
  const co2Series = selectedHistory.map((p) => ({ t: p.t, v: p.co2MmHg }));

  return (
    <div className="panel-stack dash" data-testid="tab-overview">
      <header className="panel-head row">
        <div>
          <h2>Mission overview</h2>
          <p>Interactive crew strip, hazard rollup, and live figures.</p>
        </div>
        <div className="control-row">
          <button
            type="button"
            className={stormActive ? "btn danger" : "btn"}
            data-testid="storm-toggle"
            onClick={toggleStorm}
          >
            {stormActive ? "Storm ON" : "Storm replay"}
          </button>
          <button
            type="button"
            className={link === "LOS" ? "btn warn" : "btn"}
            data-testid="link-toggle"
            onClick={() => setLink(link === "AOS" ? "LOS" : "AOS")}
          >
            Link {link}
          </button>
          <button type="button" className="btn" data-testid="escalate-btn" onClick={escalateSelected}>
            Escalate
          </button>
        </div>
      </header>

      <div className="crew-strip" data-testid="crew-strip">
        {snapshots.map((s) => (
          <button
            key={s.crewId}
            type="button"
            className={s.crewId === selectedCrewId ? "crew-card active" : "crew-card"}
            onClick={() => setSelectedCrewId(s.crewId)}
          >
            <strong>{s.name.split(" ")[0]}</strong>
            <span className="muted">{s.role}</span>
            <span className="mono">HR {s.vitals.hr}</span>
            <span className="mono">Dose {s.radiationMsvDay}</span>
          </button>
        ))}
      </div>

      <div className="figure-grid">
        <section className="figure">
          <h3>Crew HR compare</h3>
          <MultiLine
            data={crewCompare}
            series={snapshots.map((s, i) => ({
              key: s.crewId,
              name: s.name.split(" ")[0],
              color: ["#2ec4b6", "#f0a202", "#5b8def", "#e4572e"][i] ?? "#2ec4b6",
            }))}
          />
        </section>
        <section className="figure">
          <h3>
            {selectedSnap?.name ?? "Crew"} — radiation & cabin
          </h3>
          <div className="mini-charts">
            <div>
              <p className="muted">Dose (mSv/day)</p>
              <MultiLine
                height={140}
                data={radiationSeries.map((p) => ({ t: p.t, dose: p.v }))}
                series={[{ key: "dose", name: "Dose", color: "#f0a202" }]}
              />
            </div>
            <div>
              <p className="muted">CO₂ (mmHg)</p>
              <MultiLine
                height={140}
                data={co2Series.map((p) => ({ t: p.t, co2: p.v }))}
                series={[{ key: "co2", name: "CO₂", color: "#5b8def" }]}
              />
            </div>
          </div>
        </section>
      </div>

      {selectedSnap && (
        <div className="gauge-row">
          <GaugeBar
            label="Heart rate"
            value={selectedSnap.vitals.hr as number}
            max={140}
            unit=" bpm"
            warnAt={thresholds.hrMax}
            alertAt={thresholds.hrMax + 10}
          />
          <GaugeBar
            label="Radiation"
            value={selectedSnap.radiationMsvDay}
            max={2}
            unit=" mSv/d"
            warnAt={thresholds.radiationMsvDay * 0.7}
            alertAt={thresholds.radiationMsvDay}
            testId="rad-dose-gauge"
          />
          <GaugeBar
            label="Cabin CO₂"
            value={selectedSnap.co2MmHg}
            max={6}
            unit=" mmHg"
            warnAt={thresholds.co2MmHg * 0.85}
            alertAt={thresholds.co2MmHg}
          />
          <GaugeBar
            label="Mood"
            value={selectedSnap.mood}
            max={10}
            unit="/10"
          />
        </div>
      )}

      <section className="grid-two">
        <div>
          <h3>Five hazards</h3>
          <ul className="hazard-chips">
            {HAZARDS.map((h) => (
              <li key={h.id}>
                <strong>{h.name}</strong>
                <span>{h.channels.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Escalation queue</h3>
          <ul className="plain-list" data-testid="escalation-queue">
            {queue.length === 0 && <li className="muted">No escalations</li>}
            {queue.slice(0, 6).map((e) => (
              <li key={e.id}>
                <code>{e.status}</code> {e.message}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
