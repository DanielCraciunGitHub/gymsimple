import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";

import { WorkoutSession } from "@/types/play";
import { getItem, StorageKey } from "@/lib/local-storage";
import { WorkoutSessionCard } from "@/components/WorkoutSessionCard";

export default function WorkoutSessions() {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadWorkoutSessions = async () => {
    try {
      setIsLoading(true);
      const storedSessions = await getItem<WorkoutSession[]>(
        StorageKey.WORKOUT_SESSIONS
      );

      const sortedSessions = (storedSessions || []).sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      setWorkoutSessions(sortedSessions);
    } catch (error) {
      console.error("Error loading workout sessions:", error);
      Alert.alert("Error", "Failed to load workout sessions");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWorkoutSessions();
    }, [])
  );

  const handleSessionPress = (session: WorkoutSession) => {
    router.push(`/sessions/${session.id}`);
  };

  const getTotalExercises = () => {
    return workoutSessions.reduce(
      (total, session) => total + session.exercises.length,
      0
    );
  };

  const getTotalSets = () => {
    return workoutSessions.reduce(
      (total, session) =>
        total +
        session.exercises.reduce(
          (exerciseTotal, exercise) => exerciseTotal + exercise.set.length,
          0
        ),
      0
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black" />
    );
  }

  if (workoutSessions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          No Workout Sessions Yet
        </Text>
        <Text className="mt-2 text-center text-gray-600 dark:text-gray-300">
          Complete your first workout to see your sessions here!
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">
          Workout Sessions ({workoutSessions.length})
        </Text>
        <View className="mt-2 flex-row justify-between">
          <Text className="text-sm text-gray-600 dark:text-gray-300">
            {getTotalExercises()} total exercises
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300">
            {getTotalSets()} total sets
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pb-4">
        {workoutSessions.map((session) => (
          <WorkoutSessionCard
            key={session.id}
            session={session}
            onPress={handleSessionPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}
