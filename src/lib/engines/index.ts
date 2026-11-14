import { evaluateBlind, type VitalSample } from "@/lib/blind";
import { createReceipt, type Receipt } from "@/lib/receipts";
import type { Thresholds } from "@/lib/thresholds";

export type EngineFinding = {
  channel: string;
  level: "nominal" | "watch" | "alert" | "blind";
  message: string;
  receipt: Receipt;
};

export function runVitalsEngine(
  sample: VitalSample,
  thresholds: Thresholds,
): EngineFinding {
  const blind = evaluateBlind(sample);
  if (!blind.ok) {
    const receipt = createReceipt({
      kind: "blind",
      channel: "vitals",
      summary: `BLIND refused sample: ${blind.reason}`,
      payload: { reason: blind.reason },
    });
    return { channel: "vitals", level: "blind", message: receipt.summary, receipt };
  }
  const v = blind.sample;
  let level: EngineFinding["level"] = "nominal";
  const notes: string[] = [];
  if (v.hr < thresholds.hrMin || v.hr > thresholds.hrMax) {
    level = "alert";
    notes.push(`HR ${v.hr} outside ${thresholds.hrMin}–${thresholds.hrMax}`);
  }
  if (v.spo2 < thresholds.spo2Watch) {
    level = level === "alert" ? "alert" : "watch";
    notes.push(`SpO₂ ${v.spo2}% below ${thresholds.spo2Watch}%`);
  }
  if (v.tempC >= thresholds.feverC) {
    level = "alert";
    notes.push(`Temp ${v.tempC}°C ≥ fever ${thresholds.feverC}°C`);
  }
  const message =
    notes.length === 0 ? `Vitals nominal (HR ${v.hr}, SpO₂ ${v.spo2}%)` : notes.join("; ");
  const receipt = createReceipt({
    kind: "engine",
    channel: "vitals",
    summary: message,
    payload: { ...v, level },
  });
  return { channel: "vitals", level, message, receipt };
}

export function runRadiationEngine(
  msvDay: number,
  thresholds: Thresholds,
): EngineFinding {
  const level =
    msvDay >= thresholds.radiationMsvDay
      ? "alert"
      : msvDay >= thresholds.radiationMsvDay * 0.7
        ? "watch"
        : "nominal";
  const message = `Dose ${msvDay} mSv/day (demo limit ${thresholds.radiationMsvDay} mSv/day — placeholder)`;
  const receipt = createReceipt({
    kind: "engine",
    channel: "radiation",
    summary: message,
    payload: { msvDay, level, demoPlaceholder: true },
  });
  return { channel: "radiation", level, message, receipt };
}

export function runCabinEngine(co2MmHg: number, thresholds: Thresholds): EngineFinding {
  const level =
    co2MmHg >= thresholds.co2MmHg
      ? "alert"
      : co2MmHg >= thresholds.co2MmHg * 0.85
        ? "watch"
        : "nominal";
  const message = `Cabin CO₂ ${co2MmHg} mmHg (demo default limit ${thresholds.co2MmHg})`;
  const receipt = createReceipt({
    kind: "engine",
    channel: "co2",
    summary: message,
    payload: { co2MmHg, level },
  });
  return { channel: "co2", level, message, receipt };
}

export function runSleepEngine(hours: number, thresholds: Thresholds): EngineFinding {
  const level =
    hours < thresholds.sleepMin || hours > thresholds.sleepMax ? "watch" : "nominal";
  const message = `Sleep ${hours} h (target ${thresholds.sleepMin}–${thresholds.sleepMax} h)`;
  const receipt = createReceipt({
    kind: "engine",
    channel: "sleep",
    summary: message,
    payload: { hours, level },
  });
  return { channel: "sleep", level, message, receipt };
}

export function runMoodEngine(score: number): EngineFinding {
  const level = score < 4 ? "alert" : score < 5.5 ? "watch" : "nominal";
  const message = `Mood check-in score ${score}/10`;
  const receipt = createReceipt({
    kind: "mood",
    channel: "mood",
    summary: message,
    payload: { score, level },
  });
  return { channel: "mood", level, message, receipt };
}
