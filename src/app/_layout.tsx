import {
  InitialSyncScreen,
  InitialSyncStatus,
} from "@/components/InitialSyncScreen";
import { completeInitialSync, hasCompletedInitialSync } from "@/db/meta.repo";
import { useSync } from "@/hooks/useSync";
import { isOnline, syncBuildings } from "@/lib/sync";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import "../../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function SyncProvider() {
  useSync();
  return null;
}

type BootPhase = "loading" | "offline" | "error" | "ready";

export default function RootLayout() {
  const [phase, setPhase] = useState<BootPhase>("loading");
  const runInitialSync = useCallback(async () => {
    setPhase("loading");
    try {
      if (!(await isOnline())) {
        setPhase("offline");
        return;
      }
      await syncBuildings();
      await completeInitialSync();
      queryClient.invalidateQueries({ queryKey: ["Building"] });
      setPhase("ready");
    } catch (e) {
      console.log("[Boot] Initial sync failed:", e);
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const done = await hasCompletedInitialSync();
        if (cancelled) return;
        if (done) {
          setPhase("ready");
          return;
        }
        await runInitialSync();
      } catch (e) {
        console.log("[Boot] Initialization failed:", e);
        setPhase("error");
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [runInitialSync]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  if (phase !== "ready") {
    const STATUS: Record<Exclude<BootPhase, "ready">, InitialSyncStatus> = {
      loading: "fetching",
      offline: "offline",
      error: "error",
    };
    return (
      <InitialSyncScreen status={STATUS[phase]} onRetry={runInitialSync} />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SyncProvider />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
