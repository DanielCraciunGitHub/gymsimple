import { useEffect, useState } from "react";
import {
  currentExerciseIndexAtom,
  currentSetIndexAtom,
  exercisesDataAtom,
  performSetPhaseAtom,
  prepPhaseAtom,
  quickLogAtom,
  restPhaseAtom,
} from "@/atoms/play";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtom, useSetAtom } from "jotai";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";

import { ExerciseData, WorkoutSession } from "@/types/play";
import { ISettings } from "@/config/settings";
import { getItem, setItem, StorageKey } from "@/lib/local-storage";
import { usePlayBackground } from "@/hooks/play-background";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ExerciseDetails } from "@/components/ExerciseInput";
import ExerciseProgress from "@/components/ExerciseProgress";

import { StarRating } from "./StarRating";

export default function WorkoutPlayer({
  exercises,
  settings,
}: {
  exercises: ExerciseDetails[];
  settings: ISettings;
}) {
  const [currentSetIndex, setCurrentSetIndex] = useAtom(
    currentSetIndexAtom
  );
  const [currentExerciseIndex, setCurrentExerciseIndex] = useAtom(
    currentExerciseIndexAtom
  );
  const setExercisesData = useSetAtom(exercisesDataAtom);

  const [prepPhase, setPrepPhase] = useAtom(prepPhaseAtom);
  const [performSetPhase, setPerformSetPhase] = useAtom(
    performSetPhaseAtom
  );
  const [restPhase, setRestPhase] = useAtom(restPhaseAtom);
  const [quickLog, setQuickLog] = useAtom(quickLogAtom);

  const [actualReps, setActualReps] = useState<string[]>([]);
  const [exerciseRating, setExerciseRating] = useState<number>(0);
  const [completedExercises, setCompletedExercises] = useState<
    ExerciseData[]
  >([]);

  const currentExercise = exercises[currentExerciseIndex];

  const backgroundColor = usePlayBackground();

  useEffect(() => {
    setPrepPhase(true);
    setPerformSetPhase(false);
    setRestPhase(false);
    setCurrentSetIndex(0);
    setCurrentExerciseIndex(0);
    setQuickLog(false);
    setCompletedExercises([]);
    setActualReps([]);
    setExerciseRating(0);
  }, [
    setPrepPhase,
    setPerformSetPhase,
    setRestPhase,
    setCurrentSetIndex,
    setCurrentExerciseIndex,
    setQuickLog,
  ]);

  useEffect(() => {
    if (quickLog && currentExercise) {
      const repsArray = Array.from({
        length: Number(currentExercise.targetSets),
      }).map(() => currentExercise.targetReps);
      setActualReps(repsArray);
      setExerciseRating(0);
    }
  }, [quickLog, currentExercise]);

  const updateActualReps = (setIndex: number, reps: string) => {
    const newReps = [...actualReps];
    newReps[setIndex] = reps;
    setActualReps(newReps);
  };

  const handleNextExercise = async () => {
    const currentExerciseData: ExerciseData = {
      id: uuid.v4() as string,
      restTime: Number(currentExercise.targetRestTime),
      rating: exerciseRating,
      name: currentExercise.name,
      set: actualReps.map((reps) => ({
        targetReps: Number(currentExercise.targetReps),
        actualReps: Number(reps) || 0,
      })),
    };

    const updatedCompletedExercises = [
      ...completedExercises,
      currentExerciseData,
    ];
    setCompletedExercises(updatedCompletedExercises);

    if (currentExerciseIndex < exercises.length - 1) {
      setQuickLog(false);
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      setPrepPhase(true);
      setRestPhase(false);
      setPerformSetPhase(false);
      setActualReps([]);
      setExerciseRating(0);
    } else {
      const completeWorkoutSession: WorkoutSession = {
        id: uuid.v4() as string,
        date: new Date(),
        exercises: updatedCompletedExercises,
      };

      setExercisesData(completeWorkoutSession);

      const workoutSessions = await getItem<WorkoutSession[]>(
        StorageKey.WORKOUT_SESSIONS
      );
      await setItem(
        StorageKey.WORKOUT_SESSIONS,
        workoutSessions
          ? [...workoutSessions, completeWorkoutSession]
          : [completeWorkoutSession]
      );

      console.log(
        "Complete workout session saved:",
        JSON.stringify(completeWorkoutSession, null, 2)
      );
      router.push("/(sidebar)/(tabs)/sessions");
    }
  };

  const isReadyToProgress =
    actualReps.every((reps) => reps && Number(reps) >= 0) &&
    exerciseRating > 0;

  return (
    currentExercise && (
      <SafeAreaView className={`flex-1 ${backgroundColor}`}>
        {!quickLog && (
          <ExerciseProgress
            totalSets={Number(currentExercise.targetSets)}
            exerciseName={currentExercise.name}
          />
        )}

        {prepPhase && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-2xl font-bold text-white">
              Phone down. Get ready.
            </Text>
            <CountdownTimer
              durationSeconds={settings.prepTime}
              onComplete={() => {
                setPrepPhase(false);
                setPerformSetPhase(true);
              }}
            />
          </View>
        )}

        {performSetPhase && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-7xl font-bold text-white">
              {currentExercise.targetReps} reps
            </Text>

            <TouchableOpacity
              onPress={() => {
                setPerformSetPhase(false);
                if (
                  currentSetIndex <
                  Number(currentExercise.targetSets) - 1
                ) {
                  setRestPhase(true);
                } else {
                  setQuickLog(true);
                }
              }}
            >
              <Ionicons name={"play-forward"} size={100} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {restPhase && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-7xl font-bold text-white">
              Rest.
            </Text>

            <CountdownTimer
              durationSeconds={Number(currentExercise.targetRestTime)}
              onComplete={() => {
                setRestPhase(false);
                setCurrentSetIndex(currentSetIndex + 1);
                setPerformSetPhase(true);
              }}
            />
          </View>
        )}

        {quickLog && (
          <View className="flex-1 px-6 py-4">
            <Text className="mb-6 text-center text-3xl font-bold text-white">
              How did you do?
            </Text>

            <Text className="mb-4 text-center text-xl text-gray-300">
              Target: {currentExercise.targetReps} reps per set
            </Text>

            <View className="flex-1 justify-center">
              <Text className="mb-4 text-center text-xl font-bold text-white">
                Actual Reps:
              </Text>

              {Array.from({
                length: Number(currentExercise.targetSets),
              }).map((_, index) => (
                <View
                  key={index}
                  className="mb-3 flex-row items-center justify-between rounded-lg bg-gray-800 px-4 py-3"
                >
                  <Text className="flex-1 text-2xl font-bold text-white">
                    Set {index + 1}:
                  </Text>
                  <TextInput
                    className="min-w-[80px] rounded-lg bg-gray-700 px-4 py-2 text-center text-2xl font-bold text-white"
                    placeholder="0"
                    keyboardType="numeric"
                    value={actualReps[index] || ""}
                    onChangeText={(text) => updateActualReps(index, text)}
                    selectTextOnFocus
                  />
                  <Text className="ml-2 text-xl text-gray-300">reps</Text>
                </View>
              ))}
            </View>

            <View className="mb-8 mt-6">
              <Text className="mb-3 text-center text-xl font-bold text-white">
                Rate this exercise:
              </Text>
              <StarRating
                rating={exerciseRating}
                onRatingChange={setExerciseRating}
              />
            </View>

            <TouchableOpacity
              onPress={handleNextExercise}
              disabled={!isReadyToProgress}
              className={`flex-row items-center justify-center rounded-lg px-6 py-4 ${
                isReadyToProgress ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              <Text className="mr-3 text-2xl font-bold text-white">
                {currentExerciseIndex < exercises.length - 1
                  ? "Next Exercise"
                  : "Finish Workout"}
              </Text>
              <Ionicons
                name={
                  currentExerciseIndex < exercises.length - 1
                    ? "play-forward"
                    : "checkmark"
                }
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    )
  );
}
