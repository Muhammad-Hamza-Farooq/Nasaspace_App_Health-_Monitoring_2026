import { appendReceipt, createReceipt, type Receipt } from "@/lib/receipts";

export type Thresholds = {
  hrMin: number;
  hrMax: number;
  spo2Watch: number;
  feverC: number;
  sbpMax: number;
  dbpMax: number;
  radiationMsvDay: number;
  co2MmHg: number;
  sleepMin: number;
  sleepMax: number;
};

export const DEFAULT_THRESHOLDS: Thresholds = {
  hrMin: 40,
  hrMax: 100,
  spo2Watch: 94,
  feverC: 38.0,
  sbpMax: 140,
  dbpMax: 90,
  /** Demo placeholder — not a public NASA daily limit. */
  radiationMsvDay: 1.0,
  /** Commonly cited ISS guideline — demo default. */
  co2MmHg: 4.0,
  sleepMin: 7,
  sleepMax: 9,
};

const KEY = "pulse.thresholds.v1";

export function loadThresholds(): Thresholds {
  if (typeof window === "undefined") return { ...DEFAULT_THRESHOLDS };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_THRESHOLDS };
    return { ...DEFAULT_THRESHOLDS, ...(JSON.parse(raw) as Partial<Thresholds>) };
  } catch {
    return { ...DEFAULT_THRESHOLDS };
  }
}

export function saveThresholds(
  next: Thresholds,
  changedKey: keyof Thresholds,
  previous: number,
): { thresholds: Thresholds; receipt: Receipt } {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  const receipt = createReceipt({
    kind: "threshold",
    channel: "rules",
    summary: `Threshold ${changedKey}: ${previous} → ${next[changedKey]} (receipted)`,
    payload: { key: changedKey, from: previous, to: next[changedKey] },
  });
  appendReceipt(receipt);
  return { thresholds: next, receipt };
}
