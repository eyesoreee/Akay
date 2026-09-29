import { colors } from "@/constants/color";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Pressable } from "react-native";

interface BtnProps {
  onPress: () => void;
  followUser: boolean;
}

export default function FollowUserButton({ followUser, onPress }: BtnProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`absolute bottom-10 right-6 h-16 w-16 items-center justify-center rounded-full shadow-md ${
        followUser ? "bg-semantic-primary" : "bg-white"
      }`}
    >
      <Ionicons
        name={followUser ? "locate" : "locate-outline"}
        size={30}
        color={followUser ? "#fff" : colors.semantic.textPrimary}
      />
    </Pressable>
  );
}
