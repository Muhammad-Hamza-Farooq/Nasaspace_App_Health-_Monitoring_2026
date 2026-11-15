"use client";

import { DemoOverlay } from "@/components/DemoOverlay";
import { SimBanner } from "@/components/SimBanner";
import { AiAdvisorPanel } from "@/components/mission/AiAdvisorPanel";
import { CrewRail } from "@/components/mission/CrewRail";
import { EarthLinkPanel } from "@/components/mission/EarthLinkPanel";
import { HeroTelemetry } from "@/components/mission/HeroTelemetry";
import { IncidentOverlay } from "@/components/mission/IncidentOverlay";
import { Zone } from "@/components/mission/Zone";
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
    stopDemo,
    toggleDemoPause,
    demoActive,
    demoPaused,
    toggleStorm,
    escalateSelected,
    injectBadSample,
    focusZone,
    spaceWx,
  } = usePulse();

  const wxLabel =
    spaceWx === "flare_hf"
      ? "FLARE HF BLACKOUT"
      : spaceWx === "mars_conjunction"
        ? "MARS CONJUNCTION"
        : stormActive
          ? "DUST/SPE"
          : "CLEAR";

  return (
    <div className={`mission-screen ${demoActive ? "demo-on" : ""}`} data-testid="pulse-shell">
      <IncidentOverlay />
      <Zone
        id="strip"
        code="A"
        title="Mission strip"
        className="zone-strip"
        as="div"
      >
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
              <span>SPACE WX</span>
              <strong className={spaceWx !== "clear" || stormActive ? "warn" : ""}>
                {wxLabel}
              </strong>
            </div>
          </div>

          <div className="top-actions">
            {!demoActive ? (
              <button
                type="button"
                className="btn accent"
                data-testid="demo-mode-btn"
                onClick={startDemo}
              >
                Mission Demo
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className={demoPaused ? "btn accent" : "btn"}
                  data-testid="demo-pause-top"
                  onClick={toggleDemoPause}
                >
                  {demoPaused ? "Resume demo" : "Pause demo"}
                </button>
                <button
                  type="button"
                  className="btn danger"
                  data-testid="demo-stop-top"
                  onClick={stopDemo}
                >
                  Stop demo
                </button>
              </>
            )}
            <button
              type="button"
              className={stormActive ? "btn danger" : "btn"}
              data-testid="storm-toggle"
              onClick={toggleStorm}
            >
              {stormActive ? "Storm ON" : "Trigger storm"}
            </button>
            <button
              type="button"
              className="btn"
              data-testid="escalate-btn"
              onClick={escalateSelected}
            >
              Escalate
            </button>
            <button type="button" className="btn ghost" data-testid="judge-tour" onClick={injectBadSample}>
              BLIND test
            </button>
          </div>
        </header>
      </Zone>

      <SimBanner />
      <DemoOverlay />

      <nav className="tab-nav" aria-label="Detail sections" data-testid="tab-nav">
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
        <Zone id="crew" code="B" title="Crew rail" className="zone-crew" as="aside">
          <CrewRail />
        </Zone>

        <Zone id="floor" code="C" title="Live floor" className="zone-floor" as="div">
          <main className="mission-center">
            {tab === "overview" && <HeroTelemetry />}
            {tab === "vitals" && <VitalsTab />}
            {tab === "radiation" && <RadiationTab />}
            {tab === "environment" && <EnvironmentTab />}
            {tab === "countermeasures" && <CountermeasuresTab />}
            {tab === "behavioral" && <BehavioralTab />}
            {tab === "rules" && <RulesSourcesTab />}
          </main>
        </Zone>

        <div className="mission-bottom">
          <Zone id="earth" code="D" title="Earth medical link" className="zone-earth">
            <EarthLinkPanel />
          </Zone>
          <Zone id="ai" code="E" title="Local AI advisor" className="zone-ai">
            <AiAdvisorPanel />
          </Zone>
        </div>
      </div>

      {demoActive && focusZone !== "none" && (
        <p className="focus-hint" aria-hidden="true">
          Active zone highlighted with gold border
        </p>
      )}
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
