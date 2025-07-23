import {
  currentSetIndexAtom,
  performSetPhaseAtom,
  prepPhaseAtom,
  restPhaseAtom,
} from "@/atoms/play";
import { useAtom } from "jotai";
import { Text, View } from "react-native";

interface ExerciseProgressProps {
  totalSets: number;
  exerciseName: string;
}

export default function ExerciseProgress({
  totalSets,
  exerciseName,
}: ExerciseProgressProps) {
  const [currentSetIndex] = useAtom(currentSetIndexAtom);
  const [prepPhase] = useAtom(prepPhaseAtom);
  const [performSetPhase] = useAtom(performSetPhaseAtom);
  const [restPhase] = useAtom(restPhaseAtom);

  const displaySetIndex = prepPhase ? 0 : currentSetIndex + 1;

  return (
    <View className="absolute left-0 right-0 top-16 z-10 px-4">
      <Text className="mb-2 text-center text-sm text-white opacity-90">
        {exerciseName} - Set {Math.min(displaySetIndex, totalSets)} of{" "}
        {totalSets}
      </Text>

      <View className="flex-row items-center justify-center">
        {Array.from({ length: totalSets }, (_, index) => (
          <View key={index} className="flex-row items-center">
            <View
              className={`h-3 w-3 rounded-full border-2 ${
                index < currentSetIndex ||
                (index === currentSetIndex &&
                  (performSetPhase || restPhase))
                  ? "border-blue-500 bg-blue-500"
                  : index === currentSetIndex && prepPhase
                    ? "border-white bg-white"
                    : "border-white bg-transparent opacity-50"
              }`}
            />

            {index < totalSets - 1 && (
              <View
                className={`h-0.5 w-6 ${
                  index < currentSetIndex ||
                  (index === currentSetIndex && restPhase)
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
