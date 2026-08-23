import { colors } from "@/constants/color";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Pressable, TextInput, View } from "react-native";

interface CustomSearchBarProps {
  isFocused: boolean;
  onFocus: () => void;
  value: string;
  onChange: (char: string) => void;
  onClear: () => void;
}

export default function CustomSearchBar({
  isFocused,
  onFocus,
  value,
  onChange,
  onClear,
}: CustomSearchBarProps) {
  return (
    <View
      className={`flex-row items-center rounded-2xl bg-semantic-primary px-4 py-3 shadow-md border-2 ${
        isFocused ? "border-semantic-accent" : "border-transparent"
      }`}
    >
      <Ionicons
        name="search-sharp"
        color={colors.semantic.textOnPrimary}
        size={20}
      />

      <TextInput
        placeholder="Search buildings..."
        placeholderTextColor={colors.semantic.textOnPrimary}
        className="mx-3 flex-1 text-base text-semantic-textOnPrimary"
        onFocus={onFocus}
        value={value}
        onChangeText={onChange}
      />

      {value !== "" && (
        <Pressable onPress={onClear} hitSlop={8}>
          <Ionicons
            name="close-circle"
            color={colors.semantic.textOnPrimary}
            size={20}
          />
        </Pressable>
      )}
    </View>
  );
}
