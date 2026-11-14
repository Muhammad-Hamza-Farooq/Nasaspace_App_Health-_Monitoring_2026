export type TelemetryPoint = {
  t: number;
  hr: number;
  spo2: number;
  tempC: number;
  sbp: number;
  dbp: number;
  radiationMsvDay: number;
  co2MmHg: number;
  sleepHours: number;
  exerciseMin: number;
  mood: number;
};

export const HISTORY_LEN = 40;
