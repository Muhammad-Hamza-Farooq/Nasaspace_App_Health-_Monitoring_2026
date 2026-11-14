"use client";

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
  const { tab, setTab, link, stormActive } = usePulse();

  return (
    <div className="shell" data-testid="pulse-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="brand">PULSE</p>
          <p className="tagline">Astronaut health monitor — gather, evaluate, act</p>
        </div>
        <div className="status-pills">
          <span data-testid="status-link">LINK {link}</span>
          <span data-testid="status-storm">{stormActive ? "STORM" : "QUIET"}</span>
        </div>
      </header>

      <SimBanner />

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
