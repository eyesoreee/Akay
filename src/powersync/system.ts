import {
  PowerSyncDatabase,
  SyncStreamConnectionMethod,
} from "@powersync/react-native";
import { AppSchema } from "./AppSchema";
import { SupabaseConnector } from "./connector";

export const powersync = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: "akay.db",
  },
});

export async function setupPowerSync() {
  const endpoint = process.env.EXPO_PUBLIC_POWERSYNC_URL;
  if (!endpoint) throw new Error("Missing EXPO_PUBLIC_POWERSYNC_URL");

  const connector = new SupabaseConnector();
  await powersync.connect(connector, {
    connectionMethod: SyncStreamConnectionMethod.WEB_SOCKET,
  });
}
