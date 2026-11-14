import { appendReceipt, createReceipt, type Receipt } from "@/lib/receipts";

export type LinkState = "AOS" | "LOS";

export type Escalation = {
  id: string;
  createdAt: string;
  crewId: string;
  severity: "advisory" | "watch" | "urgent";
  message: string;
  status: "QUEUED-FS" | "FLUSHED" | "OPEN";
  syncReceiptId?: string;
};

const QUEUE_KEY = "pulse.los.queue.v1";
const LINK_KEY = "pulse.los.link.v1";

function uid() {
  return `esc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadLinkState(): LinkState {
  if (typeof window === "undefined") return "AOS";
  return (window.localStorage.getItem(LINK_KEY) as LinkState) || "AOS";
}

export function saveLinkState(state: LinkState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LINK_KEY, state);
}

export function loadQueue(): Escalation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Escalation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveQueue(queue: Escalation[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/** While LOS, escalations are queued as QUEUED-FS (flight surgeon store-forward). */
export function enqueueEscalation(
  input: Omit<Escalation, "id" | "createdAt" | "status">,
  link: LinkState,
): { escalation: Escalation; receipt: Receipt } {
  const escalation: Escalation = {
    id: uid(),
    createdAt: new Date().toISOString(),
    crewId: input.crewId,
    severity: input.severity,
    message: input.message,
    status: link === "LOS" ? "QUEUED-FS" : "OPEN",
  };
  const queue = loadQueue();
  queue.unshift(escalation);
  saveQueue(queue);

  const receipt = createReceipt({
    kind: "escalation",
    channel: "los",
    summary:
      link === "LOS"
        ? `QUEUED-FS: ${escalation.message}`
        : `OPEN escalation: ${escalation.message}`,
    payload: { escalationId: escalation.id, status: escalation.status, link },
  });
  appendReceipt(receipt);
  return { escalation, receipt };
}

/** On AOS, flush QUEUED-FS items and emit sync receipts. */
export function flushQueueOnAos(): { flushed: Escalation[]; receipts: Receipt[] } {
  const queue = loadQueue();
  const receipts: Receipt[] = [];
  const flushed: Escalation[] = [];
  const next = queue.map((item) => {
    if (item.status !== "QUEUED-FS") return item;
    const sync = createReceipt({
      kind: "sync",
      channel: "los",
      summary: `AOS flush sync for ${item.id}`,
      payload: { escalationId: item.id },
    });
    appendReceipt(sync);
    receipts.push(sync);
    const updated = { ...item, status: "FLUSHED" as const, syncReceiptId: sync.id };
    flushed.push(updated);
    return updated;
  });
  saveQueue(next);
  saveLinkState("AOS");
  return { flushed, receipts };
}

export function setLinkState(state: LinkState): LinkState {
  saveLinkState(state);
  if (state === "AOS") {
    flushQueueOnAos();
  }
  return state;
}
