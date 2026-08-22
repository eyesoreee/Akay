import { FlatList, Pressable, Text, View } from "react-native";

import { Building } from "@/features/buildings/types/building.entity";

interface SearchResultsProps {
  buildings: Building[];
  query: string;
  onSelect: (building: Building) => void;
}

export default function SearchResults({
  buildings,
  query,
  onSelect,
}: SearchResultsProps) {
  if (!query) return null;

  return (
    <View className="absolute left-4 right-4 top-36 overflow-hidden rounded-2xl bg-semantic-primary">
      {buildings.length > 0 ? (
        <FlatList
          data={buildings}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 320 }}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => onSelect(item)}
              className={`px-5 py-3 active:opacity-75 ${
                index > 0 ? "border-t border-white/10" : ""
              }`}
            >
              <Text className="text-base font-semibold text-semantic-textOnPrimary">
                {item.name}
              </Text>

              <View className="mt-1.5 self-start rounded-full bg-semantic-accent px-2.5 py-0.5">
                <Text className="text-[10px] font-semibold uppercase text-semantic-textOnAccent">
                  {item.type}
                </Text>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <View className="px-5 py-6 items-center">
          <Text className="text-sm text-semantic-textOnPrimary/60">
            No buildings found
          </Text>
        </View>
      )}
    </View>
  );
}
