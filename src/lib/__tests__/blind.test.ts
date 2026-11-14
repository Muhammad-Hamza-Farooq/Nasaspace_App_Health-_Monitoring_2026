import { describe, expect, it } from "vitest";
import { evaluateBlind } from "@/lib/blind";

describe("BLIND gate", () => {
  it("accepts a normal sample", () => {
    const r = evaluateBlind({
      hr: 72,
      spo2: 98,
      tempC: 36.6,
      sbp: 118,
      dbp: 76,
    });
    expect(r.ok).toBe(true);
  });

  it("rejects null", () => {
    const r = evaluateBlind({
      hr: null,
      spo2: 98,
      tempC: 36.6,
      sbp: 118,
      dbp: 76,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("BLIND");
  });

  it("rejects NaN", () => {
    const r = evaluateBlind({
      hr: Number.NaN,
      spo2: 98,
      tempC: 36.6,
      sbp: 118,
      dbp: 76,
    });
    expect(r.ok).toBe(false);
  });

  it("rejects out-of-range", () => {
    const r = evaluateBlind({
      hr: 300,
      spo2: 98,
      tempC: 36.6,
      sbp: 118,
      dbp: 76,
    });
    expect(r.ok).toBe(false);
  });
});
