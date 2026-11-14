"use client";

import { SparkLine } from "@/components/charts/SparkLine";
import { usePulse } from "@/lib/pulse/store";

export function BehavioralTab() {
  const { moodScore, setMoodCheckIn, selectedHistory } = usePulse();

  return (
    <div className="panel-stack dash" data-testid="tab-behavioral">
      <header className="panel-head">
        <h2>Behavioral</h2>
        <p>Mood check-in for isolation and confinement hazard.</p>
      </header>

      <section className="figure">
        <h3>Mood timeline</h3>
        <SparkLine
          data={selectedHistory.map((p) => ({ t: p.t, v: p.mood }))}
          color="#c77dff"
          unit="/10"
          height={180}
          domain={[1, 10]}
        />
      </section>

      <label className="slider-label">
        Mood score: <strong data-testid="mood-score">{moodScore}</strong>
        <input
          type="range"
          min={1}
          max={10}
          step={0.5}
          value={moodScore}
          data-testid="mood-slider"
          onChange={(e) => setMoodCheckIn(Number(e.target.value))}
        />
      </label>
      <button
        type="button"
        className="btn"
        data-testid="mood-submit"
        onClick={() => setMoodCheckIn(moodScore)}
      >
        Save check-in (receipted)
      </button>
    </div>
  );
}
