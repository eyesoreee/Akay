import { getDatabase } from "./database";

const INITIAL_SYNC_KEY = "initialSyncComplete";

async function getMeta(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = ?",
    key,
  );
  return row?.value ?? null;
}

async function setMeta(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO app_meta (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    key,
    value,
  );
}

export async function hasCompletedInitialSync(): Promise<boolean> {
  return (await getMeta(INITIAL_SYNC_KEY)) === "1";
}

export async function completeInitialSync(): Promise<void> {
  await setMeta(INITIAL_SYNC_KEY, "1");
}
