import { CREW, type CrewMember } from "@/data/crew";
import type { VitalSample } from "@/lib/blind";

export type CrewSnapshot = {
  crewId: string;
  name: string;
  role: string;
  tick: number;
  vitals: Required<VitalSample>;
  radiationMsvDay: number;
  co2MmHg: number;
  sleepHours: number;
  exerciseMin: number;
  mood: number;
  stormBoost: number;
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Deterministic seeded vital streams for the four fictional crew. */
export function snapshotAt(
  crew: CrewMember,
  tick: number,
  stormBoost = 0,
): CrewSnapshot {
  const rnd = mulberry32(crew.seed + tick * 997);
  const baseHr = 62 + (crew.age % 10);
  const vitals = {
    hr: Math.round(clamp(baseHr + Math.sin(tick / 8) * 8 + rnd() * 4, 48, 110)),
    spo2: Math.round(clamp(97 + Math.sin(tick / 15) * 1.2 - rnd() * 0.8, 92, 99) * 10) / 10,
    tempC: Math.round(clamp(36.5 + Math.sin(tick / 20) * 0.2 + rnd() * 0.1, 36.1, 37.4) * 10) / 10,
    sbp: Math.round(clamp(118 + Math.sin(tick / 12) * 6 + rnd() * 3, 100, 145)),
    dbp: Math.round(clamp(74 + Math.sin(tick / 14) * 4 + rnd() * 2, 60, 95)),
  };
  const radiationMsvDay =
    Math.round(
      clamp(0.35 + rnd() * 0.15 + stormBoost * 0.55, 0.2, 2.5) * 100,
    ) / 100;
  return {
    crewId: crew.id,
    name: crew.name,
    role: crew.role,
    tick,
    vitals,
    radiationMsvDay,
    co2MmHg: Math.round(clamp(3.2 + Math.sin(tick / 18) * 0.6 + rnd() * 0.3, 2.5, 5.5) * 10) / 10,
    sleepHours: Math.round(clamp(7.2 + Math.sin(tick / 40) * 0.8 - rnd() * 0.4, 5.5, 9) * 10) / 10,
    exerciseMin: Math.round(clamp(45 + Math.sin(tick / 25) * 15 + rnd() * 10, 0, 90)),
    mood: Math.round(clamp(6.5 + Math.sin(tick / 30) * 1.2 - rnd() * 0.5, 3, 9) * 10) / 10,
    stormBoost,
  };
}

export function allCrewSnapshots(tick: number, stormBoost = 0): CrewSnapshot[] {
  return CREW.map((c) => snapshotAt(c, tick, stormBoost));
}
