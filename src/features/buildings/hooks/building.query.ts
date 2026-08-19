import { useQuery } from "@tanstack/react-query";
import { getBuilding, getBuildings } from "../api/building.api";

export function useBuildings() {
  return useQuery({
    queryKey: ["Building"],
    queryFn: getBuildings,
  });
}

export function useBuidling(id: string) {
  return useQuery({
    queryKey: ["building", id],
    queryFn: () => getBuilding(id),
    enabled: !!id,
  });
}
