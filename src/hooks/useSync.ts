import { SYNC_INTERVAL_MS, SYNC_MIN_INTERVAL_MS } from "@/constants/sync";
import { isOnline, syncBuildings } from "@/lib/sync";
import { useQueryClient } from "@tanstack/react-query";
import * as Network from "expo-network";
import { useEffect } from "react";
import { AppState } from "react-native";

export function useSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    let lastSyncAt = 0;
    let online = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    async function sync() {
      if (cancelled || inFlight) return;
      if (Date.now() - lastSyncAt < SYNC_MIN_INTERVAL_MS) return;
      inFlight = true;
      lastSyncAt = Date.now();
      try {
        if (!(await isOnline())) return;
        await syncBuildings();
        if (cancelled) return;
        queryClient.invalidateQueries({ queryKey: ["Building"] });
      } catch (e) {
        console.log("[Sync] Background sync failed:", e);
      } finally {
        inFlight = false;
      }
    }

    const bootTimer = setTimeout(sync, 1_000);

    intervalId = setInterval(sync, SYNC_INTERVAL_MS);

    const networkSub = Network.addNetworkStateListener((state) => {
      const nextOnline =
        state.isConnected === true && state.isInternetReachable !== false;
      if (nextOnline && !online) sync();
      online = nextOnline;
    });

    const appStateSub = AppState.addEventListener("change", (next) => {
      if (next === "active") sync();
    });

    return () => {
      cancelled = true;
      clearTimeout(bootTimer);
      if (intervalId) clearInterval(intervalId);
      networkSub.remove();
      appStateSub.remove();
    };
  }, [queryClient]);
}
