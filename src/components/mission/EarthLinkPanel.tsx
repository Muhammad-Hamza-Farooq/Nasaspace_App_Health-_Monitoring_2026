"use client";

import { usePulse } from "@/lib/pulse/store";

export function EarthLinkPanel() {
  const { link, opsMode, setLink, queue, stormActive } = usePulse();
  const online = opsMode === "ONLINE_EARTH" && link === "AOS";

  return (
    <div className="side-panel earth-panel">
      <header>
        <p className="panel-sub">Flight surgeons / Earth AI</p>
      </header>
      <div className={`link-status ${online ? "online" : "offline"}`}>
        <strong>{online ? "ONLINE" : "OFFLINE LOCAL AI"}</strong>
        <span>{online ? "AOS — Earth advisors reachable" : "LOS — store-forward only"}</span>
      </div>
      <div className="side-metrics">
        <div>
          <span>Link</span>
          <b data-testid="status-link">LINK {link}</b>
        </div>
        <div>
          <span>Weather</span>
          <b data-testid="status-storm">{stormActive ? "STORM" : "QUIET"}</b>
        </div>
        <div>
          <span>Queued FS</span>
          <b>{queue.filter((q) => q.status === "QUEUED-FS").length}</b>
        </div>
      </div>
      <div className="control-row">
        <button
          type="button"
          className={link === "LOS" ? "btn warn" : "btn"}
          data-testid="link-toggle"
          onClick={() => setLink(link === "AOS" ? "LOS" : "AOS")}
        >
          Toggle {link === "AOS" ? "LOS" : "AOS"}
        </button>
      </div>
      <ul className="plain-list" data-testid="escalation-queue">
        {queue.length === 0 && <li className="muted">No escalations</li>}
        {queue.slice(0, 5).map((e) => (
          <li key={e.id}>
            <code>{e.status}</code> {e.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
