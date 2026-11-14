"use client";

import { MultiLine } from "@/components/charts/MultiLine";
import { GaugeBar } from "@/components/charts/GaugeBar";
import { usePulse } from "@/lib/pulse/store";

export function HeroTelemetry() {
  const { selectedSnap, selectedHistory, thresholds, tick, anomaly } = usePulse();
  if (!selectedSnap) return null;

  const chart = selectedHistory.map((p) => ({
    t: p.t,
    hr: p.hr,
    spo2: p.spo2,
    dose: p.radiationMsvDay,
    co2: p.co2MmHg,
  }));

  return (
    <section className="hero-telemetry" data-testid="tab-overview">
      <header className="hero-head">
        <div>
          <p className="eyebrow">Selected crew</p>
          <h2>{selectedSnap.name}</h2>
          <p className="muted">
            {selectedSnap.role}
            {anomaly?.crewId === selectedSnap.crewId
              ? ` · ANOMALY: ${anomaly.title}`
              : " · nominal watch"}
          </p>
        </div>
        <div className="hero-big-grid" data-testid="vitals-live">
          <div className="hero-big">
            <span>HR</span>
            <strong data-testid="vitals-hr">{selectedSnap.vitals.hr}</strong>
            <em>bpm</em>
          </div>
          <div className="hero-big">
            <span>SpO₂</span>
            <strong>{selectedSnap.vitals.spo2}</strong>
            <em>%</em>
          </div>
          <div className="hero-big">
            <span>Temp</span>
            <strong>{selectedSnap.vitals.tempC}</strong>
            <em>°C</em>
          </div>
          <div className="hero-big">
            <span>BP</span>
            <strong>
              {selectedSnap.vitals.sbp}/{selectedSnap.vitals.dbp}
            </strong>
            <em>mmHg</em>
          </div>
          <div className="hero-big">
            <span>Dose</span>
            <strong data-testid="rad-dose">{selectedSnap.radiationMsvDay}</strong>
            <em>mSv/d</em>
          </div>
          <div className="hero-big">
            <span>CO₂</span>
            <strong data-testid="co2-value">{selectedSnap.co2MmHg}</strong>
            <em>mmHg</em>
          </div>
          <div className="hero-big">
            <span>Sleep</span>
            <strong data-testid="sleep-hours">{selectedSnap.sleepHours}</strong>
            <em>h</em>
          </div>
          <div className="hero-big">
            <span>Tick</span>
            <strong data-testid="vitals-tick">{tick}</strong>
            <em>sim</em>
          </div>
        </div>
      </header>

      <div className="gauge-row">
        <GaugeBar
          label="HR vs max"
          value={selectedSnap.vitals.hr as number}
          max={160}
          unit=" bpm"
          warnAt={thresholds.hrMax}
          alertAt={thresholds.hrMax + 15}
        />
        <GaugeBar
          label="Radiation"
          value={selectedSnap.radiationMsvDay}
          max={2.5}
          unit=" mSv/d"
          warnAt={thresholds.radiationMsvDay * 0.7}
          alertAt={thresholds.radiationMsvDay}
        />
        <GaugeBar
          label="Cabin CO₂"
          value={selectedSnap.co2MmHg}
          max={6}
          unit=" mmHg"
          warnAt={thresholds.co2MmHg * 0.85}
          alertAt={thresholds.co2MmHg}
        />
        <GaugeBar label="Mood" value={selectedSnap.mood} max={10} unit="/10" />
      </div>

      <div className="figure hero-chart">
        <h3>Live multi-channel figure</h3>
        <MultiLine
          height={240}
          data={chart}
          series={[
            { key: "hr", name: "HR", color: "#e4572e" },
            { key: "spo2", name: "SpO₂", color: "#2ec4b6" },
            { key: "dose", name: "Dose", color: "#f0a202" },
            { key: "co2", name: "CO₂", color: "#5b8def" },
          ]}
        />
      </div>
    </section>
  );
}
