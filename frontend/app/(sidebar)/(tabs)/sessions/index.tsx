import React, { useCallback, useState } from "react";
import { WorkoutSession, workoutSessionArraySchema } from "@/validations";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { importFile } from "@/lib/import";
import { getItem, setItem, StorageKey } from "@/lib/local-storage";
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

  const handleImport = async () => {
    try {
      const importedSessions = await importFile<WorkoutSession[]>(
        workoutSessionArraySchema
      );
      if (importedSessions) {
        const newSessions = [...importedSessions, ...workoutSessions];
        const uniqueSessions = newSessions
          .filter(
            (session, index, self) =>
              index === self.findIndex((t) => t.id === session.id)
          )
          .sort((a, b) => {
            const dateA =
              a.date instanceof Date ? a.date : new Date(a.date);
            const dateB =
              b.date instanceof Date ? b.date : new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          });
        setWorkoutSessions(uniqueSessions);
        await setItem(StorageKey.WORKOUT_SESSIONS, uniqueSessions);
      }
    } catch (error) {
      console.error("Error importing workout sessions:", error);
      Alert.alert("Error", "Check your file format and try again.");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (workoutSessions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-white px-6 dark:bg-black">
        <Ionicons name="fitness-outline" size={64} color="#9CA3AF" />
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          No Workout Sessions
        </Text>
        <Text className="mt-2 text-center text-gray-600 dark:text-gray-300">
          Complete your first workout to see your sessions here!
        </Text>
        <View className="flex-row items-center gap-2">
          <Link href="/(sidebar)/import-export" asChild>
            <TouchableOpacity className="rounded-lg bg-blue-500 px-4 py-2">
              <Ionicons
                name="folder-open-outline"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-row items-center justify-between px-4 py-4">
        <View>
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">
            Workout Sessions
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Link href="/(sidebar)/import-export" asChild>
            <TouchableOpacity className="rounded-lg bg-blue-500 px-4 py-2">
              <Ionicons
                name="folder-open-outline"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </Link>
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
