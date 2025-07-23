import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black" />
    );
  }

  if (exercises.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-white dark:bg-black">
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          No Exercises Yet
        </Text>
        <Text className="mt-2 text-center text-gray-600 dark:text-gray-300">
          Create your first exercise to get started!
        </Text>
        <Link href="/exercises/add-exercise" asChild>
          <Pressable className="h-16 w-16 items-center justify-center rounded-full bg-blue-500">
            <Text className="text-3xl font-bold text-white">+</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">
          My Exercises ({exercises.length})
        </Text>
        <Link href="/exercises/add-exercise" asChild>
          <Pressable className="h-8 w-8 items-center justify-center rounded-full bg-blue-500">
            <Text className="text-xl font-bold text-white">+</Text>
          </Pressable>
        </Link>
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
