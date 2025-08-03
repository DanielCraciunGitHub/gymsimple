import React, { useCallback, useState } from "react";
import {
  ExerciseDetails,
  exerciseDetailsArraySchema,
} from "@/validations";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { exportFile } from "@/lib/export";
import { importFile } from "@/lib/import";
import { getItem, setItem, StorageKey, getTags } from "@/lib/local-storage";
import { ExerciseCard } from "@/components/ExerciseCard";
import { sortBySelectionOrder } from "@/components/ExerciseInput";

export default function MyExercises() {
  const [exercises, setExercises] = useState<ExerciseDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);

  const loadExercises = async () => {
    try {
      setIsLoading(true);
      const storedExercises = await getItem<ExerciseDetails[]>(
        StorageKey.EXERCISES
      );
      setExercises(storedExercises || []);

      // Load available tags
      const tags = await getTags();
      setAvailableTags(tags);
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

  const handleDeselectAll = async () => {
    const updatedExercises = exercises.map((exercise) => ({
      ...exercise,
      selected: false,
      selectionOrder: undefined,
    }));
    setExercises(updatedExercises);
    await setItem(StorageKey.EXERCISES, updatedExercises);
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => exercise.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSelectAll = () => {
    setExercises(filteredExercises.map((exercise) => ({ ...exercise, selected: true })));
  };

  const handleImport = async () => {
    try {
      const importedExercises = await importFile<ExerciseDetails[]>(
        exerciseDetailsArraySchema
      );
      if (importedExercises) {
        const newExercises = [...importedExercises, ...exercises];
        const uniqueExercises = newExercises.filter(
          (exercise, index, self) =>
            index === self.findIndex((t) => t.id === exercise.id)
        );
        setExercises(uniqueExercises);
        await setItem(StorageKey.EXERCISES, uniqueExercises);
      }
    } catch (error) {
      console.error("Error importing exercises:", error);
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

  const selectedExercises = sortBySelectionOrder(
    exercises.filter((e) => e.selected)
  );

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Overlay to close dropdown */}
      {showTagsDropdown && (
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}
          onPress={() => setShowTagsDropdown(false)}
          activeOpacity={1}
        />
      )}
      
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">
            Select Exercises
          </Text>
          <Link href="/exercises/add-exercise" asChild>
            <TouchableOpacity className="items-center justify-center rounded-full bg-blue-500 p-2">
              <Ionicons name="add-outline" size={30} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
        <View className="relative mt-4">
          <View className="flex-row items-center gap-2">
            <View className="flex-1 relative">
              <TextInput
                placeholder="Search exercises..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              {searchQuery ? (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="absolute right-2 top-2"
                >
                  <Ionicons
                    name="close-outline"
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            
            {/* Tags Dropdown */}
            <TouchableOpacity
              onPress={() => setShowTagsDropdown(!showTagsDropdown)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons 
                  name="pricetag-outline" 
                  size={16} 
                  color={selectedTags.length > 0 ? "#3B82F6" : "gray"} 
                />
                {selectedTags.length > 0 && (
                  <View className="rounded-full bg-blue-500 px-2 py-0.5">
                    <Text className="text-xs font-bold text-white">
                      {selectedTags.length}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Tags Dropdown Content */}
          {showTagsDropdown && (
            <View className="absolute top-12 right-0 z-10 w-52 rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
              <View className="border-b border-gray-200 px-3 py-3 dark:border-gray-600">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Filter Tags
                  </Text>
                  {selectedTags.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSelectedTags([])}
                      className="rounded-md bg-blue-50 px-2 py-1 dark:bg-blue-900/30"
                    >
                      <Text className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        Clear All
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {availableTags.length > 0 ? (
                <ScrollView className="max-h-40" showsVerticalScrollIndicator={true}>
                  {availableTags.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleToggleTag(tag)}
                      className={`mx-2 my-1 flex-row items-center justify-between rounded-md px-3 py-3 ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-50 dark:bg-blue-900/30'
                          : 'bg-transparent hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600'
                      }`}
                      activeOpacity={0.7}
                    >
                      <Text className={`text-sm ${
                        selectedTags.includes(tag)
                          ? 'font-medium text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {tag}
                      </Text>
                      {selectedTags.includes(tag) && (
                        <View className="rounded-full bg-blue-500 p-1">
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View className="px-3 py-6">
                  <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
                    No tags available
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Selected Tags Display */}
        {selectedTags.length > 0 && (
          <View className="mt-2 flex-row flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <Pressable
                key={index}
                onPress={() => handleToggleTag(tag)}
                className="rounded-full bg-blue-500 px-3 py-1"
              >
                <Text className="text-xs font-medium text-white">
                  {tag} ✕
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <View className="mt-4 flex-row justify-between gap-2">
          <TouchableOpacity className="flex-row items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2" onPress={() => handleSelectAll()}>
            <Ionicons name="checkmark-outline" size={20} color="white" />
            <Text className="text-white">Select All</Text>
          </TouchableOpacity>
          <View className="flex-row items-center justify-center gap-2"> 
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2"
            onPress={async () => {
              await exportFile("exercises.json", exercises);
            }}
          >
            <Ionicons
              name="cloud-download-outline"
              size={20}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2"
            onPress={handleImport}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="white"
            />
          </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 py-4"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isSelected={exercise.selected}
            onSelect={handleSelectExercise}
            onDelete={handleDeleteExercise}
          />
        ))}
      </ScrollView>
      {selectedExercises.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-800 dark:text-white">
              Workout Plan
            </Text>
            <TouchableOpacity onPress={handleDeselectAll}>
              <Ionicons
                name="close-circle-outline"
                size={28}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-2"
          >
            {selectedExercises.map((exercise, index) => (
              <View
                key={exercise.id}
                className="mr-4 flex-row items-center gap-2 rounded-full bg-gray-100 p-2 dark:bg-gray-700"
              >
                <View className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                  <Text className="font-bold text-white">{index + 1}</Text>
                </View>
                <Text className="font-medium text-gray-800 dark:text-gray-200">
                  {exercise.name}
                </Text>
              </View>
            ))}
          </ScrollView>
          <Link href="/(sidebar)/(tabs)" asChild>
            <TouchableOpacity className="mt-4 flex-row items-center justify-center gap-2 rounded-lg bg-green-500 py-3">
              <Ionicons name="play" size={20} color="white" />
              <Text className="text-center font-bold text-white">
                Confirm
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
}
