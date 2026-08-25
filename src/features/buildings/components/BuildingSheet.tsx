import { Pressable, Text, View } from "react-native";

import { formatDistance } from "@/utils/distance";
import { Building } from "../types/building.entity";

interface BuildingSheetProps {
  building: Building | null;
  distance: number | null;
  expanded: boolean;
  hasLocation: boolean;
  onExpand: () => void;
  onDirections: () => void;
}

export function BuildingSheet({
  building,
  distance,
  expanded,
  hasLocation,
  onExpand,
  onDirections,
}: BuildingSheetProps) {
  if (!building) return null;

  return (
    <View className="gap-3 px-6 py-4 mt-6">
      <Text className="text-2xl font-bold text-semantic-textOnPrimary">
        {building.name}
      </Text>

      <View className="flex-row items-center gap-2">
        <View className="self-start rounded-full bg-semantic-accent px-3 py-1">
          <Text className="text-xs font-semibold uppercase text-semantic-textOnAccent">
            {building.type}
          </Text>
        </View>

        {distance != null && (
          <Text className="text-sm text-white/70">
            {formatDistance(distance)}
          </Text>
        )}
      </View>

      {!expanded ? (
        <View className="flex-row gap-3 mt-1">
          <Pressable
            onPress={onExpand}
            className={`${hasLocation ? "flex-1" : "flex-1"} rounded-xl border border-white/30 py-3 items-center active:opacity-75`}
          >
            <Text className="text-sm font-semibold text-white">
              View Details
            </Text>
          </Pressable>

          {hasLocation && (
            <Pressable
              onPress={onDirections}
              className="flex-1 rounded-xl bg-white py-3 items-center active:opacity-75"
            >
              <Text className="text-sm font-semibold text-semantic-primary">
                Directions
              </Text>
            </Pressable>
          )}
        </View>
      ) : (
        <>
          {building.description ? (
            <Text className="leading-6 text-white/80 mt-1">
              {building.description}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}
