import { useQuery } from "@powersync/react";
import { Building } from "../types/building.entity";

export function useBuildings() {
  return useQuery<Building>("SELECT * FROM Building");
}

export function useBuilding(id: string) {
  return useQuery<Building>("SELECT * FROM Building WHERE id = ?", [id], {
    runQueryOnce: true,
  });
}
