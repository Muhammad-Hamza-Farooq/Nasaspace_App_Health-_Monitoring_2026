import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, string>();

describe("LOS/AOS queue", () => {
  beforeEach(() => {
    store.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
      },
    });
  });

  it("queues QUEUED-FS on LOS and flushes on AOS with sync receipt", async () => {
    const los = await import("@/lib/los");
    los.saveLinkState("LOS");
    const { escalation } = los.enqueueEscalation(
      {
        crewId: "nova",
        severity: "urgent",
        message: "Test escalation",
      },
      "LOS",
    );
    expect(escalation.status).toBe("QUEUED-FS");
    const { flushed, receipts } = los.flushQueueOnAos();
    expect(flushed.some((e) => e.id === escalation.id && e.status === "FLUSHED")).toBe(
      true,
    );
    expect(receipts.some((r) => r.kind === "sync")).toBe(true);
  });
});
