import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

export const StarRating = ({
  rating,
  onRatingChange,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
}) => (
  <View className="my-4 flex-row justify-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => onRatingChange(star)}
        className="mx-1"
      >
        <Ionicons
          name={star <= rating ? "star" : "star-outline"}
          size={40}
          color={star <= rating ? "#FFD700" : "#666"}
        />
      </TouchableOpacity>
    ))}
  </View>
);
