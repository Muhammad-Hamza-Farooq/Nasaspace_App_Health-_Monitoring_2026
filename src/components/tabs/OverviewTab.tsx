"use client";

import { HAZARDS } from "@/data/hazards";
import { NAMED_RISKS } from "@/data/risks";
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
    judgeTour,
  } = usePulse();

  return (
    <div className="panel-stack" data-testid="tab-overview">
      <header className="panel-head">
        <h2>Mission overview</h2>
        <p>Crew status strip and HRP hazard rollup.</p>
      </header>

      <div className="control-row">
        <button
          type="button"
          className={stormActive ? "btn danger" : "btn"}
          data-testid="storm-toggle"
          onClick={toggleStorm}
        >
          {stormActive ? "Storm replay ON (DONKI-style)" : "Start storm replay"}
        </button>
        <button
          type="button"
          className={link === "LOS" ? "btn warn" : "btn"}
          data-testid="link-toggle"
          onClick={() => setLink(link === "AOS" ? "LOS" : "AOS")}
        >
          Link: {link}
        </button>
        <button type="button" className="btn" data-testid="escalate-btn" onClick={escalateSelected}>
          Escalate selected
        </button>
        <button type="button" className="btn ghost" data-testid="judge-tour" onClick={() => judgeTour()}>
          Run judge tour
        </button>
      </div>

      <div className="crew-strip" data-testid="crew-strip">
        {snapshots.map((s) => (
          <button
            key={s.crewId}
            type="button"
            className={s.crewId === selectedCrewId ? "crew-card active" : "crew-card"}
            onClick={() => setSelectedCrewId(s.crewId)}
          >
            <strong>{s.name}</strong>
            <span>{s.role}</span>
            <span>HR {s.vitals.hr}</span>
            <span>Dose {s.radiationMsvDay} mSv/d</span>
          </button>
        ))}
      </div>

      <section className="grid-two">
        <div>
          <h3>Five hazards</h3>
          <ul className="plain-list">
            {HAZARDS.map((h) => (
              <li key={h.id}>
                <strong>{h.name}</strong>
                <span> → {h.channels.join(", ")}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Named risk registry</h3>
          <ul className="plain-list compact">
            {NAMED_RISKS.map((r) => (
              <li key={r.id}>
                {r.id}: {r.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h3>Escalation queue</h3>
        <ul className="plain-list" data-testid="escalation-queue">
          {queue.length === 0 && <li>No escalations</li>}
          {queue.slice(0, 8).map((e) => (
            <li key={e.id}>
              <code>{e.status}</code> — {e.message}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
