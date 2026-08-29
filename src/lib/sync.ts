import * as Network from "expo-network";

import { upsertBuildings } from "@/db/building.repo";
import { getBuildings } from "@/features/buildings/api/building.api";

export async function isOnline(): Promise<boolean> {
  const state = await Network.getNetworkStateAsync();
  return state.isConnected === true && state.isInternetReachable !== false;
}

export async function syncBuildings(): Promise<void> {
  const remote = await getBuildings();
  await upsertBuildings(remote);
}
