import { describe, expect, it } from "vitest";
import { APP_SOURCES, OFFICIAL_SOURCE_IDS } from "@/data/sources";
import { allCrewSnapshots, snapshotAt } from "@/lib/sim";
import { CREW } from "@/data/crew";

describe("sim + sources integration", () => {
  it("seeded sim is deterministic", () => {
    const a = snapshotAt(CREW[0], 10, 0);
    const b = snapshotAt(CREW[0], 10, 0);
    expect(a.vitals).toEqual(b.vitals);
    expect(a.radiationMsvDay).toBe(b.radiationMsvDay);
  });

  it("returns four crew snapshots", () => {
    expect(allCrewSnapshots(1)).toHaveLength(4);
  });

  it("has exactly 19 in-app sources including official 21–25", () => {
    expect(APP_SOURCES).toHaveLength(19);
    for (const id of OFFICIAL_SOURCE_IDS) {
      expect(APP_SOURCES.some((s) => s.id === id && s.officialChallenge)).toBe(true);
    }
  });
});
