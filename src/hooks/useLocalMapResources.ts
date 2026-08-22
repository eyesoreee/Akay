import { useEffect, useState } from "react";

import { MapResources } from "@/types/MapResources";
import { prepareLocalMapResources } from "@/utils/prepareLocalMapResource";

export function useLocalMapResources(): MapResources | null {
  const [resources, setResources] = useState<MapResources | null>(null);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;

    prepareLocalMapResources(isCancelled)
      .then((result) => {
        if (!cancelled && result) {
          setResources(result);
          console.log("Local map resources ready");
        }
      })
      .catch((error) => {
        console.error("Failed to prepare local map resources:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return resources;
}
