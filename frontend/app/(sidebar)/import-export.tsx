import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ExerciseDetails, WorkoutSession, exerciseDetailsArraySchema, workoutSessionArraySchema } from "@/validations";
import { exportFile } from "@/lib/export";
import { importFile } from "@/lib/import";
import { getItem, setItem, StorageKey, getTags } from "@/lib/local-storage";
import { config } from "@/config";


export default function ImportExport() {
  const handleImportExercises = async () => {
    try {
      const importedExercises = await importFile<ExerciseDetails[]>(
        exerciseDetailsArraySchema
      );
      
      if (importedExercises) {
        // Handle tags
        const tags = importedExercises?.flatMap((exercise) => exercise.tags);
        const uniqueTags = [...new Set(tags)];
        const filteredTags = uniqueTags.filter((tag): tag is string => tag !== undefined && tag !== "" && tag !== null);
        const localTags = await getTags();
        await setItem(StorageKey.TAGS, [...new Set([...localTags, ...filteredTags])]);

        // Handle exercises
        const existingExercises = await getItem<ExerciseDetails[]>(StorageKey.EXERCISES) || [];
        const newExercises = [...importedExercises, ...existingExercises];
        const uniqueExercises = newExercises.filter(
          (exercise, index, self) =>
            index === self.findIndex((t) => t.id === exercise.id)
        );
        await setItem(StorageKey.EXERCISES, uniqueExercises);
        Alert.alert("Success", "Exercises imported successfully!");
      }
    } catch (error) {
      console.error("Error importing exercises:", error);
      Alert.alert("Error", "Check your file format and try again.");
    }
  };

  const handleExportExercises = async () => {
    try {
      const exercises = await getItem<ExerciseDetails[]>(StorageKey.EXERCISES);
      if (exercises && exercises.length > 0) {
        await exportFile("exercises.json", exercises);
        Alert.alert("Success", "Exercises exported successfully!");
      } else {
        Alert.alert("Info", "No exercises to export.");
      }
    } catch (error) {
      console.error("Error exporting exercises:", error);
      Alert.alert("Error", "Failed to export exercises.");
    }
  };

  const handleImportSessions = async () => {
    try {
      const importedSessions = await importFile<WorkoutSession[]>(
        workoutSessionArraySchema
      );
      
      if (importedSessions) {
        const existingSessions = await getItem<WorkoutSession[]>(StorageKey.WORKOUT_SESSIONS) || [];
        const newSessions = [...importedSessions, ...existingSessions];
        const uniqueSessions = newSessions
          .filter(
            (session, index, self) =>
              index === self.findIndex((t) => t.id === session.id)
          )
          .sort((a, b) => {
            const dateA = a.date instanceof Date ? a.date : new Date(a.date);
            const dateB = b.date instanceof Date ? b.date : new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          });
        await setItem(StorageKey.WORKOUT_SESSIONS, uniqueSessions);
        Alert.alert("Success", "Workout sessions imported successfully!");
      }
    } catch (error) {
      console.error("Error importing workout sessions:", error);
      Alert.alert("Error", "Check your file format and try again.");
    }
  };

  const handleExportSessions = async () => {
    try {
      const sessions = await getItem<WorkoutSession[]>(StorageKey.WORKOUT_SESSIONS);
      if (sessions && sessions.length > 0) {
        await exportFile("workout-sessions.json", sessions);
        Alert.alert("Success", "Workout sessions exported successfully!");
      } else {
        Alert.alert("Info", "No workout sessions to export.");
      }
    } catch (error) {
      console.error("Error exporting workout sessions:", error);
      Alert.alert("Error", "Failed to export workout sessions.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black">
      <View className="p-4">
        <Text className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          Import & Export
        </Text>

        {/* Exercises Section */}
        <View className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <View className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <View className="flex-row items-center gap-2">
              <Ionicons name="barbell-outline" size={24} color="#3B82F6" />
              <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                Exercises Data
              </Text>
            </View>
          </View>
          
          <View className="p-4">
            <Text className="mb-4 text-gray-600 dark:text-gray-300">
              Import or export your {config.appName} exercise data.
            </Text>
            
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleImportExercises}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-blue-500 p-3"
              >
                <Ionicons name="cloud-upload-outline" size={20} color="white" />
                <Text className="font-medium text-white">Import</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleExportExercises}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-blue-500 p-3"
              >
                <Ionicons name="cloud-download-outline" size={20} color="white" />
                <Text className="font-medium text-white">Export</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Workout Sessions Section */}
        <View className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <View className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <View className="flex-row items-center gap-2">
              <Ionicons name="fitness-outline" size={24} color="#3B82F6" />
              <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                Workout Sessions
              </Text>
            </View>
          </View>
          
          <View className="p-4">
            <Text className="mb-4 text-gray-600 dark:text-gray-300">
              Import or export your {config.appName} workout sessions.
            </Text>
            
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleImportSessions}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-blue-500 p-3"
              >
                <Ionicons name="cloud-upload-outline" size={20} color="white" />
                <Text className="font-medium text-white">Import</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleExportSessions}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-blue-500 p-3"
              >
                <Ionicons name="cloud-download-outline" size={20} color="white" />
                <Text className="font-medium text-white">Export</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}