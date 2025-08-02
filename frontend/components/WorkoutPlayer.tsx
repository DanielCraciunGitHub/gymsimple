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
import {
  ExerciseData,
  ExerciseDetails,
  WorkoutSession,
} from "@/validations";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtom, useSetAtom } from "jotai";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";

import { ISettings } from "@/config/settings";
import { getItem, setItem, StorageKey } from "@/lib/local-storage";
import { CountdownTimer, Stopwatch } from "@/components/CountdownTimer";
import ExerciseProgress from "@/components/ExerciseProgress";

import { StarRating } from "./StarRating";

export default function WorkoutPlayer({
  exercises,
  settings,
  backgroundColor,
}: {
  exercises: ExerciseDetails[];
  settings: ISettings;
  backgroundColor: string;
}) {
  const [currentSetIndex, setCurrentSetIndex] = useAtom(
    currentSetIndexAtom
  );
  const [currentExerciseIndex, setCurrentExerciseIndex] = useAtom(
    currentExerciseIndexAtom
  );
  const setExercisesData = useSetAtom(exercisesDataAtom);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date>(
    new Date()
  );

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
  const [autoRestCountdown, setAutoRestCountdown] = useState<number>(-1);

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
    setWorkoutStartTime(new Date());
  }, [
    setPrepPhase,
    setPerformSetPhase,
    setRestPhase,
    setCurrentSetIndex,
    setCurrentExerciseIndex,
    setQuickLog,
    setWorkoutStartTime,
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

  useEffect(() => {
    if (
      settings.autoRest &&
      performSetPhase &&
      currentExercise?.targetReps
    ) {
      const repsTime = Number(currentExercise.targetReps) * 3;
      setAutoRestCountdown(repsTime);

      const interval = setInterval(() => {
        setAutoRestCountdown((prev) => {
          if (prev <= 1) {
            const currentSet = currentSetIndex;
            const totalSets = Number(currentExercise.targetSets);

            setTimeout(() => {
              setPerformSetPhase(false);
              if (currentSet < totalSets - 1) {
                setRestPhase(true);
              } else {
                handleExerciseComplete();
              }
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else if (!performSetPhase) {
      setAutoRestCountdown(-1);
    }
  }, [
    settings.autoRest,
    performSetPhase,
    currentExercise?.targetReps,
    currentExercise?.targetSets,
    currentSetIndex,
    setPerformSetPhase,
    setRestPhase,
    setQuickLog,
  ]);

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
      weight: currentExercise.weight,
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
        date: workoutStartTime,
        exercises: updatedCompletedExercises,
        endDate: new Date(Date.now()),
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

  const handleExerciseComplete = () => {
    if (settings.skipLog) {
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSetIndex(0);
        setPrepPhase(true);
        setRestPhase(false);
        setPerformSetPhase(false);
        setActualReps([]);
        setExerciseRating(0);
      } else {
        router.push("/(sidebar)/(tabs)/sessions");
      }
    } else {  
      setQuickLog(true);
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
            totalReps={Number(currentExercise.targetReps)}
            exerciseWeight={currentExercise.weight}
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

            {settings.autoRest && autoRestCountdown > 0 && (
              <View className="mt-8 items-center">
                <Text className="mb-2 text-lg text-gray-300">
                  Auto rest in:
                </Text>
                <Text className="text-4xl font-bold text-yellow-400">
                  {autoRestCountdown}s
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                setPerformSetPhase(false);
                if (
                  currentSetIndex <
                  Number(currentExercise.targetSets) - 1
                ) {
                  setRestPhase(true);
                } else {
                  handleExerciseComplete();
                }
              }}
              className="mt-8"
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

export function GogginsWorkoutPlayer({
  backgroundColor,
  onQuit,
}: {
  backgroundColor: string;
  onQuit: () => void;
}) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);

  const gogginsExercises = [
    { name: "Push-ups", reps: 100, restTime: 20 },
    { name: "Burpees", reps: 100, restTime: 20 },
    { name: "Mountain Climbers", reps: 100, restTime: 20 },
    { name: "Jump Squats", reps: 100, restTime: 20 },
    { name: "High Knees", reps: 100, restTime: 20 },
    { name: "Plank Hold", reps: 300, restTime: 20 },
    { name: "Flutter Kicks", reps: 100, restTime: 20 },
    { name: "Jump Lunges", reps: 100, restTime: 20 },
  ];

  const currentExercise = gogginsExercises[currentExerciseIndex];

  const handleCompleteSet = () => {
    const nextExerciseIndex =
      (currentExerciseIndex + 1) % gogginsExercises.length;

    if (nextExerciseIndex === 0) {
      setCurrentRound((prev) => prev + 1);
    }

    setCurrentExerciseIndex(nextExerciseIndex);
    setCurrentSetIndex(0);
    setIsResting(true);
  };

  const handleCompleteRest = () => {
    setIsResting(false);
  };

  const handleCompletePrep = () => {
    setIsPreparing(false);
  };

  return (
    <SafeAreaView className={`flex-1 ${backgroundColor}`}>
      {/* Header with round counter and bell */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-white">
            Round {currentRound}
          </Text>
          <Text className="text-lg text-gray-300">GOGGINS MODE</Text>
        </View>

        {/* Large bell button to quit */}
        <TouchableOpacity
          onPress={onQuit}
          className="items-center justify-center rounded-full bg-orange-600 p-4"
        >
          <Ionicons name="notifications" size={40} color="yellow" />
        </TouchableOpacity>
      </View>

      <View className="items-center py-4">
        <Text className="text-lg text-gray-300">Total Time</Text>
        <Stopwatch />
      </View>

      <View className="flex-1 items-center justify-center px-6">
        {isPreparing && (
          <View className="items-center">
            <Text className="mb-4 text-center text-xl text-white">
              Get ready to push your limits
            </Text>
            <Text className="mb-8 text-center text-3xl font-bold text-white">
              Who&apos;s gonna carry the boats?
            </Text>
            <CountdownTimer
              durationSeconds={5}
              onComplete={handleCompletePrep}
              isPausable={false}
            />
          </View>
        )}

        {!isPreparing && isResting && (
          <View className="items-center">
            <Text className="mb-8 text-center text-lg text-white">
              Next:{" "}
              {
                gogginsExercises[
                  currentExerciseIndex % gogginsExercises.length || 0
                ].name
              }
            </Text>
            <CountdownTimer
              durationSeconds={currentExercise.restTime}
              onComplete={handleCompleteRest}
              isPausable={false}
            />
          </View>
        )}

        {!isPreparing && !isResting && (
          <View className="items-center">
            <Text className="mb-2 text-center text-2xl text-gray-300">
              {currentExercise.name}
            </Text>
            <Text className="mb-8 text-center text-8xl font-bold text-white">
              {currentExercise.reps}
            </Text>

            {currentExercise.name === "Plank Hold" && (
              <Text className="mb-4 text-center text-lg text-gray-300">
                seconds
              </Text>
            )}

            <TouchableOpacity
              onPress={handleCompleteSet}
              className="mt-8 items-center justify-center rounded-full bg-green-600 p-6"
            >
              <Ionicons name="checkmark" size={60} color="white" />
            </TouchableOpacity>

            <Text className="mt-8 text-center text-lg italic text-white">
              &quot;Pain is weakness leaving the body&quot; — David Goggins
            </Text>
          </View>
        )}
      </View>

      <View className="px-6 py-4">
        <Text className="text-center text-sm font-bold text-white">
          STAY HARD • NO EXCUSES • EMBRACE THE SUCK
        </Text>
      </View>
    </SafeAreaView>
  );
}
