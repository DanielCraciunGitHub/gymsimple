import React, { useCallback, useState } from "react";
import { ExerciseData, WorkoutSession } from "@/validations";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { formatDate, formatTime } from "@/lib/date";
import { getItem, setItem, StorageKey } from "@/lib/local-storage";

export default function SessionDetails() {
  const { id } = useLocalSearchParams();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = async () => {
    try {
      setIsLoading(true);
      const storedSessions = await getItem<WorkoutSession[]>(
        StorageKey.WORKOUT_SESSIONS
      );

      const foundSession = storedSessions?.find((s) => s.id === id);
      setSession(foundSession || null);
    } catch (error) {
      console.error("Error loading session:", error);
      Alert.alert("Error", "Failed to load workout session");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async () => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this workout session? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const storedSessions = await getItem<WorkoutSession[]>(
                StorageKey.WORKOUT_SESSIONS
              );

              if (storedSessions) {
                const updatedSessions = storedSessions.filter(
                  (s) => s.id !== id
                );
                await setItem(
                  StorageKey.WORKOUT_SESSIONS,
                  updatedSessions
                );

                router.back();
              }
            } catch (error) {
              console.error("Error deleting session:", error);
              Alert.alert("Error", "Failed to delete workout session");
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadSession();
    }, [])
  );

  const getSessionStats = () => {
    if (!session)
      return {
        totalSets: 0,
        totalReps: 0,
        averageRating: 0,
        totalVolume: 0,
      };

    const totalSets = session.exercises.reduce(
      (total, exercise) => total + exercise.set.length,
      0
    );

    const totalReps = session.exercises.reduce(
      (total, exercise) =>
        total +
        exercise.set.reduce(
          (setTotal, set) => setTotal + set.actualReps,
          0
        ),
      0
    );

    const validRatings = session.exercises.filter((ex) => ex.rating > 0);
    const averageRating =
      validRatings.length > 0
        ? validRatings.reduce((sum, ex) => sum + ex.rating, 0) /
          validRatings.length
        : 0;

    const estimatedDuration =
      session.exercises.reduce(
        (total, exercise) =>
          total + exercise.set.length * exercise.restTime,
        0
      ) ?? 0;

    return { totalSets, totalReps, averageRating, estimatedDuration };
  };

  const getExerciseStats = (exercise: ExerciseData) => {
    const totalTargetReps = exercise.set.reduce(
      (sum, set) => sum + set.targetReps,
      0
    );
    const totalActualReps = exercise.set.reduce(
      (sum, set) => sum + set.actualReps,
      0
    );
    const completionRate =
      totalTargetReps > 0 ? (totalActualReps / totalTargetReps) * 100 : 0;

    return {
      totalTargetReps,
      totalActualReps,
      completionRate,
      avgRepsPerSet: totalActualReps / exercise.set.length,
    };
  };

  const getPerformanceInsights = () => {
    if (!session) return [];

    const insights = [];
    const stats = getSessionStats();

    if (stats.averageRating >= 4) {
      insights.push({
        icon: "star",
        color: "#10B981",
        title: "Excellent Session!",
        description: `Average rating of ${stats.averageRating.toFixed(1)}/5 - you crushed it!`,
      });
    } else if (stats.averageRating < 2.5) {
      insights.push({
        icon: "trending-down",
        color: "#EF4444",
        title: "Challenging Day",
        description: `Lower ratings suggest this was a tough session. Rest up!`,
      });
    }

    if (stats.totalReps > 100) {
      insights.push({
        icon: "flash",
        color: "#F59E0B",
        title: "High Volume",
        description: `${stats.totalReps} total reps - great work capacity!`,
      });
    }

    const exerciseCompletion = session.exercises.map((ex) =>
      getExerciseStats(ex)
    );
    const avgCompletion =
      exerciseCompletion.reduce((sum, ex) => sum + ex.completionRate, 0) /
      exerciseCompletion.length;

    if (avgCompletion >= 95) {
      insights.push({
        icon: "checkmark-circle",
        color: "#10B981",
        title: "Perfect Execution",
        description: `${avgCompletion.toFixed(0)}% target reps achieved!`,
      });
    }

    return insights;
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-lg text-gray-600 dark:text-gray-300">
          Loading session details...
        </Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
          Session Not Found
        </Text>
        <Text className="mt-2 text-center text-gray-600 dark:text-gray-300">
          The requested workout session could not be found.
        </Text>
        <TouchableOpacity
          className="mt-4 rounded-lg bg-blue-500 px-6 py-2"
          onPress={() => router.back()}
        >
          <Text className="font-medium text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sessionDate =
    session.date instanceof Date ? session.date : new Date(session.date);
  const stats = getSessionStats();
  const insights = getPerformanceInsights();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <View className="border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <View className="flex-row items-center justify-between">
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
            <Text className="text-lg font-semibold text-gray-800 dark:text-white">
              Session Details
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Session Overview */}
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatDate(sessionDate)}
          </Text>
          <Text className="mt-1 text-lg text-gray-600 dark:text-gray-300">
            {formatTime(sessionDate)} -{" "}
            {formatTime(
              session.endDate instanceof Date
                ? session.endDate
                : new Date(session.endDate)
            )}
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <View className="mx-4 mb-6 grid grid-cols-2 gap-3">
          <View className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <View className="flex-row items-center">
              <Ionicons name="fitness" size={20} color="#3B82F6" />
              <Text className="ml-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                Exercises
              </Text>
            </View>
            <Text className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-200">
              {session.exercises.length}
            </Text>
          </View>

          <View className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <View className="flex-row items-center">
              <Ionicons name="repeat" size={20} color="#10B981" />
              <Text className="ml-2 text-sm font-medium text-green-700 dark:text-green-300">
                Total Sets
              </Text>
            </View>
            <Text className="mt-1 text-2xl font-bold text-green-800 dark:text-green-200">
              {stats.totalSets}
            </Text>
          </View>

          <View className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
            <View className="flex-row items-center">
              <Ionicons name="trending-up" size={20} color="#8B5CF6" />
              <Text className="ml-2 text-sm font-medium text-purple-700 dark:text-purple-300">
                Total Reps
              </Text>
            </View>
            <Text className="mt-1 text-2xl font-bold text-purple-800 dark:text-purple-200">
              {stats.totalReps}
            </Text>
          </View>

          <View className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <View className="flex-row items-center">
              <Ionicons name="star" size={20} color="#F59E0B" />
              <Text className="ml-2 text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Avg Rating
              </Text>
            </View>
            <Text className="mt-1 text-2xl font-bold text-yellow-800 dark:text-yellow-200">
              {stats.averageRating.toFixed(1)}/5
            </Text>
          </View>
        </View>

        {/* Performance Insights */}
        {insights.length > 0 && (
          <View className="mx-4 mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
              Performance Insights
            </Text>
            {insights.map((insight, index) => (
              <View
                key={index}
                className="mb-2 flex-row items-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
              >
                <Ionicons
                  name={insight.icon as any}
                  size={20}
                  color={insight.color}
                />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-gray-800 dark:text-white">
                    {insight.title}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-300">
                    {insight.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Exercise Details */}
        <View className="mx-4 mb-6">
          <Text className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Exercise Breakdown
          </Text>

          {session.exercises.map((exercise, index) => {
            const exerciseStats = getExerciseStats(exercise);

            return (
              <View
                key={exercise.id}
                className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Exercise Header */}
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="flex-1 text-lg font-semibold text-gray-800 dark:text-white">
                    {exercise.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="mr-1 text-sm text-gray-600 dark:text-gray-300">
                      {exercise.rating}/5
                    </Text>
                    <Ionicons name="star" size={16} color="#FCD34D" />
                  </View>
                </View>

                {/* Exercise Stats */}
                <View className="mb-3 flex-row justify-between">
                  <View className="items-center">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      SETS
                    </Text>
                    <Text className="font-bold text-gray-800 dark:text-white">
                      {exercise.set.length}
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      TOTAL REPS
                    </Text>
                    <Text className="font-bold text-gray-800 dark:text-white">
                      {exerciseStats.totalActualReps}
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      COMPLETION
                    </Text>
                    <Text className="font-bold text-gray-800 dark:text-white">
                      {exerciseStats.completionRate.toFixed(0)}%
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      REST
                    </Text>
                    <Text className="font-bold text-gray-800 dark:text-white">
                      {exercise.restTime}s
                    </Text>
                  </View>
                </View>

                {/* Sets Breakdown */}
                <View className="rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                  <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sets Detail
                  </Text>
                  {exercise.set.map((set, setIndex) => (
                    <View
                      key={setIndex}
                      className="mb-1 flex-row justify-between"
                    >
                      <Text className="text-sm text-gray-600 dark:text-gray-300">
                        Set {setIndex + 1}
                      </Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-300">
                        {set.actualReps}/{set.targetReps} reps
                        {set.actualReps >= set.targetReps && (
                          <Text className="text-green-600"> ✓</Text>
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        {/* Delete Session Button */}
        <View className="mx-4 mb-8">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-lg bg-red-500 px-6 py-4"
            onPress={deleteSession}
          >
            <Ionicons name="trash" size={20} color="white" />
            <Text className="ml-2 font-semibold text-white">
              Delete Session
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
