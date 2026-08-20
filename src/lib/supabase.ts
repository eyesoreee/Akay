import "react-native-url-polyfill/auto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import "expo-sqlite/localStorage/install";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  let storage: typeof localStorage | undefined;
  try {
    storage = localStorage;
  } catch (error) {
    console.error("Failed to initialize localStorage:", error);
  }

  client = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        ...(storage ? { storage } : {}),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    },
  );
  return client;
}
