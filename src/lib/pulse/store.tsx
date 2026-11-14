"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { HISTORY_LEN, type TelemetryPoint } from "@/lib/pulse/types";

export type TabId =
  | "overview"
  | "vitals"
  | "radiation"
  | "environment"
  | "countermeasures"
  | "behavioral"
  | "rules";

export type DemoStep = {
  id: string;
  title: string;
  caption: string;
  tab: TabId;
  run: () => void;
};

type HistoryMap = Record<string, TelemetryPoint[]>;

type PulseState = {
  tab: TabId;
  setTab: (t: TabId) => void;
  tick: number;
  stormActive: boolean;
  stormBoost: number;
  setStorm: (on: boolean) => void;
  toggleStorm: () => void;
  snapshots: CrewSnapshot[];
  selectedCrewId: string;
  setSelectedCrewId: (id: string) => void;
  selectedSnap: CrewSnapshot | undefined;
  history: HistoryMap;
  selectedHistory: TelemetryPoint[];
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
  demoActive: boolean;
  demoIndex: number;
  demoCaption: string;
  demoTitle: string;
  startDemo: () => void;
  stopDemo: () => void;
  nextDemoStep: () => void;
};

const PulseContext = createContext<PulseState | null>(null);

function emptyHistory(): HistoryMap {
  return Object.fromEntries(CREW.map((c) => [c.id, [] as TelemetryPoint[]]));
}

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
  const [history, setHistory] = useState<HistoryMap>(emptyHistory);
  const [demoActive, setDemoActive] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoCaption, setDemoCaption] = useState("");
  const [demoTitle, setDemoTitle] = useState("");
  const demoTimer = useRef<number | null>(null);

  const stormBoost = stormActive ? 1 : 0;
  const snapshots = useMemo(
    () => allCrewSnapshots(tick, stormBoost),
    [tick, stormBoost],
  );
  const selectedSnap = snapshots.find((s) => s.crewId === selectedCrewId) ?? snapshots[0];
  const selectedHistory = history[selectedCrewId] ?? [];

  useEffect(() => {
    setLinkState(loadLinkState());
    setQueue(loadQueue());
    setReceipts(loadReceipts());
    setThresholds(loadThresholds());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1200);
    return () => window.clearInterval(id);
  }, [hydrated]);

  // Append telemetry history each tick
  useEffect(() => {
    if (!hydrated) return;
    setHistory((prev) => {
      const next = { ...prev };
      for (const snap of snapshots) {
        const point: TelemetryPoint = {
          t: snap.tick,
          hr: snap.vitals.hr as number,
          spo2: snap.vitals.spo2 as number,
          tempC: snap.vitals.tempC as number,
          sbp: snap.vitals.sbp as number,
          dbp: snap.vitals.dbp as number,
          radiationMsvDay: snap.radiationMsvDay,
          co2MmHg: snap.co2MmHg,
          sleepHours: snap.sleepHours,
          exerciseMin: snap.exerciseMin,
          mood: snap.mood,
        };
        const series = [...(next[snap.crewId] ?? []), point].slice(-HISTORY_LEN);
        next[snap.crewId] = series;
      }
      return next;
    });
  }, [tick, hydrated, snapshots]);

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

  const setStorm = useCallback((on: boolean) => setStormActive(on), []);
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
      { hr: Number.NaN, spo2: 98, tempC: 36.6, sbp: 120, dbp: 80 },
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
    return { ok: steps.length === 5, steps };
  }, [selectedCrewId]);

  const clearDemoTimer = useCallback(() => {
    if (demoTimer.current !== null) {
      window.clearTimeout(demoTimer.current);
      demoTimer.current = null;
    }
  }, []);

  const demoSteps: DemoStep[] = useMemo(
    () => [
      {
        id: "intro",
        title: "Mission console",
        caption:
          "PULSE live dashboard — four crew, hazard-grouped channels, receipted engines.",
        tab: "overview",
        run: () => {
          setStormActive(false);
          setLink("AOS");
        },
      },
      {
        id: "vitals",
        title: "Vitals figures",
        caption: "Interactive HR / SpO₂ / BP streams for the selected crew member.",
        tab: "vitals",
        run: () => setSelectedCrewId(CREW[0].id),
      },
      {
        id: "storm",
        title: "Solar storm replay",
        caption: "DONKI-style SPE boost — watch radiation dose climb on the chart.",
        tab: "radiation",
        run: () => setStormActive(true),
      },
      {
        id: "los",
        title: "LOS store-forward",
        caption: "Earth link lost. Escalation queues as QUEUED-FS for the flight surgeon.",
        tab: "overview",
        run: () => {
          setLink("LOS");
          enqueueEscalation(
            {
              crewId: selectedCrewId,
              severity: "urgent",
              message: "Demo Mode: SPE medical escalate while LOS",
            },
            "LOS",
          );
          setQueue(loadQueue());
          setReceipts(loadReceipts());
        },
      },
      {
        id: "aos",
        title: "AOS flush",
        caption: "Link restored. Queue flushes with sync receipts.",
        tab: "overview",
        run: () => setLink("AOS"),
      },
      {
        id: "blind",
        title: "BLIND quality gate",
        caption: "Bad sensor sample refused — no invented vitals pass the gate.",
        tab: "vitals",
        run: () => injectBadSample(),
      },
      {
        id: "mood",
        title: "Behavioral check-in",
        caption: "Isolation hazard channel — mood score written with a receipt.",
        tab: "behavioral",
        run: () => setMoodCheckIn(4.5),
      },
      {
        id: "sources",
        title: "Nineteen citations",
        caption: "Official challenge resources 21–25 listed first for eligibility.",
        tab: "rules",
        run: () => setStormActive(false),
      },
    ],
    [injectBadSample, selectedCrewId, setLink, setMoodCheckIn],
  );

  const applyDemoStep = useCallback(
    (index: number) => {
      const step = demoSteps[index];
      if (!step) {
        setDemoActive(false);
        setDemoTitle("Demo complete");
        setDemoCaption("Judge tour path finished. Explore any panel freely.");
        return;
      }
      setDemoIndex(index);
      setDemoTitle(step.title);
      setDemoCaption(step.caption);
      setTab(step.tab);
      step.run();
    },
    [demoSteps],
  );

  const stopDemo = useCallback(() => {
    clearDemoTimer();
    setDemoActive(false);
    setDemoTitle("");
    setDemoCaption("");
  }, [clearDemoTimer]);

  const nextDemoStep = useCallback(() => {
    clearDemoTimer();
    const next = demoIndex + 1;
    if (next >= demoSteps.length) {
      stopDemo();
      setDemoTitle("Demo complete");
      setDemoCaption("Judge tour path finished. Explore any panel freely.");
      return;
    }
    applyDemoStep(next);
  }, [applyDemoStep, clearDemoTimer, demoIndex, demoSteps.length, stopDemo]);

  const startDemo = useCallback(() => {
    clearDemoTimer();
    setDemoActive(true);
    applyDemoStep(0);
  }, [applyDemoStep, clearDemoTimer]);

  // Auto-advance demo every 4.5s while active
  useEffect(() => {
    if (!demoActive) return;
    clearDemoTimer();
    demoTimer.current = window.setTimeout(() => {
      nextDemoStep();
    }, 4500);
    return clearDemoTimer;
  }, [demoActive, demoIndex, nextDemoStep, clearDemoTimer]);

  const value: PulseState = {
    tab,
    setTab,
    tick,
    stormActive,
    stormBoost,
    setStorm,
    toggleStorm,
    snapshots,
    selectedCrewId,
    setSelectedCrewId,
    selectedSnap,
    history,
    selectedHistory,
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
    demoActive,
    demoIndex,
    demoCaption,
    demoTitle,
    startDemo,
    stopDemo,
    nextDemoStep,
  };

  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>;
}

export function usePulse() {
  const ctx = useContext(PulseContext);
  if (!ctx) throw new Error("usePulse must be used within PulseProvider");
  return ctx;
}
