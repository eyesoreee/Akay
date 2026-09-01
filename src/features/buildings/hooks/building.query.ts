import { getAllBuildings } from "@/db/building.repo";
import { useQuery } from "@tanstack/react-query";

export function useBuildings() {
  return useQuery({
    queryKey: ["Building"],
    queryFn: getAllBuildings,
    staleTime: 5 * 60 * 1000,
  });
}
