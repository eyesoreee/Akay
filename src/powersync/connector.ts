import { getSupabase } from "@/lib/supabase";
import type {
  CommonPowerSyncDatabase,
  PowerSyncBackendConnector,
} from "@powersync/react-native";

export class SupabaseConnector implements PowerSyncBackendConnector {
  async fetchCredentials() {
    const supabase = getSupabase();

    let {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    if (!session) {
      const result = await supabase.auth.signInAnonymously();
      if (result.error) throw result.error;
      session = result.data.session;
    }

    if (!session) throw new Error("No Supabase session available");

    const endpoint = process.env.EXPO_PUBLIC_POWERSYNC_URL;
    if (!endpoint) throw new Error("Missing EXPO_PUBLIC_POWERSYNC_URL");

    return {
      endpoint,
      token: session.access_token,
      expiresAt: session.expires_at
        ? new Date(session.expires_at * 1000)
        : undefined,
    };
  }

  async uploadData(_database: CommonPowerSyncDatabase) {} // placeholder for now
}
