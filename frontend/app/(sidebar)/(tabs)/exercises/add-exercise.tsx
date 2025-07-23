import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { getItem, setItem, StorageKey } from "@/lib/local-storage";
import {
  ExerciseDetails,
  ExerciseInput,
} from "@/components/ExerciseInput";

export default function Workouts() {
  const { id } = useLocalSearchParams();
  const [exercise, setExercise] = useState<ExerciseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExercise = async () => {
      setIsLoading(true);
      const exercises = await getItem<ExerciseDetails[]>(
        StorageKey.EXERCISES
      );
      setExercise(exercises?.find((e) => e.id === id) || null);
      setIsLoading(false);
    };
    loadExercise();
  }, [id]);

  const handleSubmit = async (details: ExerciseDetails) => {
    const exercises = await getItem<ExerciseDetails[]>(
      StorageKey.EXERCISES
    );

    if (exercises) {
      const index = exercises.findIndex((e) => e.id === details.id);
      if (index !== -1) {
        exercises[index] = details;
      } else {
        exercises.push(details);
      }
      setItem(StorageKey.EXERCISES, exercises);
    } else {
      setItem(StorageKey.EXERCISES, [details]);
    }

    router.back();
  };
  console.log(exercise);

  return (
    <View className="flex-1 items-center justify-center dark:bg-black dark:text-white">
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ExerciseInput
          onSubmit={handleSubmit}
          initialValues={exercise || undefined}
        />
      )}
    </View>
  );
}
