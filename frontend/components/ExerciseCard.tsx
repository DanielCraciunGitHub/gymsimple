import React from "react";
import { ExerciseDetails } from "@/validations";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface ExerciseCardProps {
  exercise: ExerciseDetails;
  isSelected: boolean;
  onSelect: (exercise: ExerciseDetails) => void;
  onDelete: (exercise: ExerciseDetails) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const handleDelete = () => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(exercise),
        },
      ]
    );
  };

  return (
    <View
      className={`mb-6 rounded-lg border-2 p-4 shadow-sm ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      }`}
    >
      {/* Header with selection indicator and delete button */}
      <View className="mb-3 flex-row items-center justify-between">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => onSelect(exercise)}
        >
          <View
            className={`mr-3 h-4 w-4 rounded-full border-2 ${
              isSelected
                ? "border-blue-500 bg-blue-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {isSelected && (
              <View className="h-full w-full rounded-full bg-white" />
            )}
          </View>
          <Text className="text-base font-semibold text-gray-800 dark:text-white">
            {exercise.name}
          </Text>
          {isSelected && exercise.selectionOrder && (
            <View className="ml-2 rounded-full bg-blue-500 px-2 py-1">
              <Text className="text-xs font-bold text-white">
                #{exercise.selectionOrder}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-row gap-2">
          <Link href={`/exercises/add-exercise?id=${exercise.id}`} asChild>
            <TouchableOpacity className="rounded-md bg-gray-500 px-3 py-1">
              <Text className="text-sm font-medium text-white">Edit</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            className="rounded-md bg-red-500 px-3 py-1"
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercise Details */}
      <View className="gap-2">
        <View className="flex-row justify-between">
          <Text className="font-medium text-gray-600 dark:text-gray-300">
            Weight:
          </Text>
          <Text className="text-gray-800 dark:text-white">
            {exercise.weight.value} {exercise.weight.unit}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="font-medium text-gray-600 dark:text-gray-300">
            Sets:
          </Text>
          <Text className="text-gray-800 dark:text-white">
            {exercise.targetSets || "Not set"}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="font-medium text-gray-600 dark:text-gray-300">
            Reps:
          </Text>
          <Text className="text-gray-800 dark:text-white">
            {exercise.targetReps || "Not set"}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="font-medium text-gray-600 dark:text-gray-300">
            Rest:
          </Text>
          <Text className="text-gray-800 dark:text-white">
            {exercise.targetRestTime
              ? `${exercise.targetRestTime}s`
              : "Not set"}
          </Text>
        </View>
      </View>
    </View>
  );
};
