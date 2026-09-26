import "@azure/core-asynciterator-polyfill";

import { powersync, setupPowerSync } from "@/powersync/system";
import { PowerSyncContext } from "@powersync/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../../global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    setupPowerSync().catch((e) => console.error("PowerSync setup failed", e));
  }, []);

  return (
    <PowerSyncContext.Provider value={powersync}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </PowerSyncContext.Provider>
  );
}
