export type Citation = {
  id: string;
  label: string;
  source: string;
};

export type Intervention = {
  id: string;
  label: string;
  detail: string;
  citation: Citation;
};

export type AnomalyKind =
  | "tachycardia"
  | "hypoxia"
  | "radiation_load"
  | "co2_stress"
  | "fever";

export type AnomalyPhase =
  | "detected"
  | "advising"
  | "applying"
  | "monitoring"
  | "normalized";

export type ActiveAnomaly = {
  crewId: string;
  kind: AnomalyKind;
  title: string;
  summary: string;
  problemLabel: string;
  interventions: Intervention[];
  applied: string[];
  recovering: boolean;
  phase: AnomalyPhase;
  datasetNote: string;
};

export const ANOMALY_PRESETS: Record<
  AnomalyKind,
  {
    title: string;
    summary: string;
    problemLabel: string;
    datasetNote: string;
    interventions: Intervention[];
    vitals: {
      hr: number;
      spo2: number;
      tempC: number;
      sbp: number;
      dbp: number;
      radiationMsvDay?: number;
      co2MmHg?: number;
      mood?: number;
    };
  }
> = {
  tachycardia: {
    title: "High heart rate spike",
    summary:
      "Heart rate elevated above mission band. Local advisor grounds actions in cited standing orders only.",
    problemLabel: "Problem: tachycardia (HR above mission watch band)",
    datasetNote:
      "Grounded on NASA HRP cardiovascular risk notes + Inspiration4 / OSDR derived vitals (simulated).",
    vitals: { hr: 128, spo2: 95, tempC: 37.4, sbp: 148, dbp: 92, mood: 3.5 },
    interventions: [
      {
        id: "rest",
        label: "Ordered rest cycle",
        detail: "Stop EVA prep; 10 min seated recovery with breathing protocol.",
        citation: {
          id: "HRP-CV-01",
          label: "HRP cardiovascular watch",
          source: "NASA Human Research Program: cardiovascular risk overview",
        },
      },
      {
        id: "fluids",
        label: "Fluid + electrolyte",
        detail: "Administer oral rehydration per CMO standing order.",
        citation: {
          id: "CMO-SO-12",
          label: "CMO standing order 12",
          source: "Crew Medical Officer standing orders (demo placeholder)",
        },
      },
      {
        id: "monitor",
        label: "Tighten HR watch",
        detail: "Increase vitals sampling to 15s; alert if HR stays >110 for 3 min.",
        citation: {
          id: "HRP-MON-03",
          label: "HRP monitoring interval",
          source: "NASA HRP: crew health monitoring guidance (cited locally)",
        },
      },
    ],
  },
  fever: {
    title: "Elevated core temperature",
    summary:
      "Temperature above mission comfort band. Local advisor only proposes cited cooling and watch steps.",
    problemLabel: "Problem: fever / thermal load (temp above mission band)",
    datasetNote:
      "Grounded on NASA HRP thermal/EVA physiology notes + simulated cabin telemetry.",
    vitals: { hr: 110, spo2: 96, tempC: 38.6, sbp: 136, dbp: 86, mood: 3.8 },
    interventions: [
      {
        id: "cool",
        label: "Cooling protocol",
        detail: "Reduce workload; increase liquid cooling garment set point.",
        citation: {
          id: "HRP-TH-02",
          label: "HRP thermal protocol",
          source: "NASA HRP: thermal stress and EVA physiology notes",
        },
      },
      {
        id: "fluids-fever",
        label: "Hydration check",
        detail: "Confirm fluid intake; start oral electrolytes if deficit flagged.",
        citation: {
          id: "CMO-SO-08",
          label: "CMO standing order 08",
          source: "Crew Medical Officer standing orders (demo placeholder)",
        },
      },
      {
        id: "temp-watch",
        label: "Tighten temp watch",
        detail: "Sample core temp every 30s until back under 37.5 C.",
        citation: {
          id: "HRP-MON-07",
          label: "HRP fever watch",
          source: "NASA HRP: febrile illness monitoring notes (cited locally)",
        },
      },
    ],
  },
  hypoxia: {
    title: "Low oxygen saturation",
    summary: "SpO2 trending down. Check suit and cabin O2 path with cited steps only.",
    problemLabel: "Problem: hypoxia (SpO2 below mission watch band)",
    datasetNote: "Grounded on NASA ECLSS / HRP hypoxia notes (simulated stream).",
    vitals: { hr: 98, spo2: 89, tempC: 36.9, sbp: 122, dbp: 78 },
    interventions: [
      {
        id: "o2",
        label: "Supplemental O2",
        detail: "Mask O2 at protocol flow until SpO2 is at least 95%.",
        citation: {
          id: "HRP-OX-01",
          label: "HRP oxygen protocol",
          source: "NASA HRP: hypoxia response guidance",
        },
      },
      {
        id: "cabin",
        label: "Verify cabin O2 scrubbers",
        detail: "Confirm ECLSS loop; escalate if scrubber delta-P abnormal.",
        citation: {
          id: "ECLSS-04",
          label: "ECLSS check 04",
          source: "Cabin atmosphere contingency checklist (demo citation)",
        },
      },
    ],
  },
  radiation_load: {
    title: "Radiation dose surge",
    summary: "SPE-linked personal dose climbing past demo watch band.",
    problemLabel: "Problem: radiation load above watch band",
    datasetNote: "Grounded on CSA radiation discipline + NASA DONKI storm replay (simulated).",
    vitals: {
      hr: 88,
      spo2: 96,
      tempC: 36.7,
      sbp: 125,
      dbp: 80,
      radiationMsvDay: 1.65,
    },
    interventions: [
      {
        id: "shelter",
        label: "Move to storm shelter",
        detail: "Relocate crew to highest-shielding module until SPE decays.",
        citation: {
          id: "CSA-RAD-01",
          label: "CSA radiation shelter",
          source: "Canadian Space Agency: radiation protection notes",
        },
      },
      {
        id: "dose-log",
        label: "Log dose event",
        detail: "Receipt personal and area dosimetry for Earth SRAG sync on AOS.",
        citation: {
          id: "DONKI-EVT",
          label: "DONKI event receipt",
          source: "NASA DONKI space weather event record (replayed)",
        },
      },
    ],
  },
  co2_stress: {
    title: "Cabin CO2 elevation",
    summary: "Closed-environment CO2 above demo watch: cognitive and HR risk.",
    problemLabel: "Problem: cabin CO2 above mission band",
    datasetNote: "Grounded on NASA ECLSS CO2 limits (simulated).",
    vitals: {
      hr: 95,
      spo2: 96,
      tempC: 36.8,
      sbp: 130,
      dbp: 84,
      co2MmHg: 5.4,
      mood: 4,
    },
    interventions: [
      {
        id: "scrub",
        label: "Boost CO2 scrubbing",
        detail: "Increase scrubber duty cycle; reduce cabin occupancy.",
        citation: {
          id: "ECLSS-CO2",
          label: "ECLSS CO2 response",
          source: "NASA ECLSS CO2 contingency notes",
        },
      },
      {
        id: "vent",
        label: "Activity pause",
        detail: "Suspend high-metabolic tasks until CO2 is under 4.0 mmHg.",
        citation: {
          id: "HRP-CO2-02",
          label: "HRP CO2 cognition note",
          source: "NASA HRP: CO2 and cognitive performance notes",
        },
      },
    ],
  },
};

/** Offline local model posture shown in UI (honest prototype claim). */
export const LOCAL_MODEL_POSTURE = {
  name: "Crew-local citation RAG (target)",
  params: "7B to 8B class (Q4), e.g. Qwen2.5-7B or Llama 3.1 8B via Ollama",
  devices:
    "Crew laptop / module workstation: ~8 GB VRAM GPU, or CPU-only with ~32 GB RAM",
  fineTune:
    "LoRA fine-tune on NASA HRP, CSA, and OSDR derived Q&A; refuse answers without a retrieved citation",
  ragBetter:
    "Prefer citation-enforced Agentic RAG (retrieve → rerank → cite → verify) over stuffing a raw context window. GraphRAG helps when sources are linked (HRP risks ↔ countermeasures).",
  datasets: "NASA OSDR / Inspiration4 derived vitals, NASA DONKI storms, NASA HRP + CSA citations in-app",
};

export function buildAnomaly(crewId: string, kind: AnomalyKind): ActiveAnomaly {
  const preset = ANOMALY_PRESETS[kind];
  return {
    crewId,
    kind,
    title: preset.title,
    summary: preset.summary,
    problemLabel: preset.problemLabel,
    interventions: preset.interventions,
    applied: [],
    recovering: false,
    phase: "advising",
    datasetNote: preset.datasetNote,
  };
}
