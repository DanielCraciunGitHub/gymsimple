import { WorkoutSession } from "@/validations";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface WorkoutSessionCardProps {
  session: WorkoutSession;
  onPress?: (session: WorkoutSession) => void;
}

export const WorkoutSessionCard: React.FC<WorkoutSessionCardProps> = ({
  session,
  onPress,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatWorkoutDuration = () => {
    const startTime = formatTime(sessionDate);
    const endDate =
      session.endDate instanceof Date
        ? session.endDate
        : new Date(session.endDate);
    const endTime = formatTime(endDate);
    return `${startTime} - ${endTime}`;
  };

  const getTotalSets = () => {
    return session.exercises.reduce(
      (total, exercise) => total + exercise.set.length,
      0
    );
  };

  const getAverageRating = () => {
    const validRatings = session.exercises.filter((ex) => ex.rating > 0);
    if (validRatings.length === 0) return "0";
    const sum = validRatings.reduce(
      (total, exercise) => total + exercise.rating,
      0
    );
    return (sum / validRatings.length).toFixed(1);
  };

  const sessionDate =
    session.date instanceof Date ? session.date : new Date(session.date);

  return (
    <TouchableOpacity
      className="mb-3 rounded-lg border-2 border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      onPress={() => onPress?.(session)}
    >
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800 dark:text-white">
            {formatDate(sessionDate)}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300">
            {formatWorkoutDuration()}
          </Text>
        </View>
      </View>

      {/* Session Stats */}
      <View className="mb-3 flex-row justify-between">
        <View className="flex-row items-center">
          <Ionicons name="fitness" size={16} color="#6B7280" />
          <Text className="ml-1 text-sm text-gray-600 dark:text-gray-300">
            {session.exercises.length} exercise
            {session.exercises.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="repeat" size={16} color="#6B7280" />
          <Text className="ml-1 text-sm text-gray-600 dark:text-gray-300">
            {getTotalSets()} sets
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="star" size={16} color="#6B7280" />
          <Text className="ml-1 text-sm text-gray-600 dark:text-gray-300">
            {getAverageRating()}/5 avg
          </Text>
        </View>
      </View>

      {/* Exercise List */}
      <View className="gap-2">
        {session.exercises.map((exercise) => (
          <View
            key={exercise.id}
            className="rounded-md bg-gray-50 p-3 dark:bg-gray-700"
          >
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="flex-1 font-medium text-gray-800 dark:text-white">
                {exercise.name}
              </Text>
              <View className="flex-row items-center">
                <Text className="mr-2 text-sm text-gray-600 dark:text-gray-300">
                  {exercise.rating}/5
                </Text>
                <Ionicons name="star" size={14} color="#FCD34D" />
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                {exercise.set.length} sets •{" "}
                {exercise.set.reduce(
                  (total, set) => total + set.actualReps,
                  0
                )}{" "}
                total reps
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                {exercise.restTime}s rest
              </Text>
            </View>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};
