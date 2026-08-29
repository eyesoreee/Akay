import { Ionicons } from "@react-native-vector-icons/ionicons";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import { colors } from "@/constants/color";

export type InitialSyncStatus = "fetching" | "offline" | "error";

interface InitialSyncScreenProps {
  status: InitialSyncStatus;
  onRetry: () => void;
}

export function InitialSyncScreen({ status, onRetry }: InitialSyncScreenProps) {
  if (status === "fetching") {
    return (
      <View className="flex-1 items-center justify-center bg-semantic-primary p-8">
        <Image
          source={require("@/assets/images/splash-icon.png")}
          className="mb-6 h-24 w-24"
          resizeMode="contain"
        />
        <Text className="text-center text-[26px] font-bold tracking-wide text-semantic-accent">
          Akay
        </Text>
        <Text className="mt-1.5 text-[13px] tracking-wide text-white/60">
          Mindanao State University
        </Text>
        <ActivityIndicator
          size="small"
          color={colors.semantic.accent}
          style={{ marginTop: 40 }}
        />
        <Text className="mt-3 text-sm text-white/75">Fetching data…</Text>
      </View>
    );
  }

  const isOffline = status === "offline";
  const icon = isOffline ? "cloud-offline-outline" : "alert-circle-outline";
  const heading = isOffline ? "You're offline" : "Something went wrong";
  const message = isOffline
    ? "The first launch needs an internet connection to load the campus data onto your device. Please connect and try again."
    : "We couldn't load the data. Please check your connection and try again.";

  return (
    <View className="flex-1 items-center justify-center bg-semantic-primary p-8">
      <Ionicons
        name={icon}
        size={56}
        color={colors.semantic.accent}
        style={{ marginBottom: 20 }}
      />
      <Text className="text-center text-[26px] font-bold tracking-wide text-semantic-accent">
        {heading}
      </Text>
      <Text className="mt-3.5 text-center text-[15px] leading-[22px] text-white/80">
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        className="mt-7 rounded-full bg-semantic-accent px-9 py-3 active:opacity-75"
      >
        <Text className="text-base font-bold text-semantic-textOnAccent">
          Retry
        </Text>
      </Pressable>
    </View>
  );
}
