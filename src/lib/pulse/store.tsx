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
  ANOMALY_PRESETS,
  buildAnomaly,
  type ActiveAnomaly,
  type AnomalyKind,
} from "@/lib/mission/interventions";
import {
  appendReceipt,
  createReceipt,
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

export type OpsMode = "ONLINE_EARTH" | "OFFLINE_LOCAL";

export type FocusZone =
  | "strip"
  | "crew"
  | "floor"
  | "earth"
  | "ai"
  | "none";

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
  opsMode: OpsMode;
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
  anomaly: ActiveAnomaly | null;
  triggerAnomaly: (crewId: string, kind: AnomalyKind) => void;
  applyIntervention: (id: string) => void;
  applyAllInterventions: () => void;
  demoActive: boolean;
  demoIndex: number;
  demoCaption: string;
  demoTitle: string;
  demoLookAt: string;
  focusZone: FocusZone;
  startDemo: () => void;
  stopDemo: () => void;
  nextDemoStep: () => void;
  missionLog: { id: string; text: string }[];
};

const PulseContext = createContext<PulseState | null>(null);

function emptyHistory(): HistoryMap {
  return Object.fromEntries(CREW.map((c) => [c.id, [] as TelemetryPoint[]]));
}

function applyAnomalyToSnap(
  snap: CrewSnapshot,
  anomaly: ActiveAnomaly | null,
  recoveryProgress: number,
): CrewSnapshot {
  if (!anomaly || anomaly.crewId !== snap.crewId) return snap;
  const preset = ANOMALY_PRESETS[anomaly.kind];
  const a = preset.vitals;
  const blend = anomaly.recovering ? recoveryProgress : 0;
  const mix = (abnormal: number, normal: number) =>
    Math.round((abnormal * (1 - blend) + normal * blend) * 10) / 10;
  const mixInt = (abnormal: number, normal: number) =>
    Math.round(abnormal * (1 - blend) + normal * blend);

  return {
    ...snap,
    vitals: {
      hr: mixInt(a.hr, snap.vitals.hr as number),
      spo2: mix(a.spo2, snap.vitals.spo2 as number),
      tempC: mix(a.tempC, snap.vitals.tempC as number),
      sbp: mixInt(a.sbp, snap.vitals.sbp as number),
      dbp: mixInt(a.dbp, snap.vitals.dbp as number),
    },
    radiationMsvDay:
      a.radiationMsvDay !== undefined
        ? mix(a.radiationMsvDay, snap.radiationMsvDay)
        : snap.radiationMsvDay,
    co2MmHg:
      a.co2MmHg !== undefined ? mix(a.co2MmHg, snap.co2MmHg) : snap.co2MmHg,
    mood: a.mood !== undefined ? mix(a.mood, snap.mood) : snap.mood,
  };
}

export function PulseProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<TabId>("overview");
  const [tick, setTick] = useState(0);
  const [stormActive, setStormActive] = useState(false);
  const [selectedCrewId, setSelectedCrewId] = useState(CREW[0].id);
  const [link, setLinkState] = useState<LinkState>("AOS");
  const [opsMode, setOpsMode] = useState<OpsMode>("ONLINE_EARTH");
  const [queue, setQueue] = useState<Escalation[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);
  const [lastBlindMessage, setLastBlindMessage] = useState<string | null>(null);
  const [moodScore, setMoodScore] = useState(6.5);
  const [hydrated, setHydrated] = useState(false);
  const [history, setHistory] = useState<HistoryMap>(emptyHistory);
  const [anomaly, setAnomaly] = useState<ActiveAnomaly | null>(null);
  const [recoveryProgress, setRecoveryProgress] = useState(0);
  const [missionLog, setMissionLog] = useState<{ id: string; text: string }[]>([
    {
      id: "boot",
      text: "PULSE online — Earth medical channel nominal.",
    },
  ]);
  const [demoActive, setDemoActive] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoCaption, setDemoCaption] = useState("");
  const [demoTitle, setDemoTitle] = useState("");
  const [demoLookAt, setDemoLookAt] = useState("");
  const [focusZone, setFocusZone] = useState<FocusZone>("none");
  const demoTimer = useRef<number | null>(null);

  const stormBoost = stormActive ? 1 : 0;
  const baseSnapshots = useMemo(
    () => allCrewSnapshots(tick, stormBoost),
    [tick, stormBoost],
  );
  const snapshots = useMemo(
    () =>
      baseSnapshots.map((s) => applyAnomalyToSnap(s, anomaly, recoveryProgress)),
    [baseSnapshots, anomaly, recoveryProgress],
  );
  const selectedSnap =
    snapshots.find((s) => s.crewId === selectedCrewId) ?? snapshots[0];
  const selectedHistory = history[selectedCrewId] ?? [];

  const pushLog = useCallback((line: string) => {
    const id = `log_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    setMissionLog((prev) =>
      [{ id, text: `${new Date().toLocaleTimeString()} — ${line}` }, ...prev].slice(0, 40),
    );
  }, []);

  useEffect(() => {
    setLinkState(loadLinkState());
    setQueue(loadQueue());
    setReceipts(loadReceipts());
    setThresholds(loadThresholds());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1100);
    return () => window.clearInterval(id);
  }, [hydrated]);

  // Recovery lerp toward normal after interventions
  useEffect(() => {
    if (!anomaly?.recovering) return;
    if (recoveryProgress >= 1) {
      pushLog("Monitoring complete: vitals returned to mission-normal band.");
      setAnomaly((prev) =>
        prev ? { ...prev, phase: "normalized", recovering: false } : prev,
      );
      const clearId = window.setTimeout(() => {
        setAnomaly(null);
        setRecoveryProgress(0);
      }, 2400);
      return () => window.clearTimeout(clearId);
    }
    if (recoveryProgress > 0 && anomaly.phase !== "monitoring") {
      setAnomaly((prev) =>
        prev ? { ...prev, phase: "monitoring" } : prev,
      );
      pushLog("Monitoring vitals after cited procedures…");
    }
    const id = window.setTimeout(
      () => setRecoveryProgress((p) => Math.min(1, p + 0.22)),
      900,
    );
    return () => window.clearTimeout(id);
  }, [anomaly, recoveryProgress, pushLog]);

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
        next[snap.crewId] = [...(next[snap.crewId] ?? []), point].slice(-HISTORY_LEN);
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

  const setLink = useCallback(
    (s: LinkState) => {
      if (s === "AOS") {
        flushQueueOnAos();
        setQueue(loadQueue());
        setReceipts(loadReceipts());
        setOpsMode("ONLINE_EARTH");
        pushLog("AOS restored — syncing queued escalations to Earth surgeons.");
      } else {
        saveLinkState("LOS");
        setOpsMode("OFFLINE_LOCAL");
        pushLog("LOS — Earth medical link lost. Switching to offline local AI.");
      }
      setLosLink(s);
      setLinkState(s);
    },
    [pushLog],
  );

  const setStorm = useCallback(
    (on: boolean) => {
      setStormActive(on);
      pushLog(
        on
          ? "Environmental anomaly: dust storm / SPE signature rising."
          : "Storm signature decaying — radiation channel easing.",
      );
    },
    [pushLog],
  );
  const toggleStorm = useCallback(() => {
    setStormActive((v) => {
      const next = !v;
      pushLog(
        next
          ? "Environmental anomaly: dust storm / SPE signature rising."
          : "Storm signature decaying — radiation channel easing.",
      );
      return next;
    });
  }, [pushLog]);

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

  const triggerAnomaly = useCallback(
    (crewId: string, kind: AnomalyKind) => {
      const next = buildAnomaly(crewId, kind);
      setAnomaly(next);
      setRecoveryProgress(0);
      setSelectedCrewId(crewId);
      pushLog(`${next.problemLabel} on ${crewId}`);
      pushLog(`Local AI advising from citations. ${next.datasetNote}`);
      const receipt = createReceipt({
        kind: "engine",
        channel: "vitals",
        summary: `Anomaly detected: ${next.title}`,
        payload: { crewId, kind, citations: next.interventions.map((i) => i.citation.id) },
      });
      setReceipts(appendReceipt(receipt));
      if (opsMode === "OFFLINE_LOCAL" || link === "LOS") {
        enqueueEscalation(
          {
            crewId,
            severity: "urgent",
            message: `OFFLINE AI: ${next.title}; awaiting local cited interventions`,
          },
          "LOS",
        );
        setQueue(loadQueue());
      }
    },
    [link, opsMode, pushLog],
  );

  const applyIntervention = useCallback(
    (id: string) => {
      setAnomaly((prev) => {
        if (!prev) return prev;
        if (prev.applied.includes(id)) return prev;
        const applied = [...prev.applied, id];
        const item = prev.interventions.find((i) => i.id === id);
        pushLog(
          `Applying: ${item?.label ?? id} (cite ${item?.citation.id ?? "?"})`,
        );
        const receipt = createReceipt({
          kind: "engine",
          channel: "ai-action",
          summary: `Applied intervention: ${item?.label ?? id}`,
          payload: {
            interventionId: id,
            crewId: prev.crewId,
            citationId: item?.citation.id,
            citationSource: item?.citation.source,
          },
        });
        setReceipts(appendReceipt(receipt));
        const allDone = applied.length >= prev.interventions.length;
        if (allDone) {
          pushLog("Cited procedures applied. Monitoring vitals…");
        }
        return {
          ...prev,
          applied,
          phase: allDone ? "monitoring" : "applying",
          recovering: allDone ? true : prev.recovering,
        };
      });
    },
    [pushLog],
  );

  const applyAllInterventions = useCallback(() => {
    setAnomaly((prev) => {
      if (!prev) return prev;
      const applied = prev.interventions.map((i) => i.id);
      for (const i of prev.interventions) {
        if (!prev.applied.includes(i.id)) {
          pushLog(`Applying: ${i.label} (cite ${i.citation.id})`);
          setReceipts(
            appendReceipt(
              createReceipt({
                kind: "engine",
                channel: "ai-action",
                summary: `Applied intervention: ${i.label}`,
                payload: {
                  interventionId: i.id,
                  crewId: prev.crewId,
                  citationId: i.citation.id,
                  citationSource: i.citation.source,
                },
              }),
            ),
          );
        }
      }
      pushLog("Cited procedures applied. Monitoring vitals…");
      return { ...prev, applied, phase: "monitoring", recovering: true };
    });
    setRecoveryProgress(0.05);
  }, [pushLog]);

  const judgeTour = useCallback(() => {
    const steps: string[] = [];
    setTab("overview");
    steps.push("overview");
    setStormActive(true);
    steps.push("storm-on");
    setLosLink("LOS");
    setLinkState("LOS");
    setOpsMode("OFFLINE_LOCAL");
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
    setOpsMode("ONLINE_EARTH");
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

  type DemoStep = {
    id: string;
    title: string;
    caption: string;
    lookAt: string;
    focus: FocusZone;
    tab: TabId;
    run: () => void;
  };

  const demoSteps: DemoStep[] = useMemo(
    () => [
      {
        id: "cruise",
        title: "Deep-space transit",
        caption:
          "Crew in cruise. Earth AI + flight surgeons ONLINE. Vitals in normal band.",
        lookAt: "Look at D · Earth link (ONLINE) and C · Live floor (normal numbers).",
        focus: "earth",
        tab: "overview",
        run: () => {
          setAnomaly(null);
          setRecoveryProgress(0);
          setStormActive(false);
          setLink("AOS");
          setOpsMode("ONLINE_EARTH");
          pushLog("Mission demo start — Earth medical channel ONLINE.");
        },
      },
      {
        id: "storm",
        title: "Anomaly: dust storm / SPE",
        caption:
          "External anomaly detected. Radiation and environmental stress climbing.",
        lookAt: "Look at A · Mission strip (DUST/SPE) and C · Live floor dose rising.",
        focus: "strip",
        tab: "overview",
        run: () => setStorm(true),
      },
      {
        id: "los",
        title: "Earth link lost",
        caption:
          "Connection to Earth doctors/surgeons drops. PULSE switches to OFFLINE local AI.",
        lookAt: "Look at D · Earth link flipping to OFFLINE LOCAL AI.",
        focus: "earth",
        tab: "overview",
        run: () => setLink("LOS"),
      },
      {
        id: "vitals-anomaly",
        title: "Crew vital anomaly",
        caption:
          "Nova Reyes heart rate spikes above the mission band. Watch the vitals.",
        lookAt: "Look at C Live floor vitals climbing, then E for cited advice.",
        focus: "floor",
        tab: "vitals",
        run: () => triggerAnomaly("nova", "tachycardia"),
      },
      {
        id: "ai-advise",
        title: "Local AI cites next steps",
        caption:
          "Local AI names the problem and lists cited procedures only.",
        lookAt: "Look at E Local AI: problem line, citation IDs, Apply controls.",
        focus: "ai",
        tab: "vitals",
        run: () => pushLog("Local AI presenting cited standing orders."),
      },
      {
        id: "act",
        title: "Cited AI actions applied",
        caption:
          "Crew applies rest, fluids, and tighter heart-rate watch from citations.",
        lookAt: "Look at E Local AI as actions mark Applied, then monitoring.",
        focus: "ai",
        tab: "vitals",
        run: () => applyAllInterventions(),
      },
      {
        id: "recover",
        title: "Vitals normalizing",
        caption:
          "After cited procedures, monitoring continues until vitals are normal.",
        lookAt: "Look at C Live floor: heart rate and SpO2 return to normal.",
        focus: "floor",
        tab: "vitals",
        run: () => {
          setAnomaly((prev) =>
            prev
              ? {
                  ...prev,
                  recovering: true,
                  phase: "monitoring",
                  applied: prev.interventions.map((i) => i.id),
                }
              : prev,
          );
          setRecoveryProgress((p) => Math.max(p, 0.35));
          pushLog("Monitoring vitals after cited procedures…");
        },
      },
      {
        id: "aos",
        title: "Earth link restored",
        caption:
          "AOS returns. Offline receipts and escalations sync to Earth surgeons.",
        lookAt: "Look at D · Earth link back ONLINE and queue flushing.",
        focus: "earth",
        tab: "overview",
        run: () => {
          setStorm(false);
          setLink("AOS");
          setAnomaly(null);
          setRecoveryProgress(0);
        },
      },
      {
        id: "sources",
        title: "Cited & receipted",
        caption:
          "Nineteen sources remain open — official challenge resources first.",
        lookAt: "Open Rules & Sources tab for the citation wall.",
        focus: "floor",
        tab: "rules",
        run: () => pushLog("Mission demo complete."),
      },
    ],
    [applyAllInterventions, pushLog, setLink, setStorm, triggerAnomaly],
  );

  const applyDemoStep = useCallback(
    (index: number) => {
      const step = demoSteps[index];
      if (!step) {
        setDemoActive(false);
        setDemoTitle("Mission complete");
        setDemoCaption(
          "Offline local AI kept the crew safe until Earth link returned.",
        );
        return;
      }
      setDemoIndex(index);
      setDemoTitle(step.title);
      setDemoCaption(step.caption);
      setDemoLookAt(step.lookAt);
      setFocusZone(step.focus);
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
    setDemoLookAt("");
    setFocusZone("none");
  }, [clearDemoTimer]);

  const nextDemoStep = useCallback(() => {
    clearDemoTimer();
    const next = demoIndex + 1;
    if (next >= demoSteps.length) {
      stopDemo();
      setDemoTitle("Mission complete");
      setDemoCaption(
        "Offline local AI kept the crew safe until Earth link returned.",
      );
      return;
    }
    applyDemoStep(next);
  }, [applyDemoStep, clearDemoTimer, demoIndex, demoSteps.length, stopDemo]);

  const startDemo = useCallback(() => {
    clearDemoTimer();
    setDemoActive(true);
    applyDemoStep(0);
  }, [applyDemoStep, clearDemoTimer]);

  useEffect(() => {
    if (!demoActive) return;
    clearDemoTimer();
    // Give vitals / AI / recover beats more dwell so scroll + reading keep up.
    const longBeat = demoIndex >= 3 && demoIndex <= 6;
    const delay = longBeat ? 6200 : 4200;
    demoTimer.current = window.setTimeout(() => nextDemoStep(), delay);
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
    opsMode,
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
    anomaly,
    triggerAnomaly,
    applyIntervention,
    applyAllInterventions,
    demoActive,
    demoIndex,
    demoCaption,
    demoTitle,
    demoLookAt,
    focusZone,
    startDemo,
    stopDemo,
    nextDemoStep,
    missionLog,
  };

  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>;
}

export function usePulse() {
  const ctx = useContext(PulseContext);
  if (!ctx) throw new Error("usePulse must be used within PulseProvider");
  return ctx;
}
