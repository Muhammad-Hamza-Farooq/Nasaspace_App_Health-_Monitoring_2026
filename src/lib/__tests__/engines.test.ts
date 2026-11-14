import { describe, expect, it } from "vitest";
import {
  runMoodEngine,
  runRadiationEngine,
  runVitalsEngine,
} from "@/lib/engines";
import { DEFAULT_THRESHOLDS } from "@/lib/thresholds";

describe("engines", () => {
  it("emits a receipt for vitals", () => {
    const f = runVitalsEngine(
      { hr: 72, spo2: 98, tempC: 36.6, sbp: 118, dbp: 76 },
      DEFAULT_THRESHOLDS,
    );
    expect(f.receipt.kind).toBe("engine");
    expect(f.receipt.channel).toBe("vitals");
    expect(f.level).toBe("nominal");
  });

  it("BLIND finding has blind receipt", () => {
    const f = runVitalsEngine(
      { hr: Number.NaN, spo2: 98, tempC: 36.6, sbp: 118, dbp: 76 },
      DEFAULT_THRESHOLDS,
    );
    expect(f.level).toBe("blind");
    expect(f.receipt.kind).toBe("blind");
  });

  it("radiation labels demo placeholder in payload", () => {
    const f = runRadiationEngine(1.2, DEFAULT_THRESHOLDS);
    expect(f.receipt.payload?.demoPlaceholder).toBe(true);
    expect(f.level).toBe("alert");
  });

  it("mood engine receipts check-in", () => {
    const f = runMoodEngine(3);
    expect(f.receipt.kind).toBe("mood");
    expect(f.level).toBe("alert");
  });
});
