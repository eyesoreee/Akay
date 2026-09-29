import { BuildingType } from "@/features/buildings/types/BuildingType";
import { Pressable, ScrollView, Text, View } from "react-native";

interface Props {
  onAllPress: () => void;
  onTypePress: (type: BuildingType) => void;
  selectedType: BuildingType | null;
}

const BUILDING_TYPES = Object.values(BuildingType);

export default function BuildingTypeFilter({
  onAllPress,
  onTypePress,
  selectedType,
}: Props) {
  return (
    <View className="absolute top-[118px] left-0 right-0">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        <Pressable
          onPress={onAllPress}
          className={`rounded-full px-4 py-2 ${
            selectedType === null
              ? "bg-semantic-primary"
              : "bg-white border border-neutral-200"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selectedType === null
                ? "text-semantic-textOnPrimary"
                : "text-semantic-textPrimary"
            }`}
          >
            all
          </Text>
        </Pressable>

        {BUILDING_TYPES.map((type) => (
          <Pressable
            key={type}
            onPress={() => onTypePress(type)}
            className={`rounded-full px-4 py-2 ${
              selectedType === type
                ? "bg-semantic-primary"
                : "bg-white border border-neutral-200"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedType === type
                  ? "text-semantic-textOnPrimary"
                  : "text-semantic-textPrimary"
              }`}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
