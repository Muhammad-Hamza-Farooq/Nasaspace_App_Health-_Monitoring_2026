"use client";

import { LOCAL_AI_DEVICES, VITALS_DEVICES } from "@/lib/mission/devices";

export function DeviceMap({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`device-map ${compact ? "compact" : ""}`}
      data-testid="device-map"
      aria-label="Devices for vitals and local AI"
    >
      <div className="device-col">
        <h3>Vitals devices</h3>
        <p className="muted">Gather telemetry on crew and cabin</p>
        <ul>
          {VITALS_DEVICES.map((d) => (
            <li key={d.id}>
              <b>{d.name}</b>
              <span>{d.measures}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="device-col ai">
        <h3>Local AI devices</h3>
        <p className="muted">Evaluate and advise while Earth is offline</p>
        <ul>
          {LOCAL_AI_DEVICES.map((d) => (
            <li key={d.id}>
              <b>{d.name}</b>
              <span>{d.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
