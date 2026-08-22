import { Pressable, Text, View } from "react-native";

import { Building } from "../types/building.entity";

interface BuildingSheetProps {
  building: Building | null;
  expanded: boolean;
  onExpand: () => void;
}

export function BuildingSheet({
  building,
  expanded,
  onExpand,
}: BuildingSheetProps) {
  if (!building) return null;

  return (
    <View className="gap-3 px-6 py-4 mt-6">
      <Text className="text-2xl font-bold text-semantic-textOnPrimary">
        {building.name}
      </Text>

      <View className="self-start rounded-full bg-semantic-accent px-3 py-1">
        <Text className="text-xs font-semibold uppercase text-semantic-textOnAccent">
          {building.type}
        </Text>
      </View>

      {!expanded ? (
        <View className="flex-row gap-3 mt-1">
          <Pressable
            onPress={onExpand}
            className="flex-1 rounded-xl border border-white/30 py-3 items-center active:opacity-75"
          >
            <Text className="text-sm font-semibold text-white">
              View Details
            </Text>
          </Pressable>

          <Pressable className="flex-1 rounded-xl bg-white py-3 items-center active:opacity-75">
            <Text className="text-sm font-semibold text-semantic-primary">
              Directions
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          {building.description ? (
            <Text className="leading-6 text-white/80 mt-1">
              {building.description}
            </Text>
          ) : null}

          <Pressable className="rounded-xl bg-white py-3 items-center mt-1 active:opacity-75">
            <Text className="text-sm font-semibold text-semantic-primary">
              Directions
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
