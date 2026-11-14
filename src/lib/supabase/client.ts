import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}

/** Optional best-effort sync — demo works fully offline without this. */
export async function syncReceiptToSupabase(receipt: {
  id: string;
  kind: string;
  channel: string;
  summary: string;
  payload?: Record<string, unknown>;
  at: string;
}) {
  const sb = getSupabase();
  if (!sb) return { ok: false as const, reason: "no-client" };
  const { error } = await sb.from("receipts").insert({
    id: receipt.id,
    kind: receipt.kind,
    channel: receipt.channel,
    summary: receipt.summary,
    payload: receipt.payload ?? {},
    created_at: receipt.at,
  });
  if (error) return { ok: false as const, reason: error.message };
  return { ok: true as const };
}
