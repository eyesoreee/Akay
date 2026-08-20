import { getSupabase } from "@/lib/supabase";
import { Building } from "../types/building.entity";

export async function getBuildings(): Promise<Building[]> {
  const { data, error } = await getSupabase().from("Building").select("*");

  if (error) {
    console.log(`Fetching BUILDINGS failed: ${error.message}`);
    throw new Error(error.message);
  }
  return data;
}

export async function getBuilding(id: string): Promise<Building | null> {
  const { data, error } = await getSupabase()
    .from("Building")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.log(`Fetching BUILDING[${id}] failed: ${error.message}`);
    throw new Error(error.message);
  }

  return data;
}
