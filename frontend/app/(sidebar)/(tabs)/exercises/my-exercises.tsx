import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { exportExercises } from "@/lib/export";
import { importExercises } from "@/lib/import";
import { getItem, setItem, StorageKey } from "@/lib/local-storage";
import { ExerciseCard } from "@/components/ExerciseCard";
import { ExerciseDetails } from "@/components/ExerciseInput";

export default function MyExercises() {
  const [exercises, setExercises] = useState<ExerciseDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadExercises = async () => {
    try {
      setIsLoading(true);
      const storedExercises = await getItem<ExerciseDetails[]>(
        StorageKey.EXERCISES
      );
      setExercises(storedExercises || []);
    } catch (error) {
      console.error("Error loading exercises:", error);
      Alert.alert("Error", "Failed to load exercises");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [])
  );

  const handleSelectExercise = async (exercise: ExerciseDetails) => {
    const updatedExercises = exercises.map((e) => {
      if (e.id === exercise.id) {
        if (!e.selected) {
          // Selecting exercise - assign next order number
          const maxOrder = Math.max(
            0,
            ...exercises
              .filter(
                (ex) => ex.selected && ex.selectionOrder !== undefined
              )
              .map((ex) => ex.selectionOrder!)
          );
          return { ...e, selected: true, selectionOrder: maxOrder + 1 };
        } else {
          // Deselecting exercise - remove order and adjust others
          const updated = {
            ...e,
            selected: false,
            selectionOrder: undefined,
          };
          return updated;
        }
      }
      // Adjust order numbers for other exercises when one is deselected
      if (
        exercise.selected &&
        e.selected &&
        e.selectionOrder !== undefined &&
        exercise.selectionOrder !== undefined &&
        e.selectionOrder > exercise.selectionOrder
      ) {
        return { ...e, selectionOrder: e.selectionOrder - 1 };
      }
      return e;
    });

    setExercises(updatedExercises);
    await setItem(StorageKey.EXERCISES, updatedExercises);
  };

  const handleDeleteExercise = async (exercise: ExerciseDetails) => {
    try {
      const updatedExercises = exercises.filter(
        (e) => e.id !== exercise.id
      );
      await setItem(StorageKey.EXERCISES, updatedExercises);
      setExercises(updatedExercises);
    } catch (error) {
      console.error("Error deleting exercise:", error);
      Alert.alert("Error", "Failed to delete exercise");
    }
  };

  const handleImport = async () => {
    const importedExercises = await importExercises();
    if (importedExercises) {
      const newExercises = [...importedExercises, ...exercises];
      const uniqueExercises = newExercises.filter(
        (exercise, index, self) =>
          index === self.findIndex((t) => t.id === exercise.id)
      );
      setExercises(uniqueExercises);
      await setItem(StorageKey.EXERCISES, uniqueExercises);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black" />
    );
  }

  if (exercises.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-6 bg-white dark:bg-black">
        <View className="items-center gap-2">
          <Text className="text-xl font-bold text-gray-800 dark:text-white">
            No Exercises Yet
          </Text>
          <Text className="mt-2 text-center text-gray-600 dark:text-gray-300">
            Create your first exercise to get started!
          </Text>
        </View>
        <View className="items-center gap-4">
          <Link href="/exercises/add-exercise" asChild>
            <Pressable className="h-16 w-16 items-center justify-center rounded-full bg-blue-500">
              <Text className="text-3xl font-bold text-white">+</Text>
            </Pressable>
          </Link>
          <Text className="text-center text-gray-600 dark:text-gray-300">
            or
          </Text>
          <TouchableOpacity
            className="flex-row items-center gap-2 rounded-lg bg-blue-500 px-6 py-3"
            onPress={handleImport}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="white"
            />
            <Text className="text-white">Import Exercise Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">
            My Exercises
          </Text>
          <Link href="/exercises/add-exercise" asChild>
            <TouchableOpacity className="items-center justify-center rounded-full bg-blue-500 p-2">
              <Ionicons name="add-outline" size={30} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
        <View className="mt-4 flex-row gap-2">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2"
            onPress={async () => {
              await exportExercises(exercises);
            }}
          >
            <Ionicons
              name="cloud-download-outline"
              size={20}
              color="white"
            />
            <Text className="text-white">Export Exercises</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2"
            onPress={handleImport}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="white"
            />
            <Text className="text-white">Import Exercises</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isSelected={exercise.selected}
            onSelect={handleSelectExercise}
            onDelete={handleDeleteExercise}
          />
        ))}
      </ScrollView>
    </View>
  );
}
