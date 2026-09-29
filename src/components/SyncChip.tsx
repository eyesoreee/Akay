import { SyncStatus } from "@powersync/react-native";
import { Text, View } from "react-native";

interface Props {
  status: SyncStatus;
  buildingsCount: number;
}

function getStatusMessage(
  status: Props["status"],
  buildingsCount: number,
): string {
  if (status.downloadError)
    return `sync error: ${status.downloadError.message}`;
  if (status.hasSynced) {
    return buildingsCount
      ? `synced ✓ (${buildingsCount} buildings)`
      : "synced ✓";
  }
  if (status.connected || status.connecting) return "syncing…";
  return "connecting…";
}

export default function SyncChip({ status, buildingsCount }: Props) {
  return (
    <View className="absolute bottom-8 left-5 max-w-[60%] rounded bg-black/70 px-2 py-1">
      <Text className="text-[10px] text-white">
        {getStatusMessage(status, buildingsCount)}
      </Text>
    </View>
  );
}
