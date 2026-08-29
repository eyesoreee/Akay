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
