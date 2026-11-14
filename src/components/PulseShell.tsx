"use client";

import { DemoOverlay } from "@/components/DemoOverlay";
import { SimBanner } from "@/components/SimBanner";
import { AiAdvisorPanel } from "@/components/mission/AiAdvisorPanel";
import { CrewRail } from "@/components/mission/CrewRail";
import { EarthLinkPanel } from "@/components/mission/EarthLinkPanel";
import { HeroTelemetry } from "@/components/mission/HeroTelemetry";
import { BehavioralTab } from "@/components/tabs/BehavioralTab";
import { CountermeasuresTab } from "@/components/tabs/CountermeasuresTab";
import { EnvironmentTab } from "@/components/tabs/EnvironmentTab";
import { RadiationTab } from "@/components/tabs/RadiationTab";
import { RulesSourcesTab } from "@/components/tabs/RulesSourcesTab";
import { VitalsTab } from "@/components/tabs/VitalsTab";
import { PulseProvider, usePulse, type TabId } from "@/lib/pulse/store";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Floor" },
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
    tick,
    stormActive,
    opsMode,
    link,
    startDemo,
    demoActive,
    toggleStorm,
    escalateSelected,
    injectBadSample,
  } = usePulse();

  return (
    <div className={`mission-screen ${demoActive ? "demo-on" : ""}`} data-testid="pulse-shell">
      <header className="mission-top">
        <div className="brand-block">
          <p className="brand">PULSE</p>
          <p className="tagline">Mission health floor — gather · evaluate · act</p>
        </div>

        <div className="mission-status-band">
          <div className="ms-item">
            <span>SOL</span>
            <strong>{140 + Math.floor(tick / 20)}</strong>
          </div>
          <div className="ms-item">
            <span>EARTH</span>
            <strong className={opsMode === "ONLINE_EARTH" ? "ok" : "warn"}>
              {opsMode === "ONLINE_EARTH" ? "SURGEONS ONLINE" : "LOCAL AI ONLY"}
            </strong>
          </div>
          <div className="ms-item">
            <span>LINK</span>
            <strong className={link === "LOS" ? "warn" : "ok"}>{link}</strong>
          </div>
          <div className="ms-item">
            <span>ANOMALY WX</span>
            <strong className={stormActive ? "warn" : ""}>
              {stormActive ? "DUST/SPE" : "CLEAR"}
            </strong>
          </div>
        </div>

        <div className="top-actions">
          <button
            type="button"
            className={demoActive ? "btn danger" : "btn accent"}
            data-testid="demo-mode-btn"
            onClick={startDemo}
          >
            {demoActive ? "Mission running…" : "Mission Demo"}
          </button>
          <button
            type="button"
            className={stormActive ? "btn danger" : "btn"}
            data-testid="storm-toggle"
            onClick={toggleStorm}
          >
            {stormActive ? "Storm ON" : "Trigger storm"}
          </button>
          <button type="button" className="btn" data-testid="escalate-btn" onClick={escalateSelected}>
            Escalate
          </button>
          <button
            type="button"
            className="btn ghost"
            data-testid="judge-tour"
            onClick={injectBadSample}
            title="Also available in Vitals"
          >
            BLIND test
          </button>
        </div>
      </header>

      <SimBanner />
      <DemoOverlay />

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

      <div className="mission-grid">
        <CrewRail />

        <main className="mission-center">
          {tab === "overview" && <HeroTelemetry />}
          {tab === "vitals" && <VitalsTab />}
          {tab === "radiation" && <RadiationTab />}
          {tab === "environment" && <EnvironmentTab />}
          {tab === "countermeasures" && <CountermeasuresTab />}
          {tab === "behavioral" && <BehavioralTab />}
          {tab === "rules" && <RulesSourcesTab />}
        </main>

        <div className="mission-right">
          <EarthLinkPanel />
          <AiAdvisorPanel />
        </div>
      </div>
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
