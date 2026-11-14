import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_THRESHOLDS, saveThresholds } from "@/lib/thresholds";

const store = new Map<string, string>();

describe("threshold edits", () => {
  beforeEach(() => {
    store.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
        removeItem: (k: string) => store.delete(k),
      },
    });
  });

  it("creates a threshold receipt", () => {
    const next = { ...DEFAULT_THRESHOLDS, hrMax: 105 };
    const { receipt } = saveThresholds(next, "hrMax", DEFAULT_THRESHOLDS.hrMax);
    expect(receipt.kind).toBe("threshold");
    expect(receipt.summary).toContain("hrMax");
  });
});
