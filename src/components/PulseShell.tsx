"use client";

import { DemoOverlay } from "@/components/DemoOverlay";
import { SimBanner } from "@/components/SimBanner";
import { BehavioralTab } from "@/components/tabs/BehavioralTab";
import { CountermeasuresTab } from "@/components/tabs/CountermeasuresTab";
import { EnvironmentTab } from "@/components/tabs/EnvironmentTab";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { RadiationTab } from "@/components/tabs/RadiationTab";
import { RulesSourcesTab } from "@/components/tabs/RulesSourcesTab";
import { VitalsTab } from "@/components/tabs/VitalsTab";
import { PulseProvider, usePulse, type TabId } from "@/lib/pulse/store";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "vitals", label: "Vitals" },
  { id: "radiation", label: "Radiation" },
  { id: "environment", label: "Environment" },
  { id: "countermeasures", label: "Countermeasures" },
  { id: "behavioral", label: "Behavioral" },
  { id: "rules", label: "Rules & Sources" },
];

function ShellInner() {
  const {
    tab,
    setTab,
    link,
    stormActive,
    tick,
    selectedSnap,
    queue,
    receipts,
    startDemo,
    demoActive,
    judgeTour,
  } = usePulse();

  const queued = queue.filter((q) => q.status === "QUEUED-FS").length;

  return (
    <div className={`shell ${demoActive ? "demo-on" : ""}`} data-testid="pulse-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="brand">PULSE</p>
          <p className="tagline">Interactive astronaut health dashboard</p>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className={demoActive ? "btn danger" : "btn accent"}
            data-testid="demo-mode-btn"
            onClick={startDemo}
          >
            {demoActive ? "Demo running…" : "Demo Mode"}
          </button>
          <button
            type="button"
            className="btn ghost"
            data-testid="judge-tour"
            onClick={() => judgeTour()}
          >
            Judge tour
          </button>
        </div>
      </header>

      <SimBanner />
      <DemoOverlay />

      <div className="ops-rail" data-testid="ops-rail">
        <div className="ops-chip">
          <span>SOL</span>
          <strong>{140 + Math.floor(tick / 20)}</strong>
        </div>
        <div className="ops-chip">
          <span>LINK</span>
          <strong
            className={link === "LOS" ? "warn" : "ok"}
            data-testid="status-link"
          >
            LINK {link}
          </strong>
        </div>
        <div className="ops-chip">
          <span>WX</span>
          <strong
            className={stormActive ? "warn" : ""}
            data-testid="status-storm"
          >
            {stormActive ? "STORM" : "QUIET"}
          </strong>
        </div>
        <div className="ops-chip">
          <span>CREW</span>
          <strong>{selectedSnap?.name.split(" ")[0] ?? "—"}</strong>
        </div>
        <div className="ops-chip">
          <span>QUEUE</span>
          <strong>{queued}</strong>
        </div>
        <div className="ops-chip">
          <span>RCPT</span>
          <strong>{receipts.length}</strong>
        </div>
      </div>

      <nav className="tab-nav" aria-label="PULSE sections" data-testid="tab-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? "tab active" : "tab"}
            data-testid={`nav-${t.id}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {tab === "overview" && <OverviewTab />}
        {tab === "vitals" && <VitalsTab />}
        {tab === "radiation" && <RadiationTab />}
        {tab === "environment" && <EnvironmentTab />}
        {tab === "countermeasures" && <CountermeasuresTab />}
        {tab === "behavioral" && <BehavioralTab />}
        {tab === "rules" && <RulesSourcesTab />}
      </main>
    </div>
  );
}

export function PulseShell() {
  return (
    <PulseProvider>
      <ShellInner />
    </PulseProvider>
  );
}
