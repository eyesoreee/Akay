import { formatDistance, formatDuration } from "@/lib/walkRouting";
import { Text, View } from "react-native";

interface Props {
  distance: number;
  duration: number;
}

export function RouteChip({ distance, duration }: Props) {
  const formattedDistance = formatDistance(distance);
  const formattedDuration = formatDuration(duration);

  return (
    <View className="absolute left-0 right-0 top-[170px] items-center">
      <View className="rounded-full bg-black/70 px-4 py-1.5">
        <Text className="text-xs font-medium text-white">
          {formattedDistance} · {formattedDuration} walk
        </Text>
      </View>
    </View>
  );
}
