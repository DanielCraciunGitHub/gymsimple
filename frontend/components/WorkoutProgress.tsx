import { currentExerciseIndexAtom } from "@/atoms/play";
import { useAtom } from "jotai";
import { Text, View } from "react-native";

interface WorkoutProgressProps {
  totalExercises: number;
  exerciseNames: string[];
}

export default function WorkoutProgress({
  totalExercises,
  exerciseNames,
}: WorkoutProgressProps) {
  const [currentExerciseIndex] = useAtom(currentExerciseIndexAtom);
  return (
    <View className="p-4">
      <Text className="mb-3 text-center text-sm text-white opacity-90">
        Exercise {currentExerciseIndex + 1} of {totalExercises}
      </Text>

      <View className="flex-row items-center justify-center">
        {Array.from({ length: totalExercises }, (_, index) => (
          <View key={index} className="flex-row items-center">
            <View
              className={`h-3 w-3 rounded-full border-2 ${
                index < currentExerciseIndex
                  ? "border-blue-500 bg-blue-500"
                  : index === currentExerciseIndex
                    ? "border-white bg-white"
                    : "border-white bg-transparent opacity-50"
              }`}
            />

            {index < totalExercises - 1 && (
              <View
                className={`h-0.5 w-4 ${
                  index < currentExerciseIndex
                    ? "bg-blue-500"
                    : "bg-white opacity-50"
                }`}
              />
            )}
          </View>
        ))}
      </View>

      {exerciseNames[currentExerciseIndex] && (
        <Text className="mt-2 text-center text-xs text-white opacity-75">
          {exerciseNames[currentExerciseIndex]}
        </Text>
      )}
    </View>
  );
}
