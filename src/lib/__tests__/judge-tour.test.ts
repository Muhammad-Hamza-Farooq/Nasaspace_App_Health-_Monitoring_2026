import { describe, expect, it } from "vitest";
import { APP_SOURCES } from "@/data/sources";
import { evaluateBlind } from "@/lib/blind";
import { allCrewSnapshots } from "@/lib/sim";

/** Unattended happy-path invariants for the judge tour. */
describe("judge tour invariants", () => {
  it("core demo path is ready", () => {
    const snaps = allCrewSnapshots(0);
    expect(snaps).toHaveLength(4);
    expect(APP_SOURCES).toHaveLength(19);
    const blind = evaluateBlind({
      hr: Number.NaN,
      spo2: 98,
      tempC: 36.6,
      sbp: 120,
      dbp: 80,
    });
    expect(blind.ok).toBe(false);
  });
});
