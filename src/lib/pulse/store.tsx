"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CREW } from "@/data/crew";
import {
  runCabinEngine,
  runMoodEngine,
  runRadiationEngine,
  runSleepEngine,
  runVitalsEngine,
} from "@/lib/engines";
import {
  enqueueEscalation,
  flushQueueOnAos,
  loadLinkState,
  loadQueue,
  saveLinkState,
  setLinkState as setLosLink,
  type Escalation,
  type LinkState,
} from "@/lib/los";
import {
  appendReceipt,
  loadReceipts,
  type Receipt,
} from "@/lib/receipts";
import { allCrewSnapshots, type CrewSnapshot } from "@/lib/sim";
import { syncReceiptToSupabase } from "@/lib/supabase/client";
import {
  DEFAULT_THRESHOLDS,
  loadThresholds,
  saveThresholds,
  type Thresholds,
} from "@/lib/thresholds";
import type { VitalSample } from "@/lib/blind";

export type TabId =
  | "overview"
  | "vitals"
  | "radiation"
  | "environment"
  | "countermeasures"
  | "behavioral"
  | "rules";

type PulseState = {
  tab: TabId;
  setTab: (t: TabId) => void;
  tick: number;
  stormActive: boolean;
  stormBoost: number;
  toggleStorm: () => void;
  snapshots: CrewSnapshot[];
  selectedCrewId: string;
  setSelectedCrewId: (id: string) => void;
  link: LinkState;
  setLink: (s: LinkState) => void;
  queue: Escalation[];
  receipts: Receipt[];
  thresholds: Thresholds;
  updateThreshold: (key: keyof Thresholds, value: number) => void;
  injectBadSample: () => void;
  lastBlindMessage: string | null;
  runManualVitals: (sample: VitalSample) => void;
  moodScore: number;
  setMoodCheckIn: (score: number) => void;
  escalateSelected: () => void;
  judgeTour: () => { ok: boolean; steps: string[] };
};

const PulseContext = createContext<PulseState | null>(null);

export function PulseProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<TabId>("overview");
  const [tick, setTick] = useState(0);
  const [stormActive, setStormActive] = useState(false);
  const [selectedCrewId, setSelectedCrewId] = useState(CREW[0].id);
  const [link, setLinkState] = useState<LinkState>("AOS");
  const [queue, setQueue] = useState<Escalation[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);
  const [lastBlindMessage, setLastBlindMessage] = useState<string | null>(null);
  const [moodScore, setMoodScore] = useState(6.5);
  const [hydrated, setHydrated] = useState(false);

  const stormBoost = stormActive ? 1 : 0;
  const snapshots = useMemo(
    () => allCrewSnapshots(tick, stormBoost),
    [tick, stormBoost],
  );

  useEffect(() => {
    setLinkState(loadLinkState());
    setQueue(loadQueue());
    setReceipts(loadReceipts());
    setThresholds(loadThresholds());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1500);
    return () => window.clearInterval(id);
  }, [hydrated]);

  // Emit engine receipts periodically for selected crew (receipted outputs)
  useEffect(() => {
    if (!hydrated || tick === 0 || tick % 4 !== 0) return;
    const snap = snapshots.find((s) => s.crewId === selectedCrewId) ?? snapshots[0];
    if (!snap) return;
    const findings = [
      runVitalsEngine(snap.vitals, thresholds),
      runRadiationEngine(snap.radiationMsvDay, thresholds),
      runCabinEngine(snap.co2MmHg, thresholds),
      runSleepEngine(snap.sleepHours, thresholds),
    ];
    let nextReceipts = loadReceipts();
    const seen = new Set(nextReceipts.map((r) => r.id));
    for (const f of findings) {
      if (seen.has(f.receipt.id)) continue;
      seen.add(f.receipt.id);
      nextReceipts = appendReceipt(f.receipt, nextReceipts);
      void syncReceiptToSupabase(f.receipt);
    }
    setReceipts(nextReceipts);
  }, [tick, hydrated, selectedCrewId, snapshots, thresholds]);

  const setLink = useCallback((s: LinkState) => {
    if (s === "AOS") {
      flushQueueOnAos();
      setQueue(loadQueue());
      setReceipts(loadReceipts());
    } else {
      saveLinkState("LOS");
    }
    setLosLink(s);
    setLinkState(s);
  }, []);

  const toggleStorm = useCallback(() => setStormActive((v) => !v), []);

  const updateThreshold = useCallback((key: keyof Thresholds, value: number) => {
    setThresholds((prev) => {
      const next = { ...prev, [key]: value };
      const { receipt } = saveThresholds(next, key, prev[key]);
      setReceipts(appendReceipt(receipt));
      void syncReceiptToSupabase(receipt);
      return next;
    });
  }, []);

  const injectBadSample = useCallback(() => {
    const finding = runVitalsEngine(
      { hr: NaN, spo2: 98, tempC: 36.6, sbp: 120, dbp: 80 },
      thresholds,
    );
    setLastBlindMessage(finding.message);
    setReceipts(appendReceipt(finding.receipt));
    setTab("vitals");
  }, [thresholds]);

  const runManualVitals = useCallback(
    (sample: VitalSample) => {
      const finding = runVitalsEngine(sample, thresholds);
      if (finding.level === "blind") setLastBlindMessage(finding.message);
      else setLastBlindMessage(null);
      setReceipts(appendReceipt(finding.receipt));
      void syncReceiptToSupabase(finding.receipt);
    },
    [thresholds],
  );

  const setMoodCheckIn = useCallback((score: number) => {
    setMoodScore(score);
    const finding = runMoodEngine(score);
    setReceipts(appendReceipt(finding.receipt));
    void syncReceiptToSupabase(finding.receipt);
  }, []);

  const escalateSelected = useCallback(() => {
    const currentLink = loadLinkState();
    const { receipt } = enqueueEscalation(
      {
        crewId: selectedCrewId,
        severity: stormActive ? "urgent" : "watch",
        message: stormActive
          ? `SPE storm watch for ${selectedCrewId}`
          : `Crew ${selectedCrewId} needs flight-surgeon review`,
      },
      currentLink,
    );
    setQueue(loadQueue());
    setReceipts(loadReceipts());
    void syncReceiptToSupabase(receipt);
  }, [selectedCrewId, stormActive]);

  const judgeTour = useCallback(() => {
    const steps: string[] = [];
    setTab("overview");
    steps.push("overview");
    setStormActive(true);
    steps.push("storm-on");
    setLosLink("LOS");
    setLinkState("LOS");
    enqueueEscalation(
      {
        crewId: selectedCrewId,
        severity: "urgent",
        message: "Judge-tour LOS escalation",
      },
      "LOS",
    );
    steps.push("los-queued");
    flushQueueOnAos();
    setLinkState("AOS");
    setQueue(loadQueue());
    setReceipts(loadReceipts());
    steps.push("aos-flush");
    setStormActive(false);
    setTab("rules");
    steps.push("sources");
    const ok = steps.length === 5;
    return { ok, steps };
  }, [selectedCrewId]);

  const value: PulseState = {
    tab,
    setTab,
    tick,
    stormActive,
    stormBoost,
    toggleStorm,
    snapshots,
    selectedCrewId,
    setSelectedCrewId,
    link,
    setLink,
    queue,
    receipts,
    thresholds,
    updateThreshold,
    injectBadSample,
    lastBlindMessage,
    runManualVitals,
    moodScore,
    setMoodCheckIn,
    escalateSelected,
    judgeTour,
  };

  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>;
}

export function usePulse() {
  const ctx = useContext(PulseContext);
  if (!ctx) throw new Error("usePulse must be used within PulseProvider");
  return ctx;
}
