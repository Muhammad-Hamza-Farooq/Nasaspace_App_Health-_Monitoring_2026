export type Intervention = {
  id: string;
  label: string;
  detail: string;
};

export type AnomalyKind =
  | "tachycardia"
  | "hypoxia"
  | "radiation_load"
  | "co2_stress";

export type ActiveAnomaly = {
  crewId: string;
  kind: AnomalyKind;
  title: string;
  summary: string;
  interventions: Intervention[];
  applied: string[];
  recovering: boolean;
};

export const ANOMALY_PRESETS: Record<
  AnomalyKind,
  {
    title: string;
    summary: string;
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
    title: "Tachycardia / stress load",
    summary:
      "Heart rate elevated above mission band. Likely storm stress + workload.",
    vitals: { hr: 128, spo2: 95, tempC: 37.4, sbp: 148, dbp: 92, mood: 3.5 },
    interventions: [
      {
        id: "rest",
        label: "Ordered rest cycle",
        detail: "Stop EVA prep; 10 min seated recovery with breathing protocol.",
      },
      {
        id: "fluids",
        label: "Fluid + electrolyte",
        detail: "Administer oral rehydration per CMO standing order.",
      },
      {
        id: "monitor",
        label: "Tighten HR watch",
        detail: "Increase vitals sampling to 15s; alert if HR stays >110 for 3 min.",
      },
    ],
  },
  hypoxia: {
    title: "SpO₂ depression",
    summary: "Oxygen saturation trending down — check suit/cabin O₂ path.",
    vitals: { hr: 98, spo2: 89, tempC: 36.9, sbp: 122, dbp: 78 },
    interventions: [
      {
        id: "o2",
        label: "Supplemental O₂",
        detail: "Mask O₂ at protocol flow until SpO₂ ≥ 95%.",
      },
      {
        id: "cabin",
        label: "Verify cabin O₂ / CO₂ scrubbers",
        detail: "Confirm ECLSS loop; escalate if scrubber ΔP abnormal.",
      },
    ],
  },
  radiation_load: {
    title: "Radiation dose surge",
    summary: "SPE-linked personal dose climbing past demo watch band.",
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
      },
      {
        id: "dose-log",
        label: "Log dose event",
        detail: "Receipt personal + area dosimetry for Earth SRAG sync on AOS.",
      },
    ],
  },
  co2_stress: {
    title: "Cabin CO₂ elevation",
    summary: "Closed-environment CO₂ above demo watch — cognitive/HR risk.",
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
        label: "Boost CO₂ scrubbing",
        detail: "Increase LiOH / scrubber duty cycle; reduce cabin occupancy.",
      },
      {
        id: "vent",
        label: "Activity pause",
        detail: "Suspend high-metabolic tasks until CO₂ < 4.0 mmHg.",
      },
    ],
  },
};

export function buildAnomaly(crewId: string, kind: AnomalyKind): ActiveAnomaly {
  const preset = ANOMALY_PRESETS[kind];
  return {
    crewId,
    kind,
    title: preset.title,
    summary: preset.summary,
    interventions: preset.interventions,
    applied: [],
    recovering: false,
  };
}
