/** Honest demo device map: what gathers vitals vs what runs local AI. */

export const VITALS_DEVICES = [
  {
    id: "wearable",
    name: "Crew wearable",
    measures: "HR, SpO2, skin temperature",
  },
  {
    id: "bp",
    name: "Blood pressure cuff",
    measures: "SBP / DBP",
  },
  {
    id: "actigraphy",
    name: "Actigraphy watch",
    measures: "Sleep and activity",
  },
  {
    id: "dosimeter",
    name: "Personal dosimeter",
    measures: "Radiation dose rate",
  },
  {
    id: "cabin-co2",
    name: "Cabin CO2 sensor",
    measures: "Ambient CO2",
  },
  {
    id: "poc",
    name: "Onboard kit (as needed)",
    measures: "Ultrasound / point-of-care blood",
  },
] as const;

export const LOCAL_AI_DEVICES = [
  {
    id: "workstation",
    name: "Crew laptop / module workstation",
    role: "Runs offline model + citation RAG",
  },
  {
    id: "model",
    name: "7B–8B class model (Q4 via Ollama)",
    role: "Explains receipted findings; refuses without citation",
  },
  {
    id: "store",
    name: "Local vector store",
    role: "NASA HRP / CSA / standing-order chunks",
  },
] as const;

/** Real-world offline windows used in demo captions (sources: NOAA SWPC, NASA Mars). */
export const LINK_OUTAGE_RANGES = {
  flareHf: {
    label: "Flare HF radio blackout",
    min: "a few minutes",
    max: "several hours (R5)",
  },
  marsConjunction: {
    label: "Mars solar conjunction",
    min: "~2 days hard occultation",
    max: "~2 weeks command pause (up to ~3 weeks in some profiles)",
  },
} as const;
