export type Receipt = {
  id: string;
  at: string;
  kind: "engine" | "threshold" | "escalation" | "sync" | "mood" | "blind";
  channel: string;
  summary: string;
  payload?: Record<string, unknown>;
};

const STORAGE_KEY = "pulse.receipts.v1";

let seq = 0;
function uid() {
  seq += 1;
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  return `rcpt_${Date.now().toString(36)}_${seq}_${rand}`;
}

export function createReceipt(
  input: Omit<Receipt, "id" | "at"> & { at?: string },
): Receipt {
  return {
    id: uid(),
    at: input.at ?? new Date().toISOString(),
    kind: input.kind,
    channel: input.channel,
    summary: input.summary,
    payload: input.payload,
  };
}

export function loadReceipts(): Receipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Receipt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReceipts(list: Receipt[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 500)));
}

export function appendReceipt(receipt: Receipt, existing?: Receipt[]): Receipt[] {
  const base = existing ?? loadReceipts();
  if (base.some((r) => r.id === receipt.id)) {
    saveReceipts(base);
    return base;
  }
  const next = [receipt, ...base].slice(0, 500);
  saveReceipts(next);
  return next;
}
