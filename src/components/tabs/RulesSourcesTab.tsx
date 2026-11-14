"use client";

import { APP_SOURCES, getOfficialSources } from "@/data/sources";
import { usePulse } from "@/lib/pulse/store";

export function RulesSourcesTab() {
  const { thresholds, updateThreshold, receipts } = usePulse();
  const official = getOfficialSources();

  return (
    <div className="panel-stack dash" data-testid="tab-rules">
      <header className="panel-head">
        <h2>Rules &amp; sources</h2>
        <p>Configurable defaults (receipted) and nineteen in-app citations.</p>
      </header>

      <section className="threshold-grid">
        <label>
          HR min
          <input
            type="number"
            data-testid="threshold-hrMin"
            value={thresholds.hrMin}
            onChange={(e) => updateThreshold("hrMin", Number(e.target.value))}
          />
        </label>
        <label>
          HR max
          <input
            type="number"
            data-testid="threshold-hrMax"
            value={thresholds.hrMax}
            onChange={(e) => updateThreshold("hrMax", Number(e.target.value))}
          />
        </label>
        <label>
          Radiation demo limit (mSv/day)
          <input
            type="number"
            step="0.1"
            value={thresholds.radiationMsvDay}
            onChange={(e) => updateThreshold("radiationMsvDay", Number(e.target.value))}
          />
        </label>
        <label>
          CO₂ demo limit (mmHg)
          <input
            type="number"
            step="0.1"
            value={thresholds.co2MmHg}
            onChange={(e) => updateThreshold("co2MmHg", Number(e.target.value))}
          />
        </label>
      </section>

      <section>
        <h3>Official challenge resources</h3>
        <ol className="source-list" data-testid="official-sources">
          {official.map((s) => (
            <li key={s.id}>
              <span>{s.id}.</span>{" "}
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3>All in-app sources ({APP_SOURCES.length})</h3>
        <ol className="source-list" data-testid="all-sources">
          {APP_SOURCES.map((s) => (
            <li key={s.id}>
              <span>{s.id}.</span>{" "}
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>
              {s.officialChallenge ? " — Challenge resource" : ""}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3>Recent receipts</h3>
        <ul className="plain-list compact" data-testid="receipt-list">
          {receipts.slice(0, 12).map((r) => (
            <li key={r.id}>
              <code>{r.kind}</code> [{r.channel}] {r.summary}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
