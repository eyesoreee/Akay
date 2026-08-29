import { Building } from "@/features/buildings/types/building.entity";
import { getDatabase } from "./database";

interface BuildingRow {
  id: string;
  name: string;
  type: string;
  description: string | null;
  latitude: number;
  longitude: number;
  created_at: string | null;
  updated_at: string | null;
}

function rowToBuilding(row: BuildingRow): Building {
  return {
    id: row.id,
    name: row.name,
    type: row.type as Building["type"],
    description: row.description ?? undefined,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
  };
}

export async function getAllBuildings(): Promise<Building[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<BuildingRow>("SELECT * FROM buildings");
  console.log(`[Repo] Fetched ${rows.length} buildings from local`);
  return rows.map(rowToBuilding);
}

export async function upsertBuildings(buildings: Building[]): Promise<void> {
  const db = await getDatabase();
  console.log(`[Repo] Upserting ${buildings.length} buildings to local...`);
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.execAsync("DELETE FROM buildings");
    for (const b of buildings) {
      await txn.runAsync(
        "INSERT INTO buildings (id, name, type, description, latitude, longitude, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        b.id,
        b.name,
        b.type,
        b.description ?? null,
        b.latitude,
        b.longitude,
        b.createdAt instanceof Date ? b.createdAt.toISOString() : null,
        b.updatedAt instanceof Date ? b.updatedAt.toISOString() : null,
      );
    }
  });
  console.log(`[Repo] Upsert complete — ${buildings.length} buildings stored`);
}
