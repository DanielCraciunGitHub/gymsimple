import { currentSetIndexAtom, workoutPhaseAtom } from "@/atoms/play";
import { useAtom } from "jotai";
import { Text, View } from "react-native";

interface ExerciseProgressProps {
  totalSets: number;
  totalReps: number;
  exerciseWeight:
    | {
        value: string;
        unit: "kg" | "lbs";
      }
    | null
    | undefined;
}

export default function ExerciseProgress({
  totalSets,
  totalReps,
  exerciseWeight,
}: ExerciseProgressProps) {
  const [currentSetIndex] = useAtom(currentSetIndexAtom);
  const [workoutPhase] = useAtom(workoutPhaseAtom);

  const displaySetIndex =
    workoutPhase === "prep" ? 0 : currentSetIndex + 1;

  return (
    <View className="absolute left-0 right-0 top-16 z-10 px-4">
      <Text className="mb-2 text-center text-lg text-white opacity-90">
        {exerciseWeight?.value && exerciseWeight.value !== "0" && (
          <Text>
            {exerciseWeight.value} {exerciseWeight.unit}
          </Text>
        )}
        {totalReps > 0 && (
          <>
            {" • "}
            <Text>{totalReps} reps</Text>
          </>
        )}
        {" • "}
        Set {Math.min(displaySetIndex, totalSets)} of {totalSets}
      </Text>

      <View className="flex-row items-center justify-center">
        {Array.from({ length: totalSets }, (_, index) => (
          <View key={index} className="flex-row items-center">
            <View
              className={`h-3 w-3 rounded-full border-2 ${
                index < currentSetIndex ||
                (index === currentSetIndex &&
                  (workoutPhase === "perform" || workoutPhase === "rest"))
                  ? "border-blue-500 bg-blue-500"
                  : index === currentSetIndex && workoutPhase === "prep"
                    ? "border-white bg-white"
                    : "border-white bg-transparent opacity-50"
              }`}
            />

            {index < totalSets - 1 && (
              <View
                className={`h-0.5 w-6 ${
                  index < currentSetIndex ||
                  (index === currentSetIndex && workoutPhase === "rest")
                    ? "bg-blue-500"
                    : "bg-white opacity-50"
                }`}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
