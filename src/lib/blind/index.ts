export type VitalSample = {
  hr?: number | null;
  spo2?: number | null;
  tempC?: number | null;
  sbp?: number | null;
  dbp?: number | null;
};

export type CleanVitals = {
  hr: number;
  spo2: number;
  tempC: number;
  sbp: number;
  dbp: number;
};

export type BlindResult =
  | { ok: true; sample: CleanVitals }
  | { ok: false; reason: string; code: "BLIND" };

const RANGES = {
  hr: { min: 20, max: 220 },
  spo2: { min: 50, max: 100 },
  tempC: { min: 30, max: 43 },
  sbp: { min: 60, max: 250 },
  dbp: { min: 30, max: 160 },
} as const;

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/** BLIND quality gate — refuses bad/missing sensor data. */
export function evaluateBlind(sample: VitalSample): BlindResult {
  const fields: (keyof typeof RANGES)[] = ["hr", "spo2", "tempC", "sbp", "dbp"];
  for (const key of fields) {
    const value = sample[key];
    if (value === null || value === undefined || Number.isNaN(value as number)) {
      return { ok: false, code: "BLIND", reason: `Missing or NaN: ${key}` };
    }
    if (!isFiniteNumber(value)) {
      return { ok: false, code: "BLIND", reason: `Non-finite: ${key}` };
    }
    const { min, max } = RANGES[key];
    if (value < min || value > max) {
      return {
        ok: false,
        code: "BLIND",
        reason: `Out of range ${key}=${value} (allowed ${min}–${max})`,
      };
    }
  }
  return {
    ok: true,
    sample: {
      hr: sample.hr as number,
      spo2: sample.spo2 as number,
      tempC: sample.tempC as number,
      sbp: sample.sbp as number,
      dbp: sample.dbp as number,
    },
  };
}
